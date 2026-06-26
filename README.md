# 💖 Cute Date Invitation

A soft, pastel, kawaii-style web app that guides someone through a romantic date
invitation in 5 playful steps. Mobile-first, wholesome, and full of floating
hearts and sparkles.

Built from the spec in [`docs/project.md`](docs/project.md).

## ✨ The flow

1. **Opening** – a bunny mascot teases the big question.
2. **The Question** – "Would you like to go on a date with me? 🥺💖" with a
   giant **YES** and a **NO** button that dodges away (and grows the YES button!).
3. **Choose Activity** – a 2-column grid of date ideas with bounce + checkmark.
4. **Choose Location** – an illustrated map with tappable pins and star ratings.
5. **Final Confirmation** – confetti, a couple illustration, a date summary, plus
   **Save Our Date** (downloads an `.ics` calendar file) and **Share This Moment**
   (Web Share API / clipboard fallback).

## 🧱 Tech stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** for transitions & animations
- Custom SVG icons & illustrations
- Rounded fonts: **Baloo 2** (display) + **Nunito** (body)
- No backend — pure React state

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on a phone-sized viewport for
the best experience.

## 📦 Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – run the production build
- `npm run lint` – lint

## ♿ Accessibility

- AA-friendly contrast, 44px+ tap targets, icons paired with labels
- Respects `prefers-reduced-motion`

## 💗 Success criteria

> If the user smiles or says "aww 🥹", the app is successful.
