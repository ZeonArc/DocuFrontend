"use client";

import React, { useMemo, CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// ─── GitHub design tokens ────────────────────────────────────────────────────
const GH = {
  // Page
  pageBg: "#0d1117",
  pageText: "#e6edf3",
  pageMuted: "#7d8590",
  pageSubtle: "#161b22",
  pageBorder: "#30363d",
  pageBorderMuted: "#21262d",
  // Content area (README box — light mode, as GitHub renders it)
  contentBg: "#ffffff",
  contentBorder: "#d0d7de",
  contentText: "#1f2328",
  contentMuted: "#656d76",
  contentLink: "#0969da",
  contentCodeBg: "#f6f8fa",
  contentCodeBorder: "#d0d7de",
  contentBlockquote: "#57606a",
  contentTableStripe: "#f6f8fa",
  contentHr: "#d0d7de",
  contentH1H2Border: "#d0d7de",
  // File header
  fileHeaderBg: "#f6f8fa",
  // Button (dark page)
  btnBg: "rgba(240,246,252,0.1)",
  btnBorder: "#30363d",
  btnText: "#c9d1d9",
  // Specific
  greenBadge: "#1a7f37",
  yellowBadge: "#9a6700",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const ghFont: CSSProperties = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
};
const monoFont: CSSProperties = {
  fontFamily:
    "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
};

// ─── Octicon SVG (GitHub logo) — pointerEvents:none prevents SVG crosshair ───
const OcticonMark = () => (
  <svg height="32" viewBox="0 0 16 16" width="32" fill="#e6edf3" style={{ pointerEvents: "none" }}>
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.26-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface GitHubPreviewProps {
  markdown: string;
  repoOwner?: string;
  repoName?: string;
}

export default React.memo(function GitHubPreview({
  markdown,
  repoOwner = "username",
  repoName = "your-repo",
}: GitHubPreviewProps) {
  const lineCount = markdown.split("\n").length;
  const bytes = useMemo(() => new TextEncoder().encode(markdown).length, [markdown]);
  const fileSize =
    bytes < 1024 ? `${bytes} Bytes` : `${(bytes / 1024).toFixed(2)} KB`;

  // ── Markdown component overrides (pixel-accurate GitHub styles) ──────────
  const components: React.ComponentProps<typeof ReactMarkdown>["components"] = {
    // ── Headings ──
    h1: ({ node: _node, ...props }) => (
      <h1
        style={{
          ...ghFont,
          fontSize: "2em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          paddingBottom: "0.3em",
          borderBottom: `1px solid ${GH.contentH1H2Border}`,
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    h2: ({ node: _node, ...props }) => (
      <h2
        style={{
          ...ghFont,
          fontSize: "1.5em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          paddingBottom: "0.3em",
          borderBottom: `1px solid ${GH.contentH1H2Border}`,
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    h3: ({ node: _node, ...props }) => (
      <h3
        style={{
          ...ghFont,
          fontSize: "1.25em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    h4: ({ node: _node, ...props }) => (
      <h4
        style={{
          ...ghFont,
          fontSize: "1em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    h5: ({ node: _node, ...props }) => (
      <h5
        style={{
          ...ghFont,
          fontSize: "0.875em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    h6: ({ node: _node, ...props }) => (
      <h6
        style={{
          ...ghFont,
          fontSize: "0.85em",
          fontWeight: 600,
          lineHeight: 1.25,
          marginTop: "24px",
          marginBottom: "16px",
          color: GH.contentMuted,
        }}
        {...props}
      />
    ),

    // ── Paragraph ──
    p: ({ node: _node, children, ...props }) => {
      // Check if this paragraph contains only image(s) — render as block
      const childArr = React.Children.toArray(children);
      const onlyImages = childArr.every(
        (c) => React.isValidElement(c) && (c as React.ReactElement).type === "img"
      );
      return (
        <p
          style={{
            ...ghFont,
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "16px",
            lineHeight: "1.5",
            color: GH.contentText,
            ...(onlyImages ? { textAlign: "center" } : {}),
          }}
          {...props}
        >
          {children}
        </p>
      );
    },

    // ── Links ──
    a: ({ node: _node, ...props }) => (
      <a
        style={{
          color: GH.contentLink,
          textDecoration: "none",
          ...ghFont,
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLAnchorElement).style.textDecoration = "none")
        }
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    // ── Images (badges, gifs, banners, star charts, screenshots) ──
    img: ({ node: _node, src, alt, ...props }) => {
      const isBadge =
        typeof src === "string" &&
        (src.includes("shields.io") ||
          src.includes("badge") ||
          src.includes("img.shields") ||
          src.includes("badgen.net") ||
          src.includes("forthebadge.com") ||
          (alt && alt.toLowerCase().includes("badge")));

      if (isBadge) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              maxWidth: "100%",
              height: "auto",
              margin: "0 2px 4px 0",
              backgroundColor: "transparent",
            }}
            {...props}
          />
        );
      }

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            display: "inline-block",
            maxWidth: "100%",
            boxSizing: "content-box",
            backgroundColor: GH.contentBg,
            margin: "4px",
            borderRadius: "6px",
          }}
          {...props}
        />
      );
    },

    // ── Code (inline) ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ node: _node, className, children, ...props }: any) => {
      const inline = !String(className || "").startsWith("language-");
      const match = /language-(\w+)/.exec(className || "");
      const lang = match?.[1]?.toLowerCase();

      if (!inline) {
        return (
          <div
            style={{
              position: "relative",
              marginBottom: "16px",
            }}
          >
            {lang && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  fontSize: "12px",
                  color: GH.contentMuted,
                  ...monoFont,
                  userSelect: "none",
                }}
              >
                {lang}
              </div>
            )}
            <pre
              style={{
                padding: "16px",
                overflowX: "auto",
                fontSize: "85%",
                lineHeight: "1.45",
                color: GH.contentText,
                backgroundColor: GH.contentCodeBg,
                borderRadius: "6px",
                border: `1px solid ${GH.contentCodeBorder}`,
                marginTop: 0,
                marginBottom: 0,
                wordWrap: "normal",
                ...monoFont,
                cursor: "inherit",
              }}
            >
              <code
                style={{
                  backgroundColor: "transparent",
                  padding: 0,
                  margin: 0,
                  fontSize: "100%",
                  wordBreak: "normal",
                  whiteSpace: "pre",
                  overflow: "visible",
                  lineHeight: "inherit",
                  ...monoFont,
                  cursor: "inherit",
                }}
              >
                {children}
              </code>
            </pre>
          </div>
        );
      }

      return (
        <code
          style={{
            padding: "0.2em 0.4em",
            margin: 0,
            fontSize: "85%",
            whiteSpace: "break-spaces",
            backgroundColor: "rgba(175,184,193,0.2)",
            borderRadius: "6px",
            ...monoFont,
            color: GH.contentText,
            cursor: "inherit",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },

    // ── Pre (wraps block code — handled above in code) ──
    pre: ({ node: _node, children, ..._props }) => (
      <>{children}</>
    ),

    // ── Blockquote ──
    blockquote: ({ node: _node, ...props }) => (
      <blockquote
        style={{
          margin: "0 0 16px",
          padding: "0 1em",
          color: GH.contentBlockquote,
          borderLeft: `0.25em solid ${GH.contentH1H2Border}`,
          ...ghFont,
        }}
        {...props}
      />
    ),

    // ── Lists ──
    ul: ({ node: _node, ...props }) => (
      <ul
        style={{
          marginTop: 0,
          marginBottom: "16px",
          paddingLeft: "2em",
          listStyleType: "disc",
          ...ghFont,
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    ol: ({ node: _node, ...props }) => (
      <ol
        style={{
          marginTop: 0,
          marginBottom: "16px",
          paddingLeft: "2em",
          listStyleType: "decimal",
          ...ghFont,
          color: GH.contentText,
        }}
        {...props}
      />
    ),
    li: ({ node: _node, ...props }) => (
      <li
        style={{
          marginTop: "0.25em",
          ...ghFont,
          color: GH.contentText,
          fontSize: "16px",
          lineHeight: "1.5",
        }}
        {...props}
      />
    ),

    // ── Table ──
    table: ({ node: _node, ...props }) => (
      <div style={{ overflowX: "auto", marginBottom: "16px" }}>
        <table
          style={{
            borderSpacing: 0,
            borderCollapse: "collapse",
            display: "table",
            width: "100%",
            ...ghFont,
          }}
          {...props}
        />
      </div>
    ),
    thead: ({ node: _node, ...props }) => (
      <thead
        style={{
          backgroundColor: GH.contentCodeBg,
        }}
        {...props}
      />
    ),
    tbody: ({ node: _node, ...props }) => <tbody {...props} />,
    tr: ({ node: _node, ...props }) => (
      <tr
        style={{
          backgroundColor: GH.contentBg,
          borderTop: `1px solid ${GH.contentTableStripe}`,
        }}
        {...props}
      />
    ),
    th: ({ node: _node, ...props }) => (
      <th
        style={{
          padding: "6px 13px",
          border: `1px solid ${GH.contentBorder}`,
          fontWeight: 600,
          color: GH.contentText,
          ...ghFont,
          fontSize: "16px",
          textAlign: "left",
        }}
        {...props}
      />
    ),
    td: ({ node: _node, ...props }) => {
      // Strip deprecated HTML attributes — all-contributors HTML uses
      // <td align="center" valign="top"> which React rejects as unknown DOM props.
      const { align: _align, vAlign: _vAlign, ...rest } = props as typeof props & { align?: string; vAlign?: string };
      return (
        <td
          style={{
            padding: "6px 13px",
            border: `1px solid ${GH.contentBorder}`,
            color: GH.contentText,
            ...ghFont,
            fontSize: "16px",
            lineHeight: "1.5",
            textAlign: "left",
            verticalAlign: "top",
          }}
          {...rest}
        />
      );
    },

    // ── Horizontal Rule ──
    hr: () => (
      <hr
        style={{
          backgroundColor: GH.contentHr,
          border: 0,
          height: "0.25em",
          margin: "24px 0",
          padding: 0,
        }}
      />
    ),

    // ── Strong / Em ──
    strong: ({ node: _node, ...props }) => (
      <strong style={{ fontWeight: 600, color: GH.contentText }} {...props} />
    ),
    em: ({ node: _node, ...props }) => (
      <em style={{ fontStyle: "italic", color: GH.contentText }} {...props} />
    ),

    // ── Details / Summary (Product Showcase toggle) ──
    details: ({ node: _node, ...props }) => (
      <details style={{ marginBottom: "16px" }} {...props} />
    ),
    summary: ({ node: _node, ...props }) => (
      <summary style={{ cursor: "var(--cursor-pointer)", userSelect: "none" }} {...props} />
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ node: _node, align, ...props }: any) => (
      <div style={{ textAlign: align || undefined }} {...props} />
    ),
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: GH.pageBg,
        cursor: "inherit",  // prevents SVG/browser defaults from showing crosshair
        ...ghFont,
      }}
    >
      {/* ── GitHub Dark Nav Bar ── */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: GH.pageSubtle,
          borderBottom: `1px solid ${GH.pageBorder}`,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <OcticonMark />

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}>
          <a
            href={`https://github.com/${repoOwner}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: GH.pageText, fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
          >
            {repoOwner}
          </a>
          <span style={{ color: GH.pageMuted }}>/</span>
          <a
            href={`https://github.com/${repoOwner}/${repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: GH.pageText, fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
          >
            {repoName}
          </a>
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Repo action buttons (visual only) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[
            { label: "Watch", count: "2" },
            { label: "Fork", count: "14" },
            { label: "Star", count: "128" },
          ].map(({ label, count }) => (
            <button
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                backgroundColor: GH.btnBg,
                border: `1px solid ${GH.btnBorder}`,
                borderRadius: "6px",
                color: GH.btnText,
                fontSize: "12px",
                fontWeight: 600,
                cursor: "var(--cursor-not-allowed)",
                ...ghFont,
              }}
            >
              <span>{label}</span>
              <span
                style={{
                  padding: "0 6px",
                  backgroundColor: "rgba(110,118,129,0.1)",
                  border: `1px solid ${GH.btnBorder}`,
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: GH.pageText,
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: GH.pageBg,
          borderBottom: `1px solid ${GH.pageBorder}`,
          padding: "0 16px",
          display: "flex",
          gap: "0",
          overflowX: "auto",
        }}
      >
        {[
          { label: "Code", active: true },
          { label: "Issues", badge: "3" },
          { label: "Pull requests", badge: "1" },
          { label: "Actions" },
          { label: "Settings" },
        ].map(({ label, active, badge }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "12px 16px",
              fontSize: "14px",
              color: active ? GH.pageText : GH.pageMuted,
              borderBottom: active
                ? "2px solid #f78166"
                : "2px solid transparent",
              cursor: "var(--cursor-not-allowed)",
              whiteSpace: "nowrap",
              fontWeight: active ? 600 : 400,
              ...ghFont,
            }}
          >
            {label}
            {badge && (
              <span
                style={{
                  padding: "0 6px",
                  backgroundColor: "rgba(110,118,129,0.1)",
                  border: `1px solid ${GH.pageBorderMuted}`,
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: GH.pageMuted,
                }}
              >
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Scrollable Content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: GH.pageBg,
          padding: "16px",
        }}
      >
        {/* ── README File Box ── */}
        <div
          style={{
            border: `1px solid ${GH.pageBorder}`,
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: GH.contentBg,
          }}
        >
          {/* File Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              backgroundColor: GH.fileHeaderBg,
              borderBottom: `1px solid ${GH.contentBorder}`,
              gap: "12px",
            }}
          >
            {/* Left: file icon + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* README file icon (SVG) */}
              <svg
                height="16"
                viewBox="0 0 16 16"
                width="16"
                fill={GH.contentMuted}
                style={{ pointerEvents: "none" }}
              >
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 8.75 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
              </svg>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: GH.contentText,
                  ...ghFont,
                }}
              >
                README.md
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: GH.contentMuted,
                  ...ghFont,
                }}
              >
                {lineCount.toLocaleString()} lines
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: GH.contentMuted,
                  ...ghFont,
                }}
              >
                ({fileSize})
              </span>
            </div>

            {/* Right: action buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {["Raw", "Copy raw", "Download"].map((btn) => (
                <button
                  key={btn}
                  style={{
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: GH.contentText,
                    backgroundColor: "transparent",
                    border: `1px solid ${GH.contentBorder}`,
                    borderRadius: "6px",
                    cursor: "var(--cursor-not-allowed)",
                    ...ghFont,
                    lineHeight: "20px",
                  }}
                >
                  {btn}
                </button>
              ))}
              {/* Pencil edit icon */}
              <button
                style={{
                  padding: "4px 8px",
                  backgroundColor: "transparent",
                  border: `1px solid ${GH.contentBorder}`,
                  borderRadius: "6px",
                  cursor: "var(--cursor-not-allowed)",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Edit file"
              >
                <svg height="16" viewBox="0 0 16 16" width="16" fill={GH.contentMuted} style={{ pointerEvents: "none" }}>
                  <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.609Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── README Rendered Content ── */}
          <div
            style={{
              padding: "32px",
              backgroundColor: GH.contentBg,
              color: GH.contentText,
              fontSize: "16px",
              lineHeight: "1.5",
              userSelect: "text",
              cursor: "var(--cursor-text)",
              ...ghFont,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

        {/* ── Footer padding ── */}
        <div style={{ height: "32px" }} />
      </div>
    </div>
  );
});
