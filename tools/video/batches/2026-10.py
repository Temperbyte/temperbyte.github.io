# Reels batch 1 for automatic posting, 24.10.–12.11.2026. Numbers in captions are the calculators'
# example values; make_reels.py checks each one against the live page before rendering.
START = "2026-10-24"

END_CALC = ("card", "Free calculator.", "temperbyte.github.io · link in bio", 2.8, False)
END_SKILL = ("card", "Free Claude skill.", "Lite version free · link in bio", 2.8, False)
RE_TAGS = "#realestateagent #realtor #realestatetips #listingagent #realestatemarketing"
FIT_TAGS = "#personaltrainer #onlinecoach #fitnesscoach #strengthtraining #coachingbusiness"


def cap(lines, tags, cta="Free calculator: temperbyte.github.io (link in bio)."):
    return "\n\n".join(lines + [cta, tags])


REELS = [
    {"id": "r01-escalation-highest-offer", "scenes": [
        ("card", "The highest offer isn't always the best one.", "3 offers, 1 escalation clause.", 2.6, True),
        ("page", "/escalation-clause-calculator/", None, "Offer A: $472k, but asks $8k in credits", "#f", 95, 3.4, r"Offer A"),
        ("page", "/escalation-clause-calculator/", None, "Offer C escalates from $455k to $474k", "#out", 95, 3.6, r"Offer C escalates from \$455,000 to \$474,000"),
        ("page", "/escalation-clause-calculator/", None, "Best net for the seller: Offer C, $233,100", "#out", 95, 3.4, r"Highest net: Offer C, \$233,100"),
        END_CALC],
     "caption": cap(["The highest price on paper isn't always the best offer.",
                     "Offer A says $472,000 but asks for $8,000 in credits. Offer C starts at $455,000 and escalates to $474,000. Net to the seller decides.",
                     "Every offer's final price after escalation and the seller's net, with the math shown."], RE_TAGS)},

    {"id": "r02-weight-diet-stopped", "scenes": [
        ("card", "“The diet stopped working.”", "Your client, after one heavy morning.", 2.6, True),
        ("page", "/weight-trend-calculator/", None, "3 weeks of daily weigh-ins: they jump around", "#out", 60, 3.6, r"Trend"),
        ("page", "/weight-trend-calculator/", None, "Weekly averages: down 0.67 kg every week", "#out table", 120, 3.6, r"0\.67 kg per week"),
        ("page", "/weight-trend-calculator/", None, "Up to 1.3 kg of day-to-day noise. Judge the week.", "#out table", 120, 3.4, r"1\.3 kg"),
        END_CALC],
     "caption": cap(["One heavy weigh-in is not a stalled diet.",
                     "Daily weight moves with water, salt and sleep. Weekly averages show the real trend: here, down about 0.67 kg a week, week after week.",
                     "Paste the weigh-ins, get weekly averages, the rate per week and a 7-day trend line."], FIT_TAGS)},

    {"id": "r03-seller-net", "scenes": [
        ("card", "Your seller hears $450,000.", "They walk away with $154,400.", 2.6, True),
        ("page", "/seller-net-sheet-calculator/", None, "Sale price, payoff, commission, closing costs, credit", "#f", 95, 3.6, r"\$154,400"),
        ("page", "/seller-net-sheet-calculator/", None, "Every cost on its own line", "#out", 95, 3.8, r"Estimated net to the seller: \$154,400"),
        ("page", "/seller-net-sheet-calculator/", None, "Selling costs: $33,600, 7.5% of the price", "#out p.note", 430, 3.4, r"\$33,600, or 7\.5%"),
        END_CALC],
     "caption": cap(["Sellers think in list price. They decide on net.",
                     "$450,000 sale, $262,000 payoff, commission, transfer tax, title, taxes and a $5,000 credit: about $154,400 to the seller.",
                     "A free seller net sheet with every line shown, so you can walk the seller through it."], RE_TAGS)},

    {"id": "r04-rpe-estimate-max", "scenes": [
        ("card", "100 kg × 5 at RPE 8.", "What's their max, without testing it?", 2.6, True),
        ("page", "/rpe-calculator/", None, "RPE 8 = about 2 reps left in the tank", "#f", 95, 3.4, r"123\.3 kg"),
        ("page", "/rpe-calculator/", None, "Estimated 1RM: 123.3 kg", "#out", 95, 3.6, r"Estimated 1RM: 123\.3 kg"),
        ("page", "/rpe-calculator/", None, "Working weights for every rep and RPE", "#out h3", 95, 3.6, r"RPE 10"),
        END_CALC],
     "caption": cap(["You don't need a max test to program with percentages.",
                     "A set of 5 at RPE 8 is about a 7-rep max, roughly 81% of 1RM. 100 kg × 5 @8 → about 123 kg estimated max.",
                     "The RPE calculator gives the working weight for any reps and RPE, rounded to your plates."], FIT_TAGS)},

    {"id": "r05-appraisal-gap", "scenes": [
        ("card", "The appraisal came in $15,000 low.", "Now what?", 2.6, True),
        ("page", "/appraisal-gap-calculator/", None, "$500k contract, $485k appraisal", "#f", 95, 3.4, r"\$15,000"),
        ("page", "/appraisal-gap-calculator/", None, "4 ways to close the gap, side by side", "#out", 95, 3.8, r"Split the difference"),
        ("page", "/appraisal-gap-calculator/", None, "Buyer covers it all: $12,000 more cash", "#out table", 95, 3.4, r"\$12,000"),
        END_CALC],
     "caption": cap(["Low appraisal? Put the options side by side before anyone gets emotional.",
                     "Gap coverage clause, buyer covers it, seller drops to the appraisal, or split the difference: final price, buyer cash and the seller's change for each.",
                     "Lenders and loan programs vary, so confirm the loan math with the lender."], RE_TAGS)},

    {"id": "r06-progressive-overload", "scenes": [
        ("card", "60 kg × 10, 9, 8.", "Add weight or add reps?", 2.6, True),
        ("page", "/progressive-overload-calculator/", None, "Last session's sets in", "#f", 95, 3.4, r"Keep 60 kg"),
        ("page", "/progressive-overload-calculator/", None, "Keep 60 kg. One more rep on sets 2 and 3.", "#out", 95, 3.8, r"Keep 60 kg, add reps"),
        ("page", "/progressive-overload-calculator/", None, "Every set hits 10? Then add weight.", "#out", 95, 3.4, r"when every set hits 10, add weight"),
        END_CALC],
     "caption": cap(["Double progression, done for you.",
                     "Reps first, weight second: when every set hits the top of the range, the load goes up. Load jumps stay around 5%.",
                     "Last session in, next session's targets out."], FIT_TAGS)},

    {"id": "r07-listing-writer", "scenes": [
        ("card", "Rough notes → MLS remarks.", "In about 30 seconds.", 2.6, True),
        ("panel", "Paste your rough property notes", None, 3.4),
        ("panel", "Get remarks and a headline", None, 3.8),
        ("panel", "Fair housing risks flagged and rewritten", None, 4.2),
        END_SKILL],
     "caption": cap(["From messy notes to MLS-ready remarks, with a fair housing check built in.",
                     "“Perfect for young families”, “safe neighborhood”, “great schools” get flagged and rewritten into facts you can verify.",
                     "Listing Writer is a Claude skill. The lite version is free."], RE_TAGS,
                    cta="Free lite version: link in bio.")},

    {"id": "r08-training-volume", "scenes": [
        ("card", "How many sets is your client really doing?", "Per muscle, per week.", 2.6, True),
        ("page", "/training-volume-calculator/", None, "Paste the program", "#f", 95, 3.4, r"57 working sets"),
        ("page", "/training-volume-calculator/", None, "57 sets a week. Back: 12, above the range.", "#out", 95, 3.8, r"Back"),
        ("page", "/training-volume-calculator/", None, "Abs: 4 sets, below 6–10", "#out tbody tr:last-child", 330, 3.4, r"Below the 6–10 range: Abs"),
        END_CALC],
     "caption": cap(["Compound lifts count for more than one muscle. Most program spreadsheets miss that.",
                     "Rows hit back and biceps, presses hit triceps. Here: 57 working sets a week, back above the range, abs below it.",
                     "Weekly hard sets per muscle, compared with common ranges."], FIT_TAGS)},

    {"id": "r09-mls-phrases", "scenes": [
        ("card", "4 phrases in this listing", "could cause fair housing trouble.", 2.6, True),
        ("page", "/mls-remarks-checker/", None, "Paste your MLS remarks", "#f", 95, 3.4, r"4 phrases to rewrite"),
        ("page", "/mls-remarks-checker/", None, "“perfect for families”, “safe”, “great schools”…", "#out", 95, 4.0, r"perfect for families"),
        ("page", "/mls-remarks-checker/", None, "Each one with what to write instead", "#out", 40, 3.4, r"Write the features"),
        END_CALC],
     "caption": cap(["Would your listing pass a fair housing check?",
                     "Phrases about who should live there, how safe it is or how good the schools are can get flagged. Write the features instead: “3 bedrooms on one level”, “0.4 miles to Cedar Park”.",
                     "Character count against your MLS limit included. Not legal advice."], RE_TAGS)},

    {"id": "r10-client-adherence", "scenes": [
        ("card", "Client not losing weight?", "Check adherence before you cut calories.", 2.6, True),
        ("page", "/client-adherence-calculator/", None, "Planned vs. done, 4 weeks", "#f", 95, 3.4, r"81% adherence"),
        ("page", "/client-adherence-calculator/", None, "81% overall. Steps only 64%.", "#out", 95, 3.6, r"64%"),
        ("page", "/client-adherence-calculator/", None, "Ask about steps first", "#out", 95, 3.4, r"Below 75%: step goal"),
        END_CALC],
     "caption": cap(["Before you change the plan, check whether the plan was done.",
                     "Sessions, nutrition, steps and check-ins: planned vs. done. Anything under 75% is the first thing to ask about.",
                     "Hold, keep going, or one small change."], FIT_TAGS)},

    {"id": "r11-months-inventory", "scenes": [
        ("card", "Buyer's or seller's market?", "Depends on the price band.", 2.6, True),
        ("page", "/months-of-inventory-calculator/", None, "Active listings + sales from the last 6 months", "#f", 95, 3.4, r"4\.0 months"),
        ("page", "/months-of-inventory-calculator/", None, "All price bands: 4.0 months. Balanced.", "#out", 95, 3.6, r"All price bands: 4\.0 months of inventory, balanced"),
        ("page", "/months-of-inventory-calculator/", None, "$600k+: 7.8 months. Buyer's market.", "#out", 95, 3.4, r"7\.8"),
        END_CALC],
     "caption": cap(["The same town can be balanced overall and a buyer's market above $600k.",
                     "Months of inventory = active listings ÷ sales per month. Compare two areas or price bands side by side.",
                     "Use your MLS's numbers. Thresholds vary by market."], RE_TAGS)},

    {"id": "r12-checkin-analyzer", "scenes": [
        ("card", "20 client check-ins every Monday?", "Coaches, this one's for you.", 2.6, True),
        ("panel", "Paste the client's weekly check-in", None, 3.4),
        ("panel", "Trend math and a hold or adjust call", None, 3.8),
        ("panel", "Plus red flags to act on", None, 3.6),
        END_SKILL],
     "caption": cap(["Weekly check-ins, analyzed: trend math, a hold-or-adjust decision, red flags and a reply in your voice.",
                     "The scale jumped a kilo after pizza night? The weekly average says hold.",
                     "Check-in Analyzer is a Claude skill. The lite version is free."], FIT_TAGS,
                    cta="Free lite version: link in bio.")},

    {"id": "r13-comps-price", "scenes": [
        ("card", "Pricing a listing from 5 comps?", "One of them doesn't belong.", 2.6, True),
        ("page", "/comps-price-calculator/", None, "Paste the comps", "#f", 95, 3.4, r"\$443,000"),
        ("page", "/comps-price-calculator/", None, "Suggested range: $443k to $458k", "#out", 95, 3.6, r"Suggested list range: \$443,000 to \$458,000"),
        ("page", "/comps-price-calculator/", None, "$187/sq ft comp: left out as an outlier", "#out table", 95, 3.6, r"left out"),
        END_CALC],
     "caption": cap(["Price per square foot, outliers flagged, a list range with the math shown.",
                     "One comp at $187 per sq ft sat 94 days and sold at 89% of list. It's left out, and the page says why.",
                     "Arithmetic on your comps, not an appraisal."], RE_TAGS)},

    {"id": "r14-client-capacity", "scenes": [
        ("card", "18 clients. 15 hours a week.", "Can you take one more?", 2.6, True),
        ("page", "/client-capacity-calculator/", None, "Your hours and the minutes each client takes", "#f", 95, 3.4, r"17 clients"),
        ("page", "/client-capacity-calculator/", None, "You can coach about 17. You're at 101%.", "#out", 95, 3.6, r"101%"),
        ("page", "/client-capacity-calculator/", None, "10-minute check-ins: room for 25", "#out h3", 95, 3.6, r"10 min"),
        END_CALC],
     "caption": cap(["Most online coaches never do this math.",
                     "Check-ins, messages and program updates per client, against the hours you actually have. Faster check-ins are what let you grow without longer weeks.",
                     "Your hours in, your real capacity out."], FIT_TAGS)},

    {"id": "r15-price-reduction", "scenes": [
        ("card", "38 days. Showings 7 → 4 → 2.", "Time to talk price?", 2.6, True),
        ("page", "/price-reduction-calculator/", None, "Days on market, showings, feedback", "#f", 95, 3.4, r"Time to discuss price: yes"),
        ("page", "/price-reduction-calculator/", None, "Signal: yes, discuss price", "#out", 95, 3.6, r"Time to discuss price: yes"),
        ("page", "/price-reduction-calculator/", None, "$499,900 reaches buyers searching up to $500k", "#out table", 95, 3.6, r"\$499,900"),
        END_CALC],
     "caption": cap(["Price conversations go better with numbers than with feelings.",
                     "Falling showings, price feedback and days on market vs. your area's typical. Then the search bracket math: which buyers a new price would reach.",
                     "Prepare fresh comps before naming a new price."], RE_TAGS)},

    {"id": "r16-rpe-scale", "scenes": [
        ("card", "RPE 10 = no reps left.", "RPE 9 = one left. RPE 8 = two.", 3.0, True),
        ("page", "/rpe-calculator/", None, "Pick reps and RPE for next session", "#f", 95, 3.4, r"Load 107\.5 kg for 3 reps at RPE 8\.5"),
        ("page", "/rpe-calculator/", None, "Load 107.5 kg for 3 reps at RPE 8.5", "#out", 95, 3.6, r"Load 107\.5 kg"),
        ("page", "/rpe-calculator/", None, "Rounded down to your plates", "#out", 95, 3.0, r"rounded down"),
        END_CALC],
     "caption": cap(["RPE is reps in reserve. RPE 8 means about two more reps were possible.",
                     "Enter a set your client just did and the target for next session: the calculator gives the load, rounded to your plates (kg or lb).",
                     "A starting point, not a rule: let the first set's RPE adjust the rest."], FIT_TAGS)},

    {"id": "r17-net-at-other-prices", "scenes": [
        ("card", "$11,000 off the price", "isn't $11,000 less for the seller.", 2.6, True),
        ("page", "/seller-net-sheet-calculator/", None, "Estimated net: $154,400", "#out", 95, 3.4, r"\$154,400"),
        ("page", "/seller-net-sheet-calculator/", None, "At $439,000 the net drops $10,406", "#out h3", 95, 3.8, r"-\$10,406"),
        ("page", "/seller-net-sheet-calculator/", None, "Percent-based costs fall with the price", "#out h3", 95, 3.2, r"Percent-based costs move with the price"),
        END_CALC],
     "caption": cap(["Show sellers the net at a few prices, not just one.",
                     "Commission and transfer tax move with the price, so a $11,000 lower price costs this seller about $10,400.",
                     "Free net sheet with a price scenario table."], RE_TAGS)},

    {"id": "r18-weight-noise", "scenes": [
        ("card", "1.3 kg up in one week?", "Probably water, not fat.", 2.6, True),
        ("page", "/weight-trend-calculator/", None, "Daily dots vs. the 7-day average", "#out", 60, 3.8, r"7-day rolling average"),
        ("page", "/weight-trend-calculator/", None, "The average keeps going down", "#out table", 120, 3.4, r"−0\.67 kg"),
        END_CALC],
     "caption": cap(["Daily weigh-ins are noisy. Salt, carbs, sleep and stress all move the scale.",
                     "The 7-day average filters the noise. Compare weeks, not mornings.",
                     "For coaches and clients."], FIT_TAGS)},

    {"id": "r19-appraisal-buyer-cash", "scenes": [
        ("card", "Should the buyer cover the appraisal gap?", "Check the cash first.", 2.6, True),
        ("page", "/appraisal-gap-calculator/", None, "Buyer covers all: $112,000 cash, over budget", "#out table", 95, 3.8, r"\$112,000 \(over budget\)"),
        ("page", "/appraisal-gap-calculator/", None, "Split the difference: $104,500", "#out table", 95, 3.4, r"\$104,500"),
        END_CALC],
     "caption": cap(["The loan follows the lower of price and appraisal, so every dollar of the gap is buyer cash.",
                     "$15,000 gap at 80% financing: covering it all takes the buyer to $112,000, over a $110,000 budget. Splitting it keeps them under.",
                     "Confirm loan details with the lender."], RE_TAGS)},

    {"id": "r20-capacity-income", "scenes": [
        ("card", "Want more coaching income", "without longer weeks?", 2.6, True),
        ("page", "/client-capacity-calculator/", None, "25-minute check-ins: 17 clients max", "#out h3", 95, 3.6, r"25 min \(now\)"),
        ("page", "/client-capacity-calculator/", None, "10-minute check-ins: 25 clients, $3,750 a month", "#out h3", 95, 3.8, r"\$3,750"),
        END_CALC],
     "caption": cap(["Check-in time is the biggest lever in an online coaching business.",
                     "Same 15 hours: at 25 minutes per check-in you fit 17 clients; at 10 minutes, 25. At $150 a month that's $2,550 vs. $3,750.",
                     "Example numbers. Plug in your own."], FIT_TAGS)},
]

# Panels for the skill demos come from base.py (same content as the first TikTok batch).
import base as _b  # noqa: E402
for r in REELS:
    if r["id"] == "r07-listing-writer":
        r["scenes"][1:4] = [("panel", "Paste your rough property notes", _b.LW_IN, 3.4),
                            ("panel", "Get MLS-ready remarks and a headline", _b.LW_OUT, 3.8),
                            ("panel", "Fair housing risks flagged and rewritten", _b.LW_FH, 4.2)]
    if r["id"] == "r12-checkin-analyzer":
        r["scenes"][1:4] = [("panel", "Paste the client's weekly check-in", _b.CA_IN, 3.4),
                            ("panel", "Trend math and a hold or adjust call", _b.CA_OUT, 3.8),
                            ("panel", "Plus red flags to act on", _b.CA_FLAGS, 3.6)]
