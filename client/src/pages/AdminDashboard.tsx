import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Shield, Trash2, User, Phone, MapPin, Lock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Patient {
  _id: string;
  full_name: string;
  phone: string;
  location: string;
  problem_type: string;
  description: string;
  priority: string;
  summary: string | null;
  created_at: string;
}

interface Volunteer {
  _id: string;
  full_name: string;
  phone: string;
  email: string;
  skills: string;
  availability: string;
  location: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tab, setTab] = useState<"patients" | "volunteers">("patients");

  const fetchData = async () => {
    try {
      const [pData, vData] = await Promise.all([
        api.patients.getAll(),
        api.volunteers.getAll(),
      ]);
      setPatients(pData);
      setVolunteers(vData);
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchData();
    }
  }, []);

  const deletePatient = async (id: string) => {
    try {
      await api.patients.delete(id);
      toast.success("Patient request deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete patient.");
    }
  };

  const deleteVolunteer = async (id: string) => {
    try {
      await api.volunteers.delete(id);
      toast.success("Volunteer removed.");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove volunteer.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor patient requests and volunteer registrations.</p>
        </div>

        {!user || user.role !== 'admin' ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-6 animate-scale-in max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Restricted Access</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                The Admin Dashboard is only accessible to authorized System Administrators. Normal users and volunteers do not have permission to view this data.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="gradient-btn px-8 py-3 rounded-xl">
                Login as Admin
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total Requests", value: patients.length },
                { label: "High Priority", value: patients.filter((p) => p.priority === "HIGH").length },
                { label: "Normal Priority", value: patients.filter((p) => p.priority === "NORMAL").length },
                { label: "Volunteers", value: volunteers.length },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 md:p-6 text-center">
                  <p className="text-xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              {(["patients", "volunteers"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {t === "patients" ? "Patient Requests" : "Volunteers"}
                </button>
              ))}
            </div>

            {/* Patient Cards */}
            {tab === "patients" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {patients.map((p) => (
                  <div key={p._id} className="glass-card p-5 animate-fade-in group">
                    <div className="flex items-start justify-between mb-3">
                      <span className={p.priority === "HIGH" ? "priority-high" : "priority-normal"}>
                        {p.priority}
                      </span>
                      <button onClick={() => deletePatient(p._id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> {p.full_name}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                      <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {p.phone}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {p.location}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 mb-2">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{p.problem_type}</p>
                      <p className="text-sm text-foreground">{p.description}</p>
                    </div>
                    {p.summary && (
                      <p className="text-xs text-primary/80 italic mt-2">{p.summary}</p>
                    )}
                  </div>
                ))}
                {patients.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-12">No patient requests yet.</p>
                )}
              </div>
            )}

            {/* Volunteer Cards */}
            {tab === "volunteers" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {volunteers.map((v) => (
                  <div key={v._id} className="glass-card p-5 animate-fade-in group">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> {v.full_name}
                      </h3>
                      <button onClick={() => deleteVolunteer(v._id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {v.phone}</p>
                      <p>{v.email}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {v.location}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {v.skills.split(",").map((skill) => (
                        <span key={skill} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Available: {v.availability}</p>
                  </div>
                ))}
                {volunteers.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-12">No volunteers registered yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
