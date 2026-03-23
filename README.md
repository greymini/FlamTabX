# FlamTabX — web app

React + Vite + TypeScript + Tailwind. The marketing site, venture blog, and PDRC energy calculator live here.

## Run locally (view and verify changes)

From the **repository root**, enter this folder and install once:

```sh
cd FlamTabX
npm install
```

Start the dev server (hot reload):

```sh
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). Edit files under `src/`; the browser updates as you save.

Other useful commands:

| Command | Purpose |
|--------|---------|
| `npm run build` | Production build into `dist/` — catches TypeScript and bundling errors |
| `npm run preview` | Serves `dist/` locally after a build (good for checking production assets) |
| `npm run lint` | ESLint |
| `npm run update:browserslist` | Refreshes `caniuse-lite` (stops stale Autoprefixer / “browsers data is old” warnings during `vite build`) |

**Note:** If you cloned the parent repo (`flamtab`), the app root is **`flamtab/FlamTabX`**, not the repo root.

Production builds split large dependencies (React, Radix, markdown/KaTeX, etc.) into separate chunks so no single JS file exceeds the default size warning threshold.

## Where things live

- **Landing page:** `src/pages/Index.tsx` + `src/components/sections/`
- **Blog index:** `/blog` — `src/pages/BlogIndex.tsx`, manifest `src/data/blog-posts.ts` (titles, dates, read times)
- **Venture blog:** `/blog/flamtabx` — `src/pages/FlamTabX.tsx`, `src/content/flamtabx-pitch.md`
- **Calculator methodology:** `/blog/energy-calculator` — `src/pages/EnergyCalculatorResearch.tsx`, `src/content/pdrc-calculator-research.md`
- **Formulas & pipeline (LaTeX):** `/blog/pdrc-engineering` — `src/pages/PdrcEngineeringBlog.tsx`, `src/content/pdrc-engineering.md` (KaTeX via `remark-math` / `rehype-katex` in `BlogArticle`)
- **Energy calculator tool:** `/tools/energy-savings` — `src/pages/EnergySavingsPage.tsx`, `src/components/energy/EnergyCalculator.tsx`
- **Internal engineering spec:** the long `build_rd.md` at the **repo root** (`flamtab/build_rd.md`) is for maintainers only; it is **not** exposed under `public/`.
- **Static assets (URLs like `/og-flamtab.png`):** `public/`
- **Imported images:** `src/assets/` (import in TS/TSX so Vite hashes them in production)

## PNG and SVG files — reviewing and “accepting” changes

Git stores these as **binary** (or non-text) files. You don’t “read” the diff in the terminal the same way as `.tsx` files.

### After someone (or a tool) changes an image

1. **See what changed**  
   - In **Cursor / VS Code**: open the file from the source control view or disk and **preview** the image.  
   - Or open it in Finder / an image viewer: e.g. `public/og-flamtab.png`, `public/og-flamtab.svg`.

2. **Accept the new version in Git**  
   If you’re happy with the file on disk:

   ```sh
   cd FlamTabX
   git add public/og-flamtab.png public/og-flamtab.svg
   git status   # confirm staged
   git commit -m "Update OG image assets"
   ```

   Stage **only** the paths you intend (adjust filenames as needed).

3. **If Git reports a merge conflict on an image**  
   - There is no line-by-line merge. **Pick one whole file:**  
     - Keep **your** version: `git checkout --ours path/to/file.png` then `git add path/to/file.png`  
     - Keep **their** version: `git checkout --theirs path/to/file.png` then `git add path/to/file.png`  
   - Or manually copy the correct bytes into `path/to/file.png`, then `git add` that path.

4. **Regenerating raster images from SVG (optional)**  
   If `og-flamtab.png` is produced from `og-flamtab.svg` (e.g. via Preview, `qlmanage`, or design export), update the **SVG** in Git, regenerate the **PNG**, then `git add` both so previews (Twitter/LinkedIn) and the repo stay in sync.

### Quick verify after image updates

- **Dev:** `npm run dev` — references like `/og-flamtab.png` are served from `public/`.  
- **Production-like:** `npm run build && npm run preview` — confirm images appear in `dist/`.

## Tech stack

- Vite, React 18, TypeScript, React Router  
- Tailwind CSS, shadcn/ui  
- Content: Markdown loaded with `?raw` and rendered in blog components  

## Deploy

Build output is **`dist/`**. Host that folder on any static host (Vercel, Netlify, Cloudflare Pages, etc.), with **SPA fallback** to `index.html` for client-side routes (`/blog/...`, `/tools/...`).
