# Launch channels — PCI Scope Lens (free distribution)

Five places where the extension and the 10-question checklist can be posted **for $0**, with no
account purchases and no ads. For each: the rules that decide whether the post survives, who is
actually reading, and the exact text to paste.

**Nothing was posted, no account was created, no message was sent.** This file is copy plus a
runbook. Every platform's rules change and are enforced by moderators, not by this document —
re-read the sidebar / guidelines on the day you post.

Product facts used in the copy (from `README.md` and `docs/`):

- Landing: `https://mortal7520.github.io/pci-scope-lens/`
- Checklist: `https://mortal7520.github.io/pci-scope-lens/checklist.html` *(confirm this path
  resolves before pasting — if it 404s, link the landing page instead)*
- Source + release: `https://github.com/mortal7520/pci-scope-lens` (v0.1.2)
- What it is: a browser extension that shows which third-party scripts, iframes and card fields a
  checkout page loads, so a small team can tell **SAQ A shape** from **SAQ D / A-EP shape** before
  filling in a questionnaire. Runs entirely in the tab: no account, no telemetry, no upload.
- What it is not: an audit, a QSA opinion, or legal advice. Say so in every post — the checklist
  page already does.

## Ranking and sequencing

| # | Channel | Effort | Ceiling | Best day | Why this order |
|---:|---|---|---|---|---|
| 1 | **Show HN** | low | high, high variance | Tue–Thu, 08:00–10:00 PT | biggest technical audience, brutal but honest feedback |
| 2 | **dev.to** article | medium | evergreen (SEO) | any | keeps working after the launch spike dies |
| 3 | **r/SaaS** (alt: r/webdev Showoff Saturday) | low | medium | weekday | founders who recognise the SAQ A pain |
| 4 | **Indie Hackers** "Show IH" | low | medium | weekday | builder audience, tolerates a story, hates a pitch |
| 5 | **Product Hunt** | medium | medium, decays in 48 h | Tue–Thu | needs a real account and a launch-day presence |

Do **not** post all five on the same day with the same text. Stagger: Show HN first (it will tell
you whether the framing works), then fix the landing copy from the comments, then the rest.

---

## 1 · Show HN

**Where:** `https://news.ycombinator.com/submit` → title prefix `Show HN:`

**Rules that matter**

- It must be **something you made** and something people can try — Show HN explicitly excludes
  landing pages, newsletters and "waitlist" links. A GitHub release with a manual install is fine;
  a page that only collects email is not.
- **No signup wall, no paywall** on the thing you link. Ours has no account at all — that is the
  strongest part of the submission.
- **Do not ask for upvotes**, anywhere, ever. Do not ask friends to upvote. HN detects voting rings.
- **Be present in the thread.** The first two hours decide the post; reply to every substantive
  comment, especially the critical ones.
- One submission; do not repost within hours. If it dies, the accepted practice is to try again much
  later with a materially different title — not to spam.
- Disclose that you built it, in the title or the first line.

**Audience:** engineers, founders, and a large contingent of security people who will immediately
ask "how is this different from just reading the page source?" — which is the correct question, and
the answer is the whole product.

**Exact post**

> Title: `Show HN: PCI Scope Lens – see which checkout scripts put you in PCI scope`
>
> First comment (post it yourself right after submitting):
>
> I built a browser extension that looks at a checkout page and tells you what it actually loads:
> third-party payment iframes, script tags, and card input fields.
>
> The reason: for a small SaaS or Shopify store, the difference between "SAQ A" (card data never
> touches your servers) and "SAQ D / A-EP" (it might) is usually decided by what those scripts do,
> not by what the founder believes. The questionnaire asks you to know. Most people guess.
>
> What it does:
> - highlights payment iframes and note whether card fields sit inside them
> - lists third-party origins the checkout pulls in
> - flags card-number / CVV / expiry inputs found directly on the page
> - verdict: SAQ A likely / SAQ D or A-EP likely / inconclusive
>
> What it does not do: no network requests, no storage, no telemetry — everything runs in the tab.
> It is not an audit and not legal advice; it is a way to see the page before you fill in a form.
>
> Install: GitHub release (manual load, unpacked, v0.1.2):
> https://github.com/mortal7520/pci-scope-lens/releases/tag/v0.1.2
> Source: https://github.com/mortal7520/pci-scope-lens
>
> There is also a plain 10-question checklist if you would rather not install anything:
> https://mortal7520.github.io/pci-scope-lens/checklist.html
>
> I would especially like to hear from people who run checkouts where the verdict comes back
> "inconclusive" — that is the case I most want to get right.

**How it fails:** title reads like marketing; linking only the landing page; not replying for an
hour; arguing with the first critic.

---

## 2 · dev.to article

**Where:** `https://dev.to/new` (free account, markdown)

**Rules that matter**

- Disclose affiliation in the post ("I built this") — dev.to's guidelines require it and readers
  punish its absence.
- No duplicate-content spam: one article, not the same text cross-posted to five sites the same day.
  If you cross-post, set a **canonical URL** to your own page.
- Tags: pick 3–4 max (`#security`, `#webdev`, `#javascript`, `#privacy`). More tags does not mean
  more reach; irrelevant tags get muted.
- Links in the first paragraph can look promotional — put the tool link after the explanation.

**Audience:** working developers who will read a "how the thing works" article but bounce off a
launch post. This is the channel that keeps producing traffic in month three.

**Exact post**

> Title: `What your checkout page actually loads — and why it decides your PCI scope`
>
> Tags: `#security #webdev #javascript #privacy`
>
> Opening (paste as-is, then continue with the body you already have in `docs/`):
>
> If you take card payments through Stripe, Braintree, Adyen or Shopify Payments, your PCI
> obligations depend on one question that nobody explains clearly: **does card data ever touch your
> page, or only the provider's iframe?**
>
> Get it right and you are on SAQ A — roughly twenty questions about policies and third parties.
> Get it wrong and you are on SAQ A-EP or SAQ D — a much longer questionnaire, plus scans and
> evidence you probably do not have.
>
> The awkward part is that the answer is not in your code review. It is in what the checkout page
> loads at runtime: a script injected by an A/B testing tool can put a card field in your DOM without
> anyone on your team writing `input[name="cardnumber"]`.
>
> So I wrote a small extension that reads the page and reports what is there: payment iframes,
> third-party origins, and any card fields sitting directly on the page. It runs entirely in the
> tab — no network calls, no storage, no telemetry.
>
> [explain the three verdicts, show two screenshots, then link the release + checklist]
>
> I built it, so treat this as a tool announcement with a long explanation attached. If your checkout
> comes back "inconclusive", that is the interesting case — tell me what it loaded.

**How it fails:** posting a 300-word ad; no screenshots; tags like `#pci #compliance` that nobody
follows.

---

## 3 · r/SaaS (alternate: r/webdev Showoff Saturday)

**Where:** `https://www.reddit.com/r/SaaS/submit` — **check the sidebar first**. Many subreddits
ban self-promotion outright or restrict it to a weekly thread; r/webdev confines it to **Showoff
Saturday**. Posting a link post on a Tuesday in r/webdev is a removal.

**Rules that matter**

- Read the subreddit rules **and** the wiki before posting; the automod removes first-time
  self-promo aggressively.
- Use a **text post**, not a link post. Link posts from new accounts read as spam.
- One post per subreddit, ever, for this tool. Do not repost because it got three upvotes.
- No alt accounts to upvote or comment. Reddit's spam filter links accounts by IP and behaviour.
- Answer the "why not just view source?" question in the post pre-emptively — it is the top comment
  every time.

**Audience:** SaaS founders and solo operators, many of whom have received a PCI questionnaire from
a processor and have no idea what to do with it. Lower technical depth than HN, higher intent.

**Exact post**

> Title: `I got tired of guessing whether my checkout was SAQ A or SAQ D, so I built a free extension that shows what the page loads`
>
> Body:
>
> Context: we take payments through a hosted checkout, and every year the processor sends the PCI
> self-assessment questionnaire. The first question is basically "does card data ever touch your
> servers?" and I realised I did not actually know — I knew what I *believed*.
>
> So I built a small browser extension that reads the checkout page and reports:
>
> - payment provider iframes it finds (Stripe, Braintree, Adyen, Shopify, etc.)
> - third-party scripts and origins the page pulls in
> - any card number / CVV / expiry fields that sit **directly on the page** rather than inside a
>   provider iframe
>
> It gives one of three verdicts: SAQ A likely, SAQ D / A-EP likely, or inconclusive. Everything runs
> locally — no account, no telemetry, no network requests. It is not an audit and not legal advice;
> it is a way to see your own page clearly before you answer a questionnaire.
>
> Free, source on GitHub: https://github.com/mortal7520/pci-scope-lens
> There is a plain 10-question checklist too, if you do not want to install anything:
> https://mortal7520.github.io/pci-scope-lens/checklist.html
>
> Curious whether other people here have been through the SAQ A form and what actually tripped them
> up — the evidence part or the wording?

**How it fails:** link post; posting in a subreddit whose rules forbid it; no engagement in the
comments; posting from a brand-new account with no history.

---

## 4 · Indie Hackers — "Show IH"

**Where:** `https://www.indiehackers.com/` → new post, group **Show IH** (or "Products")

**Rules that matter**

- Show IH exists for exactly this; still, IH rewards **numbers and lessons**, not feature lists.
- No pure link drop: the post must stand alone as a story, with the link at the end.
- Disclose that it is your product.
- Respond to comments; IH regulars remember who never replies.

**Audience:** indie founders and solo builders. Many run Shopify apps or small SaaS where a
processor's questionnaire lands on the founder personally.

**Exact post**

> Title: `Show IH: a free extension that tells you whether your checkout is PCI SAQ A or SAQ D`
>
> Body:
>
> Small thing I shipped while working on a bigger one.
>
> The bigger one is a prep tool for the PCI SAQ A questionnaire — the 30-page PDF a processor sends
> once a year. Before building any of it I kept hitting the same wall: teams do not know which
> questionnaire applies to them, because that depends on whether card data ever touches their page.
>
> So the first artefact is deliberately small and free: a browser extension that reads the current
> checkout page and says what it loads — provider iframes, third-party scripts, and any card fields
> sitting directly on the page. Verdicts: SAQ A likely / SAQ D or A-EP likely / inconclusive.
>
> No account, no telemetry, no network calls. Runs in the tab. Not an audit, not legal advice.
>
> - Source + release: https://github.com/mortal7520/pci-scope-lens
> - 10-question checklist (no install): https://mortal7520.github.io/pci-scope-lens/checklist.html
>
> What I am trying to learn: whether "which SAQ am I" is a real blocker for people here, or whether
> everyone just forwards the PDF to their accountant. If it is the latter, I would rather find out now.

**How it fails:** posting it as a "launch" with no question at the end; no metrics or motivation;
linking the store listing instead of the source.

---

## 5 · Product Hunt

**Where:** `https://www.producthunt.com/posts/new` (free account; a launch needs a maker profile)

**Rules that matter**

- One launch per product. You cannot relaunch the same thing next month.
- **No vote rings, no "please upvote" DMs** — PH penalises coordinated voting and will bury the post.
- The maker's **first comment** carries most of the conversion; write it as the story, not the spec.
- Link must go to something usable at launch time — our manual-install release qualifies, but say
  "manual install, two steps" so nobody bounces at a missing store listing.
- Timing: launch 00:01 PT and be awake for the first 8 hours.

**Audience:** early adopters and other makers; less technical than HN, more willing to try a small
tool, weak at compliance depth. Expect traffic, not customers.

**Exact post**

> Name: `PCI Scope Lens`
> Tagline (≤60 chars): `See what your checkout loads before you fill in a PCI form`
> Topics: `Developer Tools`, `Security`, `Privacy`, `Chrome Extensions`
>
> Description:
>
> PCI Scope Lens shows you what your checkout page actually loads — payment provider iframes,
> third-party scripts, and card fields sitting directly in the DOM — then tells you which PCI
> self-assessment shape you are closest to: SAQ A, SAQ D / A-EP, or inconclusive.
>
> Built for small SaaS and Shopify teams who get a 30-page questionnaire once a year and have no
> idea whether it applies to them. Runs entirely in the browser: no account, no telemetry, no
> network requests. Free, source on GitHub.
>
> Not an audit and not legal advice — a way to see your own page before answering a form.
>
> First comment (maker):
>
> I built this after a very ordinary experience: my processor sent the PCI self-assessment and the
> first question assumed I knew whether card data ever touches my servers. I did not know. I knew
> what I believed, which is not the same thing.
>
> The extension answers that one question from the page itself. It is deliberately small and
> deliberately local — there is no backend, because a tool that reads your checkout has no business
> phoning home.
>
> Two things I would love feedback on: (1) the "inconclusive" verdict — if you get it, tell me what
> your checkout loaded; (2) whether the checklist is useful without the extension:
> https://mortal7520.github.io/pci-scope-lens/checklist.html

**How it fails:** asking for upvotes; launching before the install path is verified on a clean
machine; a tagline that says "compliance" (PH readers read that as enterprise).

---

## Appendix — three more free channels worth one hour each

| Channel | What to do | Why it is worth it |
|---|---|---|
| **GitHub awesome-lists** | PR a line into a relevant `awesome-*` list (browser extensions, privacy tools, dev tools). Follow each list's CONTRIBUTING format exactly. | permanent, high-intent traffic; a merged PR is a citation nobody can downvote |
| **Peerlist / Uneed / MicroLaunch** | free product listings, no card | small but compounding; useful backlinks for the checklist page |
| **Shopify community / partner forums** | answer a real "PCI questionnaire" thread with the checklist, mention the extension only if asked | the audience is exactly the ICP; self-promo rules are strict, so lead with the answer |

## Guardrails for all five

1. **One identity, one post per channel.** No alts, no vote requests, no "my friend made this".
2. **Same product, different text.** Copy-pasting one paragraph everywhere is the fastest way to get
   flagged on all five.
3. **Lead with the answer, not the tool.** Every channel's audience has the same question ("which
   SAQ am I?"); answer it in the post, then offer the tool.
4. **Never claim compliance.** Say "not an audit, not legal advice" every time — this is the one
   claim that could turn a helpful post into a liability.
5. **Measure what matters:** release downloads (GitHub), checklist page visits, and replies that
   describe a real SAQ experience. Upvotes are not the metric; conversations are.
