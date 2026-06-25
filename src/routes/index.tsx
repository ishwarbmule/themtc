import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mountain, MapPin, Calendar, Users, Clock, Shield, Phone, Mail, Instagram,
  MessageCircle, Menu, X, Star, Check, ChevronRight, Compass, TentTree,
  Camera, Heart, Award, LifeBuoy, CloudRain, Leaf, Flame, Backpack, Wind,
  AlertTriangle, IndianRupee, Sunrise, Footprints, Loader2,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { sendBookingNotifications } from "@/lib/api/booking.functions";
import { toast } from "sonner";

import hero from "@/assets/hero-mountains.jpg";
import trekKalsubai from "@/assets/trek-kalsubai.jpg";
import trekRajgad from "@/assets/trek-rajgad.jpg";
import trekWaterfall from "@/assets/trek-waterfall.jpg";
import trekCamping from "@/assets/trek-camping.jpg";
import trekHarihar from "@/assets/trek-harihar.jpg";
import trekSummit from "@/assets/trek-summit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maharashtra Trekking Company — Monsoon & Weekend Treks From Bangalore" },
      { name: "description", content: "Expert-led monsoon, fort and weekend treks across the Sahyadris. Safe, certified, since 2011. Book your next adventure." },
      { property: "og:title", content: "Maharashtra Trekking Company" },
      { property: "og:description", content: "Monsoon treks, fort treks, weekend escapes — departures from Bangalore." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Upcoming", href: "#upcoming" },
  { label: "Maharashtra", href: "#packages" },
  { label: "Monsoon", href: "#monsoon" },
  { label: "Weekend", href: "#weekend" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

type TrekPackage = {
  name: string;
  img: string;
  difficulty: string;
  duration: string;
  price: number;
  city: string;
  nextBatch: string;
  seatsLeft: number;
  tag: string;
  altitude: string;
  basecamp: string;
  region: string;
  bestSeason: string;
  groupSize: string;
  pickupPoints: string[];
  highlights: string[];
  itinerary: { d: string; t: string; body: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
};

const DEFAULT_PICKUPS = [
  "Bangalore — Marathahalli (6:30 PM)",
  "Bangalore — Madiwala / BTM (7:15 PM)",
  "Bangalore — Majestic (8:00 PM)",
  "Bangalore — Hebbal (8:45 PM)",
];

const DEFAULT_INCLUSIONS = [
  "Bangalore round-trip AC transport",
  "Forest permits & entry fees",
  "Certified, first-aid trained trek leaders",
  "Meals as per itinerary",
  "Basic stay (tent / dorm / homestay)",
  "First-aid kit & emergency oxygen",
];
const DEFAULT_EXCLUSIONS = [
  "Personal expenses & snacks",
  "Travel / trek insurance (optional)",
  "Anything not listed in inclusions",
  "Extra meals during transit halts",
];
const DEFAULT_CARRY = [
  "40–60L backpack with rain cover",
  "Sturdy trekking shoes (no sneakers)",
  "2L water bottle + light snacks",
  "Poncho / rain jacket (monsoon)",
  "Torch with extra batteries",
  "Original photo ID (mandatory)",
];

const PACKAGES: TrekPackage[] = [
  {
    name: "Kalsubai Peak Trek",
    img: trekKalsubai,
    difficulty: "Moderate",
    duration: "2D / 1N",
    price: 2999,
    city: "Bangalore",
    nextBatch: "Jun 14",
    seatsLeft: 4,
    tag: "Monsoon Special",
    altitude: "5,400 ft",
    basecamp: "Bari village, Ahmednagar",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Jun – Sep",
    groupSize: "12 – 25 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "Summit the highest peak in Maharashtra (Kalsubai – 5,400 ft)",
      "Lush monsoon valleys, waterfalls and cloud play",
      "Sunrise from the temple shrine at the peak",
      "Bonfire & local Maharashtrian dinner at basecamp",
    ],
    itinerary: [
      { d: "Day 0", t: "Departure from Bangalore", body: "Pickup from Marathahalli (6:30 PM) → Madiwala → Majestic → Hebbal. Overnight travel by AC tempo traveller. Quick dinner halt en route." },
      { d: "Day 1", t: "Arrive Bari & Summit Climb", body: "Reach Bari village by morning. Freshen up, breakfast & safety briefing. Begin summit climb (4–5 hrs, iron ladders near top). Lunch at peak with valley views. Descend by evening, dinner, bonfire, overnight in tents/homestay." },
      { d: "Day 2", t: "Return to Bangalore", body: "Sunrise tea, breakfast, short local exploration. Depart by noon. Reach Bangalore early next morning. Trip ends." },
    ],
    inclusions: DEFAULT_INCLUSIONS,
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: DEFAULT_CARRY,
  },
  {
    name: "Rajgad Fort Expedition",
    img: trekRajgad,
    difficulty: "Moderate",
    duration: "2D / 1N",
    price: 3499,
    city: "Bangalore",
    nextBatch: "Jun 21",
    seatsLeft: 7,
    tag: "Heritage",
    altitude: "4,250 ft",
    basecamp: "Gunjavane village, Pune district",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Jun – Feb",
    groupSize: "12 – 25 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "Shivaji Maharaj's first capital — 26 years of history",
      "Three massive machis: Padmavati, Suvela, Sanjeevani",
      "Camp inside the fort under a million stars",
      "Heritage walk with stories from the Maratha era",
    ],
    itinerary: [
      { d: "Day 0", t: "Departure from Bangalore", body: "Pickup starts 6:30 PM. Overnight AC transport with a dinner halt." },
      { d: "Day 1", t: "Climb to Rajgad & Fort Tour", body: "Arrive Gunjavane, breakfast & briefing. Trek to Padmavati Machi (3 hrs). Lunch, rest. Guided walk across Suvela & Sanjeevani Machis. Sunset at Balekilla. Dinner & overnight stay inside the fort." },
      { d: "Day 2", t: "Sunrise & Return", body: "Sunrise photography, breakfast, descend by 11 AM. Lunch en route, return to Bangalore by early morning Day 3." },
    ],
    inclusions: DEFAULT_INCLUSIONS,
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: DEFAULT_CARRY,
  },
  {
    name: "Bhandardara Waterfall Trek",
    img: trekWaterfall,
    difficulty: "Easy",
    duration: "1D",
    price: 1799,
    city: "Bangalore",
    nextBatch: "Jun 8",
    seatsLeft: 2,
    tag: "Filling Fast",
    altitude: "2,400 ft",
    basecamp: "Bhandardara, Ahmednagar",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Jun – Sep",
    groupSize: "15 – 30 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "Umbrella & Randha waterfalls in full monsoon flow",
      "Boat ride on Arthur Lake (optional)",
      "Beginner-friendly nature walks & photography stops",
      "Hot Maharashtrian thali lunch included",
    ],
    itinerary: [
      { d: "Day 0", t: "Overnight Departure", body: "Bangalore pickup from 6:30 PM. AC overnight travel." },
      { d: "Day 1", t: "Waterfalls & Lake Day", body: "Arrive Bhandardara at sunrise, breakfast. Visit Umbrella Falls, Randha Falls, Wilson Dam viewpoint. Lunch. Optional boating. Depart by 5 PM. Reach Bangalore early morning." },
    ],
    inclusions: DEFAULT_INCLUSIONS,
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: DEFAULT_CARRY,
  },
  {
    name: "Harihar Vertical Climb",
    img: trekHarihar,
    difficulty: "Challenging",
    duration: "2D / 1N",
    price: 3899,
    city: "Bangalore",
    nextBatch: "Jul 5",
    seatsLeft: 9,
    tag: "Adventurous",
    altitude: "3,676 ft",
    basecamp: "Nirgudpada village, Nashik",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Jun – Feb",
    groupSize: "10 – 18 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "Famous 80° vertical rock-cut steps to the summit",
      "Featured on global adventure travel lists",
      "Panoramic Sahyadri views from a tiny summit plateau",
      "Hand-holding by certified leaders on the vertical section",
    ],
    itinerary: [
      { d: "Day 0", t: "Departure from Bangalore", body: "Pickup from 6:30 PM. Overnight AC travel." },
      { d: "Day 1", t: "The Vertical Climb", body: "Reach Nirgudpada, breakfast, detailed safety briefing. Trek to base of rock steps (1.5 hrs). Climb the iconic vertical steps in small batches. Summit photos, descend carefully. Dinner & overnight at homestay." },
      { d: "Day 2", t: "Return to Bangalore", body: "Breakfast, depart by 10 AM. Reach Bangalore early next morning." },
    ],
    inclusions: DEFAULT_INCLUSIONS,
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: DEFAULT_CARRY,
  },
  {
    name: "Sahyadri Camping Night",
    img: trekCamping,
    difficulty: "Easy",
    duration: "2D / 1N",
    price: 2499,
    city: "Bangalore",
    nextBatch: "Jun 28",
    seatsLeft: 6,
    tag: "Camping",
    altitude: "3,100 ft",
    basecamp: "Pawna Lake, Lonavala",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Year-round",
    groupSize: "15 – 30 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "Lakeside tents under open Sahyadri skies",
      "Bonfire, music night & BBQ dinner",
      "Easy sunrise walk to Tikona viewpoint",
      "Perfect for first-timers, families & groups",
    ],
    itinerary: [
      { d: "Day 0", t: "Departure from Bangalore", body: "Pickup from 6:30 PM. Overnight AC travel." },
      { d: "Day 1", t: "Lakeside Camping", body: "Arrive Pawna by noon. Tent allotment, lunch. Free time by the lake, kayaking (optional). Sunset, bonfire, BBQ dinner, music night. Overnight in tents." },
      { d: "Day 2", t: "Sunrise & Return", body: "Sunrise walk, breakfast, depart by 11 AM. Reach Bangalore early next morning." },
    ],
    inclusions: DEFAULT_INCLUSIONS,
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: DEFAULT_CARRY,
  },
  {
    name: "Sandhan Valley Backpack",
    img: trekSummit,
    difficulty: "Challenging",
    duration: "3D / 2N",
    price: 5499,
    city: "Bangalore",
    nextBatch: "Jul 12",
    seatsLeft: 8,
    tag: "Backpacking",
    altitude: "4,255 ft",
    basecamp: "Samrad village, Ahmednagar",
    region: "Sahyadris, Maharashtra",
    bestSeason: "Oct – May (closed in peak monsoon)",
    groupSize: "10 – 16 trekkers",
    pickupPoints: DEFAULT_PICKUPS,
    highlights: [
      "India's only 'Valley of Shadows' — narrow canyon walk",
      "Rappelling, river crossing & boulder hopping",
      "Two nights of wild camping under the stars",
      "Trek led by AMC-certified mountaineers",
    ],
    itinerary: [
      { d: "Day 0", t: "Departure from Bangalore", body: "Pickup from 6:30 PM. Overnight AC travel." },
      { d: "Day 1", t: "Arrive Samrad, Acclimatise", body: "Reach Samrad village. Breakfast, gear check, technical briefing. Short acclimatisation walk to canyon edge. Dinner, overnight at homestay." },
      { d: "Day 2", t: "Canyon Descent & Wild Camp", body: "Early breakfast. Descend into Sandhan Valley with rappels & water pools. Lunch packed. Camp inside the canyon. Dinner, stargazing." },
      { d: "Day 3", t: "Exit & Return", body: "Breakfast, exit via Karoli ghat. Lunch at Samrad. Depart for Bangalore by 3 PM. Reach next morning." },
    ],
    inclusions: [...DEFAULT_INCLUSIONS, "Rappelling gear & technical equipment"],
    exclusions: DEFAULT_EXCLUSIONS,
    thingsToCarry: [...DEFAULT_CARRY, "Quick-dry trekking pants (mandatory)"],
  },
];

const CATEGORIES = [
  { name: "Weekend Treks", icon: Calendar, count: 18 },
  { name: "Monsoon Treks", icon: CloudRain, count: 12 },
  { name: "Fort Treks", icon: Shield, count: 9 },
  { name: "Camping Trips", icon: TentTree, count: 7 },
  { name: "Beginner Treks", icon: Footprints, count: 11 },
  { name: "Backpacking", icon: Backpack, count: 5 },
];

const REVIEWS = [
  { name: "Aditi Rao", trek: "Kalsubai Peak", rating: 5, text: "Best monsoon trek of my life. Trek leaders were super safety-focused and the views from the top were unreal." },
  { name: "Karthik M.", trek: "Rajgad Fort", rating: 5, text: "Loved the history mixed with adventure. Bangalore pickup, food, everything was sorted. Smooth experience start to finish." },
  { name: "Sneha P.", trek: "Harihar Fort", rating: 5, text: "Vertical steps were intense but the team made it feel safe. Already booking my next trek with them!" },
  { name: "Rahul J.", trek: "Sandhan Valley", rating: 5, text: "3 days of pure adrenaline. Pro guides, great group, sorted logistics. Worth every rupee." },
];

const FAQS = [
  { q: "Where do treks depart from?", a: "All our treks have pickup points in Bangalore — Marathahalli, Madiwala, Majestic. We travel overnight by AC tempo traveller / mini-bus." },
  { q: "Do I need prior trekking experience?", a: "Not at all. We have treks rated Easy, Moderate and Challenging. Beginners are welcome on Easy and most Moderate treks." },
  { q: "What is included in the package?", a: "Transport from Bangalore, meals as per itinerary, certified trek leaders, first-aid, basic accommodation, and all permits." },
  { q: "Is monsoon trekking safe?", a: "Yes — with the right team. We monitor weather, follow safe routes, carry first-aid and have emergency protocols. Trails we deem unsafe are not attempted." },
  { q: "What is the cancellation policy?", a: "Free cancellation 15+ days before. 50% refund 7–14 days before. No refund within 7 days, but you can reschedule once." },
];

function Index() {
  const [selected, setSelected] = useState<TrekPackage | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ name?: string }>;
      const pkg = PACKAGES.find((p) => p.name === ce.detail?.name) ?? PACKAGES[0];
      setSelected(pkg);
    };
    window.addEventListener("open-booking", handler as EventListener);
    return () => window.removeEventListener("open-booking", handler as EventListener);
  }, []);

  return (
    <div id="home" className="min-h-screen bg-background text-foreground">
      <Header />
      <TrustStrip />
      <Hero />
      <Stats />
      <Upcoming />
      <Categories />
      <FeaturedPackages onBook={setSelected} />
      <Safety />
      <Gallery />
      <Reviews />
      <BookingForm />
      <Contact />
      <FAQ />
      <Footer />
      <FloatingButtons />
      <PackageDetailsModal pkg={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function openBooking(name?: string) {
  window.dispatchEvent(new CustomEvent("open-booking", { detail: { name } }));
}

/* ---------------- Header ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border/50" : "bg-gradient-to-b from-background/90 to-transparent"}`}>
      <div className="container-trek flex h-16 items-center justify-between gap-3">
        <a href="#home" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-ember text-background">
            <Mountain className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] text-foreground tracking-tight">MAHARASHTRA</span>
            <span className="block text-[10px] -mt-0.5 font-bold tracking-[0.25em] text-ember uppercase">Trekking Co.</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <a href="https://wa.me/918983433664" className="inline-flex items-center gap-1.5 rounded-md bg-whatsapp text-white px-3 py-2 text-sm font-semibold hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <button onClick={() => openBooking()} className="inline-flex items-center gap-1.5 rounded-md bg-ember text-background px-4 py-2 text-sm font-bold hover:bg-ember-deep">
            Book Now <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden grid place-items-center h-10 w-10 rounded-lg hover:bg-muted text-foreground" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur">
          <nav className="container-trek py-3 flex flex-col">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium border-b border-border/50 last:border-0 text-foreground/85">
                {n.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3">
              <a href="https://wa.me/918983433664" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-whatsapp text-white px-3 py-2.5 text-sm font-semibold">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <button onClick={() => { setOpen(false); openBooking(); }} className="flex-1 inline-flex items-center justify-center rounded-md bg-ember text-background px-3 py-2.5 text-sm font-bold">
                Book Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


/* ---------------- Trust Strip ---------------- */
function TrustStrip() {
  const items = [
    "Govt. Registered",
    "AOTM Member",
    "IATO Verified",
    "Safety Certified",
    "Travel Partner",
    "Eco Trekking",
  ];
  return (
    <div className="bg-forest text-cream/90">
      <div className="container-trek py-2.5 overflow-hidden">
        <div className="flex items-center gap-6 text-[11px] sm:text-xs font-medium uppercase tracking-wider whitespace-nowrap animate-[scroll_30s_linear_infinite]">
          {[...items, ...items].map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-ember" /> {it}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden -mt-16 pt-16">
      <img src={hero} alt="Sahyadri mountains at sunrise" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover scale-105" />
      {/* Netflix-style triple gradient: left vignette, bottom fade, top fade for header */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container-trek relative z-10 pb-16 sm:pb-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-sm bg-ember/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-background mb-5">
            <Flame className="h-3 w-3" /> Monsoon Season · Now Streaming
          </span>
          <h1 className="font-display font-extrabold text-[44px] sm:text-7xl lg:text-[64px] leading-[0.95] text-foreground text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Explore Maharashtra <br className="hidden sm:block" />
            With <span className="text-ember">Experts</span>
          </h1>
          <p className="mt-5 text-sm sm:text-lg max-w-xl text-foreground/85">
            Monsoon treks, fort expeditions and weekend escapes across the Sahyadris — curated, certified, and unforgettable. Departures from Bangalore.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => openBooking()} className="inline-flex items-center gap-2 rounded-md bg-foreground hover:bg-foreground/90 text-background px-6 py-3.5 font-bold shadow-trek">
              <Flame className="h-4 w-4 fill-current" /> Book a Trek
            </button>
            <a href="#packages" className="inline-flex items-center gap-2 rounded-md bg-foreground/15 hover:bg-foreground/25 backdrop-blur text-foreground px-6 py-3.5 font-semibold border border-foreground/20">
              <ChevronRight className="h-4 w-4" /> Browse All Treks
            </a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-xs text-foreground/70">
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 text-ember fill-ember" /> 4.9 · 2,400+ reviews</span>
            <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-ember" /> Safety certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- Stats ---------------- */
function Stats() {
  const stats = [
    { v: "13+", l: "Years Experience" },
    { v: "25K+", l: "Happy Trekkers" },
    { v: "1,200+", l: "Trips Conducted" },
    { v: "24/7", l: "Safety Support" },
  ];
  return (
    <section className="bg-forest-deep text-cream">
      <div className="container-trek grid grid-cols-2 sm:grid-cols-4 divide-x divide-cream/15">
        {stats.map((s) => (
          <div key={s.l} className="px-3 py-6 text-center">
            <div className="font-display text-3xl sm:text-4xl font-bold text-ember">{s.v}</div>
            <div className="mt-1 text-[11px] sm:text-xs uppercase tracking-wider text-cream/75">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Upcoming Countdown ---------------- */
function Upcoming() {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    target.setHours(6, 0, 0, 0);
    const tick = () => {
      const t = target.getTime() - Date.now();
      const d = Math.max(0, Math.floor(t / 86400000));
      const h = Math.max(0, Math.floor((t / 3600000) % 24));
      const m = Math.max(0, Math.floor((t / 60000) % 60));
      const s = Math.max(0, Math.floor((t / 1000) % 60));
      setDiff({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="upcoming" className="py-12 sm:py-16">
      <div className="container-trek">
        <div className="rounded-3xl bg-gradient-to-br from-forest to-forest-deep text-cream p-6 sm:p-10 shadow-trek overflow-hidden relative">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-ember/20 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-6 items-center relative">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/95 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1">
                <Sunrise className="h-3.5 w-3.5" /> Next Batch
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl font-bold leading-tight">
                Kalsubai Peak Monsoon Trek
              </h2>
              <p className="mt-2 text-cream/80 text-sm sm:text-base">
                Bangalore departure · Only <span className="text-ember font-bold">4 seats</span> left for this batch.
              </p>
              <a href="#book" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ember hover:bg-ember-deep text-white px-5 py-3 font-semibold">
                Reserve My Seat <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { v: diff.d, l: "Days" },
                { v: diff.h, l: "Hours" },
                { v: diff.m, l: "Min" },
                { v: diff.s, l: "Sec" },
              ].map((c) => (
                <div key={c.l} className="rounded-2xl bg-cream/10 border border-cream/15 backdrop-blur p-3 text-center">
                  <div className="font-display text-2xl sm:text-4xl font-bold text-cream tabular-nums">
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-cream/70 mt-1">{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Categories ---------------- */
function Categories() {
  return (
    <section id="weekend" className="py-12 sm:py-16">
      <div className="container-trek">
        <SectionHead eyebrow="Pick your style" title="Trek Categories" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <a key={c.name} href="#packages" className="group rounded-2xl bg-card border border-border p-5 hover:border-forest hover:shadow-card transition-all">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-forest/10 text-forest group-hover:bg-forest group-hover:text-cream transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-display font-bold text-base sm:text-lg">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.count} trips</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Packages ---------------- */
/* ---------------- Packages — Netflix-style rails ---------------- */
function FeaturedPackages({ onBook }: { onBook: (p: TrekPackage) => void }) {
  const rails: { title: string; sub: string; items: TrekPackage[] }[] = [
    { title: "Trending This Monsoon", sub: "What everyone is booking right now", items: PACKAGES },
    { title: "Weekend Escapes from Bangalore", sub: "Quick getaways · 1 – 2 days", items: PACKAGES.filter(p => p.duration.startsWith("1") || p.duration.startsWith("2")) },
    { title: "Heritage & Fort Treks", sub: "Walk through Maratha history", items: PACKAGES.filter(p => /fort|rajgad|harihar/i.test(p.name) || p.tag === "Heritage") },
    { title: "For the Adventurous", sub: "Steep climbs, big rewards", items: PACKAGES.filter(p => p.difficulty !== "Easy") },
  ];

  return (
    <section id="packages" className="py-12 sm:py-16 bg-background">
      <div id="monsoon" className="space-y-12">
        {rails.map((rail) => (
          <PackageRail key={rail.title} title={rail.title} sub={rail.sub} items={rail.items} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}

function PackageRail({ title, sub, items, onBook }: { title: string; sub: string; items: TrekPackage[]; onBook: (p: TrekPackage) => void }) {
  if (!items.length) return null;
  return (
    <div className="group/rail">
      <div className="container-trek mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-foreground tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{sub}</p>
        </div>
        <a href="#packages" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-ember hover:text-ember-deep">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory px-5 sm:px-[max(1.25rem,calc((100vw-1280px)/2+1.25rem))] pb-4">
          {items.map((p) => (
            <PosterCard key={p.name + title} pkg={p} onBook={onBook} />
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}

function PosterCard({ pkg, onBook }: { pkg: TrekPackage; onBook: (p: TrekPackage) => void }) {
  return (
    <button
      onClick={() => onBook(pkg)}
      className="group/card relative snap-start shrink-0 w-[78%] xs:w-[60%] sm:w-[300px] md:w-[320px] text-left rounded-md overflow-hidden bg-card border border-border/60 hover:border-ember/60 hover:scale-[1.03] hover:z-10 transition-all duration-300 shadow-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={pkg.img} alt={pkg.name} loading="lazy" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <span className="absolute top-3 left-3 rounded-sm bg-ember text-background text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1">{pkg.tag}</span>
        <span className="absolute top-3 right-3 rounded-sm bg-background/80 backdrop-blur text-foreground text-[10px] font-bold px-2 py-1 border border-border/60">
          {pkg.seatsLeft} left
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-tight drop-shadow-lg">{pkg.name}</h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-foreground/80">
            <span className="inline-flex items-center gap-1"><Footprints className="h-3 w-3 text-ember" />{pkg.difficulty}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-ember" />{pkg.duration}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-ember" />{pkg.nextBatch}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-xl font-bold text-foreground inline-flex items-center">
              <IndianRupee className="h-4 w-4" />{pkg.price.toLocaleString("en-IN")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-ember text-background px-3 py-1.5 text-xs font-bold">
              Book <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}


/* ---------------- Trip Overview ---------------- */
function TripOverview() {
  const data = [
    { l: "Location", v: "Sahyadris, Maharashtra", icon: MapPin },
    { l: "Duration", v: "2 Days / 1 Night", icon: Clock },
    { l: "Difficulty", v: "Moderate", icon: Footprints },
    { l: "Altitude", v: "5,400 ft", icon: Mountain },
    { l: "Temperature", v: "18°–25° C", icon: Wind },
    { l: "Best Season", v: "Jun – Sep", icon: CloudRain },
    { l: "Group Size", v: "12 – 25 trekkers", icon: Users },
    { l: "Departure", v: "Bangalore", icon: Compass },
  ];
  return (
    <section className="py-12 sm:py-16">
      <div className="container-trek">
        <SectionHead eyebrow="Trip overview" title="Kalsubai Peak — At a Glance" sub="A representative overview. Every package page carries its own detailed brief." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {data.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.l} className="rounded-2xl bg-card border border-border p-4">
                <Icon className="h-5 w-5 text-ember" />
                <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{d.l}</div>
                <div className="font-semibold mt-0.5">{d.v}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Itinerary ---------------- */
function Itinerary() {
  const days = [
    { d: "Day 0", t: "Departure from Bangalore", body: "9:00 PM pickup from Marathahalli → Madiwala → Majestic. Overnight travel by AC tempo traveller." },
    { d: "Day 1", t: "Trek to Kalsubai Summit", body: "Arrive at Bari village. Breakfast, briefing, then summit climb (4–5 hrs). Lunch at top. Descend, dinner, bonfire, overnight stay." },
    { d: "Day 2", t: "Return to Bangalore", body: "Breakfast, local exploration, depart by noon. Reach Bangalore early next morning." },
  ];
  return (
    <section className="py-12 sm:py-16 bg-muted/40">
      <div className="container-trek">
        <SectionHead eyebrow="Day-wise plan" title="Itinerary" />
        <ol className="relative border-l-2 border-dashed border-forest/40 ml-3 space-y-6">
          {days.map((d) => (
            <li key={d.d} className="pl-6 relative">
              <span className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-ember ring-4 ring-background grid place-items-center">
                <Mountain className="h-2.5 w-2.5 text-white" />
              </span>
              <div className="text-[11px] font-bold uppercase tracking-wider text-ember">{d.d}</div>
              <h3 className="font-display font-bold text-lg mt-0.5">{d.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Inclusions / Exclusions ---------------- */
function InclusionsExclusions() {
  const inc = ["Bangalore round-trip transport", "Forest permits & fees", "Certified trek leaders", "First-aid & oxygen", "Meals as per itinerary", "Basic stay (tent/dorm)"];
  const exc = ["Personal expenses & snacks", "Insurance (optional)", "Anything not in inclusions", "Extra meals during transit"];
  const carry = ["60L backpack + rain cover", "Sturdy trekking shoes", "2L water + snacks", "Poncho / rain jacket", "Torch with extra batteries", "ID proof (mandatory)"];
  return (
    <section className="py-12 sm:py-16">
      <div className="container-trek grid md:grid-cols-3 gap-4 sm:gap-6">
        <ListCard title="Inclusions" items={inc} accent="bg-forest text-cream" icon={<Check className="h-4 w-4" />} />
        <ListCard title="Exclusions" items={exc} accent="bg-destructive text-cream" icon={<X className="h-4 w-4" />} />
        <ListCard title="Things To Carry" items={carry} accent="bg-ember text-white" icon={<Backpack className="h-4 w-4" />} />
      </div>
    </section>
  );
}

function ListCard({ title, items, accent, icon }: { title: string; items: string[]; accent: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center gap-2">
        <span className={`h-8 w-8 rounded-lg grid place-items-center ${accent}`}>{icon}</span>
        <h3 className="font-display font-bold text-lg">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Safety ---------------- */
function Safety() {
  const items = [
    { i: Shield, t: "Experienced Trek Leaders", d: "Avg 8+ years on Sahyadri trails." },
    { i: LifeBuoy, t: "24/7 Emergency Support", d: "Dedicated SOS line for every batch." },
    { i: Heart, t: "First Aid & Oxygen", d: "Carried on every trek without exception." },
    { i: Users, t: "Ground Operations Team", d: "Local staff at every basecamp." },
    { i: CloudRain, t: "Weather Monitoring", d: "Daily checks before & during treks." },
    { i: Leaf, t: "Responsible Trekking", d: "Pack-in pack-out. Leave no trace." },
  ];
  return (
    <section id="about" className="py-12 sm:py-16 bg-forest text-cream">
      <div className="container-trek">
        <SectionHead eyebrow="Safety first" title="Why Trek With Us" theme="dark" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((it) => {
            const Icon = it.i;
            return (
              <div key={it.t} className="rounded-2xl bg-cream/10 border border-cream/15 backdrop-blur p-5">
                <div className="h-10 w-10 rounded-xl bg-ember grid place-items-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 font-display font-bold text-lg">{it.t}</h3>
                <p className="text-sm text-cream/80 mt-1">{it.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery() {
  const imgs = [trekKalsubai, trekRajgad, trekWaterfall, trekHarihar, trekCamping, trekSummit];
  return (
    <section id="gallery" className="py-12 sm:py-16">
      <div className="container-trek">
        <SectionHead eyebrow="Memories" title="Gallery & Reels" sub="Real photos from real batches across the Sahyadris." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {imgs.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
              <img src={src} alt={`Trek moment ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <Camera className="h-5 w-5 text-cream" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  return (
    <section className="py-12 sm:py-16 bg-muted/40">
      <div className="container-trek">
        <SectionHead eyebrow="Loved by trekkers" title="What Our Trekkers Say" />
        <div className="grid sm:grid-cols-2 gap-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center gap-1 text-ember">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed">"{r.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-forest text-cream grid place-items-center font-bold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.trek}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/* ---------------- Booking Form ---------------- */
function BookingForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get("fullName") as string;
    const mobile = formData.get("mobile") as string;
    const trekName = formData.get("trek") as string;
    const seats = Number(formData.get("seats")) || 1;
    const pickupPoint = formData.get("pickup") as string;
    const screenshotFile = formData.get("screenshot") as File;

    try {
      let screenshotUrl = null;

      // 1. Upload payment screenshot if selected
      if (screenshotFile && screenshotFile.size > 0) {
        const fileExt = screenshotFile.name.split(".").pop();
        const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("booking_screenshots")
          .upload(fileName, screenshotFile);

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError);
          toast.error("Failed to upload payment screenshot: " + uploadError.message);
          setSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("booking_screenshots")
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
      }

      // 2. Insert record into Supabase bookings table
      const { error: dbError } = await supabase
        .from("bookings")
        .insert([
          {
            trek_name: trekName,
            seats,
            pickup_point: pickupPoint,
            full_name: fullName,
            phone: mobile,
            screenshot_url: screenshotUrl,
            status: "Pending",
          }
        ]);

      if (dbError) {
        console.error("Database insert error:", dbError);
        toast.error("Failed to save booking details to database: " + dbError.message);
        setSubmitting(false);
        return;
      }

      // 3. Trigger email notifications via server function
      try {
        await sendBookingNotifications({
          data: {
            trekName,
            fullName,
            phone: mobile,
            seats,
            pickupPoint,
            screenshotUrl,
          }
        });
      } catch (emailErr) {
        // Log the email failure but don't block the user checkout experience
        console.error("Email notification failed:", emailErr);
      }

      // Update state to show success message
      setSent(true);
      toast.success("Booking registered successfully!");

      // 5. Redirect to WhatsApp with pre-filled details
      const whatsappNumber = "918983433664";
      const message = `Namaste Maharashtra Trekking Co.! I have submitted a booking form.

Booking Details:
• Trek: ${trekName}
• Seats: ${seats}
• Pickup: ${pickupPoint}
• Name: ${fullName}
• Phone: ${mobile}

Please verify my payment screenshot and confirm my seat!`;

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");

    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-12 sm:py-16">
      <div className="container-trek">
        <div className="rounded-3xl overflow-hidden border border-border grid lg:grid-cols-5 bg-card shadow-card">
          <div className="lg:col-span-2 bg-forest text-cream p-5 sm:p-8 relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${trekSummit})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">Book Your Trek</h2>
              <p className="mt-2 text-cream/85 text-sm">Fill the form — our team confirms your seat on WhatsApp within 2 hours.</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4 text-ember shrink-0 mt-0.5" />Verified pickup points</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-ember shrink-0 mt-0.5" />Easy reschedule policy</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-ember shrink-0 mt-0.5" />Pay via UPI / Bank transfer</li>
              </ul>
            </div>
          </div>
          <form onSubmit={handleFormSubmit} className="lg:col-span-3 p-5 sm:p-8 grid gap-4">
            {sent ? (
              <div className="text-center py-10">
                <div className="mx-auto h-14 w-14 rounded-full bg-forest text-cream grid place-items-center">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold mt-4">Request received!</h3>
                <p className="text-sm text-muted-foreground mt-1">We'll WhatsApp you shortly to confirm.</p>
              </div>
            ) : (
              <>
                <Field label="Full Name" type="text" placeholder="Your name" required name="fullName" />
                <Field label="Mobile Number" type="tel" placeholder="+91 9XXXXXXXXX" required name="mobile" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField label="Trek Selection" options={PACKAGES.map(p => p.name)} name="trek" />
                  <Field label="Number of Seats" type="number" placeholder="1" min={1} max={10} name="seats" defaultValue={1} />
                </div>
                <SelectField label="Pickup Point" options={["Marathahalli", "Madiwala (BTM)", "Majestic", "Hebbal"]} name="pickup" />
                <Field label="Payment Screenshot" type="file" name="screenshot" accept="image/*" />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ember hover:bg-ember-deep text-white py-3.5 font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Confirming...
                    </>
                  ) : (
                    <>
                      Confirm Booking <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-muted-foreground text-center">By booking you agree to our cancellation & refund policy.</p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const isFile = props.type === "file";
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...props}
        className={`rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest ${
          isFile
            ? "file:mr-3 file:rounded-lg file:border-0 file:bg-forest file:text-cream file:px-3 file:py-1 file:text-xs file:font-semibold cursor-pointer"
            : ""
        }`}
      />
    </label>
  );
}
function SelectField({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select {...props} className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 bg-muted/40">
      <div className="container-trek grid lg:grid-cols-2 gap-6">
        <div>
          <SectionHead eyebrow="Reach out" title="Talk To Our Trek Team" align="left" />
          <ul className="space-y-4 mt-4">
            {[
              { i: Phone, l: "Phone", v: "+91 89834 33664" },
              { i: MessageCircle, l: "WhatsApp", v: "+91 89834 33664" },
              { i: Mail, l: "Email", v: "hello@maharashtratreks.com" },
              { i: Instagram, l: "Instagram", v: "@maharashtra.treks" },
              { i: MapPin, l: "Office", v: "Indiranagar, Bangalore, KA 560038" },
            ].map((c) => {
              const Icon = c.i;
              return (
                <li key={c.l} className="flex gap-3 items-start">
                  <span className="h-10 w-10 rounded-xl bg-forest/10 text-forest grid place-items-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{c.l}</div>
                    <div className="font-medium">{c.v}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-square lg:aspect-auto min-h-[300px]">
          <iframe
            title="Office location"
            src="https://www.google.com/maps?q=Indiranagar,Bangalore&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-trek max-w-3xl">
        <SectionHead eyebrow="Need to know" title="Frequently Asked Questions" />
        <div className="divide-y divide-border border border-border rounded-2xl bg-card">
          {FAQS.map((f, i) => (
            <details key={i} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex justify-between items-center cursor-pointer font-semibold">
                <span>{f.q}</span>
                <span className="ml-3 h-7 w-7 rounded-full bg-muted grid place-items-center group-open:bg-ember group-open:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-ember/10 border border-ember/30 p-5 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-ember shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Important:</strong> Trek dates may shift due to weather or local conditions. We always prioritise safety over schedule.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="bg-forest-deep text-cream/90 pt-12 pb-24">
      <div className="container-trek grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-ember">
              <Mountain className="h-5 w-5" />
            </span>
            <span>Maharashtra Trekking Co.</span>
          </div>
          <p className="mt-3 text-sm text-cream/70">
            Expert-led monsoon, fort and weekend treks across the Sahyadris. Departures from Bangalore since 2011.
          </p>
        </div>
        <FooterCol title="Explore" items={["Upcoming Treks", "Monsoon Treks", "Fort Treks", "Weekend Treks", "Camping"]} />
        <FooterCol title="Policies" items={["Terms & Conditions", "Privacy Policy", "Refund Policy", "Cancellation Policy", "Safety Charter"]} />
        <div>
          <h4 className="font-display font-bold text-cream mb-3">Follow</h4>
          <div className="flex gap-2">
            {[Instagram, MessageCircle, Mail, Phone].map((Icon, i) => (
              <a key={i} href="#contact" className="h-10 w-10 rounded-xl bg-cream/10 hover:bg-ember grid place-items-center transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-cream/60">© {new Date().getFullYear()} Maharashtra Trekking Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display font-bold text-cream mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((i) => <li key={i}><a href="#" className="hover:text-ember transition-colors">{i}</a></li>)}
      </ul>
    </div>
  );
}

/* ---------------- Floating ---------------- */
function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bookEl = document.getElementById("book");
    if (!bookEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(bookEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-4 inset-x-4 z-40 flex gap-2 sm:left-auto sm:right-4 sm:bottom-6 sm:flex-col sm:items-end transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <a href="https://wa.me/918983433664" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp text-white px-5 py-3.5 font-semibold shadow-trek hover:opacity-90">
        <MessageCircle className="h-5 w-5" /> <span className="sm:hidden">WhatsApp</span>
      </a>
      <a href="#book" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-ember text-white px-5 py-3.5 font-semibold shadow-trek hover:bg-ember-deep">
        <Mountain className="h-5 w-5" /> Book Now
      </a>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function SectionHead({ eyebrow, title, sub, align = "center", theme = "light" }: { eyebrow: string; title: string; sub?: string; align?: "left" | "center"; theme?: "light" | "dark" }) {
  return (
    <div className={`mb-8 sm:mb-10 ${align === "center" ? "text-center" : ""}`}>
      <div className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${theme === "dark" ? "text-ember" : "text-ember"}`}>
        <span className="h-px w-6 bg-ember" /> {eyebrow}
      </div>
      <h2 className={`mt-3 font-display text-3xl sm:text-4xl font-bold text-balance ${theme === "dark" ? "text-cream" : ""}`}>{title}</h2>
      {sub && <p className={`mt-3 text-sm sm:text-base max-w-2xl ${align === "center" ? "mx-auto" : ""} ${theme === "dark" ? "text-cream/80" : "text-muted-foreground"}`}>{sub}</p>}
    </div>
  );
}

/* ---------------- Package Details Modal (step-by-step booking) ---------------- */
function PackageDetailsModal({ pkg, onClose }: { pkg: TrekPackage | null; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [seats, setSeats] = useState(1);
  const [pickup, setPickup] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergency, setEmergency] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (pkg) {
      setStep(0);
      setSubmitted(false);
      setPickup(pkg.pickupPoints[0] ?? "");
    }
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [pkg]);

  if (!pkg) return null;

  const steps = ["Overview", "Itinerary", "Inclusions", "Pickup", "Payment"];
  const total = pkg.price * Math.max(1, seats);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleNextClick = () => {
    if (step === 3) {
      if (!name.trim()) {
        toast.error("Please enter your Full Name.");
        return;
      }
      if (!phone.trim()) {
        toast.error("Please enter your Mobile Number.");
        return;
      }
      if (!email.trim()) {
        toast.error("Please enter your Email Address.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid Email Address.");
        return;
      }
      if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
        toast.error("Please enter a valid Age.");
        return;
      }
      if (!gender) {
        toast.error("Please select your Gender.");
        return;
      }
      if (!emergency.trim()) {
        toast.error("Please enter an Emergency Contact.");
        return;
      }
      if (!pickup) {
        toast.error("Please select a Pickup Point.");
        return;
      }
    }
    next();
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTransitioning) {
      return;
    }

    const formElement = e.currentTarget as HTMLFormElement;
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
    const screenshotFile = fileInput?.files?.[0];

    // Make payment screenshot mandatory
    if (!screenshotFile || screenshotFile.size === 0) {
      toast.error("Please upload your payment screenshot to confirm booking.");
      return;
    }

    setSubmitting(true);

    try {
      let screenshotUrl = null;

      // 1. Upload payment screenshot if selected
      if (screenshotFile && screenshotFile.size > 0) {
        const fileExt = screenshotFile.name.split(".").pop();
        const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("booking_screenshots")
          .upload(fileName, screenshotFile);

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError);
          toast.error("Failed to upload payment screenshot: " + uploadError.message);
          setSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("booking_screenshots")
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
      }

      // 2. Insert record into Supabase bookings table
      const { error: dbError } = await supabase
        .from("bookings")
        .insert([
          {
            trek_name: pkg.name,
            seats,
            pickup_point: pickup,
            full_name: name,
            phone,
            email: email || null,
            age: Number(age) || null,
            gender: gender || null,
            emergency_contact: emergency || null,
            screenshot_url: screenshotUrl,
            status: "Pending",
          }
        ]);

      if (dbError) {
        console.error("Database insert error:", dbError);
        toast.error("Failed to save booking details to database: " + dbError.message);
        setSubmitting(false);
        return;
      }

      // 3. Trigger email notifications via server function
      try {
        await sendBookingNotifications({
          data: {
            trekName: pkg.name,
            fullName: name,
            phone,
            email: email || null,
            seats,
            pickupPoint: pickup,
            age: Number(age) || null,
            gender: gender || null,
            emergencyContact: emergency || null,
            screenshotUrl,
          }
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }

      // Update state to show success screen
      setSubmitted(true);
      toast.success("Booking request registered successfully!");

      // 5. Redirect to WhatsApp with pre-filled details
      const whatsappNumber = "918983433664";
      const message = `Namaste Maharashtra Trekking Co.! I have submitted a booking request.

Booking Details:
• Trek: ${pkg.name}
• Batch: ${pkg.nextBatch}
• Seats: ${seats}
• Pickup: ${pickup}
• Name: ${name}
• Phone: ${phone}
• Email: ${email || 'N/A'}
• Age/Gender: ${age || 'N/A'} / ${gender || 'N/A'}
• Emergency Contact: ${emergency || 'N/A'}

Please verify my payment screenshot and confirm my booking!`;

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");

    } catch (err) {
      console.error("Modal booking submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-forest-deep/70 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative h-44 sm:h-56 shrink-0">
          <img src={pkg.img} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
          <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 text-foreground grid place-items-center hover:bg-background">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-cream">
            <span className="inline-flex items-center gap-1 rounded-full bg-ember px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{pkg.tag}</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1.5">{pkg.name}</h2>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-cream/90">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{pkg.region}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pkg.duration}</span>
              <span className="inline-flex items-center gap-1"><Footprints className="h-3.5 w-3.5" />{pkg.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="border-b border-border bg-muted/40 px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {steps.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  if (i <= step) {
                    setStep(i);
                  } else {
                    toast.error("Please fill in your details and click Next to proceed.");
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${i === step ? "bg-forest text-cream" : i < step ? "bg-forest/10 text-forest" : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] ${i === step ? "bg-ember text-white" : i < step ? "bg-forest text-cream" : "bg-muted-foreground/20"}`}>
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 0 && <StepOverview pkg={pkg} />}
          {step === 1 && <StepItinerary pkg={pkg} />}
          {step === 2 && <StepInclusions pkg={pkg} />}
          {step === 3 && (
            <StepPickup
              pkg={pkg}
              seats={seats} setSeats={setSeats}
              pickup={pickup} setPickup={setPickup}
              name={name} setName={setName}
              phone={phone} setPhone={setPhone}
              email={email} setEmail={setEmail}
              age={age} setAge={setAge}
              gender={gender} setGender={setGender}
              emergency={emergency} setEmergency={setEmergency}
            />
          )}
          {step === 4 && (
            <StepPayment
              pkg={pkg} total={total} seats={seats} pickup={pickup}
              name={name} phone={phone}
              submitted={submitted} onSubmit={submitBooking}
            />
          )}
        </div>

        {/* Footer / Nav */}
        <div className="border-t border-border bg-card px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
            <div className="font-display text-xl font-bold inline-flex items-center text-forest">
              <IndianRupee className="h-4 w-4" />{total.toLocaleString("en-IN")}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">/ {seats} seat{seats > 1 ? "s" : ""}</span>
            </div>
          </div>
          {step > 0 && (
            <button key={`back-btn-${step}`} type="button" onClick={prev} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button key={`next-btn-${step}`} type="button" onClick={handleNextClick} className="inline-flex items-center gap-1 rounded-full bg-ember hover:bg-ember-deep text-white px-5 py-2.5 text-sm font-bold">
              Next: {steps[step + 1]} <ChevronRight className="h-4 w-4" />
            </button>
          ) : !submitted ? (
            <button
              key="confirm-booking-btn"
              form="modal-booking-form"
              type="submit"
              disabled={submitting || isTransitioning}
              className="inline-flex items-center gap-1 rounded-full bg-ember hover:bg-ember-deep text-white px-5 py-2.5 text-sm font-bold disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  Confirm Booking <Check className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button onClick={onClose} className="rounded-full bg-forest text-cream px-5 py-2.5 text-sm font-bold">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepOverview({ pkg }: { pkg: TrekPackage }) {
  const facts = [
    { l: "Region", v: pkg.region, icon: MapPin },
    { l: "Duration", v: pkg.duration, icon: Clock },
    { l: "Difficulty", v: pkg.difficulty, icon: Footprints },
    { l: "Altitude", v: pkg.altitude, icon: Mountain },
    { l: "Basecamp", v: pkg.basecamp, icon: TentTree },
    { l: "Best Season", v: pkg.bestSeason, icon: CloudRain },
    { l: "Group Size", v: pkg.groupSize, icon: Users },
    { l: "Departure", v: pkg.city, icon: Compass },
  ];
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">About this trek</div>
        <h3 className="font-display text-xl font-bold mt-1">Trek Highlights</h3>
        <ul className="mt-3 space-y-2">
          {pkg.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-sm"><Sunrise className="h-4 w-4 text-ember shrink-0 mt-0.5" />{h}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-display text-base font-bold mb-2">Quick Facts</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {facts.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.l} className="rounded-xl bg-muted/60 border border-border p-3">
                <Icon className="h-4 w-4 text-ember" />
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{f.l}</div>
                <div className="text-xs font-semibold leading-tight">{f.v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl bg-ember/10 border border-ember/30 p-3 flex gap-2 text-xs">
        <AlertTriangle className="h-4 w-4 text-ember shrink-0 mt-0.5" />
        <span><strong>Heads up:</strong> Only <strong className="text-ember">{pkg.seatsLeft} seats</strong> remain for the next batch on <strong>{pkg.nextBatch}</strong>. Move to the next step to continue booking.</span>
      </div>
    </div>
  );
}

function StepItinerary({ pkg }: { pkg: TrekPackage }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">Day-by-day plan</div>
      <h3 className="font-display text-xl font-bold mt-1">Full Itinerary</h3>
      <ol className="mt-5 relative border-l-2 border-dashed border-forest/40 ml-3 space-y-5">
        {pkg.itinerary.map((d) => (
          <li key={d.d} className="pl-5 relative">
            <span className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-ember ring-4 ring-background grid place-items-center">
              <Mountain className="h-2.5 w-2.5 text-white" />
            </span>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ember">{d.d}</div>
            <h4 className="font-display font-bold text-base mt-0.5">{d.t}</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{d.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepInclusions({ pkg }: { pkg: TrekPackage }) {
  const block = (title: string, items: string[], accent: string, Icon: React.ElementType) => (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2">
        <span className={`h-7 w-7 rounded-lg grid place-items-center ${accent}`}><Icon className="h-3.5 w-3.5" /></span>
        <h4 className="font-display font-bold">{title}</h4>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-forest shrink-0" /><span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">What's covered</div>
      <h3 className="font-display text-xl font-bold -mt-1">Inclusions, Exclusions & Things To Carry</h3>
      {block("Inclusions", pkg.inclusions, "bg-forest text-cream", Check)}
      {block("Exclusions", pkg.exclusions, "bg-destructive text-cream", X)}
      {block("Things To Carry", pkg.thingsToCarry, "bg-ember text-white", Backpack)}
    </div>
  );
}

function StepPickup(props: {
  pkg: TrekPackage;
  seats: number; setSeats: (n: number) => void;
  pickup: string; setPickup: (s: string) => void;
  name: string; setName: (s: string) => void;
  phone: string; setPhone: (s: string) => void;
  email: string; setEmail: (s: string) => void;
  age: string; setAge: (s: string) => void;
  gender: string; setGender: (s: string) => void;
  emergency: string; setEmergency: (s: string) => void;
}) {
  const { pkg, seats, setSeats, pickup, setPickup, name, setName, phone, setPhone, email, setEmail, age, setAge, gender, setGender, emergency, setEmergency } = props;
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">Your details</div>
        <h3 className="font-display text-xl font-bold mt-1">Pickup & Trekker Info</h3>
        <p className="text-xs text-muted-foreground mt-1">All pickups depart Bangalore on {pkg.nextBatch}. Bus stops at every point en route.</p>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pickup point (from Bangalore)</label>
        <div className="mt-2 grid gap-2">
          {pkg.pickupPoints.map((pt) => (
            <label key={pt} className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${pickup === pt ? "border-forest bg-forest/5" : "border-border hover:border-forest/40"}`}>
              <input type="radio" name="pickup" checked={pickup === pt} onChange={() => setPickup(pt)} className="mt-1 accent-forest" />
              <div>
                <div className="text-sm font-semibold">{pt}</div>
                <div className="text-[11px] text-muted-foreground">Bus halts here for ~10 min. Reach 15 min early.</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <ModalField label="Full Name" value={name} onChange={setName} placeholder="As per ID proof" required />
        <ModalField label="Mobile (WhatsApp)" value={phone} onChange={setPhone} placeholder="+91 9XXXXXXXXX" type="tel" required />
        <ModalField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" required />
        <ModalField label="Age" value={age} onChange={setAge} placeholder="Years" type="number" required />
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender <span className="text-ember">*</span></label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40" required>
            <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Number of Seats <span className="text-ember">*</span></label>
          <input type="number" min={1} max={10} value={seats} onChange={(e) => setSeats(Math.max(1, Math.min(10, Number(e.target.value) || 1)))} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40" required />
        </div>
      </div>
      <ModalField label="Emergency Contact (Name + Phone)" value={emergency} onChange={setEmergency} placeholder="e.g. Rahul — +91 98XXXXXXXX" required />
    </div>
  );
}

function StepPayment({ pkg, total, seats, pickup, name, phone, submitted, onSubmit }: {
  pkg: TrekPackage; total: number; seats: number; pickup: string; name: string; phone: string;
  submitted: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto h-16 w-16 rounded-full bg-forest text-cream grid place-items-center">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-bold mt-4">Booking Received!</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          We've got your seat request for <strong>{pkg.name}</strong>. Our team will WhatsApp <strong>{phone || "you"}</strong> within 2 hours to confirm payment & share final details.
        </p>
      </div>
    );
  }
  return (
    <form id="modal-booking-form" onSubmit={onSubmit} className="space-y-5">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">Final step</div>
        <h3 className="font-display text-xl font-bold mt-1">Payment & Confirmation</h3>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Trek</span><span className="font-semibold text-right">{pkg.name}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-semibold">{pkg.nextBatch}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Pickup</span><span className="font-semibold text-right">{pickup || "—"}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Trekker</span><span className="font-semibold">{name || "—"}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Seats × Price</span><span className="font-semibold">{seats} × ₹{pkg.price.toLocaleString("en-IN")}</span></div>
        <div className="border-t border-border pt-2 flex justify-between text-base">
          <span className="font-display font-bold">Total Payable</span>
          <span className="font-display font-bold text-forest inline-flex items-center"><IndianRupee className="h-4 w-4" />{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* QR */}
      <div className="rounded-2xl border border-border p-5 bg-gradient-to-br from-cream to-background">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember">Scan & Pay via UPI</div>
          <h4 className="font-display text-lg font-bold mt-1">Pay ₹{total.toLocaleString("en-IN")} to confirm</h4>
        </div>
        <div className="mt-4 mx-auto w-44 h-44 rounded-2xl bg-white border-2 border-dashed border-forest/40 grid place-items-center p-3 relative">
          {/* QR placeholder pattern */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-forest-deep">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {Array.from({ length: 12 }).map((_, r) =>
              Array.from({ length: 12 }).map((_, c) => {
                const fill = (r * 7 + c * 13 + (r % 2) + (c % 3)) % 3 === 0;
                return fill ? <rect key={`${r}-${c}`} x={4 + c * 7.6} y={4 + r * 7.6} width="6.4" height="6.4" fill="currentColor" /> : null;
              })
            )}
            <rect x="2" y="2" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="9" y="9" width="8" height="8" fill="currentColor" />
            <rect x="76" y="2" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="83" y="9" width="8" height="8" fill="currentColor" />
            <rect x="2" y="76" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="9" y="83" width="8" height="8" fill="currentColor" />
          </svg>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-ember text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Placeholder QR</div>
        </div>
        <div className="mt-5 text-center text-sm">
          <div className="text-muted-foreground text-xs">UPI ID</div>
          <div className="font-mono font-bold text-forest">maharashtratrekking@upi</div>
          <div className="text-[11px] text-muted-foreground mt-2">Use GPay / PhonePe / Paytm / any UPI app</div>
        </div>
      </div>

      {/* Upload */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upload payment screenshot <span className="text-ember">*</span></label>
        <input type="file" accept="image/*" className="mt-1.5 w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-forest file:text-cream file:px-4 file:py-2 file:text-xs file:font-semibold" />
        <p className="text-[11px] text-muted-foreground mt-1.5 flex gap-1.5"><Shield className="h-3 w-3 mt-0.5 text-forest" />Your payment is secured & seat is confirmed only after our team verifies the transfer.</p>
      </div>

      <p className="text-[11px] text-muted-foreground text-center">By confirming you agree to our cancellation & refund policy.</p>
    </form>
  );
}

function ModalField({ label, value, onChange, ...rest }: {
  label: string; value: string; onChange: (s: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {rest.required && <span className="text-ember">*</span>}
      </label>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </div>
  );
}
