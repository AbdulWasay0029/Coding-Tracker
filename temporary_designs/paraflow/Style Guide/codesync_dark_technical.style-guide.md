# CodeSync Dark Technical Style Guide

**Style Overview**:
A premium dark glassmorphism theme with technical depth, featuring translucent frosted containers with luminous borders and neon-hued glow effects over deep atmospheric gradient backgrounds, creating next-generation developer tool sophistication with electric blue and emerald accents.

## Colors
### Primary Colors
  - **primary-base**: `text-[#3B82F6]` or `bg-[#3B82F6]` - Electric Blue base
  - **primary-lighter**: `text-[#60A5FA]` or `bg-[#60A5FA]` - Vibrant Cyan shimmer
  - **primary-darker**: `text-[#2563EB]` or `bg-[#2563EB]` - Deep Electric Blue

### Background Colors

#### Structural Backgrounds

Choose based on layout type:

**For Vertical Layout** (Top Header + Optional Side Panels):
- **bg-nav-primary**: `style="background: linear-gradient(180deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%); backdrop-filter: blur(16px);"` - Top header with glassmorphic blur
- **bg-nav-secondary**: `bg-[#0B0E14]/90 backdrop-blur-lg` - Inner Left sidebar (if present)
- **bg-page**: `style="background: radial-gradient(ellipse 80% 60% at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 70% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), #05070A;"` - Page background with electric blue and emerald atmospheric orbs

**For Horizontal Layout** (Side Navigation + Optional Top Bar):
- **bg-nav-primary**: `style="background: linear-gradient(90deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%); backdrop-filter: blur(16px);"` - Left main sidebar with glassmorphic blur
- **bg-nav-secondary**: `bg-[#0B0E14]/90 backdrop-blur-lg` - Inner Top header (if present)
- **bg-page**: `style="background: radial-gradient(ellipse 80% 60% at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 70% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), #05070A;"` - Page background with atmospheric depth

#### Container Backgrounds
For main content area. These create the glassmorphic frosted effect with luminous borders.
- **bg-container-primary**: `bg-white/0` - Transparent container, no background. Most content uses colorless containers for refined minimalism
- **bg-container-secondary**: `bg-[#1A1D24]/60 glass-subtle` - Standard glassmorphic containers for cards, panels
```css
.glass-subtle{
  box-shadow: inset 4px 0px 8px -3px rgba(255, 255, 255, 0.03), inset -4px 0px 8px -3px rgba(255, 255, 255, 0.03), 0 8px 32px -8px rgba(59, 130, 246, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```
- **bg-container-tertiary**: `bg-[#1A1D24]/80 glass-strong` - Emphasized containers with stronger glass effect
```css
.glass-strong{
  box-shadow: inset 8px 0px 16px -8px rgba(255, 255, 255, 0.06), inset -8px 0px 16px -8px rgba(255, 255, 255, 0.06), inset -2px 0px 3px -1px rgba(255, 255, 255, 0.04), inset 2px 0px 3px -1px rgba(255, 255, 255, 0.04), 0 12px 40px -10px rgba(59, 130, 246, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```
- **bg-container-inset**: `bg-black/20 glass-inset-subtle` - Input fields and inset areas
```css
.glass-inset-subtle{
  box-shadow: inset 3px 3px 8px -3px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.03);
}
```
- **bg-container-inset-strong**: `bg-black/30 glass-inset-strong` - Checkbox backgrounds, slider tracks
```css
.glass-inset-strong{
  box-shadow: inset 4px 4px 10px -4px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.04);
}
```

### Text Colors
- **color-text-primary**: `text-white/95`
- **color-text-secondary**: `text-white/70`
- **color-text-tertiary**: `text-white/50`
- **color-text-quaternary**: `text-white/30`
- **color-text-on-light-primary**: `text-[#0B0E14]/90` - Text on light backgrounds
- **color-text-on-light-secondary**: `text-[#0B0E14]/70` - Secondary text on light backgrounds
- **color-text-link**: `text-[#60A5FA]` - Links, text-only buttons, clickable text

### Functional Colors
Use **sparingly** to maintain premium dark aesthetic. For status indicators, tags, and alerts.
  - **color-success-default**: #10B981 - Emerald green for success states
  - **color-success-light**: rgba(16, 185, 129, 0.15) - Success tag/label bg
  - **color-error-default**: #EF4444 - Red for error states
  - **color-error-light**: rgba(239, 68, 68, 0.15) - Error tag/label bg
  - **color-warning-default**: #F59E0B - Gold for warnings
  - **color-warning-light**: rgba(245, 158, 11, 0.15) - Warning tag/label bg
  - **color-info-default**: #60A5FA - Cyan blue for info
  - **color-info-light**: rgba(96, 165, 250, 0.15) - Info tag/label bg

### Accent Colors
  - Secondary palette for categorization and data visualization highlights. **Use sparingly**.
  - **accent-purple**: `text-[#A78BFA]` or `bg-[#A78BFA]` - Purple for secondary actions
  - **accent-pink**: `text-[#F472B6]` or `bg-[#F472B6]` - Pink for creative elements
  - **accent-orange**: `text-[#FB923C]` or `bg-[#FB923C]` - Orange for alerts

### Data Visualization Charts
For data visualization charts and metrics displays only.
  - Technical data colors: #60A5FA, #10B981, #A78BFA, #F59E0B, #F472B6, #FB923C
  - Neutral data scale: rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15)

## Typography
- **Font Stack**:
  - **font-family-base**: `'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto"` — For regular UI copy
  - **font-family-mono**: `'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace` — For code, data, metrics, and technical displays

- **Font Size & Weight**:
  - **Caption**: `text-sm font-normal` - Metadata, timestamps
  - **Body**: `text-base font-normal` - Standard content
  - **Body Emphasized**: `text-base font-semibold` - Emphasized content
  - **Card Title / Subtitle**: `text-lg font-semibold` - Card headers
  - **Page Title**: `text-2xl font-semibold` - Page headers
  - **Headline**: `text-4xl font-semibold` - Hero sections
  - **Data/Metrics**: `font-family-mono text-base font-medium` - Numbers, stats, code snippets

- **Line Height**: 1.5

## Border Radius
  - **Small**: 8px — Elements inside cards, small tags
  - **Medium**: 12px — Buttons, inputs, small cards
  - **Large**: 16px — Large cards, panels
  - **XL**: 20px — Hero sections, featured containers
  - **Full**: full — Toggles, avatars, pill buttons

## Layout & Spacing
  - **Tight**: 8px - Icon-text gaps, closely related elements
  - **Compact**: 12px - Small container gaps, tag groups
  - **Standard**: 20px - List items, medium containers
  - **Relaxed**: 32px - Large containers, section spacing
  - **Section**: 48px - Major section divisions, hero spacing

## Create Boundaries (glassmorphic translucency, luminous borders, neon-hued shadows)
Premium glassmorphism with frosted blur effects, subtle luminous borders, and neon-accented shadows for depth.

### Borders
  - **Default**: `border border-white/5` - Subtle luminous border for glassmorphic containers
  - **Emphasized**: `border border-white/8` - Stronger border for focused states
  - **Interactive Glow**: `border border-[#60A5FA]/30` - Neon glow border for hover/active states

### Dividers
  - **Subtle**: `border-t border-white/5` or `border-b border-white/5` - Section separators
  - **Emphasized**: `border-t border-white/10` - Stronger visual separation

### Shadows & Effects
  - **Glass Subtle** (default cards): `shadow-[0_8px_32px_-8px_rgba(59,130,246,0.15)]` with backdrop-blur
  - **Glass Strong** (emphasized cards): `shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)]` with stronger backdrop-blur
  - **Neon Glow** (interactive elements): `shadow-[0_4px_24px_-4px_rgba(96,165,250,0.4)]` - Cyan glow on hover
  - **Success Glow**: `shadow-[0_4px_24px_-4px_rgba(16,185,129,0.3)]` - Emerald glow for success states
  - **Inset Shadow** (inputs): `shadow-[inset_3px_3px_8px_-3px_rgba(0,0,0,0.3)]`

## Visual Emphasis for Containers
When containers (tags, cards, list items) need visual emphasis to indicate priority, status, or category, use the following techniques:

| Technique | Implementation Notes | Best For | Avoid |
|-----------|---------------------|----------|-------|
| Background Tint | Increase glassmorphic opacity (bg-[#1A1D24]/80) or add accent color tint | Gentle emphasis on glassmorphic surfaces | Heavy colors that break glass aesthetic |
| Border Highlight | Use neon borders with glow: border-[#60A5FA]/50 with matching shadow | Active/selected states, hover interactions | - |
| Glow Effect | Apply neon-hued shadows matching accent colors | Premium technical emphasis, interactive states | Overuse that diminishes premium feel |
| Status Accent | Add colored vertical bar or subtle background tint with matching glow | Status indicators, priority levels | - |
| Blur Intensity | Increase backdrop-blur strength (blur-lg to blur-xl) | Layered depth, modal overlays | Excessive blur reducing readability |

## Assets
### Image
  - For normal `<img>`: object-cover brightness-90 contrast-90
  - For `<img>` with:
    - Slight overlay: object-cover brightness-75 contrast-90
    - Heavy overlay: object-cover brightness-50 contrast-85

### Icon
- Use Lucide icons from Iconify for outline style with technical precision.
- To ensure an aesthetic layout, each icon should be centered in a square container, typically without a background, matching the icon's size.
- Use Tailwind font size to control icon size
- Example:
  ```html
  <div class="flex items-center justify-center bg-transparent w-5 h-5">
  <iconify-icon icon="lucide:code" class="text-base"></iconify-icon>
  </div>
  ```

### Third-Party Brand Logos:
   - Use Brand Icons from Iconify.
   - Logo Example:
     Monochrome Logo: `<iconify-icon icon="simple-icons:github"></iconify-icon>`
     Colored Logo: `<iconify-icon icon="logos:github-icon"></iconify-icon>`

### User's Own Logo:
- To protect copyright, do **NOT** use real product logos as a logo for a new product, individual user, or other company products.
- **Icon-based**:
  - **Graphic**: Use a simple, relevant icon (e.g., a `code` icon for developer tools, a `terminal` icon for technical platforms).

## Page Layout - Web (*EXTREMELY* important)
### Determine Layout Type
- Choose between Vertical or Horizontal layout based on whether the primary navigation is a full-width top header or a full-height sidebar (left/right).
- User requirements typically indicate the layout preference. If unclear, consider:
  - Marketing/content sites typically use Vertical Layout.
  - Functional/dashboard sites can use either, depending on visual style. Sidebars accommodate more complex navigation than top bars. For complex navigation needs with a preference for minimal chrome (Vertical Layout adds an extra fixed header), choose Horizontal Layout (omits the fixed top header).
- Vertical Layout Diagram:
┌──────────────────────────────────────────────────────┐
│  Header (Primary Nav)                                │
├──────────┬──────────────────────────────┬────────────┤
│Left      │ Sub-header (Tertiary Nav)    │ Right      │
│Sidebar   │ (optional)                   │ Sidebar    │
│(Secondary├──────────────────────────────┤ (Utility   │
│Nav)      │ Main Content                 │ Panel)     │
│(optional)│                              │ (optional) │
│          │                              │            │
└──────────┴──────────────────────────────┴────────────┘
- Horizontal Layout Diagram:
┌──────────┬──────────────────────────────┬───────────┐
│          │ Header (Secondary Nav)       │           │
│ Left     │ (optional)                   │ Right     │
│ Sidebar  ├──────────────────────────────┤ Sidebar   │
│ (Primary │ Main Content                 │ (Utility  │
│ Nav)     │                              │ Panel)    │
│          │                              │ (optional)│
│          │                              │           │
└──────────┴──────────────────────────────┴───────────┘
### Detailed Layout Code
**Vertical Layout**
```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size -->
<body class="w-[1440px] min-h-[900px] font-['Inter','Outfit',-apple-system,BlinkMacSystemFont,'Segoe_UI','Roboto'] leading-[1.5]" style="background: radial-gradient(ellipse 80% 60% at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 70% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), #05070A;">

  <!-- Header (Primary Nav): Fixed height -->
  <header class="w-full" style="background: linear-gradient(180deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%); backdrop-filter: blur(16px);">
    <!-- Header content -->
  </header>

  <!-- Content Container: Must include 'flex' class -->
  <div class="w-full flex min-h-[900px]">
    <!-- Left Sidebar (Secondary Nav) (Optional): Remove if not needed. If Left Sidebar exists, use its ml to control left page margin -->
    <aside class="flex-shrink-0 min-w-fit">

    </aside>

    <!-- Main Content Area:
     Use Main Content Area's horizontal padding (px) to control distance from main content to sidebars or page edges.
     For pages without sidebars (like Marketing Pages, simple content pages such as help centers, privacy policies) use larger values (px-30 to px-80), for pages with sidebars (Functional/Dashboard Pages, complex content pages with multi-level navigation like knowledge base articles) use moderate values (px-8 to px-16) -->
    <main class="flex-1 overflow-x-hidden flex flex-col">
    <!--  Main Content -->

    </main>

    <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
    <aside class="flex-shrink-0 min-w-fit">
    </aside>

  </div>
</body>
```

**Horizontal Layout**

```html
<!-- Body: Adjust width (w-[1440px]) based on target screen size. Must include 'flex' class -->
<body class="w-[1440px] min-h-[900px] flex font-['Inter','Outfit',-apple-system,BlinkMacSystemFont,'Segoe_UI','Roboto'] leading-[1.5]" style="background: radial-gradient(ellipse 80% 60% at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 70% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), #05070A;">

<!-- Left Sidebar (Primary Nav): Use its ml to control left page margin -->
  <aside class="flex-shrink-0 min-w-fit" style="background: linear-gradient(90deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%); backdrop-filter: blur(16px);">
  </aside>

  <!-- Content Container-->
  <div class="flex-1 overflow-x-hidden flex flex-col min-h-[900px]">

    <!-- Header (Secondary Nav) (Optional): Remove if not needed. If Header exists, use its mx to control distance to left/right sidebars or page margins -->
    <header class="w-full">
    </header>

    <!-- Main Content Area: Use Main Content Area's pl to control distance from main content to left sidebar. Use pr to control distance to right sidebar/right page edge -->
    <main class="w-full">
    </main>


  </div>

  <!-- Right Sidebar (Utility Panel) (Optional): Remove if not needed. If Right Sidebar exists, use its mr to control right page margin -->
  <aside class="flex-shrink-0 min-w-fit">
  </aside>

</body>
```

## Tailwind Component Examples (Key attributes)
**Important Note**: Use utility classes directly. Do NOT create custom CSS classes or add styles in <style> tags for the following components

### Basic

- **Button**: (Note: Use flex and items-center for the container. Glassmorphic buttons with neon glow on hover)
  - Example 1 (primary button with glass effect):
    - button: flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B82F6]/80 backdrop-blur-md border border-white/10 hover:shadow-[0_4px_24px_-4px_rgba(96,165,250,0.4)] transition
      - span(button copy): whitespace-nowrap text-white/95 font-medium
  - Example 2 (secondary glass button):
    - button: flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition
      - span(button copy): whitespace-nowrap text-white/90 font-medium
  - Example 3 (icon button):
    - button: flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-[#60A5FA]/30 hover:shadow-[0_4px_16px_-4px_rgba(96,165,250,0.3)] transition
      - icon

- **Tag Group (Filter Tags)** (Note: `overflow-x-auto` and `whitespace-nowrap` are required. Tags with glassmorphic background)
  - container(scrollable): flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden
    - label (Tag item 1):
      - input: type="radio" name="tag1" class="sr-only peer" checked
      - div: px-4 py-2 rounded-lg bg-[#1A1D24]/40 backdrop-blur-md border border-white/5 text-white/70 peer-checked:bg-[#3B82F6]/60 peer-checked:border-[#60A5FA]/30 peer-checked:text-white/95 peer-checked:shadow-[0_4px_16px_-4px_rgba(96,165,250,0.3)] hover:opacity-80 transition whitespace-nowrap

### Data Entry
- **Progress bars/Slider**: h-2 rounded-full bg-black/30 with fill using bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]
- **Checkbox**
  - label: flex items-center gap-3
    - input: type="checkbox" class="sr-only peer"
    - div: w-5 h-5 bg-black/30 backdrop-blur-sm border border-white/5 rounded flex items-center justify-center peer-checked:bg-[#3B82F6]/80 peer-checked:border-[#60A5FA]/40 peer-checked:shadow-[0_0_12px_rgba(96,165,250,0.4)] text-transparent peer-checked:text-white transition
      - svg(Checkmark): stroke="currentColor" stroke-width="3"
    - span(text): text-white/90
- **Radio button**
  - label: flex items-center gap-3
    - input: type="radio" name="option1" class="sr-only peer"
    - div: w-5 h-5 bg-black/30 backdrop-blur-sm border border-white/5 rounded-full flex items-center justify-center peer-checked:bg-[#3B82F6]/80 peer-checked:border-[#60A5FA]/40 peer-checked:shadow-[0_0_12px_rgba(96,165,250,0.4)] text-transparent peer-checked:text-white transition
      - svg(dot indicator): fill="currentColor"
    - span(text): text-white/90
- **Switch/Toggle**
  - label: flex items-center gap-3
    - div: relative
      - input: type="checkbox" class="sr-only peer"
      - div(Toggle track): w-14 h-7 bg-black/30 backdrop-blur-sm border border-white/5 peer-checked:bg-[#3B82F6]/80 peer-checked:border-[#60A5FA]/40 peer-checked:shadow-[0_0_12px_rgba(96,165,250,0.4)] rounded-full transition
      - div(Toggle thumb): absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg peer-checked:translate-x-7 transition
    - span(text): text-white/90

- **Select/Dropdown**
  - Select container: flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition
    - text: text-white/90
    - Dropdown icon(square container): flex items-center justify-center bg-transparent w-5 h-5
      - icon: text-white/70

### Container
- **Navigation Menu - horizontal**
    - Navigation with sections/grouping:
        - Nav Container: flex items-center justify-between w-full px-8 py-4
        - Left Section: flex items-center gap-10
          - Menu Item: flex items-center gap-2 text-white/70 hover:text-white/95 transition font-medium
        - Right Section: flex items-center gap-6
          - Menu Item: flex items-center gap-2 text-white/70 hover:text-white/95 transition font-medium
          - Notification (if applicable): relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition
            - notification-icon: w-5 h-5 text-white/90
            - badge (if has unread): absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] border-2 border-[#05070A] flex items-center justify-center
              - badge-count: text-[10px] font-bold text-white
          - Avatar(if applicable): flex items-center gap-2
            - avatar-image: w-10 h-10 rounded-full border-2 border-white/10
            - dropdown-icon (if applicable): w-4 h-4 text-white/70

- **Card**
    - Example 1 (Glassmorphic card with image):
        - Card: bg-[#1A1D24]/60 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col p-5 gap-4 hover:border-white/10 hover:shadow-[0_8px_32px_-8px_rgba(59,130,246,0.2)] transition
        - Image: rounded-xl w-full object-cover
        - Text area: flex flex-col gap-3
          - card-title: text-lg font-semibold text-white/95
          - card-subtitle: text-sm font-normal text-white/70
    - Example 2 (Premium data card with metrics):
        - Card: bg-[#1A1D24]/80 backdrop-blur-lg border border-white/8 rounded-2xl flex flex-col p-6 gap-4 shadow-[0_12px_40px_-10px_rgba(59,130,246,0.25)]
        - Header: flex items-center justify-between
          - title: text-base font-semibold text-white/95
          - icon: w-8 h-8 p-1.5 rounded-lg bg-[#3B82F6]/20 text-[#60A5FA]
        - Metric: font-['JetBrains_Mono'] text-3xl font-bold text-white/95
        - Label: text-sm text-white/60
    - Example 3 (Transparent card with glow on hover):
        - Card: bg-white/0 backdrop-blur-sm border border-white/5 rounded-2xl flex flex-col p-5 gap-4 hover:bg-[#1A1D24]/40 hover:border-[#60A5FA]/30 hover:shadow-[0_4px_24px_-4px_rgba(96,165,250,0.3)] transition-all duration-300
        - Content: flex flex-col gap-3
          - card-title: text-lg font-semibold text-white/95
          - card-description: text-sm font-normal text-white/70

## Additional Notes
- **Neon Glow Interactions**: Apply neon-hued shadows (cyan, emerald) on hover/active states for buttons, cards, and interactive elements
- **Backdrop Blur**: Essential for glassmorphic effect - use `backdrop-blur-md` (12px) for standard glass, `backdrop-blur-lg` (16px) for stronger emphasis
- **Luminous Borders**: Always use subtle white borders (rgba(255,255,255,0.05-0.1)) to define glass container edges
- **Atmospheric Depth**: Layer multiple radial gradients with low opacity for background depth without overwhelming content
- **Technical Precision**: Use monospaced font (JetBrains Mono) consistently for all numbers, metrics, code snippets, and data displays
- **Premium Polish**: Subtle transitions (200-300ms) on all interactive elements maintain smooth, professional feel
- **Developer Focus**: Design for high information density while maintaining clarity through strategic whitespace and glassmorphic layering

<colors_extraction>
#05070A
#0B0E14
#1A1D24
#3B82F6
#60A5FA
#2563EB
#10B981
#EF4444
#F59E0B
#A78BFA
#F472B6
#FB923C
#FFFFFF
#FFFFFFF2
#FFFFFFB3
#FFFFFF80
#FFFFFF4D
#0B0E14F2
#0B0E14FA
#1A1D2499
#1A1D24CC
#00000033
#00000052
rgba(59, 130, 246, 0.08)
rgba(16, 185, 129, 0.06)
rgba(255, 255, 255, 0.05)
rgba(255, 255, 255, 0.08)
rgba(96, 165, 250, 0.30)
rgba(255, 255, 255, 0.03)
rgba(255, 255, 255, 0.06)
rgba(255, 255, 255, 0.04)
rgba(59, 130, 246, 0.15)
rgba(59, 130, 246, 0.25)
rgba(96, 165, 250, 0.40)
rgba(16, 185, 129, 0.30)
rgba(16, 185, 129, 0.15)
rgba(239, 68, 68, 0.15)
rgba(245, 158, 11, 0.15)
rgba(96, 165, 250, 0.15)
linear-gradient(180deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%)
linear-gradient(90deg, rgba(11, 14, 20, 0.95) 0%, rgba(11, 14, 20, 0.98) 100%)
radial-gradient(ellipse 80% 60% at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 70% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%), #05070A
</colors_extraction>
