"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

// ── Context ───────────────────────────────────────────────────────────────────

type ContactModalCtx = {
  open: () => void;
  close: () => void;
};

const ContactModalContext = createContext<ContactModalCtx>({
  open: () => {},
  close: () => {},
});

export function useContactModal() {
  return useContext(ContactModalContext);
}

// ── Provider + Modal ──────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  inquiryOptions?: string[];
  contactEmail?: string;
  showEmail?: boolean;
}

export function ContactModalProvider({ children, inquiryOptions = [], contactEmail = "hello@aura.studio", showEmail = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ open, close }}>
      {children}
      <ContactModal
        isOpen={isOpen}
        onClose={close}
        inquiryOptions={inquiryOptions}
        contactEmail={contactEmail}
        showEmail={showEmail}
      />
    </ContactModalContext.Provider>
  );
}

// ── Modal UI ──────────────────────────────────────────────────────────────────

function ContactModal({
  isOpen, onClose, inquiryOptions, contactEmail, showEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  inquiryOptions: string[];
  contactEmail: string;
  showEmail: boolean;
}) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [interest, setInterest] = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const reset = () => {
    setName(""); setEmail(""); setInterest(""); setMessage("");
    setSent(false);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 400); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, interest, message }),
    }).catch(() => {});

    setLoading(false);
    setSent(true);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm placeholder-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all font-sans";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 16, scale: 0.98  }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-card/95 backdrop-blur-2xl border border-border/60 rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden">

              {/* Gradient top bar */}
              <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary/0" />

              {/* Header */}
              <div className="flex items-start justify-between px-8 pt-7 pb-2">
                <div>
                  <h2 className="font-outfit text-2xl font-bold text-foreground">
                    {sent ? "Message sent!" : "Get in Touch"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sent
                      ? "We'll get back to you within 24 hours."
                      : "Tell us what you need — we'll reach out within 24 hours."}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-4"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 pb-8 pt-4">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 gap-4"
                  >
                    <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-muted-foreground text-sm text-center">
                      We&apos;ve received your message and will reply to <strong className="text-foreground">{email}</strong> soon.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your name"
                          className={inputCls}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email <span className="text-destructive">*</span></label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* What they want */}
                    {inquiryOptions.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What are you looking for?</label>
                        <select
                          value={interest}
                          onChange={e => setInterest(e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Select an option…</option>
                          {inquiryOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Tell us more about what you need…"
                        rows={4}
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
                    >
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                        : <>Send Message <ArrowRight className="w-4 h-4" /></>}
                    </button>

                    {showEmail && (
                      <p className="text-xs text-muted-foreground/50 text-center">
                        Or email us directly at{" "}
                        <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a>
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
