# The Français Hub — V1

A premium, editorial website concept for **The Français Hub by Yana Budhiraja**.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Motion for React
- Static export for GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on GitHub Pages

1. Create a GitHub repository and upload/push this project.
2. Make sure the default branch is `main`.
3. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
4. Push a commit to `main`.
5. The included `.github/workflows/deploy-pages.yml` workflow builds the static export and publishes the `out/` folder.

The workflow uses GitHub Pages' resolved `base_path`, so project URLs such as `https://username.github.io/repository/` work without manually rewriting links or image paths.

## Content currently included

- Home / full brand experience
- TEF / TCF page
- DELF page
- About Yana page
- Student results page
- WhatsApp CTAs to `+91 98704 16446`
- Student score screenshots supplied for the concept
- Yana imagery supplied / edited for the concept

## Before production launch

- Confirm final wording and credentials with Yana.
- Confirm permission to publish the student result screenshots publicly.
- Replace or add images if Yana prefers a dedicated brand photoshoot.
- Add the final domain and analytics only after approval.

## Brand direction

- Porcelain `#F5F2EC`
- Ink `#171719`
- French Ink Blue `#17283B`
- Bordeaux `#8A2938`
- Stone `#DAD5CD`
- Editorial serif + modern sans typography
- Wordmark-led identity with the `ç.` micro mark
