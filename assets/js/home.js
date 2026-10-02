/* ============================================
   ABYSSINIA SEC - Home Page JavaScript
   ============================================ */

'use strict';

// ---- Programs Data ----
const programs = [
  {
    id: 1, name: 'Commercial Bank of Ethiopia', category: 'fintech',
    logo: '🏦', desc: 'Find vulnerabilities in CBE\'s mobile banking, internet banking, and core API infrastructure.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$2,000 – $10,000' },
      { label: 'High', color: '#ff6b35', range: '$500 – $2,000' },
      { label: 'Medium', color: '#ffc800', range: '$100 – $500' }
    ],
    submissions: 342, researchers: 89, resolved: 94, bounty: '$28K', status: 'active', new: false
  },
  {
    id: 2, name: 'Telebirr (Ethio Telecom)', category: 'fintech',
    logo: '📱', desc: 'Ethiopia\'s largest mobile money platform. Scope includes mobile apps, APIs, and web portals.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$3,000 – $10,000' },
      { label: 'High', color: '#ff6b35', range: '$1,000 – $3,000' },
      { label: 'Medium', color: '#ffc800', range: '$200 – $1,000' }
    ],
    submissions: 521, researchers: 134, resolved: 91, bounty: '$45K', status: 'active', new: false
  },
  {
    id: 3, name: 'Awash Bank Digital', category: 'fintech',
    logo: '💳', desc: 'Bug bounty for Awash Bank\'s digital banking suite, including mobile apps and payment gateway.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$1,500 – $7,500' },
      { label: 'High', color: '#ff6b35', range: '$300 – $1,500' },
      { label: 'Low', color: '#00ff88', range: '$50 – $300' }
    ],
    submissions: 189, researchers: 63, resolved: 88, bounty: '$14K', status: 'active', new: true
  },
  {
    id: 4, name: 'Ethiopian Airlines', category: 'ecommerce',
    logo: '✈️', desc: 'Secure the world\'s most profitable African airline. Scope includes booking system, loyalty app, and APIs.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$2,500 – $8,000' },
      { label: 'High', color: '#ff6b35', range: '$500 – $2,500' },
      { label: 'Medium', color: '#ffc800', range: '$100 – $500' }
    ],
    submissions: 276, researchers: 78, resolved: 85, bounty: '$22K', status: 'active', new: true
  },
  {
    id: 5, name: 'Ethio Telecom Enterprise', category: 'telecom',
    logo: '📡', desc: 'National telecom infrastructure VDP. Find vulnerabilities in enterprise portals and network management systems.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$5,000 – $15,000' },
      { label: 'High', color: '#ff6b35', range: '$1,000 – $5,000' },
      { label: 'Medium', color: '#ffc800', range: '$200 – $1,000' }
    ],
    submissions: 412, researchers: 112, resolved: 90, bounty: '$38K', status: 'active', new: false
  },
  {
    id: 6, name: 'EthSwitch Payment Gateway', category: 'fintech',
    logo: '🔄', desc: 'Ethiopia\'s national interbank payment switch. Critical infrastructure — high rewards for critical findings.',
    rewards: [
      { label: 'Critical', color: '#ff3366', range: '$5,000 – $20,000' },
      { label: 'High', color: '#ff6b35', range: '$1,500 – $5,000' },
      { label: 'Medium', color: '#ffc800', range: '$300 – $1,500' }
    ],
    submissions: 198, researchers: 56, resolved: 96, bounty: '$31K', status: 'active', new: false
  }
];

// ---- Leaderboard Data ----
const leaderboardData = [
  { rank: 1, name: 'Yohannes Tesfaye', handle: '@yohannes_sec', avatar: 'YT', points: 12480, bugs: 142, earnings: '$18,420', country: '🇪🇹', specialty: 'Web, API' },
  { rank: 2, name: 'Meron Alemu', handle: '@meron_hack', avatar: 'MA', points: 10920, bugs: 118, earnings: '$15,800', country: '🇪🇹', specialty: 'Mobile, Auth' },
  { rank: 3, name: 'Dawit Bekele', handle: '@dawit_0x', avatar: 'DB', points: 9870, bugs: 103, earnings: '$14,200', country: '🇪🇹', specialty: 'Network, Crypto' },
  { rank: 4, name: 'Selam Girma', handle: '@selam_bug', avatar: 'SG', points: 8540, bugs: 89, earnings: '$11,600', country: '🇪🇹', specialty: 'XSS, Injection' },
  { rank: 5, name: 'Biruk Haile', handle: '@biruk_sec', avatar: 'BH', points: 7890, bugs: 76, earnings: '$10,100', country: '🇪🇹', specialty: 'IoT, Hardware' },
  { rank: 6, name: 'Tigist Worku', handle: '@tigist_w', avatar: 'TW', points: 7200, bugs: 71, earnings: '$9,400', country: '🇪🇹', specialty: 'Web, SSRF' },
  { rank: 7, name: 'Abel Tadesse', handle: '@abel_xss', avatar: 'AT', points: 6540, bugs: 65, earnings: '$8,200', country: '🇰🇪', specialty: 'XSS, SQLi' },
];

// ---- Render Programs ----
function renderPrograms(filter = 'all') {
  const grid = document.getElementById('programsGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? programs : programs.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="program-card animate-on-scroll" onclick="openProgramPreview(${p.id})">
      <div class="program-header">
        <div>
          <div class="prog-name">${p.name}</div>
          <div class="prog-cat">${p.category}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;">
          <div class="prog-logo">${p.logo}</div>
          ${p.new ? '<span class="badge badge-new">New</span>' : ''}
        </div>
      </div>
      <p class="prog-desc">${p.desc}</p>
      <div class="prog-rewards">
        ${p.rewards.map(r => `
          <div class="prog-reward-row">
            <span class="prog-reward-label" style="color:${r.color}">${r.label}</span>
            <span class="prog-reward-range">${r.range}</span>
          </div>
        `).join('')}
      </div>
      <div class="prog-footer">
        <div class="prog-stat"><span class="prog-stat-val">${p.submissions}</span><span class="prog-stat-label">Reports</span></div>
        <div class="prog-stat"><span class="prog-stat-val">${p.researchers}</span><span class="prog-stat-label">Hunters</span></div>
        <div class="prog-stat"><span class="prog-stat-val">${p.resolved}%</span><span class="prog-stat-label">Resolved</span></div>
        <div class="prog-stat"><span class="prog-stat-val" style="color:var(--green)">${p.bounty}</span><span class="prog-stat-label">Paid</span></div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.animate-on-scroll').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 80);
  });
}

// ---- Program Preview Modal ----
function openProgramPreview(id) {
  const p = programs.find(x => x.id === id);
  if (!p) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal" style="max-width:600px">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
        <div class="program-logo" style="width:60px;height:60px;font-size:2rem">${p.logo}</div>
        <div>
          <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:var(--text-primary)">${p.name}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">${p.category} · Active Program</div>
        </div>
        <span class="badge badge-low" style="margin-left:auto">Active</span>
      </div>
      <p style="font-family:var(--font-ui);color:var(--text-secondary);line-height:1.7;margin-bottom:1.5rem">${p.desc}</p>
      <h4 style="font-family:var(--font-heading);font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem">Reward Structure</h4>
      <div style="display:grid;gap:0.5rem;margin-bottom:1.5rem">
        ${p.rewards.map(r => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;background:var(--bg-card2);border-radius:8px;border:1px solid var(--border-glow)">
            <span style="font-family:var(--font-heading);font-size:0.75rem;color:${r.color}">${r.label}</span>
            <span style="font-family:var(--font-heading);font-size:0.8rem;color:var(--text-primary)">${r.range}</span>
          </div>
        `).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem">
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;color:var(--primary)">${p.submissions}</div><div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">Reports</div></div>
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;color:var(--primary)">${p.researchers}</div><div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">Hunters</div></div>
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;color:var(--accent-green)">${p.resolved}%</div><div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">Resolved</div></div>
        <div style="text-align:center"><div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;color:var(--accent-green)">${p.bounty}</div><div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">Paid Out</div></div>
      </div>
      <a href="login-researcher.html" class="btn btn-primary" style="width:100%;justify-content:center">
        <i class="fas fa-bug"></i> Start Hunting This Program
      </a>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ---- Filter Buttons ----
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderPrograms(this.dataset.filter);
  });
});

// ---- How It Works ----
const hiwData = {
  researcher: [
    { num: '01', icon: '👤', title: 'Create Free Account', desc: 'Sign up in minutes. Complete your profile and verify your identity to unlock all programs.' },
    { num: '02', icon: '🎯', title: 'Browse Programs', desc: 'Explore active bug bounty programs from Ethiopia\'s top organizations. Find targets that match your skills.' },
    { num: '03', icon: '🔍', title: 'Hunt & Discover', desc: 'Research the target within the defined scope. Use your skills to find vulnerabilities responsibly.' },
    { num: '04', icon: '💰', title: 'Submit & Earn', desc: 'Submit a detailed report. Get paid via Telebirr, CBE Birr, or bank transfer within 14 days.' }
  ],
  company: [
    { num: '01', icon: '🏢', title: 'Register Company', desc: 'Create your company account and verify your organization. Our team onboards you within 24 hours.' },
    { num: '02', icon: '⚙️', title: 'Define Program', desc: 'Set your scope, reward structure, and program rules. Our team helps you craft a compelling program.' },
    { num: '03', icon: '📥', title: 'Receive Reports', desc: 'Researchers submit validated vulnerability reports. AI-powered triage helps prioritize findings.' },
    { num: '04', icon: '🔒', title: 'Fix & Stay Secure', desc: 'Remediate vulnerabilities, reward researchers, and build a continuous security improvement cycle.' }
  ]
};

function renderHIW(role) {
  const container = document.getElementById('hiwContent');
  if (!container) return;
  container.innerHTML = `
    <div class="hiw-steps">
      ${hiwData[role].map(step => `
        <div class="hiw-step animate-on-scroll visible">
          <div class="hiw-num">${step.num}</div>
          <div class="hiw-icon">${step.icon}</div>
          <div class="hiw-title">${step.title}</div>
          <p class="hiw-desc">${step.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

document.querySelectorAll('.hiw-btn').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.hiw-btn').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    renderHIW(this.dataset.role);
  });
});

// ---- Leaderboard ----
function renderLeaderboard() {
  const table = document.getElementById('leaderboardTable');
  if (!table) return;
  const rankClass = r => r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : '';
  const rankIcon  = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`;

  table.innerHTML = `
    <div class="lb-row-head">
      <div>Rank</div>
      <div>Researcher</div>
      <div>Specialty</div>
      <div>Bugs</div>
      <div>Earnings</div>
      <div>Points</div>
    </div>
    ${leaderboardData.map(r => `
      <div class="lb-row">
        <div class="lb-rank ${rankClass(r.rank)}">${rankIcon(r.rank)}</div>
        <div style="display:flex;align-items:center;gap:0.75rem">
          <div class="lb-avatar">${r.avatar}</div>
          <div>
            <div class="lb-name">${r.country} ${r.name}</div>
            <div class="lb-handle">${r.handle}</div>
          </div>
        </div>
        <div style="font-size:0.8125rem;color:var(--text-3)">${r.specialty}</div>
        <div class="lb-bugs">${r.bugs} bugs</div>
        <div class="lb-earn">${r.earnings}</div>
        <div class="lb-pts">${r.points.toLocaleString()}</div>
      </div>
    `).join('')}
  `;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderPrograms();
  renderHIW('researcher');
  renderLeaderboard();
});
