"use client";

import {
  Bot,
  ChevronDown,
  GraduationCap,
  MessageCircle,
  RefreshCcw,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const quickQuestions = [
  "How can I apply for admission?",
  "What documents are required?",
  "Tell me about Apex Public School",
  "How can I contact the school?",
];

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I am **Apex AI**, your virtual school assistant. 🎓\n\nI can help you with admissions, academics, school information, documents, and contact details.\n\nHow may I help you today?",
};

function formatMessage(text: string) {
  return text.split("\n").map((line, index) => {
    const formattedLine = line.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    return (
      <span key={index} className="block min-h-[6px]">
        <span
          dangerouslySetInnerHTML={{
            __html: formattedLine,
          }}
        />
      </span>
    );
  });
}

export default function ApexAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    welcomeMessage,
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  function startNewChat() {
    setMessages([welcomeMessage]);
    setInput("");
    setLoading(false);
  }

  async function sendMessage(customMessage?: string) {
    const messageText = (customMessage ?? input).trim();

    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: messageText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong. Please try again."
        );
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          data?.answer ||
          data?.message ||
          data?.output ||
          "I could not generate a response. Please try again.",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Apex AI error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I am unable to respond right now. Please try again in a moment or contact the school office.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      <style jsx global>{`
        .apex-ai-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .apex-ai-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .apex-ai-scrollbar::-webkit-scrollbar-thumb {
          background: #c9a45c;
          border-radius: 999px;
        }

        @keyframes apex-ai-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(201, 164, 92, 0.25);
          }

          50% {
            box-shadow: 0 0 0 9px rgba(201, 164, 92, 0);
          }
        }

        @keyframes apex-ai-message {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .apex-ai-message {
          animation: apex-ai-message 0.2s ease-out;
        }
      `}</style>

      <div className="fixed bottom-5 right-4 z-[9999] sm:bottom-6 sm:right-6">
        {isOpen && (
          <div
            className="mb-3 flex w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[24px] border border-[#d8c49a] bg-[#f8f5ee] shadow-[0_20px_70px_rgba(15,23,42,0.28)] sm:w-[390px]"
            style={{
              height: "min(650px, calc(100vh - 115px))",
              maxHeight: "650px",
            }}
          >
            <div className="relative shrink-0 overflow-hidden bg-[#101d35] px-5 py-4 text-white">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-[#c9a45c]/30" />
              <div className="absolute -right-1 -top-3 h-20 w-20 rounded-full border border-[#c9a45c]/20" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9a45c]/60 bg-[#c9a45c]/15">
                    <GraduationCap
                      size={23}
                      className="text-[#e6c878]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold tracking-wide">
                        Apex AI
                      </p>

                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        Online
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-slate-300">
                      Your school assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={startNewChat}
                    aria-label="Start new chat"
                    className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <RefreshCcw size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Apex AI"
                    className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="relative mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                <Sparkles size={13} className="text-[#e6c878]" />

                <p className="text-[10px] tracking-wide text-slate-300">
                  Ask questions about Apex Public School
                </p>
              </div>
            </div>

            <div className="apex-ai-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={`${index}-${message.role}`}
                      className={`apex-ai-message flex items-end gap-2 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101d35] text-[#e6c878]">
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[83%] rounded-2xl px-3.5 py-3 text-[13px] leading-6 ${
                          isUser
                            ? "rounded-br-md bg-[#101d35] text-white"
                            : "rounded-bl-md border border-[#e6dcc9] bg-white text-[#343b47]"
                        }`}
                      >
                        {formatMessage(message.content)}
                      </div>

                      {isUser && (
                        <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8d7ad] text-[#101d35]">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101d35] text-[#e6c878]">
                      <Bot size={14} />
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-[#e6dcc9] bg-white px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a45c]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a45c] [animation-delay:100ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c9a45c] [animation-delay:200ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {messages.length === 1 && !loading && (
              <div className="shrink-0 border-t border-[#e5ddce] bg-[#f8f5ee] px-3 py-3">
                <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c6b35]">
                  Popular questions
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="rounded-full border border-[#d9c8a7] bg-white px-3 py-1.5 text-left text-[10px] font-medium text-[#344054] transition hover:border-[#101d35] hover:bg-[#101d35] hover:text-white"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-[#e5ddce] bg-white p-3">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-2xl border border-[#ded5c5] bg-[#faf8f3] p-1.5 focus-within:border-[#c9a45c]"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Apex AI..."
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[13px] text-[#202b3c] outline-none placeholder:text-[#9b9b9b] disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#101d35] text-[#e6c878] transition hover:bg-[#1e3357] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </form>

              <p className="mt-2 text-center text-[9px] text-[#9b968d]">
                Apex AI can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        )}

        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-[#e6c878] bg-[#101d35] px-4 py-3 text-white shadow-[0_10px_35px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#1c3153] sm:px-5"
            style={{
              animation: "apex-ai-pulse 3s infinite",
            }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a45c]/20 text-[#e6c878]">
              <MessageCircle size={19} />
            </span>

            <span className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#e6c878]">
                Need help?
              </span>

              <span className="block text-[13px] font-semibold tracking-wide">
                Ask Apex AI
              </span>
            </span>

            <ChevronDown
              size={15}
              className="rotate-180 text-[#e6c878] transition group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
    </>
  );
}
