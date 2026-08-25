# Klipa Frontend

Frontend application for **Klipa**, a two-sided marketplace that connects **Content Creators** with **Clippers** to distribute short-form video content through a **Campaign** system.

The application is built with Next.js and serves as the primary interface for users to authenticate, manage their accounts, discover campaigns, and interact with the Klipa platform.

> 🚧 **Status: In Development**
>
> Klipa is currently under development. Features, workflows, and application behavior may change as development continues.

## Overview

Klipa connects two sides of the marketplace:

**Creators** can create and manage campaigns to distribute their content through Clippers.

**Clippers** can discover available campaigns and participate by creating short-form videos based on the campaign requirements.

The frontend communicates with the Klipa Backend through a REST API.

## Tech Stack

### Frontend

* **Next.js 16** — React framework
* **React 19** — UI library
* **TypeScript** — programming language
* **Tailwind CSS 4** — styling
* **shadcn** — UI components
* **Zustand** — client-side state management
* **Axios** — HTTP client
* **React Hook Form** — form management
* **Zod** — schema validation
* **Sonner** — toast notifications
* **Lucide React** — icon library
* **React Icons** — additional icon library

### Deployment

* **Vercel** — frontend deployment
* **Railway** — backend API
* **Supabase** — PostgreSQL database

## Architecture

```text
┌─────────────────────────────┐
│       Klipa Frontend        │
│          Next.js 16         │
├─────────────────────────────┤
│                             │
│ Pages & Layouts             │
│ UI Components               │
│ Authentication              │
│ Form Validation              │
│ Zustand State               │
│ Axios API Client            │
│                             │
└──────────────┬──────────────┘
               │
               │ HTTPS / REST API
               ▼
┌─────────────────────────────┐
│       Klipa Backend         │
│          NestJS 11          │
└──────────────┬──────────────┘
               │
               ▼
         PostgreSQL
           Supabase
```

## Core Features

### Authentication

The frontend provides user interfaces for:

* User registration
* User login
* Role selection
* Google OAuth
* Logout
* Authentication state management
* Protected application flows

Authentication state is managed using Zustand.

### User Roles

The application currently supports three roles:

```text
CREATOR
CLIPPER
ADMIN
```

Available features and interfaces may differ depending on the authenticated user's role.

### Campaign

Campaigns are the core concept of the Klipa marketplace.

Creators can create and manage campaigns, while Clippers can discover available campaigns and participate in them.

The frontend retrieves and submits campaign data through the Klipa Backend REST API.

### Form Management

Forms are handled using **React Hook Form**, while **Zod** is used for schema validation.

This combination provides structured form state management and consistent client-side validation.

### API Integration

The application uses **Axios** as its HTTP client for communicating with the backend.

The API client uses the configured backend URL and handles authentication information when making protected API requests.

## Project Structure

```text
klipa-frontend/
│
├── app/
│   ├── ...
│   └── ...
│
├── components/
│   ├── ui/
│   └── ...
│
├── lib/
│   ├── api/
│   ├── validations/
│   └── ...
│
├── store/
│
├── public/
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── ...
```

The project structure may evolve as the application grows.

## Getting Started

### Requirements

Make sure you have the following installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/gemiyudhia/klipa-frontend.git

cd klipa-frontend
```

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```text
.env.local
```

Add the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api
```

The frontend uses `NEXT_PUBLIC_API_URL` as the base URL for backend API requests.

> **Note:** Do not store private secrets in `NEXT_PUBLIC_*` environment variables because these variables are exposed to the browser.

## Running Locally

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

The frontend requires the Klipa Backend to be running and accessible through the configured `NEXT_PUBLIC_API_URL`.

## Production Build

Create a production build:

```bash
npm run build
```

Run the production application:

```bash
npm run start
```

Run the linter:

```bash
npm run lint
```

## Deployment

The frontend is deployed using **Vercel**.

The production architecture is structured as follows:

```text
User
 │
 ▼
Vercel
 │
 │ Next.js
 ▼
Klipa Frontend
 │
 │ HTTPS / REST API
 ▼
Render
 │
 │ NestJS
 ▼
Klipa Backend
 │
 │ Prisma
 ▼
Supabase PostgreSQL
```

The production frontend uses the following environment variable:

```env
NEXT_PUBLIC_API_URL=https://klipa-backend.onrender.com
```

## Backend

The frontend depends on the Klipa Backend for authentication, campaign management, user data, and other application functionality.

Backend repository:

https://github.com/gemiyudhia/klipa-backend

## Project Status

Klipa is an ongoing full-stack project focused on exploring how a two-sided marketplace can be built using modern web technologies.

The project currently focuses on authentication, role-based experiences, campaign workflows, API integration, client-side state management, and database-backed application architecture.

The application is still under development and is not intended to be considered production-ready.

## Author

**Gemi Yudhia**

GitHub:

https://github.com/gemiyudhia

---

Built as a full-stack project to explore modern frontend development, authentication flows, API integration, state management, and marketplace application architecture.
