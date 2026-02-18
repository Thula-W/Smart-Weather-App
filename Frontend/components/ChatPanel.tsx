
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, WeatherResponse, ChatFlavor } from '../types';
import { chatService } from '../services/chat.services';

interface ChatPanelProps {
  weatherContext: WeatherResponse | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ weatherContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flavor, setFlavor] = useState<ChatFlavor>('Default');
  const [lastResponseId, setLastResponseId] = useState<string | undefined>();
  const [showBubble, setShowBubble] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm SkyCast AI. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [m.content]
      }));

      const { text, responseId } = await chatService.sendMessage(
        input, 
        weatherContext.currentWeather, 
        lastResponseId,
        // history, 
        flavor
      );
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        responseId: responseId
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLastResponseId(responseId);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Try again?",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToPanel = () => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {/* Floating Chat Bubble - Fixed to screen */}
      <button 
        onClick={scrollToPanel}
        className={`fixed bottom-8 right-8 z-[100] p-5 bg-sky-500 text-white rounded-full shadow-[0_10px_40px_rgba(14,165,233,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group border border-white/20 ${showBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
        aria-label="Open Chat"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100">AI Assistant</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      <div ref={panelRef} className="glass rounded-3xl flex flex-col transition-all duration-500 ease-in-out shadow-2xl overflow-hidden border border-white/10" 
           style={{ height: 'auto', maxHeight: '700px', minHeight: messages.length <= 1 ? '180px' : '450px' }}>
        
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${flavor === 'Historian' ? 'bg-orange-400' : 'bg-sky-400'}`} />
              <h3 className="font-bold text-white/90">{flavor === 'Historian' ? 'Sunny (Historian)' : 'SkyCast Assistant'}</h3>
            </div>
            {lastResponseId && <span className="text-[8px] text-white/30 font-mono mt-1 tracking-tighter uppercase">Response ID: {lastResponseId}</span>}
          </div>
          
          <div className="flex bg-white/10 p-1 rounded-xl">
            {(['Default', 'Historian'] as ChatFlavor[]).map(f => (
              <button 
                key={f}
                onClick={() => {
                  setFlavor(f);
                  setMessages([{ role: 'assistant', content: f === 'Historian' ? "Greetings! I am Sunny, keeper of weather chronicles. How may I enlighten you today?" : "Hi! I'm SkyCast AI. Ready to chat about the weather?", timestamp: new Date() }]);
                }}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${flavor === f ? 'bg-white text-slate-900 shadow-md' : 'text-white/60 hover:text-white'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 pb-12">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white' 
                  : 'bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cleaner Input Row */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${flavor}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-white/20 text-white"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatPanel;
