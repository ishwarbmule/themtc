import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mountain, Search, Filter, LogOut, CheckCircle2, AlertCircle, XCircle,
  Trash2, Calendar, User, Phone, Mail, Clock, ShieldCheck, Download,
  ExternalLink, RefreshCw, BarChart3, Users, IndianRupee, Eye, ChevronRight, X,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-forest animate-spin" />
          <p className="text-sm text-muted-foreground font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return <DashboardView session={session} />;
}

/* ---------------- ADMIN LOGIN COMPONENT ---------------- */
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Authentication failed: " + error.message);
    } else {
      toast.success("Welcome back, Admin!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-forest-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-ember)/10,transparent_50%)]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-forest/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-background/95 backdrop-blur rounded-3xl border border-border/40 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="grid place-items-center h-12 w-12 rounded-2xl bg-ember text-background mb-4 shadow-lg shadow-ember/20">
            <Mountain className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Trek Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to manage bookings and view receipts</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maharashtratreks.com"
              required
              className="rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-ember hover:bg-ember-deep text-white py-3.5 font-semibold transition-all shadow-lg shadow-ember/15 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Access Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Secure administrative access only.</p>
          <a href="/" className="inline-flex items-center gap-1 text-ember font-medium hover:underline mt-2">
            Back to Public Website <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN DASHBOARD VIEW ---------------- */
function DashboardView({ session }: { session: any }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [trekFilter, setTrekFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings database.");
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully.");
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status: " + error.message);
    } else {
      toast.success(`Booking status updated to ${newStatus}`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking request? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete booking: " + error.message);
    } else {
      toast.success("Booking request deleted.");
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelectedBooking(null);
    }
  };

  // Get unique treks for the dropdown filter
  const uniqueTreks = Array.from(new Set(bookings.map(b => b.trek_name)));

  // Filter list
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.trek_name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesTrek = trekFilter === "All" || b.trek_name === trekFilter;

    return matchesSearch && matchesStatus && matchesTrek;
  });

  // Calculate metrics
  const totalBookings = filteredBookings.length;
  const totalSeats = filteredBookings.reduce((acc, curr) => acc + (curr.seats || 0), 0);
  const pendingConfirmation = filteredBookings.filter(b => b.status === "Pending").length;
  


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="bg-forest text-cream py-4 px-6 shrink-0 shadow-md border-b border-forest-deep flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center h-9 w-9 rounded-xl bg-ember text-background">
            <Mountain className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-tight tracking-tight">MAHARASHTRA TREKKING CO.</h1>
            <span className="text-[10px] text-cream/70 font-semibold tracking-[0.15em] uppercase">Control Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2 rounded-lg bg-forest-deep hover:bg-forest-deep/80 text-cream transition-colors border border-cream/10"
            title="Refresh database records"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ember text-background font-bold text-xs px-3.5 py-2 hover:bg-ember-deep transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Dashboard Layout */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Bookings" value={totalBookings} icon={Calendar} color="border-l-forest text-forest" />
          <StatCard title="Seats Booked" value={totalSeats} icon={Users} color="border-l-indigo-600 text-indigo-600" />
          <StatCard title="Pending Review" value={pendingConfirmation} icon={Clock} color="border-l-yellow-500 text-yellow-500 bg-yellow-500/5" />
        </div>

        {/* Filter controls panel */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm grid gap-4 md:grid-cols-4 items-center">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by customer name, mobile, email or trek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={trekFilter}
              onChange={(e) => setTrekFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="All">All Treks</option>
              {uniqueTreks.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 text-forest animate-spin" />
              <p className="text-sm text-muted-foreground">Syncing bookings list...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-semibold text-lg text-foreground">No bookings found</h3>
              <p className="text-sm max-w-sm mx-auto mt-1">No requests match your current search queries or filter attributes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-4 px-6">Trekker</th>
                    <th className="py-4 px-6">Trek Details</th>
                    <th className="py-4 px-6 text-center">Seats</th>
                    <th className="py-4 px-6">Date Submitted</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-foreground">{b.full_name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{b.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-foreground">{b.trek_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" /> {b.pickup_point || "No pickup selected"}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-grid place-items-center h-6 w-8 font-bold rounded-lg bg-forest/5 text-forest border border-forest/10">
                          {b.seats || 1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground font-mono text-xs">
                        {new Date(b.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="View full booking specs"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg border border-border hover:border-red-200 hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Delete booking request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Booking Details Drawer / Side Panel overlay */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedBooking(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background h-full shadow-2xl flex flex-col border-l border-border animate-slide-in"
          >
            {/* Drawer Header */}
            <div className="bg-forest text-cream p-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cream/70">Request Details</span>
                <h3 className="font-display font-bold text-lg mt-0.5">{selectedBooking.full_name}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg hover:bg-forest-deep text-cream/80 hover:text-cream transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Trip Selection Info */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-xs font-semibold uppercase">Trek</span><span className="font-bold text-sm">{selectedBooking.trek_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs font-semibold uppercase">Seats</span><span className="font-bold text-sm">{selectedBooking.seats || 1} seat(s)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs font-semibold uppercase">Pickup Point</span><span className="font-bold text-sm">{selectedBooking.pickup_point || "—"}</span></div>
              </div>

              {/* Trekker Profile */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3">Trekker Details</h4>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-sm">
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Age / Gender</span>
                    <span className="font-medium text-foreground">{selectedBooking.age || "—"} / {selectedBooking.gender || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Phone</span>
                    <a href={`tel:${selectedBooking.phone}`} className="font-medium text-ember hover:underline font-mono">{selectedBooking.phone}</a>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Email</span>
                    <span className="font-medium text-foreground">{selectedBooking.email || "—"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Emergency Contact</span>
                    <span className="font-medium text-foreground">{selectedBooking.emergency_contact || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot Preview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5 mb-3">Payment Verification</h4>
                {selectedBooking.screenshot_url ? (
                  <div className="space-y-2">
                    <div className="rounded-xl border border-border overflow-hidden bg-muted p-1 text-center relative group max-h-72 flex items-center justify-center">
                      <img
                        src={selectedBooking.screenshot_url}
                        alt="Payment Receipt Screenshot"
                        className="max-w-full max-h-64 object-contain rounded-lg shadow-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={selectedBooking.screenshot_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View Full Resolution
                      </a>
                      <a
                        href={selectedBooking.screenshot_url}
                        download={`receipt_${selectedBooking.id}.jpg`}
                        target="_blank"
                        className="inline-flex items-center justify-center p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Download image"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border py-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-1.5 bg-muted/10">
                    <AlertCircle className="h-5 w-5 text-muted-foreground/60" />
                    No screenshot uploaded by trekker
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-border bg-card p-4 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground mb-1">
                <span>Current Status</span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Confirmed")}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 text-xs font-bold text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Pending")}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 text-xs font-bold text-foreground bg-muted hover:bg-muted/80 border border-border rounded-lg transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" /> Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "Cancelled")}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
              <button
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Booking Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */
function StatCard({ title, value, icon: Icon, color, desc }: { title: string; value: string | number; icon: any; color: string; desc?: string }) {
  return (
    <div className={`bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
          <div className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">{value}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-muted/40">
          <Icon className="h-4 w-4 shrink-0" />
        </div>
      </div>
      {desc && <div className="text-[10px] text-muted-foreground/80 mt-1">{desc}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-forest/10 text-forest border-forest/20",
    Pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Cancelled: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>
      {status === "Confirmed" && <ShieldCheck className="h-3 w-3" />}
      {status === "Pending" && <Clock className="h-3 w-3" />}
      {status === "Cancelled" && <XCircle className="h-3 w-3" />}
      {status}
    </span>
  );
}
