# LuxeOrders — Premium Jewelry Order Management Platform

A modern, premium web application for managing jewelry orders across sellers, designers, and manufacturers. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Three Role-Based Dashboards** — Seller, Designer, and Manufacturer
- **Order Management** — Create, track, and manage jewelry orders end-to-end
- **File Management** — Upload/download STL, 3DM, and image files with drag-and-drop
- **Notifications** — Real-time notification center for order updates
- **Analytics** — Charts, team performance, and order metrics
- **Premium UI** — Luxury-inspired design with gold accents, glassmorphism, and smooth animations
- **Dark Mode** — Optional dark theme support
- **Responsive** — Optimized for desktop, tablet, and mobile

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Page | Route |
|------|-------|
| Login | `/login` |
| Register | `/register` |
| Forgot Password | `/forgot-password` |
| Seller Dashboard | `/dashboard/seller` |
| Designer Dashboard | `/dashboard/designer` |
| Manufacturer Dashboard | `/dashboard/manufacturer` |
| Orders | `/orders` |
| Order Details | `/orders/[id]` |
| New Order | `/orders/new` |
| File Manager | `/files` |
| Notifications | `/notifications` |
| Profile | `/profile` |
| Settings | `/settings` |
| Analytics | `/analytics` |

## Design System

- **Colors**: White (#FFFFFF), Light Gray (#F8F9FA), Gold (#D4AF37), Dark Gray (#2C2C2C)
- **Typography**: Playfair Display (headings), Inter (body)
- **Border Radius**: 10–14px
- **Animations**: Framer Motion for page transitions and micro-interactions

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Recharts
- Lucide Icons
