# Website roadmap

The work on quantsiv.com itself: what is done and what is left. Product plans are not kept here.

## A. Done (19 Oct 2026)

- **Copy.** On the founder's instruction, the threat section's opening paragraph is removed, the
  Signature Forgery paragraph and the fourth step of "How Quantsiv Works" have new text, in English,
  Dutch and Italian. No other copy changed.
- **Finding preview.** "What a finding looks like" is an interactive preview: a scan overview, three
  findings to choose from, and three tabs for each (the finding, the AI migration analysis, the
  validation). The scan, ranking, checks and gate come from the scanner run on a sample repository
  written for the page; the agent's analysis is simulated and labelled as such. It works with the
  keyboard, with a screen reader (tabs pattern, live announcement), and without JavaScript (every
  panel shown in order).
- **Search and sharing.** Open Graph and Twitter tags with a social card, a 32 px favicon and an
  Apple touch icon, `robots.txt`, `sitemap.xml` with language alternates, a 404 page, and
  Organization microdata in the footer.
- **Speed.** The text font is preloaded, the script loads deferred from the head, the logo is served
  at its display size (34 KB to 5 KB) and the favicon is 1 KB instead of 122 KB.
- **Search, second pass.** Language links point at the canonical addresses instead of
  `index.html`, the sitemap carries `lastmod` dates, and the home pages carry WebSite microdata so
  search results can show "Quantsiv" as the site name.
- **Accessibility.** The standards banner has a pause button (WCAG success criterion 2.2.2, Pause,
  Stop, Hide), shown only when motion is allowed, and pauses on hover and focus.
- **Checks run on this branch** (local server, lab figures, not field data): axe-core reported no
  WCAG 2.2 A or AA violations on every page at 390 and 1440 px, including each demo tab; no page
  scrolls sideways at 375, 390, 768, 1024, 1440 or 1920 px; no console or Content-Security-Policy
  errors. Lighthouse, English page on simulated mobile: performance 92 before, 98 after (largest
  contentful paint 2.9 s to 2.1 s, total blocking time 190 ms to 0 ms).

## B. Left to do

**P0, now (needs the founder's accounts)**
- Verify the site in the search engines' webmaster tools by DNS record and submit the
  sitemap. On 19 Oct 2026 the web search we checked listed no page of quantsiv.com, which is
  normal for a new site that nothing links to yet.
- Make the redirect domains' forwarding permanent (301) instead of temporary (302).

**P0, before the waitlist opens**
- Name the email service in the privacy notice, point the form at it and add it to `form-action`.
- Legal and company details, when the founder supplies them.

**P1, soon after launch**
- Measure Core Web Vitals in the field (including interaction to next paint, which a lab run cannot
  measure) without adding tracking to the page.
- Give the hero image `fetchpriority="high"` with the next hero change.
- Check every external link and the live response headers once the branch is published.

**P2**
- Remove assets the pages no longer use, after checking nothing outside the site links to them.
- Minify CSS and JavaScript if the page grows; today there is no build step on purpose.

**P3**
- Social cards in Dutch and Italian.
- A print stylesheet.
