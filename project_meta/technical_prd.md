# Headless Real Estate CRM Website Technical PRD

## 1. Purpose

Build a modular, headless marketing website for a real estate CRM product.

The system must allow a real estate agent to:

* discover the product
* understand the core value proposition quickly
* explore product information and use cases
* submit a demo request, early-access request, or contact form
* be captured as a lead in HubSpot

The system must also allow the internal team to:

* create and edit pages without hardcoding every page manually
* reuse page sections and templates
* preview unpublished content
* publish updates safely
* track conversions and traffic sources

## 2. Primary Goal

Launch a modular website system with:

* WordPress as the CMS backend
* Next.js as the public frontend
* Vercel as hosting for the frontend
* HubSpot as the lead capture and CRM system

## 3. Non-Goals

Do not build:

* a customer login portal
* a full internal CRM
* property listing management
* user authentication for agents
* billing or payments
* a blog system in version 1 unless it comes almost for free
* a custom CMS

## 4. Technical Stack

### CMS

* WordPress installed on Namecheap shared hosting
* WordPress used only as content management backend
* WordPress must not be the public website renderer

### Frontend

* Next.js latest stable version
* TypeScript
* App Router
* Tailwind CSS
* Deployed on Vercel

### CRM / Lead Capture

* HubSpot forms or HubSpot Forms API
* HubSpot as source of truth for all inbound leads

### Data Fetching

* Preferred: WordPress via REST API or WPGraphQL
* Frontend fetches content server-side
* Frontend should support preview mode for draft content

### Analytics

* Lightweight analytics integration
* Track page views, CTA clicks, form starts, and form submissions

## 5. System Overview

### Architecture Summary

* Editors create content in WordPress
* Next.js fetches content from WordPress and renders public pages
* Visitors submit forms on the Next.js frontend
* Form submissions are sent to HubSpot
* Marketing team manages leads inside HubSpot

### Key Rule

WordPress is the content operating system.
Next.js is the presentation and conversion layer.
HubSpot is the lead system.

## 6. Core Product Requirements

### Requirement A: Modular Page Engine

The frontend must support pages assembled from reusable content sections.

Initial reusable section types:

* hero
* feature grid
* problem_solution
* use_cases
* how_it_works
* testimonial
* faq
* cta_band
* form_section
* rich_text
* stats_strip

Each page is composed of an ordered array of sections.

### Requirement B: CMS-Driven Pages

The CMS must support at least these page types:

* homepage
* product page
* landing page
* standard content page
* thank_you page

Each page must support:

* title
* slug
* seo_title
* meta_description
* og_title
* og_description
* noindex boolean
* page template type
* ordered content sections
* primary CTA label
* primary CTA target
* publish status

### Requirement C: Lead Capture

The system must support these forms:

* request_demo
* join_waitlist
* contact_sales

Each form should support these fields:

* first_name
* last_name
* email
* phone
* company_name
* market_or_city
* team_size
* current_workflow
* biggest_pain_point
* interest_type
* utm_source
* utm_medium
* utm_campaign
* landing_page_url

### Requirement D: Preview Workflow

Editors must be able to preview unpublished WordPress content in the Next.js frontend without publishing it.

### Requirement E: Fast Public Site

Public pages should be optimized for performance and SEO.
Use statically generated or cached pages where practical, with revalidation.

## 7. Functional Scope

### Public Pages in Version 1

1. Homepage
2. CRM Product Page
3. Demo Request Page
4. Early Access / Waitlist Page
5. Thank You Page
6. Contact Page
7. FAQ Page or FAQ sections inside pages
8. Legal pages placeholder if needed

### Homepage Goals

* communicate value proposition in less than 5 seconds
* explain what the product is for
* show key benefits for agents
* create trust
* drive one primary CTA

### Product Page Goals

* explain features and workflows
* show who the product is for
* connect features to outcomes
* drive conversion

### Demo / Waitlist Page Goals

* reduce friction
* collect lead data
* confirm submission clearly

## 8. Information Architecture

### Suggested Routes

* /
* /crm
* /demo
* /early-access
* /contact
* /thank-you
* /privacy
* /terms
* /[slug] for standard CMS-driven pages

### Route Behavior

* Pages should resolve by slug from WordPress content
* Unknown slugs should return 404
* Form success should redirect to thank-you page with source metadata preserved if useful

## 9. WordPress Content Model

### Option 1: Simple Page Model

Use WordPress Pages as base entities.
Attach structured metadata for SEO and ordered section data.

### Option 2: Structured Model

Create content types such as:

* page
* faq_item
* testimonial
* site_settings
* navigation_menu

### Required Global Content

* site name
* default SEO values
* header navigation
* footer navigation
* footer contact data
* social links
* global CTA config

## 10. Reusable Section Schemas

### Hero Section

Fields:

* eyebrow
* heading
* subheading
* primary_cta_label
* primary_cta_link
* secondary_cta_label
* secondary_cta_link
* media_type
* media_url
* background_variant

### Feature Grid Section

Fields:

* heading
* subheading
* items[]

  * title
  * description
  * icon

### Problem Solution Section

Fields:

* heading
* problem_text
* solution_text
* bullet_points[]

### Use Cases Section

Fields:

* heading
* use_cases[]

  * title
  * description

### FAQ Section

Fields:

* heading
* faqs[]

  * question
  * answer

### CTA Band

Fields:

* heading
* subheading
* cta_label
* cta_link
* variant

### Form Section

Fields:

* heading
* subheading
* form_type
* success_redirect_url
* submit_button_text

### Testimonial Section

Fields:

* heading
* testimonials[]

  * quote
  * name
  * role
  * company

### Rich Text Section

Fields:

* heading optional
* body

## 11. Frontend Requirements

### Rendering Model

* Build reusable React components for each section type
* Use a section renderer that maps CMS section type to React component
* Support a page template wrapper for each page type

### Component Rules

* Components must be modular and composable
* Components must accept typed props
* Components must fail safely if optional fields are missing
* Components must be responsive by default
* Components must follow accessible semantic HTML

### Styling Rules

* Use Tailwind CSS
* Keep styling clean, modern, minimal, and conversion-focused
* Avoid over-designed interactions
* Prioritize legibility and speed

### SEO Requirements

Each page must support:

* title
* meta description
* canonical URL
* Open Graph tags
* Twitter card tags
* robots directives when needed

## 12. Data Fetching Requirements

### Preferred Behavior

* Fetch CMS content server-side
* Cache or statically generate published pages where appropriate
* Support on-demand revalidation or equivalent cache refresh when WordPress content changes

### Error Handling

* Handle missing page content gracefully
* Handle CMS downtime with sensible fallback UI for public pages where possible
* Do not expose raw backend errors to users

## 13. Preview Mode Requirements

* Support secure preview route in Next.js
* Preview route should validate a secret token
* Preview route should fetch draft or preview content from WordPress
* Preview mode should only be accessible to authorized editors

## 14. HubSpot Integration Requirements

### Recommended Approach

* Render forms as native Next.js forms for full design control
* Submit data to a server-side API route in Next.js
* API route forwards validated submission to HubSpot

### Why

This gives better control over:

* styling
* validation
* spam protection
* source tracking
* analytics events

### Form Submission Flow

1. User fills form
2. Frontend validates fields
3. Frontend sends submission to internal API route
4. API route enriches with source metadata
5. API route submits to HubSpot
6. Success response returns redirect target
7. Frontend redirects to thank-you page

### Required HubSpot Metadata

* original page URL
* form type
* UTMs if present
* timestamp

## 15. Validation Requirements

### Client-Side Validation

* required field checks
* valid email
* clean phone formatting if possible
* field length protection

### Server-Side Validation

* duplicate essential validation
* reject malformed payloads
* never trust client-only validation

## 16. Security Requirements

* Use environment variables for all secrets
* Never expose HubSpot private credentials in client code
* Secure preview routes with a shared secret
* Use HTTPS-only APIs
* Sanitize all rich-text content before rendering if needed
* Protect form endpoints against abuse with a lightweight anti-spam approach

## 17. Performance Requirements

* Fast initial load
* Optimized images
* Minimal client-side JavaScript where possible
* Server-render or statically render content-heavy pages
* Avoid blocking third-party scripts unless required

## 18. Accessibility Requirements

* Semantic headings
* Keyboard-accessible navigation
* Accessible form labels and errors
* Sufficient contrast
* Focus states on interactive elements

## 19. Analytics Requirements

Track at minimum:

* page_view
* cta_click
* form_view
* form_start
* form_submit_success
* form_submit_error

Each event should include:

* page path
* page type
* form type if relevant
* UTM parameters if available

## 20. Environment Variables

Expected environment variables:

* WORDPRESS_API_URL
* WORDPRESS_PREVIEW_SECRET
* HUBSPOT_PORTAL_ID
* HUBSPOT_FORM_GUID_DEMO
* HUBSPOT_FORM_GUID_WAITLIST
* HUBSPOT_FORM_GUID_CONTACT
* HUBSPOT_PRIVATE_APP_TOKEN
* NEXT_PUBLIC_SITE_URL
* NEXT_PUBLIC_ANALYTICS_ID
* REVALIDATION_SECRET

## 21. Suggested Directory Structure

* app/

  * (marketing)/
  * api/
  * demo/
  * early-access/
  * contact/
  * thank-you/
  * [slug]/
* components/

  * sections/
  * ui/
  * forms/
  * layout/
* lib/

  * wordpress/
  * hubspot/
  * analytics/
  * seo/
  * validation/
* types/
* config/

## 22. Core Libraries and Utilities

Recommended:

* zod for schema validation
* react-hook-form or lightweight form state solution
* a CMS mapping utility for section rendering
* a metadata utility for SEO generation

## 23. API Route Requirements

### POST /api/forms/submit

Responsibilities:

* accept validated payload
* identify form type
* map payload to HubSpot format
* submit to HubSpot
* return success or structured error

### GET /api/preview

Responsibilities:

* validate preview secret
* enable preview mode
* redirect to requested slug

### POST /api/revalidate

Responsibilities:

* validate revalidation secret
* revalidate targeted path or tag
* return status response

## 24. Prompt Generation Goal

The prompt generating system should use this PRD to create a sequence of build prompts for a vibe-coding tool.

The sequence should start with:

1. project scaffold prompt
2. CMS integration prompt
3. routing and page rendering prompt
4. section component generation prompts
5. form system prompt
6. HubSpot integration prompt
7. preview mode prompt
8. SEO and analytics prompt
9. QA and hardening prompt

Each generated prompt should:

* focus on one bounded feature area
* include acceptance criteria
* include file targets
* preserve consistency with this PRD
* avoid rewriting unrelated parts of the codebase

## 25. Acceptance Criteria

The system is successful when:

* content editors can manage pages in WordPress
* public pages render correctly in Next.js
* pages are built from reusable sections
* preview mode works securely
* forms submit successfully to HubSpot
* thank-you flow works
* analytics fire for key conversion actions
* the site is responsive and production-ready

## 26. Delivery Order

### Phase 1

* scaffold Next.js project
* set up Tailwind and TypeScript
* set up shared layout and navigation
* define types and utilities

### Phase 2

* connect to WordPress API
* fetch and render pages by slug
* implement section renderer
* build global SEO handling

### Phase 3

* build homepage and product page section components
* implement reusable CTA and FAQ blocks
* implement navigation and footer from CMS

### Phase 4

* build form components
* add validation
* add Next API submission route
* connect to HubSpot
* build thank-you flow

### Phase 5

* add preview mode
* add revalidation flow
* add analytics
* add final polish and QA

## 27. Build Constraints

* Keep architecture simple
* Avoid unnecessary abstraction in version 1
* Build for modularity, not maximum complexity
* Prefer clear typed interfaces over magic mapping
* Do not let WordPress theme logic leak into the frontend

## 28. Final Instruction to Prompt Generator

Generate implementation prompts that assume the user is vibe-coding the application iteratively.

The prompts must:

* produce production-leaning code
* be explicit about file paths and responsibilities
* prefer maintainable patterns over clever shortcuts
* keep the system modular
* preserve separation between CMS, frontend, and CRM layers
* avoid introducing features outside this PRD unless explicitly marked as optional
