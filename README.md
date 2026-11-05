# HR Placement Prep 2027

A minimalist, feature-packed study web app for **PGDM / MBA HR 2027** placements — HR Generalist, HR Operations, Talent Acquisition, Payroll & Compliance and HR Analytics.

Every topic is broken into small parts so it never reads like one long wall of text:

| Tab | What it gives you |
| --- | --- |
| **Overview** | One-paragraph definition, why it matters, key points as short cards |
| **Breakdown** | Each sub-topic as its own card — definition + example |
| **Example** | A worked, realistic example |
| **Case** | A situation to solve — think first, then reveal the model approach and takeaway |
| **Formulas** | Where numbers matter, each with a worked figure |
| **Interview** | Likely questions with model answers |

## What’s inside

- **14 modules · 114 topics · 576 sub-topics · 114 cases · 100 formulas · 342 interview questions**
- Modules: HRM Foundations · Organisational Behaviour · Talent Acquisition · Onboarding & Lifecycle · HR Ops & HRIS · Employee File Audit · Payroll & Compensation · Labour Law & Compliance (Labour Codes, POSH) · Employee Relations · Performance & L&D · HR Analytics: Metrics · HR Analytics: Tools (Excel, Power BI, SQL, statistics) · HR Tech & AI · Interview Prep

## Features

- Global search (press `/`) across topics, sub-topics, formulas and questions
- Progress tracking per topic and module, bookmarks, “continue where you left off”
- Flashcards (every definition, filter by module, “I know this” deck shrinking)
- Quiz — 10-question rounds matching definitions to terms, with review
- Question bank — every interview question with show/hide answers
- Calculators — 16 HR metrics, CTC → take-home (PF ceiling, ESI, Karnataka / West Bengal PT, new tax regime), gratuity
- 8-week study plan with tickable tasks
- Light / dark mode, mobile-friendly, print-friendly
- Progress is stored only in your browser (localStorage)

## Accuracy

Laws and rates were checked on **5 Nov 2026**: Labour Codes in force from 21 Nov 2025 (central rules 8 May 2026), EPF wage ceiling ₹25,000 from 17 Sep 2026, Income-tax Act 2025 from 1 Apr 2026, West Bengal PT slabs from 1 Oct 2026. State rules are still being notified — always confirm on official portals. Sources are listed on the in-app **About & sources** page.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # validates that every topic has all sections
npm run build      # production build in dist/
```

## Deploy

The repo is ready for Vercel (Vite preset, SPA rewrites in `vercel.json`). Every push to `main` redeploys.

## Add or edit content

Content lives in `src/data/modules/*.js`. Each topic follows this shape:

```js
{
  title: 'Topic name',
  def: 'Definition…',
  why: 'Why it matters…',
  bits: ['Key point', '…'],
  subs: [['Sub-topic', 'Definition', 'Example'], …],
  example: { title: '…', text: '…' },
  case: { title: '…', situation: '…', ask: '…', approach: ['Step', …], takeaway: '…' },
  formulas: [['Name', 'Formula', 'Worked example'], …], // optional
  qa: [['Question', 'Model answer'], …],
  note: 'Optional “current position” note',
}
```

Run `npm run check` after editing.
