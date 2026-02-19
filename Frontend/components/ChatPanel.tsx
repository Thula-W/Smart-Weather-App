import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, WeatherResponse, ChatFlavor } from '../types';
import { chatService } from '../services/chat.services';

interface ChatPanelProps {
  weatherContext: WeatherResponse | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ weatherContext }) => {
  const [flavor, setFlavor] = useState<ChatFlavor>('Default');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Separate memories
  const [responseIds, setResponseIds] = useState<Record<ChatFlavor, string | undefined>>({
    Default: undefined,
    Historian: undefined
  });

  const [messageMap, setMessageMap] = useState<Record<ChatFlavor, ChatMessage[]>>({
    Default: [
      {
        role: 'assistant',
        content: "Hi, I'm Breeze, your personal weather assistant. How can I help you today?",
        timestamp: new Date()
      }
    ],
    Historian: [
      {
        role: 'assistant',
        content: "Hi I’m Sunny, born on a crisp January 2, 1979 morning, and I’ve been faithfully remembering the weather of every single day since that very first breath.",
        timestamp: new Date()
      }
    ]
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const messages = messageMap[flavor];
  const previousResponseId = responseIds[flavor];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !weatherContext) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    // Add user message to current flavor
    setMessageMap(prev => ({
      ...prev,
      [flavor]: [...prev[flavor], userMessage]
    }));

    setInput('');
    setLoading(true);

    try {
      const { result, lastResponseId } = await chatService.sendMessage(
        input,
        flavor === 'Default' ? weatherContext.currentWeather : null,
        flavor === 'Default' ? weatherContext.dailyForecast : null,
        previousResponseId,
        flavor
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result,
        timestamp: new Date(),
        responseId: lastResponseId
      };

      // Update messages for current flavor
      setMessageMap(prev => ({
        ...prev,
        [flavor]: [...prev[flavor], assistantMessage]
      }));

      // Update responseId for current flavor
      setResponseIds(prev => ({
        ...prev,
        [flavor]: lastResponseId
      }));

    } catch (error: any) {
      setMessageMap(prev => ({
        ...prev,
        [flavor]: [
          ...prev[flavor],
          {
            role: 'assistant',
            content: error.message || "Something went wrong. Try again.",
            timestamp: new Date()
          }
        ]
      }));
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div ref={panelRef} className="h-full max-h-[70vh] flex flex-col bg-white/10 rounded-2xl border border-white/20">

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between">
          <h3 className="font-bold text-lg text-white px-3 py-1">
            {flavor === 'Historian' ? 'Sunny 🧙🏻‍♀️' : 'Breeze 🌬️'}
          </h3>

          <div className="flex bg-white/10 p-1 rounded-xl">
            {(['Default', 'Historian'] as ChatFlavor[]).map(f => (
              <button
                key={f}
                onClick={() => setFlavor(f)}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  flavor === f ? 'bg-white text-slate-900' : 'text-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/10 text-white'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-white/50 text-sm">Thinking...</div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${flavor}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 bg-sky-500 text-white rounded-xl"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatPanel;