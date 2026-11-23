# Walkies Guernsey — website

A first-draft website built by SarniaSites. Plain HTML, Tailwind CSS v3 compiled to a static
stylesheet, and one small vanilla JavaScript file. No frameworks, no CDNs, all paths relative,
so the same files work on GitHub Pages, Cloudflare Pages or the client's own domain.

## Folder layout

```
index.html              the whole site: hero, the walk, the orange band, photos, contact
thanks.html             where the enquiry form lands after sending
404.html                page-not-found, same design
assets/css/styles.css   compiled Tailwind (committed — do not edit by hand)
assets/js/main.js       menu, the lead that draws as you scroll, the walk explorer,
                        the photo lightbox, reveals and form validation
assets/fonts/           self-hosted woff2 + the OFL licence for each family
images/brand/           logo redrawn as SVG (full lockup, header band, square mark)
images/work/            the photos, each at ~1600px and ~800px in WebP
images/                 favicons, og-image.jpg, site.webmanifest
src/input.css           Tailwind source: @font-face, components, keyframes
tailwind.config.js      brand colours and fonts, with a note on where each came from
sitemap.xml robots.txt  search-engine basics
_fb-pack/               the Facebook research pack (not published — folder starts with "_")
_shots/                 screenshots for sending to the client (also not published)
```

## Brand

| Name | Hex | Where it came from | Used for |
|---|---|---|---|
| action | `#E60D03` | the red WALKIES lettering in the logo | buttons, links, the lead, the front door |
| sun | `#FD6905` | the orange band behind the logo lettering | the big orange section, the hero sun |
| sun.soft | `#F78934` | the lighter orange in the same band | the headland edge inside the orange band |
| sun.peach | `#F6D9B8` | warm highlight in the Facebook banner | the lit doorway in the footer |
| ink | `#2A1B10` | the logo's brown `#795637`, taken darker | all text and every drawn outline |
| bark | `#795637` | the logo's brown | the cottage lintel, the gate post |
| coat | `#EBC48F` | the apricot coats in the walk photos | the drawn dogs |
| cream | `#FBF4EA` | the cream "Let's go" lettering | page background |
| sand | `#DCCDB8` / `#B7A997` | the beach in the logo | rules, borders, granite |
| sky | `#CAD5E7` | the sky in the Facebook banner | the sea in the hero |
| gorse | `#5F7F33` | the headland grass in the walk photos | drawn grass and gorse |

**Fonts** (self-hosted from @fontsource, OFL licences in `assets/fonts/`):
*Anybody Variable* for headings, narrowed to `font-stretch: 70%` so it matches the tall, heavy
WALKIES lettering, and *Reddit Sans Variable* for body text, which is close to the rounded
"Let's go". The logo was **redrawn as SVG** from the same typeface — the Facebook profile picture
was only a 960px JPEG, so it could not be used on the site.

## Editing

- **Text:** everything visible is in `index.html`, except the four walk steps, which are the
  `STEPS` array near the top of section 4 in `assets/js/main.js` (title, text, what's-included
  list, photo name, and the photo's width, height and alt text). Change both the array and the
  HTML of step 1, which is written into the page so it shows before JavaScript runs.
- **Colours:** edit `tailwind.config.js`, then run `npm install` once and `npm run build`.
  Use `npm run watch` while editing.
- **A new photo:** save two WebP copies into `images/work/` (`name.webp` at about 1600px and
  `name-sm.webp` at about 800px), then copy one of the `<button class="shot">` blocks in the
  photos section and change `data-full`, `data-cap`, `src`, `srcset`, `width`, `height` and `alt`.
  The lightbox picks it up automatically.
- **The walk explorer:** the tabs are the four `<button role="tab">` elements; each step needs a
  matching entry in the `STEPS` array, in the same order.
- **The lead:** the red line is drawn in `assets/js/main.js` from the gate post in the hero to the
  hook by the front door in the footer. Each section carries `data-lead-side="left|right"`, which
  is the side the lead runs down; the two ends are the `data-lead-start` and `data-lead-end`
  markers.
- **No before/after slider:** dog walking has no before-and-after work to show, so that section
  was deliberately left out.

## Going live

- [ ] Client buys their domain in their own name (roughly £10 a year for a .com, £30–40 for a .gg)
- [ ] Help the client create a free Cloudflare account in their name; connect this repository to
      Cloudflare Pages on that account (production branch `main`, no build command, output
      directory = repository root) and add their domain to the Pages project
- [ ] Swap the GitHub Pages URL for the real domain everywhere: `canonical`, the Open Graph and
      Twitter tags, the JSON-LD `url`/`image`/`logo`, `sitemap.xml`, `robots.txt` and the form's
      `_next` field, and change the `<base href="/walkies/">` in `404.html` to `/`
- [ ] Switch the form from the studio's email to the client's, and activate FormSubmit by sending
      one test enquiry from the live site
- [ ] Confirm the phone number and email address, and get the client to sign off the wording of
      the four walk steps
- [ ] Ask the client what else they offer (home visits, puppy visits, solo walks, pet sitting),
      how many dogs go out at a time, which days and times they run, pricing, insurance and any
      qualifications — none of that is on their Facebook page, so none of it is on the site
- [ ] Optional: transfer the repository to the client's own GitHub account if they want it

### Assumptions and what was left out

- The site says only what the Facebook page supports: group dog walks around the Vale, dogs
  walked together with their friends and brought home happy and tired, and the contact details.
- The address on Facebook (Sequoia, 4 Clos Du Moulliage) looks like a home address, so it is not
  printed on the page — only "Vale, Guernsey", with the postcode in the structured data.
- There are **no reviews or recommendations** on the Facebook page, so there is no testimonials
  section. Nothing in the pack answers four real customer questions, so there is no FAQ either.
- Three posts were in the pack. Two are personal (a night out, and a present for a customer's mum)
  and were left out; the third is a set of walk photos, which is what the gallery is built from.
- Facebook follower and like counts are deliberately not shown anywhere.

Source: built from the Facebook pack in `_fb-pack/`, collected 23 November 2026. That folder and
`_shots/` start with an underscore so GitHub Pages does not publish them.
