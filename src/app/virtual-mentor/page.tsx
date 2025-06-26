"use client";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Textarea } from "@/components/ui/textarea";

// Utility to detect Arabic text
function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

// CopyButton for code blocks
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy code"
      className="absolute top-2 right-2 z-10 p-1 rounded transition
        text-muted-foreground hover:text-primary
        bg-transparent hover:bg-muted/70 dark:hover:bg-accent/70
        shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      onClick={async e => {
        e.preventDefault();
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      tabIndex={0}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function VirtualMentorPage() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container min-h-screen py-8 flex flex-col">
      <section className="mb-4 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Virtual Mentor
        </h1>
        <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
          <Badge className="bg-green-500/10 text-green-500">AI</Badge>
          <span className="text-muted-foreground">Powered by Gemini</span>
        </div>
        <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-md px-4 py-2">
          <b>Disclaimer:</b> The Virtual Mentor will only give hints and feedback, not direct answers or code corrections. If you send code, it will point out issues but not fix them for you.
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setMessages([
                {
                  role: "system",
                  content:
                    "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
                },
              ]);
              setError("");
            }}
          >
            New Chat
          </Button>
        </div>
      </section>
      <Card className="flex-1 flex flex-col gap-0 bg-card p-0 min-h-[400px] border shadow-md">
        <div className="flex-1 overflow-y-auto px-0 py-4 md:px-8 md:py-6 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "user" ? (
                  <User className="w-5 h-5 text-primary" />
                ) : (
                  <Bot className="w-5 h-5 text-green-500" />
                )}
                <div
                  className={`rounded-xl px-4 py-2 text-sm max-w-2xl shadow-sm transition-all duration-150 markdown-chat-bubble
                    ${msg.role === "user"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground border border-border"}
                  `}
                  dir={msg.role !== "user" && isArabic(msg.content) ? "rtl" : "ltr"}
                  style={{
                    fontFamily: msg.role === "user" ? undefined : 'inherit',
                    textAlign: msg.role !== "user" && isArabic(msg.content) ? "right" : "left",
                  }}
                >
                  {msg.role === "assistant" || msg.role === "system" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        code(props: any) {
                          const { inline, className, children, ...rest } = props;
                          const codeString = String(children);
                          const match = /language-(\w+)/.exec(className || "");
                          // Heuristic: treat as inline code if inline, or if not inline but code is short and has no newlines
                          const isInlineLike = inline || (!inline && !codeString.includes('\n') && codeString.length < 30);
                          if (isInlineLike) {
                            return (
                              <code
                                className="bg-muted px-1 py-0.5 rounded text-[0.97em] font-mono text-primary border border-border whitespace-normal"
                                style={{
                                  fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                                  fontSize: 13,
                                  wordBreak: 'break-word',
                                  display: 'inline',
                                }}
                                {...rest}
                              >
                                {children}
                              </code>
                            );
                          }
                          // Otherwise, treat as code block
                          return (
                            <div className="relative overflow-x-auto rounded-md bg-[#23272e] my-4" style={{ maxWidth: '100%' }}>
                              <CopyButton code={codeString.replace(/\n$/, "")} />
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match ? match[1] : ""}
                                PreTag="div"
                                customStyle={{
                                  borderRadius: 8,
                                  margin: 0,
                                  padding: '0.5em 0.75em',
                                  fontSize: 13,
                                  background: 'transparent',
                                  fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                                  lineHeight: 1.5,
                                  maxWidth: '100%',
                                }}
                              >
                                {codeString.replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          );
                        },
                        strong({ children }) {
                          return <strong className="font-semibold text-primary">{children}</strong>;
                        },
                        em({ children }) {
                          return <em className="italic text-muted-foreground">{children}</em>;
                        },
                        u({ children }) {
                          return <u className="underline decoration-primary/60">{children}</u>;
                        },
                        li({ children }) {
                          return <li className="ml-6 pl-1 list-disc leading-snug text-[0.98em]">{children}</li>;
                        },
                        ul({ children }) {
                          return <ul className="mb-1 pb-0 bg-muted/40 rounded-md px-3 py-1">{children}</ul>;
                        },
                        ol({ children }) {
                          return <ol className="mb-1 pb-0 bg-muted/40 rounded-md px-3 py-1 list-decimal">{children}</ol>;
                        },
                        p({ children }) {
                          return <p className="mb-1 last:mb-0 leading-relaxed text-[0.99em]">{children}</p>;
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="flex gap-2 border-t border-border bg-background px-4 py-3"
          onSubmit={async e => {
            e.preventDefault();
            if (!input.trim() || loading) return;
            setMessages(prev => [...prev, { role: "user", content: input }]);
            setInput("");
            setLoading(true);
            setError("");
            try {
              const res = await fetch("/api/virtual-mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [
                  ...messages,
                  { role: "user", content: input },
                ] }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Unknown error");
              setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : "Failed to get response");
            } finally {
              setLoading(false);
            }
          }}
        >
          <Textarea
            ref={textareaRef}
            className="flex-1 resize-none min-h-[44px] max-h-40"
            placeholder="Type your question or paste your code..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading && input.trim()) {
                  // Manually trigger form submit
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }
            }}
            autoFocus
            autoComplete="off"
            disabled={loading}
          />
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? "..." : "Send"}
          </Button>
        </form>
        {error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400 px-4 pb-2">
            {error}
          </div>
        )}
      </Card>
      <style jsx global>{`
        .markdown-chat-bubble ul, .markdown-chat-bubble ol {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        .markdown-chat-bubble pre {
          margin: 0.25em 0;
        }
      `}</style>
    </div>
  );
} 