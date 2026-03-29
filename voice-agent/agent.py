import asyncio
import logging
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import VoiceAssistant
from livekit.plugins import openai, silero
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger("voice-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info("Starting voice assistant for job %s", ctx.job.id)
    
    # Connecting to the room
    await ctx.connect()

    # The VoiceAssistant provides a high-level API for building voice agents.
    # It integrates VAD, STT, LLM, and TTS in a single class.
    assistant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=openai.LLM(
            # Pointing to local Ollama running on your machine
            base_url="http://localhost:11434/v1",
            api_key="ollama", # Placeholder for local use
            model="gpt-oss:20b-cloud",
        ),
        tts=openai.TTS(),
        system_prompt="""You are FINORA, a friendly and professional AI Money Mentor for the Indian market.
        Your goal is to help users with financial planning, tax optimization, and wealth building.
        Always use Indian Rupee (₹) and follow safe financial guidance rules.
        Keep your responses concise and conversational for voice interaction.
        """
    )

    # Start the assistant and bind it to the room
    assistant.start(ctx.room)

    # When the user speaks, the assistant will automatically respond.
    await assistant.say("Namaste! I am your Finora AI Mentor. How can I help you today?")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
