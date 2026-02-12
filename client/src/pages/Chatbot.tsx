import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "bot";
  content: string;
}

const getBotResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("help") || lower.includes("support"))
    return "I can guide you! Head to the **Patient Support** page to submit a healthcare request. Our AI will auto-detect the priority of your case. [Go to Support](/support)";
  if (lower.includes("volunteer") || lower.includes("join") || lower.includes("register"))
    return "That's wonderful! You can register as a volunteer on our **Volunteer Registration** page. Your skills can save lives! [Register Now](/volunteer)";
  if (lower.includes("free") || lower.includes("cost") || lower.includes("price") || lower.includes("charge"))
    return "All our services are **completely free**! CareConnect is a community-driven platform — no charges, no hidden fees. 💚";
  if (lower.includes("admin") || lower.includes("dashboard"))
    return "The **Admin Dashboard** lets you view all patient requests and volunteers. [View Dashboard](/admin)";
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! 👋 I'm CareBot, your healthcare assistant. Ask me about patient support, volunteering, or anything else!";
  if (lower.includes("blood"))
    return "If you need blood support, please submit a request on our **Patient Support** page and select 'Blood' as the problem type. [Submit Request](/support)";
  if (lower.includes("emergency"))
    return "⚠️ For emergencies, please submit a request immediately on the **Patient Support** page. Make sure to describe the situation — our AI will mark it as HIGH priority. [Get Help Now](/support)";
  return "I'm here to help! You can ask me about:\n- **Patient support** requests\n- **Volunteering** opportunities\n- **Service costs**\n- **Emergency** help\n\nOr visit the [Support page](/support) directly.";
};

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! 👋 I'm **CareBot**, your healthcare support assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const botMsg: Message = { role: "bot", content: getBotResponse(input) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const renderContent = (text: string) => {
    // Simple markdown-like rendering for bold and links
    return text.split("\n").map((line, i) => (
      <p key={i} className="mb-1" dangerouslySetInnerHTML={{
        __html: line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80">$1</a>')
      }} />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold gradient-text mb-2">CareBot</h1>
          <p className="text-muted-foreground">Ask me anything about our healthcare services.</p>
        </div>

        <div className="glass-card flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted/60 text-muted-foreground rounded-bl-md"
                  }`}>
                  {renderContent(msg.content)}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="float-label-input flex-1"
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="gradient-btn px-4">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
