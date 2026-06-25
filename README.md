# 🏔️ Maharashtra Trekking Company (MTC)

A modern, full-stack web application designed for booking expert-led monsoon, fort, and weekend treks in the Sahyadris. Built with a premium design and seamless booking workflow.

---

## 🚀 Features

### **Client Face**
- **Interactive Landing Page**: Beautifully designed hero section, upcoming trek packages, highlights, detailed day-by-day itineraries, inclusions/exclusions, rules/guidelines, and an interactive photo gallery.
- **Seat Booking Form**: Seamless experience for selecting seats, calculating total price dynamically, selecting pickup points (with time/location), submitting traveler details (Age, Gender, Emergency Contact), and uploading UPI payment screenshots.
- **Dynamic Seats Counter**: Tracks available spots in real-time, encouraging bookings.

### **Admin & Security**
- **Admin Dashboard (`/admin`)**: Secure interface for booking management. Admins can view passenger rosters, check uploaded payment receipt images, filter bookings by trek name or status, and approve/reject bookings in real-time.
- **Row Level Security (RLS)**: Fine-grained PostgreSQL access control policies where any visitor can submit (insert) bookings, but only authenticated administrators can select, update, or delete them.

### **Server Functions & Email Notifications**
- **TanStack Start Server Functions**: Server-side logic (`sendBookingNotifications`) executes on the Nitro engine to secure sensitive API keys (e.g., Resend).
- **Email Notifications (Resend API)**:
  - **Admin Alert**: Immediate notification with full booking details and an inline payment screenshot.
  - **Customer Receipt**: HTML email confirming booking request receipt with booking summaries and next steps.

---

## 🛠️ Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React 19, React Router, Nitro Server Engine, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin), [Shadcn UI](https://ui.shadcn.com/) components, and [Lucide React](https://lucide.dev/) icons.
- **Database / Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage Buckets).
- **Email Services**: [Resend](https://resend.com/) API.
- **Validation**: [Zod](https://zod.dev/) (schemas for inputs and server payloads).

---

## 📂 Project Structure

```text
├── supabase/                   # Supabase Database configurations
│   └── bookings_schema.sql     # Database tables, RLS policies, and Storage buckets configuration
├── src/
│   ├── assets/                 # High-resolution image assets
│   ├── components/             # Reusable UI components (Modals, Buttons, Forms, etc.)
│   ├── integrations/
│   │   └── supabase/           # Supabase client instantiation
│   ├── lib/
│   │   └── api/
│   │       └── booking.functions.ts # TanStack Start server functions (Resend integration)
│   ├── routes/                 # TanStack Router folder
│   │   ├── __root.tsx          # Root Layout & Tailwind styles import
│   │   ├── index.tsx           # Home Page (Landing page and booking modal)
│   │   └── admin.tsx           # Admin Panel
│   ├── main.tsx                # Client entrypoint
│   ├── router.tsx              # Router setup
│   └── styles.css              # Main tailwind imports & CSS themes
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript config
```

---

## ⚙️ Setup & Configuration

### **1. Prerequisites**
Ensure you have **Node.js** (v18+) and **npm** (or **Bun**) installed.

### **2. Setup Supabase Database**
1. Create a new project in [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [supabase/bookings_schema.sql](file:///d:/maharashtra-trek-adventures-main/supabase/bookings_schema.sql). This will:
   - Create the `bookings` table.
   - Setup Row Level Security (RLS) policies for anonymous insert and authenticated admin access.
   - Create the `booking_screenshots` storage bucket for payment screenshots.

### **3. Environment Variables**
Create a `.env` file in the root of the project using the template below:

```env
# Supabase Configuration
SUPABASE_PROJECT_ID="your_project_id"
SUPABASE_PUBLISHABLE_KEY="your_anon_key"
SUPABASE_URL="https://your_project_id.supabase.co"

VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"

# Resend API Key for Email Notifications
RESEND_API_KEY="re_your_resend_api_key"

# Admin Email address to receive notifications
ADMIN_EMAIL="admin@yourdomain.com"
```

---

## 💻 Running the App Locally

### **1. Install Dependencies**
```bash
npm install
# or if you use bun:
bun install
```

### **2. Start the Development Server**
```bash
npm run dev
# or if you use bun:
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### **3. Production Build**
```bash
npm run build
npm run preview
```

---

## 🔒 License
Private / Proprietary. Owned by Maharashtra Trekking Company.
