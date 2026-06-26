
# 💖 Cute Date Invitation Web App – UI & Flow Specification

## 🎯 Project Goal
Build a cute, pastel, kawaii-style web application that guides the user through a romantic date invitation flow using step-by-step screens.

The web should feel:
- Soft
- Playful
- Romantic
- Wholesome
- Mobile-first

Inspired by the latest provided design reference.

---

## 🧱 Tech Stack (Recommended)
- Framework: **Next.js (App Router)**
- Styling: **Tailwind CSS**
- Animation: **Framer Motion**
- Icons: **Custom SVG icons (no text inside icons)**
- Fonts: Rounded / cute font (e.g. Poppins, Nunito, Baloo)
- State: React state only (no backend)

---

## 📱 General UI Rules
- Mobile-first layout (375x812 reference)
- Rounded corners everywhere (20–32px)
- Pastel pink / purple gradients
- Soft glow & shadow
- Floating hearts & sparkles as decorative elements
- Buttons are **pill-shaped**
- Icons are **standalone images (no text inside icon)**

---

## 🧭 App Flow (5 Screens)

### STEP 1 – Opening Screen
**Purpose:** Introduce the app and tease the question.

**Layout:**
- Fullscreen gradient background (pink–purple pastel)
- Cute character illustration (bunny holding heart)
- Floating hearts, balloons, sparkles
- Main CTA button at bottom

**Text:**
- "Hey you! 💌"
- "I have something important to ask..."
- "Promise you won’t leave before answering 🥺"

**Button:**
- Label: "Open the Question"
- Pink gradient, glossy, arrow icon

---

### STEP 2 – The Main Question
**Purpose:** Ask the date question playfully.

**Layout:**
- Soft pastel background
- Bunny illustration
- Floating hearts

**Text:**
- "Would you like to go on a date with me? 🥺💖"

**Buttons:**
- **YES**: large, pink gradient, heart icon
- **NO**: smaller, dashed border, playful dodge behavior
  - Tooltip texts:
    - "Are you sure? 😢"
    - "Think again... pretty please? 🥺"
    - "Wrong answer detected 🚨"

---

### STEP 3 – Choose Activity
**Purpose:** Choose date activity.

**Layout:**
- Grid (2 columns)
- Rounded cards

**Activities:**
- Dinner Date 🍝
- Coffee Date ☕
- Movie Date 🎬
- Ice Cream Date 🍦
- Bowling Date 🎳
- Gaming Date 🎮
- Park Walk 🌳
- Funfair Date 🎡

**Interaction:**
- Highlight on select
- Checkmark + bounce animation

---

### STEP 4 – Choose Location
**Purpose:** Pick date location visually.

**Layout:**
- Pastel illustrated map
- Dotted paths
- Location pins

**Locations:**
- Cozy Cafe ☕
- Rooftop Spot 🌆
- Cinema 🎬
- Romantic Restaurant 🍽️
- City Park 🌳
- Amusement Park 🎡

Each location shows:
- Icon
- Name
- Star rating ⭐

---

### STEP 5 – Final Confirmation
**Purpose:** Celebrate result.

**Layout:**
- Confetti & hearts
- Anime-style couple illustration

**Text:**
- "YAYYY! 🎉 It’s a Date! 💖"

**Summary:**
- Selected activity
- Selected location

**Buttons:**
1. Save Our Date (primary)
2. Share This Moment (secondary)

Footer:
- "Can’t wait! See you soon ✨"

---

## ✨ Animations
- Fade + slide screen transitions
- Floating hearts loop
- Button hover scale
- Confetti burst on success

---

## ♿ Accessibility
- Contrast AA
- Button min height 44px
- Icons always paired with labels

---

## 💗 Success Criteria
If the user smiles or says “aww 🥹”, the app is successful.
