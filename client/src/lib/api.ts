const N8N_BASE_URL = "/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RepoInfo {
  owner: string;
  repo: string;
  is_private: boolean;
  language: string;
  stars: number;
  description: string;
}

export interface InitializeResponse {
  success: boolean;
  session_id: string;
  repo_info: RepoInfo;
}

export interface ChatResponse {
  revised_readme?: string;
  version?: number;
  message?: string;
}

export interface BannerResponse {
  success: boolean;
  bannerUrl: string;
}

export interface PushResponse {
  commit_url: string;
}

export interface Preferences {
  tone: string;
  sections: string[];
  badges: string[];
  include_toc: boolean;
  contact_info: string;
  support_link: string;
}

export interface ShowcaseItem {
  order: number;
  type: string;
  base64: string;
  description: string;
}

export interface BannerParams {
  user_prompt: string;
  style_reference: string;
  logo_image: string;
  banner_type: string;
  aspect_ratio?: string;
  logo_position?: string;
  logo_scale?: number;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function parseRepoUrl(
  url: string
): { owner: string; repo: string } | null {
  const trimmed = url.trim().replace(/\/+$/, "");

  // Match github.com/owner/repo or docugithub.com/owner/repo
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)/,
    /(?:https?:\/\/)?(?:www\.)?docugithub\.com\/([^/]+)\/([^/]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
  }

  // Also allow bare owner/repo format
  const bareMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (bareMatch) {
    return { owner: bareMatch[1], repo: bareMatch[2] };
  }

  return null;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Return only the base64 data portion (strip data:mime;base64, prefix)
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function calculateHMAC(
  body: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "sha256=" + hex;
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function initializeSession(
  repoUrl: string
): Promise<InitializeResponse> {
  const sessionId = generateSessionId();
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) throw new Error("Invalid repository URL");

  const response = await fetch(`${N8N_BASE_URL}/webhook/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repo_url: repoUrl,
      session_id: sessionId,
      user_id: `user_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Initialize failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data as InitializeResponse;
}

export async function analyzeRepo(sessionId: string): Promise<void> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      github_token: "",
    }),
  });

  if (response.status !== 202 && !response.ok) {
    throw new Error(`Analyze failed: ${response.statusText}`);
  }
}

export async function savePreferences(
  sessionId: string,
  preferences: Preferences
): Promise<void> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/preferences`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      preferences,
    }),
  });

  if (!response.ok) {
    throw new Error(`Save preferences failed: ${response.statusText}`);
  }
}

export async function generateReadme(
  sessionId: string,
  bannerUrl?: string
): Promise<string> {
  const body: Record<string, string> = { session_id: sessionId };
  if (bannerUrl) body.banner_url = bannerUrl;

  const response = await fetch(`${N8N_BASE_URL}/webhook/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Generate failed: ${response.statusText}`);
  }

  const data = await response.json();
  // The response may use different keys
  return data.raw_readme || data.output || data.readme || data.content || "";
}

export async function generateBanner(
  sessionId: string,
  params: BannerParams
): Promise<BannerResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

  try {
    const response = await fetch(`${N8N_BASE_URL}/webhook/generate-banner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_prompt: params.user_prompt,
        style_reference: params.style_reference,
        logo_image: params.logo_image,
        banner_type: params.banner_type,
        aspect_ratio: params.aspect_ratio || "16:9",
        logo_position: params.logo_position || "top-center",
        logo_scale: params.logo_scale ?? 1.0,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Generate banner failed: ${response.statusText}`);
    }

    const data = await response.json();
    const record = Array.isArray(data) ? data[0] : data;
    const bannerUrl =
      record?.final_banner_url ||
      record?.banner_url ||
      record?.bannerUrl ||
      "";

    return { success: !!bannerUrl, bannerUrl };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function uploadShowcase(
  sessionId: string,
  showcases: ShowcaseItem[]
): Promise<void> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/showcase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      showcases,
    }),
  });

  if (!response.ok) {
    throw new Error(`Upload showcase failed: ${response.statusText}`);
  }
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  currentReadme: string,
  sectionContext: string
): Promise<ChatResponse> {
  const bodyObj = {
    session_id: sessionId,
    message,
    current_readme: currentReadme,
    section_context: sectionContext,
  };

  const bodyStr = JSON.stringify(bodyObj);
  const secret =
    (typeof window !== "undefined" &&
      localStorage.getItem("webhook_secret")) ||
    "your_webhook_secret_here";
  const signature = await calculateHMAC(bodyStr, secret);

  const response = await fetch(`${N8N_BASE_URL}/webhook/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-signature": signature,
    },
    body: bodyStr,
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }

  return (await response.json()) as ChatResponse;
}

export async function pushToGitHub(
  sessionId: string,
  readmeContent: string,
  commitMessage: string = "Update README.md via DocuGitHub"
): Promise<PushResponse> {
  const response = await fetch(`${N8N_BASE_URL}/webhook/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      readme_content: readmeContent,
      commit_message: commitMessage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Push failed: ${response.statusText}`);
  }

  return (await response.json()) as PushResponse;
}
