"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { from: "bot" | "user"; text: string };

interface Props {
  config?: Record<string, string>;
}

const QUICK_ACTIONS = ["Our services", "Academy programs", "Contact us", "Interview prep"];

export function ChatbotWidget({ config = {} }: Props) {
  const enabled      = config.chatbot_enabled       !== "false";
  const botName      = config.chatbot_name          ?? "Aura Assistant";
  const greeting     = config.chatbot_greeting      ?? "Hi! 👋 Ask me about our services, academy programs, or anything else!";
  const contactEmail = config.chatbot_contact_email ?? config.footer_contact_email ?? "hello@aura.studio";

  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: greeting }]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ from: "bot", text: greeting }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeting]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, typing]);

  if (!enabled) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    setMessages(prev => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, contactEmail }),
      });
      const data = await res.json() as { reply: string };
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: "bot", text: `Sorry, something went wrong. Email us at ${contactEmail}.` }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 w-[350px] h-[520px] bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-background/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-outfit font-bold text-primary-foreground text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-foreground text-sm">{botName}</h3>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                    Online now
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  disabled={typing}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-border border border-border/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-background/80 border-t border-border/50 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  disabled={typing}
                  className="flex-1 bg-muted/50 border border-border rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:border-primary/50 text-sm transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  className="absolute right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-foreground text-background rounded-full shadow-[0_0_40px_-10px_var(--color-primary)] flex items-center justify-center group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {isOpen ? <X className="w-7 h-7 relative z-10" /> : <MessageCircle className="w-7 h-7 relative z-10" />}
      </motion.button>
    </div>
  );
}
