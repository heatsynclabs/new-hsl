# HeatSync Labs Website

## Overview

Vue 3 single-page application built with TypeScript and Vite, deployed on GitHub Pages with Cloudflare Workers for serverless functions. Serves as the official website for HeatSync Labs, a community hackerspace in Mesa, Arizona.

## Technology Stack

### Frontend
- **Vue 3.5.22**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Vite 7.1.11**: Fast build tool and dev server
- **Vue Router 4.6.3**: SPA routing
- **Pinia 3.0.3**: State management

### Backend/Serverless
- **Cloudflare Workers**: Serverless API endpoints
- **Node.js 20.19.0**: Runtime environment

### UI/Styling
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Responsive Design**: Mobile-first approach
- **Custom CSS Variables**: Theme consistency

### Deployment
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: Automated CI/CD pipeline

## Project Structure

```
heatsync-labs/
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   ├── components/
│   │   ├── calendar/       # Calendar-related components
│   │   ├── graphics/       # Visual/media components
│   │   ├── layout/         # Layout components (header, footer)
│   │   ├── schedule/       # Schedule/hours components
│   │   └── sections/       # Page section components
│   ├── router/             # Vue Router configuration
│   ├── services/           # API service modules
│   ├── stores/             # Pinia state stores
│   ├── styles/             # Global styles
│   ├── utils/              # Helper functions
│   ├── views/              # Page components
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── cloudflare-workers/
│   └── *.js                # Serverless API functions
├── public/                 # Static assets
├── .github/
│   └── workflows/          # GitHub Actions workflows
├── dist/                   # Production build output
└── Configuration files
```

## Key Features

### 🏠 Home Page
- Hero section with animated background
- Dynamic photo collage from Flickr API
- Real-time upcoming events display
- Quick access navigation buttons
- Interactive schedule display with current status

### 📅 Calendar Integration
- Full-month calendar view with event details
- Upcoming events list with filtering
- Integration with Google Calendar API
- Support for recurring and all-day events
- Mobile-responsive design

### 📸 Photo Gallery
- Flickr API integration for latest photos
- Mobile carousel view
- Desktop collage layout
- Automatic image optimization

### 🕐 Schedule Display
- Dynamic open/closed status
- Current and upcoming hours
- Holiday schedule handling
- Real-time countdown to next opening

### 📱 Mobile Responsiveness
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes
- Optimized navigation for mobile devices
- Performance optimizations for mobile networks

## Component Documentation

### Core Components

#### `App.vue`
**Purpose:** Root component providing application structure and theme management

**Features:**
- CSS custom properties for theming
- Global layout structure
- Router view integration

**Usage:**
```vue
<template>
  <div id="app">
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>
```

#### `AppHeader.vue`
**Purpose:** Main navigation header with responsive menu

**Props:** None

**Features:**
- Sticky positioning
- Mobile hamburger menu
- Active route highlighting
- Smooth scroll navigation

**Events:**
- `navigate`: Emitted when navigation occurs
- `menu-toggle`: Mobile menu state change

#### `AppFooter.vue`
**Purpose:** Footer with contact info and quick links

**Props:** None

**Features:**
- Social media links
- Address with map link
- Newsletter signup
- Copyright information

### Calendar Components

#### `FullCalendar.vue`
**Purpose:** Full month calendar display with event visualization

**Props:**
```typescript
interface Props {
  month?: Date           // Month to display (default: current)
  events?: CalendarEvent[] // Events to display
  showNavigation?: boolean // Show month navigation (default: true)
}
```

**Features:**
- Month grid layout
- Event highlighting
- Previous/next navigation
- Mobile swipe gestures
- Event detail popover

**Events:**
- `month-change`: New month selected
- `event-click`: Event clicked for details

#### `UpcomingEvents.vue`
**Purpose:** List of upcoming events with filtering options

**Props:**
```typescript
interface Props {
  limit?: number         // Max events to show (default: 10)
  daysAhead?: number     // Days to look ahead (default: 30)
  showFilters?: boolean  // Show filter controls (default: true)
}
```

**Features:**
- Chronological event listing
- Date grouping
- Event type filtering
- Load more pagination
- Empty state handling

### Graphics Components

#### `PhotoCollage.vue`
**Purpose:** Desktop photo grid display

**Props:**
```typescript
interface Props {
  photos?: FlickrPhoto[] // Photos to display
  columns?: number       // Grid columns (default: 3)
  gap?: number          // Grid gap in pixels (default: 16)
}
```

**Features:**
- Masonry-style layout
- Lazy loading
- Click to enlarge
- Automatic resizing

#### `MobilePhotoCarousel.vue`
**Purpose:** Touch-friendly photo carousel for mobile

**Props:**
```typescript
interface Props {
  photos?: FlickrPhoto[]  // Photos to display
  autoPlay?: boolean      // Auto-advance slides (default: true)
  interval?: number       // Auto-play interval ms (default: 5000)
}
```

**Features:**
- Touch/swipe navigation
- Dot indicators
- Auto-play with pause on interaction
- Image preloading

### Schedule Components

#### `OpenHours.vue`
**Purpose:** Display current open status and hours

**Props:** None

**Features:**
- Real-time status updates
- Today's hours display
- Next opening countdown
- Holiday schedule alerts
- Visual status indicators

**Computed Properties:**
- `isOpen`: Current open status
- `nextOpening`: Next opening time
- `todaySchedule`: Today's hours

### Section Components

#### `HeroSection.vue`
**Purpose:** Landing page hero with call-to-action

**Props:**
```typescript
interface Props {
  title?: string          // Hero title
  subtitle?: string       // Hero subtitle
  backgroundImage?: string // Background image URL
  showButtons?: boolean   // Show CTA buttons (default: true)
}
```

**Features:**
- Animated gradient background
- Parallax scrolling effect
- Responsive typography
- Multiple CTA buttons

## Service Documentation

### Calendar Service
**File:** `src/services/calendarService.ts`

**Purpose:** Interface with Google Calendar API

**Methods:**
```typescript
getEvents(daysAhead?: number): Promise<CalendarEvent[]>
getEventsForMonth(month: Date): Promise<CalendarEvent[]>
getAllFutureEvents(): Promise<CalendarEvent[]>
getRecurringEvents(daysAhead?: number): Promise<CalendarEvent[]>
```

**API Integration:**
- Uses Cloudflare Worker endpoint
- Processes Google Calendar API responses
- Handles error states gracefully
- Implements caching for performance

**Event Format:**
```typescript
interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  isAllDay: boolean
}
```

### Flickr Service
**File:** `src/services/flickrService.ts`

**Purpose:** Fetch and process photos from Flickr

**Methods:**
```typescript
getPhotos(limit?: number): Promise<FlickrPhoto[]>
```

**API Integration:**
- Uses Cloudflare Worker endpoint
- Parses XML response using DOMParser
- Generates appropriate image URLs
- Handles API errors

**Photo Format:**
```typescript
interface FlickrPhoto {
  id: string
  title: string
  url: string        // Full-size image
  thumbnail: string  // Thumbnail image
  link: string      // Flickr page URL
  farm: string
  server: string
  secret: string
}
```

## State Management

### Navigation Store
**File:** `src/stores/navigation.ts`

**Purpose:** Global navigation state

**State:**
```typescript
interface NavigationState {
  mobileMenuOpen: boolean
  activeSection: string
  scrollPosition: number
}
```

**Actions:**
- `toggleMobileMenu()`: Toggle mobile menu
- `setActiveSection(section: string)`: Update active section
- `updateScrollPosition()`: Track scroll position

### Calendar Store
**File:** `src/stores/calendar.ts`

**Purpose:** Calendar data management

**State:**
```typescript
interface CalendarState {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
  selectedMonth: Date
}
```

**Actions:**
- `fetchEvents()`: Load events from API
- `setMonth(month: Date)`: Change selected month
- `refreshEvents()`: Force refresh events

## Routing

Routes defined in `src/router/index.ts`:

```typescript
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/membership', name: 'membership', component: MembershipView },
  { path: '/calendar', name: 'calendar', component: CalendarView },
  { path: '/visit', name: 'visit', component: VisitView },
  { path: '/community', name: 'community', component: CommunityView }
]
```

## Cloudflare Workers

Located in `cloudflare-workers/`

### Calendar Worker (`calendar-worker.js`)

**Purpose:** Proxy Google Calendar API requests

**Endpoint:** Deployed to Cloudflare Workers

**Parameters:**
- `timeMin`: ISO date string for range start
- `timeMax`: ISO date string for range end
- `maxResults`: Maximum events to return (default: 50)

**Environment Variables Required:**
- `GOOGLE_API_KEY`: Google Calendar API key
- `CALENDAR_ID`: Google Calendar ID

**Response Format:**
```json
{
  "items": [...],  // Google Calendar events
  "timeZone": "America/Phoenix"
}
```

### Flickr Worker (`flickr-worker.js`)

**Purpose:** Proxy Flickr API requests

**Endpoint:** Deployed to Cloudflare Workers

**Parameters:**
- `limit`: Maximum photos to return (default: 20)

**Response Format:**
```json
{
  "contents": "XML string with photo data"
}
```

## Development

### Prerequisites

- Node.js 20.19.0 or higher
- npm or pnpm package manager
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/heatsync-website.git
cd heatsync-website

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Add your Cloudflare Worker URLs to .env
# VITE_CALENDAR_API_URL=https://your-calendar-worker.workers.dev
# VITE_FLICKR_API_URL=https://your-flickr-worker.workers.dev

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Production build
npm run build

# Preview production build
npm run preview
```

### Build Process

1. TypeScript compilation and type checking
2. Vue SFC compilation
3. Vite bundling and optimization
4. Asset optimization
5. Output to `dist/` directory

### GitHub Pages Deployment

#### Automatic Deployment
1. Push code to main branch
2. GitHub Actions workflow triggers
3. Builds and deploys to GitHub Pages

#### Manual Deployment
```bash
# Build for production
npm run build

# Deploy is handled by GitHub Actions
git add .
git commit -m "Update site"
git push origin main
```

## Testing

### Unit Testing
```bash
# Run unit tests (if configured)
npm run test:unit

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist
- [ ] Navigation links work correctly
- [ ] Calendar events load and display
- [ ] Photos load from Flickr
- [ ] Mobile responsive design
- [ ] Form submissions work
- [ ] Error states handled gracefully

## Performance Optimization

### Current Optimizations
- Lazy loading for images
- Component code splitting
- CSS purging for unused styles
- Minification of JS/CSS
- Compression of assets

### Monitoring
- Lighthouse scores
- Core Web Vitals
- Bundle size analysis

## Security Considerations

### API Key Protection
- API keys stored as environment variables in Cloudflare
- No client-side API key exposure
- Cloudflare Workers act as secure proxy

### CORS Configuration
- Cloudflare Workers include appropriate CORS headers
- Frontend restricted to configured API endpoints

### Content Security
- Input sanitization
- XSS protection
- HTTPS enforcement via GitHub Pages

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

## Troubleshooting

### Common Issues

#### Build Errors
- **TypeScript Errors**: Run `npm run type-check` to identify
- **Missing Dependencies**: Delete `node_modules` and reinstall
- **Build Failures**: Check Node version matches requirements

#### Development Server
- **Port Conflicts**: Vite uses port 5173
- **API Testing**: Ensure environment variables are set

#### Production Issues
- **404 Errors**: Check GitHub Pages configuration
- **API Failures**: Verify Cloudflare Worker URLs
- **Broken Assets**: Check base URL in vite.config.ts

### Debug Commands
```bash
# Check environment variables
npm run build -- --mode development

# Verbose logging
DEBUG=* npm run dev

# Type checking with details
npm run type-check -- --listFiles
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and optimize bundle size
- Monitor API rate limits
- Review Cloudflare Worker performance
- Update content as needed

### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest major versions (carefully)
npm install package@latest
```

### Performance Monitoring
- GitHub Pages deployment logs
- Browser DevTools for frontend performance
- Cloudflare dashboard for Worker monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

[License information here]

## Contact

HeatSync Labs
- Website: https://heatsynclabs.org
- Email: info@heatsynclabs.org
- Location: 108 W Main St, Mesa, AZ 85210