# Free calculator backlog

The weekly build takes the first unchecked item, builds it, and ticks it with the date and URL.
Every calculator: one static page at `/<slug>/index.html`, same structure and `assets/site.css` as the existing calculators
(header nav "Free tools" + "Store", h1, lede, `form.tool`, live result in `#out`, explanation sections, `.note` disclaimer,
`.cta` to the matching paid skill, `figure.share` with the pin image, standard footer), plain JavaScript, no libraries,
nothing sent anywhere. Never invent statistics or legal rules; when a convention varies by market, say so on the page.

## Done

- [x] 2026-10-15 Escalation clause calculator → Offer Comparison (https://payhip.com/b/sfl8H)
- [x] 2026-10-15 Weight trend calculator → Check-in Analyzer (https://payhip.com/b/7gC9P)
- [x] 2026-10-16 Comps price calculator → Pricing Brief (https://payhip.com/b/7mleY)
- [x] 2026-10-16 Price reduction calculator → Seller Update (https://payhip.com/b/UXnhj)
- [x] 2026-10-16 Progressive overload calculator → Program Progression (https://payhip.com/b/gpAwi)

- [x] 2026-10-16 Appraisal gap calculator → Offer Comparison (https://payhip.com/b/sfl8H)
- [x] 2026-10-16 MLS remarks checker → Listing Writer (https://payhip.com/b/60TYy)
- [x] 2026-10-16 Training volume calculator → Intake to Program (https://payhip.com/b/gVueK)

- [x] 2026-10-17 Client adherence calculator → Check-in Analyzer (https://payhip.com/b/7gC9P)
- [x] 2026-10-17 Months of inventory calculator → Pricing Brief (https://payhip.com/b/7mleY)

## Next (in this order)

- [ ] (empty: research the next ideas for the same two audiences, each linked to an existing paid skill)

## Rules for the weekly build

1. Build only the first unchecked item. If research shows a much better idea for the same audience and an existing paid skill, add it to this list for a later week instead of switching.
2. Test before pushing: load the page in Playwright (Chromium is preinstalled), run at least 6 input cases including edge cases (empty fields, zero, huge numbers, bad text), check the math by hand in Python, no page errors, and no horizontal scroll at 375 px width. If anything fails and can't be fixed, don't push; report it.
3. Update `index.html` (right audience section), `sitemap.xml` (new URL, today's date) and the README "Free calculators" section in Temperbyte/temperbyte-skills. Render the 1000×1500 pin image in the existing style to `assets/social/NN-slug.png`, reference it with `og:image` and `figure.share`.
4. Tick the item here with the date.
