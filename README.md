# Neighborhood Listings App

A community marketplace application for neighborhood listings, built with Next.js and Supabase.

## Features

- User authentication (signup, login)
- Create, view, and delete listings
- Show interest in listings with thumbs up
- Comment on listings
- Filter listings by category, status, and search term
- Responsive design for mobile and desktop

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Supabase](https://supabase.io/) - Backend as a Service (BaaS)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com/)
2. After creating your project, go to Project Settings > API to get your project URL and anon key
3. Run the SQL script in `scripts/setup-supabase.sql` in the Supabase SQL Editor to set up the database schema and initial data

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/neighborhood-listings.git
   cd neighborhood-listings
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application can be deployed to Vercel or any other hosting platform that supports Next.js.

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy

## Project Structure

- `app/` - Next.js app directory
  - `components/` - Reusable UI components
  - `lib/` - Utility functions and data handling
    - `supabase.js` - Supabase client configuration
    - `supabaseData.js` - Data handling functions for Supabase
  - `api/` - API routes
  - `login/`, `signup/`, `create/`, `post/` - Page components
- `components/` - Shared UI components
- `scripts/` - Database setup scripts
- `public/` - Static assets

## Authentication

The application uses a simple username/password authentication system. In a production environment, you should use Supabase Auth with proper password hashing and security measures.

## License

This project is licensed under the MIT License.
