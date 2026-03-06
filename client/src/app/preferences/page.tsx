"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, User, UploadCloud, RefreshCw, Send, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function PreferencesPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // --- Slide 1 State (Repo) ---
  const [isFetchingRepo, setIsFetchingRepo] = useState(true);
  const [repoData, setRepoData] = useState<{name: string, desc: string, stars: string, forks: string, lang: string} | null>(null);

  // --- Slide 2 State (Structure/Features) ---
  const [format, setFormat] = useState("simple");
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  
  const [headings, setHeadings] = useState({
    "Project Title": true, "Description": true, "Badges": false, "Features": true,
    "Installation": true, "Usage": true, "Contact": false, "Support": false
  });

  const [contactInfo, setContactInfo] = useState("");
  const [supportInfo, setSupportInfo] = useState("");
  
  const [selectedBadges, setSelectedBadges] = useState({
    version: true, release: false, stars: true, commits: false, collabs: false
  });

  // --- Slide 3 State (AI Assets) ---
  const [bannerPrompt, setBannerPrompt] = useState("");
  const [bannerType, setBannerType] = useState("png");
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [assetGenerated, setAssetGenerated] = useState(false);

  // --- Slide 4 State (Extra Media) ---
  const [screenshots, setScreenshots] = useState<{id: number, name: string}[]>([]);

  // Actions
  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleHeadingToggle = (key: string) => {
    setPreferencesSaved(false); // Reset save lock if preferences change
    setHeadings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleBadgeToggle = (key: string) => {
    setPreferencesSaved(false);
    setSelectedBadges(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleFormatChange = (newFormat: string) => {
    setPreferencesSaved(false);
    setFormat(newFormat);
  };

  // Mock repo fetch on mount
  useEffect(() => {
    setIsFetchingRepo(true);
    const timer = setTimeout(() => {
      setRepoData({
        name: "DocuGitHub",
        desc: "A beautifully brutalist next.js frontend architecture featuring heavily stark UI elements and dynamic cursor engines.",
        stars: "1.2k",
        forks: "340",
        lang: "TypeScript"
      });
      setIsFetchingRepo(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock Asset Generation
  const simulateAssetGeneration = () => {
    setIsGeneratingAsset(true);
    setAssetGenerated(false);
    setTimeout(() => {
      setIsGeneratingAsset(false);
      setAssetGenerated(true);
    }, 4500); // Wait for loading animation to play
  };

  const handleScreenshotNameChange = (id: number, newName: string) => {
    setScreenshots(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const addScreenshotSlot = () => {
    setScreenshots(prev => [...prev, { id: Date.now(), name: `Screenshot ${prev.length + 1}` }]);
  };

  const removeScreenshotSlot = (id: number) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  // Framer Motion Variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const slideTitles = [
    "1. Repository Connection",
    "2. Structure & Headings",
    "3. AI Visual Generator",
    "4. Extra Media & Submit"
  ];

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] text-black font-body flex flex-col pt-24 px-4 overflow-hidden selection:bg-black selection:text-white pb-32">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col flex-1 pb-12">
        
        {/* Header / Tracker */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest border-2 border-black mb-3 -rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Configuration Wizard
            </div>
            <h1 className="text-4xl md:text-5xl font-comic font-black uppercase tracking-tight leading-none text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
              Build your Readme
            </h1>
          </div>
          
          {/* Step Indicators */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-3 transition-all duration-300 border-2 border-black ${i === step ? 'w-12 bg-black' : i < step ? 'w-8 bg-black opacity-30' : 'w-4 bg-white'}`}></div>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative flex-1 flex flex-col min-h-[600px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 350, damping: 35 }, opacity: { duration: 0.2 } }}
              className="w-full bg-white border-[3px] border-black rounded-xl p-6 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-bold font-header uppercase tracking-wide mb-8 flex items-center gap-4 border-b-2 border-black pb-2">
                <span className="w-10 h-10 rounded-full border-[3px] border-black bg-black text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                  {step + 1}
                </span>
                {slideTitles[step].replace(/^[0-9]\.\s/, '')}
              </h2>

              {/* ======================================= */}
              {/* SLIDE 1: REPOSITORY EMBED               */}
              {/* ======================================= */}
              {step === 0 && (
                <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full justify-center">
                  <div className="mb-8 text-center">
                    <p className="font-bold border-2 border-black inline-block px-4 py-2 bg-[#f2f2f2] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      Target repository mapped from Home page.
                    </p>
                  </div>

                  {/* Loading State or Github Embed */}
                  <div>
                    <AnimatePresence mode="wait">
                      {isFetchingRepo ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center justify-center p-12 border-[3px] border-dashed border-black bg-[#f2f2f2]"
                        >
                          <div className="flex flex-col items-center space-y-4">
                            <span className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin"></span>
                            <span className="font-bold uppercase tracking-widest text-sm">Validating Repository...</span>
                          </div>
                        </motion.div>
                      ) : repoData ? (
                        <motion.div
                          key="embed"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="bg-white border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden"
                        >
                          <div className="bg-[#f2f2f2] border-b-2 border-black p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Github className="w-6 h-6" />
                              <span className="font-header font-bold text-lg">GitHub Embed</span>
                            </div>
                            <span className="font-mono text-sm bg-white border-2 border-black px-2 py-1 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Connected
                            </span>
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-12 h-12 bg-zinc-200 border-2 border-black flex items-center justify-center rounded">
                                <User className="w-6 h-6 text-zinc-500" />
                              </div>
                              <h3 className="text-2xl font-bold font-comic tracking-tight text-blue-600 underline underline-offset-4 decoration-2">{repoData.name}</h3>
                            </div>
                            <p className="text-zinc-700 font-body text-lg leading-relaxed">{repoData.desc}</p>
                            <div className="flex items-center space-x-6 pt-4 text-sm font-bold uppercase tracking-wider text-black">
                              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full border border-black inline-block"></span> {repoData.lang}</span>
                              <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {repoData.stars}</span>
                              <span className="flex items-center gap-1"><GitFork className="w-4 h-4" /> {repoData.forks}</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="empty"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center justify-center p-12 border-[3px] border-dashed border-zinc-300 bg-[#f8f8f8] opacity-50 text-center"
                        >
                          <span className="font-bold uppercase tracking-widest text-sm text-zinc-400 max-w-xs">Enter a valid GitHub URL to preview repository data</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* SLIDE 2: STRUCTURE & HEADINGS (COMBINED) */}
              {/* ======================================= */}
              {step === 1 && (
                <div className="flex flex-col md:flex-row gap-8 flex-1">
                  
                  {/* Left Col: Controls */}
                  <div className="flex-1 space-y-8">
                    {/* Format Toggle */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold uppercase tracking-wider text-black">Structure Level</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => handleFormatChange("simple")}
                          data-cursor="pointer"
                          className={`flex-1 py-4 px-6 border-[3px] border-black transition-all duration-200 text-left relative group ${format === "simple" ? "bg-black text-white shadow-none translate-y-1 translate-x-1" : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2]"}`}
                        >
                          <span className="block text-xl font-header font-bold mb-1 uppercase tracking-wide">Simple</span>
                          <span className={`text-sm font-medium ${format === "simple" ? "text-zinc-300" : "text-zinc-500"}`}>Essential sections</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatChange("complex")}
                          data-cursor="pointer"
                          className={`flex-1 py-4 px-6 border-[3px] border-black transition-all duration-200 text-left relative group ${format === "complex" ? "bg-black text-white shadow-none translate-y-1 translate-x-1" : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2]"}`}
                        >
                          <span className="block text-xl font-header font-bold mb-1 uppercase tracking-wide">Complex</span>
                          <span className={`text-sm font-medium ${format === "complex" ? "text-zinc-300" : "text-zinc-500"}`}>Detailed docs & API</span>
                        </button>
                      </div>
                    </div>

                    {/* Headings Checkboxes */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold uppercase tracking-wider text-black">Required Sections</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(headings).map(([key, isChecked]) => (
                          <label key={key} className={`flex items-center space-x-3 p-3 border-[3px] border-black transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 ${isChecked ? 'bg-black text-white' : 'bg-white text-zinc-500 hover:bg-[#f2f2f2]'}`} data-cursor="pointer">
                            <div className={`w-5 h-5 flex-shrink-0 border-2 ${isChecked ? 'border-white bg-black' : 'border-black bg-white'} relative flex items-center justify-center`}>
                              {isChecked && <div className="w-2 h-2 bg-white"></div>}
                            </div>
                            <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => handleHeadingToggle(key)} />
                            <span className="font-bold uppercase tracking-wide pointer-events-none text-xs sm:text-sm">{key}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Dynamic Configuration Inputs */}
                      <AnimatePresence>
                        {headings["Badges"] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-[#f8f8f8] border-[3px] border-dashed border-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">Select Badges</label>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(selectedBadges).map(([key, isChecked]) => (
                                  <button
                                    key={key}
                                    onClick={() => handleBadgeToggle(key)}
                                    className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black transition-colors ${isChecked ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#e0e0e0]'}`}
                                    data-cursor="pointer"
                                  >
                                    {key}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {headings["Contact"] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-[#f8f8f8] border-[3px] border-dashed border-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">Contact Link / Email</label>
                              <input 
                                type="text" 
                                placeholder="hello@docugithub.com" 
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                                className="w-full bg-white border-2 border-black text-black placeholder:text-zinc-400 h-12 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                                data-cursor="text"
                              />
                            </div>
                          </motion.div>
                        )}

                        {headings["Support"] && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-[#f8f8f8] border-[3px] border-dashed border-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">Support Link</label>
                              <input 
                                type="text" 
                                placeholder="https://ko-fi.com/username" 
                                value={supportInfo}
                                onChange={(e) => setSupportInfo(e.target.value)}
                                className="w-full bg-white border-2 border-black text-black placeholder:text-zinc-400 h-12 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                                data-cursor="text"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Right Col: Structure Preview & Save Lock */}
                  <div className="w-full md:w-[350px] bg-[#f8f8f8] border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 flex flex-col relative h-[500px]">
                    <div className="flex items-center justify-between border-b-[3px] border-black pb-4 mb-4">
                      <h3 className="font-header font-bold uppercase tracking-wide text-lg">Document Map</h3>
                      <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center"><LayoutDashboard className="w-4 h-4" /></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto font-mono text-sm space-y-3 pr-2 scrollable">
                      {headings["Project Title"] && <div className="flex items-center gap-2"><span className="w-4 h-4 bg-black flex-shrink-0"></span> <strong className="truncate">Title & Hero</strong></div>}
                      {headings["Badges"] && <div className="flex items-center gap-2 text-zinc-500 pl-6"><span className="w-3 h-1 border border-zinc-400"></span> Badges Layer</div>}
                      {headings["Description"] && <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black flex-shrink-0"></span> Description</div>}
                      {headings["Features"] && <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black border-dashed flex-shrink-0"></span> Features Map</div>}
                      {headings["Installation"] && <div className="flex items-center gap-2"><span className="w-4 h-4 bg-black flex-shrink-0"></span> <strong>Installation</strong></div>}
                      {headings["Usage"] && <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black flex-shrink-0"></span> Usage Guide</div>}
                      {format === "complex" && <div className="flex items-center gap-2 text-zinc-500 pl-6"><span className="w-2 h-2 bg-zinc-400"></span> API Endpoints</div>}
                      {format === "complex" && <div className="flex items-center gap-2 text-zinc-500 pl-6"><span className="w-2 h-2 bg-zinc-400"></span> Data Models</div>}
                      {format === "complex" && <div className="flex items-center gap-2 text-zinc-500 pl-6"><span className="w-2 h-2 bg-zinc-400"></span> Contributing</div>}
                      {headings["Support"] && <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black flex-shrink-0"></span> Support & Links</div>}
                      {headings["Contact"] && <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-zinc-300"><span className="w-4 h-4 border-2 border-black rounded-full flex-shrink-0"></span> Contact Info</div>}
                    </div>

                    <div className="mt-4 pt-4 border-t-[3px] border-black bg-white -mx-6 -mb-6 p-6 border-transparent bg-transparent">
                      <button 
                        onClick={() => setPreferencesSaved(true)}
                        className={`w-full py-4 border-[3px] border-black font-header font-bold uppercase tracking-widest transition-all ${preferencesSaved ? "bg-black text-white shadow-none translate-y-1 translate-x-1" : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2] hover:-translate-y-1 active:translate-y-0 active:shadow-none"}`}
                        data-cursor="pointer"
                      >
                         {preferencesSaved ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Saved</span> : "Save Preferences"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* SLIDE 3: AI ASSETS & PREVIEW GENERATOR  */}
              {/* ======================================= */}
              {step === 2 && (
                <div className="flex flex-col flex-1 gap-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left: Input Config */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold uppercase tracking-wider text-black">1. Banner Settings</label>
                        <textarea 
                          placeholder="Describe the hero banner... (Logo is generated within)" value={bannerPrompt} onChange={(e) => setBannerPrompt(e.target.value)}
                          className="w-full bg-[#f8f8f8] border-[3px] border-black text-black placeholder:text-zinc-400 min-h-[140px] p-4 font-body focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow shadow-[4px_4px_0px_rgba(0,0,0,1)] resize-none"
                          data-cursor="text"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-bold uppercase tracking-wider text-black">
                          2. Format & Reference
                        </label>
                        <div className="flex gap-4">
                          <div className="flex bg-[#f2f2f2] border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-1 flex-shrink-0 self-start">
                            <button onClick={() => setBannerType("png")} className={`px-4 py-2 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "png" ? "bg-black border-black text-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" : "text-zinc-600 hover:text-black"}`} data-cursor="pointer">PNG</button>
                            <button onClick={() => setBannerType("gif")} className={`px-4 py-2 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "gif" ? "bg-black border-black text-white shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" : "text-zinc-600 hover:text-black"}`} data-cursor="pointer">GIF</button>
                          </div>
                          
                          <div className="border-[3px] border-dashed border-black bg-[#f8f8f8] flex-1 p-3 flex flex-col items-center justify-center text-center hover:bg-[#e0e0e0] transition-colors cursor-pointer group" data-cursor="pin">
                            <UploadCloud className="w-5 h-5 mb-1 text-zinc-400 group-hover:text-black transition-colors" />
                            <span className="font-header font-bold text-xs uppercase tracking-wide">Upload Ref</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          onClick={simulateAssetGeneration}
                          disabled={isGeneratingAsset}
                          className="w-full py-4 border-[3px] border-black bg-black text-white font-header font-black text-xl uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-3"
                          data-cursor="pointer"
                        >
                           {isGeneratingAsset ? (
                             <>Running Engine...</>
                           ) : assetGenerated ? (
                             <><RefreshCw className="w-5 h-5" /> Regenerate Banner</>
                           ) : (
                             <><Send className="w-5 h-5" /> Generate Banner</>
                           )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Right: Brutalist Loading / Preview Area */}
                    <div className="w-full border-[3px] border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] p-4 flex flex-col items-center justify-center relative min-h-[350px] overflow-hidden">
                       
                       {/* Idle State */}
                       {!isGeneratingAsset && !assetGenerated && (
                         <div className="text-center opacity-40">
                           <div className="w-16 h-16 border-4 border-dashed border-black mx-auto mb-4 opacity-50"></div>
                           <p className="font-header uppercase font-bold tracking-widest">Waiting for Generation</p>
                         </div>
                       )}

                       {/* Brutalist Loading Sequence */}
                       {isGeneratingAsset && (
                         <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                           className="absolute inset-0 bg-white border-4 border-black flex flex-col items-center justify-center overflow-hidden z-10"
                         >
                           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                           <div className="w-24 h-24 border-8 border-black border-t-transparent animate-spin rounded-full mb-8"></div>
                           <motion.div 
                             animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                             className="text-black bg-white border-2 border-black px-4 py-2 font-mono text-xl font-bold uppercase tracking-[0.2em] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             [ Processing Layers ]
                           </motion.div>
                         </motion.div>
                       )}

                       {/* Rendered Result Preview (Full Width Banner) */}
                       {!isGeneratingAsset && assetGenerated && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                           className="w-full h-full flex flex-col"
                         >
                           <div className="w-full flex-1 bg-zinc-800 border-[3px] border-black relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                             {/* Fake Banner with Logo Inside */}
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 mix-blend-multiply"></div>
                             <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                             
                             <div className="absolute inset-0 flex flex-col relative items-center justify-center">
                               {/* Embedded Logo in Banner */}
                               <div className="w-20 h-20 mb-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-3xl italic tracking-tighter rotate-3">
                                 NX
                               </div>
                               <h1 className="text-white font-black text-4xl drop-shadow-[0_2px_0_rgba(0,0,0,1)] tracking-widest uppercase">NEXUS_UI</h1>
                             </div>
                             
                             <div className="absolute top-2 right-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase font-mono border-2 border-white/20">
                               Generated_Banner.{bannerType}
                             </div>
                           </div>
                         </motion.div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* SLIDE 4: EXTRA SCREENSHOTS & FINALIZE   */}
              {/* ======================================= */}
              {step === 3 && (
                <div className="flex flex-col flex-1 space-y-8">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-center bg-[#f2f2f2] border-b-4 border-black pb-4 -mx-6 -mt-6 p-6 mb-2">
                      <label className="block text-xl font-header font-black uppercase tracking-wider text-black">Feature Screenshots ({screenshots.length})</label>
                      <button 
                        onClick={addScreenshotSlot}
                        className="px-4 py-2 bg-black text-white border-[3px] border-black font-bold uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                        data-cursor="pointer"
                      >
                         <UploadCloud className="w-4 h-4"/> Add Image
                      </button>
                    </div>

                    {/* Dynamic Upload Slots */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4 scrollable">
                      <AnimatePresence>
                        {screenshots.length === 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full border-[3px] border-dashed border-zinc-400 p-12 text-center text-zinc-500 font-bold uppercase tracking-widest mt-4">
                            No screenshots added yet.
                          </motion.div>
                        )}
                        {screenshots.map((shot) => (
                          <motion.div 
                            key={shot.id} 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col group overflow-hidden relative"
                          >
                            <button 
                              onClick={() => removeScreenshotSlot(shot.id)}
                              className="absolute top-2 right-2 w-6 h-6 bg-white border-2 border-black flex items-center justify-center font-bold text-xs hover:bg-red-500 hover:text-white transition-colors z-10"
                              data-cursor="pointer"
                            >
                              ✕
                            </button>
                            <div 
                              className="h-32 border-b-[3px] border-black flex items-center justify-center p-4 transition-colors cursor-pointer bg-[#f8f8f8] hover:bg-[#e0e0e0]"
                              data-cursor="pin"
                            >
                              <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                                <UploadCloud className="w-8 h-8 text-black mx-auto mb-2" />
                                <span className="font-header font-bold text-sm uppercase">Upload Image</span>
                              </div>
                            </div>
                            
                            {/* Editable Name Field attached to the upload slot */}
                            <div className="p-3 bg-white">
                              <input 
                                type="text" 
                                value={shot.name}
                                onChange={(e) => handleScreenshotNameChange(shot.id, e.target.value)}
                                className="w-full border-2 border-dashed border-zinc-300 focus:border-black text-sm font-body px-2 py-1 text-center font-bold focus:outline-none focus:bg-[#f2f2f2]"
                                data-cursor="text"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-4 border-t-[3px] border-black">
                    <button 
                      className="w-full py-6 bg-white border-[3px] border-black text-black font-header font-black text-3xl uppercase tracking-widest hover:bg-black hover:text-white hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.5)] transition-all shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                      data-cursor="pointer"
                    >
                      GENERATE README
                    </button>
                    <p className="text-center font-handwritten text-lg mt-4 text-zinc-600 italic">This will compile all settings and open the Editor.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Navigation Controls */}
        <div className="flex justify-between mt-8 relative z-20">
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className="px-6 py-3 border-[3px] border-black bg-white font-bold uppercase text-black disabled:opacity-0 disabled:pointer-events-none shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#e0e0e0] transition-colors active:translate-y-1 active:shadow-none"
            data-cursor="pointer"
          >
            ← Back
          </button>
          
          <button 
            onClick={nextStep}
            disabled={step === 3 || (step === 1 && !preferencesSaved)}
            className={`px-6 py-3 border-[3px] border-black font-bold uppercase disabled:pointer-events-none transition-colors active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_rgba(0,0,0,1)] ${step === 3 ? 'opacity-0' : step === 1 && !preferencesSaved ? 'bg-[#f2f2f2] text-zinc-400 border-zinc-400 shadow-none' : 'bg-black text-white hover:bg-zinc-800'}`}
            data-cursor={step === 1 && !preferencesSaved ? "not-allowed" : "pointer"}
          >
            {step === 1 && !preferencesSaved ? "Save Required" : "Next Step →"}
          </button>
        </div>

      </div>
    </div>
  );
}
