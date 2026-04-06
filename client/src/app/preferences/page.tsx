"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, User, UploadCloud, CheckCircle2, LayoutDashboard, ArrowLeft } from "lucide-react";
import BannerGenerationAnimation from "@/components/BannerGenerationAnimation";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import {
  parseRepoUrl,
  initializeSession,
  savePreferences as savePreferencesApi,
  generateBanner,
  generateReadme,
  fetchReadmeFromSupabase,
  uploadShowcase,
  fileToBase64,
  analyzeRepo,
} from "@/lib/api";
import type { Preferences } from "@/lib/api";
import { PREFERENCES_CONFIG } from "@/config/sections";

// ─── Funny loading messages typewriter ───────────────────────────────────────

const LOADING_MESSAGES = [
  "Arranging pixels with surgical precision...",
  "Asking the AI very nicely. It's ignoring us.",
  "Downloading more RAM... just kidding. Maybe.",
  "Breaking the fourth wall: hey you, yes you — go drink water.",
  "Consulting the ancient README scrolls...",
  "Polishing the developer's naturally curly hair... wait wrong job.",
  "The developer who wrote this deserves a raise. And dinner. Just saying.",
  "Training 47 neural networks to draw a rectangle...",
  "Technically this is working. Philosophically, who knows.",
  "Converting coffee to code to banner... ETA unknown.",
  "Okay real talk — she coded this at 2am. Dinner. Minimum.",
  "Whispering sweet nothings to the GPU...",
  "Fun fact: this takes 2-3 mins. Grab a snack. You've earned it.",
  "Negotiating with diffusion models. They drive a hard bargain.",
  "Plot twist: the banner was inside us all along.",
  "Applying 14 layers of artistic suffering...",
  "Dev tip: if it looks wrong, squint and believe in yourself.",
  "The AI is currently having an existential crisis. Please hold.",
  "Generating gradients that spark joy...",
  "Channelling the aesthetic energy of a sleep-deprived developer...",
  "Your patience is being tracked. It's at 67% heroic.",
  "Have you considered taking her out while this loads? Just a thought.",
  "Turning vague vibes into precise pixels...",
  "Fun fact: she shipped this instead of replying to texts. Respect.",
  "Compiling hopes and dreams into image bytes...",
  "Plot twist: the banner will look amazing. Trust the process.",
  "Asking the latent space nicely. Still asking.",
  "Buffering... not technically, but spiritually.",
  "Almost there. Probably. The math suggests optimism.",
  "Status: vibes are immaculate, pixels are cooperating.",
  "Loading... like your DMs, but this one actually delivers.",
  "Running on caffeine, chaos, and carefully crafted CSS.",
  "The banner is being born. Respect the process.",
  "Final checks: fonts ✓, colors ✓, existential dread ✓ — sending now.",
];

function LoadingTypewriter() {
  const [text, setText] = React.useState("");
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    const msg = LOADING_MESSAGES[msgIdx % LOADING_MESSAGES.length];
    let charIdx = 0;
    let typing = true;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (typing) {
        charIdx++;
        setText(msg.slice(0, charIdx));
        if (charIdx >= msg.length) {
          typing = false;
          timeoutId = setTimeout(tick, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 46);
      } else {
        charIdx--;
        setText(msg.slice(0, charIdx));
        if (charIdx <= 0) {
          setMsgIdx((prev) => prev + 1);
          return;
        }
        timeoutId = setTimeout(tick, 20);
      }
    };

    timeoutId = setTimeout(tick, 46);
    return () => clearTimeout(timeoutId);
  }, [msgIdx]);

  return (
    <span className="font-body text-sm text-black font-medium leading-relaxed">
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-black ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

function LabelTypewriter({ label, onComplete }: { label: string; onComplete?: () => void }) {
  const [text, setText] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let charIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      charIdx++;
      setText(label.slice(0, charIdx));
      if (charIdx >= label.length) {
        setDone(true);
        onComplete?.();
        return;
      }
      timeoutId = setTimeout(tick, 55);
    };

    timeoutId = setTimeout(tick, 200);
    return () => clearTimeout(timeoutId);
  }, [label, onComplete]);

  return (
    <span className="block text-sm font-bold uppercase tracking-wider text-black">
      {text}
      {!done && (
        <span className="inline-block w-[2px] h-[1em] bg-black ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}

// Section name to backend ID mapping
const SECTION_ID_MAP: Record<string, string> = {
  "Why this exists": "not_fork",
  "Features": "features",
  "Architecture": "architecture",
  "Quick Start": "quick_start",
  "Usage": "usage",
  "Contributing": "contributing",
  "Maintainers": "maintainers",
  "Contributors": "contributors",
  "License": "license",
  "Support": "support",
  "Star History Chart": "public_starchart",
};

// Badge name to backend ID mapping
const BADGE_ID_MAP: Record<string, string> = {
  "version": "version",
  "release date": "release_date",
  "last commit": "last_commit",
  "license": "license",
  "contact": "contact",
};

export default function PreferencesPage() {
  const [step, setStep] = useState(0);
  const [highestVisited, setHighestVisited] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();
  const { sessionId, repoInfo, bannerUrl, setSessionId, setRepoInfo, setBannerUrl } = useSession();

  // --- Slide 1 State (Repo) ---
  // If user arrives without a session (e.g. direct URL), allow them to enter a repo URL
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // --- Slide 2 State (Structure/Features) ---
  const [format, setFormat] = useState("simple");
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [docMapSections, setDocMapSections] = useState({
    "Why this exists": true,
    "Features": true,
    "Architecture": false,
    "Quick Start": true,
    "Usage": true,
    "Contributing": false,
    "Maintainers": false,
    "Contributors": false,
    "License": true,
    "Support": false,
    "Star History Chart": false
  });

  const [contactInfo, setContactInfo] = useState("");
  const [supportInfo, setSupportInfo] = useState("");

  const [selectedBadges, setSelectedBadges] = useState({
    version: false, "release date": true, "last commit": true, license: false, contact: false
  });

  // --- Slide 3 State (AI Assets) ---
  const [bannerPrompt, setBannerPrompt] = useState("");
  const [bannerType, setBannerType] = useState("png");
  const [styleReferenceFile, setStyleReferenceFile] = useState<File | null>(null);
  const [styleReferencePreview, setStyleReferencePreview] = useState<string | null>(null);
  const [objectReferenceFile, setObjectReferenceFile] = useState<File | null>(null);
  const [objectReferencePreview, setObjectReferencePreview] = useState<string | null>(null);
  const styleRefInput = useRef<HTMLInputElement>(null);
  const objectRefInput = useRef<HTMLInputElement>(null);

  // --- Slide 3 Generation State ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showOutputLabel, setShowOutputLabel] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (animationComplete) {
      timer = setTimeout(() => setShowOutputLabel(true), 1000);
    } else {
      setShowOutputLabel(false);
    }
    return () => clearTimeout(timer);
  }, [animationComplete]);

  const [bannerError, setBannerError] = useState<string | null>(null);

  // --- Slide 4 State (Extra Media) ---
  const [screenshots, setScreenshots] = useState<{id: number, name: string, file: File | null, preview: string | null}[]>([]);
  const [isGeneratingReadme, setIsGeneratingReadme] = useState(false);

  const [shakeContact, setShakeContact] = useState(false);
  const [shakeSupport, setShakeSupport] = useState(false);

  // Actions
  const nextStep = () => {
    if (step === 2 && isGenerating) return;
    if (step === 1) {
      const contactRequired = selectedBadges["contact"] && !contactInfo.trim();
      const supportRequired = docMapSections["Support"] && !supportInfo.trim();
      if (contactRequired) setShakeContact(true);
      if (supportRequired) setShakeSupport(true);
      if (contactRequired || supportRequired) return;
    }
    const next = Math.min(step + 1, 3);
    setDirection(1);
    setHighestVisited((prev) => Math.max(prev, next));
    setStep(next);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (targetStep: number) => {
    if (targetStep === step) return;
    if (targetStep > highestVisited) return;

    // Validation for moving forward from Step 2 (Index 1)
    if (step === 1 && targetStep > 1) {
      const contactRequired = selectedBadges["contact"] && !contactInfo.trim();
      const supportRequired = docMapSections["Support"] && !supportInfo.trim();
      if (contactRequired) setShakeContact(true);
      if (supportRequired) setShakeSupport(true);
      if (contactRequired || supportRequired || !preferencesSaved) return;
    }

    setDirection(targetStep > step ? 1 : -1);
    setStep(targetStep);
  };

  const handleBadgeToggle = (key: string) => {
    setPreferencesSaved(false);
    setSelectedBadges(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleFormatChange = (newFormat: string) => {
    setPreferencesSaved(false);
    setFormat(newFormat);
  };

  const handleDocMapToggle = (key: string) => {
    setDocMapSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  // --- Save Preferences Handler ---
  const handleSavePreferences = async () => {
    if (!sessionId) return;
    setIsSavingPreferences(true);

    const sections = Object.entries(docMapSections)
      .filter(([, checked]) => checked)
      .map(([name]) => SECTION_ID_MAP[name] || name);

    const badges = Object.entries(selectedBadges)
      .filter(([, checked]) => checked)
      .map(([name]) => BADGE_ID_MAP[name] || name);

    // Auto-inject buymeacoffee badge when Support section is enabled and link is filled
    const badgesWithSupport =
      docMapSections["Support"] && supportInfo.trim()
        ? [...badges, "buymeacoffee"]
        : badges;

    const processEmailLink = (val: string) => {
      const trimmed = val.trim();
      if (!trimmed) return trimmed;
      if (trimmed.includes("@") && !trimmed.startsWith("mailto:") && !trimmed.startsWith("http")) {
        return `mailto:${trimmed}`;
      }
      return trimmed;
    };

    const preferences: Preferences = {
      tone: format === "detailed" ? "complex" : format,
      sections,
      badges: badgesWithSupport,
      include_toc: format === "complex" || format === "detailed",
      contact_info: processEmailLink(contactInfo),
      support_link: processEmailLink(supportInfo),
    };

    try {
      await savePreferencesApi(sessionId, preferences);
      setPreferencesSaved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // --- Generate Banner Handler ---
  const handleGenerate = useCallback(async () => {
    if (!bannerPrompt.trim() || !sessionId) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setAnimationComplete(false);
    setBannerError(null);

    try {
      const styleBase64 = styleReferenceFile ? await fileToBase64(styleReferenceFile) : "";
      const logoBase64 = objectReferenceFile ? await fileToBase64(objectReferenceFile) : "";

      const result = await generateBanner(sessionId, {
        user_prompt: bannerPrompt,
        style_reference: styleBase64,
        logo_image: logoBase64,
        banner_type: bannerType === "png" ? "img" : bannerType,
      });

      if (result.success && result.bannerUrl) {
        setBannerUrl(result.bannerUrl);

        // Only trigger animation if reference images were uploaded
        if (!styleReferencePreview || !objectReferencePreview) {
          // Poll using Image() constructor — same approach as BannerGenerationAnimation.
          // fetch(HEAD) fails on Supabase public URLs due to CORS; Image() bypasses this.
          let imageReady = false;
          let attempts = 0;
          while (!imageReady && attempts < 60) {
            imageReady = await new Promise<boolean>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              const sep = result.bannerUrl.includes("?") ? "&" : "?";
              img.src = `${result.bannerUrl}${sep}t=${Date.now()}`;
            });

            if (!imageReady) {
              await new Promise((r) => setTimeout(r, 5000));
              attempts++;
            }
          }

          if (!imageReady) {
            setBannerError("Banner generation timed out. Please try again.");
            setIsGenerating(false);
            return;
          }

          setGeneratedImageUrl(result.bannerUrl);
          setIsGenerating(false);
          setAnimationComplete(true);
        } else {
          setGeneratedImageUrl(result.bannerUrl);
        }
        // If refs exist, the BannerGenerationAnimation component will call
        // handleAnimationComplete once the canvas animation finishes
      } else {
        setBannerError("Banner generation failed. Please try again.");
        setIsGenerating(false);
      }
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : "Banner generation failed. Please try again.");
      setIsGenerating(false);
    }
  }, [bannerPrompt, sessionId, styleReferenceFile, objectReferenceFile, bannerType, setBannerUrl, styleReferencePreview, objectReferencePreview]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    setIsGenerating(false);
  }, []);

  // --- Fallback: initialize from this page if no session ---
  const handleFallbackSubmit = async () => {
    const parsed = parseRepoUrl(fallbackUrl);
    if (!parsed) {
      setFetchError("Please enter a valid GitHub repository URL");
      return;
    }
    setIsFetchingRepo(true);
    setFetchError(null);
    try {
      const data = await initializeSession(fallbackUrl);
      setSessionId(data.session_id);
      setRepoInfo(data.repo_info);
      analyzeRepo(data.session_id).catch(console.error);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setIsFetchingRepo(false);
    }
  };

  // --- Generate README Handler (Slide 4) ---
  const handleGenerateReadme = async () => {
    if (!sessionId) return;
    setIsGeneratingReadme(true);

    try {
      // Upload showcases if any
      const showcasesWithFiles = screenshots.filter(s => s.file);
      if (showcasesWithFiles.length > 0) {
        const showcaseItems = await Promise.all(
          showcasesWithFiles.map(async (s, i) => ({
            order: i + 1,
            type: s.file!.type.includes("gif") ? "gif" : "image",
            base64: await fileToBase64(s.file!),
            description: s.name,
          }))
        );
        await uploadShowcase(sessionId, showcaseItems);
      }

      // Trigger generation via n8n webhook — response may already include content
      const webhookContent = await generateReadme(sessionId, bannerUrl || undefined);

      // Try to get the authoritative content directly from Supabase
      const supabaseResult = await fetchReadmeFromSupabase(sessionId);

      // Prefer Supabase content (authoritative), fall back to webhook response
      const readme = supabaseResult.content || webhookContent;
      if (readme) localStorage.setItem("docugithub_readme", readme);
      localStorage.setItem("docugithub_session_id_for_readme", sessionId);
      router.push("/editor");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to generate README");
    } finally {
      setIsGeneratingReadme(false);
    }
  };

  const handleScreenshotNameChange = (id: number, newName: string) => {
    setScreenshots(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const addScreenshotSlot = () => {
    const uniqueId = Date.now() + Math.random();
    setScreenshots(prev => [
      ...prev,
      {
        id: uniqueId,
        name: prev.length === 0 ? "Main Showcase" : `Feature Showcase ${prev.length}`,
        file: null,
        preview: null
      }
    ]);
  };

  const removeScreenshotSlot = (id: number) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  const handleScreenshotUpload = (id: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setScreenshots(prev => prev.map(s => s.id === id ? { ...s, file, preview: previewUrl } : s));
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
    "3. Flow Banner Generator",
    "4. Project Showcase"
  ];

  return (
    <div className="min-h-screen w-full bg-[#f2f2f2] text-black font-body flex flex-col pt-24 px-4 overflow-hidden selection:bg-black selection:text-white pb-32">

      {/* Go Back Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white border-[3px] border-black font-bold uppercase text-sm text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#e0e0e0] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
        data-cursor="pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </button>

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
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`h-3 transition-all duration-300 border-2 border-black ${i === step ? 'w-12 bg-black cursor-pointer' : i <= highestVisited ? 'w-8 bg-black opacity-30 cursor-pointer' : 'w-4 bg-white cursor-not-allowed opacity-40'}`}
                title={i <= highestVisited ? `Go to Step ${i + 1}` : `Complete previous steps first`}
                data-cursor={i <= highestVisited ? "pointer" : "not-allowed"}
              ></button>
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

                  {/* Loading State or Github Embed */}
                  <div>
                    <AnimatePresence mode="wait">
                      {!repoInfo && !isFetchingRepo ? (
                        /* No session — show fallback URL input */
                        <motion.div
                          key="fallback-input"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-4 p-8 border-[3px] border-dashed border-black bg-[#f8f8f8]"
                        >
                          <span className="font-bold uppercase tracking-widest text-sm">Enter a GitHub Repository URL</span>
                          <div className="flex w-full max-w-md gap-2">
                            <input
                              type="text"
                              placeholder="https://github.com/owner/repo"
                              value={fallbackUrl}
                              onChange={(e) => { setFallbackUrl(e.target.value); setFetchError(null); }}
                              onKeyDown={(e) => { if (e.key === "Enter") handleFallbackSubmit(); }}
                              className="flex-1 bg-white border-2 border-black text-black placeholder:text-zinc-400 h-12 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                              onClick={handleFallbackSubmit}
                              disabled={isFetchingRepo}
                              className="px-6 py-2 bg-black text-white border-2 border-black font-bold uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                            >
                              Connect
                            </button>
                          </div>
                          {fetchError && (
                            <p className="text-red-500 text-sm font-bold">{fetchError}</p>
                          )}
                        </motion.div>
                      ) : isFetchingRepo ? (
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
                      ) : repoInfo ? (
                        <div
                          style={{
                            transform: `translate(${PREFERENCES_CONFIG.githubEmbed.xOffset}px, ${PREFERENCES_CONFIG.githubEmbed.yOffset}px)`,
                          }}
                        >
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
                              <h3 className="text-2xl font-bold font-comic tracking-tight text-blue-600 underline underline-offset-4 decoration-2">{repoInfo.owner}/{repoInfo.repo}</h3>
                            </div>
                            <p className="text-zinc-700 font-body text-lg leading-relaxed">{repoInfo.description}</p>
                            <div className="flex items-center space-x-6 pt-4 text-sm font-bold uppercase tracking-wider text-black">
                              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full border border-black inline-block"></span> {repoInfo.language}</span>
                              <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {repoInfo.stars}</span>
                              <span className="flex items-center gap-1"><GitFork className="w-4 h-4" /> {repoInfo.is_private ? "Private" : "Public"}</span>
                            </div>
                          </div>
                        </motion.div>
                        </div>
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
                          <span className={`text-sm font-medium ${format === "simple" ? "text-zinc-300" : "text-zinc-500"}`}>Clean & Straightforward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatChange("detailed")}
                          data-cursor="pointer"
                          className={`flex-1 py-4 px-6 border-[3px] border-black transition-all duration-200 text-left relative group ${format === "detailed" ? "bg-black text-white shadow-none translate-y-1 translate-x-1" : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2]"}`}
                        >
                          <span className="block text-xl font-header font-bold mb-1 uppercase tracking-wide">Detailed</span>
                          <span className={`text-sm font-medium ${format === "detailed" ? "text-zinc-300" : "text-zinc-500"}`}>In-depth Docs</span>
                        </button>
                      </div>
                    </div>

                    {/* Select Badges */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold uppercase tracking-wider text-black">Select Badges</label>
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

                      <AnimatePresence>
                        {selectedBadges["contact"] && (
                          <motion.div
                            key="contact-field"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-[#f8f8f8] border-[3px] border-dashed border-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">Contact Link / Email <span className="text-black">*</span></label>
                              <motion.div
                                animate={shakeContact ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                onAnimationComplete={() => setShakeContact(false)}
                              >
                                <input
                                  type="text"
                                  placeholder="hello@docugithub.com"
                                  value={contactInfo}
                                  onChange={(e) => { setContactInfo(e.target.value); setShakeContact(false); }}
                                  className="w-full bg-white border-2 border-black text-black placeholder:text-zinc-400 h-12 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                                  data-cursor="text"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        )}

                        {docMapSections["Support"] && (
                          <motion.div
                            key="support-field"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-[#f8f8f8] border-[3px] border-dashed border-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]">
                              <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">Support Link <span className="text-black">*</span></label>
                              <motion.div
                                animate={shakeSupport ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                onAnimationComplete={() => setShakeSupport(false)}
                              >
                                <input
                                  type="text"
                                  placeholder="https://buymeacoffee.com/d4rkpho3nix"
                                  value={supportInfo}
                                  onChange={(e) => { setSupportInfo(e.target.value); setShakeSupport(false); }}
                                  className="w-full bg-white border-2 border-black text-black placeholder:text-zinc-400 h-12 px-4 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                                  data-cursor="text"
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Col: Structure Preview & Save Lock */}
                  <div className="w-full md:w-[350px] bg-[#f8f8f8] border-[3px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 flex flex-col relative h-[500px]">
                    <div className="flex items-center justify-between border-b-[3px] border-black pb-4 mb-4">
                      <h3 className="font-header font-bold uppercase tracking-wide text-lg">Sections</h3>
                      <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center"><LayoutDashboard className="w-4 h-4" /></div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-0.5 content-start pr-1">
                      {Object.entries(docMapSections).map(([key, isChecked]) => (
                        <div
                          key={key}
                          onClick={() => handleDocMapToggle(key)}
                          data-cursor="pointer"
                          className={`flex items-center gap-2 cursor-pointer select-none px-2 py-1.5 transition-colors ${isChecked ? 'text-black' : 'text-zinc-400'}`}
                        >
                          <div className={`w-4 h-4 flex-shrink-0 border-2 ${isChecked ? 'border-black bg-black' : 'border-zinc-400 bg-white'} flex items-center justify-center`}>
                            {isChecked && <div className="w-1.5 h-1.5 bg-white"></div>}
                          </div>
                          <span className="font-mono text-xs leading-tight">{key}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t-[3px] border-black bg-white -mx-6 -mb-6 p-6 border-transparent bg-transparent">
                      <button
                        onClick={handleSavePreferences}
                        disabled={isSavingPreferences}
                        className={`w-full py-4 border-[3px] border-black font-header font-bold uppercase tracking-widest transition-all ${preferencesSaved ? "bg-black text-white shadow-none translate-y-1 translate-x-1" : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-[#f2f2f2] hover:-translate-y-1 active:translate-y-0 active:shadow-none"}`}
                        data-cursor="pointer"
                      >
                         {isSavingPreferences ? (
                           <span className="flex items-center justify-center gap-2">
                             <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                             Saving...
                           </span>
                         ) : preferencesSaved ? (
                           <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Saved</span>
                         ) : (
                           "Save Preferences"
                         )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================= */}
              {/* SLIDE 3: AI VISUAL GENERATOR             */}
              {/* ======================================= */}
              {step === 2 && (
                <div className="flex flex-col flex-1 gap-6">

                  {/* Row 1: Banner Prompt + Format (always visible) */}
                  <div className="flex gap-6 items-center">
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-bold uppercase tracking-wider text-black">1. Banner Prompt</label>
                      <textarea
                        placeholder="Describe the hero banner..."
                        value={bannerPrompt}
                        onChange={(e) => setBannerPrompt(e.target.value)}
                        disabled={isGenerating}
                        className="w-full bg-[#f8f8f8] border-[3px] border-black text-black placeholder:text-zinc-400 min-h-[120px] p-4 font-body focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow shadow-[4px_4px_0px_rgba(0,0,0,1)] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        data-cursor="text"
                      />
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <label className="block text-sm font-bold uppercase tracking-wider text-black text-center">Format</label>
                      <div className="flex bg-[#f2f2f2] border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-1">
                        <button onClick={() => setBannerType("png")} disabled={isGenerating} className={`px-5 py-3 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "png" ? "bg-black border-black text-white" : "text-zinc-600 hover:text-black"} disabled:opacity-50`} data-cursor="pointer">PNG</button>
                        <button onClick={() => setBannerType("gif")} disabled={isGenerating} className={`px-5 py-3 font-bold uppercase tracking-wide border-2 border-transparent transition-all ${bannerType === "gif" ? "bg-black border-black text-white" : "text-zinc-600 hover:text-black"} disabled:opacity-50`} data-cursor="pointer">GIF</button>
                      </div>
                    </div>
                  </div>

                  {/* Banner error */}
                  {bannerError && (
                    <p className="text-red-500 text-sm font-bold">{bannerError}</p>
                  )}

                  {/* Conditional: Normal upload UI vs Animation vs Result */}
                  {!isGenerating && !animationComplete && (
                    <>
                      {/* Row 2: Style Reference + Object Reference */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold uppercase tracking-wider text-black">2. Style Reference</label>
                          <input
                            ref={styleRefInput}
                            type="file"
                            accept="image/png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              setStyleReferenceFile(file);
                              setStyleReferencePreview(file ? URL.createObjectURL(file) : null);
                            }}
                          />
                          <div
                            onClick={() => styleRefInput.current?.click()}
                            className="border-[3px] border-black bg-[#f8f8f8] h-36 flex flex-col items-center justify-center text-center hover:bg-[#e0e0e0] transition-colors cursor-pointer group shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                            data-cursor="pin"
                          >
                            {styleReferencePreview ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={styleReferencePreview} alt="Style reference preview" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <UploadCloud className="w-5 h-5 text-white" />
                                  <span className="text-white font-bold text-xs uppercase tracking-wide">Change</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-8 h-8 mb-2 text-zinc-400 group-hover:text-black transition-colors" />
                                <span className="font-header font-bold text-sm uppercase tracking-wide">Upload Style Ref</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold uppercase tracking-wider text-black">3. Object Reference</label>
                          <input
                            ref={objectRefInput}
                            type="file"
                            accept="image/png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              setObjectReferenceFile(file);
                              setObjectReferencePreview(file ? URL.createObjectURL(file) : null);
                            }}
                          />
                          <div
                            onClick={() => objectRefInput.current?.click()}
                            className="border-[3px] border-black bg-[#f8f8f8] h-36 flex flex-col items-center justify-center text-center hover:bg-[#e0e0e0] transition-colors cursor-pointer group shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                            data-cursor="pin"
                          >
                            {objectReferencePreview ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={objectReferencePreview} alt="Object reference preview" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <UploadCloud className="w-5 h-5 text-white" />
                                  <span className="text-white font-bold text-xs uppercase tracking-wide">Change</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-8 h-8 mb-2 text-zinc-400 group-hover:text-black transition-colors" />
                                <span className="font-header font-bold text-sm uppercase tracking-wide">Upload Object Ref</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Generate Button */}
                      <div className="pt-2">
                        <button
                          onClick={handleGenerate}
                          disabled={!bannerPrompt.trim()}
                          className={`w-full py-4 border-[3px] border-black font-header font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center ${
                            !bannerPrompt.trim()
                              ? "bg-zinc-300 text-zinc-500 border-zinc-400 cursor-not-allowed shadow-none"
                              : "bg-black text-white hover:bg-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                          }`}
                          data-cursor={!bannerPrompt.trim() ? "not-allowed" : "pointer"}
                        >
                          Generate Banner
                        </button>
                      </div>
                    </>
                  )}

                  {/* ── Generating: single status line + canvas ─────────────── */}
                  {isGenerating && !animationComplete && (
                    <div className="space-y-2">
                      {/* Single combined line: spinner + time hint + typewriter */}
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full border-[2.5px] border-black border-t-transparent animate-spin flex-shrink-0"></span>
                        <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest flex-shrink-0">2–3 min</span>
                        <span className="text-zinc-300 flex-shrink-0">|</span>
                        <LoadingTypewriter />
                      </div>

                      {/* Canvas animation — only when both reference images are uploaded */}
                      {styleReferencePreview && objectReferencePreview && (
                        <BannerGenerationAnimation
                          styleRefSrc={styleReferencePreview}
                          objectRefSrc={objectReferencePreview}
                          outputSrc={generatedImageUrl}
                          onComplete={handleAnimationComplete}
                        />
                      )}
                    </div>
                  )}

                  {/* ── Result: banner fetched from Supabase URL ─────────────────── */}
                  {animationComplete && (
                    <div className="space-y-2">
                      {showOutputLabel && <LabelTypewriter label="4. Output" />}
                      {generatedImageUrl && (
                        <div className="border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={generatedImageUrl}
                            alt="Generated banner"
                            className="w-full h-auto object-contain max-h-[360px]"
                            onError={(e) => {
                              // If the URL fails to load, show a fallback message
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                              const parent = (e.currentTarget as HTMLImageElement).parentElement;
                              if (parent) parent.innerHTML = `<p class="p-4 font-mono text-sm text-red-600">Could not load image from: ${generatedImageUrl}</p>`;
                            }}
                          />
                        </div>
                      )}
                      {generatedImageUrl && (
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                          <span className="text-green-700 font-bold uppercase tracking-wide">✓ Banner ready</span>
                          <a
                            href={generatedImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-black truncate max-w-[260px]"
                          >
                            open full size ↗
                          </a>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setIsGenerating(false);
                          setAnimationComplete(false);
                          setGeneratedImageUrl(null);
                          setBannerError(null);
                        }}
                        className="w-full py-4 border-[3px] border-black bg-black text-white font-header font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center hover:bg-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                        data-cursor="pointer"
                      >
                        Regenerate
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================= */}
              {/* SLIDE 4: PROJECT SHOWCASE               */}
              {/* ======================================= */}
              {step === 3 && (
                <div className="flex flex-col flex-1 space-y-8">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-center bg-[#f2f2f2] border-b-4 border-black pb-4 -mx-6 -mt-6 p-6 mb-2">
                      <label className="block text-xl font-header font-black uppercase tracking-wider text-black">Feature Screenshots & GIF ({screenshots.length})</label>
                      <button
                        onClick={addScreenshotSlot}
                        className="px-4 py-2 bg-black text-white border-[3px] border-black font-bold uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                        data-cursor="pointer"
                      >
                         <UploadCloud className="w-4 h-4"/> Add Img/GIF
                      </button>
                    </div>

                    {/* Dynamic Upload Slots */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4 scrollable relative">
                      <AnimatePresence mode="popLayout">
                        {screenshots.length === 0 && (
                          <motion.div
                            key="empty"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="col-span-full border-[3px] border-dashed border-zinc-400 p-12 text-center text-zinc-500 font-bold uppercase tracking-widest mt-4"
                          >
                            No Assets added yet.
                          </motion.div>
                        )}
                        {screenshots.map((shot) => (
                          <motion.div
                            key={shot.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col group overflow-hidden relative"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeScreenshotSlot(shot.id);
                              }}
                              className="absolute top-2 right-2 w-7 h-7 bg-white border-2 border-black flex items-center justify-center font-bold text-xs hover:bg-red-500 hover:text-white transition-colors z-20 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                              data-cursor="pointer"
                              title="Remove Slot"
                            >
                              ✕
                            </button>
                            <div
                              className="h-32 border-b-[3px] border-black flex items-center justify-center p-4 transition-colors cursor-pointer bg-[#f8f8f8] hover:bg-[#e0e0e0] relative group"
                              onClick={(e) => {
                                const input = e.currentTarget.querySelector('input');
                                input?.click();
                              }}
                              data-cursor="pin"
                            >
                              <input
                                type="file"
                                accept="image/png, image/gif"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleScreenshotUpload(shot.id, file);
                                }}
                              />
                              {shot.preview ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={shot.preview} alt={shot.name} className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <UploadCloud className="w-5 h-5 text-white" />
                                    <span className="text-white font-bold text-xs uppercase tracking-wide">Change</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center opacity-60 group-hover:opacity-100 transition-opacity">
                                  <UploadCloud className="w-8 h-8 text-black mx-auto mb-2" />
                                  <span className="font-header font-bold text-sm uppercase">Upload Img/GIF</span>
                                </div>
                              )}
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
                      onClick={handleGenerateReadme}
                      disabled={isGeneratingReadme}
                      className="w-full py-6 bg-white border-[3px] border-black text-black font-header font-black text-3xl uppercase tracking-widest hover:bg-black hover:text-white hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.5)] transition-all shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                      data-cursor={isGeneratingReadme ? "not-allowed" : "pointer"}
                    >
                      {isGeneratingReadme ? (
                        <span className="flex items-center justify-center gap-4">
                          <span className="w-8 h-8 rounded-full border-4 border-black border-t-transparent animate-spin"></span>
                          GENERATING...
                        </span>
                      ) : (
                        "GENERATE README"
                      )}
                    </button>
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
            disabled={step === 3 || (step === 1 && !preferencesSaved) || (step === 2 && isGenerating)}
            className={`px-6 py-3 border-[3px] border-black font-bold uppercase disabled:pointer-events-none transition-colors active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_rgba(0,0,0,1)] ${step === 3 ? 'opacity-0' : (step === 1 && !preferencesSaved) || (step === 2 && isGenerating) ? 'bg-[#f2f2f2] text-zinc-400 border-zinc-400 shadow-none' : 'bg-black text-white hover:bg-zinc-800'}`}
            data-cursor={(step === 1 && !preferencesSaved) || (step === 2 && isGenerating) ? "not-allowed" : "pointer"}
          >
            {step === 1 && !preferencesSaved ? "Save Required" : step === 2 && isGenerating ? "Generating..." : "Next Step →"}
          </button>
        </div>

      </div>
    </div>
  );
}
