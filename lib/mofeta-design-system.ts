/**
 * Mofeta Design System - Comprehensive UI Specification
 *
 * This file contains reusable design tokens and utility classes for the Mofeta design system.
 * Reference this when building new pages or features.
 */

// =============================================================================
// 1. COLOR PALETTE
// =============================================================================

export const colors = {
  // Backgrounds
  background: {
    primary: "#000000",
    elevated: "rgba(9, 9, 11, 0.7)", // zinc-950/70
    surface: "rgba(255, 255, 255, 0.05)", // bg-white/5
    surfaceHover: "rgba(255, 255, 255, 0.1)", // bg-white/10
  },

  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "#d4d4d8", // zinc-300
    tertiary: "#a1a1aa", // zinc-400
    muted: "#71717a", // zinc-500
    subtle: "#52525b", // zinc-600
    ghost: "#3f3f46", // zinc-700
  },

  // Borders
  border: {
    default: "rgba(255, 255, 255, 0.1)",
    hover: "rgba(255, 255, 255, 0.2)",
    active: "#FFFFFF",
    divider: "#27272a", // zinc-800
  },

  // Accents
  accent: {
    glow: "0 0 8px rgba(255,255,255,0.3)",
    strongGlow: "0 0 12px rgba(255,255,255,0.4)",
    subtleGlow: "0 0 4px rgba(255,255,255,0.2)",
  },
}

// =============================================================================
// 2. TYPOGRAPHY CLASSES
// =============================================================================

export const typography = {
  // Size variants
  hero: "text-5xl md:text-7xl font-light tracking-tight",
  section: "text-3xl font-light tracking-tight",
  cardTitle: "text-[10px] font-mono tracking-[0.3em] uppercase",
  label: "text-[10px] font-mono tracking-[0.3em] uppercase",
  body: "text-sm",
  data: "text-[10px] font-mono",
}

// =============================================================================
// 3. COMPONENT CLASSES
// =============================================================================

export const components = {
  // Glass container
  glassContainer: "relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 overflow-hidden",

  // Top reflection line
  topReflection: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent",

  // Corner gradient overlay
  cornerGradient: "absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none",

  // Primary button
  primaryButton:
    "px-6 py-3 bg-white text-black text-xs font-mono tracking-wider hover:bg-zinc-200 transition-all relative overflow-hidden group",

  // Secondary button (glass)
  secondaryButton:
    "px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/20 text-white text-xs font-mono tracking-wider hover:bg-white/10 hover:border-white/40 transition-all",

  // Ghost button
  ghostButton: "px-6 py-3 text-zinc-400 text-xs font-mono tracking-wider hover:text-white transition-colors",

  // Icon button
  iconButton:
    "w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all",

  // Skewed active filter
  skewedActiveFilter:
    "text-[10px] font-mono px-3 py-1.5 bg-white text-black skew-x-[-6deg] shadow-[0_0_12px_rgba(255,255,255,0.2)]",

  // Live badge
  liveBadge: "flex items-center gap-2 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20",

  // Count badge
  countBadge: "text-[10px] font-mono text-white px-1.5 py-0.5 bg-white/20 backdrop-blur-sm",

  // Feed item active
  feedItemActive:
    "border-l-2 border-white pl-4 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer",

  // Feed item inactive
  feedItemInactive:
    "border-l-2 border-zinc-700 pl-4 py-3 hover:bg-white/5 hover:backdrop-blur-sm hover:border-zinc-500 transition-all cursor-pointer",
}

// =============================================================================
// 4. SKEWED ELEMENTS
// =============================================================================

export const skewed = {
  // Parallelogram indicator (logo echo)
  indicator: "w-3 h-5 bg-white skew-x-[-12deg]",
  indicatorWithGlow: "w-3 h-5 bg-white skew-x-[-12deg] shadow-[0_0_6px_rgba(255,255,255,0.4)]",
  indicatorDimmed: "w-2 h-2 bg-white/40 skew-x-[-12deg]",

  // Progress bar
  progressBar: "h-1.5 bg-white/10 backdrop-blur-sm overflow-hidden skew-x-[-12deg] rounded-full",

  // Active tab indicator
  tabIndicator: "h-0.5 bg-white skew-x-[-12deg] shadow-[0_0_8px_rgba(255,255,255,0.3)]",
}

// =============================================================================
// 5. KEY DESIGN PRINCIPLES
// =============================================================================

/*
1. Angular Language: Use skew-x-[-12deg] to echo the parallelogram logo mark
2. Monochromatic: Strictly white/zinc palette, no colors except for specific data coding
3. Glass Depth: Layer backdrop-blur with bg-white/X for depth without opacity
4. Glow Accents: Use shadow-[0_0_Xpx_rgba(255,255,255,0.X)] for emphasis
5. Uppercase Labels: All labels are uppercase tracking-[0.3em] text-[10px] font-mono
6. Hover States: Transition border opacity and background opacity, not colors
7. Data-First: Typography hierarchy prioritizes data readability
*/
