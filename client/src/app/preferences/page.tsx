"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PreferencesPage() {
  const [format, setFormat] = useState("simple");
  const [bannerType, setBannerType] = useState("png");

  const headingsList = [
    "Project Title", "Description", "Badges", "Features", 
    "Installation", "Usage", "API Reference", "Contributing", 
    "License", "Contact"
  ];

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] text-black p-4 md:p-12 font-body pt-32 selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-[3px] border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Subtle grid background pattern to match brutalist aesthetic */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="relative z-10 space-y-2 mb-10 border-b-2 border-black pb-8">
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest border-2 border-black mb-4 -rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Configuration
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-comic font-black uppercase tracking-tight leading-none text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
              Build your <br/> Readme
            </h1>
            <p className="text-xl font-handwritten italic mt-4 text-zinc-800">
              Customize the AI generation process step by step.
            </p>
          </div>

          <form className="relative z-10 space-y-12" onSubmit={(e) => e.preventDefault()}>
            
            {/* Reference Repo */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="w-8 h-8 rounded-full bg-[#e0e0e0] border-2 border-black flex items-center justify-center font-header font-bold text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">1</span>
                 <h2 className="text-2xl font-bold font-header uppercase tracking-wide">Style Reference</h2>
              </div>
              <p className="text-zinc-600 font-medium ml-11">Provide a GitHub repository URL to use as a typographic and structural guide.</p>
              <div className="ml-11 relative">
                <input 
                  type="url" 
                  placeholder="https://github.com/username/repo" 
                  className="w-full bg-[#f8f8f8] border-[3px] border-black text-black placeholder:text-zinc-400 h-14 px-4 text-lg font-mono focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                  data-cursor="text"
                />
              </div>
            </section>

            {/* Readme Format */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="w-8 h-8 rounded-full bg-[#e0e0e0] border-2 border-black flex items-center justify-center font-header font-bold text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">2</span>
                 <h2 className="text-2xl font-bold font-header uppercase tracking-wide">Structure Level</h2>
              </div>
              <div className="ml-11 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setFormat("simple")}
                  data-cursor="pointer"
                  className={`flex-1 py-4 px-6 border-[3px] border-black transition-all duration-200 text-left relative overflow-hidden group ${
                    format === "simple" 
                      ? "bg-black text-white shadow-none translate-y-1 translate-x-1" 
                      : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2]"
                  }`}
                >
                  <span className="block text-xl font-header font-bold mb-1 uppercase tracking-wide">Simple</span>
                  <span className={`text-sm font-medium ${format === "simple" ? "text-zinc-300" : "text-zinc-500"}`}>Essential sections only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("complex")}
                  data-cursor="pointer"
                  className={`flex-1 py-4 px-6 border-[3px] border-black transition-all duration-200 text-left relative overflow-hidden group ${
                    format === "complex" 
                      ? "bg-black text-white shadow-none translate-y-1 translate-x-1" 
                      : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2]"
                  }`}
                >
                  <span className="block text-xl font-header font-bold mb-1 uppercase tracking-wide">Complex</span>
                  <span className={`text-sm font-medium ${format === "complex" ? "text-zinc-300" : "text-zinc-500"}`}>Detailed technical documentation</span>
                </button>
              </div>
            </section>

            {/* Headings */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="w-8 h-8 rounded-full bg-[#e0e0e0] border-2 border-black flex items-center justify-center font-header font-bold text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">3</span>
                 <h2 className="text-2xl font-bold font-header uppercase tracking-wide">Required Headings</h2>
              </div>
              <div className="ml-11 grid grid-cols-2 md:grid-cols-3 gap-3">
                {headingsList.map((heading) => (
                  <label key={heading} className="flex items-center space-x-3 bg-white p-3 border-2 border-black cursor-pointer hover:bg-[#f2f2f2] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]" data-cursor="pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-none border-2 border-black text-black focus:ring-black focus:ring-offset-0 appearance-none checked:bg-black checked:relative checked:after:content-[''] checked:after:block checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2" />
                    <span className="font-medium pointer-events-none">{heading}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Previews / Banners */}
            <section className="space-y-8 pt-8 border-t-[3px] border-black">
              <div className="flex items-center gap-3 mb-2">
                 <span className="w-8 h-8 rounded-full bg-[#e0e0e0] border-2 border-black flex items-center justify-center font-header font-bold text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">4</span>
                 <h2 className="text-2xl font-bold font-header uppercase tracking-wide">Visual Assets</h2>
              </div>
              
              <div className="ml-11 space-y-2">
                <label className="block text-sm font-bold uppercase tracking-wider text-black">Banner AI Prompt</label>
                <textarea 
                  placeholder="Describe the hero banner you want generated (e.g., 'A futuristic city skyline with neon pink and blue lights...')"
                  className="w-full bg-[#f8f8f8] border-[3px] border-black text-black placeholder:text-zinc-400 min-h-[120px] p-4 text-base font-body focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow shadow-[4px_4px_0px_rgba(0,0,0,1)] resize-none"
                  data-cursor="text"
                />
              </div>

              <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider text-black">Banner Format</label>
                  <div className="flex gap-0 p-1 bg-[#e0e0e0] border-[3px] border-black w-fit shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <button
                      type="button"
                      onClick={() => setBannerType("png")}
                      className={`px-6 py-2 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "png" ? "bg-white border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "text-zinc-600 hover:text-black"}`}
                      data-cursor="pointer"
                    >
                      PNG Static
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerType("gif")}
                      className={`px-6 py-2 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "gif" ? "bg-white border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "text-zinc-600 hover:text-black"}`}
                      data-cursor="pointer"
                    >
                      GIF Anim
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider text-black">Art Style / Theme</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Cyberpunk, Minimalist" 
                    className="w-full bg-[#f8f8f8] border-[3px] border-black text-black placeholder:text-zinc-400 h-14 px-4 font-mono focus:outline-none focus:ring-4 focus:ring-black/10 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                    data-cursor="text"
                  />
                </div>
              </div>

              {/* Extra Images */}
              <div className="ml-11 space-y-2 pt-4">
                <label className="block text-sm font-bold uppercase tracking-wider text-black">Additional Screenshots</label>
                <div className="border-[3px] border-dashed border-black bg-[#f2f2f2] p-8 text-center hover:bg-[#e0e0e0] transition-colors cursor-pointer group" data-cursor="pin">
                  <div className="w-12 h-12 rounded-full border-2 border-black bg-white mx-auto flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <span className="font-header font-bold text-lg text-black uppercase tracking-wide">Drag & drop files here</span>
                  <p className="font-handwritten text-zinc-600 italic mt-2 text-lg">or click to browse your computer</p>
                </div>
              </div>
            </section>

            <div className="pt-12 ml-11">
              <button 
                type="submit" 
                className="w-full py-5 bg-black text-white font-header font-black text-2xl uppercase tracking-widest hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,0.3)] transition-all active:translate-y-0 active:shadow-none"
                data-cursor="pointer"
              >
                Let's Build It!
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
