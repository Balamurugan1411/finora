import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const OLLAMA_URL = "http://localhost:11434/api/chat";

const quickQuestions = [
  'How can I save more tax?',
  'Can I afford a ₹15L car?',
  'How to start investing?',
  'What is SIP and how does it work?',
  'Should I pay off loans first or invest?',
];

const Chat = () => {
  const { data } = useFinancialData();
  const [searchParams] = useSearchParams();
  const [useOllama, setUseOllama] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '### 👋 Hi! I\'m **FINORA**, your Neural Money Mentor.\n\nI am currently connected to your **Local GPT-OSS Node (Ollama)**.\n\nI can help you with:\n- 💰 **Tax planning** strategies\n- 🚗 **Purchase decisions**\n- 📈 **Investment guidance**\n- 💳 **Debt management**' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && messages.length === 1) {
      sendMessage(query);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: 'user', content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsTyping(true);

    let assistantSoFar = '';

    try {
      if (useOllama) {
        // Local Ollama Implementation
        const response = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "gpt-oss:20b-cloud",
            messages: [
              {
                role: 'system',
                content: `You are FINORA, a Master Financial Agent. 
                Context: ${JSON.stringify(data)}. 
                Rules: Use ₹ and Indian Numbering. Be tactical. Short responses.`
              },
              ...allMessages.map(m => ({ role: m.role, content: m.content }))
            ],
            stream: true,
          }),
        });

        if (!response.ok) throw new Error("Ollama node offline");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last partial line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                assistantSoFar += json.message.content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant' && last.content !== messages[0].content) {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                  }
                  return [...prev, { role: 'assistant', content: assistantSoFar }];
                });
              }
            } catch (e) {
              console.warn("Stream parse error", e);
            }
          }
        }
      } else {
        // Fallback to Supabase Edge Function
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages.filter(m => m.role !== 'assistant' || m !== messages[0]).map(m => ({
              role: m.role,
              content: m.content,
            })),
            financialContext: data.monthlyIncome > 0 ? data : null,
          }),
        });

        if (!resp.ok) throw new Error(`Cloud Node Error: ${resp.status}`);

        const reader = resp.body?.getReader();
        const decoder = new TextDecoder();
        let textBuffer = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantSoFar += content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === 'assistant' && prev.length > 1 && last !== messages[0]) {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                  }
                  return [...prev, { role: 'assistant', content: assistantSoFar }];
                });
              }
            } catch {
              textBuffer = line + '\n' + textBuffer;
              break;
            }
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Node Failure');
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ **Intelligence Node Memory Mismatch.**\n\nIt looks like your system needs a more lightweight model. Close other apps and run this in your terminal to install the optimized node:\n\n```powershell\nollama pull gpt-oss:20b-cloud\n```\n\nThen refresh this page.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border-border"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-widest uppercase">Finora <span className="gradient-text">Chat</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <p className="text-[10px] font-black text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-widest">Neural Cluster Active • V4.2.0</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end gap-1">
            <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Intelligence Node</p>
            <button
              onClick={() => setUseOllama(!useOllama)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${useOllama ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/10 border-accent/20 text-accent'}`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${useOllama ? 'bg-primary' : 'bg-accent'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{useOllama ? 'Local (Ollama)' : 'Cloud Controller'}</span>
            </button>
          </div>
          <div className="h-10 w-[1px] bg-border mx-2" />
          <div className="hidden md:flex flex-col items-end gap-1">
            <p className="text-[10px] font-black tracking-widest text-muted-foreground/80 dark:text-muted-foreground uppercase">Context Precision</p>
            <div className="px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-bold text-foreground">
              {data.monthlyIncome > 0 ? 'Full Profile' : 'General'}
            </div>
          </div>
        </div>
      </motion.div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 space-y-8 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-3 rounded-2xl h-fit shrink-0 shadow-2xl ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary border border-border'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-accent" />}
            </div>
            <div className={`premium-card p-6 md:p-8 max-w-[85%] lg:max-w-[75%] transition-all duration-300 group hover:border-primary/20 ${msg.role === 'user' ? 'bg-primary/5 border-primary/20 ml-12' : 'bg-card mr-12'}`}>
              <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed [&_h3]:text-lg [&_h3]:font-black [&_h3]:mt-0 [&_h3]:mb-4 [&_p]:text-foreground/80 [&_strong]:text-foreground [&_strong]:font-black [&_li]:text-foreground/80 [&_table]:text-xs [&_th]:text-foreground [&_td]:text-muted-foreground [&_blockquote]:border-primary/30 [&_blockquote]:bg-primary/5 [&_blockquote]:p-4 [&_blockquote]:rounded-xl">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
            <div className="p-3 rounded-2xl bg-secondary border border-border h-fit shrink-0">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div className="premium-card px-8 py-5 bg-card">
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar scrollbar-hide px-1">
          {quickQuestions.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-card text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all border border-border shadow-lg shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="relative group z-10 pb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition duration-700 pointer-events-none" />
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
            className="relative flex gap-4 p-2 bg-card border border-border/80 focus-within:border-primary transition-all shadow-xl rounded-[1.5rem]"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask FINORA anything..."
              className="flex-1 bg-background/50 border border-border/30 focus:border-primary/50 px-6 h-14 rounded-xl text-foreground font-medium"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`h-14 w-14 rounded-2xl transition-all shrink-0 ${input.trim() && !isTyping
                ? 'bg-primary text-white hover:bg-primary/90 shadow-lg active:scale-95'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>
        <p className="text-[9px] font-black text-muted-foreground/80 dark:text-muted-foreground text-center uppercase tracking-[0.3em] dark:opacity-40">Educational Guidance Node • Protocol Secured</p>
      </div>
    </div>
  );
};

export default Chat;
