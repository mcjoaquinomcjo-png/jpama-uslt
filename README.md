# JPAMA USLT Website — Sihaya Era

Official web portal of the **Junior Philippine Association of Management Accountants (JPAMA)** – University of Saint Louis Tuguegarao (USLT) Chapter.

Built in alignment with the **JPAMA Architecture & Design Spec**.

---

## 🏛️ Brand & Design System

- **Primary Color (Navy)**: Obsidian Navy (`#0B0E17`, `#07090F`)
- **Primary Color (Gold)**: Radiant Gold (`#E6C280` to `#A87C33`), Metallic Gold (`#D4AF37`)
- **Secondary Accent**: Emerald Green (`#1B4D3E`, `#10B981`) representing USLT institutional alignment
- **Display Typography**: Cinzel / Playfair Display
- **Body Typography**: Plus Jakarta Sans / Inter

---

## 🗺️ Information Architecture & Sitemap

| Module / Page | Route | Features & Components |
|---|---|---|
| **Home** | `/` | Hero section ("Sihaya" Identity), quick registration & calendar CTAs, live news ticker, about highlights, metrics strip, instant status lookup widget |
| **About Us** | `/about` | Chapter history (2014 founding to 2026 Sihaya era), Executive Board directory with filterable committees, Faculty Adviser & USLT affiliation, interactive Constitution & By-Laws reader + PDF download |
| **Events Calendar** | `/events` | Filterable upcoming assemblies grid (Academic, Leadership, Webinar, Competition), search bar, and past events photo gallery |
| **Event Details & RSVP** | `/events/[slug]` | Comprehensive event agenda, keynote speaker profile, live seat availability counter, and interactive RSVP registration form |
| **Membership Portal** | `/membership` | Eligibility & benefits breakdown, online registration form (student ID, year level, degree program, GCash/Cashier payment verification), and live status lookup tool |
| **Resources Library** | `/resources` | Filterable study kits, Strategic Cost Management (SCM) & MAS reviewers, downloadable financial statement Excel templates, webinar recordings, and download tracker |
| **Contact Us** | `/contact` | Bulwagang San Jacinto headquarters details, office consultation hours, hotline, social media links, and interactive Secretariat inquiry form |

---

## 💾 Database Schema (Supabase PostgreSQL)

Defined in [`src/lib/schema.sql`](./src/lib/schema.sql):

- **`members`**: `id`, `student_number` (unique), `full_name`, `email` (unique), `year_level`, `program`, `status` (`Pending`, `Active`, `Graduated`), `payment_ref`, `created_at`
- **`events`**: `id`, `slug` (unique), `title`, `description`, `full_details`, `event_date`, `location`, `max_capacity`, `is_published`, `speaker`, `speaker_role`, `created_at`
- **`rsvps`**: `id`, `event_id` (FK `events.id`), `member_id` (FK `members.id`), `attendance_status` (`Registered`, `Attended`, `Cancelled`), `registered_at`

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
