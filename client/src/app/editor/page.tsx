"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Bold, Italic, Link, Image as ImageIcon, 
  List, ListOrdered, Quote, Code, 
  Heading1, Heading2, Heading3, 
  Github, LayoutDashboard, Save
} from "lucide-react";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);
    
    // Provide default text if empty selection but wrapper needed
    const defaultText = (start === end && suffix) ? "text" : selectedText;
    
    const newText = text.substring(0, start) + prefix + defaultText + suffix + text.substring(end);
    setMarkdown(newText);
    
    // Focus and select text after state updates
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
    }, 0);
  };

  const tools = [
    { icon: <Heading1 className="w-5 h-5" />, label: "H1", action: () => insertText("# ", "") },
    { icon: <Heading2 className="w-5 h-5" />, label: "H2", action: () => insertText("## ", "") },
    { icon: <Heading3 className="w-5 h-5" />, label: "H3", action: () => insertText("### ", "") },
    { icon: <Bold className="w-5 h-5" />, label: "Bold", action: () => insertText("**", "**") },
    { icon: <Italic className="w-5 h-5" />, label: "Italic", action: () => insertText("*", "*") },
    { icon: <Quote className="w-5 h-5" />, label: "Quote", action: () => insertText("> ", "") },
    { icon: <Code className="w-5 h-5" />, label: "Code", action: () => insertText("\n```\n", "\n```\n") },
    { icon: <Link className="w-5 h-5" />, label: "Link", action: () => insertText("[", "](url)") },
    { icon: <ImageIcon className="w-5 h-5" />, label: "Image", action: () => insertText("![alt text](", "image.jpg)") },
    { icon: <List className="w-5 h-5" />, label: "Bullet List", action: () => insertText("- ", "") },
    { icon: <ListOrdered className="w-5 h-5" />, label: "Numbered List", action: () => insertText("1. ", "") },
  ];

  return (
    <div className="h-[100dvh] w-full bg-[#f2f2f2] text-black font-body flex flex-col overflow-hidden pt-[100px] px-4 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12">
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like ease
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
          <button 
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-black font-header font-bold uppercase tracking-wide text-black hover:bg-[#f2f2f2] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            data-cursor="pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save Draft</span>
          </button>
          <button 
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
            {tools.map((tool, idx) => (
              <button 
                key={idx} 
                className="p-2 border-2 border-transparent hover:border-black hover:bg-[#f2f2f2] text-black transition-all rounded-none bg-transparent"
                title={tool.label}
                onClick={tool.action}
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

        {/* Right Pane: Preview */}
        <section className="w-1/2 flex flex-col bg-white relative overflow-hidden">
          
          {/* Preview Header */}
          <div className="flex-none px-6 py-3 border-b-2 border-black bg-[#f2f2f2] flex items-center justify-between relative z-10">
             <div className="flex items-center space-x-3">
               <span className="w-3 h-3 rounded-full bg-black border border-black animate-pulse shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"></span>
               <h2 className="text-sm font-header font-bold uppercase tracking-widest text-black">Live Preview</h2>
             </div>
             <span className="text-sm font-bold uppercase border-2 border-black px-3 py-1 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] text-black">GitHub Style Rendering</span>
          </div>

          {/* Rendered Markdown Area (Brutalist styling simulating our exact aesthetic) */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-0">
             {/* Subtle dot pattern background for preview */}
             <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 max-w-none text-black font-body"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-5xl font-comic font-black mb-6 mt-8 first:mt-0 text-black uppercase tracking-tight border-b-4 border-black pb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-3xl font-header font-bold uppercase tracking-wide mt-12 mb-6 text-black pb-2 border-b-2 border-black inline-block pr-8" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-header font-bold uppercase tracking-wide mt-8 mb-4 text-black" {...props} />,
                  p: ({node, ...props}) => {
                    // Check if paragraph contains only an image, if so don't style it like text
                    if (node?.children?.length === 1 && node.children[0].type === 'element' && node.children[0].tagName === 'img') {
                      return <div className="mb-8" {...props} />;
                    }
                    return <p className="mb-6 text-black text-xl leading-relaxed" {...props} />;
                  },
                  ul: ({node, ...props}) => <ul className="list-none pl-0 mb-8 space-y-3 text-black text-lg" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-8 space-y-3 text-black text-lg font-bold" {...props} />,
                  li: ({node, ...props}: any) => (
                    <li className="flex items-start gap-3 relative" {...props}>
                      {/* For unordered lists, we add our custom brutalist bullet. For ordered lists, the list-decimal handles it but we lose the square bullet. */}
                      {node?.parent?.type === 'element' && node.parent.tagName === 'ul' && (
                        <span className="w-3 h-3 bg-black shrink-0 mt-[8px]"></span>
                      )}
                      <span className="font-normal">{props.children}</span>
                    </li>
                  ),
                  a: ({node, ...props}) => <a className="font-bold underline decoration-2 underline-offset-4 hover:bg-black hover:text-white transition-colors px-1" target="_blank" rel="noopener noreferrer" data-cursor="pointer" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-[6px] border-black pl-6 py-2 my-8 italic font-handwritten text-2xl" {...props} />,
                  img: ({node, ...props}) => (
                    <span className="block border-[3px] border-black p-2 bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] my-8">
                      <img className="w-full h-auto" {...props} />
                    </span>
                  ),
                  code: ({node, inline, className, children, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <div className="bg-[#f8f8f8] border-[3px] border-black p-6 mb-8 mt-4 relative group cursor-text shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                        <div className="absolute top-3 left-3 flex gap-2">
                          <div className="w-3 h-3 rounded-full border border-black bg-zinc-300"></div>
                          <div className="w-3 h-3 rounded-full border border-black bg-zinc-300"></div>
                          <div className="w-3 h-3 rounded-full border border-black bg-zinc-300"></div>
                        </div>
                        {match && <div className="absolute top-2 right-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{match[1]}</div>}
                        <pre className="mt-6 text-black font-mono text-sm sm:text-base overflow-x-auto font-bold" {...props}>
                          {children}
                        </pre>
                      </div>
                    ) : (
                      <code className="bg-[#e0e0e0] border border-black px-2 py-1 text-sm font-mono font-bold" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </motion.div>
          </div>
        </section>

      </main>
      </motion.div>
    </div>
  );
}
