import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { MODULES } from '../data/index.js';
import { Progress } from '../components/ui.jsx';

const WEEKS = [
  {
    w: 1,
    dates: '9–15 Nov',
    focus: 'Foundations + Talent Acquisition',
    links: ['foundations', 'ob', 'talent-acquisition'],
    tasks: [
      'Read HRM Foundations: lifecycle, Ulrich model, HR structure',
      'Revise motivation and leadership theories (OB)',
      'Talent Acquisition: requisition → sourcing → screening → interviews → offer',
      'Write 5 STAR stories from EvePaper recruiting',
      'Excel: build a simple hiring tracker',
    ],
  },
  {
    w: 2,
    dates: '16–22 Nov',
    focus: 'Onboarding, HR Ops, HRIS, File audit',
    links: ['onboarding-lifecycle', 'hr-operations', 'file-audit'],
    tasks: [
      'Onboarding & lifecycle: pre-boarding, BGV, induction, probation, exit, F&F',
      'HR Ops: master data, ESS/MSS, HR MIS, helpdesk SLAs',
      'File audit: personnel file checklist and three-way match',
      'Make your own onboarding checklist and file-audit checklist',
      'Excel: clean a messy employee list (duplicates, blanks, formats)',
    ],
  },
  {
    w: 3,
    dates: '23–29 Nov',
    focus: 'Payroll & compensation',
    links: ['payroll'],
    tasks: [
      'CTC vs gross vs net; salary components',
      'Payroll cycle, inputs, LOP, reconciliation',
      'PF, ESI, PT, TDS – rates and due dates',
      'Gratuity, bonus, F&F calculation',
      'Rebuild the ₹6 LPA payslip in Excel and in the CTC calculator',
    ],
  },
  {
    w: 4,
    dates: '30 Nov–6 Dec',
    focus: 'Labour Codes & compliance',
    links: ['labour-law'],
    tasks: [
      'The four Labour Codes: what each consolidates and the HR changes',
      'POSH Act: Internal Committee, timelines',
      'Shops & Establishments, contract labour, maternity benefit',
      'Build a monthly / quarterly / annual compliance calendar',
      'Read one labour-law update on the Ministry site or ETHRWorld',
    ],
  },
  {
    w: 5,
    dates: '7–13 Dec',
    focus: 'HR Generalist: ER, PMS, L&D',
    links: ['employee-relations', 'performance-ld'],
    tasks: [
      'Grievance handling and the domestic enquiry process',
      'Engagement and retention levers',
      'PMS: KRA/KPI/OKR, appraisal methods, calibration, PIP',
      'L&D: TNA, ADDIE, Kirkpatrick; the 9-box grid',
      'Practise two situational cases aloud',
    ],
  },
  {
    w: 6,
    dates: '14–20 Dec',
    focus: 'HR metrics + Excel',
    links: ['analytics-metrics', 'analytics-tools'],
    tasks: [
      'Learn 20 HR metrics with formulas (use the calculator)',
      'Excel: lookups, COUNTIFS/SUMIFS, pivots, NETWORKDAYS, DATEDIF',
      'Attrition analysis on a sample dataset',
      'Write a one-slide insight: finding → cause → action',
    ],
  },
  {
    w: 7,
    dates: '21–27 Dec',
    focus: 'Power BI, SQL, HR tech',
    links: ['analytics-tools', 'hr-tech'],
    tasks: [
      'Power BI: Power Query, data model, DAX measures',
      'Build the attrition dashboard (portfolio project 1)',
      'SQL basics: SELECT, WHERE, GROUP BY, JOIN',
      'HR tech: modules of SuccessFactors / Workday / Darwinbox / Keka',
      'Post the dashboard on LinkedIn',
    ],
  },
  {
    w: 8,
    dates: '28 Dec–3 Jan',
    focus: 'Interview readiness',
    links: ['interview'],
    tasks: [
      'Finalise the 60-second pitch',
      'Rehearse 10 STAR stories',
      'Three mock interviews (faculty, peer, recorded)',
      'Revise the question bank – all modules',
      'Fix CV numbers and duplicate bullets',
    ],
  },
];

export default function Plan() {
  const store = useStore();
  const all = WEEKS.flatMap((w) => w.tasks.map((_, i) => `w${w.w}.${i}`));
  const done = all.filter((k) => store.isPlanDone(k)).length;
  return (
    <div className="page">
      <h1>8-week plan</h1>
      <p className="muted">
        9 Nov 2026 – 3 Jan 2027, about 2.5–3 hours a day. Daily split: 60 min concepts · 45 min Excel/analytics · 30 min laws
        &amp; news · 15 min speaking practice. Tick tasks as you finish them — progress is saved in this browser.
      </p>
      <Progress value={done} total={all.length} />
      <div className="grid weeks-grid">
        {WEEKS.map((w) => {
          const keys = w.tasks.map((_, i) => `w${w.w}.${i}`);
          const d = keys.filter((k) => store.isPlanDone(k)).length;
          return (
            <div key={w.w} className={`card week ${d === keys.length ? 'is-done' : ''}`}>
              <div className="row-between">
                <span className="eyebrow">
                  Week {w.w} · {w.dates}
                </span>
                <span className="small muted">
                  {d}/{keys.length}
                </span>
              </div>
              <h3>{w.focus}</h3>
              <ul className="checklist">
                {w.tasks.map((t, i) => {
                  const k = `w${w.w}.${i}`;
                  return (
                    <li key={k}>
                      <label className={store.isPlanDone(k) ? 'checked' : ''}>
                        <input type="checkbox" checked={store.isPlanDone(k)} onChange={() => store.togglePlan(k)} />
                        <span>{t}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="week-links">
                {w.links.map((id) => {
                  const m = MODULES.find((x) => x.id === id);
                  return m ? (
                    <Link key={id} className="chip" to={`/m/${id}`}>
                      {m.num} · {m.short || m.title}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
