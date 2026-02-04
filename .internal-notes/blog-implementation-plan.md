# Blog/News Section Implementation Plan

## Goal

Add a blog/news section to the HeatSync Labs website that:
- Requires no database or external content hosting
- Works with the existing GitHub Pages deployment
- Allows authorized people to write/edit posts via a web UI without making PRs
- Shows latest posts on the homepage

---

## Solution Overview: Decap CMS + Astro Content Collections

### How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CONTENT FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Editor writes post          CMS commits markdown      GitHub      │
│   in web UI (/admin)    →     file to repo via      →   Actions    │
│                               GitHub API                 rebuilds   │
│                                                          & deploys  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Blog posts are just markdown files** stored in `src/content/blog/`. The CMS is a web interface that helps non-technical users write markdown and commit it to the repo without using git.

### Architecture Components

| Component | Description | Location |
|-----------|-------------|----------|
| **Blog Content** | Markdown files with frontmatter | `src/content/blog/*.md` (in repo) |
| **Blog Pages** | Astro pages that render posts | `src/pages/blog/` (in repo) |
| **Homepage Widget** | Latest posts section | `src/components/sections/` (in repo) |
| **CMS Admin UI** | Web editor interface | Loaded from CDN, config in `public/admin/` |
| **OAuth Proxy** | Handles GitHub login flow | Small serverless function on Vercel |
| **GitHub OAuth App** | Authorizes CMS to commit | Configured in GitHub org settings |

### What You Don't Need

- No database
- No CMS subscription or hosted service
- No changes to GitHub Actions workflow
- No changes to GitHub Pages configuration

---

## Part 1: Blog Content Structure

### 1.1 Content Collection Schema

**File:** `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('HeatSync Labs'),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  pages,
  blog,
};
```

### 1.2 Blog Post File Format

**Location:** `src/content/blog/`
**Naming Convention:** `YYYY-MM-DD-slug-title.md`

Example: `src/content/blog/2024-01-15-new-laser-cutter.md`

```markdown
---
title: "New Laser Cutter Arrives at HeatSync Labs"
description: "We're excited to announce our latest equipment addition - a 100W CO2 laser cutter available to all members."
pubDate: 2024-01-15
author: "HeatSync Labs"
featuredImage: "/blog/laser-cutter.jpg"
featuredImageAlt: "New laser cutter in the workshop"
tags: ["equipment", "announcements", "laser cutting"]
draft: false
---

We're thrilled to announce that our new 100W CO2 laser cutter has arrived!

## What Can You Make?

- Custom signage and artwork
- Precision-cut enclosures
- Engraved gifts and merchandise

## Training Sessions

We'll be holding training sessions every Saturday this month...
```

### 1.3 Directory Structure

```
src/content/
├── config.ts              # Collection schemas (modify existing)
├── pages/                 # Existing static pages
│   ├── about.md
│   ├── membership.md
│   └── support.md
└── blog/                  # NEW: Blog posts
    ├── 2024-01-15-new-laser-cutter.md
    ├── 2024-02-01-maker-faire-recap.md
    └── ...

public/
└── blog/                  # NEW: Blog images
    ├── laser-cutter.jpg
    └── ...
```

---

## Part 2: Blog Pages

### 2.1 Blog Index Page

**File:** `src/pages/blog/index.astro`

Lists all published blog posts, sorted newest first.

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import BaseContainer from '../../components/base/BaseContainer.astro';
import { getCollection } from 'astro:content';
import { format } from 'date-fns';

const posts = (await getCollection('blog', ({ data }) => {
  return data.draft !== true;
})).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Layout title="News & Updates - HeatSync Labs">
  <BaseContainer>
    <section class="blog-index">
      <header class="blog-header">
        <h1 class="blog-title">News & Updates</h1>
        <p class="blog-subtitle">Stories from Arizona's hackerspace community</p>
      </header>

      <div class="posts-grid">
        {posts.map((post) => (
          <article class="post-card">
            {post.data.featuredImage && (
              <img
                src={post.data.featuredImage}
                alt={post.data.featuredImageAlt || ''}
                class="post-image"
              />
            )}
            <div class="post-content">
              <time class="post-date" datetime={post.data.pubDate.toISOString()}>
                {format(post.data.pubDate, 'MMMM d, yyyy')}
              </time>
              <h2 class="post-title">
                <a href={`/blog/${post.slug}`}>{post.data.title}</a>
              </h2>
              <p class="post-excerpt">{post.data.description}</p>
              {post.data.tags.length > 0 && (
                <div class="post-tags">
                  {post.data.tags.map(tag => (
                    <span class="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <p class="no-posts">No posts yet. Check back soon!</p>
      )}
    </section>
  </BaseContainer>
</Layout>

<style>
  .blog-index {
    padding: var(--space-8) 0;
  }

  .blog-header {
    text-align: center;
    margin-bottom: var(--space-10);
  }

  .blog-title {
    font-family: var(--font-sans);
    font-size: var(--text-4xl);
    font-weight: var(--font-light);
    color: var(--color-text-primary);
    margin-bottom: var(--space-2);
  }

  .blog-subtitle {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    color: var(--color-text-tertiary);
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-6);
  }

  .post-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    overflow: hidden;
    transition: box-shadow var(--transition-base), transform var(--transition-base);
  }

  .post-card:hover {
    box-shadow: 0 4px 12px var(--color-shadow);
    transform: translateY(-2px);
  }

  .post-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .post-content {
    padding: var(--space-6);
  }

  .post-date {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .post-title {
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-weight: var(--font-medium);
    margin: var(--space-2) 0 var(--space-3);
    line-height: var(--leading-tight);
  }

  .post-title a {
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .post-title a:hover {
    color: var(--color-accent-primary);
  }

  .post-excerpt {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-4);
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    background: var(--color-bg-tertiary);
    color: var(--color-accent-secondary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  .no-posts {
    text-align: center;
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .blog-title {
      font-size: var(--text-3xl);
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### 2.2 Individual Blog Post Page

**File:** `src/pages/blog/[...slug].astro`

Dynamic route that renders each blog post.

```astro
---
export const prerender = true;
import Layout from '../../layouts/Layout.astro';
import BaseContainer from '../../components/base/BaseContainer.astro';
import { getCollection } from 'astro:content';
import { format } from 'date-fns';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={`${post.data.title} - HeatSync Labs`}>
  <BaseContainer size="md">
    <article class="blog-post">
      <header class="post-header">
        <a href="/blog" class="back-link">← Back to News</a>
        <div class="post-meta">
          <time datetime={post.data.pubDate.toISOString()}>
            {format(post.data.pubDate, 'MMMM d, yyyy')}
          </time>
          {post.data.author && (
            <>
              <span class="meta-divider">·</span>
              <span class="post-author">{post.data.author}</span>
            </>
          )}
        </div>
        <h1 class="post-title">{post.data.title}</h1>
        {post.data.description && (
          <p class="post-description">{post.data.description}</p>
        )}
        {post.data.featuredImage && (
          <img
            src={post.data.featuredImage}
            alt={post.data.featuredImageAlt || ''}
            class="post-featured-image"
          />
        )}
      </header>

      <div class="post-content prose">
        <Content />
      </div>

      <footer class="post-footer">
        {post.data.tags.length > 0 && (
          <div class="post-tags">
            <span class="tags-label">Tagged:</span>
            {post.data.tags.map(tag => (
              <span class="tag">{tag}</span>
            ))}
          </div>
        )}
        {post.data.updatedDate && (
          <p class="updated-date">
            Last updated: {format(post.data.updatedDate, 'MMMM d, yyyy')}
          </p>
        )}
      </footer>
    </article>
  </BaseContainer>
</Layout>

<style>
  .blog-post {
    padding: var(--space-8) 0;
  }

  .back-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    text-decoration: none;
    display: inline-block;
    margin-bottom: var(--space-6);
    transition: color var(--transition-base);
  }

  .back-link:hover {
    color: var(--color-accent-primary);
  }

  .post-header {
    margin-bottom: var(--space-8);
  }

  .post-meta {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    margin-bottom: var(--space-3);
  }

  .meta-divider {
    margin: 0 var(--space-2);
  }

  .post-title {
    font-family: var(--font-sans);
    font-size: var(--text-4xl);
    font-weight: var(--font-light);
    color: var(--color-text-primary);
    line-height: var(--leading-tight);
    margin-bottom: var(--space-4);
  }

  .post-description {
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-6);
  }

  .post-featured-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: var(--radius-base);
  }

  .post-content {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
  }

  .post-content :global(h2) {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
    margin-top: var(--space-8);
    margin-bottom: var(--space-4);
  }

  .post-content :global(h3) {
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
  }

  .post-content :global(p) {
    margin-bottom: var(--space-4);
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    margin-bottom: var(--space-4);
    padding-left: var(--space-6);
  }

  .post-content :global(li) {
    margin-bottom: var(--space-2);
  }

  .post-content :global(a) {
    color: var(--color-accent-primary);
    text-decoration: underline;
  }

  .post-content :global(a:hover) {
    color: var(--color-accent-secondary);
  }

  .post-content :global(img) {
    max-width: 100%;
    border-radius: var(--radius-base);
    margin: var(--space-6) 0;
  }

  .post-content :global(blockquote) {
    border-left: 3px solid var(--color-accent-primary);
    padding-left: var(--space-4);
    margin: var(--space-6) 0;
    font-style: italic;
    color: var(--color-text-tertiary);
  }

  .post-content :global(code) {
    font-family: var(--font-mono);
    background: var(--color-bg-tertiary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
  }

  .post-content :global(pre) {
    background: var(--color-bg-tertiary);
    padding: var(--space-4);
    border-radius: var(--radius-base);
    overflow-x: auto;
    margin: var(--space-6) 0;
  }

  .post-content :global(pre code) {
    background: none;
    padding: 0;
  }

  .post-footer {
    margin-top: var(--space-10);
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-border);
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  .tags-label {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .tag {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    background: var(--color-bg-tertiary);
    color: var(--color-accent-secondary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  .updated-date {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
    margin-top: var(--space-4);
  }

  @media (max-width: 768px) {
    .post-title {
      font-size: var(--text-3xl);
    }

    .post-description {
      font-size: var(--text-lg);
    }
  }
</style>
```

---

## Part 3: Homepage Integration

### 3.1 Latest Posts Section Component

**File:** `src/components/sections/LatestPostsSection.astro`

```astro
---
import BaseContainer from '../base/BaseContainer.astro';
import BaseButton from '../base/BaseButton.astro';
import { getCollection } from 'astro:content';
import { format } from 'date-fns';

interface Props {
  count?: number;
}

const { count = 3 } = Astro.props;

const posts = (await getCollection('blog', ({ data }) => {
  return data.draft !== true;
}))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, count);
---

<section class="latest-posts">
  <BaseContainer>
    <header class="section-header">
      <h2 class="section-title">Latest News</h2>
      <p class="section-subtitle">Updates from the lab</p>
    </header>

    {posts.length > 0 ? (
      <div class="posts-grid">
        {posts.map((post) => (
          <article class="post-preview">
            <time class="post-date" datetime={post.data.pubDate.toISOString()}>
              {format(post.data.pubDate, 'MMM d, yyyy')}
            </time>
            <h3 class="post-title">
              <a href={`/blog/${post.slug}`}>{post.data.title}</a>
            </h3>
            <p class="post-excerpt">{post.data.description}</p>
          </article>
        ))}
      </div>
    ) : (
      <p class="no-posts">No posts yet. Check back soon!</p>
    )}

    <div class="section-cta">
      <BaseButton variant="secondary" href="/blog">
        View All News →
      </BaseButton>
    </div>
  </BaseContainer>
</section>

<style>
  .latest-posts {
    padding: var(--space-12) 0;
    background: var(--color-bg-secondary);
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .section-title {
    font-family: var(--font-sans);
    font-size: var(--text-3xl);
    font-weight: var(--font-light);
    color: var(--color-text-primary);
    margin-bottom: var(--space-2);
  }

  .section-subtitle {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--color-text-tertiary);
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .post-preview {
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: var(--space-6);
    transition: box-shadow var(--transition-base), transform var(--transition-base);
  }

  .post-preview:hover {
    box-shadow: 0 4px 12px var(--color-shadow);
    transform: translateY(-2px);
  }

  .post-date {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .post-title {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    font-weight: var(--font-medium);
    margin: var(--space-2) 0 var(--space-3);
    line-height: var(--leading-tight);
  }

  .post-title a {
    color: var(--color-text-primary);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .post-title a:hover {
    color: var(--color-accent-primary);
  }

  .post-excerpt {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .no-posts {
    text-align: center;
    color: var(--color-text-tertiary);
    font-style: italic;
    margin-bottom: var(--space-8);
  }

  .section-cta {
    text-align: center;
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: var(--text-2xl);
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### 3.2 Homepage Update

**File:** `src/pages/index.astro`

Add the LatestPostsSection import and component:

```astro
---
export const prerender = true;
import Layout from '../layouts/Layout.astro';
import HeroSection from '../components/sections/HeroSection.astro';
import InfoSection from '../components/sections/InfoSection.astro';
import ScheduleSection from '../components/sections/ScheduleSection.astro';
import CalendarSection from '../components/sections/CalendarSection.astro';
import SupportSection from '../components/sections/SupportSection.astro';
import LatestPostsSection from '../components/sections/LatestPostsSection.astro';
---

<Layout title="HeatSync Labs - Arizona's Community Hackerspace">
  <div class="home">
    <HeroSection />
    <CalendarSection />
    <LatestPostsSection count={3} />
    <InfoSection />
    <ScheduleSection />
    <SupportSection />
  </div>
</Layout>

<style>
  .home {
    flex: 1;
  }
</style>
```

---

## Part 4: Navigation Update

### 4.1 Header Navigation

**File:** `src/components/layout/AppHeader.astro`

Add "News" link to desktop nav (around line 20, after "Projects"):

```html
<li><a href="/projects" class="nav__link">Projects</a></li>
<li><a href="/blog" class="nav__link">News</a></li>  <!-- ADD THIS -->
<li><a href="https://wiki.heatsynclabs.org" class="nav__link" target="_blank" rel="noopener">Wiki</a></li>
```

Add "News" link to mobile nav (around line 74, after "Projects"):

```html
<li><a href="/projects" class="nav__mobile-link">Projects</a></li>
<li><a href="/blog" class="nav__mobile-link">News</a></li>  <!-- ADD THIS -->
<li><a href="https://wiki.heatsynclabs.org" class="nav__mobile-link" target="_blank" rel="noopener">Wiki</a></li>
```

---

## Part 5: Decap CMS Setup

### 5.1 CMS Admin Page

**File:** `public/admin/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Content Manager | HeatSync Labs</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

### 5.2 CMS Configuration

**File:** `public/admin/config.yml`

```yaml
# =============================================================================
# DECAP CMS CONFIGURATION FOR HEATSYNC LABS
# =============================================================================

# -----------------------------------------------------------------------------
# Backend Configuration
# -----------------------------------------------------------------------------
backend:
  name: github
  repo: heatsynclabs/new-hsl          # GitHub org/repo
  branch: gh-pages                     # Branch to commit to
  base_url: https://hsl-oauth.vercel.app  # OAuth proxy URL (see Part 6)
  auth_endpoint: /api/auth             # OAuth endpoint on proxy

# -----------------------------------------------------------------------------
# Editorial Workflow
# -----------------------------------------------------------------------------
# Enables draft → in review → ready workflow
# Creates PRs for content changes (optional, can be disabled)
publish_mode: editorial_workflow

# -----------------------------------------------------------------------------
# Media/Image Uploads
# -----------------------------------------------------------------------------
media_folder: public/blog              # Where images are stored in repo
public_folder: /blog                   # Public URL path for images

# -----------------------------------------------------------------------------
# Site Settings
# -----------------------------------------------------------------------------
site_url: https://www.heatsynclabs.org
display_url: https://www.heatsynclabs.org
logo_url: https://www.heatsynclabs.org/hsl-logo.png

# -----------------------------------------------------------------------------
# Content Collections
# -----------------------------------------------------------------------------
collections:

  # ---------------------------------------------------------------------------
  # Blog Posts
  # ---------------------------------------------------------------------------
  - name: blog
    label: "Blog Posts"
    label_singular: "Blog Post"
    folder: src/content/blog
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    summary: "{{title}} ({{year}}-{{month}}-{{day}})"
    sortable_fields: ['pubDate', 'title']
    view_groups:
      - label: Year
        field: pubDate
        pattern: \d{4}
    view_filters:
      - label: Drafts
        field: draft
        pattern: true
      - label: Published
        field: draft
        pattern: false
    fields:
      - label: "Title"
        name: "title"
        widget: "string"
        hint: "The headline for your post"

      - label: "Description"
        name: "description"
        widget: "text"
        hint: "A brief summary shown in post listings (1-2 sentences)"

      - label: "Publish Date"
        name: "pubDate"
        widget: "datetime"
        format: "YYYY-MM-DD"
        date_format: "MMMM D, YYYY"
        time_format: false
        hint: "When should this post be dated?"

      - label: "Author"
        name: "author"
        widget: "string"
        default: "HeatSync Labs"
        hint: "Who wrote this post?"

      - label: "Featured Image"
        name: "featuredImage"
        widget: "image"
        required: false
        hint: "Optional header image for the post"

      - label: "Featured Image Alt Text"
        name: "featuredImageAlt"
        widget: "string"
        required: false
        hint: "Describe the image for accessibility"

      - label: "Tags"
        name: "tags"
        widget: "list"
        default: []
        hint: "Comma-separated tags (e.g., announcements, equipment, events)"

      - label: "Draft"
        name: "draft"
        widget: "boolean"
        default: false
        hint: "Draft posts are not published to the live site"

      - label: "Content"
        name: "body"
        widget: "markdown"
        hint: "Write your post content here using Markdown"

  # ---------------------------------------------------------------------------
  # Static Pages (optional - for editing existing pages)
  # ---------------------------------------------------------------------------
  - name: pages
    label: "Pages"
    label_singular: "Page"
    folder: src/content/pages
    create: false
    fields:
      - label: "Title"
        name: "title"
        widget: "string"

      - label: "Description"
        name: "description"
        widget: "string"
        required: false

      - label: "Content"
        name: "body"
        widget: "markdown"
```

---

## Part 6: OAuth Proxy Setup

### Why This Is Needed

GitHub OAuth requires a server-side component to exchange authorization codes for access tokens. Since GitHub Pages is static, we need a small proxy service.

### 6.1 Create GitHub OAuth App

1. Go to: https://github.com/organizations/heatsynclabs/settings/applications
   (Or for personal: https://github.com/settings/developers)

2. Click "New OAuth App"

3. Fill in:
   - **Application name:** `HeatSync Labs CMS`
   - **Homepage URL:** `https://www.heatsynclabs.org`
   - **Authorization callback URL:** `https://hsl-oauth.vercel.app/api/callback`
     (This will be your Vercel deployment URL)

4. After creating, note the:
   - **Client ID** (public, looks like `Iv1.abc123...`)
   - **Client Secret** (private, generate and copy immediately)

### 6.2 Deploy OAuth Proxy to Vercel

**Option A: Use the template (Recommended)**

1. Go to: https://github.com/vencax/netlify-cms-github-oauth-provider
2. Click "Deploy to Vercel" button
3. Set environment variables:
   - `OAUTH_CLIENT_ID` = your GitHub Client ID
   - `OAUTH_CLIENT_SECRET` = your GitHub Client Secret
4. Deploy and note the URL (e.g., `https://hsl-oauth.vercel.app`)

**Option B: Create minimal proxy manually**

Create a new Vercel project with this structure:

```
/api/auth.js
/api/callback.js
```

**`/api/auth.js`:**
```javascript
export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = `${process.env.VERCEL_URL || 'https://hsl-oauth.vercel.app'}/api/callback`;
  const scope = 'repo,user';

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  );
}
```

**`/api/callback.js`:**
```javascript
export default async function handler(req, res) {
  const { code } = req.query;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  const script = `
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify(data)}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(script);
}
```

### 6.3 Update CMS Config

After deploying the OAuth proxy, update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: heatsynclabs/new-hsl
  branch: gh-pages
  base_url: https://hsl-oauth.vercel.app  # Your actual Vercel URL
  auth_endpoint: /api/auth
```

### 6.4 Grant User Access

Users who need CMS access must:
1. Have a GitHub account
2. Be added as collaborators to the `heatsynclabs/new-hsl` repo (with write access)

When they visit `/admin`, they'll authenticate with GitHub and can then create/edit posts.

---

## Part 7: File Summary

### Files to Create

| File | Purpose |
|------|---------|
| `src/content/blog/` | Directory for blog post markdown files |
| `src/pages/blog/index.astro` | Blog listing page |
| `src/pages/blog/[...slug].astro` | Individual blog post pages |
| `src/components/sections/LatestPostsSection.astro` | Homepage news widget |
| `public/admin/index.html` | CMS entry point |
| `public/admin/config.yml` | CMS configuration |
| `public/blog/` | Directory for blog images |

### Files to Modify

| File | Changes |
|------|---------|
| `src/content/config.ts` | Add `blog` collection schema |
| `src/pages/index.astro` | Import and add `LatestPostsSection` |
| `src/components/layout/AppHeader.astro` | Add "News" nav links (desktop + mobile) |

### External Setup

| Item | Location |
|------|----------|
| GitHub OAuth App | GitHub org/personal settings |
| OAuth Proxy | Vercel (free tier) |

---

## Part 8: Testing & Verification

### Local Development

```bash
# Start dev server
bun run dev

# Verify these URLs work:
# - http://localhost:4321/blog           (blog listing)
# - http://localhost:4321/blog/[slug]    (individual posts)
# - http://localhost:4321/               (homepage with news section)
# - http://localhost:4321/admin          (CMS - won't fully work locally without OAuth)
```

### CMS Testing

1. Deploy to GitHub Pages (push to gh-pages branch)
2. Navigate to `https://www.heatsynclabs.org/admin`
3. Click "Login with GitHub"
4. Authorize the OAuth app
5. Create a test post
6. Verify:
   - Post file appears in repo under `src/content/blog/`
   - GitHub Actions triggers a build
   - Post appears on live site after deploy

### Checklist

- [ ] Blog collection schema added to `src/content/config.ts`
- [ ] Sample blog post created in `src/content/blog/`
- [ ] `/blog` page renders post listing
- [ ] `/blog/[slug]` pages render individual posts
- [ ] Homepage shows "Latest News" section
- [ ] Navigation includes "News" link (desktop + mobile)
- [ ] CMS admin page loads at `/admin`
- [ ] GitHub OAuth App created
- [ ] OAuth proxy deployed to Vercel
- [ ] CMS config points to OAuth proxy
- [ ] Test user can log in and create a post
- [ ] New posts trigger GitHub Actions build
- [ ] Published posts appear on live site

---

## Part 9: Optional Enhancements

### RSS Feed

**File:** `src/pages/rss.xml.js`

```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);

  return rss({
    title: 'HeatSync Labs News',
    description: 'Updates from Arizona\'s community hackerspace',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.slug}/`,
        author: post.data.author,
      })),
  });
}
```

Requires adding `@astrojs/rss` to dependencies:
```bash
bun add @astrojs/rss
```

### Tag Pages

Create `src/pages/blog/tag/[tag].astro` to filter posts by tag.

### Pagination

For blogs with many posts, add pagination to the index page using Astro's `paginate()` function.

---

## Troubleshooting

### CMS Login Issues

- Verify OAuth App callback URL matches your Vercel deployment
- Check Vercel environment variables are set correctly
- Ensure user has write access to the GitHub repo

### Posts Not Appearing

- Check `draft: false` in frontmatter
- Verify file is in `src/content/blog/` directory
- Check for Zod schema validation errors in build output

### Build Failures

- Run `bun run build` locally to see errors
- Check frontmatter matches schema (especially date format)
- Verify all required fields are present

### Images Not Loading

- Images must be in `public/blog/` directory
- Reference as `/blog/image-name.jpg` (not relative paths)
- Check file extensions match exactly (case-sensitive)
