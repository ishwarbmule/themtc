import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mountain, Search, Filter, LogOut, CheckCircle2, AlertCircle, XCircle,
  Trash2, Calendar, User, Phone, Mail, Clock, ShieldCheck, Download,
  ExternalLink, RefreshCw, BarChart3, Users, IndianRupee, Eye, ChevronRight, X,
  MapPin, Plus, Edit, Camera, Video, Database, Upload, Check, Flame
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrekPackage, PACKAGES } from "./index";
import trekKalsubai from "@/assets/trek-kalsubai.jpg";
import trekRajgad from "@/assets/trek-rajgad.jpg";
import trekWaterfall from "@/assets/trek-waterfall.jpg";
import trekCamping from "@/assets/trek-camping.jpg";
import trekHarihar from "@/assets/trek-harihar.jpg";
import trekSummit from "@/assets/trek-summit.jpg";

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
  const [activeTab, setActiveTab] = useState<"bookings" | "treks" | "gallery" | "db_setup">("bookings");
  
  // Bookings States
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [trekFilter, setTrekFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Treks States
  const [packages, setPackages] = useState<TrekPackage[]>([]);
  const [treksLoading, setTreksLoading] = useState(true);
  const [editTrek, setEditTrek] = useState<any | null>(null); // State for adding/editing a trek
  const [formTab, setFormTab] = useState<"general" | "details" | "itinerary" | "highlights" | "inclusions">("general");

  // Gallery States
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [addMediaOpen, setAddMediaOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"gallery" | "reel">("gallery");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    const { data, error } = await (supabase as any)
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings database.");
    } else {
      setBookings(data || []);
    }
    setBookingsLoading(false);
  };

  const fetchTreks = async () => {
    setTreksLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("treks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          name: d.name,
          img: d.img,
          difficulty: d.difficulty,
          duration: d.duration,
          price: Number(d.price),
          city: d.city,
          nextBatch: d.next_batch,
          nextBatchDate: d.next_batch_date,
          seatsLeft: Number(d.seats_left),
          tag: d.tag,
          altitude: d.altitude,
          basecamp: d.basecamp,
          region: d.region,
          bestSeason: d.best_season,
          groupSize: d.group_size,
          pickupPoints: d.pickup_points || [],
          highlights: d.highlights || [],
          itinerary: d.itinerary || [],
          inclusions: d.inclusions || [],
          exclusions: d.exclusions || [],
          thingsToCarry: d.things_to_carry || [],
          itineraryNote: d.itinerary_note || "",
        }));
        setPackages(mapped);
      } else {
        if (session) {
          console.log("Treks table is empty, seeding with default PACKAGES");
          const seedRows = PACKAGES.map((pkg) => ({
            name: pkg.name,
            img: pkg.img,
            difficulty: pkg.difficulty,
            duration: pkg.duration,
            price: pkg.price,
            city: pkg.city,
            next_batch: pkg.nextBatch,
            next_batch_date: pkg.nextBatchDate || null,
            seats_left: pkg.seatsLeft,
            tag: pkg.tag,
            altitude: pkg.altitude,
            basecamp: pkg.basecamp,
            region: pkg.region,
            best_season: pkg.bestSeason,
            group_size: pkg.groupSize,
            pickup_points: pkg.pickupPoints,
            highlights: pkg.highlights,
            itinerary: pkg.itinerary,
            inclusions: pkg.inclusions,
            exclusions: pkg.exclusions,
            things_to_carry: pkg.thingsToCarry,
            itinerary_note: pkg.itineraryNote || "",
          }));

          const { error: seedError } = await (supabase as any)
            .from("treks")
            .insert(seedRows);

          if (!seedError) {
            console.log("Treks table successfully seeded!");
            toast.info("Database initialized with default trek packages.");
            const { data: newData, error: newErr } = await (supabase as any)
              .from("treks")
              .select("*")
              .order("created_at", { ascending: true });
            if (!newErr && newData && newData.length > 0) {
              const mapped = newData.map((d: any) => ({
                name: d.name,
                img: d.img,
                difficulty: d.difficulty,
                duration: d.duration,
                price: Number(d.price),
                city: d.city,
                nextBatch: d.next_batch,
                nextBatchDate: d.next_batch_date,
                seatsLeft: Number(d.seats_left),
                tag: d.tag,
                altitude: d.altitude,
                basecamp: d.basecamp,
                region: d.region,
                bestSeason: d.best_season,
                groupSize: d.group_size,
                pickupPoints: d.pickup_points || [],
                highlights: d.highlights || [],
                itinerary: d.itinerary || [],
                inclusions: d.inclusions || [],
                exclusions: d.exclusions || [],
                thingsToCarry: d.things_to_carry || [],
                itineraryNote: d.itinerary_note || "",
              }));
              setPackages(mapped);
              localStorage.setItem("m_treks", JSON.stringify(mapped));
              return;
            }
          } else {
            console.error("Failed to seed treks table:", seedError);
          }
        }

        const cached = localStorage.getItem("m_treks");
        setPackages(cached ? JSON.parse(cached) : PACKAGES);
      }
    } catch (err) {
      console.log("DB treks load failed, using local storage fallback", err);
      const cached = localStorage.getItem("m_treks");
      setPackages(cached ? JSON.parse(cached) : PACKAGES);
    } finally {
      setTreksLoading(false);
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("gallery_reels")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setGalleryItems(data);
      } else {
        if (session) {
          console.log("Gallery table is empty, seeding with default assets");
          const defaultImgs = [
            { type: "gallery", url: trekKalsubai },
            { type: "gallery", url: trekRajgad },
            { type: "gallery", url: trekWaterfall },
            { type: "gallery", url: trekHarihar },
            { type: "gallery", url: trekCamping },
            { type: "gallery", url: trekSummit }
          ];

          const { error: seedError } = await (supabase as any)
            .from("gallery_reels")
            .insert(defaultImgs);

          if (!seedError) {
            console.log("Gallery table successfully seeded!");
            const { data: newData, error: newErr } = await (supabase as any)
              .from("gallery_reels")
              .select("*")
              .order("created_at", { ascending: true });
            if (!newErr && newData && newData.length > 0) {
              setGalleryItems(newData);
              const gUrls = newData.filter((item: any) => item.type === "gallery").map((item: any) => item.url);
              const rUrls = newData.filter((item: any) => item.type === "reel").map((item: any) => item.url);
              localStorage.setItem("m_gallery", JSON.stringify(gUrls));
              localStorage.setItem("m_reels", JSON.stringify(rUrls));
              return;
            }
          } else {
            console.error("Failed to seed gallery table:", seedError);
          }
        }

        const cachedG = localStorage.getItem("m_gallery") || "[]";
        const cachedR = localStorage.getItem("m_reels") || "[]";
        const gUrls = JSON.parse(cachedG) as string[];
        const rUrls = JSON.parse(cachedR) as string[];
        
        const mappedG = gUrls.map((url, i) => ({ id: `g-${i}`, type: 'gallery', url }));
        const mappedR = rUrls.map((url, i) => ({ id: `r-${i}`, type: 'reel', url }));
        setGalleryItems([...mappedG, ...mappedR]);
      }
    } catch (err) {
      console.log("DB gallery load failed, using local storage fallback", err);
      const cachedG = localStorage.getItem("m_gallery") || "[]";
      const cachedR = localStorage.getItem("m_reels") || "[]";
      const gUrls = JSON.parse(cachedG) as string[];
      const rUrls = JSON.parse(cachedR) as string[];
      
      const mappedG = gUrls.map((url, i) => ({ id: `g-${i}`, type: 'gallery', url }));
      const mappedR = rUrls.map((url, i) => ({ id: `r-${i}`, type: 'reel', url }));
      setGalleryItems([...mappedG, ...mappedR]);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchTreks();
    fetchGallery();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully.");
  };

  // Booking Actions
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase as any)
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status: " + error.message);
    } else {
      toast.success(`Booking status updated to ${newStatus}`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking request? This action cannot be undone.")) {
      return;
    }

    const { error } = await (supabase as any)
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

  // Trek Actions
  const handleSaveTrek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTrek.name.trim()) {
      toast.error("Trek name is required.");
      return;
    }

    // Save locally
    let updated = [];
    const exists = packages.some(p => p.name.toLowerCase() === editTrek.name.toLowerCase());
    if (exists) {
      updated = packages.map(p => p.name.toLowerCase() === editTrek.name.toLowerCase() ? editTrek : p);
    } else {
      updated = [...packages, editTrek];
    }
    setPackages(updated);
    localStorage.setItem("m_treks", JSON.stringify(updated));

    // Save to Supabase
    try {
      const dbRow = {
        name: editTrek.name,
        img: editTrek.img,
        difficulty: editTrek.difficulty,
        duration: editTrek.duration,
        price: Number(editTrek.price),
        city: editTrek.city,
        next_batch: editTrek.nextBatch,
        next_batch_date: editTrek.nextBatchDate || null,
        seats_left: Number(editTrek.seatsLeft),
        tag: editTrek.tag,
        altitude: editTrek.altitude,
        basecamp: editTrek.basecamp,
        region: editTrek.region,
        best_season: editTrek.bestSeason,
        group_size: editTrek.groupSize,
        pickup_points: editTrek.pickupPoints,
        highlights: editTrek.highlights,
        itinerary: editTrek.itinerary,
        inclusions: editTrek.inclusions,
        exclusions: editTrek.exclusions,
        things_to_carry: editTrek.thingsToCarry,
        itinerary_note: editTrek.itineraryNote || "",
      };

      const { error } = await (supabase as any)
        .from("treks")
        .upsert(dbRow, { onConflict: 'name' });

      if (error) throw error;
      toast.success("Trek details saved to database successfully!");
      fetchTreks();
    } catch (err) {
      console.error("Supabase upsert failed:", err);
      toast.warning("Saved locally to cache! Config database tables to persist publicly.");
    }

    setEditTrek(null);
  };

  const handleDeleteTrek = async (name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the trek "${name}"?`)) return;

    // Delete locally
    const updated = packages.filter(p => p.name !== name);
    setPackages(updated);
    localStorage.setItem("m_treks", JSON.stringify(updated));

    // Delete from Supabase
    try {
      const { error } = await (supabase as any)
        .from("treks")
        .delete()
        .eq("name", name);

      if (error) throw error;
      toast.success("Trek deleted from database!");
    } catch (err) {
      console.error("Supabase delete failed:", err);
      toast.warning("Deleted locally. Configure Database Setup for synchronization.");
    }
  };

  // Media Actions
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      toast.error("Media URL or upload is required.");
      return;
    }

    const newItem = { id: `temp-${Date.now()}`, type: mediaType, url: mediaUrl };
    const updated = [...galleryItems, newItem];
    setGalleryItems(updated);

    // Save to local storage cache
    const gUrls = updated.filter(item => item.type === "gallery").map(item => item.url);
    const rUrls = updated.filter(item => item.type === "reel").map(item => item.url);
    localStorage.setItem("m_gallery", JSON.stringify(gUrls));
    localStorage.setItem("m_reels", JSON.stringify(rUrls));

    // Save to DB
    try {
      const { error } = await (supabase as any)
        .from("gallery_reels")
        .insert([{ type: mediaType, url: mediaUrl }]);

      if (error) throw error;
      toast.success("Added to media database successfully!");
      fetchGallery();
    } catch (err) {
      console.error("DB media insert failed:", err);
      toast.warning("Media added locally. Configure database to sync.");
    }

    setMediaUrl("");
    setAddMediaOpen(false);
  };

  const handleDeleteMedia = async (item: any) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    const updated = galleryItems.filter(g => g.id !== item.id && g.url !== item.url);
    setGalleryItems(updated);

    const gUrls = updated.filter(i => i.type === "gallery").map(i => i.url);
    const rUrls = updated.filter(i => i.type === "reel").map(i => i.url);
    localStorage.setItem("m_gallery", JSON.stringify(gUrls));
    localStorage.setItem("m_reels", JSON.stringify(rUrls));

    // Delete from DB
    try {
      if (item.id && !item.id.toString().startsWith("temp-") && !item.id.toString().startsWith("g-") && !item.id.toString().startsWith("r-")) {
        const { error } = await (supabase as any)
          .from("gallery_reels")
          .delete()
          .eq("id", item.id);
        if (error) throw error;
        toast.success("Deleted from database successfully!");
      } else {
        const { error } = await (supabase as any)
          .from("gallery_reels")
          .delete()
          .eq("url", item.url);
        if (error) throw error;
        toast.success("Deleted from database successfully!");
      }
    } catch (err) {
      console.error("DB media delete failed:", err);
      toast.warning("Deleted locally. Configure database to sync.");
    }
  };

  // Shared Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "trek" | "media") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "trek") {
      toast.loading("Uploading trek image...");
    } else {
      setUploadingMedia(true);
      toast.loading("Uploading media file...");
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("booking_screenshots")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("booking_screenshots")
        .getPublicUrl(fileName);

      if (target === "trek") {
        setEditTrek((prev: any) => ({ ...prev, img: publicUrl }));
        toast.dismiss();
        toast.success("Trek image uploaded!");
      } else {
        setMediaUrl(publicUrl);
        toast.dismiss();
        toast.success("Media file uploaded!");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingMedia(false);
    }
  };

  // Filter Bookings list
  const uniqueTreks = Array.from(new Set(bookings.map(b => b.trek_name)));
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

  // Calculate Metrics
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
            onClick={() => {
              if (activeTab === "bookings") fetchBookings();
              else if (activeTab === "treks") fetchTreks();
              else if (activeTab === "gallery") fetchGallery();
            }}
            className="p-2 rounded-lg bg-forest-deep hover:bg-forest-deep/80 text-cream transition-colors border border-cream/10"
            title="Refresh database records"
          >
            <RefreshCw className={`h-4 w-4 ${(bookingsLoading || treksLoading || galleryLoading) ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ember text-background font-bold text-xs px-3.5 py-2 hover:bg-ember-deep transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border py-1.5 px-4 flex gap-1 overflow-x-auto shrink-0 shadow-xs">
        {[
          { id: "bookings" as const, label: "Bookings", icon: Calendar },
          { id: "treks" as const, label: "Treks Manager", icon: Mountain },
          { id: "gallery" as const, label: "Gallery & Reels", icon: Camera },
          { id: "db_setup" as const, label: "Database Setup", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-forest/10 text-forest border border-forest/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* TAB 1: BOOKINGS */}
        {activeTab === "bookings" && (
          <>
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
              {bookingsLoading ? (
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
          </>
        )}

        {/* TAB 2: TREKS MANAGER */}
        {activeTab === "treks" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">Trek Packages</h2>
                <p className="text-xs text-muted-foreground mt-1">Manage active tours, edit itinerary details, pricing, and exclusions.</p>
              </div>
              <button
                onClick={() => {
                  setEditTrek({
                    name: "",
                    img: "",
                    difficulty: "Moderate",
                    duration: "2D / 1N",
                    price: 2999,
                    city: "Bangalore",
                    nextBatch: "Jul 12",
                    nextBatchDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
                    seatsLeft: 10,
                    tag: "Monsoon Special",
                    altitude: "",
                    basecamp: "",
                    region: "Sahyadris, Maharashtra",
                    bestSeason: "",
                    groupSize: "12 – 25 trekkers",
                    pickupPoints: ["Bangalore — Marathahalli (6:30 PM)", "Bangalore — Majestic (8:00 PM)"],
                    highlights: [],
                    itinerary: [],
                    inclusions: [],
                    exclusions: [],
                    thingsToCarry: [],
                    itineraryNote: "",
                  });
                  setFormTab("general");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest hover:bg-forest-deep text-cream text-xs font-bold px-4 py-2.5 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Tour Package
              </button>
            </div>

            {treksLoading ? (
              <div className="py-20 text-center">
                <RefreshCw className="h-8 w-8 text-forest animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading trek configs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.name} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col">
                    <div className="h-44 relative bg-muted">
                      {pkg.img ? (
                        <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs bg-forest/5">No Image Provided</div>
                      )}
                      <span className="absolute top-3 left-3 bg-ember text-background text-[9px] font-black uppercase px-2 py-1 rounded-sm">{pkg.tag}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-lg leading-snug">{pkg.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">{pkg.difficulty}</span>
                          <span className="bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">{pkg.duration}</span>
                          <span className="bg-muted px-2 py-0.5 rounded-md font-medium text-muted-foreground">{pkg.nextBatch}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border/60">
                        <span className="font-display font-bold text-lg text-forest flex items-center">
                          <IndianRupee className="h-4 w-4" /> {pkg.price.toLocaleString("en-IN")}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setEditTrek(pkg);
                              setFormTab("general");
                            }}
                            className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit trek content"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrek(pkg.name)}
                            className="p-2 rounded-lg border border-border hover:border-red-200 hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Delete trek package"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GALLERY & REELS */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-foreground">Gallery & Reels Manager</h2>
                <p className="text-xs text-muted-foreground mt-1">Upload and arrange photographs or embed adventure reels.</p>
              </div>
              <button
                onClick={() => {
                  setMediaType("gallery");
                  setMediaUrl("");
                  setAddMediaOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest hover:bg-forest-deep text-cream text-xs font-bold px-4 py-2.5 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Media Asset
              </button>
            </div>

            {galleryLoading ? (
              <div className="py-20 text-center">
                <RefreshCw className="h-8 w-8 text-forest animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Syncing media grid...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Photos Section */}
                <div>
                  <h3 className="font-display text-lg font-bold border-b border-border pb-2 mb-4 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-forest" /> Photo Gallery ({galleryItems.filter(i => i.type === 'gallery').length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {galleryItems.filter(i => i.type === 'gallery').map((item) => (
                      <div key={item.id} className="relative rounded-xl border border-border overflow-hidden bg-muted aspect-square group">
                        <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteMedia(item)}
                            className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all shadow-md"
                            title="Delete Photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {galleryItems.filter(i => i.type === 'gallery').length === 0 && (
                      <p className="col-span-full text-sm text-muted-foreground italic py-6 text-center">No photographs added. Click Add Media Asset to create one.</p>
                    )}
                  </div>
                </div>

                {/* Reels Section */}
                <div>
                  <h3 className="font-display text-lg font-bold border-b border-border pb-2 mb-4 flex items-center gap-2">
                    <Video className="h-4 w-4 text-forest" /> Instagram Reels / Videos ({galleryItems.filter(i => i.type === 'reel').length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryItems.filter(i => i.type === 'reel').map((item) => {
                      const isVideo = item.url.endsWith(".mp4") || item.url.endsWith(".webm");
                      return (
                        <div key={item.id} className="relative rounded-2xl border border-border overflow-hidden bg-forest-deep aspect-[9/16] group">
                          {isVideo ? (
                            <video src={item.url} className="w-full h-full object-cover" muted />
                          ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 text-cream">
                              <Flame className="h-6 w-6 text-ember mb-2" />
                              <div className="text-[10px] font-bold uppercase tracking-wider text-cream/70">Instagram Link</div>
                              <div className="text-xs font-semibold truncate max-w-full mt-1 px-2">{item.url}</div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleDeleteMedia(item)}
                              className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all shadow-md"
                              title="Delete Reel"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {galleryItems.filter(i => i.type === 'reel').length === 0 && (
                      <p className="col-span-full text-sm text-muted-foreground italic py-6 text-center">No reel links added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DATABASE SETUP */}
        {activeTab === "db_setup" && <DatabaseSetupView />}

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

      {/* Trek Manager Add/Edit Modal */}
      {editTrek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <form onSubmit={handleSaveTrek} className="bg-background w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-border max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-forest text-cream p-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base">{editTrek.name ? `Edit Tour: ${editTrek.name}` : "Create Tour Package"}</h3>
              </div>
              <button type="button" onClick={() => setEditTrek(null)} className="p-1 rounded-lg hover:bg-forest-deep text-cream/80 hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub Tabs for Form */}
            <div className="bg-muted/40 border-b border-border px-4 py-1.5 flex gap-1 overflow-x-auto">
              {[
                { id: "general" as const, label: "General details" },
                { id: "details" as const, label: "Trek Specs" },
                { id: "itinerary" as const, label: "Itinerary" },
                { id: "highlights" as const, label: "Pickups & Highlights" },
                { id: "inclusions" as const, label: "Inclusions & Carry" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    formTab === tab.id
                      ? "bg-forest text-cream"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {formTab === "general" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Trek Name" value={editTrek.name} onChange={v => setEditTrek({ ...editTrek, name: v })} placeholder="e.g. Kalsubai Peak Trek" required />
                  <FormField label="Monsoon Tag / Banner" value={editTrek.tag} onChange={v => setEditTrek({ ...editTrek, tag: v })} placeholder="e.g. Monsoon Special" />
                  <FormField label="Pricing (INR)" type="number" value={editTrek.price} onChange={v => setEditTrek({ ...editTrek, price: Number(v) })} placeholder="2999" required />
                  <FormField label="Seats Available" type="number" value={editTrek.seatsLeft} onChange={v => setEditTrek({ ...editTrek, seatsLeft: Number(v) })} placeholder="10" />
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty Level</label>
                    <select
                      value={editTrek.difficulty}
                      onChange={e => setEditTrek({ ...editTrek, difficulty: e.target.value })}
                      className="rounded-xl border border-input bg-background px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
                    >
                      <option>Easy</option>
                      <option>Moderate</option>
                      <option>Challenging</option>
                    </select>
                  </div>
                  <FormField label="Duration (Format: 2D / 1N)" value={editTrek.duration} onChange={v => setEditTrek({ ...editTrek, duration: v })} placeholder="e.g. 2D / 1N" />
                  <FormField label="Next Batch Date Description" value={editTrek.nextBatch} onChange={v => setEditTrek({ ...editTrek, nextBatch: v })} placeholder="e.g. Jul 12" />
                  <FormField label="Next Batch Exact Date (for countdown)" type="date" value={editTrek.nextBatchDate ? editTrek.nextBatchDate.split('T')[0] : ""} onChange={v => setEditTrek({ ...editTrek, nextBatchDate: v ? new Date(v).toISOString() : undefined })} />
                </div>
              )}

              {formTab === "details" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Region" value={editTrek.region} onChange={v => setEditTrek({ ...editTrek, region: v })} placeholder="Sahyadris, Maharashtra" />
                    <FormField label="Basecamp Location" value={editTrek.basecamp} onChange={v => setEditTrek({ ...editTrek, basecamp: v })} placeholder="Bari village, Ahmednagar" />
                    <FormField label="Altitude" value={editTrek.altitude} onChange={v => setEditTrek({ ...editTrek, altitude: v })} placeholder="e.g. 5,400 ft" />
                    <FormField label="Best Season" value={editTrek.bestSeason} onChange={v => setEditTrek({ ...editTrek, bestSeason: v })} placeholder="e.g. Jun – Sep" />
                    <FormField label="Group Size Details" value={editTrek.groupSize} onChange={v => setEditTrek({ ...editTrek, groupSize: v })} placeholder="e.g. 12 – 25 trekkers" />
                    <FormField label="Departure City" value={editTrek.city} onChange={v => setEditTrek({ ...editTrek, city: v })} placeholder="e.g. Bangalore" />
                  </div>
                  <div className="border-t border-border pt-4">
                    <FormField label="Trek Header Image URL" value={editTrek.img} onChange={v => setEditTrek({ ...editTrek, img: v })} placeholder="https://..." />
                    <div className="mt-2.5 flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer transition-colors text-foreground">
                        <Upload className="h-3.5 w-3.5" /> Upload Image File
                        <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "trek")} className="hidden" />
                      </label>
                      {editTrek.img && <span className="text-[10px] text-muted-foreground truncate max-w-xs">{editTrek.img}</span>}
                    </div>
                  </div>
                </div>
              )}

              {formTab === "itinerary" && (
                <div className="space-y-4">
                  <ItineraryEditor
                    itinerary={editTrek.itinerary || []}
                    onChange={newItin => setEditTrek({ ...editTrek, itinerary: newItin })}
                  />
                  <div className="grid gap-1.5 pt-2 border-t border-border">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Itinerary Important Note (Optional)</label>
                    <textarea
                      value={editTrek.itineraryNote || ""}
                      onChange={e => setEditTrek({ ...editTrek, itineraryNote: e.target.value })}
                      placeholder="Add any specific note regarding weather safety or delays..."
                      rows={3}
                      className="rounded-xl border border-input bg-background/50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>
                </div>
              )}

              {formTab === "highlights" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <ArrayEditor
                    label="Trek Highlights"
                    items={editTrek.highlights || []}
                    onChange={v => setEditTrek({ ...editTrek, highlights: v })}
                    placeholder="e.g. Summit highest peak"
                  />
                  <ArrayEditor
                    label="Bangalore Pickup Points"
                    items={editTrek.pickupPoints || []}
                    onChange={v => setEditTrek({ ...editTrek, pickupPoints: v })}
                    placeholder="e.g. Majestic (8:00 PM)"
                  />
                </div>
              )}

              {formTab === "inclusions" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <ArrayEditor
                      label="Inclusions"
                      items={editTrek.inclusions || []}
                      onChange={v => setEditTrek({ ...editTrek, inclusions: v })}
                      placeholder="e.g. AC Travel"
                    />
                    <ArrayEditor
                      label="Exclusions"
                      items={editTrek.exclusions || []}
                      onChange={v => setEditTrek({ ...editTrek, exclusions: v })}
                      placeholder="e.g. Personal snacks"
                    />
                    <ArrayEditor
                      label="Things To Carry"
                      items={editTrek.thingsToCarry || []}
                      onChange={v => setEditTrek({ ...editTrek, thingsToCarry: v })}
                      placeholder="e.g. Trekking shoes"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Action Bar */}
            <div className="bg-card border-t border-border p-4 flex justify-end gap-2 shrink-0">
              <button type="button" onClick={() => setEditTrek(null)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-muted">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-forest hover:bg-forest-deep text-cream text-xs font-bold px-5 py-2.5">
                Save Tour Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Media Modal (Gallery/Reel) */}
      {addMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <form onSubmit={handleAddMedia} className="bg-background border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-display font-bold text-base">Add Media Asset</h3>
              <button type="button" onClick={() => setAddMediaOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMediaType("gallery")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${mediaType === "gallery" ? "bg-forest text-cream shadow-xs" : "text-muted-foreground"}`}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setMediaType("reel")}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${mediaType === "reel" ? "bg-forest text-cream shadow-xs" : "text-muted-foreground"}`}
              >
                Reel / Video
              </button>
            </div>

            <div className="space-y-4">
              <FormField
                label={mediaType === "gallery" ? "Photograph URL" : "Instagram Reel / Video Link"}
                value={mediaUrl}
                onChange={setMediaUrl}
                placeholder="https://..."
                required
              />

              {mediaType === "gallery" && (
                <div className="pt-1.5 border-t border-border/60">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Or Upload Image File</div>
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted cursor-pointer transition-colors text-foreground">
                    {uploadingMedia ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload Image
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, "media")} className="hidden" disabled={uploadingMedia} />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <button type="button" onClick={() => setAddMediaOpen(false)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-muted">
                Cancel
              </button>
              <button type="submit" disabled={uploadingMedia} className="rounded-lg bg-forest hover:bg-forest-deep text-cream text-xs font-bold px-5 py-2.5 disabled:opacity-50">
                Add Asset
              </button>
            </div>
          </form>
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

function FormField({ label, type = "text", onChange, ...props }: { label: string; type?: string; onChange?: (val: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
        className="rounded-xl border border-input bg-background/50 px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
      />
    </div>
  );
}

function ArrayEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (newItems: string[]) => void; placeholder?: string }) {
  const [newItem, setNewItem] = useState("");
  return (
    <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/5">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      </div>
      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-1.5 items-center">
            <span className="text-[10px] font-bold text-muted-foreground/60 w-4">{idx + 1}.</span>
            <span className="text-xs flex-1 text-foreground font-medium truncate">{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[11px] text-muted-foreground italic py-1">No items configured.</p>
        )}
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/60">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder={placeholder || "Add new item..."}
          className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (newItem.trim()) {
                onChange([...items, newItem.trim()]);
                setNewItem("");
              }
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (newItem.trim()) {
              onChange([...items, newItem.trim()]);
              setNewItem("");
            }
          }}
          className="bg-forest text-cream rounded-lg px-2.5 py-1.5 text-xs font-bold"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ItineraryEditor({ itinerary, onChange }: { itinerary: { d: string; t: string; body: string }[]; onChange: (newItinerary: { d: string; t: string; body: string }[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Itinerary Days ({itinerary.length})</label>
        <button
          type="button"
          onClick={() => onChange([...itinerary, { d: `Day ${itinerary.length}`, t: "", body: "" }])}
          className="text-xs font-bold text-forest inline-flex items-center gap-1 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add Day Card
        </button>
      </div>
      <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
        {itinerary.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2 relative">
            <button
              type="button"
              onClick={() => onChange(itinerary.filter((_, i) => i !== idx))}
              className="absolute top-2 right-2 p-1.5 rounded-lg border border-border text-red-500 hover:bg-red-50 transition-colors"
              title="Delete Day"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Day Label</span>
                <input
                  type="text"
                  value={item.d}
                  onChange={(e) => {
                    const updated = [...itinerary];
                    updated[idx] = { ...updated[idx], d: e.target.value };
                    onChange(updated);
                  }}
                  placeholder="e.g. Day 1"
                  className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                />
              </div>
              <div className="col-span-2 grid gap-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Day Title</span>
                <input
                  type="text"
                  value={item.t}
                  onChange={(e) => {
                    const updated = [...itinerary];
                    updated[idx] = { ...updated[idx], t: e.target.value };
                    onChange(updated);
                  }}
                  placeholder="e.g. Arrive & Summit Climb"
                  className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Description</span>
              <textarea
                value={item.body}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[idx] = { ...updated[idx], body: e.target.value };
                  onChange(updated);
                }}
                placeholder="Day activities schedule description..."
                rows={2}
                className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>
        ))}
        {itinerary.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No days configured yet. Click Add Day Card.</p>
        )}
      </div>
    </div>
  );
}

function DatabaseSetupView() {
  const sqlScript = `-- SQL script to create treks and gallery_reels tables for Maharashtra Trekking Co.

-- ==========================================
-- TREKS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.treks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    img TEXT,
    difficulty TEXT DEFAULT 'Moderate',
    duration TEXT DEFAULT '2D / 1N',
    price INTEGER DEFAULT 0,
    city TEXT DEFAULT 'Bangalore',
    next_batch TEXT,
    next_batch_date TIMESTAMPTZ,
    seats_left INTEGER DEFAULT 10,
    tag TEXT DEFAULT '',
    altitude TEXT DEFAULT '',
    basecamp TEXT DEFAULT '',
    region TEXT DEFAULT '',
    best_season TEXT DEFAULT '',
    group_size TEXT DEFAULT '',
    pickup_points TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    things_to_carry TEXT[] DEFAULT '{}',
    itinerary_note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read from treks" ON public.treks
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow authenticated (admin) modifications
CREATE POLICY "Allow authenticated manage treks" ON public.treks
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==========================================
-- GALLERY & REELS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gallery_reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('gallery', 'reel')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_reels ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read from gallery_reels" ON public.gallery_reels
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow authenticated (admin) modifications
CREATE POLICY "Allow authenticated manage gallery_reels" ON public.gallery_reels
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    toast.success("SQL script copied to clipboard!");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-forest/10 text-forest grid place-items-center shrink-0">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Supabase Database Setup</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Follow these steps to create the necessary tables in your Supabase backend to enable dynamic synchronization.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm max-w-3xl">
        <div className="flex gap-3">
          <span className="h-6 w-6 rounded-full bg-forest text-cream font-bold text-xs flex items-center justify-center shrink-0">1</span>
          <div>
            <strong>Access Supabase Console</strong>
            <p className="text-muted-foreground text-xs mt-0.5">Go to your remote Supabase Project dashboard (using ID kordpivredhxalaiiikd).</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="h-6 w-6 rounded-full bg-forest text-cream font-bold text-xs flex items-center justify-center shrink-0">2</span>
          <div>
            <strong>Open SQL Editor</strong>
            <p className="text-muted-foreground text-xs mt-0.5">Click the "SQL Editor" section on the left sidebar navigation, and choose "New Query".</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="h-6 w-6 rounded-full bg-forest text-cream font-bold text-xs flex items-center justify-center shrink-0">3</span>
          <div>
            <strong>Run Setup Script</strong>
            <p className="text-muted-foreground text-xs mt-0.5">Copy the SQL script block below, paste it into the editor, and click "Run".</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-muted-foreground uppercase">Setup SQL Script</span>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-bold hover:bg-muted transition-colors"
          >
            Copy SQL Script
          </button>
        </div>
        <pre className="p-4 rounded-xl border border-border bg-muted/30 text-xs font-mono text-muted-foreground max-h-72 overflow-y-auto whitespace-pre">
          {sqlScript}
        </pre>
      </div>
    </div>
  );
}
