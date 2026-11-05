import React from 'react';
import { STATS } from '../data/index.js';

const SOURCES = [
  ['Labour Codes in force 21 Nov 2025; Central Rules 8 May 2026', 'https://www.azbpartners.com/?p=89022'],
  ['State rules status (Sep 2026)', 'https://www.business-standard.com/india-news/all-states-uts-may-notify-labour-code-rules-by-oct-31-labour-secretary-126092401119_1.html'],
  ['Labour Ministry FAQs on the codes (wages, FTE gratuity, hours, overtime, retrenchment)', 'https://www.scconline.com/blog/post/2026/01/03/labour-ministry-issued-faqs-on-the-labour-codes/'],
  ['Labour Codes – standing orders, F&F in two working days, 50% wage rule', 'https://www.iflr.com/article/2gmssz4idfsyyfzd50tts/sponsored/indias-new-labour-codes-key-reforms-for-employers'],
  ['EPF wage ceiling ₹25,000 from 17 Sep 2026 (S.O. 5109(E))', 'https://www.corporateprofessionals.com/articles/epf-wage-ceiling-moves-to-%E2%82%B925000-key-changes-and-employer-impact/'],
  ['West Bengal professional tax slabs from 1 Oct 2026', 'https://www.sgcms.com/regulatory-updates/?p=3477'],
  ['Karnataka professional tax', 'https://yahoo.bankbazaar.com/tax/karnataka-professional-tax-slab-rate.html'],
  ['Income-tax Act 2025 – new regime slabs, standard deduction', 'https://taxguru.in/?p=1052630'],
  ['Income-tax Act 2025 in force 1 Apr 2026 at same rates', 'https://www.allindiaitr.com/income-tax-act-2025'],
  ['Salary TDS under section 392 of the 2025 Act', 'https://thetaxcorp.in/article/new-tds-regime-under-income-tax-act-2025-practical-guide-to-sections-forms'],
  ['Ministry of Labour & Employment', 'https://labour.gov.in/'],
  ['EPFO', 'https://www.epfindia.gov.in/'],
  ['ESIC', 'https://www.esic.gov.in/'],
  ['Income Tax Department', 'https://www.incometax.gov.in/'],
];

export default function About() {
  return (
    <div className="page narrow">
      <h1>About & sources</h1>
      <p>
        A study app for PGDM / MBA HR students preparing for 2027 placements in HR Generalist, HR Operations, Talent
        Acquisition, Payroll & Compliance, and HR Analytics roles. It has {STATS.modules} modules, {STATS.topics} topics,{' '}
        {STATS.subtopics} sub-topics, {STATS.cases} cases, {STATS.formulas} formulas and {STATS.questions} interview
        questions.
      </p>
      <h2>How each topic is organised</h2>
      <ul className="plain-list">
        <li>
          <strong>Overview</strong> — a one-paragraph definition, why it matters, and key points as short bits.
        </li>
        <li>
          <strong>Breakdown</strong> — each sub-topic as its own card with a definition and an example.
        </li>
        <li>
          <strong>Example</strong> — one worked, realistic example.
        </li>
        <li>
          <strong>Case</strong> — a situation to solve. Think first, then reveal the model approach.
        </li>
        <li>
          <strong>Formulas</strong> — where numbers matter, with a worked figure.
        </li>
        <li>
          <strong>Interview</strong> — likely questions with model answers.
        </li>
      </ul>
      <h2>Accuracy</h2>
      <p>
        Indian labour and tax rules changed a lot in 2025–26. Laws, rates and thresholds in this app were checked on 5 Nov
        2026. State rules under the Labour Codes are still being notified, so always confirm against official portals
        before relying on a number. Progress, bookmarks and plan ticks are stored only in your browser.
      </p>
      <h2>Sources</h2>
      <ul className="plain-list sources">
        {SOURCES.map(([label, url]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
