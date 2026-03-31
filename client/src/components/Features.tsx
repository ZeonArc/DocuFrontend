"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FEATURES_TYPOGRAPHY as CONFIG } from "@/config/sections";
import { useImageSequence } from "@/hooks/useImageSequence";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statSectionRef = useRef<HTMLElement>(null);
  const codeIntelSectionRef = useRef<HTMLElement>(null);
  const assetGenSectionRef = useRef<HTMLElement>(null);
  const statsCanvasRef = useRef<HTMLCanvasElement>(null);
  const codeIntelCanvasRef = useRef<HTMLCanvasElement>(null);
  const assetGenCanvasRef = useRef<HTMLCanvasElement>(null);

  const { drawAtProgress: drawStatsFrame } = useImageSequence(statsCanvasRef, {
    basePath: "/frames/75-percent",
    frameCount: 130,
  });
  const { drawAtProgress: drawCodeIntelFrame } = useImageSequence(codeIntelCanvasRef, {
    basePath: "/frames/contextual-code-intelligence",
    frameCount: 130,
  });
  const { drawAtProgress: drawAssetGenFrame } = useImageSequence(assetGenCanvasRef, {
    basePath: "/frames/asset-generation-with-google-flow",
    frameCount: 146,
  });

  const drawStatsRef = useRef(drawStatsFrame);
  const drawCodeIntelRef = useRef(drawCodeIntelFrame);
  const drawAssetGenRef = useRef(drawAssetGenFrame);

  useEffect(() => {
    drawStatsRef.current = drawStatsFrame;
  }, [drawStatsFrame]);
  useEffect(() => {
    drawCodeIntelRef.current = drawCodeIntelFrame;
  }, [drawCodeIntelFrame]);
  useEffect(() => {
    drawAssetGenRef.current = drawAssetGenFrame;
  }, [drawAssetGenFrame]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timelines: gsap.core.Timeline[] = [];
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // ============================
      // Sub-section 1: Stats / 75%
      // ============================
      if (statSectionRef.current) {
        const statParagraphs =
          statSectionRef.current.querySelectorAll(".stats-body-text");
        const statSplit = new SplitText(statParagraphs, { type: "words" });
        splits.push(statSplit);

        const prefixEl =
          statSectionRef.current.querySelector(".stats-prefix-text");
        if (prefixEl) {
          gsap.set(prefixEl, { opacity: 0, filter: "blur(20px)", y: 10 });
        }

        const statPercentEl =
          statSectionRef.current.querySelector(".stat-percent");
        if (statPercentEl) {
          statPercentEl.textContent = "0%";
          gsap.set(statPercentEl, { opacity: 0, filter: "blur(20px)", y: 10 });
        }

        const descEl =
          statSectionRef.current.querySelector(".stats-description-text");
        if (descEl) {
          gsap.set(descEl, { opacity: 0, filter: "blur(20px)", y: 10 });
        }

        const STATS_TITLE_WAIT = 2.5;
        const STATS_END_BUFFER = 2;

        const statTl = gsap.timeline({
          scrollTrigger: {
            trigger: statSectionRef.current,
            start: "top top",
            end: "+=500%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onEnter: () => {
              const titleEls = [prefixEl, statPercentEl, descEl].filter(Boolean);
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onEnterBack: () => {
              const titleEls = [prefixEl, statPercentEl, descEl].filter(Boolean);
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onLeaveBack: () => {
              if (prefixEl) {
                gsap.set(prefixEl, { opacity: 0, filter: "blur(20px)", y: 10 });
              }
              if (statPercentEl) {
                statPercentEl.textContent = "0%";
                gsap.set(statPercentEl, { opacity: 0, filter: "blur(20px)", y: 10 });
              }
              if (descEl) {
                gsap.set(descEl, { opacity: 0, filter: "blur(20px)", y: 10 });
              }
              drawStatsRef.current(0);
            },
            onUpdate: (self) => {
              const tlDur = statTl.duration();
              if (tlDur === 0) return;
              const wordStartFraction = STATS_TITLE_WAIT / tlDur;
              const wordEndFraction = (tlDur - STATS_END_BUFFER) / tlDur;
              if (self.progress <= wordStartFraction) {
                drawStatsRef.current(0);
              } else if (self.progress >= wordEndFraction) {
                drawStatsRef.current(1);
              } else {
                const wordProgress = (self.progress - wordStartFraction) / (wordEndFraction - wordStartFraction);
                drawStatsRef.current(Math.min(wordProgress, 1));
              }
            },
          },
        });
        timelines.push(statTl);

        statTl.from(statSplit.words, {
          opacity: 0,
          y: 50,
          ease: "back(4)",
          stagger: { each: 0.15, from: "start" },
        }, STATS_TITLE_WAIT);

        // Counter: scroll-controlled 0→75%, synced with word reveal
        if (statPercentEl) {
          const wordAnimDuration = 0.5 + Math.max(0, statSplit.words.length - 1) * 0.15;
          const counterObj = { val: 0 };
          statTl.to(counterObj, {
            val: 75,
            duration: wordAnimDuration,
            ease: "none",
            onUpdate: () => {
              statPercentEl.textContent = Math.ceil(counterObj.val) + "%";
            },
          }, STATS_TITLE_WAIT);
        }

        // Exit buffer: section stays pinned with all animations complete
        statTl.to({}, { duration: STATS_END_BUFFER });
      }

      // ============================
      // Sub-section 2: Contextual Code Intelligence
      // ============================
      if (codeIntelSectionRef.current) {
        const codeIntelParagraphs =
          codeIntelSectionRef.current.querySelectorAll(".code-intel-body-text");
        const codeIntelSplit = new SplitText(codeIntelParagraphs, {
          type: "words",
        });
        splits.push(codeIntelSplit);

        const codeIntelTitleEls =
          codeIntelSectionRef.current.querySelectorAll(".code-intel-title-anim");
        if (codeIntelTitleEls.length > 0) {
          gsap.set(codeIntelTitleEls, { opacity: 0, filter: "blur(20px)", y: 10 });
        }

        const CODE_INTEL_TITLE_WAIT = 1.5;
        const CODE_INTEL_END_BUFFER = 2;

        const codeIntelTl = gsap.timeline({
          scrollTrigger: {
            trigger: codeIntelSectionRef.current,
            start: "top top",
            end: "+=500%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onEnter: () => {
              const titleEls =
                codeIntelSectionRef.current!.querySelectorAll(".code-intel-title-anim");
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onEnterBack: () => {
              const titleEls =
                codeIntelSectionRef.current!.querySelectorAll(".code-intel-title-anim");
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onLeaveBack: () => {
              const titleEls =
                codeIntelSectionRef.current!.querySelectorAll(".code-intel-title-anim");
              if (titleEls.length > 0) {
                gsap.set(titleEls, { opacity: 0, filter: "blur(20px)", y: 10 });
              }
              drawCodeIntelRef.current(0);
            },
            onUpdate: (self) => {
              const tlDur = codeIntelTl.duration();
              if (tlDur === 0) return;
              const wordStartFraction = CODE_INTEL_TITLE_WAIT / tlDur;
              const wordEndFraction = (tlDur - CODE_INTEL_END_BUFFER) / tlDur;
              if (self.progress <= wordStartFraction) {
                drawCodeIntelRef.current(0);
              } else if (self.progress >= wordEndFraction) {
                drawCodeIntelRef.current(1);
              } else {
                const wordProgress = (self.progress - wordStartFraction) / (wordEndFraction - wordStartFraction);
                drawCodeIntelRef.current(Math.min(wordProgress, 1));
              }
            },
          },
        });
        timelines.push(codeIntelTl);

        codeIntelTl.from(codeIntelSplit.words, {
          opacity: 0,
          y: 50,
          ease: "back(4)",
          stagger: { each: 0.15, from: "start" },
        }, CODE_INTEL_TITLE_WAIT);

        // Exit buffer: section stays pinned with all animations complete
        codeIntelTl.to({}, { duration: CODE_INTEL_END_BUFFER });
      }

      // ============================
      // Sub-section 3: Asset Generation
      // ============================
      if (assetGenSectionRef.current) {
        const assetGenParagraphs =
          assetGenSectionRef.current.querySelectorAll(".asset-gen-body-text");
        const assetGenSplit = new SplitText(assetGenParagraphs, {
          type: "words",
        });
        splits.push(assetGenSplit);

        const assetGenTitleEls =
          assetGenSectionRef.current.querySelectorAll(".asset-gen-title-anim");
        if (assetGenTitleEls.length > 0) {
          gsap.set(assetGenTitleEls, { opacity: 0, filter: "blur(20px)", y: 10 });
        }

        const ASSET_GEN_TITLE_WAIT = 1.5;
        const ASSET_GEN_END_BUFFER = 2;

        const assetGenTl = gsap.timeline({
          scrollTrigger: {
            trigger: assetGenSectionRef.current,
            start: "top top",
            end: "+=500%",
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onEnter: () => {
              const titleEls =
                assetGenSectionRef.current!.querySelectorAll(".asset-gen-title-anim");
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onEnterBack: () => {
              const titleEls =
                assetGenSectionRef.current!.querySelectorAll(".asset-gen-title-anim");
              if (titleEls.length > 0) {
                gsap.to(titleEls, {
                  opacity: 1, filter: "blur(0px)", y: 0,
                  duration: 1, delay: 0.4, ease: "power2.out",
                });
              }
            },
            onLeaveBack: () => {
              const titleEls =
                assetGenSectionRef.current!.querySelectorAll(".asset-gen-title-anim");
              if (titleEls.length > 0) {
                gsap.set(titleEls, { opacity: 0, filter: "blur(20px)", y: 10 });
              }
              drawAssetGenRef.current(0);
            },
            onUpdate: (self) => {
              const tlDur = assetGenTl.duration();
              if (tlDur === 0) return;
              const wordStartFraction = ASSET_GEN_TITLE_WAIT / tlDur;
              const wordEndFraction = (tlDur - ASSET_GEN_END_BUFFER) / tlDur;
              if (self.progress <= wordStartFraction) {
                drawAssetGenRef.current(0);
              } else if (self.progress >= wordEndFraction) {
                drawAssetGenRef.current(1);
              } else {
                const wordProgress = (self.progress - wordStartFraction) / (wordEndFraction - wordStartFraction);
                drawAssetGenRef.current(Math.min(wordProgress, 1));
              }
            },
          },
        });
        timelines.push(assetGenTl);

        assetGenTl.from(assetGenSplit.words, {
          opacity: 0,
          y: 50,
          ease: "back(4)",
          stagger: { each: 0.15, from: "start" },
        }, ASSET_GEN_TITLE_WAIT);

        // Exit buffer: section stays pinned with all animations complete
        assetGenTl.to({}, { duration: ASSET_GEN_END_BUFFER });
      }
    }, containerRef);

    return () => {
      timelines.forEach((tl) => tl.kill());
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  const stats = CONFIG.stats;
  const codeIntel = CONFIG.codeIntelligence;
  const assetGen = CONFIG.assetGeneration;
  const videos = CONFIG.videos;

  return (
    <div id="features" ref={containerRef} className="w-full">
      {/* Section 1: Cat / Stats */}
      <section
        ref={statSectionRef}
        className="stat-section feature-section w-full min-h-screen flex flex-col md:flex-row"
      >
        {/* Left: Canvas (Light Grey) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f2f2f2] overflow-hidden relative">
          <canvas
            ref={statsCanvasRef}
            className="w-full h-full"
            style={{
              objectFit: 'contain',
              transform: `translateY(${videos.stats.offsetY}px) scale(${videos.stats.scale})`,
            }}
          />
        </div>
        {/* Right: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center"
          style={{ backgroundColor: stats.container.backgroundColor }}
        >
          <div className="animate-item">
            <p
              className="responsive-text stats-prefix-text"
              style={{
                "--fs-mobile": stats.prefixText.fontSizeMobile,
                "--fs-desktop": stats.prefixText.fontSizeDesktop,
                fontFamily: stats.prefixText.fontFamily,
                fontWeight: stats.prefixText.fontWeight,
                color: stats.prefixText.color,
                marginBottom: stats.prefixText.marginBottom,
                textAlign: stats.prefixText.textAlign,
                transform: `translate(${stats.prefixText.xOffset}px, ${stats.prefixText.yOffset}px)`,
              } as React.CSSProperties}
            >
              You can save nearly
            </p>
            <h2
              className="responsive-text stat-percent"
              style={{
                "--fs-mobile": stats.statNumber.fontSizeMobile,
                "--fs-desktop": stats.statNumber.fontSizeDesktop,
                fontFamily: stats.statNumber.fontFamily,
                fontWeight: stats.statNumber.fontWeight,
                color: stats.statNumber.color,
                marginBottom: stats.statNumber.marginBottom,
                textAlign: stats.statNumber.textAlign,
                transform: `translate(${stats.statNumber.xOffset}px, ${stats.statNumber.yOffset}px)`,
              } as React.CSSProperties}
            >
              75%
            </h2>
            <p
              className="responsive-text stats-description-text"
              style={{
                "--fs-mobile": stats.description.fontSizeMobile,
                "--fs-desktop": stats.description.fontSizeDesktop,
                fontFamily: stats.description.fontFamily,
                fontWeight: stats.description.fontWeight,
                color: stats.description.color,
                marginBottom: stats.description.marginBottom,
                textAlign: stats.description.textAlign,
                transform: `translate(${stats.description.xOffset}px, ${stats.description.yOffset}px)`,
              } as React.CSSProperties}
            >
              powered by our unique Intelligent Repository Parsing & One-Click
              Deployment
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: stats.bodyText.gap,
                transform: `translate(${stats.bodyText.xOffset}px, ${stats.bodyText.yOffset}px)`,
                width: stats.bodyText.width,
                height: stats.bodyText.height,
                paddingLeft: `${stats.bodyText.paddingLeft}px`,
                paddingRight: `${stats.bodyText.paddingRight}px`,
              } as React.CSSProperties}
            >
              <p
                className="responsive-text leading-relaxed stats-body-text"
                style={{
                  "--fs-mobile": stats.bodyText.fontSizeMobile,
                  "--fs-desktop": stats.bodyText.fontSizeDesktop,
                  fontFamily: stats.bodyText.fontFamily,
                  fontWeight: stats.bodyText.fontWeight,
                  color: stats.bodyText.color,
                  lineHeight: stats.bodyText.lineHeight,
                  opacity: stats.bodyText.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
                Lorem consequat dolor irure reprehenderit irure dolore. Labore
                fugiat adipisicing sunt aute do ex nulla mollit. Ipsum consequat
                ex sunt. Voluptate proident irure occaecat deserunt sit ut
                excepteur qui occaecat do fugiat. Laboris ut ut dolor ullamco.
              </p>
              <p
                className="responsive-text leading-relaxed stats-body-text"
                style={{
                  "--fs-mobile": stats.bodyText.fontSizeMobile,
                  "--fs-desktop": stats.bodyText.fontSizeDesktop,
                  fontFamily: stats.bodyText.fontFamily,
                  fontWeight: stats.bodyText.fontWeight,
                  color: stats.bodyText.color,
                  lineHeight: stats.bodyText.lineHeight,
                  opacity: stats.bodyText.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
                Nostrud tempor eu laborum exercitation proident mollit proident
                dolor. Ipsum ullamco Lorem consequat. Incididunt officia ipsum
                amet sunt commodo cupidatat ea exercitation occaecat veniam.
                Laborum tempor cupidatat est qui aute dolore nisi quis est
                nostrud. Do commodo sit labore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Contextual Code Intelligence (Wizard) */}
      <section
        ref={codeIntelSectionRef}
        className="feature-section code-intel-section w-full min-h-screen flex flex-col md:flex-row"
      >
        {/* Left: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center order-2 md:order-1"
          style={{ backgroundColor: codeIntel.container.backgroundColor }}
        >
          <div className="animate-item">
            <div className="code-intel-title-anim">
              <h2
                className="responsive-text"
                style={{
                  "--fs-mobile": codeIntel.heading.fontSizeMobile,
                  "--fs-desktop": codeIntel.heading.fontSizeDesktop,
                  fontFamily: codeIntel.heading.fontFamily,
                  fontWeight: codeIntel.heading.fontWeight,
                  color: codeIntel.heading.color,
                  marginBottom: codeIntel.heading.marginBottom,
                  transform: `translate(${codeIntel.heading.xOffset}px, ${codeIntel.heading.yOffset}px)`,
                } as React.CSSProperties}
              >
                Contextual Code
              </h2>
              <h3
                className="responsive-text"
                style={{
                  "--fs-mobile": codeIntel.accent.fontSizeMobile,
                  "--fs-desktop": codeIntel.accent.fontSizeDesktop,
                  fontFamily: codeIntel.accent.fontFamily,
                  fontStyle: codeIntel.accent.fontStyle,
                  color: codeIntel.accent.color,
                  marginBottom: codeIntel.accent.marginBottom,
                  transform: `translate(${codeIntel.accent.xOffset}px, ${codeIntel.accent.yOffset}px)`,
                } as React.CSSProperties}
              >
                Intelligence
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: codeIntel.body.gap,
                transform: `translate(${codeIntel.body.xOffset}px, ${codeIntel.body.yOffset}px)`,
                width: codeIntel.body.width,
                height: codeIntel.body.height,
                paddingLeft: `${codeIntel.body.paddingLeft}px`,
                paddingRight: `${codeIntel.body.paddingRight}px`,
              } as React.CSSProperties}
            >
              <p
                className="responsive-text leading-relaxed code-intel-body-text"
                style={{
                  "--fs-mobile": codeIntel.body.fontSizeMobile,
                  "--fs-desktop": codeIntel.body.fontSizeDesktop,
                  fontFamily: codeIntel.body.fontFamily,
                  fontWeight: codeIntel.body.fontWeight,
                  color: codeIntel.body.color,
                  lineHeight: codeIntel.body.lineHeight,
                  opacity: codeIntel.body.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id
                Lorem consequat dolor irure reprehenderit irure dolore. Labore
                fugiat adipisicing sunt aute do ex nulla mollit. Ipsum consequat
                ex sunt. Voluptate proident irure occaecat deserunt sit ut
                excepteur qui occaecat do fugiat. Laboris ut ut dolor ullamco.
              </p>
              <p
                className="responsive-text leading-relaxed code-intel-body-text"
                style={{
                  "--fs-mobile": codeIntel.body.fontSizeMobile,
                  "--fs-desktop": codeIntel.body.fontSizeDesktop,
                  fontFamily: codeIntel.body.fontFamily,
                  fontWeight: codeIntel.body.fontWeight,
                  color: codeIntel.body.color,
                  lineHeight: codeIntel.body.lineHeight,
                  opacity: codeIntel.body.opacity,
                  textAlign: "justify",
                } as React.CSSProperties}
              >
                Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
                Nostrud tempor eu laborum exercitation proident mollit proident
                dolor. Ipsum ullamco Lorem consequat. Incididunt officia ipsum
                amet sunt commodo cupidatat ea exercitation occaecat veniam.
                Laborum tempor cupidatat est qui aute dolore nisi quis est
                nostrud. Do commodo sit labore.
              </p>
            </div>
          </div>
        </div>
        {/* Right: Canvas (White) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white overflow-hidden order-1 md:order-2 relative">
          <canvas
            ref={codeIntelCanvasRef}
            className="w-full h-full"
            style={{
              objectFit: 'contain',
              transform: `translateY(${videos.codeIntelligence.offsetY}px) scale(${videos.codeIntelligence.scale})`,
            }}
          />
        </div>
      </section>

      {/* Section 3: Asset Generation */}
      <section
        ref={assetGenSectionRef}
        className="feature-section asset-gen-section w-full min-h-screen flex flex-col md:flex-row"
      >
        {/* Left: Canvas (Light Grey) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f2f2f2] overflow-hidden relative">
          <canvas
            ref={assetGenCanvasRef}
            className="w-full h-full"
            style={{
              objectFit: 'contain',
              transform: `translateY(${videos.assetGeneration.offsetY}px) scale(${videos.assetGeneration.scale})`,
            }}
          />
        </div>
        {/* Right: Text (Gray) */}
        <div
          className="w-full md:w-1/2 p-12 flex flex-col justify-center"
          style={{ backgroundColor: assetGen.container.backgroundColor }}
        >
          <div className="animate-item">
            <div className="asset-gen-title-anim">
              <h2
                className="responsive-text"
                style={{
                  "--fs-mobile": assetGen.heading.fontSizeMobile,
                  "--fs-desktop": assetGen.heading.fontSizeDesktop,
                  fontFamily: assetGen.heading.fontFamily,
                  fontWeight: assetGen.heading.fontWeight,
                  color: assetGen.heading.color,
                  marginBottom: assetGen.heading.marginBottom,
                  textAlign: assetGen.heading.textAlign,
                  transform: `translate(${assetGen.heading.xOffset}px, ${assetGen.heading.yOffset}px)`,
                } as React.CSSProperties}
              >
                Asset Generation
              </h2>
              <h3
                className="responsive-text"
                style={{
                  "--fs-mobile": assetGen.accent.fontSizeMobile,
                  "--fs-desktop": assetGen.accent.fontSizeDesktop,
                  fontFamily: assetGen.accent.fontFamily,
                  fontStyle: assetGen.accent.fontStyle,
                  color: assetGen.accent.color,
                  marginBottom: assetGen.accent.marginBottom,
                  textAlign: assetGen.accent.textAlign,
                  transform: `translate(${assetGen.accent.xOffset}px, ${assetGen.accent.yOffset}px)`,
                } as React.CSSProperties}
              >
                with Google Flow
              </h3>
            </div>
            <p
              className="responsive-text leading-relaxed asset-gen-body-text"
              style={{
                "--fs-mobile": assetGen.body.fontSizeMobile,
                "--fs-desktop": assetGen.body.fontSizeDesktop,
                fontFamily: assetGen.body.fontFamily,
                fontWeight: assetGen.body.fontWeight,
                color: assetGen.body.color,
                lineHeight: assetGen.body.lineHeight,
                marginBottom: assetGen.body.marginBottom,
                transform: `translate(${assetGen.body.xOffset}px, ${assetGen.body.yOffset}px)`,
                width: assetGen.body.width,
                height: assetGen.body.height,
                textAlign: "justify",
                paddingLeft: `${assetGen.body.paddingLeft}px`,
                paddingRight: `${assetGen.body.paddingRight}px`,
              } as React.CSSProperties}
            >
              Dolor et duis nostrud elit ea. Labore et adipisicing ex. Id Lorem
              cor et duis nostrud elit ea. Labore et adipisicing ex. Id Lorem
              consequat dolor irure reprehenderit irure dolore. Dolor et duis
              nostrud elit ea. Labore et adipisicing ex. Id Lorem consequat dolor
              irure reprehenderit irure dolore. Labore fugiat adipisicing sunt
              aute do ex nulla mollit. Ipsum consequat ex sunt. Voluptate
              proident irure occaecat deserunt sit ut excepteur qui occaecat do
              fugiat. Laboris ut ut dolor ullamco.
            </p>
            <p
              className="responsive-text leading-relaxed asset-gen-body-text"
              style={{
                "--fs-mobile": assetGen.mutedBody.fontSizeMobile,
                "--fs-desktop": assetGen.mutedBody.fontSizeDesktop,
                fontFamily: assetGen.mutedBody.fontFamily,
                fontWeight: assetGen.mutedBody.fontWeight,
                color: assetGen.mutedBody.color,
                lineHeight: assetGen.mutedBody.lineHeight,
                transform: `translate(${assetGen.mutedBody.xOffset}px, ${assetGen.mutedBody.yOffset}px)`,
                width: assetGen.mutedBody.width,
                height: assetGen.mutedBody.height,
                textAlign: "justify",
                paddingLeft: `${assetGen.mutedBody.paddingLeft}px`,
                paddingRight: `${assetGen.mutedBody.paddingRight}px`,
              } as React.CSSProperties}
            >
              Sint eiusmod excepteur mollit fugiat quis laborum voluptate.
              Nostrud tempor eu laborum exercitation proident mollit proident
              dolor. Ipsum ullamco Lorem consequat. Incididunt officia ipsum amet
              sunt commodo cupidatat ea exercitation occaecat veniam. Laborum
              tempor cupidatat est qui aute dolore nisi quis est nostrud. Do
              commodo sit labore.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
