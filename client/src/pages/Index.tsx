import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Users, Shield, MessageCircle, ArrowRight } from "lucide-react";


const features = [
  {
    icon: Heart,
    title: "Patient Support",
    description: "Submit healthcare requests with AI-powered priority detection and automatic summaries.",
    link: "/support",
  },
  {
    icon: Users,
    title: "Volunteer Network",
    description: "Register as a volunteer and connect with patients who need your help.",
    link: "/volunteer",
  },
  {
    icon: Shield,
    title: "Admin Dashboard",
    description: "Monitor all requests, manage volunteers, and track priorities in real-time.",
    link: "/admin",
  },
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description: "Get instant guidance with our intelligent rule-based chatbot assistant.",
    link: "/chatbot",
  },
];

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-background/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">


            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="gradient-text">CareConnect</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              A mini healthcare support platform connecting patients with volunteers.
              AI-powered priority detection and instant support at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/support" className="gradient-btn inline-flex items-center justify-center gap-2">
                Get Support <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/volunteer" className="gradient-btn-outline inline-flex items-center justify-center gap-2">
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Our Features</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Everything you need for community healthcare support, powered by AI.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 CareConnect — Built for communities, powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
