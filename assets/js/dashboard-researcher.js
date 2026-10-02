/* ============================================
   ABYSSINIA SEC - Researcher Dashboard JS
   ============================================ */

'use strict';

// ---- State ----
let currentPage = 'overview';
let sidebarCollapsed = false;

// ---- User Data ----
const userData = JSON.parse(localStorage.getItem('absec_user') || '{}');
const user = {
  name: userData.name || 'Eth Hunter',
  handle: userData.handle || '@eth_hunter',
  avatar: userData.avatar || 'EH',
  rank: userData.rank || 12,
  points: userData.points || 6200,
  email: userData.email || 'hunter@example.com'
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  setUserInfo();
  loadPage('overview');
});

function setUserInfo() {
  ['sidebarAvatar', 'topbarAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = user.avatar;
  });
  ['sidebarName', 'topbarName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = user.name;
  });
}

// ---- Page Router ----
function loadPage(page) {
  currentPage = page;
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.sidebar-link[data-page="${page}"]`);
  if (link) link.classList.add('active');

  const pages = {
    overview: renderOverview,
    programs: renderPrograms,
    reports: renderReports,
    submit: renderSubmit,
    earnings: renderEarnings,
    payouts: renderPayouts,
    leaderboard: renderLeaderboard,
    profile: renderProfile,
    settings: renderSettings,
    notifications: renderNotifications,
  };

  const fn = pages[page];
  if (fn) fn();
  else renderOverview();

  // Close mobile sidebar on nav
  if (window.innerWidth <= 1024) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar?.classList.remove('mobile-open');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ============================================================
// OVERVIEW PAGE
// ============================================================
function renderOverview() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Welcome back, <span class="text-gradient">${user.name.split(' ')[0]}</span> 👋</h1>
        <p class="page-subtitle">${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="loadPage('programs')"><i class="fas fa-bullseye"></i> Browse Programs</button>
        <button class="btn btn-primary btn-sm" onclick="loadPage('submit')"><i class="fas fa-plus"></i> Submit Bug</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="dashboard-grid grid-cols-4" style="margin-bottom:1.5rem">
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Total Earnings</span>
          <div class="kpi-icon green"><i class="fas fa-coins"></i></div>
        </div>
        <div class="kpi-value">$4,820</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> +$800 this month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Reports Submitted</span>
          <div class="kpi-icon cyan"><i class="fas fa-bug"></i></div>
        </div>
        <div class="kpi-value">47</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> +3 this month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Acceptance Rate</span>
          <div class="kpi-icon purple"><i class="fas fa-chart-pie"></i></div>
        </div>
        <div class="kpi-value">74%</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> +2% vs last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Global Rank</span>
          <div class="kpi-icon yellow"><i class="fas fa-trophy"></i></div>
        </div>
        <div class="kpi-value">#${user.rank}</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> Up 4 positions</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid grid-cols-12" style="margin-bottom:1.5rem">
      <!-- Recent Reports -->
      <div class="widget-card col-span-8">
        <div class="widget-header">
          <span class="widget-title">Recent Reports</span>
          <button class="widget-action" onclick="loadPage('reports')">View All →</button>
        </div>
        <div class="report-list">
          ${recentReports().map(r => `
            <div class="report-item">
              <div class="report-icon" style="background:${r.iconBg}">${r.icon}</div>
              <div class="report-info">
                <div class="report-title">${r.title}</div>
                <div class="report-meta">${r.program} · ${r.date}</div>
              </div>
              <span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span>
              <span class="badge badge-${r.statusClass}">${r.status}</span>
              <span class="report-reward">${r.reward}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="widget-card col-span-4">
        <div class="widget-header">
          <span class="widget-title">Activity</span>
        </div>
        <div class="activity-feed">
          ${activityFeed().map((a, i) => `
            <div class="activity-item">
              <div class="activity-dot-wrapper">
                <div class="activity-dot ${a.color}"></div>
                ${i < activityFeed().length - 1 ? '<div class="activity-line"></div>' : ''}
              </div>
              <div class="activity-content">
                <div class="activity-text">${a.text}</div>
                <div class="activity-time">${a.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="dashboard-grid grid-cols-3">
      <!-- Severity Breakdown -->
      <div class="widget-card">
        <div class="widget-header">
          <span class="widget-title">Severity Breakdown</span>
        </div>
        <div class="severity-list">
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent-red)">Critical</span>
            <div class="severity-bar-wrap"><div class="severity-fill critical" style="width:0" data-width="18%"></div></div>
            <span class="severity-count">4</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent)">High</span>
            <div class="severity-bar-wrap"><div class="severity-fill high" style="width:0" data-width="30%"></div></div>
            <span class="severity-count">12</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:#ffc800">Medium</span>
            <div class="severity-bar-wrap"><div class="severity-fill medium" style="width:0" data-width="52%"></div></div>
            <span class="severity-count">18</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent-green)">Low</span>
            <div class="severity-bar-wrap"><div class="severity-fill low" style="width:0" data-width="70%"></div></div>
            <span class="severity-count">13</span>
          </div>
        </div>
        <div class="neon-line" style="margin-top:1.25rem"></div>
        <div style="display:flex;justify-content:space-between;margin-top:1rem;">
          <span style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted)">Total Accepted</span>
          <span style="font-family:var(--font-heading);font-size:0.85rem;color:var(--accent-green)">35 reports</span>
        </div>
      </div>

      <!-- Monthly Earnings Chart -->
      <div class="widget-card">
        <div class="widget-header">
          <span class="widget-title">Monthly Earnings</span>
          <span style="font-family:var(--font-heading);font-size:0.75rem;color:var(--accent-green)">$4,820 YTD</span>
        </div>
        <div class="chart-bar-group">
          ${[40,65,30,80,55,90,45,70,60,85,75,95].map((h, i) => `
            <div class="chart-bar" style="height:${h}%" title="${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}"></div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:0.75rem">
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jan</span>
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jun</span>
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Dec</span>
        </div>
      </div>

      <!-- Points Progress -->
      <div class="widget-card">
        <div class="widget-header">
          <span class="widget-title">Rank Progress</span>
          <span class="badge badge-info">#${user.rank}</span>
        </div>
        <div style="text-align:center;padding:1rem 0">
          <div style="font-family:var(--font-heading);font-size:2.5rem;font-weight:900;background:var(--gradient-btn);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.25rem">
            ${user.points.toLocaleString()}
          </div>
          <div style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted)">Total Points</div>
        </div>
        <div style="margin-bottom:0.5rem">
          <div style="display:flex;justify-content:space-between;font-family:var(--font-heading);font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.4rem">
            <span>Progress to #${user.rank - 1}</span>
            <span>62%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:0" data-width="62%"></div>
          </div>
        </div>
        <div style="font-family:var(--font-ui);font-size:0.78rem;color:var(--text-muted);text-align:center;margin-top:0.75rem">
          Need <strong style="color:var(--primary)">3,800 more points</strong> to reach Rank #${user.rank - 1}
        </div>
        <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
          ${[{label:'Programs', val:'8 active'},{label:'Badges', val:'6 earned'}].map(s => `
            <div style="background:var(--bg-card2);border:1px solid var(--border-glow);border-radius:8px;padding:0.75rem;text-align:center">
              <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:700;color:var(--primary)">${s.val}</div>
              <div style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Animate progress bars and severity bars after render
  setTimeout(() => {
    document.querySelectorAll('.severity-fill[data-width]').forEach(el => {
      el.style.width = el.dataset.width;
    });
    document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 200);
}

// ============================================================
// PROGRAMS PAGE
// ============================================================
function renderPrograms() {
  const programs = getPrograms();
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Bug Bounty <span class="text-gradient">Programs</span></h1>
        <p class="page-subtitle">Explore active programs and start earning rewards</p>
      </div>
    </div>

    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:2rem">
      <button class="filter-btn active" onclick="filterProgramsD(this,'all')">All Programs</button>
      <button class="filter-btn" onclick="filterProgramsD(this,'fintech')">FinTech</button>
      <button class="filter-btn" onclick="filterProgramsD(this,'telecom')">Telecom</button>
      <button class="filter-btn" onclick="filterProgramsD(this,'government')">Government</button>
    </div>

    <div class="dashboard-grid grid-cols-3" id="dashProgramsGrid">
      ${programs.map(p => `
        <div class="program-card" onclick="showProgramDetail('${p.id}')">
          <div class="program-header">
            <div>
              <div class="program-name">${p.name}</div>
              <div class="program-category">${p.category}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem">
              <div class="program-logo">${p.logo}</div>
              ${p.new ? '<span class="badge badge-new">New</span>' : ''}
            </div>
          </div>
          <p class="program-desc">${p.desc}</p>
          <div class="program-rewards">
            ${p.rewards.map(r => `<div class="reward-item"><div class="reward-dot" style="background:${r.color}"></div><span style="color:${r.color};font-size:0.7rem;font-family:var(--font-heading)">${r.label}: ${r.range}</span></div>`).join('')}
          </div>
          <div class="program-stats">
            <div class="program-stat"><span class="p-stat-num">${p.submissions}</span><span class="p-stat-label">Reports</span></div>
            <div class="program-stat"><span class="p-stat-num">${p.resolved}%</span><span class="p-stat-label">Resolved</span></div>
            <div class="program-stat"><span class="p-stat-num" style="color:var(--accent-green)">${p.bounty}</span><span class="p-stat-label">Paid</span></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function filterProgramsD(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const programs = getPrograms().filter(p => filter === 'all' || p.category === filter);
  const grid = document.getElementById('dashProgramsGrid');
  if (grid) grid.innerHTML = programs.map(p => `
    <div class="program-card" onclick="showProgramDetail('${p.id}')">
      <div class="program-header">
        <div><div class="program-name">${p.name}</div><div class="program-category">${p.category}</div></div>
        <div class="program-logo">${p.logo}</div>
      </div>
      <p class="program-desc">${p.desc}</p>
      <div class="program-rewards">${p.rewards.map(r => `<div class="reward-item"><div class="reward-dot" style="background:${r.color}"></div><span style="color:${r.color};font-size:0.7rem;font-family:var(--font-heading)">${r.label}: ${r.range}</span></div>`).join('')}</div>
      <div class="program-stats">
        <div class="program-stat"><span class="p-stat-num">${p.submissions}</span><span class="p-stat-label">Reports</span></div>
        <div class="program-stat"><span class="p-stat-num">${p.resolved}%</span><span class="p-stat-label">Resolved</span></div>
        <div class="program-stat"><span class="p-stat-num" style="color:var(--accent-green)">${p.bounty}</span><span class="p-stat-label">Paid</span></div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// REPORTS PAGE
// ============================================================
function renderReports() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">My <span class="text-gradient">Reports</span></h1>
        <p class="page-subtitle">Track all your vulnerability submissions</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="loadPage('submit')"><i class="fas fa-plus"></i> New Report</button>
    </div>

    <div class="widget-card" style="margin-bottom:1.5rem">
      <div class="tabs">
        <button class="tab-btn active" onclick="filterReports(this,'all')">All (47)</button>
        <button class="tab-btn" onclick="filterReports(this,'pending')">Pending (8)</button>
        <button class="tab-btn" onclick="filterReports(this,'accepted')">Accepted (35)</button>
        <button class="tab-btn" onclick="filterReports(this,'rejected')">Rejected (4)</button>
      </div>

      <div style="overflow-x:auto">
        <table class="data-table" id="reportsTable">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Title</th>
              <th>Program</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reward</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="reportsTableBody">
            ${getAllReports().map(r => `
              <tr>
                <td style="font-family:var(--font-heading);font-size:0.75rem;color:var(--primary)">${r.id}</td>
                <td style="color:var(--text-primary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.title}</td>
                <td>${r.program}</td>
                <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                <td><span class="badge badge-${r.statusClass}">${r.status}</span></td>
                <td style="font-family:var(--font-heading);color:var(--accent-green)">${r.reward}</td>
                <td>${r.date}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="viewReport('${r.id}')">View</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterReports(btn, filter) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function viewReport(id) {
  showToast(`Opening report ${id}...`, 'info');
}

// ============================================================
// SUBMIT BUG PAGE
// ============================================================
function renderSubmit() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Submit <span class="text-gradient">Vulnerability</span></h1>
        <p class="page-subtitle">Report a security vulnerability responsibly</p>
      </div>
    </div>

    <div class="dashboard-grid grid-cols-12">
      <div class="col-span-8 report-form-card">
        <form onsubmit="submitReport(event)">
          <div class="form-group">
            <label class="form-label">Select Program</label>
            <select class="form-select" required>
              <option value="" disabled selected>Choose a bug bounty program...</option>
              ${getPrograms().map(p => `<option value="${p.id}">${p.logo} ${p.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Vulnerability Title</label>
            <input type="text" class="form-input" placeholder="e.g., SQL Injection in /api/user/login endpoint" required/>
          </div>

          <div class="form-group">
            <label class="form-label">Severity</label>
            <div class="severity-selector">
              <div class="severity-option critical" onclick="selectSeverity(this,'critical')">
                <div class="severity-option-label" style="color:var(--accent-red)">Critical</div>
                <div class="severity-option-range">CVSS 9.0-10.0</div>
              </div>
              <div class="severity-option high" onclick="selectSeverity(this,'high')">
                <div class="severity-option-label" style="color:var(--accent)">High</div>
                <div class="severity-option-range">CVSS 7.0-8.9</div>
              </div>
              <div class="severity-option medium" onclick="selectSeverity(this,'medium')">
                <div class="severity-option-label" style="color:#ffc800">Medium</div>
                <div class="severity-option-range">CVSS 4.0-6.9</div>
              </div>
              <div class="severity-option low" onclick="selectSeverity(this,'low')">
                <div class="severity-option-label" style="color:var(--accent-green)">Low</div>
                <div class="severity-option-range">CVSS 0.1-3.9</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Vulnerability Type</label>
            <select class="form-select" required>
              <option value="" disabled selected>Select vulnerability type...</option>
              <option>SQL Injection</option>
              <option>Cross-Site Scripting (XSS)</option>
              <option>Cross-Site Request Forgery (CSRF)</option>
              <option>Server-Side Request Forgery (SSRF)</option>
              <option>Remote Code Execution (RCE)</option>
              <option>Authentication Bypass</option>
              <option>Insecure Direct Object Reference (IDOR)</option>
              <option>Information Disclosure</option>
              <option>Broken Access Control</option>
              <option>Business Logic Flaw</option>
              <option>Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Affected URL / Endpoint</label>
            <input type="text" class="form-input" placeholder="https://target.com/api/endpoint" required/>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" rows="5" placeholder="Describe the vulnerability in detail. Include what the issue is, where it exists, and why it's a security problem..." required style="min-height:140px"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Steps to Reproduce</label>
            <textarea class="form-input" rows="6" placeholder="1. Navigate to...&#10;2. Enter the payload...&#10;3. Observe the response..." required style="min-height:160px"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Impact</label>
            <textarea class="form-input" rows="3" placeholder="Explain the potential business impact if this vulnerability were exploited..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Recommended Fix</label>
            <textarea class="form-input" rows="3" placeholder="Suggest how to fix this vulnerability..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Proof of Concept (Attach files)</label>
            <div onclick="triggerFileUpload()" style="border:2px dashed var(--border-glow);border-radius:var(--radius);padding:2rem;text-align:center;cursor:pointer;transition:var(--transition)" id="dropzone">
              <div style="font-size:2rem;margin-bottom:0.5rem">📎</div>
              <div style="font-family:var(--font-heading);font-size:0.75rem;letter-spacing:0.08em;color:var(--text-secondary)">Drag & drop or click to upload</div>
              <div style="font-family:var(--font-ui);font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">Screenshots, videos, HTTP request/response logs</div>
              <input type="file" id="pocUpload" multiple accept="image/*,video/*,.txt,.log,.har" style="display:none" onchange="handleFileUpload(this)"/>
            </div>
            <div id="uploadedFiles" style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.4rem"></div>
          </div>

          <div style="display:flex;gap:1rem;margin-top:1.5rem">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-paper-plane"></i> Submit Report
            </button>
            <button type="button" class="btn btn-secondary" onclick="saveDraft()">
              <i class="fas fa-save"></i> Save Draft
            </button>
          </div>
        </form>
      </div>

      <!-- Sidebar Tips -->
      <div class="col-span-4">
        <div class="widget-card" style="margin-bottom:1rem">
          <div class="widget-header"><span class="widget-title">Submission Tips</span></div>
          <div style="display:flex;flex-direction:column;gap:0.75rem">
            ${[
              {icon:'🎯', tip:'Be specific about the vulnerable endpoint and parameters'},
              {icon:'🔁', tip:'Include clear, reproducible steps for the triage team'},
              {icon:'📸', tip:'Attach screenshots or screen recordings as proof'},
              {icon:'💡', tip:'Higher quality reports = faster acceptance + higher rewards'},
              {icon:'⚖️', tip:'Only test within the defined program scope'},
              {icon:'🔒', tip:'Do not disclose publicly until the issue is resolved'},
            ].map(t => `
              <div style="display:flex;gap:0.75rem;align-items:flex-start">
                <span style="font-size:1.1rem;flex-shrink:0">${t.icon}</span>
                <span style="font-family:var(--font-ui);font-size:0.82rem;color:var(--text-secondary);line-height:1.5">${t.tip}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="widget-card">
          <div class="widget-header"><span class="widget-title">Reward Estimate</span></div>
          <div id="rewardEstimate" style="text-align:center;padding:1rem">
            <div style="font-family:var(--font-heading);font-size:2rem;font-weight:900;color:var(--text-muted)">—</div>
            <div style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted)">Select a program and severity</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Dropzone hover
  const dz = document.getElementById('dropzone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = 'var(--primary)'; dz.style.background = 'rgba(0,245,255,0.03)'; });
    dz.addEventListener('dragleave', () => { dz.style.borderColor = ''; dz.style.background = ''; });
  }
}

function selectSeverity(el, sev) {
  document.querySelectorAll('.severity-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const ranges = { critical: '$2,000 – $10,000', high: '$500 – $2,000', medium: '$100 – $500', low: '$50 – $100' };
  const est = document.getElementById('rewardEstimate');
  if (est) est.innerHTML = `
    <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;background:var(--gradient-btn);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${ranges[sev]}</div>
    <div style="font-family:var(--font-ui);font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">Estimated for ${sev} severity</div>
  `;
}

function triggerFileUpload() { document.getElementById('pocUpload')?.click(); }

function handleFileUpload(input) {
  const container = document.getElementById('uploadedFiles');
  if (!container) return;
  Array.from(input.files).forEach(f => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0.875rem;background:var(--bg-card);border:1px solid var(--border-glow);border-radius:8px';
    item.innerHTML = `<i class="fas fa-file" style="color:var(--primary)"></i><span style="font-family:var(--font-ui);font-size:0.82rem;color:var(--text-secondary);flex:1">${f.name}</span><span style="font-family:var(--font-ui);font-size:0.72rem;color:var(--text-muted)">${(f.size/1024).toFixed(1)}KB</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer">✕</button>`;
    container.appendChild(item);
  });
}

async function submitReport(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  btn.innerHTML = '<div class="spinner" style="display:block;width:16px;height:16px;border:2px solid rgba(2,6,16,0.3);border-top-color:var(--bg-dark);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto"></div>';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 2000));
  showToast('🎉 Report submitted successfully! ID: #ABY-2024-' + Math.floor(1000+Math.random()*9000), 'success', 6000);
  loadPage('reports');
}

function saveDraft() { showToast('Draft saved locally', 'info'); }

// ============================================================
// EARNINGS PAGE
// ============================================================
function renderEarnings() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">My <span class="text-gradient">Earnings</span></h1>
        <p class="page-subtitle">Track your bounty rewards and payment history</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="loadPage('payouts')"><i class="fas fa-wallet"></i> Request Payout</button>
    </div>

    <div class="dashboard-grid grid-cols-4" style="margin-bottom:1.5rem">
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Total Earned</span><div class="kpi-icon green"><i class="fas fa-coins"></i></div></div><div class="kpi-value">$4,820</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> All time</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">This Month</span><div class="kpi-icon cyan"><i class="fas fa-calendar"></i></div></div><div class="kpi-value">$800</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> +12%</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Pending</span><div class="kpi-icon yellow"><i class="fas fa-clock"></i></div></div><div class="kpi-value">$350</div><div class="kpi-change" style="color:var(--text-muted)">Under review</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Avg per Bug</span><div class="kpi-icon purple"><i class="fas fa-chart-bar"></i></div></div><div class="kpi-value">$138</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> +$22 vs avg</div></div>
    </div>

    <div class="widget-card">
      <div class="widget-header"><span class="widget-title">Payment History</span></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Transaction ID</th><th>Report</th><th>Program</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${paymentHistory().map(p => `
              <tr>
                <td style="font-family:var(--font-heading);font-size:0.72rem;color:var(--primary)">${p.txId}</td>
                <td style="color:var(--text-primary)">${p.report}</td>
                <td>${p.program}</td>
                <td style="font-family:var(--font-heading);font-weight:700;color:var(--accent-green)">${p.amount}</td>
                <td><span class="badge badge-info">${p.method}</span></td>
                <td>${p.date}</td>
                <td><span class="badge badge-${p.statusClass}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ============================================================
// PAYOUTS PAGE
// ============================================================
function renderPayouts() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Payout <span class="text-gradient">Settings</span></h1>
        <p class="page-subtitle">Manage your payment methods</p>
      </div>
    </div>
    <div class="dashboard-grid grid-cols-2">
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Available Balance</span></div>
        <div style="text-align:center;padding:2rem 0">
          <div style="font-family:var(--font-heading);font-size:3rem;font-weight:900;background:var(--gradient-btn);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">$1,240</div>
          <div style="font-family:var(--font-ui);color:var(--text-muted);margin-bottom:2rem">Available for withdrawal</div>
          <button class="btn btn-primary" onclick="showToast('Payout requested! Processing in 1-3 business days.','success')">
            <i class="fas fa-money-bill-wave"></i> Withdraw Now
          </button>
        </div>
      </div>
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Payment Methods</span></div>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${[
            {icon:'📱', name:'Telebirr', detail:'**** 4521', primary:true},
            {icon:'🏦', name:'CBE Birr', detail:'**** 8834', primary:false},
            {icon:'💳', name:'Bank Transfer', detail:'Awash Bank — **** 2291', primary:false},
          ].map(m => `
            <div style="display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--bg-card2);border:1px solid ${m.primary?'var(--primary)':'var(--border-glow)'};border-radius:var(--radius)">
              <span style="font-size:1.5rem">${m.icon}</span>
              <div style="flex:1">
                <div style="font-family:var(--font-heading);font-size:0.82rem;color:var(--text-primary)">${m.name}</div>
                <div style="font-family:var(--font-ui);font-size:0.75rem;color:var(--text-muted)">${m.detail}</div>
              </div>
              ${m.primary ? '<span class="badge badge-info">Primary</span>' : '<button class="btn btn-ghost btn-sm" onclick="showToast(\'Set as primary payment method\',\'info\')">Set Primary</button>'}
            </div>
          `).join('')}
          <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem" onclick="showToast('Add payment method — feature coming soon!','info')">
            <i class="fas fa-plus"></i> Add Payment Method
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// LEADERBOARD PAGE
// ============================================================
function renderLeaderboard() {
  const data = getLeaderboard();
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Global <span class="text-gradient">Leaderboard</span></h1>
        <p class="page-subtitle">Top security researchers on Abyssinia Sec</p>
      </div>
    </div>
    <div class="widget-card">
      <div class="lb-header" style="display:grid;grid-template-columns:60px 1fr 100px 100px 140px 100px">
        <div>Rank</div><div>Researcher</div><div>Specialty</div><div>Bugs</div><div>Earnings</div><div>Points</div>
      </div>
      ${data.map(r => {
        const isMe = r.rank === user.rank;
        return `
          <div class="lb-row" style="display:grid;grid-template-columns:60px 1fr 100px 100px 140px 100px;${isMe?'background:rgba(0,245,255,0.05);border-left:3px solid var(--primary);':''}">
            <div class="lb-rank ${r.rank===1?'gold':r.rank===2?'silver':r.rank===3?'bronze':''}">${r.rank<=3?['🥇','🥈','🥉'][r.rank-1]:r.rank}</div>
            <div class="lb-researcher">
              <div class="lb-avatar">${r.avatar}</div>
              <div>
                <div class="lb-name">${r.country} ${r.name} ${isMe?'<span style="font-size:0.65rem;color:var(--primary)">(You)</span>':''}</div>
                <div class="lb-handle">${r.handle}</div>
              </div>
            </div>
            <div style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted)">${r.specialty}</div>
            <div class="lb-bugs">${r.bugs}</div>
            <div class="lb-earnings">${r.earnings}</div>
            <div class="lb-points">${r.points.toLocaleString()}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================
// PROFILE PAGE
// ============================================================
function renderProfile() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">My <span class="text-gradient">Profile</span></h1>
        <p class="page-subtitle">Public researcher profile</p>
      </div>
      <button class="btn btn-secondary btn-sm"><i class="fas fa-eye"></i> View Public Profile</button>
    </div>
    <div class="dashboard-grid grid-cols-12">
      <div class="col-span-4 widget-card" style="text-align:center">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--gradient-btn);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:1.8rem;font-weight:800;color:var(--bg-dark);margin:0 auto 1rem;border:3px solid var(--border-glow-strong);box-shadow:var(--shadow-glow)">${user.avatar}</div>
        <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-bottom:0.25rem">${user.name}</div>
        <div style="font-family:var(--font-ui);font-size:0.85rem;color:var(--primary);margin-bottom:0.25rem">${user.handle}</div>
        <div style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted);margin-bottom:1.5rem">🇪🇹 Addis Ababa, Ethiopia</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.5rem">
          ${[{v:'#12',l:'Global Rank'},{v:'6,200',l:'Points'},{v:'35',l:'Accepted'},{v:'$4,820',l:'Earned'}].map(s=>`<div style="background:var(--bg-card2);border:1px solid var(--border-glow);border-radius:8px;padding:0.75rem"><div style="font-family:var(--font-heading);font-size:1rem;font-weight:700;color:var(--primary)">${s.v}</div><div style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">${s.l}</div></div>`).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:0.4rem">
          ${[{icon:'fa-twitter',label:'Twitter'},{icon:'fa-github',label:'GitHub'},{icon:'fa-linkedin',label:'LinkedIn'}].map(s=>`<button class="btn btn-ghost btn-sm" onclick="showToast('Connect ${s.label} account','info')"><i class="fab ${s.icon}"></i> Connect ${s.label}</button>`).join('')}
        </div>
      </div>
      <div class="col-span-8">
        <div class="widget-card" style="margin-bottom:1rem">
          <div class="widget-header"><span class="widget-title">Edit Profile</span></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">First Name</label><input type="text" class="form-input" value="${user.name.split(' ')[0]}"/></div>
            <div class="form-group"><label class="form-label">Last Name</label><input type="text" class="form-input" value="${user.name.split(' ')[1]||''}"/></div>
          </div>
          <div class="form-group"><label class="form-label">Username</label><input type="text" class="form-input" value="${user.handle}"/></div>
          <div class="form-group"><label class="form-label">Bio</label><textarea class="form-input" rows="3" placeholder="Tell companies about your security expertise..."></textarea></div>
          <div class="form-group"><label class="form-label">Skills</label><input type="text" class="form-input" placeholder="Web, API, Mobile, Network, OSINT..." value="Web, API Security, XSS, SQL Injection"/></div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Profile updated successfully!','success')"><i class="fas fa-save"></i> Save Changes</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function renderSettings() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Account <span class="text-gradient">Settings</span></h1></div>
    </div>
    <div class="dashboard-grid grid-cols-2">
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Security</span></div>
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-group"><label class="form-label">Current Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
          <div class="form-group"><label class="form-label">New Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
          <div class="form-group"><label class="form-label">Confirm New Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Password updated!','success')"><i class="fas fa-lock"></i> Update Password</button>
        </div>
      </div>
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Notifications</span></div>
        <div style="display:flex;flex-direction:column;gap:1rem">
          ${['Report status updates','New program alerts','Reward payments','Community mentions','Weekly digest'].map(n=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--bg-card2);border-radius:8px;border:1px solid var(--border-glow)">
              <span style="font-family:var(--font-ui);font-size:0.88rem;color:var(--text-secondary)">${n}</span>
              <label style="cursor:pointer;display:flex;align-items:center;gap:0.5rem">
                <input type="checkbox" checked style="accent-color:var(--primary);width:16px;height:16px">
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div style="margin-top:1.5rem;padding:1.5rem;background:rgba(255,51,102,0.05);border:1px solid rgba(255,51,102,0.2);border-radius:var(--radius-lg)">
      <h3 style="font-family:var(--font-heading);font-size:0.85rem;color:var(--accent-red);margin-bottom:0.5rem">Danger Zone</h3>
      <p style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem">Permanently delete your account and all associated data.</p>
      <button class="btn btn-danger btn-sm" onclick="showToast('Contact support to delete your account','warning')"><i class="fas fa-trash"></i> Delete Account</button>
    </div>
  `;
}

// ============================================================
// NOTIFICATIONS PAGE
// ============================================================
function renderNotifications() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><span class="text-gradient">Notifications</span></h1></div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('All notifications marked as read','success')">Mark all read</button>
    </div>
    <div class="widget-card">
      ${[
        {icon:'✅',color:'green',title:'Report Accepted',text:'Your report #ABY-2024-0891 "Authentication Bypass in Telebirr App" has been accepted.',time:'2 hours ago',unread:true},
        {icon:'💰',color:'green',title:'Reward Paid',text:'$800 has been transferred to your Telebirr wallet for report #ABY-2024-0888.',time:'5 hours ago',unread:true},
        {icon:'🚀',color:'cyan',title:'New Program',text:'Awash Bank has launched a new bug bounty program with rewards up to $5,000.',time:'1 day ago',unread:true},
        {icon:'💬',color:'yellow',title:'New Comment',text:'CBE Security Team commented on your report #ABY-2024-0887.',time:'2 days ago',unread:false},
        {icon:'🏆',color:'purple',title:'Rank Improved',text:'Congratulations! You\'ve moved up to Rank #12 on the global leaderboard.',time:'3 days ago',unread:false},
        {icon:'🔍',color:'cyan',title:'Report Under Review',text:'Your report #ABY-2024-0892 is now being reviewed by the Ethiopian Airlines team.',time:'4 days ago',unread:false},
      ].map(n => `
        <div style="display:flex;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(0,245,255,0.05);${n.unread?'background:rgba(0,245,255,0.02);':''}cursor:pointer;transition:all 0.2s" onmouseover="this.style.paddingLeft='1.75rem'" onmouseout="this.style.paddingLeft='1.25rem'">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(0,245,255,0.08);border:1px solid var(--border-glow);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${n.icon}</div>
          <div style="flex:1">
            <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:600;color:var(--text-primary);margin-bottom:0.25rem">${n.title} ${n.unread?'<span style="display:inline-block;width:6px;height:6px;background:var(--primary);border-radius:50%;margin-left:0.4rem;vertical-align:middle"></span>':''}</div>
            <div style="font-family:var(--font-ui);font-size:0.83rem;color:var(--text-secondary);line-height:1.5;margin-bottom:0.2rem">${n.text}</div>
            <div style="font-family:var(--font-ui);font-size:0.72rem;color:var(--text-muted)">${n.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// SIDEBAR & UI HELPERS
// ============================================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  const icon = document.getElementById('sidebarToggleIcon');
  sidebarCollapsed = !sidebarCollapsed;
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
  main.classList.toggle('expanded', sidebarCollapsed);
  if (icon) {
    icon.classList.toggle('fa-chevron-left', !sidebarCollapsed);
    icon.classList.toggle('fa-chevron-right', sidebarCollapsed);
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = sidebar.classList.toggle('mobile-open');
  if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleNotif() {
  document.getElementById('notifDropdown')?.classList.toggle('open');
}

function markAllRead() {
  showToast('All notifications marked as read', 'success');
  document.getElementById('notifDropdown')?.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#notifDropdown') && !e.target.closest('[onclick="toggleNotif()"]')) {
    document.getElementById('notifDropdown')?.classList.remove('open');
  }
});

// ============================================================
// MOCK DATA
// ============================================================
function recentReports() {
  return [
    { icon:'🐛', iconBg:'rgba(255,51,102,0.1)', title:'SQL Injection in /api/v2/users endpoint', program:'CBE App', date:'2 days ago', severity:'Critical', statusClass:'low', status:'Accepted', reward:'$2,500' },
    { icon:'🔓', iconBg:'rgba(255,107,53,0.1)', title:'Authentication bypass via JWT manipulation', program:'Telebirr', date:'4 days ago', severity:'High', statusClass:'info', status:'Triaging', reward:'$800' },
    { icon:'🌐', iconBg:'rgba(255,200,0,0.1)', title:'Stored XSS in user profile bio field', program:'Ethio Telecom', date:'1 week ago', severity:'Medium', statusClass:'low', status:'Accepted', reward:'$300' },
    { icon:'📧', iconBg:'rgba(0,245,255,0.1)', title:'Email enumeration via password reset', program:'Awash Bank', date:'1 week ago', severity:'Low', statusClass:'medium', status:'Pending', reward:'$—' },
    { icon:'🔄', iconBg:'rgba(123,47,255,0.1)', title:'SSRF via webhook URL parameter', program:'EthSwitch', date:'2 weeks ago', severity:'High', statusClass:'low', status:'Accepted', reward:'$1,200' },
  ];
}

function getAllReports() {
  return [
    { id:'#ABY-2024-0892', title:'SQL Injection in /api/v2/users', program:'CBE App', severity:'Critical', statusClass:'low', status:'Accepted', reward:'$2,500', date:'Oct 1, 2024' },
    { id:'#ABY-2024-0891', title:'Authentication bypass via JWT', program:'Telebirr', severity:'High', statusClass:'info', status:'Triaging', reward:'$—', date:'Sep 28, 2024' },
    { id:'#ABY-2024-0888', title:'Stored XSS in profile bio', program:'Ethio Telecom', severity:'Medium', statusClass:'low', status:'Accepted', reward:'$300', date:'Sep 22, 2024' },
    { id:'#ABY-2024-0885', title:'Email enumeration via reset', program:'Awash Bank', severity:'Low', statusClass:'medium', status:'Pending', reward:'$—', date:'Sep 20, 2024' },
    { id:'#ABY-2024-0880', title:'SSRF via webhook URL', program:'EthSwitch', severity:'High', statusClass:'low', status:'Accepted', reward:'$1,200', date:'Sep 15, 2024' },
    { id:'#ABY-2024-0875', title:'IDOR in order history endpoint', program:'Ethiopian Airlines', severity:'Medium', statusClass:'low', status:'Accepted', reward:'$450', date:'Sep 10, 2024' },
    { id:'#ABY-2024-0870', title:'Reflected XSS in search param', program:'Telebirr', severity:'Low', statusClass:'new', status:'Duplicate', reward:'$—', date:'Sep 5, 2024' },
  ];
}

function paymentHistory() {
  return [
    { txId:'TXN-8821', report:'#ABY-2024-0892', program:'CBE App', amount:'$2,500', method:'Telebirr', date:'Oct 1, 2024', statusClass:'low', status:'Completed' },
    { txId:'TXN-8810', report:'#ABY-2024-0880', program:'EthSwitch', amount:'$1,200', method:'CBE Birr', date:'Sep 17, 2024', statusClass:'low', status:'Completed' },
    { txId:'TXN-8795', report:'#ABY-2024-0875', program:'Ethiopian Airlines', amount:'$450', method:'Telebirr', date:'Sep 12, 2024', statusClass:'low', status:'Completed' },
    { txId:'TXN-8780', report:'#ABY-2024-0888', program:'Ethio Telecom', amount:'$300', method:'Bank Transfer', date:'Sep 8, 2024', statusClass:'low', status:'Completed' },
    { txId:'TXN-8765', report:'#ABY-2024-0860', program:'CBE App', amount:'$370', method:'Telebirr', date:'Aug 28, 2024', statusClass:'low', status:'Completed' },
  ];
}

function activityFeed() {
  return [
    { color:'green', text: '<strong>$2,500</strong> reward paid for #ABY-2024-0892', time: '2 hours ago' },
    { color:'cyan', text: 'Report <strong>#ABY-2024-0892</strong> accepted by CBE', time: '5 hours ago' },
    { color:'yellow', text: 'Report <strong>#ABY-2024-0891</strong> is being triaged', time: '1 day ago' },
    { color:'purple', text: 'You submitted report to <strong>Awash Bank</strong>', time: '2 days ago' },
    { color:'green', text: 'Rank improved to <strong>#12</strong> 🎉', time: '3 days ago' },
  ];
}

function getLeaderboard() {
  return [
    { rank:1, name:'Yohannes Tesfaye', handle:'@yohannes_sec', avatar:'YT', points:12480, bugs:142, earnings:'$18,420', country:'🇪🇹', specialty:'Web, API' },
    { rank:2, name:'Meron Alemu', handle:'@meron_hack', avatar:'MA', points:10920, bugs:118, earnings:'$15,800', country:'🇪🇹', specialty:'Mobile, Auth' },
    { rank:3, name:'Dawit Bekele', handle:'@dawit_0x', avatar:'DB', points:9870, bugs:103, earnings:'$14,200', country:'🇪🇹', specialty:'Network' },
    { rank:4, name:'Selam Girma', handle:'@selam_bug', avatar:'SG', points:8540, bugs:89, earnings:'$11,600', country:'🇪🇹', specialty:'XSS, SQLi' },
    { rank:5, name:'Biruk Haile', handle:'@biruk_sec', avatar:'BH', points:7890, bugs:76, earnings:'$10,100', country:'🇪🇹', specialty:'IoT' },
    { rank:6, name:'Tigist Worku', handle:'@tigist_w', avatar:'TW', points:7200, bugs:71, earnings:'$9,400', country:'🇪🇹', specialty:'Web, SSRF' },
    { rank:7, name:'Abel Tadesse', handle:'@abel_xss', avatar:'AT', points:6540, bugs:65, earnings:'$8,200', country:'🇰🇪', specialty:'XSS, SQLi' },
    { rank:12, name:user.name, handle:user.handle, avatar:user.avatar, points:user.points, bugs:35, earnings:'$4,820', country:'🇪🇹', specialty:'Web, API' },
  ];
}

function getPrograms() {
  return [
    { id:'p1', name:'Commercial Bank of Ethiopia', category:'fintech', logo:'🏦', desc:'CBE mobile banking, internet banking and core API infrastructure.', rewards:[{label:'Critical',color:'#ff3366',range:'$2,000–$10,000'},{label:'High',color:'#ff6b35',range:'$500–$2,000'}], submissions:342, researchers:89, resolved:94, bounty:'$28K', new:false },
    { id:'p2', name:'Telebirr (Ethio Telecom)', category:'fintech', logo:'📱', desc:'Ethiopia\'s largest mobile money platform. Mobile apps, APIs, web portals.', rewards:[{label:'Critical',color:'#ff3366',range:'$3,000–$10,000'},{label:'High',color:'#ff6b35',range:'$1,000–$3,000'}], submissions:521, researchers:134, resolved:91, bounty:'$45K', new:false },
    { id:'p3', name:'Awash Bank Digital', category:'fintech', logo:'💳', desc:'Digital banking suite including mobile apps and payment gateway.', rewards:[{label:'Critical',color:'#ff3366',range:'$1,500–$7,500'},{label:'High',color:'#ff6b35',range:'$300–$1,500'}], submissions:189, researchers:63, resolved:88, bounty:'$14K', new:true },
    { id:'p4', name:'Ethiopian Airlines', category:'ecommerce', logo:'✈️', desc:'Booking system, loyalty app, and APIs.', rewards:[{label:'Critical',color:'#ff3366',range:'$2,500–$8,000'},{label:'High',color:'#ff6b35',range:'$500–$2,500'}], submissions:276, researchers:78, resolved:85, bounty:'$22K', new:true },
    { id:'p5', name:'Ethio Telecom Enterprise', category:'telecom', logo:'📡', desc:'Enterprise portals and network management systems.', rewards:[{label:'Critical',color:'#ff3366',range:'$5,000–$15,000'},{label:'High',color:'#ff6b35',range:'$1,000–$5,000'}], submissions:412, researchers:112, resolved:90, bounty:'$38K', new:false },
    { id:'p6', name:'EthSwitch Payment', category:'fintech', logo:'🔄', desc:'National interbank payment switch. High rewards for critical findings.', rewards:[{label:'Critical',color:'#ff3366',range:'$5,000–$20,000'},{label:'High',color:'#ff6b35',range:'$1,500–$5,000'}], submissions:198, researchers:56, resolved:96, bounty:'$31K', new:false },
  ];
}

function showProgramDetail(id) {
  showToast(`Opening program details...`, 'info');
}
