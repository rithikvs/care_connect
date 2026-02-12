import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Users, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const VolunteerRegistration = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    skills: "",
    availability: "",
    location: "",
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to register as a volunteer");
      return;
    }
    setLoading(true);

    try {
      await api.volunteers.create(form);
      toast.success("Registered successfully as a volunteer!");
      setForm({ full_name: "", phone: "", email: "", skills: "", availability: "", location: "" });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold gradient-text mb-2">Volunteer Registration</h1>
          <p className="text-muted-foreground">Help your community by volunteering your time and skills.</p>
        </div>

        {!user ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-6 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Join our network of healthcare heroes! Please log in to your account to complete your volunteer registration and start helping those in need.
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
            {[
              { name: "full_name", label: "Full Name", placeholder: "Enter your full name" },
              { name: "phone", label: "Phone Number", placeholder: "Enter phone number" },
              { name: "email", label: "Email Address", placeholder: "Enter email address", type: "email" },
              { name: "skills", label: "Skills", placeholder: "e.g., First Aid, Counseling, Transport" },
              { name: "availability", label: "Availability", placeholder: "e.g., Weekends, Full-time, Evenings" },
              { name: "location", label: "Location", placeholder: "Enter your location" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  className="float-label-input"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="gradient-btn w-full disabled:opacity-50">
              {loading ? "Registering..." : "Register as Volunteer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VolunteerRegistration;
