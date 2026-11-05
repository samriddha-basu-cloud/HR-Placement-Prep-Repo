import React, { useMemo, useState } from 'react';

const inr = (n) => (isFinite(n) ? '₹' + Math.round(n).toLocaleString('en-IN') : '—');
const pct = (n, d = 1) => (isFinite(n) ? n.toFixed(d) + '%' : '—');
const num = (v) => {
  const x = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(x) ? 0 : x;
};

/* ---------------- HR metric calculator ---------------- */
const METRICS = [
  {
    id: 'attrition',
    name: 'Attrition rate (period)',
    inputs: [
      ['leavers', 'Leavers in the period', 6],
      ['open', 'Opening headcount', 200],
      ['close', 'Closing headcount', 210],
    ],
    formula: 'Leavers ÷ ((Opening + Closing) ÷ 2) × 100',
    calc: (v) => pct((v.leavers / ((v.open + v.close) / 2)) * 100, 2),
  },
  {
    id: 'annual',
    name: 'Annualised attrition',
    inputs: [
      ['leavers', 'Leavers so far this year', 30],
      ['avg', 'Average headcount', 205],
      ['months', 'Months elapsed', 6],
    ],
    formula: 'YTD leavers ÷ average headcount × (12 ÷ months) × 100',
    calc: (v) => pct((v.leavers / v.avg) * (12 / v.months) * 100),
  },
  {
    id: 'retention',
    name: 'Retention rate',
    inputs: [
      ['start', 'Employees at start of period', 200],
      ['stayed', 'Of those, still employed at end', 176],
    ],
    formula: 'Still employed from the starting group ÷ employees at start × 100',
    calc: (v) => pct((v.stayed / v.start) * 100),
  },
  {
    id: 'early',
    name: 'Early (90-day) attrition',
    inputs: [
      ['left', 'Joiners who left within 90 days', 4],
      ['joiners', 'Joiners in the period', 40],
    ],
    formula: 'Exits within 90 days ÷ joiners × 100',
    calc: (v) => pct((v.left / v.joiners) * 100),
  },
  {
    id: 'cph',
    name: 'Cost per hire',
    inputs: [
      ['internal', 'Internal costs (₹) – recruiter time, referral bonus', 120000],
      ['external', 'External costs (₹) – portals, agencies, ads', 180000],
      ['hires', 'Number of hires', 15],
    ],
    formula: '(Internal + external recruiting costs) ÷ hires',
    calc: (v) => inr((v.internal + v.external) / v.hires),
  },
  {
    id: 'oar',
    name: 'Offer acceptance rate',
    inputs: [
      ['acc', 'Offers accepted', 15],
      ['made', 'Offers made', 18],
    ],
    formula: 'Offers accepted ÷ offers made × 100',
    calc: (v) => pct((v.acc / v.made) * 100),
  },
  {
    id: 'otj',
    name: 'Offer-to-join ratio',
    inputs: [
      ['joined', 'Candidates who joined', 13],
      ['acc', 'Offers accepted', 15],
    ],
    formula: 'Joined ÷ offers accepted × 100',
    calc: (v) => pct((v.joined / v.acc) * 100),
  },
  {
    id: 'selection',
    name: 'Selection ratio',
    inputs: [
      ['sel', 'Candidates selected', 15],
      ['apps', 'Total applicants', 600],
    ],
    formula: 'Selected ÷ applicants × 100',
    calc: (v) => pct((v.sel / v.apps) * 100, 2),
  },
  {
    id: 'absent',
    name: 'Absenteeism rate',
    inputs: [
      ['days', 'Days lost to unplanned absence', 120],
      ['emp', 'Number of employees', 50],
      ['work', 'Working days in period', 24],
    ],
    formula: 'Days absent ÷ (employees × working days) × 100',
    calc: (v) => pct((v.days / (v.emp * v.work)) * 100),
  },
  {
    id: 'compa',
    name: 'Compa-ratio',
    inputs: [
      ['sal', 'Employee salary (₹)', 540000],
      ['mid', 'Midpoint of pay range (₹)', 600000],
    ],
    formula: 'Salary ÷ range midpoint  (below 0.80 lagging · 1.00 at market · above 1.20 leading)',
    calc: (v) => (v.sal / v.mid).toFixed(2),
  },
  {
    id: 'penetration',
    name: 'Range penetration',
    inputs: [
      ['sal', 'Employee salary (₹)', 540000],
      ['min', 'Range minimum (₹)', 480000],
      ['max', 'Range maximum (₹)', 720000],
    ],
    formula: '(Salary − range min) ÷ (range max − range min) × 100',
    calc: (v) => pct(((v.sal - v.min) / (v.max - v.min)) * 100),
  },
  {
    id: 'enps',
    name: 'eNPS',
    inputs: [
      ['pro', 'Promoters (scored 9–10)', 90],
      ['pas', 'Passives (7–8)', 70],
      ['det', 'Detractors (0–6)', 40],
    ],
    formula: '% promoters − % detractors  (range −100 to +100)',
    calc: (v) => {
      const t = v.pro + v.pas + v.det;
      return t ? ((v.pro / t) * 100 - (v.det / t) * 100).toFixed(0) : '—';
    },
  },
  {
    id: 'troi',
    name: 'Training ROI',
    inputs: [
      ['benefit', 'Monetary benefit (₹)', 500000],
      ['cost', 'Training cost (₹)', 200000],
    ],
    formula: '(Benefit − cost) ÷ cost × 100',
    calc: (v) => pct(((v.benefit - v.cost) / v.cost) * 100, 0),
  },
  {
    id: 'hcroi',
    name: 'Human capital ROI',
    inputs: [
      ['rev', 'Revenue (₹)', 500000000],
      ['opex', 'Operating expenses (₹)', 400000000],
      ['comp', 'Total compensation cost (₹)', 150000000],
    ],
    formula: '[Revenue − (operating expenses − compensation)] ÷ compensation',
    calc: (v) => ((v.rev - (v.opex - v.comp)) / v.comp).toFixed(2),
  },
  {
    id: 'rpe',
    name: 'Revenue per employee',
    inputs: [
      ['rev', 'Revenue (₹)', 500000000],
      ['hc', 'Average headcount', 205],
    ],
    formula: 'Revenue ÷ average headcount',
    calc: (v) => inr(v.rev / v.hc),
  },
  {
    id: 'sla',
    name: 'Ticket SLA adherence',
    inputs: [
      ['within', 'Tickets closed within SLA', 270],
      ['closed', 'Tickets closed', 300],
    ],
    formula: 'Closed within SLA ÷ closed × 100',
    calc: (v) => pct((v.within / v.closed) * 100),
  },
];

function MetricCalc() {
  const [id, setId] = useState(METRICS[0].id);
  const m = METRICS.find((x) => x.id === id);
  const [vals, setVals] = useState({});
  const v = Object.fromEntries(m.inputs.map(([k, , d]) => [k, vals[`${id}.${k}`] != null ? num(vals[`${id}.${k}`]) : d]));
  return (
    <div className="card calc">
      <h2>HR metrics calculator</h2>
      <p className="muted small">Pick a metric, change the numbers and the result updates. Defaults match the examples in the app.</p>
      <div className="chips">
        {METRICS.map((x) => (
          <button key={x.id} className={`chip ${x.id === id ? 'active' : ''}`} onClick={() => setId(x.id)}>
            {x.name}
          </button>
        ))}
      </div>
      <div className="calc-grid">
        <div className="calc-inputs">
          {m.inputs.map(([k, label, d]) => (
            <label key={k} className="field">
              <span>{label}</span>
              <input
                inputMode="decimal"
                value={vals[`${id}.${k}`] ?? d}
                onChange={(e) => setVals((s) => ({ ...s, [`${id}.${k}`]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="calc-result">
          <span className="mini-label">{m.name}</span>
          <span className="result-num">{m.calc(v)}</span>
          <code className="formula-text">{m.formula}</code>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CTC → take-home ---------------- */
const EPF_CEILING = 25000; // from 17 Sep 2026
const ESI_CEILING = 21000;

function ptMonthly(state, gross) {
  if (state === 'KA') return gross >= 25000 ? 200 : 0;
  if (state === 'WB') {
    if (gross <= 20000) return 0;
    if (gross <= 30000) return 100;
    if (gross <= 50000) return 140;
    if (gross <= 100000) return 170;
    return 208;
  }
  return 0;
}

function newRegimeTax(taxable) {
  const slabs = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ];
  let tax = 0;
  let prev = 0;
  for (const [upto, rate] of slabs) {
    if (taxable > prev) tax += (Math.min(taxable, upto) - prev) * rate;
    prev = upto;
  }
  if (taxable <= 1200000) tax = 0; // rebate: no tax up to ₹12 lakh taxable income
  else tax = Math.min(tax, taxable - 1200000); // marginal relief just above ₹12 lakh
  return tax * 1.04; // + 4% health and education cess
}

function SalaryCalc() {
  const [ctc, setCtc] = useState('600000');
  const [basicPct, setBasicPct] = useState('50');
  const [hraPct, setHraPct] = useState('40');
  const [state, setState] = useState('KA');
  const [pfMode, setPfMode] = useState('ceiling');
  const [grat, setGrat] = useState(true);

  const r = useMemo(() => {
    const monthly = num(ctc) / 12;
    const basic = (monthly * num(basicPct)) / 100;
    const pfBase = pfMode === 'ceiling' ? Math.min(basic, EPF_CEILING) : basic;
    const erPF = Math.round(0.12 * pfBase);
    const gratuity = grat ? Math.round(0.0481 * basic) : 0;
    let gross = monthly - erPF - gratuity;
    let erESI = 0;
    if (gross / 1.0325 <= ESI_CEILING) {
      gross = gross / 1.0325;
      erESI = 0.0325 * gross;
    }
    const hra = (basic * num(hraPct)) / 100;
    const special = gross - basic - hra;
    const eePF = Math.round(0.12 * pfBase);
    const eeESI = erESI ? 0.0075 * gross : 0;
    const pt = ptMonthly(state, gross);
    const taxable = Math.max(0, gross * 12 - 75000);
    const tdsAnnual = newRegimeTax(taxable);
    const tds = tdsAnnual / 12;
    const net = gross - eePF - eeESI - pt - tds;
    return { monthly, basic, erPF, gratuity, erESI, gross, hra, special, eePF, eeESI, pt, taxable, tdsAnnual, tds, net };
  }, [ctc, basicPct, hraPct, state, pfMode, grat]);

  const rows = [
    ['Monthly CTC', r.monthly, 'Annual CTC ÷ 12'],
    ['Employer PF', r.erPF, pfMode === 'ceiling' ? `12% of Basic, capped at ₹${EPF_CEILING.toLocaleString('en-IN')}` : '12% of full Basic'],
    ['Gratuity provision', r.gratuity, grat ? '4.81% of Basic (15/26 ÷ 12)' : 'Not part of CTC'],
    ...(r.erESI ? [['Employer ESI', r.erESI, '3.25% of gross (gross ≤ ₹21,000)']] : []),
    ['Gross salary', r.gross, 'CTC − employer PF − gratuity − employer ESI', 'strong'],
    ['  Basic', r.basic, `${basicPct}% of CTC`],
    ['  HRA', r.hra, `${hraPct}% of Basic`],
    ['  Special allowance', r.special, 'Balancing figure'],
    ['Employee PF', -r.eePF, '12% of PF wages'],
    ...(r.eeESI ? [['Employee ESI', -r.eeESI, '0.75% of gross']] : []),
    ['Professional tax', -r.pt, state === 'KA' ? 'Karnataka: ₹200 if gross ≥ ₹25,000' : state === 'WB' ? 'West Bengal slabs from 1 Oct 2026' : 'No PT in this state'],
    ['TDS (new regime)', -r.tds, `Annual tax ${inr(r.tdsAnnual)} on taxable ${inr(r.taxable)}`],
    ['Net take-home', r.net, 'Gross − deductions', 'strong accent'],
  ];

  return (
    <div className="card calc">
      <h2>CTC → take-home calculator</h2>
      <p className="muted small">
        A simplified fresher structure under the new tax regime (tax year 2026-27). Real structures vary by company — use
        this to explain the logic in interviews, not to compute an actual payslip.
      </p>
      <div className="calc-grid">
        <div className="calc-inputs">
          <label className="field">
            <span>Annual CTC (₹)</span>
            <input inputMode="decimal" value={ctc} onChange={(e) => setCtc(e.target.value)} />
          </label>
          <label className="field">
            <span>Basic as % of CTC</span>
            <input inputMode="decimal" value={basicPct} onChange={(e) => setBasicPct(e.target.value)} />
          </label>
          <label className="field">
            <span>HRA as % of Basic</span>
            <select value={hraPct} onChange={(e) => setHraPct(e.target.value)}>
              <option value="40">40% (non-metro / Bangalore common practice)</option>
              <option value="50">50% (metro: Kolkata, Mumbai, Delhi, Chennai)</option>
            </select>
          </label>
          <label className="field">
            <span>Work location (professional tax)</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="KA">Karnataka (Bangalore)</option>
              <option value="WB">West Bengal (Kolkata)</option>
              <option value="NONE">State without PT (e.g. Delhi)</option>
            </select>
          </label>
          <label className="field">
            <span>PF calculated on</span>
            <select value={pfMode} onChange={(e) => setPfMode(e.target.value)}>
              <option value="ceiling">Statutory wage ceiling (₹25,000)</option>
              <option value="full">Full Basic (voluntary higher PF)</option>
            </select>
          </label>
          <label className="check-label">
            <input type="checkbox" checked={grat} onChange={(e) => setGrat(e.target.checked)} /> Gratuity provision is part of CTC
          </label>
        </div>
        <div className="calc-table">
          <table>
            <tbody>
              {rows.map(([label, val, how, cls]) => (
                <tr key={label} className={cls || ''}>
                  <td>
                    <span>{label.trim()}</span>
                    <small>{how}</small>
                  </td>
                  <td className="num">{val < 0 ? '− ' + inr(-val) : inr(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.special < 0 && <p className="warn small">Basic + HRA exceed gross — lower the Basic % or HRA %.</p>}
        </div>
      </div>
    </div>
  );
}

function GratuityCalc() {
  const [wage, setWage] = useState('30000');
  const [years, setYears] = useState('6');
  const [type, setType] = useState('perm');
  const y = num(years);
  const eligible = type === 'perm' ? y >= 5 : y >= 1;
  const amount = Math.min((15 / 26) * num(wage) * y, 2000000);
  return (
    <div className="card calc">
      <h2>Gratuity calculator</h2>
      <p className="muted small">15/26 × last drawn wages (basic + DA) × completed years. Statutory ceiling ₹20 lakh.</p>
      <div className="calc-grid">
        <div className="calc-inputs">
          <label className="field">
            <span>Last drawn monthly wages (₹)</span>
            <input inputMode="decimal" value={wage} onChange={(e) => setWage(e.target.value)} />
          </label>
          <label className="field">
            <span>Completed years of service</span>
            <input inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <label className="field">
            <span>Employment type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="perm">Permanent (eligible after 5 years)</option>
              <option value="fte">Fixed-term (eligible after 1 year, pro-rata)</option>
            </select>
          </label>
        </div>
        <div className="calc-result">
          <span className="mini-label">Gratuity payable</span>
          <span className="result-num">{eligible ? inr(amount) : 'Not yet eligible'}</span>
          <code className="formula-text">15 ÷ 26 × {inr(num(wage))} × {y}</code>
        </div>
      </div>
    </div>
  );
}

export default function Tools() {
  return (
    <div className="page">
      <h1>Calculators</h1>
      <p className="muted">Practise the numbers interviewers ask about. Every result shows its formula.</p>
      <div className="stack">
        <MetricCalc />
        <SalaryCalc />
        <GratuityCalc />
      </div>
    </div>
  );
}
