"use client";
import { useState, useRef, useEffect, useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import rehypeSanitize from "rehype-sanitize";
import { getVirtualMentorReply } from "./actions";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for message validation
const messageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty"),
});

// Inline useAction hook for async server action with pending and error state
const initialState = { reply: null, error: null };
export default function VirtualMentorPage() {
  const [allMessages, setAllMessages] = useState<
    Array<{ message: string } | { response: string }>
  >([
    {
      response:
        "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
    },
  ]);
  const [_messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "system",
      content:
        "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [actionState, sendMessage, isPending] = useActionState(
    getVirtualMentorReply,
    initialState,
  );
  const [userResponse, setUserResponse] = useState("");

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // When actionState.reply changes, add the assistant message
  useEffect(() => {
    if (actionState.reply) {
      setAllMessages((prev) => [...prev, { response: actionState.reply }]);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: actionState.reply },
      ]);
    }
  }, [actionState.reply]);

  return (
    <div className="container min-h-screen py-8 flex flex-col">
      <section className="mb-4 text-center space-y-2">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Virtual Mentor
            <Badge className="bg-green-500/10 text-green-500 ml-2">AI</Badge>
          </h1>
        </div>
        <div className="mt-3 flex justify-center">
          <div className="text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-md px-4 py-2 max-w-xl mx-auto shadow-sm">
            <b>Disclaimer:</b> The Virtual Mentor will only give hints and
            feedback, not direct answers or code corrections. If you send code,
            it will point out issues but not fix them for you.
          </div>
        </div>
      </section>
      <Card className="flex-1 flex flex-col gap-0 bg-card p-0 min-h-[400px] border shadow-md relative">
        {/* New Chat button in top-right */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="shadow"
            onClick={() => {
              setAllMessages([
                {
                  response:
                    "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
                },
              ]);
              setMessages([
                {
                  role: "system",
                  content:
                    "Welcome to the Virtual Mentor! Ask your programming questions or share your code. The mentor will give you hints and feedback, but never direct answers or code corrections. Try to solve problems yourself!",
                },
              ]);
            }}
          >
            New Chat
          </Button>
        </div>
        <div
          className={`flex-1 overflow-y-auto px-0 py-4 md:px-8 md:py-6 space-y-2 transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}
        >
          {allMessages.map((msg, idx) => {
            if ("message" in msg) {
              // User message
              return (
                <div key={idx} className="flex justify-end">
                  <div className="flex items-end gap-2 flex-row-reverse">
                    <User className="w-5 h-5 text-primary" />
                    <div className="rounded-xl px-4 py-2 text-sm max-w-2xl shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Assistant/system message
              return (
                <div key={idx} className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <Bot className="w-5 h-5 text-green-500" />
                    <div className="rounded-xl px-4 py-2 text-sm max-w-2xl shadow-sm bg-muted text-foreground border border-border">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                      >
                        {msg.response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
        <Form {...form}>
          <form
            className="flex gap-2 border-t border-border bg-background px-4 py-3"
            action={sendMessage}
          >
            <input
              type="hidden"
              name="messages"
              value={JSON.stringify(_messages ?? [])}
              onChange={() => {}}
            />
            <FormField
              name="message"
              render={() => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="flex-1 resize-none min-h-[44px] max-h-40"
                      placeholder="Type your question or paste your code..."
                      autoFocus
                      autoComplete="off"
                      disabled={isPending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!isPending && userResponse.trim()) {
                            setAllMessages((prev) => [
                              ...prev,
                              { message: userResponse },
                            ]);
                            setMessages((prev) => [
                              ...prev,
                              { role: "user", content: userResponse },
                            ]);
                            setUserResponse("");
                            (
                              e.target as HTMLTextAreaElement
                            ).form?.requestSubmit();
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="default"
              disabled={isPending}
              onClick={(e) => {
                if (!isPending && userResponse.trim()) {
                  setAllMessages((prev) => [
                    ...prev,
                    { message: userResponse },
                  ]);
                  setMessages((prev) => [
                    ...prev,
                    { role: "user", content: userResponse },
                  ]);
                  setUserResponse("");
                  // @ts-expect-error: e.target.form is not typed on Button event target, but is valid in the DOM
                  e.target.form?.requestSubmit();
                }
              }}
            >
              {isPending ? "..." : "Send"}
            </Button>
          </form>
        </Form>
        {actionState.error && (
          <div className="text-red-600 text-sm px-4 pb-2">
            {actionState.error}
          </div>
        )}
      </Card>
      <style jsx global>{`
        .markdown-chat-bubble ul,
        .markdown-chat-bubble ol {
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
