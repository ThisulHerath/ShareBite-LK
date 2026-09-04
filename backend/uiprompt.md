Upgrade the UI of my MERN-stack web app "ShareBite LK" (React + Vite frontend, Tailwind CSS, Express/Node/MongoDB backend). Keep all existing functionality, routes, and component logic exactly as-is — this is a visual/UX upgrade only, not a rewrite of business logic.

CURRENT DESIGN LANGUAGE (preserve and elevate, don't discard):
- Palette: deep forest green (#1a3d33-ish), cream/off-white background (#F7F3E9-ish), coral/orange accent (#E8734A-ish), lime-green highlight (#D4E157-ish)
- Typography: serif display font for headlines (Playfair/Lora-style), clean sans-serif for body
- Existing pages: Login, Register, Home/Landing, Find Food (listing grid), Share Food (form), Dashboard

GOALS FOR THIS UPGRADE:

1. GLASSMORPHISM / DARK GLASS ACCENTS
   - Introduce frosted "glass" panels (backdrop-blur-xl, semi-transparent dark backgrounds like bg-black/30 or bg-emerald-950/40, subtle border border-white/10, soft inset highlight) on select surfaces: the navbar (make it sticky with blur-on-scroll), the login/register card, and the hero CTA band.
   - Use dark-glass treatment sparingly — 1-2 sections per page — so it reads as a deliberate accent, not a full dark-mode reskin.
   - Add soft drop shadows (shadow-2xl with colored glow, e.g. shadow-emerald-900/20) behind glass panels to lift them off the background.

2. FLOATING / AMBIENT ELEMENTS
   - Add floating decorative shapes in hero and section backgrounds: soft blurred blob shapes (like the existing green oval + orange square on the landing hero) but animated with slow float/parallax (translate-y keyframe animation, 6-10s ease-in-out infinite).
   - Add floating micro-elements: small pill badges, food-category icons, or dot particles that drift gently and respond subtly to scroll or mouse position (parallax on mousemove using transform translate3d).
   - On the Find Food listing cards, make the "Available" badge and category tag feel like they're floating slightly above the card (small shadow + subtle hover lift: hover:-translate-y-1 hover:shadow-xl transition).
   - Add a floating "quick action" button (Share Food / Find Food) that stays pinned bottom-right on scroll for logged-in users, glass-style.

3. CARD & COMPONENT REDESIGN
   - Food listing cards (Find Food page): redesign with an image/illustration placeholder area at top, rounded-2xl corners, glass-effect availability badge, hover state that lifts + slightly scales (scale-[1.02]) + brightens border to the coral accent.
   - Forms (Login, Register, Share Food): give inputs a softer look — rounded-xl, subtle inset shadow on focus, animated focus ring in coral or lime, floating labels that animate up when a field is filled/focused instead of static labels.
   - Dashboard: turn "Profile Details" and "Quick Actions" into a glass-panel duo over a subtle gradient mesh background (radial gradients in green/coral at low opacity). Activity cards ("Food you shared / reserved") get a timeline-style left accent border and status pill badges that glow slightly when "Reserved."

4. MICRO-INTERACTIONS & MOTION
   - Page transitions: fade + slight slide-up on route change (Framer Motion).
   - Button interactions: scale-95 on press, ripple or glow expand on hover for primary CTAs.
   - Scroll-triggered reveal animations (fade-up, stagger children) for the "How it works" 3-step cards and "What sharing can do" icon cards.
   - Number/stat counters (portions, listings) animate counting up when scrolled into view.

5. UNIQUE IDENTITY TOUCHES
   - Design a subtle custom illustration/icon style for food categories (Meals, Produce, Bakery) instead of plain text tags — small custom SVG icons with a hand-drawn/organic feel to match the serif branding.
   - Add a textured/noise overlay (very low opacity, 3-5%) on the cream background sections to avoid flat, generic SaaS look.
   - Introduce an accent "torn paper" or "organic blob" divider between sections instead of hard straight edges, echoing the food/community theme.
   - Custom cursor or hover-state accent (optional) on interactive cards — e.g. a small coral dot cursor follower on the Find Food grid.

TECHNICAL CONSTRAINTS:
- Tailwind CSS only for styling (utility classes + a small set of custom keyframes in tailwind.config.js for float/parallax animations)
- Use Framer Motion for scroll reveals, page transitions, and hover/press micro-interactions
- Keep all changes responsive (mobile-first breakpoints); glass/blur effects must degrade gracefully on mobile (reduce blur radius, disable heavy parallax on touch devices for performance)
- Do not break existing form validation, routing (React Router), or API calls
- Ensure WCAG-reasonable contrast is maintained on glass panels (add enough background opacity/darkness behind light text)

DELIVERABLE:
Go through the entire app in one pass and apply all the changes above across every component and page together — Navbar, Login/Register, Landing/Hero, How It Works, What Sharing Can Do, Find Food grid, Share Food form, and Dashboard — so the redesign lands as one cohesive visual system rather than a page-by-page patchwork. Output the full updated component files (or the complete diff per file) plus any shared additions: the Tailwind config changes (custom keyframes/colors), a shared GlassPanel/FloatingBlob/AnimatedCard component if you introduce reusable pieces, and any new global CSS for the noise texture or section dividers. Flag any component where applying everything at once would meaningfully increase bundle size or hurt mobile performance (e.g. heavy blur + parallax stacked together), and note the mitigation you used.