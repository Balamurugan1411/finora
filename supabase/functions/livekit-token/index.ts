import { serve } from "std/http/server";
import { AccessToken } from "livekit-server-sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LIVEKIT_API_KEY");
    const apiSecret = Deno.env.get("LIVEKIT_API_SECRET");

    if (!apiKey || !apiSecret) {
      console.error("Missing LiveKit credentials");
      return new Response(
        JSON.stringify({ error: "LiveKit API credentials not configured on server" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { room = "finora-room", identity = `user-${Math.random().toString(36).substring(7)}` } = await req.json().catch(() => ({}));

    // Create Access Token
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
    });
    
    // Add grants
    at.addGrant({ 
      roomJoin: true, 
      room: room,
      canPublish: true,
      canSubscribe: true 
    });

    return new Response(JSON.stringify({ token: at.toJwt() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Token generation error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
