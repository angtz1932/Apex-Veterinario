# ApexVeterinario - Design System & UI/UX Guidelines

This document serves as the ground truth for the visual identity and user interface guidelines of the **ApexVeterinario** platform. Any future AI agent or developer contributing to this project MUST read and adhere to these guidelines to maintain a consistent, luxury, and premium user experience.

## 1. Design Philosophy
- **Aesthetic**: Dark Glassmorphism / Luxury.
- **Vibe**: High-end, trustworthy, modern, sleek, and polished.
- **Principles**: 
  - *Less is More*: Ample white (dark) space, avoiding clutter.
  - *Depth and Lighting*: Use of glassmorphism (backdrop-blur) and subtle glow effects to establish hierarchy.
  - *Motion as Feedback*: Fluid, 60fps micro-interactions using GSAP. Animations should be elegant and purposeful, never overwhelming.

## 2. Color Palette
The application uses a custom deep space dark theme with vibrant, trustworthy accents.
- **Background Base**: `#120524` (Deep Space Violet/Black).
- **Brand Primary**: `cyan-400` to `blue-600` gradients or specific custom brand values (`#0ea5e9`, etc.).
- **Glass/Surface**: 
  - `bg-white/5` (Subtle container).
  - `bg-white/10` (Hovered container or elevated element).
- **Borders**: 
  - `border-white/10` (Subtle definition for glass elements).
- **Text**: 
  - Primary: `text-white`
  - Secondary: `text-slate-300`
  - Tertiary/Muted: `text-slate-400`

## 3. Typography
- **Headings**: Clean, bold, and tightly tracked. Avoid generic default browser fonts. Rely on Next.js `Inter` or similar modern sans-serif.
- **Body**: Highly legible, with adequate line-height (`leading-relaxed` or `leading-loose` depending on context).
- **Hierarchy**: Use font weight (e.g., `font-extrabold` vs `font-medium`) and color contrast (`text-white` vs `text-slate-400`) to guide the user's eye, rather than just size.

## 4. Components & Glassmorphism
- **Cards & Modals**: Must use `bg-white/5`, `backdrop-blur-sm` (or `md`), and `border border-white/10`.
- **Shadows**: Soft, colored shadows (`shadow-brand-500/20`) can be used for primary call-to-actions, but generally, rely on glass borders for definition.
- **Inputs**: Dark backgrounds (`bg-black/20`), white text, and brand-colored focus rings (`focus:ring-brand-500/50`).

## 5. Animations & Interactions (GSAP + Tailwind)
- **Tooling**: We use `gsap` and `@gsap/react` for complex orchestrations, and Tailwind CSS for simple hover states.
- **Page Load (Staggers)**: Grids (like products or services) should animate in using GSAP staggers (e.g., `opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: "power2.out"`).
- **Hover Effects**: Buttons and cards should have subtle scale (`hover:scale-[1.02]`) and brightness changes.
- **Performance**: Always animate `transform` (scale, translate) and `opacity`. Avoid animating `layout` properties (width, height, margin) to ensure 60fps performance.

## 6. Layout & Spacing
- Use generous padding (e.g., `py-16`, `py-24` for sections).
- Max-width containers (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`) are standard for content alignment.
- Flexbox and CSS Grid should be used exclusively for structural layout.

*Note: When generating new components, refer to `src/components/shared/Card.tsx` and `src/components/shared/Button.tsx` as the gold standards for implementation.*
