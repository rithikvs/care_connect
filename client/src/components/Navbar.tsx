import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/support", label: "Patient Support" },
    { to: "/volunteer", label: "Volunteer" },
    { to: "/admin", label: "Dashboard", adminOnly: true },
    { to: "/chatbot", label: "AI Chat" },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (user && user.role === 'admin') {
      return link.to === "/admin";
    }
    return !link.adminOnly;
  });

  return (
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold gradient-text">CareConnect</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.to
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4 h-6 w-px bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <UserIcon className="w-3 h-3 text-primary" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                Login
              </Link>
              <Link to="/signup" className="gradient-btn px-5 py-2 text-sm">
                Join Us
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 p-4 animate-scale-in">
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-white/10" />
          {user ? (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <UserIcon className="w-4 h-4 text-primary" />
                {user.name}
              </div>
              <button onClick={handleLogout} className="w-full py-2 text-center text-sm text-destructive font-medium hover:bg-destructive/10 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 text-sm font-medium border border-white/10 rounded-xl">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-center py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
