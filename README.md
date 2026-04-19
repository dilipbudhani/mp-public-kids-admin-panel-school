# School Website Project

This project follows a multi-tenant architectural pattern to manage multiple school websites from a single admin panel.

## Architecture

The project consists of three independent Next.js applications:

1.  **admin-panel** (Port 3000): Centralized management system for all schools.
2.  **mp-public** (Port 3001): Main public school website.
3.  **mp-kids-school** (Port 3002): Dedicated website for the kids/junior school branch.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance

### Installation
Run `npm install` in each subfolder:
```bash
cd admin-panel && npm install
cd ../mp-public && npm install
cd ../mp-kids-school && npm install
```

### Environment Setup
Create a `.env` file in each app folder following the `.env.example` provided.

### Running the Apps
You can run each app independently:

- **Admin Panel**: `cd admin-panel && npm run dev`
- **MP Public**: `cd mp-public && npm run dev`
- **MP Kids School**: `cd mp-kids-school && npm run dev`

## Multi-Tenancy Design
The applications share a single MongoDB database. Data isolation is achieved by tagging each document with a `SCHOOL_ID` (e.g., `mp-public`, `mp-kids-school`).

- **Query Isolation**: Mongoose middleware automatically filters queries based on the `SCHOOL_ID` environment variable.
- **Transactional Data**: Leads, admissions, and student records are automatically tagged with the originating school's ID.
