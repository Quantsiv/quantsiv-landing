# quantsiv-landing

The public marketing site for Quantsiv: static HTML, CSS and JavaScript, served by GitHub Pages.

**Everything in this repository is public**: every file, every branch and every commit message.
Pages publishes the branch it is configured to serve, normally the default branch, within minutes.
Write as if a customer, a competitor and a regulator are all reading it.

## What this repository is

- One page, `index.html`, and a privacy notice, `privacy.html`, with `style.css`, `script.js`
  and `assets/`. No build step, no framework, no package manager. `.nojekyll` must stay.
- The site's address is https://quantsiv.com (`CNAME`). Use it in every link and never the
  github.io address. Pages publishes every file on the branch, this one included.
- Pre-launch. The waitlist is not open yet, and the page collects nothing. Use the present tense for what the product
  does today and never for what is planned. Say "Join the waitlist", never "Get started", "Sign up",
  "Download" or "Free trial".

## Never put in this repository

- Product source code, configuration, infrastructure details, credentials or secrets.
- Strategy, pricing, packaging, customer or partner names, logos or numbers, fundraising,
  internal plans, audit or security findings.
- Names of, or comparisons with, other companies or products. Neutral references to standards,
  laws and public tools the page cites by name and date are fine, and so is naming a service that
  handles visitors' data in the privacy notice.
- Legal text, a privacy policy, terms or company details. The founder supplies them; never invent
  them. The one exception is `privacy.html`, published on the founder's instruction on 10 Oct
  2026 and updated with his approval on 11 Oct 2026. Change it only with the founder's approval.
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
| Executive Order 14412, 22 Jun 2026 | Post-quantum key establishment on high-value assets and high-impact systems by 31 Dec 2030, and signatures by 31 Dec 2031. A proposed FAR rule for covered contractors. CISA, in coordination with NIST, publishes guidance on CBOM minimum elements within 270 days, about Mar 2027 |
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
- Writes a CycloneDX 1.6 CBOM that passes the schema's strict validation, plus SARIF and a
  ranked report. Accepts any schema-valid CycloneDX 1.6 CBOM from any producer, and exports the
  latest default-branch CBOM of every repository as one document.
- Ranks encryption and key exchange by how long the data must stay confidential, which you
  declare. Tracks signatures separately against the signature deadline.
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

Drafts for the founder to edit. Each sentence maps to the list above.

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

- The waitlist is not open. The form is disabled and says so, and `script.js` sends nothing.
- The privacy notice (`privacy.html`, 11 Oct 2026) is linked from the form and the footer. Its
  contact is privacy@quantsiv.com. It names the controller, Ludovico Corsini, and covers visits
  (GitHub Pages) and email to privacy@ (Zoho Corporation B.V., EU data centres, support access
  from India under standard contractual clauses; general messages kept 12 months after the last
  reply, rights requests 2 years after closing). Waitlist retention: until the person
  unsubscribes or asks for deletion, and the whole list is deleted within 6 months if Quantsiv
  does not go ahead. Consent with double opt-in. It carries the same Content-Security-Policy
  meta tag as `index.html` and a canonical link.
- Before the form opens, the notice must name the email service that stores the list, with
  where it stores the data and whether emails are tracked. The form then posts to that service,
  with no CAPTCHA and no iframe, and the notice's "Last updated" date changes.
- The footer carries no personal handle. Its only contact is the privacy notice.
- `index.html` carries a Content-Security-Policy meta tag that allows only this site's own files,
  with no inline scripts or styles. When the form opens, add the email service's form address
  to `form-action`, or the browser refuses to submit it.

## Before every commit

1. Search the page for each phrase in the wording table.
2. Every regulatory sentence has an authority and a date and matches the table.
3. Every capability sentence maps to "What the page may say".
4. No number appears that was not measured and sourced.
5. Open the page on a narrow screen and with the keyboard; check the banner with reduced motion.
6. No secret, internal name or path is in any file or commit message.
7. Work is on a branch, and the founder approves the merge.
