"use client";

import { useRef, useEffect, useState } from "react";

/* ───────────────────────── Types ───────────────────────── */

interface WaitDot {
  x: number;
  y: number;
}

interface Ripple {
  cx: number;
  cy: number;
  startTime: number;
}

interface Particle {
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  origR: number;
  origG: number;
  origB: number;
  size: number;
  fullSize: number;
  source: "style" | "object";
  dissolveThreshold: number;
  waitGridX: number;
  waitGridY: number;
  formStartX: number;
  formStartY: number;
  formTargetX: number;
  formTargetY: number;
  formTargetR: number;
  formTargetG: number;
  formTargetB: number;
  crystallizeThreshold: number;
}

type Phase = "dissolve" | "arrange" | "wait" | "converge" | "disperse" | "crystallize" | "reveal" | "complete";

/* ──────────────────────── Constants ────────────────────── */

const CELL = 5;
const DISSOLVE_MS = 4500;
const ARRANGE_MS = 2500;
const CONVERGE_MS = 2200;
const DISPERSE_MS = 3000;
const CRYSTALLIZE_MS = 2500;
const REVEAL_MS = 600;
const SMALL = 2;

const WAIT_DOT_SPACING = 20;
const WAIT_DOT_RADIUS = 2.5;
const RIPPLE_SPEED = 250;
const RIPPLE_BANDWIDTH = 45;
const RIPPLE_FADE_DIST = 550;
const AMBIENT_GLOW_RADIUS_FACTOR = 0.4;
const AMBIENT_GLOW_STRENGTH = 0.35;
const CURSOR_GLOW_RADIUS = 130;
const RIPPLE_INTERVAL_MS = 2300;
const BASE_DOT = { r: 200, g: 200, b: 200 };
const ACT_DOT = { r: 0, g: 0, b: 0 };

/* ──────────────────────── Easing ───────────────────────── */

const easeIO2 = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

const easeIO3 = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

const easeIO4 = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - (-2 * t + 2) ** 4 / 2;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─────────────────── Image → Particles ─────────────────── */

function sampleGrid(
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  source: "style" | "object",
): Particle[] {
  const off = document.createElement("canvas");
  const w = Math.ceil(dw);
  const h = Math.ceil(dh);
  off.width = w;
  off.height = h;
  const oc = off.getContext("2d")!;
  oc.drawImage(img, 0, 0, w, h);
  const { data } = oc.getImageData(0, 0, w, h);

  const cols = Math.floor(w / CELL);
  const rows = Math.floor(h / CELL);
  const out: Particle[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = Math.min(col * CELL + (CELL >> 1), w - 1);
      const py = Math.min(row * CELL + (CELL >> 1), h - 1);
      const i = (py * w + px) * 4;
      if (data[i + 3] < 30) continue;

      const gx = dx + col * CELL;
      const gy = dy + row * CELL;
      const nx = col / cols;
      const ny = row / rows;

      const thresh =
        source === "style"
          ? (1 - nx) * 0.7 + ny * 0.08 + Math.random() * 0.15
          : nx * 0.7 + ny * 0.08 + Math.random() * 0.15;

      out.push({
        gridX: gx,
        gridY: gy,
        x: gx,
        y: gy,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        origR: data[i],
        origG: data[i + 1],
        origB: data[i + 2],
        size: CELL,
        fullSize: CELL,
        source,
        dissolveThreshold: Math.min(thresh, 0.92),
        waitGridX: 0,
        waitGridY: 0,
        formStartX: 0,
        formStartY: 0,
        formTargetX: 0,
        formTargetY: 0,
        formTargetR: 0,
        formTargetG: 0,
        formTargetB: 0,
        crystallizeThreshold: 0,
      });
    }
  }
  return out;
}

function sampleOutput(
  img: HTMLImageElement,
  count: number,
  cw: number,
  ch: number,
) {
  const off = document.createElement("canvas");
  const sw = Math.min(img.naturalWidth, 400);
  const sh = Math.min(img.naturalHeight, 400);
  off.width = sw;
  off.height = sh;
  const oc = off.getContext("2d")!;
  oc.drawImage(img, 0, 0, sw, sh);
  const { data } = oc.getImageData(0, 0, sw, sh);

  const aspect = img.naturalWidth / img.naturalHeight;
  let dw: number, dh: number;
  if (aspect > cw / ch) {
    dw = cw * 0.9;
    dh = dw / aspect;
  } else {
    dh = ch * 0.9;
    dw = dh * aspect;
  }
  const ox = (cw - dw) / 2;
  const oy = (ch - dh) / 2;

  // Build grid-aligned cells covering the output image (mirrors sampleGrid)
  const cols = Math.floor(dw / CELL);
  const rows = Math.floor(dh / CELL);
  const cells: { x: number; y: number; r: number; g: number; b: number }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sampleX = Math.min(Math.floor(((col + 0.5) / cols) * sw), sw - 1);
      const sampleY = Math.min(Math.floor(((row + 0.5) / rows) * sh), sh - 1);
      const j = (sampleY * sw + sampleX) * 4;
      cells.push({
        x: ox + col * CELL,
        y: oy + row * CELL,
        r: data[j],
        g: data[j + 1],
        b: data[j + 2],
      });
    }
  }

  // Shuffle (Fisher-Yates) so particles spread across the full image
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const targets: { x: number; y: number; r: number; g: number; b: number }[] = [];
  for (let i = 0; i < count; i++) {
    targets.push(cells[i % cells.length]);
  }
  return targets;
}

/* ──────────────────────── Component ────────────────────── */

interface Props {
  styleRefSrc: string;
  objectRefSrc: string;
  outputSrc: string | null;
  onComplete: () => void;
}

export default function BannerGenerationAnimation({
  styleRefSrc,
  objectRefSrc,
  outputSrc,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const phase = useRef<Phase>("dissolve");
  const t0 = useRef(0);
  const raf = useRef(0);
  const outputReady = useRef(false);
  const done = useRef(false);
  const [ready, setReady] = useState(false);
  const waitDotsRef = useRef<WaitDot[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleTimeRef = useRef(0);
  const mousePosRef = useRef({ x: -9999, y: -9999 });
  const outputImgRef = useRef<HTMLImageElement | null>(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Load images → create particle grid ── */
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;

    const w = rect.width;
    const h = rect.height;
    const gap = 16;
    const half = (w - gap) / 2;

    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    const onLoad = () => {
      if (++loaded < 2) return;
      particles.current = [
        ...sampleGrid(imgs[0], 0, 0, half, h, "style"),
        ...sampleGrid(imgs[1], half + gap, 0, half, h, "object"),
      ];
      t0.current = performance.now();
      setReady(true);
    };
    [styleRefSrc, objectRefSrc].forEach((src, i) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = onLoad;
      im.src = src;
      imgs[i] = im;
    });
  }, [styleRefSrc, objectRefSrc]);

  /* ── 2. Handle output image arriving ── */
  useEffect(() => {
    if (!outputSrc || outputReady.current) return;

    let stopped = false;

    const checkImage = () => {
      if (typeof outputSrc !== "string") return;
      const im = new Image();
      im.crossOrigin = "anonymous";
      
      im.onload = () => {
        if (stopped) return;
        outputImgRef.current = im;
        const cvs = canvasRef.current;
        if (!cvs) return;
        const rect = cvs.getBoundingClientRect();
        const pts = particles.current;
        const targets = sampleOutput(im, pts.length, rect.width, rect.height);

        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);

        pts.forEach((p, i) => {
          const t = targets[i % targets.length];
          p.formTargetX = t.x;
          p.formTargetY = t.y;
          p.formTargetR = t.r;
          p.formTargetG = t.g;
          p.formTargetB = t.b;
          const dx = t.x - cx;
          const dy = t.y - cy;
          p.crystallizeThreshold = Math.min(
            Math.sqrt(dx * dx + dy * dy) / maxDist + Math.random() * 0.1,
            0.92,
          );
        });
        outputReady.current = true;

        if (phase.current === "wait") {
          const now2 = performance.now();
          ripplesRef.current = [
            { cx, cy, startTime: now2 },
            { cx, cy, startTime: now2 + 500 },
            { cx, cy, startTime: now2 + 1000 },
          ];
          phase.current = "converge";
          t0.current = now2;
        }
      };

      im.onerror = () => {
        if (!stopped) {
          // Poll again in 5 seconds if image 404s (generation still running)
          setTimeout(checkImage, 5000);
        }
      };

      // Cache-bust the URL to prevent the browser from caching the 404
      const sep = outputSrc.includes("?") ? "&" : "?";
      im.src = `${outputSrc}${sep}t=${Date.now()}`;
    };

    checkImage();

    return () => {
      stopped = true;
    };
  }, [outputSrc]);

  /* ── 3. Animation loop ── */
  useEffect(() => {
    if (!ready || reducedMotion) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = cvs.width / dpr;
    const h = cvs.height / dpr;

    const tick = (now: number) => {
      const dt = now - t0.current;
      const pts = particles.current;
      const ph = phase.current;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // White background for all phases
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);

      /* ─── DISSOLVE ─── images slowly become pixel grids ─── */
      if (ph === "dissolve") {
        const raw = Math.min(dt / DISSOLVE_MS, 1);

        for (const p of pts) {
          const local = Math.max(
            0,
            Math.min(1, (raw - p.dissolveThreshold * 0.55) / 0.45),
          );
          const e = easeIO2(local);

          p.size = mix(p.fullSize, SMALL, e);
          p.y = p.gridY - e * 1.5;

          ctx.fillStyle = `rgb(${p.origR},${p.origG},${p.origB})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        if (raw >= 1) {
          // Assign each particle to nearest grid slot
          for (const p of pts) {
            p.x = p.gridX;
            p.y = p.gridY - 1.5;
            const col = Math.round(p.gridX / WAIT_DOT_SPACING);
            const row = Math.round(p.gridY / WAIT_DOT_SPACING);
            p.waitGridX = col * WAIT_DOT_SPACING;
            p.waitGridY = row * WAIT_DOT_SPACING;
          }
          phase.current = "arrange";
          t0.current = now;
        }
      }

      /* ─── ARRANGE ─── particles fly to dot grid positions ─── */
      if (ph === "arrange") {
        const raw = Math.min(dt / ARRANGE_MS, 1);
        const e = easeIO3(raw);

        for (const p of pts) {
          const nx = mix(p.gridX, p.waitGridX, e);
          const ny = mix(p.gridY - 1.5, p.waitGridY, e);

          // Color: fade from image color to base dot gray
          const cr = Math.round(mix(p.origR, BASE_DOT.r, e));
          const cg = Math.round(mix(p.origG, BASE_DOT.g, e));
          const cb = Math.round(mix(p.origB, BASE_DOT.b, e));

          p.x = nx;
          p.y = ny;

          ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
          ctx.fillRect(nx, ny, SMALL, SMALL);
        }

        if (raw >= 1) {
          // Lock particles at grid positions with base color
          for (const p of pts) {
            p.x = p.waitGridX;
            p.y = p.waitGridY;
            p.r = BASE_DOT.r;
            p.g = BASE_DOT.g;
            p.b = BASE_DOT.b;
          }

          // Build full-canvas dot grid
          const cols = Math.ceil(w / WAIT_DOT_SPACING) + 1;
          const rows = Math.ceil(h / WAIT_DOT_SPACING) + 1;
          const dots: WaitDot[] = [];
          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              dots.push({ x: col * WAIT_DOT_SPACING, y: row * WAIT_DOT_SPACING });
            }
          }
          waitDotsRef.current = dots;

          if (outputReady.current) {
            // Fire 3 staggered inward ripples for converge (reverse of outward)
            ripplesRef.current = [
              { cx: w / 2, cy: h / 2, startTime: now },
              { cx: w / 2, cy: h / 2, startTime: now + 500 },
              { cx: w / 2, cy: h / 2, startTime: now + 1000 },
            ];
            phase.current = "converge";
          } else {
            // Fire outward ripple for wait
            ripplesRef.current = [{ cx: w / 2, cy: h / 2, startTime: now }];
            lastRippleTimeRef.current = now;
            phase.current = "wait";
          }
          t0.current = now;
        }
      }

      /* ─── WAIT ─── dot grid with ripple brightness wave ─── */
      if (ph === "wait") {
        const cx = w / 2;
        const cy = h / 2;
        const minDim = Math.min(w, h);

        // Auto-fire ripple
        if (now - lastRippleTimeRef.current >= RIPPLE_INTERVAL_MS) {
          lastRippleTimeRef.current = now;
          ripplesRef.current.push({ cx, cy, startTime: now });
        }

        // Expire fully-faded ripples
        ripplesRef.current = ripplesRef.current.filter(
          (rp) =>
            ((now - rp.startTime) / 1000) * RIPPLE_SPEED <
            RIPPLE_FADE_DIST + RIPPLE_BANDWIDTH,
        );

        const mouse = mousePosRef.current;
        const ambientRadius = minDim * AMBIENT_GLOW_RADIUS_FACTOR;

        for (const dot of waitDotsRef.current) {
          const dx = dot.x - cx;
          const dy = dot.y - cy;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);

          // Ambient center glow
          const ambient =
            Math.max(0, 1 - distFromCenter / ambientRadius) *
            AMBIENT_GLOW_STRENGTH;

          // Ripple brightness
          let rippleBright = 0;
          for (const rp of ripplesRef.current) {
            const rippleRadius =
              ((now - rp.startTime) / 1000) * RIPPLE_SPEED;
            const rippleFade = Math.max(
              0,
              1 - rippleRadius / RIPPLE_FADE_DIST,
            );
            const ddx = dot.x - rp.cx;
            const ddy = dot.y - rp.cy;
            const distFromOrigin = Math.sqrt(ddx * ddx + ddy * ddy);
            const ring = Math.max(
              0,
              1 - Math.abs(distFromOrigin - rippleRadius) / RIPPLE_BANDWIDTH,
            );
            rippleBright = Math.max(rippleBright, ring * rippleFade);
          }

          // Cursor proximity
          let cursorBright = 0;
          if (mouse.x > -1000) {
            const cdx = dot.x - mouse.x;
            const cdy = dot.y - mouse.y;
            const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy);
            const cf = Math.max(0, 1 - cursorDist / CURSOR_GLOW_RADIUS);
            cursorBright = cf * cf;
          }

          const brightness = Math.min(
            1,
            Math.max(ambient, rippleBright, cursorBright),
          );

          const r = Math.round(
            BASE_DOT.r + (ACT_DOT.r - BASE_DOT.r) * brightness,
          );
          const g = Math.round(
            BASE_DOT.g + (ACT_DOT.g - BASE_DOT.g) * brightness,
          );
          const b = Math.round(
            BASE_DOT.b + (ACT_DOT.b - BASE_DOT.b) * brightness,
          );

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, WAIT_DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ─── CONVERGE ─── dot grid with INWARD ripples (reverse of WAIT) ─── */
      if (ph === "converge") {
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.sqrt(cx * cx + cy * cy);

        // Expire collapsed ripples
        ripplesRef.current = ripplesRef.current.filter((rp) => {
          if (now < rp.startTime) return true;
          return maxR - ((now - rp.startTime) / 1000) * RIPPLE_SPEED > -RIPPLE_BANDWIDTH;
        });

        for (const dot of waitDotsRef.current) {
          const ddx = dot.x - cx;
          const ddy = dot.y - cy;
          const distFromCenter = Math.sqrt(ddx * ddx + ddy * ddy);

          let rippleBright = 0;
          for (const rp of ripplesRef.current) {
            if (now < rp.startTime) continue;
            const elapsed = (now - rp.startTime) / 1000;
            const rippleRadius = maxR - elapsed * RIPPLE_SPEED;
            const rippleFade = Math.max(0, rippleRadius / maxR);
            const ring = Math.max(
              0,
              1 - Math.abs(distFromCenter - rippleRadius) / RIPPLE_BANDWIDTH,
            );
            rippleBright = Math.max(rippleBright, ring * rippleFade);
          }

          const brightness = Math.min(1, rippleBright);
          const r = Math.round(BASE_DOT.r + (ACT_DOT.r - BASE_DOT.r) * brightness);
          const g = Math.round(BASE_DOT.g + (ACT_DOT.g - BASE_DOT.g) * brightness);
          const b = Math.round(BASE_DOT.b + (ACT_DOT.b - BASE_DOT.b) * brightness);

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, WAIT_DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }

        if (dt >= CONVERGE_MS) {
          for (const p of pts) {
            p.formStartX = p.waitGridX;
            p.formStartY = p.waitGridY;
            p.r = BASE_DOT.r;
            p.g = BASE_DOT.g;
            p.b = BASE_DOT.b;
          }
          phase.current = "disperse";
          t0.current = now;
        }
      }

      /* ─── DISPERSE ─── dots peel from grid → particles (reverse of ARRANGE) ─── */
      if (ph === "disperse") {
        const raw = Math.min(dt / DISPERSE_MS, 1);
        const halfW = w / 2;
        const halfH = h / 2;
        const maxDist = Math.sqrt(halfW * halfW + halfH * halfH);

        // 1. Draw the fading dot grid behind everything
        const gridOpacity = Math.max(0, 1 - raw * 1.5);
        if (gridOpacity > 0) {
          ctx.globalAlpha = gridOpacity;
          for (const dot of waitDotsRef.current) {
            ctx.fillStyle = `rgb(${BASE_DOT.r},${BASE_DOT.g},${BASE_DOT.b})`;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, WAIT_DOT_RADIUS, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

        // 2. Draw particles with staggered departure (center leaves first)
        for (const p of pts) {
          const dx = p.formStartX - halfW;
          const dy = p.formStartY - halfH;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const delay = (dist / maxDist) * 0.35;
          const localRaw = Math.max(0, Math.min(1, (raw - delay) / (1 - delay)));
          const e = easeIO3(localRaw);

          const nx = mix(p.formStartX, p.formTargetX, e);
          const ny = mix(p.formStartY, p.formTargetY, e);
          const nr = Math.round(mix(BASE_DOT.r, p.formTargetR, e));
          const ng = Math.round(mix(BASE_DOT.g, p.formTargetG, e));
          const nb = Math.round(mix(BASE_DOT.b, p.formTargetB, e));

          ctx.fillStyle = `rgb(${nr},${ng},${nb})`;
          ctx.fillRect(nx, ny, SMALL, SMALL);
        }

        if (raw >= 1) {
          phase.current = "crystallize";
          t0.current = now;
        }
      }

      /* ─── CRYSTALLIZE ─── particles → pixels (reverse of DISSOLVE) ─── */
      if (ph === "crystallize") {
        const raw = Math.min(dt / CRYSTALLIZE_MS, 1);

        for (const p of pts) {
          const local = Math.max(
            0,
            Math.min(1, (raw - p.crystallizeThreshold * 0.55) / 0.45),
          );
          const e = easeIO2(local);

          const sz = mix(SMALL, CELL, e);
          const yOffset = (1 - e) * 1.5;

          ctx.fillStyle = `rgb(${p.formTargetR},${p.formTargetG},${p.formTargetB})`;
          ctx.fillRect(p.formTargetX, p.formTargetY - yOffset, sz, sz);
        }

        if (raw >= 1) {
          phase.current = "reveal";
          t0.current = now;
        }
      }

      /* ─── REVEAL ─── pixel grid crossfades to actual image ─── */
      if (ph === "reveal") {
        const raw = Math.min(dt / REVEAL_MS, 1);
        const e = easeIO2(raw);

        const img = outputImgRef.current;
        if (img) {
          const aspect = img.naturalWidth / img.naturalHeight;
          let dw: number, dh: number;
          if (aspect > w / h) { dw = w * 0.9; dh = dw / aspect; }
          else { dh = h * 0.9; dw = dh * aspect; }
          const ox = (w - dw) / 2;
          const oy = (h - dh) / 2;

          ctx.globalAlpha = e;
          ctx.drawImage(img, ox, oy, dw, dh);
          ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1 - e;
        for (const p of pts) {
          ctx.fillStyle = `rgb(${p.formTargetR},${p.formTargetG},${p.formTargetB})`;
          ctx.fillRect(p.formTargetX, p.formTargetY, CELL, CELL);
        }
        ctx.globalAlpha = 1;

        if (raw >= 1 && !done.current) {
          done.current = true;
          phase.current = "complete";

          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, w, h);
          if (img) {
            const aspect = img.naturalWidth / img.naturalHeight;
            let dw: number, dh: number;
            if (aspect > w / h) { dw = w * 0.9; dh = dw / aspect; }
            else { dh = h * 0.9; dw = dh * aspect; }
            ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
          }
          ctx.restore();
          onComplete();
          return;
        }
      }

      /* ─── COMPLETE ─── static final frame (actual image) ─── */
      if (ph === "complete") {
        const img = outputImgRef.current;
        if (img) {
          const aspect = img.naturalWidth / img.naturalHeight;
          let dw: number, dh: number;
          if (aspect > w / h) { dw = w * 0.9; dh = dw / aspect; }
          else { dh = h * 0.9; dw = dh * aspect; }
          ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        }
        ctx.restore();
        return;
      }

      ctx.restore();
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ready, reducedMotion, onComplete]);

  /* ── 4. Mouse interaction ── */
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs || !ready) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mousePosRef.current = { x: -9999, y: -9999 };
    };

    const onClick = (e: MouseEvent) => {
      if (phase.current !== "wait") return;
      const rect = cvs.getBoundingClientRect();
      ripplesRef.current.push({
        cx: e.clientX - rect.left,
        cy: e.clientY - rect.top,
        startTime: performance.now(),
      });
    };

    cvs.addEventListener("mousemove", onMouseMove);
    cvs.addEventListener("mouseleave", onMouseLeave);
    cvs.addEventListener("click", onClick);
    return () => {
      cvs.removeEventListener("mousemove", onMouseMove);
      cvs.removeEventListener("mouseleave", onMouseLeave);
      cvs.removeEventListener("click", onClick);
    };
  }, [ready]);

  /* ── Render ── */
  if (reducedMotion) {
    return (
      <div className="w-full h-[320px] border-[3px] border-black bg-[#f8f8f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin" />
          <span className="font-bold uppercase tracking-widest text-sm">
            Generating...
          </span>
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
      style={{ height: 320 }}
    />
  );
}
