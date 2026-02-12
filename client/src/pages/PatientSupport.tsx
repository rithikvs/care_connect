import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Heart, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const HIGH_PRIORITY_KEYWORDS = ["urgent", "critical", "bleeding", "accident", "emergency", "severe", "dying"];

const detectPriority = (description: string): "HIGH" | "NORMAL" => {
  const lower = description.toLowerCase();
  return HIGH_PRIORITY_KEYWORDS.some((kw) => lower.includes(kw)) ? "HIGH" : "NORMAL";
};

const generateSummary = (name: string, location: string, problemType: string, priority: string): string => {
  return `Patient "${name}" from ${location} requires ${problemType} support. Priority: ${priority}.`;
};

const PatientSupport = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    problem_type: "General",
    description: "",
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role === "admin") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a request");
      return;
    }
    setLoading(true);

    const priority = detectPriority(form.description);
    const generatedSummary = generateSummary(form.full_name, form.location, form.problem_type, priority);

    try {
      await api.patients.create({
        ...form,
        priority,
        summary: generatedSummary,
      });
      toast.success("Request submitted successfully!");
      setSummary(generatedSummary);
      setForm({ full_name: "", phone: "", location: "", problem_type: "General", description: "" });
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold gradient-text mb-2">Request Healthcare Support</h1>
          <p className="text-muted-foreground">Fill in the form below. AI will auto-detect priority.</p>
        </div>

        {!user ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-6 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                To protect our community and manage requests effectively, we require users to be logged in before submitting healthcare requests.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/login" className="gradient-btn px-8 py-3 rounded-xl w-full sm:w-auto">
                Login Now
              </Link>
              <Link to="/signup" className="px-8 py-3 rounded-xl border border-black/10 hover:bg-black/5 transition-colors text-center w-full sm:w-auto text-sm font-medium">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="float-label-input" placeholder="Enter your full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="float-label-input" placeholder="Enter phone number" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input name="location" value={form.location} onChange={handleChange} required className="float-label-input" placeholder="Enter your location" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Problem Type</label>
              <select name="problem_type" value={form.problem_type} onChange={handleChange} className="float-label-input">
                <option value="General">General</option>
                <option value="Emergency">Emergency</option>
                <option value="Medicine">Medicine</option>
                <option value="Blood">Blood</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="float-label-input resize-none" placeholder="Describe your problem in detail..." />
            </div>

            <button type="submit" disabled={loading} className="gradient-btn w-full disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}

        {/* AI Summary */}
        {summary && (
          <div className="mt-8 glass-card p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-3">
              {summary.includes("HIGH") ? (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
              <h3 className="font-semibold text-foreground">AI Generated Summary</h3>
            </div>
            <p className="text-muted-foreground">{summary}</p>
            <div className="mt-3">
              {summary.includes("HIGH") ? (
                <span className="priority-high">HIGH Priority</span>
              ) : (
                <span className="priority-normal">Normal Priority</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSupport;
