import React, { useState, useEffect, useRef } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  BarVisualizer,
  useVoiceAssistant,
} from '@livekit/components-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Settings, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinancialData } from '@/lib/financial-context';
import { toast } from 'sonner';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

// Common UI layout for both engines
const BaseVoiceAssistantUI = ({ onSettingsClick, mode, state, transcripts, data }: any) => (
  <div className="flex flex-col h-full bg-transparent">
    <div className="flex items-center justify-between shrink-0">
      <div>
        <h3 className="font-bold text-lg gradient-text">Finora Voice Mentor</h3>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${state === 'speaking' ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            {mode === 'native' ? 'NATIVE ENGINE' : 'LIVEKIT ENGINE'} • {state?.toUpperCase()}
          </p>
        </div>
      </div>
      <button onClick={onSettingsClick} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
        <Settings className="w-4 h-4" />
      </button>
    </div>

    <div className="flex-1 flex flex-col gap-4 overflow-hidden py-4">
      <div className="flex flex-col items-center justify-center gap-4 shrink-0">
        <div className="relative">
          <motion.div
            animate={state === 'speaking' ? { scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-primary/30 rounded-full blur-3xl"
          />
          <BarVisualizer className="w-64 h-20" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {transcripts.length === 0 || !transcripts[0]?.text ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center px-6">
              <MessageSquare className="w-8 h-8 text-muted-foreground/20 mb-2" />
              <p className="text-xs text-muted-foreground italic">"I'm listening. Ask me about your budget or taxes."</p>
            </motion.div>
          ) : (
            transcripts.slice(-3).map((t: any) => (
              <motion.div key={t.id || Math.random()} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-secondary/30 border border-border/40 p-3 rounded-xl text-sm">
                <p className="text-foreground leading-relaxed">{t.text}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>

    <div className="shrink-0 mt-auto pt-4 border-t border-border/20">
      <div className="p-1 bg-secondary/50 rounded-2xl border border-white/5 flex items-center justify-center h-12">
        {mode === 'livekit' ? <VoiceAssistantControlBar controls={{ leave: false }} /> : <p className="text-xs font-bold text-accent animate-pulse">NATIVE VOICE CONTROL ACTIVE</p>}
      </div>
      <p className="text-[9px] text-muted-foreground/60 text-center mt-3 uppercase tracking-tighter font-mono">
        Context: {data.monthlyIncome > 0 ? 'Full Financial Access' : 'General'}
      </p>
    </div>
  </div>
);

// Wrapper that safely uses the LiveKit hook
const LiveKitUIWrapper = ({ onSettingsClick }: { onSettingsClick: () => void }) => {
  const lk = useVoiceAssistant();
  const { data } = useFinancialData();
  return (
    <BaseVoiceAssistantUI
      onSettingsClick={onSettingsClick}
      mode="livekit"
      state={lk.state}
      transcripts={lk.agentTranscriptions}
      data={data}
    />
  );
};

export const LiveKitVoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [mode, setMode] = useState<'livekit' | 'native'>('native');
  const [isConnecting, setIsConnecting] = useState(false);
  const { data } = useFinancialData();

  // Native Engine State
  const [nativeTranscript, setNativeTranscript] = useState('');
  const [nativeState, setNativeState] = useState<'connected' | 'listening' | 'speaking'>('connected');
  const recognitionRef = useRef<any>(null);

  const [url, setUrl] = useState(() => localStorage.getItem('lk_url') || import.meta.env.VITE_LIVEKIT_URL || '');
  const [token, setToken] = useState(() => localStorage.getItem('lk_token') || import.meta.env.VITE_LIVEKIT_TOKEN || '');

  useEffect(() => {
    localStorage.setItem('lk_url', url);
    localStorage.setItem('lk_token', token);
  }, [url, token]);

  const handleNativeVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Browser doesn't support Voice recognition. Use Chrome.");
      return;
    }

    if (nativeState === 'listening') {
      recognitionRef.current?.stop();
      setNativeState('connected');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Optimized for Indian English

      recognitionRef.current.onstart = () => {
        setNativeState('listening');
        setNativeTranscript('');
        console.log("Speech recognition started");
      };

      recognitionRef.current.onresult = async (event: any) => {
        const results = Array.from(event.results) as any[];
        const transcript = results.map(r => r[0].transcript).join('');
        setNativeTranscript(transcript);

        if (results[results.length - 1].isFinal) {
          console.log("Final transcript detected:", transcript);
          recognitionRef.current.stop();
          await processQuery(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setNativeState('connected');
      };

      recognitionRef.current.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        if (e.error !== 'no-speech') {
          toast.error(`System: ${e.error}. Check mic settings.`);
        }
        setNativeState('connected');
      };
    }

    setNativeState('listening');
    recognitionRef.current.start();
  };

  const processQuery = async (query: string) => {
    setNativeState('speaking');
    setNativeTranscript("Thinking...");
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }],
          financialContext: data.monthlyIncome > 0 ? data : null,
        }),
      });

      if (!response.ok) throw new Error("AI failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullText += content;
                  setNativeTranscript(fullText);
                }
              } catch (e) { }
            }
          }
        }
      }

      // Remove thinking tags and markdown characters for cleaner speech
      const cleanText = fullText
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Remove <think>...</think>
        .replace(/[*#]/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
      setNativeState('speaking');
      utterance.onend = () => setNativeState('connected');
    } catch (e) {
      toast.error("Voice processing error");
      setNativeState('connected');
    }
  };

  const startLiveKit = async () => {
    if (!token) {
      setIsConnecting(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/livekit-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ room: 'finora-main' }),
        });
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          setMode('livekit');
          setIsOpen(true);
        } else {
          setShowConfig(true);
        }
      } catch (e) {
        setShowConfig(true);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setMode('livekit');
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else if (mode === 'native') setIsOpen(true);
            else startLiveKit();
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-destructive/10 border-2 border-destructive' : 'bg-primary border-2 border-primary/50'
            }`}
        >
          {isConnecting ? <Loader2 className="w-8 h-8 animate-spin text-primary-foreground" /> : isOpen ? <X className="w-8 h-8 text-destructive" /> : <Mic className="w-8 h-8 text-primary-foreground" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-24 right-6 w-80 lg:w-[400px] glass-panel p-6 z-50 border-primary/30 flex flex-col h-[520px]">
            {mode === 'livekit' && token ? (
              <LiveKitRoom serverUrl={url || import.meta.env.VITE_LIVEKIT_URL} token={token} connect={true} audio={true} onDisconnected={() => setIsOpen(false)}>
                <LiveKitUIWrapper onSettingsClick={() => setShowConfig(true)} />
                <RoomAudioRenderer />
              </LiveKitRoom>
            ) : (
              <>
                <BaseVoiceAssistantUI
                  onSettingsClick={() => setShowConfig(true)}
                  mode="native"
                  state={nativeState}
                  transcripts={nativeTranscript ? [{ id: '1', text: nativeTranscript }] : []}
                  data={data}
                />
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={handleNativeVoice} disabled={nativeState !== 'connected'}>
                    {nativeState === 'listening' ? "Listening..." : "Push to Talk"}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {showConfig && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed bottom-24 right-6 w-80 lg:w-96 glass-panel p-8 z-50 shadow-2xl">
            <h3 className="font-bold text-lg mb-6 tracking-tight">Voice Settings</h3>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${mode === 'native' ? 'border-primary bg-primary/5' : 'border-border bg-secondary/20'}`}
                onClick={() => setMode('native')}
              >
                <p className="font-bold text-sm">Native Browser Engine</p>
                <p className="text-[10px] text-muted-foreground mt-1">Free, zero-token, open-source fallback.</p>
              </div>
              <div
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${mode === 'livekit' ? 'border-primary bg-primary/5' : 'border-border bg-secondary/20'}`}
                onClick={() => setMode('livekit')}
              >
                <p className="font-bold text-sm">LiveKit Master Engine</p>
                <p className="text-[10px] text-muted-foreground mt-1">High performance, real-time agent (requires backend).</p>
              </div>
              <div className="pt-4 border-t border-border/50 mt-4">
                <Button className="w-full h-11" onClick={() => setShowConfig(false)}>Confirm Selection</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveKitVoiceAssistant;
