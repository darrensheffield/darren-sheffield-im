# Darren.Sheffield.im Internal Style Guide

This guide captures the working rules for the public portfolio site. It is an internal reference for editing the static HTML/CSS files, not a public site page.

## Site Role

- Present a quiet, technical portfolio for Darren Sheffield.
- Prioritize systems leadership, integration delivery, support operations, automation, and AI-assisted delivery.
- Keep the site practical and source-backed. Avoid generic personal-brand language, marketing filler, or inflated claims.
- Do not expose private/local workflows in the public navigation.

## Page Model

- `index.html`: primary positioning and overview.
- `work-history.html`: professional experience timeline and credentials.
- `experience.html`: skillset and keyword groups.
- `contact.html`: public contact paths only.
- `darren.html`: direct public pointer to the local private workflow, but not part of public navigation.

Primary navigation is:

- Home
- Experience
- Skillset
- Contact

Do not add an Apps tab or public Darren tab without an explicit decision to change the information architecture.

## Voice

- Direct, restrained, and technical.
- Prefer concrete nouns and working context over abstractions.
- Use first person where it keeps the copy clear, especially on the homepage.
- Avoid cheerleading language, exaggerated outcomes, and broad consultant cliches.
- Keep claims grounded in actual work: ERP delivery, support workflows, data cleanup, automation, documentation, and handoffs.

Examples of preferred phrasing:

- "systems ownership"
- "support workflows"
- "source-backed tools"
- "handoffs people can maintain"
- "operational work traceable as teams and systems changed"

Avoid:

- "transformational thought leader"
- "world-class solutions"
- "unlocking limitless potential"
- repeated labels such as an eyebrow and `h1` both saying "Contact"

## Layout

- Keep pages calm, spacious, and scannable.
- Use cards for repeated content groups only, not as decorative page sections.
- Maintain the existing 8px radius unless a component already uses a pill shape intentionally.
- Avoid nested cards.
- Keep large hero-scale text only in true page hero areas.
- Preserve responsive behavior at desktop and mobile widths. Mobile is not secondary; review it before pushing.

## Color And Type

- Keep the existing green, gold, steel, white, soft gray, and dark-mode token family.
- Avoid introducing new dominant colors without a clear role.
- Use system fonts only unless there is an explicit design decision to change typography.
- Letter spacing should stay at `0` for normal body and heading text. Use small positive tracking only for labels/eyebrows already styled that way.

## Navigation

- The brand link returns to `index.html`.
- The active page gets `aria-current="page"`.
- Mobile nav uses the existing two-column button layout.
- Do not add hidden or teaser navigation to private/local content.

## Contact Page

- Keep the page minimal.
- Current structure is:
  - `h1` Contact
  - one short lead line
  - LinkedIn button
  - Email Darren button
  - GitHub button with icon
- Do not restore the availability note, lower contact cards, or fallback paragraph unless requested.
- Do not repeat "Contact" as both eyebrow and heading.

## Credentials And Chips

- Credential chips should be compact, filled, and low-emphasis.
- Chips should support scanning, not dominate the card.
- Avoid large outlined pills that create heavy empty shapes around short text.
- Preserve wrapping on desktop and mobile without clipping or forcing horizontal overflow.

## Accessibility Controls

- Keep the floating accessibility control visible in page reviews.
- For full-page PDF captures, place the control at the bottom of the full captured page so it does not appear mid-page as a fixed-position screenshot artifact.
- Capture both default and accessibility-menu-open states when producing review PDFs.

## Review PDF Standard

When preparing markup PDFs for iPad review, include:

- Desktop default
- Desktop with accessibility menu open
- Mobile default
- Mobile with accessibility menu open

Apply that set for every public navigation page:

- Home
- Experience
- Skillset
- Contact

Use full-page browser captures, then render-check the finished PDF before placing it in iCloud Drive.

## Private Area Boundary

- Keep real private data out of the public site repo.
- `darren.html` may exist as a direct public pointer page, but it should not be advertised in public navigation.
- The local-only private scaffold belongs in the sibling `../darren-private-local` directory.
- Do not imply CloudKit, passkey auth, or private data handling is live unless it actually is.

## Pre-Push Checks

Before pushing content or UI changes:

- Run `git diff --check`.
- Check that public nav does not include `darren.html`.
- Check relevant desktop and mobile views.
- For PDF feedback cycles, regenerate and visually inspect the PDF after source changes.
- Keep temporary capture files out of git.
