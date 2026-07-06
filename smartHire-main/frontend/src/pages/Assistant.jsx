import { useEffect, useMemo, useState } from "react";
import { Bot, SendHorizontal, UserRound } from "lucide-react";
import api from "../services/api";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content:
      "Hi! I am your SmartHire assistant. Ask me about resume improvements, interview prep, roadmap planning, or job-role guidance.",
  },
];

const getAssistantStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return `smarthire.assistant.chat.${user?._id || "guest"}`;
  } catch (_error) {
    return "smarthire.assistant.chat.guest";
  }
};

const readAssistantCache = (key) => {
  try {
    const cached = JSON.parse(localStorage.getItem(key) || "{}");
    if (!Array.isArray(cached?.messages) || !cached.messages.length) return null;
    return {
      messages: cached.messages,
      warning: typeof cached?.warning === "string" ? cached.warning : "",
    };
  } catch (_error) {
    return null;
  }
};

function Assistant() {
  const storageKey = useMemo(() => getAssistantStorageKey(), []);
  const cached = useMemo(() => readAssistantCache(storageKey), [storageKey]);
  const [messages, setMessages] = useState(cached?.messages || DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(cached?.warning || "");

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        messages,
        warning,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [messages, warning, storageKey]);

  const sendMessage = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setWarning("");
    setLoading(true);

    try {
      const { data } = await api.post("/skills/assistant-chat", { prompt });
      const reply = data?.reply || "I could not generate a response right now.";
      setWarning(data?.warning || "");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const fallback = error?.response?.data?.message || "Assistant is unavailable right now. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#dbe7ff] bg-gradient-to-r from-[#eef4ff] via-white to-[#f7f9ff] p-5 shadow-sm">
        <p className="text-sm font-medium text-[#2f58c6]">Career Support</p>
        <h2 className="mt-1 text-2xl font-semibold text-[#1d2b5d]">AI Assistant</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ask doubts about interview preparation, resume writing, projects, and skill learning paths.
        </p>
      </section>

      <section className="flex h-[62vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!!warning && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            {warning}
          </div>
        )}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="mt-1 rounded-full bg-[#e8efff] p-1.5 text-[#1e3a8a]">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user" ? "bg-[#1e3a8a] text-white" : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="mt-1 rounded-full bg-[#dbe7ff] p-1.5 text-[#1e3a8a]">
                  <UserRound size={14} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="mt-1 rounded-full bg-[#e8efff] p-1.5 text-[#1e3a8a]">
                <Bot size={14} />
              </div>
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Thinking...
              </p>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#2f58c6] focus:ring-2 focus:ring-[#2f58c6]/20"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#1e3a8a] p-2.5 text-white transition hover:bg-[#2647a9] disabled:opacity-60"
              aria-label="Send message"
            >
              <SendHorizontal size={17} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Assistant;
