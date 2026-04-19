# School Website — Uses & Architecture Guide

A comprehensive overview of the project structure, technology stack, and how every part is used.

---

## Project Structure

```
school-website/
├── admin-panel/        # Central admin dashboard (all schools)
├── mp-public/          # MP Public School — public-facing website
└── mp-kids-school/     # MP Kids School — public-facing website
```

All three applications share a single **MongoDB Atlas** database with row-level multi-tenant isolation via a `schoolId` field.

---

## Tech Stack

| Technology | Version | Used For |
| :--- | :--- | :--- |
| **Next.js** | 16.2.3 | Full-stack React framework (App Router, SSR, API Routes) |
| **React** | 19.2.4 | UI component rendering |
| **TypeScript** | 5.x | Type safety across all three apps |
| **Tailwind CSS** | 4.x | Utility-first styling engine |
| **Mongoose** | 8.9.5 | MongoDB ODM for data modeling and queries |
| **MongoDB Atlas** | Cloud | Production database with full-text search |
| **NextAuth.js** | 4.x | Admin authentication with JWT sessions |
| **Lucide React** | latest | Icon library used throughout the UI |
| **Sonner** | latest | Toast notifications in the admin panel |
| **Turbopack** | Built-in | Next.js 16 native bundler (replaces Webpack) |

---

## Applications

### `admin-panel` — Admin Dashboard
The unified control center for school management across multiple tenants.

| Sidebar Module | Use Case | API Route |
| :--- | :--- | :--- |
| **Dashboard** | Overview stats, quick actions, system health | RSC direct DB + `/api/stats` |
| **Leads** | Track and manage prospective student enquiries | `/api/leads` |
| **Admissions** | Process and approve formal student applications | `/api/admissions` |
| **Students** | Enrolled student records, academic tracking | `/api/students` |
| **Notifications** | Broadcast alerts / bulk messages to parents | `/api/notifications` |
| **Hero Slides** | Manage homepage banner carousel images | `/api/hero` |
| **News & Events** | Publish articles and school event announcements | `/api/news` |
| **Faculty** | Teacher/staff directory and bios | `/api/faculty` |
| **Alumni** | Graduate network tracking and achievements | `/api/alumni` |
| **Success Stories** | Highlight top performers, awards, and milestones | `/api/success-stories` |
| **Careers** | Post teaching jobs and manage applications | `/api/jobs` |
| **Gallery** | Upload and organize school photos and videos | `/api/gallery` |
| **Testimonials** | Curate parent/student feedback for the website | `/api/testimonials` |
| **Fees** | Define grade-wise fee structure shown publicly | `/api/fees` |
| **Pages** | CMS for static content blocks (About, Disclaimer) | `/api/static-pages` |
| **Settings** | Per-school branding, SEO, logo, theme config | `/api/settings` |

---

### `mp-public` — MP Public School Website
Public-facing Next.js website for MP Public School. Fetches scoped data using `SCHOOL_ID` env variable.

| Page | Data Source |
| :--- | :--- |
| Home / Hero | `/api/hero` |
| News & Notices | `/api/news`, `/api/circulars` |
| Faculty | `/api/faculty` |
| Gallery | `/api/gallery` |
| Admissions | `/api/admissions` (POST enquiry form) |
| CBSE Disclosure | `/api/disclosure` |
| Results | `/api/results` |
| Fee Structure | `/api/fees` |
| Testimonials | `/api/testimonials` |
| Success Stories | `/api/success-stories` |
| Alumni | `/api/alumni` |
| Careers | `/api/jobs` |
| Contact / Leads | `/api/leads` (POST form submission) |

---

### `mp-kids-school` — MP Kids School Website
Public-facing website for MP Kids School. Identical architecture to `mp-public` but served under a different domain and isolated by a separate `SCHOOL_ID`.

---

## Multi-Tenant Data Isolation

Every database document is tagged with a `schoolId` field matching the school's unique identifier. All API routes apply strict `schoolId` filtering on both reads and writes:

```ts
// Read: only fetch documents belonging to this school
const data = await Model.find({ schoolId: process.env.SCHOOL_ID });

// Write: tag every new document before saving
const doc = new Model({ ...body, schoolId: process.env.SCHOOL_ID });
```

This ensures a single MongoDB database safely powers multiple schools without data leakage.

---

## Environment Variables

Each app has its own `.env.local` file:

```bash
# Both public sites
SCHOOL_ID=<unique-school-identifier>
MONGODB_URI=<shared-atlas-connection-string>
NEXTAUTH_URL=http://localhost:<port>
NEXTAUTH_SECRET=<random-secret>

# Admin panel only
NEXTAUTH_URL=http://localhost:3000
```

---

## Port Assignments

| App | Dev Port |
| :--- | :--- |
| `admin-panel` | `3000` |
| `mp-public` | `3001` |
| `mp-kids-school` | `3002` |
