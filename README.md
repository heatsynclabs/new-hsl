# HeatSync Labs Website

Mesa's Community Hackerspace website built with Astro and Bun.

## Technology Stack

- **Astro 4.x**: Static site generator with Vue islands for interactivity
- **Vue 3**: Component framework for interactive parts
- **Bun**: Runtime and package manager
- **TypeScript**: Type safety
- **date-fns**: Date manipulation

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── base/           # Foundation components
│   │   ├── calendar/       # Calendar components (Vue)
│   │   ├── events/          # Event components (Vue)
│   │   ├── graphics/       # Photo/graphics components (Vue)
│   │   ├── layout/          # Layout components
│   │   ├── sections/       # Page sections
│   │   └── schedule/       # Schedule components (Vue)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes (file-based routing)
│   │   └── api/           # Astro API endpoints (serverless functions)
│   ├── services/           # Service classes
│   └── styles/            # Global styles
├── public/                 # Static assets
└── dist/                  # Build output
```

## Development Setup

### Prerequisites

- Bun (latest version)

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_calendar_api_key
CALENDAR_ID=your_google_calendar_id
```

## Deployment

The site is configured for hybrid deployment:
- Static pages are pre-rendered at build time
- API routes (`/api/calendar` and `/api/flickr`) are deployed as serverless functions via Astro

### Netlify

The project works with Netlify out of the box. Set environment variables in the Netlify dashboard.

### Other Platforms

Astro supports deployment to:
- Vercel
- Cloudflare Pages
- AWS Amplify
- GitHub Pages (static only)

## Features

- **Static Generation**: Most pages are pre-rendered for fast loading
- **Vue Islands**: Interactive components (calendar, photos) use Vue islands
- **API Routes**: Calendar and Flickr APIs are serverless functions
- **Markdown Ready**: Content pages can be converted to Markdown

## Architecture Notes

- **Static Pages**: About, Membership, Classes, Support pages are static
- **Dynamic Components**: Calendar, Photo galleries, and schedule use Vue islands
- **API Routes**: `/api/calendar` and `/api/flickr` are Astro API routes deployed as serverless functions
- **Environment Variables**: Required for API routes (GOOGLE_API_KEY, CALENDAR_ID)

## Converting to Markdown

Content pages like About and Membership can be converted to Markdown by:
1. Creating `.md` files in `src/content/`
2. Using Astro's Content Collections
3. Rendering Markdown in page templates

See Astro documentation for content collections setup.
