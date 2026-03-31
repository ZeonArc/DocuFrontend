"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import GitHubPreview from "@/components/GitHubPreview";
import { useSession } from "@/hooks/useSession";
import { sendChatMessage, pushToGitHub } from "@/lib/api";
import {
  Bold, Italic,
  List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3,
  Github, LayoutDashboard, MessageSquarePlus,
  X, Send, Sparkles, Paperclip, ChevronDown
} from "lucide-react";

// Static tool definitions live outside the component so the linter never
// traces a render-phase ref access through them.
const TOOLBAR_TOOLS: { icon: React.ReactNode; label: string; prefix: string; suffix: string }[] = [
  { icon: <Heading1 className="w-5 h-5" />,    label: "H1",           prefix: "# ",         suffix: "" },
  { icon: <Heading2 className="w-5 h-5" />,    label: "H2",           prefix: "## ",        suffix: "" },
  { icon: <Heading3 className="w-5 h-5" />,    label: "H3",           prefix: "### ",       suffix: "" },
  { icon: <Bold className="w-5 h-5" />,         label: "Bold",         prefix: "**",         suffix: "**" },
  { icon: <Italic className="w-5 h-5" />,       label: "Italic",       prefix: "*",          suffix: "*" },
  { icon: <Quote className="w-5 h-5" />,        label: "Quote",        prefix: "> ",         suffix: "" },
  { icon: <Code className="w-5 h-5" />,         label: "Code",         prefix: "\n```\n",    suffix: "\n```\n" },
  { icon: <List className="w-5 h-5" />,         label: "Bullet List",  prefix: "- ",         suffix: "" },
  { icon: <ListOrdered className="w-5 h-5" />,  label: "Numbered List",prefix: "1. ",        suffix: "" },
];

type Comment = {
  id: string;
  selectedText: string;
  sectionContext: string;
  note: string;
};

type Attachment = {
  selectedText: string;
  sectionContext: string;
  note: string;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;         // user's typed message shown in the bubble
  fullPayload?: string; // compiled text for the AI backend (includes all notes)
  attachments?: Attachment[];
};

type SelectionPopup = {
  // Fixed viewport coordinates
  viewportX: number;
  viewportY: number;
  text: string;
  context: string;
  note: string;
} | null;

export default function EditorPage() {
  const [markdown, setMarkdown] = useState(`# Project Title

A brief description of what this project does and who it's for.

## Features

- Feature 1: Lightning fast performance
- Feature 2: Neo-Brutalist UI
- Feature 3: AI-powered generated content

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

\`\`\`javascript
import { myProject } from 'my-project'

myProject.init({
  theme: 'brutalist',
  awesomeness: true
})
\`\`\`
`);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hi! Select any text in the preview to attach it as a comment, then describe what you'd like to change." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [attachedComments, setAttachedComments] = useState<Comment[]>([]);
  const [selectionPopup, setSelectionPopup] = useState<SelectionPopup>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const { sessionId } = useSession();

  useEffect(() => {
    const saved = localStorage.getItem("docugithub_readme");
    if (saved) setMarkdown(saved);
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus chat input when opened
  useEffect(() => {
    if (isChatOpen && !isMinimized) {
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  }, [isChatOpen, isMinimized]);

  const insertText = useCallback((prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    const defaultText = (start === end && suffix) ? "text" : selectedText;
    const newText = text.substring(0, start) + prefix + defaultText + suffix + text.substring(end);
    setMarkdown(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
    }, 0);
  }, []);

  const handleToolClick = useCallback((prefix: string, suffix: string) => {
    insertText(prefix, suffix);
  }, [insertText]);

  // Detect text selection in preview pane via document-level mouseup
  // This avoids timing issues with React re-renders and works regardless of scroll
  useEffect(() => {
    const handleDocMouseUp = (e: MouseEvent) => {
      // Only act if mouse was released inside the preview pane
      if (!previewRef.current?.contains(e.target as Node)) return;

      // Small defer so browser finalises the selection range first
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const selectedText = selection.toString().trim();
        if (selectedText.length < 5) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Nearest heading above selection = section context
        let sectionContext = "General";
        if (previewRef.current) {
          previewRef.current.querySelectorAll("h1, h2, h3").forEach((heading) => {
            const hRect = heading.getBoundingClientRect();
            if (hRect.top <= rect.top) {
              sectionContext = heading.textContent?.trim() || "General";
            }
          });
        }

        // Store viewport-relative position so the popup renders correctly
        // regardless of any CSS transform on ancestor elements
        setSelectionPopup({
          viewportX: rect.left + rect.width / 2,
          viewportY: rect.top,
          text: selectedText,
          context: sectionContext,
          note: "",
        });
      }, 0);
    };

    // Dismiss popup only when clicking outside BOTH the preview AND the popup itself.
    // React's synthetic stopPropagation() does NOT stop native document listeners,
    // so we must check the target here instead of relying on stopPropagation.
    const handleDocMouseDown = (e: MouseEvent) => {
      const inPreview = previewRef.current?.contains(e.target as Node);
      const inPopup = popupRef.current?.contains(e.target as Node);
      if (!inPreview && !inPopup) {
        setSelectionPopup(null);
      }
    };

    document.addEventListener("mouseup", handleDocMouseUp);
    document.addEventListener("mousedown", handleDocMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleDocMouseUp);
      document.removeEventListener("mousedown", handleDocMouseDown);
    };
  }, []);

  const attachSelectionToChat = () => {
    if (!selectionPopup) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      selectedText: selectionPopup.text,
      sectionContext: selectionPopup.context,
      note: selectionPopup.note,
    };
    setAttachedComments(prev => [...prev, comment]);
    setSelectionPopup(null);
    window.getSelection()?.removeAllRanges();
    // Always open + expand chat when attaching
    setIsChatOpen(true);
    setIsMinimized(false);
  };

  const removeAttachment = (id: string) => {
    setAttachedComments(prev => prev.filter(c => c.id !== id));
  };

  const sendMessage = () => {
    if (!chatInput.trim() && attachedComments.length === 0) return;

    // Build the full compiled payload that will be sent to the AI backend.
    // Includes the user's message + every attachment's selected text and note.
    const attachments: Attachment[] = attachedComments.map(c => ({
      selectedText: c.selectedText,
      sectionContext: c.sectionContext,
      note: c.note,
    }));

    let fullPayload = chatInput.trim();
    if (attachments.length > 0) {
      const sectionBlock = attachments
        .map((a, i) => {
          const lines = [
            `[${i + 1}] Section: ${a.sectionContext}`,
            `    Quote: "${a.selectedText}"`,
          ];
          if (a.note.trim()) lines.push(`    Request: ${a.note.trim()}`);
          return lines.join("\n");
        })
        .join("\n\n");
      fullPayload = fullPayload
        ? `${fullPayload}\n\n--- Section Edit Requests ---\n${sectionBlock}`
        : `--- Section Edit Requests ---\n${sectionBlock}`;
    }

    const newMsg: ChatMessage = {
      role: "user",
      text: chatInput.trim() || (attachments.length > 0 ? "Section edit requests (see attached)" : ""),
      fullPayload,
      attachments,
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setAttachedComments([]);

    if (sessionId) {
      const sectionCtx = attachments.length > 0
        ? attachments.map(a => a.sectionContext).join(",")
        : "general";

      sendChatMessage(sessionId, fullPayload, markdown, sectionCtx)
        .then((res) => {
          if (res.revised_readme) {
            setMarkdown(res.revised_readme);
            localStorage.setItem("docugithub_readme", res.revised_readme);
            setChatMessages(prev => [...prev, {
              role: "ai" as const,
              text: `README updated! (v${res.version ?? "new"})`,
            }]);
          } else {
            setChatMessages(prev => [...prev, {
              role: "ai" as const,
              text: res.message || "Processed, but no README update received.",
            }]);
          }
        })
        .catch((err) => {
          setChatMessages(prev => [...prev, {
            role: "ai" as const,
            text: `Error: ${err instanceof Error ? err.message : "Request failed"}`,
          }]);
        });
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const text = el.value;
      const linesBefore = text.substring(0, start).split("\n");
      const currentLine = linesBefore[linesBefore.length - 1];

      // Bullet list match: "- " or "* "
      const bulletMatch = currentLine.match(/^(\s*[-*]\s+)(.*)/);
      // Numbered list match: "1. "
      const numberMatch = currentLine.match(/^(\s*(\d+)\.\s+)(.*)/);

      if (bulletMatch) {
        e.preventDefault();
        const [, marker] = bulletMatch;
        const nextMarker = `\n${marker}`;
        const newText = text.substring(0, start) + nextMarker + text.substring(start);
        setMarkdown(newText);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + nextMarker.length, start + nextMarker.length);
        }, 0);
        return;
      }

      if (numberMatch) {
        e.preventDefault();
        const [, , numStr] = numberMatch;
        const nextNum = parseInt(numStr) + 1;
        const nextMarker = `\n${nextNum}. `;
        const newText = text.substring(0, start) + nextMarker + text.substring(start);
        setMarkdown(newText);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start + nextMarker.length, start + nextMarker.length);
        }, 0);
        return;
      }
    }

    if (e.key === "Backspace") {
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (start !== end) return; // Don't interfere with selection deletion

      const text = el.value;
      const linesBefore = text.substring(0, start).split("\n");
      const currentLine = linesBefore[linesBefore.length - 1];

      // If current line is just a list marker, remove it
      const bulletMatch = currentLine.match(/^(\s*[-*]\s+)$/);
      const numberMatch = currentLine.match(/^(\s*\d+\.\s+)$/);

      if (bulletMatch || numberMatch) {
        e.preventDefault();
        const newText = text.substring(0, start - currentLine.length) + text.substring(start);
        setMarkdown(newText);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start - currentLine.length, start - currentLine.length);
        }, 0);
      }
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#f2f2f2] text-black font-body flex flex-col overflow-hidden pt-[100px] px-4 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col border-[3px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white overflow-hidden relative"
      >
        {/* Editor Header Bar */}
        <header className="flex-none h-20 border-b-[3px] border-black bg-white px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#e0e0e0] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <LayoutDashboard className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-comic font-black uppercase tracking-tight leading-none text-black">README.md</h1>
              <p className="text-sm font-handwritten italic text-zinc-600 mt-1">DocuGithub Workspace</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Suggest Edits button — replaces Save Draft */}
            <button
              onClick={() => { setIsChatOpen(true); setIsMinimized(false); }}
              className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-black font-header font-bold uppercase tracking-wide text-black hover:bg-[#f2f2f2] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              data-cursor="pointer"
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>Suggest Edits</span>
            </button>
            <button
              onClick={async () => {
                if (!sessionId) return;
                if (!confirm("This will update README.md in your repository. Continue?")) return;
                try {
                  const res = await pushToGitHub(sessionId, markdown);
                  alert(res.commit_url ? `Pushed! View commit: ${res.commit_url}` : "README pushed successfully!");
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Push failed");
                }
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-black border-2 border-black font-header font-bold uppercase tracking-wide text-white hover:bg-zinc-800 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none"
              data-cursor="pointer"
            >
              <Github className="w-5 h-5" />
              <span>Push to GitHub</span>
            </button>
          </div>
        </header>

        {/* Main Two-Pane Area */}
        <main className="flex-1 flex overflow-hidden">

          {/* Left Pane: Editor */}
          <section className="w-1/2 flex flex-col border-r-[3px] border-black bg-[#f8f8f8]">

            {/* Tools Bar */}
            <div className="flex-none flex items-center px-4 py-3 border-b-2 border-black bg-white overflow-x-auto no-scrollbar gap-2">
              {TOOLBAR_TOOLS.map((tool, idx) => (
                <button
                  key={idx}
                  className="p-2 border-2 border-transparent hover:border-black hover:bg-[#f2f2f2] text-black transition-all rounded-none bg-transparent"
                  title={tool.label}
                  onClick={() => handleToolClick(tool.prefix, tool.suffix)}
                  data-cursor="pointer"
                  type="button"
                >
                  {tool.icon}
                </button>
              ))}
            </div>

            {/* Text Area */}
            <div className="flex-1 p-0 overflow-hidden relative group">
                <Textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  className="w-full h-full bg-transparent border-none text-black font-mono text-base leading-relaxed resize-none focus-visible:ring-0 p-6 selection:bg-black selection:text-white"
                  placeholder="Start typing your markdown here..."
                  spellCheck={false}
                  data-cursor="text"
                />
            </div>

            {/* Editor Footer Status */}
            <div className="flex-none px-6 py-3 border-t-2 border-black text-sm font-bold uppercase tracking-wider text-black flex justify-between bg-[#e0e0e0]">
              <span>Markdown Supported</span>
              <span>{markdown.length} CHR</span>
            </div>
          </section>

          {/* Right Pane: GitHub Preview */}
          <section
            className="w-1/2 flex flex-col overflow-hidden relative cursor-default"
            ref={previewRef}
          >
            {/* GitHub-accurate preview — fills the pane, scrolls internally */}
            <div className="flex-1 overflow-hidden">
              <GitHubPreview markdown={markdown} />
            </div>
          </section>

        </main>
      </motion.div>

      {/* ── Selection Popup (fixed viewport position — outside motion.div transforms) ── */}
      <AnimatePresence>
        {selectionPopup && (
          <motion.div
            key="selection-popup"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            ref={popupRef as React.RefObject<HTMLDivElement>}
            className="z-[9999] bg-white border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col"
            style={{
              position: "fixed",
              left: selectionPopup.viewportX,
              top: selectionPopup.viewportY,
              transform: "translateX(-50%) translateY(calc(-100% - 12px))",
              width: "320px",
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between px-3 py-2 bg-black text-white">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-header font-bold uppercase tracking-widest truncate max-w-[200px]">
                  {selectionPopup.context}
                </span>
              </div>
              <button
                className="hover:text-zinc-400 transition-colors shrink-0"
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setSelectionPopup(null); }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Selected text preview */}
            <div className="px-3 pt-2.5 pb-1.5 border-b border-zinc-200">
              <p className="text-xs font-mono text-zinc-500 leading-snug line-clamp-2 italic">
                &ldquo;{selectionPopup.text.length > 120 ? selectionPopup.text.slice(0, 120) + "…" : selectionPopup.text}&rdquo;
              </p>
            </div>

            {/* Note input */}
            <div className="px-3 pt-2 pb-2.5">
              <textarea
                autoFocus
                value={selectionPopup.note}
                onChange={(e) =>
                  setSelectionPopup((prev) => prev ? { ...prev, note: e.target.value } : null)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    attachSelectionToChat();
                  }
                  if (e.key === "Escape") setSelectionPopup(null);
                }}
                placeholder="Describe what change you want here…"
                rows={2}
                className="w-full resize-none border-2 border-black px-2.5 py-2 text-sm font-body text-black placeholder:text-zinc-400 focus:outline-none bg-[#f8f8f8] leading-snug"
              />
            </div>

            {/* Add to Chat button */}
            <div className="px-3 pb-3">
              <button
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); attachSelectionToChat(); }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white font-header font-bold uppercase tracking-wide text-xs border-2 border-black hover:bg-zinc-800 transition-colors shadow-[3px_3px_0px_rgba(0,0,0,0.25)] active:translate-y-0.5 active:shadow-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add to Chat</span>
              </button>
            </div>

            {/* Arrow pointing down */}
            <div
              className="absolute left-1/2 -bottom-[9px] w-4 h-4 bg-white border-r-[3px] border-b-[3px] border-black"
              style={{ transform: "translateX(-50%) rotate(45deg)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chatbot Panel (bottom-right) ── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[100] w-[380px] flex flex-col border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]"
            style={{ maxHeight: isMinimized ? "auto" : "520px" }}
          >
            {/* Chat Header */}
            <div className="flex-none flex items-center justify-between px-4 py-3 bg-black text-white border-b-[3px] border-black">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-header font-bold uppercase tracking-wide text-sm">Suggest Edits</span>
                {attachedComments.length > 0 && (
                  <span className="bg-white text-black text-xs font-bold px-2 py-0.5 border border-white">
                    {attachedComments.length} attached
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(v => !v)}
                  className="hover:text-zinc-300 transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? "rotate-180" : ""}`} />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  key="chat-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col overflow-hidden"
                  style={{ maxHeight: "460px" }}
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px] max-h-[260px]">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {/* Attachments shown above user message */}
                        {msg.role === "user" && msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-col gap-1.5 w-full items-end">
                            {msg.attachments.map((a, ai) => (
                              <div key={ai} className="flex flex-col bg-[#f2f2f2] border border-black px-2 py-1.5 max-w-[92%] gap-0.5">
                                <div className="flex items-center gap-1.5">
                                  <Paperclip className="w-3 h-3 shrink-0 text-zinc-400" />
                                  <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{a.sectionContext}</span>
                                </div>
                                <p className="text-xs font-mono text-zinc-600 leading-tight line-clamp-2 pl-4">
                                  &ldquo;{a.selectedText.length > 80 ? a.selectedText.slice(0, 80) + "…" : a.selectedText}&rdquo;
                                </p>
                                {a.note && (
                                  <p className="text-xs font-body text-black leading-snug pl-4 pt-0.5 border-t border-zinc-300 mt-0.5">
                                    {a.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`px-3 py-2 text-sm font-body max-w-[85%] border-2 border-black ${
                          msg.role === "user"
                            ? "bg-black text-white shadow-[3px_3px_0px_rgba(0,0,0,0.3)]"
                            : "bg-[#f2f2f2] text-black shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Attached comments preview */}
                  {attachedComments.length > 0 && (
                    <div className="px-4 py-2 border-t-2 border-black bg-[#fffbeb] flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Attached sections</span>
                      {attachedComments.map(c => (
                        <div key={c.id} className="flex items-start gap-2 bg-white border border-black px-2 py-1">
                          <Paperclip className="w-3 h-3 shrink-0 mt-0.5 text-zinc-500" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{c.sectionContext}</span>
                            <p className="text-xs font-mono text-black leading-tight truncate">&ldquo;{c.selectedText}&rdquo;</p>
                          </div>
                          <button
                            onClick={() => removeAttachment(c.id)}
                            className="shrink-0 hover:text-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex-none border-t-2 border-black p-3 bg-white">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={chatInputRef}
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={handleChatKeyDown}
                        placeholder="Describe your edits… (Enter to send)"
                        rows={2}
                        className="flex-1 resize-none border-2 border-black px-3 py-2 text-sm font-body text-black placeholder:text-zinc-400 focus:outline-none focus:border-black bg-[#f8f8f8]"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!chatInput.trim() && attachedComments.length === 0}
                        className="shrink-0 w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5 active:shadow-none"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
