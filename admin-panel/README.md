# MP Public School & MP Kids School - Admin Panel

A comprehensive administrative dashboard built with Next.js for managing school operations, lead generation, and student management for MP Public School and MP Kids School.

## 🚀 Overview

This admin panel serves as the central hub for managing:
- **School Presence**: Manage branching and site settings for multiple school domains.
- **Lead Management**: Track and follow up with potential admissions.
- **Content Management**: Update news, events, programs, and testimonials.
- **Student Data**: Manage student records and success stories.
- **Notifications**: Send and log various communications via Twilio and other channels.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: Framer Motion, Lucide React, Sonner
- **Media Management**: Cloudinary
- **Communication**: Twilio SDK
- **Validation**: Zod & React Hook Form

## 📂 Structure

- `src/models`: Mongoose database schemas.
- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `scripts`: Utility scripts for data management and migrations.

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance
- Cloudinary account
- Twilio account (optional for notifications)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github-amit:NovaEdge-Digital-Labs/mp-public-kids-admin-panel.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 License

This project is private and proprietary.
