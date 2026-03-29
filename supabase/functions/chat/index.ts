import { serve } from "std/http/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, financialContext } = await req.json();
    
    // Check for Groq API Key (Open Source Llama 3) or Fallback to Lovable Gateway
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const systemPrompt = `You are FINORA, the Master Financial Intelligence Agent for the Indian market.
    You use an Open Source Neural Engine (Llama 3) to provide hyper-personalized financial mentoring.

    STRUCTURAL FORMAT FOR EVERY RESPONSE:
    1. 💓 THE PULSE: A one-sentence summary of the user's current status vs goals.
    2. 🧠 THE LOGIC: The mathematical reasoning behind your next suggestion.
    3. ⚡ THE WHAT-IF: Use numbers to show what happens if they follow your advice vs not.
    4. 🛠️ THE ACTION: 3 clear, numbered steps they must take today.
    
    LANGUAGE RULES:
    - Respond strictly in the language of the user (English or Hindi).
    - Do not provide direct translations in both languages within a single response unless requested.
    - If the user switches language, match their switch.

    AGENTIC RULES:
    - Never give specific stock/fund names. Use broad categories (e.g., "Index Funds", "T-Bills").
    - Always use Indian Rupee (₹) and Indian numbering system (Lakh/Crore).
    - If user asks for "unlicensed advice", strictly redirect to mathematical analysis.
    - Be aggressive about wealth building but conservative about risk.
    - Reference specific Indian slabs/instruments like NPS, EPF, VPF, PPF, Section 80C.

    USER PROFILE DATA (LIVE ENGINE CONTEXT):
    ${financialContext ? JSON.stringify(financialContext, null, 2) : "NO LIVE DATA FOUND. Onboard user via Health Score wizard."}

    MODELS IN USE: Primary Brain: Llama 3 (Open Source via Groq/Gateway). Voice: Master Engine.
    
    ⚠️ END EVERY RESPONSE WITH: 
    "System Ref: Agent v2.3 Beta. FINORA is an AI Assistant, not a SEBI-registered advisor. Data is educational intelligence only."`;

    const apiEndpoint = GROQ_API_KEY 
        ? "https://api.groq.com/openai/v1/chat/completions" 
        : "https://ai.gateway.lovable.dev/v1/chat/completions";
    
    const apiKey = GROQ_API_KEY || LOVABLE_API_KEY;
    const model = GROQ_API_KEY ? "llama3-70b-8192" : "google/gemini-2.0-flash-exp:free";

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Provider Error:", response.status, errorText);
      throw new Error(`AI service failure: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Agentic Core Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
