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

## Next (in this order)

- [ ] **Appraisal gap calculator** (`/appraisal-gap-calculator/`) → Offer Comparison (https://payhip.com/b/sfl8H). Agents.
  Inputs: contract price P, appraised value A, loan-to-value L (%, from down payment), appraisal gap coverage C ($, 0 if none), optional buyer cash available.
  Math: gap G = max(0, P − A). Loan = min(P, A) × L. Cash to close before closing costs = P − loan. Planned cash if no gap = P × (1 − L).
  Extra cash because of the gap = (P − min(P,A)·L) − P(1 − L) = L × G. Covered by the clause = min(G, C); uncovered = G − covered.
  Show three outcomes side by side: buyer covers the whole gap, seller drops price to A, split down the middle; for each, price, buyer cash, seller price change.
  Explain why the extra cash is L × G (the down payment is figured on the lower appraised value, so the buyer brings the gap plus the lost down payment difference). Not lending advice; lender rules (e.g. FHA/VA) differ.

- [ ] **MLS remarks checker** (`/mls-remarks-checker/`) → Listing Writer (https://payhip.com/b/60TYy), free lite https://payhip.com/b/eT2ON. Agents.
  Textarea for remarks; character limit input (default 1000, note that limits vary by MLS); live character count (with and without spaces), word count, over/under limit.
  Flag phrases (case-insensitive, whole words) with a reason and a replacement idea, from the Listing Writer fair housing rules:
  says who the buyer should be ("perfect for families", "ideal for young professionals", "great for retirees", "empty nesters", "bachelor pad", "perfect for a couple", "adult community" unless it is a legal 55+ community the agent confirms);
  people or safety of the area ("safe neighborhood", "safe area", "exclusive", "family neighborhood", "quiet street of retirees", "integrated", "ethnic");
  rating schools ("great schools", "top-rated district", "best schools"); religious landmarks as selling points ("walk to church", "near synagogue", "near mosque");
  also flag openers "Welcome home", "Don't miss", "Look no further" as weak, not illegal.
  Say clearly it is a first-pass word check, not legal review; "family room" as a room name and plain accessibility features are fine.

- [ ] **Weekly training volume calculator** (`/training-volume-calculator/`) → Intake to Program (https://payhip.com/b/gVueK). Coaches.
  Rows: exercise name, sets per session, sessions per week, primary muscle (select), optional secondary muscle (select).
  Count: primary muscle gets every set, secondary gets half a set. Muscles: chest, back, shoulders, biceps, triceps, quads, hamstrings, glutes, calves, abs.
  Output table: weekly sets per muscle, with a reference band of about 10–20 hard sets per week for most trained lifters (say it is a common guideline, not a rule; beginners often need less).
  Flag muscles under 6 or over 25 sets, and any jump if the coach enters last block's numbers too (optional second column).

- [ ] **Client adherence calculator** (`/client-adherence-calculator/`) → Check-in Analyzer (https://payhip.com/b/7gC9P). Coaches.
  Inputs for the period: sessions planned / done, days on nutrition target / days logged, step-goal days / days, check-ins due / sent.
  Output: each as a percent and an overall average of the areas filled in. Rule from our skills: under about 75% → don't change targets or add volume; find out what got in the way. 75% or more and the trend is off for two weeks → one small change.
  Never shame wording; add the note that skipping meals to compensate or exercising far beyond the plan is a reason to talk, not to adjust.

- [ ] **Months of inventory calculator** (`/months-of-inventory-calculator/`) → Pricing Brief (https://payhip.com/b/7mleY). Agents.
  Inputs: active listings now, closed sales in the last N months, N (default 6). Months of inventory = active ÷ (sales ÷ N). Absorption rate = (sales ÷ N) ÷ active, as % per month.
  Market read: under about 4 months often called a seller's market, about 4–6 balanced, over 6 a buyer's market; say plainly that thresholds vary by area and price band.
  Optional: the same for a price band to compare.

## Rules for the weekly build

1. Build only the first unchecked item. If research shows a much better idea for the same audience and an existing paid skill, add it to this list for a later week instead of switching.
2. Test before pushing: load the page in Playwright (Chromium is preinstalled), run at least 6 input cases including edge cases (empty fields, zero, huge numbers, bad text), check the math by hand in Python, no page errors, and no horizontal scroll at 375 px width. If anything fails and can't be fixed, don't push; report it.
3. Update `index.html` (right audience section), `sitemap.xml` (new URL, today's date) and the README "Free calculators" section in Temperbyte/temperbyte-skills. Render the 1000×1500 pin image in the existing style to `assets/social/NN-slug.png`, reference it with `og:image` and `figure.share`.
4. Tick the item here with the date.
