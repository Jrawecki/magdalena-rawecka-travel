# Magdalena Rawecka — Independent Travel Advisor

A refined, responsive landing page designed as a quiet digital calling card for an independent high-end travel advisor.

**Live demo:** [magdalena-rawecka-travel.vercel.app](https://magdalena-rawecka-travel.vercel.app)

## Run locally

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

## WebHub pilot checks

The controlled WebHub pilot uses the local, source-backed React/Vite adapter. A normal build strips
all WebHub metadata. The dedicated gate separately creates a private local test manifest and proves
that the instrumented public output contains only opaque Project, deployment, target, and source
identifiers:

```powershell
npm ci
npm run check
npm test
npm run test:webhub-production
```

The unpublished WebHub 0.2.0 build packages are pinned under `vendor/webhub` so a clean Vercel
checkout never depends on a sibling folder. Private deployment manifests remain ignored under
`.webhub`; never commit them or an instrumentation secret.

## Contact details

Replace the clearly labelled email and phone placeholders in `src/contact.ts` before launch. The footer email, telephone, and “Begin a conversation” links all read from that file.

## Photography

The four original editorial photographs in `public/images` were generated specifically for this demo. The six `journey-*-02.jpg` and `journey-*-03.jpg` files are replaceable placeholders sourced under the [Unsplash License](https://unsplash.com/license), with photography by orva studio, Pelayo Arbués, Ian Keefe, Josh Duke, Edi Bouazza and Brock Solis.

Each journey's images, alt text and changing description live together in the `slides` array in `src/App.tsx`, making the album content straightforward to replace later.
