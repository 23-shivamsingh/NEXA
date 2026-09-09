import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily with telemetry header
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiEnabled: !!process.env.GEMINI_API_KEY,
  });
});

// AI Social Concierge Endpoint
app.post("/api/concierge", async (req, res) => {
  try {
    const { action, query, context, intent } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Return high quality contextual fallback responses when API key is not configured
      return res.json({
        success: true,
        source: "local-heuristic",
        response: generateFallbackConciergeResponse(
          action,
          query,
          intent,
          context,
        ),
      });
    }

    const systemPrompt = `You are the NEXA Social Concierge for an avant-garde, anti-feed social platform where users connect through real-time moments, living spaces, and collaborative intent rather than followers or likes.
Key themes:
- "Don't follow people. Follow moments."
- Intent-based discovery (CREATE, DISCOVER, CONNECT, LEARN, PLAY, HELP, JUST VIBE).
- Living Spaces are collaborative real-time ephemeral environments (ideas, moodboards, playlists, ambient discussions).
- Ghost mode is available for low-pressure anonymous entry.
Keep answers conversational, empathetic, concise, and actionable. Format with clean bullet points or short paragraphs where appropriate.`;

    let userPrompt = "";
    if (action === "recommend-spaces") {
      userPrompt = `The user has intent "${intent || "CONNECT"}" and states: "${query}". Contextual moments available: ${JSON.stringify(context?.moments?.slice(0, 8) || [])}. Suggest 2 to 3 best spaces/moments to join, explain why they click, and suggest whether they should enter as themselves or in Ghost Mode.`;
    } else if (action === "icebreaker") {
      userPrompt = `The user is entering space "${context?.spaceTitle || "Living Space"}" with intent "${intent || "CONNECT"}". Generate 3 thoughtful, natural, non-cringe conversation starters or collaborative contribution ideas.`;
    } else if (action === "summarize-space") {
      userPrompt = `Summarize the collaborative activity and ideas generated in space "${context?.spaceTitle}": Ideas: ${JSON.stringify(context?.ideas || [])}, Chat/Echoes: ${JSON.stringify(context?.activities || [])}. Provide a cohesive 2-sentence highlight and 3 key takeaways.`;
    } else if (action === "synthesize-ideas") {
      userPrompt = `The participants in space "${context?.spaceTitle}" contributed these ideas: ${JSON.stringify(context?.ideas || [])}. Synthesize these into a creative hybrid concept or actionable next step for the room.`;
    } else {
      userPrompt = `User question or social desire: "${query}". Current intent: "${intent || "JUST VIBE"}". Guide them to the best social interaction, space, or collaboration on NEXA right now.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return res.json({
      success: true,
      source: "gemini",
      response:
        response.text ||
        "I found some great active moments for you in the Orbit.",
    });
  } catch (error: unknown) {
    console.error("Gemini Concierge API error:", error);
    // Graceful fallback
    const { action, query, intent, context } = req.body;
    return res.json({
      success: true,
      source: "fallback",
      response: generateFallbackConciergeResponse(
        action,
        query,
        intent,
        context,
      ),
    });
  }
});

interface ConciergeContext {
  spaceTitle?: string;
  moments?: Array<{ id: string; title: string; intent?: string }>;
  ideas?: Array<{ id: string; title: string; author?: string }>;
  activities?: Array<{ id: string; text?: string; user?: string }>;
}

function generateFallbackConciergeResponse(
  action: string,
  query?: string,
  intent?: string,
  context?: ConciergeContext,
): string {
  const currentIntent = intent || "CONNECT";
  if (action === "icebreaker") {
    const space = context?.spaceTitle || "this Living Space";
    return `Here are 3 natural entry sparks for ${space}:
• "Hey everyone — hopping in while working on this! What drew each of you into this space tonight?"
• "Curious what everyone's favorite tool or unexpected approach has been recently?"
• "Happy to test or brainstorm on whatever is currently being built!"`;
  }
  if (action === "summarize-space") {
    return `⚡ Space Summary: The participants gathered around exploratory brainstorming, trading 4 unique angles and remixing the core concept. Key takeaway: High resonance on intuitive spatial interfaces and low-pressure ambient audio.`;
  }
  if (action === "synthesize-ideas") {
    return `✨ Hybrid Concept: By combining the visual moodboard with the ambient soundscape idea, you create an "Atmospheric Canvas" — where each collaborator's cursor leaves an acoustic ripple.`;
  }
  if (query && query.toLowerCase().includes("photography")) {
    return `I found 3 low-pressure moments in your Orbit right now:
• "Street Photography Walk" — 8 participants active, dusk lighting theme
• "Tokyo Neon Moodboard" — 5 participants, sharing 35mm film scans
• "Critique Without Ego" — 11 participants

Tip: You can enter in Ghost Mode (🌫️ Anonymous) if you prefer to observe first before sharing your shots!`;
  }
  if (
    query &&
    (query.toLowerCase().includes("code") ||
      query.toLowerCase().includes("react") ||
      query.toLowerCase().includes("build"))
  ) {
    return `Great energy for building. In your Orbit right now:
• "Let's build something" — 8 developers & designers in a collaborative scratchpad
• "Late Night Hackers Room" — 12 active builders sharing snippets
• "React 19 Server Components Jam" — 6 people experimenting with micro-demos

Recommendation: Jump into the "Let's build something" space — they currently need an extra collaborator for state management!`;
  }
  return `Based on your intent "${currentIntent}", I've oriented your Orbit toward active living spaces with matching energy. 
• Check the glowing cyan nodes for real-time collaboration.
• Enter in Ghost Mode if you want to explore freely with zero social anxiety.
• Resonate with an "Echo" to let creators know their moment moved you!`;
}

// Start server with Vite middleware in dev or static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
