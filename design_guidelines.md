# Sweet Shop Management System - Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Drawing inspiration from modern e-commerce platforms (Shopify, Etsy) for the customer-facing shop interface, combined with clean productivity tool patterns (Linear, Notion) for the admin management panel.

**Key Principle**: Create a delightful, inviting sweet shop experience while maintaining professional inventory management functionality.

---

## Core Design Elements

### Typography
- **Primary Font**: Inter or DM Sans (Google Fonts) for clean, modern readability
- **Display Font**: Poppins or Space Grotesk for headings - adds personality without sacrificing professionalism
- **Hierarchy**:
  - Hero/Display: 3xl to 6xl, semi-bold to bold
  - Section Headings: 2xl to 3xl, semi-bold
  - Card Titles: lg to xl, medium
  - Body Text: base (16px), regular
  - Labels/Captions: sm to base, medium

### Layout System
**Spacing Units**: Use Tailwind's 4, 6, 8, 12, 16, 24 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: py-12 (mobile), py-16 to py-24 (desktop)
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl with px-4 to px-8

---

## Page-Specific Layouts

### Landing/Home Page (Public)
**Hero Section (50vh to 70vh)**:
- Large, appetizing hero image of colorful sweets/candy display
- Centered overlay content with blurred background button
- Headline + subheading + primary CTA ("Shop Now" or "Browse Sweets")

**Featured Sweets Section**:
- Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Sweet cards with product image, name, price, stock indicator
- Quick "Add to Cart" or "Purchase" action

**Category Showcase**:
- Horizontal scrolling or grid of sweet categories
- Visual cards with category images and names

**Trust Section**:
- Simple stats or features (e.g., "100+ Sweet Varieties", "Fresh Daily", "Fast Checkout")
- 3-column layout on desktop, stacked on mobile

### Authentication Pages
**Minimal, Centered Design**:
- Clean white/light card (max-w-md) on subtle background
- Logo at top
- Single-column form with generous spacing (space-y-4)
- Primary CTA button (full width)
- Link to alternate action ("Already have account?" / "Create account")
- No hero images - focus on form completion

### Shop Dashboard (Authenticated)
**Header/Navigation**:
- Sticky top bar with logo, search bar, user menu, cart icon
- Search bar: Prominent, 50-60% width on desktop with icon

**Filter Sidebar** (Desktop) / **Filter Drawer** (Mobile):
- Category checkboxes
- Price range slider
- Stock availability toggle
- Width: w-64 on desktop, full-screen drawer on mobile

**Product Grid**:
- Flexible grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Generous gap-6 to gap-8
- Cards with:
  - Product image (aspect-square)
  - Name, category badge, price
  - Stock indicator (badge or text)
  - Purchase button (disabled state when out of stock)

### Admin Panel
**Two-Column Layout**:
- Left sidebar navigation (w-64): Dashboard, Manage Sweets, Inventory, Add New
- Main content area with table or card-based layouts

**Manage Sweets Table**:
- Responsive table with columns: Image thumbnail, Name, Category, Price, Stock, Actions
- Action buttons: Edit (pencil icon), Delete (trash icon), Restock (plus icon)
- Mobile: Convert to card layout with stacked information

**Forms (Add/Edit Sweet)**:
- Two-column layout on desktop (lg:grid-cols-2)
- Input groups with labels above fields
- Image upload with preview
- Submit button at bottom right

---

## Component Library

### Cards
- Sweet Card: Rounded corners (rounded-lg), subtle shadow, hover lift effect
- Padding: p-4 to p-6
- Image at top, content below with space-y-3

### Buttons
- Primary: Solid fill, rounded-md to rounded-lg, px-6 py-2.5 to py-3
- Secondary: Outlined or ghost variant
- Disabled: Reduced opacity, cursor-not-allowed
- Blurred background for buttons over images

### Forms
- Input fields: border, rounded-md, px-4 py-2.5, focus:ring
- Labels: Block, mb-2, font-medium
- Error states: Red border, error text below (text-sm)
- Consistent spacing: space-y-4 between field groups

### Navigation
- Top navbar: Sticky, backdrop-blur for elevated feel
- Admin sidebar: Fixed on desktop, drawer on mobile
- Active state: Highlight with accent background or border

### Badges
- Category badges: Rounded-full, px-3 py-1, text-xs to text-sm
- Stock indicators: "In Stock" (subtle green), "Out of Stock" (subtle red), "Low Stock" (subtle amber)

### Search & Filters
- Search bar: Icon inside input, rounded-lg, shadow-sm
- Filter chips: Dismissible pills showing active filters
- Clear all filters link

---

## Images

### Hero Image
**Large hero image required**: Full-width, vibrant display of assorted sweets/candy in appealing arrangement
- Placement: Top of landing page, 50-70vh height
- Style: High-quality, colorful, appetizing photography
- Overlay: Gradient overlay for text readability

### Product Images
- Sweet/product photos: Square aspect ratio, clean white or subtle background
- Thumbnail size: Consistent across all cards
- Quality: High resolution, well-lit, showing texture and appeal

### Category Images
- Representative images for each sweet category (chocolates, gummies, hard candies, etc.)
- Consistent styling and treatment

---

## Responsive Behavior
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adaptations: Single column mobile → multi-column desktop
- Navigation: Hamburger menu on mobile, full navbar on desktop
- Admin sidebar: Drawer on mobile, fixed sidebar on desktop

---

## Accessibility
- Sufficient contrast ratios throughout
- Focus states on all interactive elements (focus:ring)
- Disabled states clearly communicated visually and with aria-disabled
- Form labels properly associated with inputs
- Alt text for all product images

---

**Animation**: Minimal - use only for:
- Hover states on cards (subtle lift/shadow)
- Button interactions
- Page transitions (subtle fade)
- Loading states (spinners for async operations)