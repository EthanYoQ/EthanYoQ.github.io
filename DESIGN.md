# EthanYoQ Portfolio Design System

This document keeps the personal portfolio visually consistent across future edits. It adapts the design-system method used by [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and takes directional inspiration from [Framer](https://www.framer.com/). It is not a Framer clone.

## Product intent

- Present Ethan as an independent AI practitioner and maker, not as a directory of GitHub links.
- Explain four working products through real interface proof, concise positioning, and direct project/source links.
- Convert Chinese visitors into a WeChat Official Account audience without publishing personal contact details.
- Give international visitors the same portfolio in English, replacing the WeChat module with `sdyong.qi@gmail.com`.

## Visual theme

- Atmosphere: cinematic, technical, calm, and credible.
- Canvas: uninterrupted near-black. Light surfaces appear only inside real product screenshots.
- Composition: oversized editorial copy paired with layered product media, alternating left and right by project.
- Color: monochrome hierarchy with one electric-blue signal color.
- Proof over decoration: every prominent image must be a real product icon, interface screenshot, or demo recording.

## Tokens

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `#050505` | Page, header, footer |
| Surface 1 | `#0a0b0d` | Navigation and compact cards |
| Surface 2 | `#101216` | Lifted media surfaces |
| Primary text | `#f4f7fb` | Display and emphasized copy |
| Muted text | `#9ba3b0` | Supporting copy |
| Hairline | `#232831` | Dividers and card boundaries |
| Signal blue | `#176bff` | Primary CTA, focus, active progress |
| Signal blue bright | `#3d86ff` | Small labels and active text |

Radius scale: `9px` product icons, `13–14px` media frames, `14px` index/principle groups, `999px` CTA pills.

## Typography

- Display: Inter/system sans, heavy optical weight, very tight tracking (`-5%` to `-6.5%`), compact line height (`1.02–1.08`).
- Body: Inter/system sans, regular weight, comfortable Chinese line height.
- Eyebrows: 11–12px, uppercase English, blue, widely tracked.
- Hierarchy comes from size, spacing, and white/muted contrast; avoid adding extra colors or many font weights.
- Chinese copy must sound natural and explain a product outcome. Do not use abstract slogans that could describe any AI tool.

## Layout

- Desktop content width: about `1180px`.
- Hero: personal statement and contact conversion on the left; layered real interface and demo video on the right.
- Product index: four equal cells using the official icon and a plain-language product name.
- Project sequence: text/media, media/text, text/media, media/text. Do not change this alternating rhythm without a new approved design.
- Long-page progress: a quiet vertical index on wide screens only.
- The bottom section reinforces making principles and points to the complete GitHub portfolio; it does not repeat the QR code.

## Components

### Buttons

- Text CTAs are pills with a minimum 44px touch height.
- Primary: signal-blue fill, white text, reserved for the main conversion action.
- Secondary: near-black or transparent fill, hairline border, white text.
- Hover may lift by 2px; focus must use a visible blue outline.

### Product media

- Use one larger interface layer and one foreground proof layer.
- Videos are native `<video>` elements with controls, muted autoplay when visible, pause when out of view, and real screenshot posters.
- Do not draw fake browser chrome, play icons, product screens, or logos in CSS/SVG.
- Current proof inventory: real recordings for AI Novel Writer, AI Xiaohongshu Workbench, and InvoiceFlowAI. Whisper Input uses a current real screenshot until a new-version recording exists and must be labeled honestly.

### Contact conversion

- Chinese: show only the cropped WeChat Official Account QR code with “新作品发布公众号 / 和作者交流 & 提建议”.
- English: preserve the same module footprint and show `sdyong.qi@gmail.com`; hide the QR code.
- The QR code appears once, in the hero.

## Motion

- Reveal sections once as they enter the viewport.
- Autoplay only the visible muted demo; pause the rest.
- Allow a very small vertical parallax on large screens.
- Motion must never delay access to content and must be removed under `prefers-reduced-motion`.

## Responsive behavior

- At `1040px`, hero and project sections become one column; two-column utility grids may remain.
- At `700px`, navigation keeps brand and language only, all project/index grids become one column, and 3D media transforms are disabled.
- Preserve source aspect ratios, avoid horizontal scrolling, and keep interactive controls at least 44px tall.
- Longer English strings must wrap without changing content order or hiding product proof.

## Do

- Keep the near-black canvas and tight, poster-like headings.
- Use blue sparingly for action, focus, progress, and selected state.
- Use official icons from each product repository.
- Use real product UI and real recordings.
- Keep project copy concrete: problem, workflow, outcome, and boundary.

## Do not

- Do not reproduce Framer section-for-section or copy its brand assets.
- Do not replace the confirmed alternating layout with a generic card grid.
- Do not use gradients, decorative blobs, fake UI, handwritten SVG paths, emoji, or text symbols as icons.
- Do not claim a demo exists when only a screenshot is available.
- Do not expose a private phone number or personal messaging account.
