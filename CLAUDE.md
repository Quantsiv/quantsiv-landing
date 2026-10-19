# quantsiv-landing

The public marketing site for Quantsiv: static HTML, CSS and JavaScript, served by GitHub Pages.

**Everything in this repository is public**: every file, every branch and every commit message.
Pages publishes the branch it is configured to serve, normally the default branch, within minutes.
Write as if a customer, a competitor and a regulator are all reading it.

## What this repository is

- One page, `index.html`, and a privacy notice, `privacy.html`, with `style.css`, `script.js`,
  `noscript.css` and `assets/`. No build step, no framework, no package manager. `.nojekyll` must
  stay. `404.html` uses root-absolute paths because Pages serves it at any address. `robots.txt` and
  `sitemap.xml` list every page; add a page to the sitemap, with its language alternates, when you
  add one, and change a page's `lastmod` when its content changes. Internal links point at the
  address in the canonical tag (`./`, `nl/`, `../it/`), never at `index.html`, so search engines
  see one address per page. The home pages carry WebSite microdata (the site name in search
  results) and the footer Organization microdata; keep them as microdata, because the
  Content-Security-Policy allows no inline scripts. `ROADMAP.md` is the website's own roadmap
  (done and left), public like everything here.
- Dutch and Italian versions of the page and the notice are in `nl/` and `it/`. See
  "Languages" below.
- The site's address is https://quantsiv.com (`CNAME`). Use it in every link and never the
  github.io address. Pages publishes every file on the branch, this one included.
- Pre-launch. The waitlist form posts to Brevo and the page collects nothing else. Use the present tense for what the product
  does today and never for what is planned. Say "Join the waitlist", never "Get started", "Sign up",
  "Download" or "Free trial".

## Languages

- English is the default at `/`; Dutch is at `/nl/` and Italian at `/it/`. The translated pages
  mirror `index.html` line for line, so `diff index.html nl/index.html` shows only wording. Make
  every change in all three files in the same commit.
- Every page lists all languages in its `hreflang` links and in the language switcher, which is
  plain links with no script. The form's messages come from its `data-msg-*` attributes.
- A translation says what the English says and never more. The wording table below applies in
  every language: also search the translations for "volledig", "compleet", "alles", "continu",
  "garandeert", "blokkeert", "dwingt", "uniek", "enige", "autonoom", and for "completo", "tutto",
  "continuamente", "garantisce", "blocca", "impone", "unico", "autonomo".
- Keep terms of art in English: Harvest Now, Decrypt Later, Trust Now, Forge Later, Cryptographic
  Bill of Materials, CBOM, Code Scanning, pull request, high-value assets. Quotations stay in English, marked
  `lang="en"`, with a translation in brackets that keeps their strength: "should" is "zouden
  moeten" in Dutch and "dovrebbero" in Italian.
- Address the reader as "je" in Dutch and "tu" in Italian. The waitlist button says "Zet je op de
  wachtlijst" and "Entra in lista d'attesa". Write dates as "13 aug 2024" and "13 ago 2024".
- `nl/privacy.html` and `it/privacy.html` translate the privacy notice and follow the same rules
  as `privacy.html`: change all three together, only with the founder's approval, and keep the
  same "Last updated" date. GDPR terms follow the regulation's official Dutch and Italian text
  (AVG, "verwerkingsverantwoordelijke", "titolare del trattamento").

## Never put in this repository

- Product source code, configuration, infrastructure details, credentials or secrets.
- Strategy, pricing, packaging, customer or partner names, logos or numbers, fundraising,
  internal plans, audit or security findings.
- Names of, or comparisons with, other companies or products. Neutral references to standards,
  laws and public tools the page cites by name and date are fine, and so is naming a service that
  handles visitors' data in the privacy notice.
- Legal text, a privacy policy, terms or company details. The founder supplies them; never invent
  them. The one exception is `privacy.html`, published on the founder's instruction on 10 Oct
  2026 and updated with his approval on 11 Oct 2026, with its translations in `nl/` and `it/`,
  approved on 13 Oct 2026. Change them only with the founder's approval.
- Numbers that were not measured and sourced: scan times, counts, accuracy, savings, waitlist size.

If in doubt, leave it out and ask the founder.

## Where claims come from

A private product repository holds the master list of approved claims. The founder carries approved
wording into this repository. If this file and that list disagree, the list wins: stop and ask.

A session that can see both repositories should compare this file with the product repository's
CLAUDE.md and claims sheet, report the differences, and edit only this repository.

## Working rules

- Work on a branch. Never push to the default branch without the founder's approval, because
  Pages publishes it.
- UTF-8, no BOM, LF line endings.
- Commit messages are public: plain and short, no internal detail.
- Keep the page accessible: `lang` on the root element, alt text on images, heading order, visible
  keyboard focus, and the scrolling banner must respect `prefers-reduced-motion`.
- The standards banner holds two identical halves so the loop is seamless. Edit both together.

## Wording rules

Search the page for every phrase in the first column before each commit.

| Do not write | Why | Write instead |
| --- | --- | --- |
| "agentless", "autonomous", "autonomously", "auto-fix", "self-healing", "hands-free" | Agents propose, deterministic checks decide, a person approves | "Agents propose; deterministic checks verify; a person approves. Nothing merges or deploys on its own." |
| "first", "only", "unique", "leading", "world's first" | The claim cannot be proven | Say what Quantsiv does |
| "complete inventory", "every key", "everything", "exactly what is exposed", "continuously" | Pattern matching misses aliased and dynamic calls, vendored code and dependencies, and scans run on each build | "finds", "shows what is exposed", "on every build" |
| "AST-level", "type-resolved", "deep analysis" | The rules are line patterns | "pattern-based detection" |
| "enforces", "blocks", "tamper-proof", "audit-grade", "guarantees" | The change check flags and gates; it does not guarantee | "flags", "gates" |
| "one-click compliance report", "audit-ready report" | Not built | "CycloneDX CBOM, SARIF and a ranked report" |
| "your code never leaves" | Too absolute | "Scanning runs in your CI by default. Only the CBOM and finding metadata reach Quantsiv, and only if you upload." |
| "regulators require the CBOM", "mandates a central CBOM" | See the citations below: guidance and "should", not a rule for private companies | The exact wording in the citations |
| "SOC 2", "ISO 27001", "penetration tested", "certified", "FIPS validated" | Not held. On the long-term roadmap they are goals, never status | Leave out, or label as a future goal |
| "GitHub Action", "Marketplace", "plugin" | Not published | "CI templates for GitHub Actions, GitLab, Jenkins and Azure DevOps" |
| Dependency scanning; container, cloud or runtime inventory | Not built | Leave out, or label as later |
| "EU-hosted" or any hosting region | Not true until it is live | Leave out until the founder confirms |
| Any customer, logo, testimonial or quote | None to show | Leave out |
| "cryptographic posture management" | Not our category | "cryptographic change control and CBOM evidence" |
| "AI-powered", "intelligent analysis", "entire software stack", "agentic AI" outside the agent card | Finding, ranking and the change check are pattern rules and fixed checks. The one AI capability is an optional agent that drafts fixes in your build, and the scanner reads code, keys and repository files, not a whole stack | Say what it finds. The "Agentic AI analysis" card says what the agent does, in the words of "What the page may say" |
| "quantum-safe wallet", "protects your funds", "secures your crypto" | A post-quantum account depends on each chain; Quantsiv finds and ranks the code | "finds wallet and custody cryptography" |
| Names of chains, wallets, exchanges or wallet libraries | Names of other products | "wallet and custody code", "secp256k1 and Ed25519 signing keys" |
| Which keys are exposed on-chain, coins at risk, any on-chain statistic | The scanner reads code, not chains, and no figure is measured and sourced | Leave out |

Quantum risk, said correctly: harvest-now-decrypt-later threatens encryption and key
establishment. For signatures the risk is future forgery, not retroactive decryption. Never write
"everything protected by RSA or ECC becomes readable" without that distinction. For a crypto-asset
wallet whose public key is already on-chain, that forgery means its funds can be moved: still
forgery, never decryption.

## Authorities and dates

Cite the authority and the date every time, in both US and EU terms. Quote exactly; do not round
or merge. If a date or a quotation will be published, the founder confirms it against the primary
document first.

| Authority | What it says |
| --- | --- |
| NIST FIPS 203, 204, 205 | Published 13 Aug 2024: ML-KEM, ML-DSA and SLH-DSA |
| NIST IR 8547, initial public draft, Nov 2024 | 112-bit-strength RSA, ECC and DH, such as RSA-2048, are deprecated after 2030. All quantum-vulnerable public-key algorithms, including P-256, are disallowed after 2035 |
| Executive Order 14412, 22 Jun 2026 | Post-quantum key establishment on high-value assets and high-impact systems by 31 Dec 2030, and signatures by 31 Dec 2031. Within 180 days, about 19 Dec 2026, the FAR Council proposes a rule requiring covered contractors to comply by 31 Dec 2030 with NIST's FIPS, including those incorporating post-quantum algorithms (Sec. 6(c); 91 FR 38483, 25 Jun 2026). CISA, in coordination with NIST, publishes guidance on CBOM minimum elements within 270 days, about Mar 2027 |
| OMB M-26-15, 24 Jun 2026 | Five phases from 2026 to 2035. Agency plans due 22 Oct 2026. An automated inventory whose data "should populate a central Cryptographic Bill of Materials" |
| EU NIS Cooperation Group roadmap, 23 Jun 2025, a recommendation | National strategies by end-2026, high-risk use cases by end-2030, as many systems as feasible by 2035 |
| NSA CNSA 2.0 | Exclusive-use dates between 2030 and 2033, depending on the category. Verify against the current NSA advisory before quoting a single year |

## What the page may say

Every line below is backed by working product code. Use these statements, or shorter versions of
them. Do not add to them without the founder.

- Finds quantum-vulnerable public-key cryptography in source with pattern rules for Python,
  JavaScript and TypeScript, Go, Java and Kotlin, C#, Rust, Ruby, PHP, C and C++, Objective-C,
  Swift and Dart, plus openssl, ssh-keygen and keytool commands in CI and shell scripts.
- Reads keys and certificates in PEM and SSH formats for algorithm and key size. It keeps the
  header line only, never key material.
- Probes the TLS endpoints you name with one handshake. The hosted service probes only domains
  you prove you own with a DNS record. It is a probe, not a full TLS assessment.
- Reads key and TLS settings in Terraform, Kubernetes and CloudFormation files, web-server and
  proxy configuration, and OpenSSL and OpenSSH configuration, and flags a change that adds a
  vulnerable setting. It reads files in the repository, not a cloud account: never write "scans
  your cloud" or "all your configuration". Added with the founder's approval on 17 Oct 2026.
- Writes a CycloneDX 1.6 CBOM that passes the schema's strict validation, plus SARIF and a
  ranked report. Accepts any schema-valid CycloneDX 1.6 CBOM from any producer, and exports the
  latest default-branch CBOM of every repository as one document.
- Ranks encryption and key exchange by how long the data must stay confidential, which you
  declare. Ranks signatures on their own track by how long they must stay trusted, which you
  can declare, against the signature deadline; without it, by the kind of key. Approved by the
  founder on 18 Oct 2026 with the line "Two quantum threats, two clocks. Quantsiv ranks your
  cryptography against both, on every build."
- Compares each build with the latest default-branch build and flags cryptography the change
  adds. Policy can be set per data class. Exceptions record a named approver and an expiry.
  Results go to Code Scanning as SARIF and, with the GitHub Actions template, to the pull request
  as a comment.
- Runs in your CI by default, offline, as a container with templates for GitHub Actions, GitLab,
  Jenkins and Azure DevOps. Only the CBOM and finding metadata reach Quantsiv, and only if you
  upload.
- A read-only MCP server lets an AI coding assistant ask your policy and declared lifetimes
  before it writes cryptography. The same check runs at the gate. It has no write tools and no
  model of ours in it.
- Each finding says where the use is clear which standard to move to: ML-KEM (FIPS 203), ML-DSA
  (FIPS 204) or SLH-DSA (FIPS 205), with hybrid key exchange during the transition.
- An AI agent reads each finding in context and drafts a fix. Quantsiv's checks (the change is
  scanned again, the finding is gone, nothing quantum-vulnerable is added, the policy passes) and
  your tests, if you set them, must pass the draft; a rejected draft is revised, and only fixes
  that pass are shown. It is an optional step in your build, off unless you turn it on, on a model
  you choose. It never commits or pushes. Nothing merges without a person's approval. Quote no
  pass rate (none is measured) and name no model vendor. Learning from approved changes is not
  built: roadmap only, in the future. Added on 19 Oct 2026, when the agent's code merged, under
  the founder's rule of 18 Oct 2026.
- Finds secp256k1 and Ed25519 signing keys, Schnorr signatures, and ECDH and ECIES key transport
  in common wallet libraries, and names the curve in the CBOM. On-chain signing keys get wallet
  guidance: moving to ML-DSA needs the chain's support, so until then avoid address reuse and keep
  signing behind one interface. It reads code, not the chain, so it cannot tell which keys are
  already exposed on-chain.
- Flags test code instead of hiding it.
- States its limits on the page: pattern matching misses aliased and dynamic calls, vendored code
  and dependencies. No separate limits document is public, so never write "we publish" or link to
  one.

Language coverage: say "common cryptographic APIs in" and keep the line above. Depth varies, so
never print rule counts and never headline Java or .NET.

## Draft copy

Drafts for the founder to edit. Each sentence maps to the list above. They are older than the
live capability grid, which is the founder's 18 Oct 2026 rewrite (see "Page status").

**Hero.** "Quantsiv finds quantum-vulnerable cryptography in your code, ranks it by how long your
data must stay secret, and flags the changes that add more. Scanning runs in your CI by default
and produces a CycloneDX 1.6 Cryptographic Bill of Materials."

**Language line.** "Detects common cryptographic APIs in Python, JavaScript and TypeScript, Go,
Java and Kotlin, C#, Rust, Ruby, PHP, C and C++, Objective-C, Swift and Dart, openssl, ssh-keygen
and keytool commands in CI and shell scripts, and keys and certificates in PEM and SSH formats.
Pattern-based, so depth varies by language and some calls are missed."

**Capability cards.**
1. *Cryptographic Bill of Materials.* "CycloneDX 1.6 that passes the schema's strict validation.
   Import a CBOM from any producer and export the whole estate as one."
2. *Lifetime-aware ranking.* "Declare how long each kind of data must stay confidential.
   Encryption and key exchange are ranked by that lifetime. Signatures are tracked separately
   against the signature deadline, because their risk is forgery, not retroactive decryption."
3. *Change check.* "Compare each build with the latest default-branch build and flag the
   cryptography a change adds. Set policy per data class and record exceptions with a named
   approver and an expiry. Results go to Code Scanning as SARIF and, with the GitHub Actions
   template, to the pull request as a comment."
4. *Runs in your CI.* "A container with templates for GitHub Actions, GitLab, Jenkins and Azure
   DevOps. Scanning works offline. Only the CBOM and finding metadata reach Quantsiv, and only if
   you upload."
5. *Keys, certificates and TLS.* "Reads key and certificate files for algorithm and size. Probes
   the TLS endpoints you name; the hosted service probes only domains you prove you own with a
   DNS record."
6. *For coding assistants.* "A read-only MCP server lets an AI coding assistant ask your policy
   and declared lifetimes before it writes cryptography. The same check runs at the gate. It has
   no write tools and no model of ours in it."
7. *Migration guidance.* "Where the use is clear, each finding names the standard to move to:
   ML-KEM (FIPS 203), ML-DSA (FIPS 204) or SLH-DSA (FIPS 205), with hybrid key exchange during
   the transition."
8. *Honest limits.* "Pattern matching misses aliased and dynamic calls, vendored code and
   dependencies. We state the limits up front."
9. *Wallet and custody code.* "Finds secp256k1 and Ed25519 signing keys, Schnorr signatures, and
   ECDH and ECIES key transport in common wallet libraries. Once a wallet's public key is on-chain
   its risk is forgery, not decryption, and its guidance says what to do until the chain accepts
   post-quantum signatures. Reads code, not the chain."

Leave out "Audit-Ready Reporting" until it exists, or label it planned.

## Page status

The page edits listed in earlier versions of this file are applied (10 Oct 2026). These choices
stand until the founder changes them:

- The waitlist is open from the merge of the Brevo form (19 Oct 2026). The form is plain HTML that posts to
  Brevo's form address with a required consent checkbox, Brevo's hidden spam-trap field and the language
  code, and `script.js` only checks the address and sends nothing itself. No Brevo script, stylesheet or
  iframe is loaded. Brevo's double opt-in sends the confirmation email, and the confirmation page
  redirects to https://quantsiv.com/.
- The privacy notice (`privacy.html`, 11 Oct 2026) is linked from the form and the footer. Its
  contact is privacy@quantsiv.com. It names the controller, Ludovico Corsini, and covers visits
  (GitHub Pages) and email to privacy@ (Zoho Corporation B.V., EU data centres, support access
  from India under standard contractual clauses; general messages kept 12 months after the last
  reply, rights requests 2 years after closing). Waitlist retention: until the person
  unsubscribes or asks for deletion, and the whole list is deleted within 6 months if Quantsiv
  does not go ahead. Consent with double opt-in. It carries the same Content-Security-Policy
  meta tag as `index.html` and a canonical link.
- The notice names Brevo, where it says it stores the data (France, Germany, Belgium) and that its
  anonymous open and click tracking is on (Brevo's setting; if it is switched off the notice is wrong).
  Updated 19 Oct 2026 with the founder's approval. Unconfirmed sign-ups stay in Brevo's logs until the
  founder deletes them, and the notice promises that after the 30-day link expiry.
- The footer carries no personal handle. Its contacts are hello@quantsiv.com and the privacy
  notice. Since 19 Oct 2026 (the founder's ask), the section above the footer is "Get in Touch"
  (`#contact`): it invites visitors to see what Quantsiv finds in their own code and links
  hello@quantsiv.com, and the hero's second button points to it.
  The privacy notice already covers email to any quantsiv.com address ("When you write to us").
- "How Quantsiv Works" ends with "What a finding looks like", an interactive preview (19 Oct
  2026, the founder's brief): a scan overview, three findings, and three tabs each (the finding,
  the AI migration analysis, the validation). The scan, the ranking, the "Move to" lines, the
  checks and the gate are the scanner's own output for a sample repository written for the page,
  and the caption says so. The agent's analysis and draft are simulated, written by hand, and
  carry "Simulated output" and the "Illustrative preview" badge: keep both labels, never present
  the agent text as a measured result, and keep ML-KEM as key establishment with AES-GCM still
  encrypting the data, never as a drop-in for RSA encryption. If the scanner's wording changes,
  run it again on the same sample and update all three languages; never edit tool output by hand.
  In `nl/` and `it/` tool output stays in English (`lang="en"`) with a translation in brackets.
  Without JavaScript every panel shows in order (`noscript.css`); the tabs follow the WAI-ARIA
  tabs pattern in `script.js`.
- The brand tagline is "See tomorrow. Secure today." (the founder's, 18 Oct 2026). It is the
  small line above the headline, the share title (`og:title`) and the first line of the footer, in
  English on every language version (`lang="en"` in `nl/` and `it/`). It is a brand line, not a
  capability: never stretch it into a claim such as "Quantsiv secures your systems". The privacy
  notices keep their own titles and footers.
- The search title and description (the founder's pick, 19 Oct 2026) name what Quantsiv finds,
  because the tagline names no product category: `<title>` "Quantsiv - Find quantum-vulnerable
  cryptography in your code" and a description of about 155 characters, translated in `nl/` and
  `it/`. Keep each description short enough not to be cut mid-sentence, and mapped to "What the
  page may say". The Open Graph tags keep the tagline and the longer description.
- The page is written for non-technical readers first (17 Oct 2026): each heading and first
  sentence says what happens in plain words, and the technical terms follow, explained once.
  Keep that order when adding copy, and keep each plain sentence mapped to "What the page may
  say". The category line, "cryptographic change control and CBOM evidence", left the page on
  18 Oct 2026, when the tagline took its place.
- The founder's copy of 18 Oct 2026: no paragraph under the headline; the intro is three short
  lines, then "This is where we come in"; the threat section is "Two Quantum Threats" (Harvest
  Now, Decrypt Later, and Signature Forgery with "Trust Now, Forge Later"); the capability grid
  is his short cards, with the detection limits as one note under the grid instead of a card.
  On 19 Oct 2026 the grid's headline became "Find and rank the cryptography you need to
  replace. Built for the quantum era." (it was "Powerful cryptographic security. Built for the
  quantum era.", which read as a "Quantsiv secures" claim), and the limits note says depth
  varies by language.
  He wants Quantsiv presented as AI-powered once it is. Since 19 Oct 2026 the agent card is
  the AI capability on the page; calling the whole product "AI-powered" waits for his word,
  because the agent is optional and everything else is pattern rules and fixed checks.
- The agentic AI card (the founder, 18 Oct 2026) ends the grid. It carried a "Coming soon"
  label and future-tense copy until the agent's code merged in the product on 19 Oct 2026; since
  then it says in the present tense what the agent does (see "What the page may say"): reads
  each finding in context, drafts a fix, revises a draft the checks reject, shows only fixes that
  pass, runs as an optional step in your build on a model you choose; nothing merges without a
  person's approval. Keep that last clause, and never stretch "revises" into "self-healing",
  "autonomous" or "auto-fix". Learning from approved changes is the first Phase 1 roadmap line,
  in the future, until it is built. Never name the model's vendor.
- The narrative line "Two quantum threats, two clocks. Quantsiv ranks your cryptography against
  both, on every build." (the founder, 18 Oct 2026) is a narrative line, not the tagline. On 19
  Oct 2026 the founder removed the threat section's intro paragraph that carried it, so the
  section goes from its heading straight to the two cards. Keep threat examples generic: no
  company names and no counts that were not measured and sourced.
- The founder's text of 19 Oct 2026, on the page as he wrote it: the Signature Forgery card
  ("Digital signatures prove that software, certificates, documents and transactions are
  genuine. ...") and the fourth step of "How Quantsiv Works" ("Quantsiv generates a CycloneDX
  1.6 CBOM, a SARIF file for code-scanning tools, and a ranked report. ..."), in translation on
  `nl/` and `it/`. Change them only with his word.
- Detection limits (the founder's pick, 19 Oct 2026): the language card does not list Rust; the
  limits are the last section of the page (`#detection-limits`), after the roadmap, and say the
  rules for Rust, Ruby and PHP are early and name calls to cloud key services among what can be
  missed; a short footnote under the features (`#coverage-note`) links to it. The demo is
  labelled "Output" with a footnote (`#demo-footnote`) saying the results are Quantsiv's own on
  a demo repository. Keep these until measured detection in those languages improves and the
  founder says so.
- The page reads in order (the founder's ask, 19 Oct 2026): the menu and each section carry a
  number (01 to 05), each section ends with a "Next" link to the following one, and a thin bar
  under the header shows how far the page has been read where the browser supports it. The
  deadlines are a timeline of dropdowns (`<details>`), one per date; `script.js` marks past and
  future dates and places a "Today" marker. The features are cards that open one by one, two
  with chips of the languages and CI systems they cover (`assets/logos/`, Simple Icons, CC0;
  the marks belong to their owners; a name without a usable icon is a text chip).
- One play/pause button at the hero pauses both the hero animation and the standards banner
  (WCAG success criterion 2.2.2, Pause, Stop, Hide). It shows only when motion is allowed, and
  its labels come from `data-label-pause` and `data-label-play`. The banner also pauses on
  hover and keyboard focus.
- `index.html` carries a Content-Security-Policy meta tag that allows only this site's own files,
  with no inline scripts or styles. `form-action` allows this site and Brevo's form address
  (c58bed8a.sibforms.com); change it if the form moves to another service.

## Before every commit

1. Search the page for each phrase in the wording table.
2. Every regulatory sentence has an authority and a date and matches the table.
3. Every capability sentence maps to "What the page may say".
4. No number appears that was not measured and sourced.
5. Open the page on a narrow screen and with the keyboard; check the banner with reduced motion.
6. No secret, internal name or path is in any file or commit message.
7. Work is on a branch, and the founder approves the merge.
