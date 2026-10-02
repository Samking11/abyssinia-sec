/* ============================================
   ABYSSINIA SEC - Company Dashboard JS
   ============================================ */

'use strict';

// ---- State ----
let currentPage = 'overview';
let sidebarCollapsed = false;

// ---- Company Data ----
const companyData = JSON.parse(localStorage.getItem('absec_company') || '{}');
const company = {
  name: companyData.name || 'CBE Security',
  email: companyData.email || 'security@cbe.et',
  plan: companyData.plan || 'Enterprise',
  avatar: companyData.avatar || 'CB'
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  setCompanyInfo();
  loadPage('overview');
});

function setCompanyInfo() {
  ['sidebarAvatar', 'topbarAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = company.avatar;
  });
  ['sidebarName', 'topbarName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = company.name;
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
    'new-program': renderNewProgram,
    payouts: renderPayouts,
    billing: renderBilling,
    analytics: renderAnalytics,
    researchers: renderResearchers,
    settings: renderSettings,
    notifications: renderNotifications,
  };

  const fn = pages[page];
  if (fn) fn();
  else renderOverview();

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
        <h1 class="page-title">Security <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Overview</span></h1>
        <p class="page-subtitle">${company.name} · ${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="loadPage('reports')"><i class="fas fa-inbox"></i> Reports Inbox</button>
        <button class="btn btn-sm" onclick="loadPage('new-program')" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.5rem 1.2rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.75rem;letter-spacing:0.08em;cursor:pointer;display:flex;align-items:center;gap:0.5rem"><i class="fas fa-plus"></i> New Program</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="dashboard-grid grid-cols-4" style="margin-bottom:1.5rem">
      <div class="kpi-card">
        <div class="kpi-header"><span class="kpi-label">Open Reports</span><div class="kpi-icon red"><i class="fas fa-inbox"></i></div></div>
        <div class="kpi-value" style="color:var(--accent-red)">12</div>
        <div class="kpi-change down"><i class="fas fa-arrow-up"></i> +3 new today</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><span class="kpi-label">Resolved This Month</span><div class="kpi-icon green"><i class="fas fa-check-circle"></i></div></div>
        <div class="kpi-value">28</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> 93% resolution rate</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><span class="kpi-label">Budget Used</span><div class="kpi-icon yellow"><i class="fas fa-coins"></i></div></div>
        <div class="kpi-value">$14.2K</div>
        <div class="kpi-change" style="color:#ffc800"><i class="fas fa-chart-pie"></i> 71% of monthly budget</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><span class="kpi-label">Active Researchers</span><div class="kpi-icon purple"><i class="fas fa-users"></i></div></div>
        <div class="kpi-value">134</div>
        <div class="kpi-change up"><i class="fas fa-arrow-up"></i> +22 this month</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="dashboard-grid grid-cols-12" style="margin-bottom:1.5rem">
      <!-- Reports Inbox -->
      <div class="widget-card col-span-8">
        <div class="widget-header">
          <span class="widget-title">Recent Reports</span>
          <button class="widget-action" onclick="loadPage('reports')">View All →</button>
        </div>
        <div class="report-list">
          ${getInboxReports().map(r => `
            <div class="report-item">
              <div class="report-icon" style="background:${r.iconBg}">${r.icon}</div>
              <div class="report-info">
                <div class="report-title">${r.title}</div>
                <div class="report-meta">${r.researcher} · ${r.date}</div>
              </div>
              <span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span>
              <span class="badge badge-${r.statusClass}">${r.status}</span>
              <div style="display:flex;gap:0.4rem">
                <button class="btn btn-success btn-sm" onclick="acceptReport('${r.id}')">Accept</button>
                <button class="btn btn-ghost btn-sm" onclick="viewReportDetail('${r.id}')">View</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="col-span-4 widget-card">
        <div class="widget-header"><span class="widget-title">Severity Breakdown</span></div>
        <div class="severity-list">
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent-red)">Critical</span>
            <div class="severity-bar-wrap"><div class="severity-fill critical" style="width:0" data-width="15%"></div></div>
            <span class="severity-count">3</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent)">High</span>
            <div class="severity-bar-wrap"><div class="severity-fill high" style="width:0" data-width="35%"></div></div>
            <span class="severity-count">9</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:#ffc800">Medium</span>
            <div class="severity-bar-wrap"><div class="severity-fill medium" style="width:0" data-width="60%"></div></div>
            <span class="severity-count">11</span>
          </div>
          <div class="severity-item">
            <span class="severity-label" style="color:var(--accent-green)">Low</span>
            <div class="severity-bar-wrap"><div class="severity-fill low" style="width:0" data-width="80%"></div></div>
            <span class="severity-count">19</span>
          </div>
        </div>

        <div class="neon-line" style="margin:1.25rem 0"></div>

        <div class="widget-header" style="margin-bottom:1rem"><span class="widget-title">Active Programs</span></div>
        ${getMyPrograms().map(p => `
          <div class="program-list-item" onclick="loadPage('programs')">
            <div class="program-list-icon">${p.logo}</div>
            <div class="program-list-info">
              <div class="program-list-name">${p.name}</div>
              <div class="program-list-stats">
                <span>${p.reports} reports</span>
                <span>${p.researchers} hunters</span>
              </div>
            </div>
            <span class="badge badge-${p.statusClass}">${p.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="dashboard-grid grid-cols-3">
      <!-- Budget Chart -->
      <div class="widget-card">
        <div class="widget-header">
          <span class="widget-title">Monthly Spending</span>
          <span style="font-family:var(--font-heading);font-size:0.75rem;color:#a855f7">$20K budget</span>
        </div>
        <div class="chart-bar-group">
          ${[45,70,35,85,60,90,50,75,65,88,80,95].map((h,i) => `
            <div class="chart-bar" style="height:${h}%;background:linear-gradient(135deg,#7b2fff,#ff6b35)" title="${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}"></div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:0.75rem">
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jan</span>
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jun</span>
          <span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Dec</span>
        </div>
      </div>

      <!-- SLA Status -->
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">SLA Compliance</span><span class="badge badge-low">Good</span></div>
        <div style="text-align:center;padding:1.5rem 0">
          <div style="font-family:var(--font-heading);font-size:3rem;font-weight:900;color:var(--accent-green)">94%</div>
          <div style="font-family:var(--font-ui);font-size:0.8rem;color:var(--text-muted)">Reports responded within SLA</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.6rem">
          ${[
            {label:'Critical — 24hr SLA',pct:100,col:'var(--accent-red)'},
            {label:'High — 72hr SLA',pct:88,col:'var(--accent)'},
            {label:'Medium — 7d SLA',pct:96,col:'#ffc800'},
            {label:'Low — 14d SLA',pct:98,col:'var(--accent-green)'},
          ].map(s => `
            <div>
              <div style="display:flex;justify-content:space-between;font-family:var(--font-ui);font-size:0.72rem;color:var(--text-muted);margin-bottom:0.25rem"><span>${s.label}</span><span style="color:${s.col}">${s.pct}%</span></div>
              <div class="progress-bar"><div class="progress-fill" style="width:${s.pct}%;background:${s.col}"></div></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Activity -->
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Activity Feed</span></div>
        <div class="activity-feed">
          ${companyActivity().map((a, i) => `
            <div class="activity-item">
              <div class="activity-dot-wrapper">
                <div class="activity-dot ${a.color}"></div>
                ${i < companyActivity().length - 1 ? '<div class="activity-line"></div>' : ''}
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
  `;

  setTimeout(() => {
    document.querySelectorAll('.severity-fill[data-width]').forEach(el => { el.style.width = el.dataset.width; });
  }, 200);
}

// ============================================================
// PROGRAMS PAGE
// ============================================================
function renderPrograms() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">My <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Programs</span></h1></div>
      <button class="btn btn-sm" onclick="loadPage('new-program')" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.5rem 1.2rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.75rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem"><i class="fas fa-plus"></i> New Program</button>
    </div>
    <div class="dashboard-grid grid-cols-2">
      ${getAllPrograms().map(p => `
        <div class="widget-card" style="cursor:pointer">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem">
            <div style="display:flex;align-items:center;gap:0.875rem">
              <div class="program-logo">${p.logo}</div>
              <div>
                <div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:700;color:var(--text-primary)">${p.name}</div>
                <div style="font-family:var(--font-ui);font-size:0.75rem;color:var(--text-muted)">${p.scope}</div>
              </div>
            </div>
            <span class="badge badge-${p.statusClass}">${p.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.25rem">
            ${[{v:p.reports,l:'Reports'},{v:p.open,l:'Open'},{v:p.resolved+'%',l:'Resolved'},{v:p.spent,l:'Spent'}].map(s=>`<div style="text-align:center;background:var(--bg-card2);border:1px solid var(--border-glow);border-radius:8px;padding:0.6rem"><div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:700;color:var(--primary)">${s.v}</div><div style="font-family:var(--font-ui);font-size:0.62rem;color:var(--text-muted);text-transform:uppercase">${s.l}</div></div>`).join('')}
          </div>
          <div style="display:flex;gap:0.5rem">
            <button class="btn btn-secondary btn-sm" onclick="loadPage('reports')"><i class="fas fa-inbox"></i> View Reports</button>
            <button class="btn btn-ghost btn-sm" onclick="editProgram('${p.name}')"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="toggleProgram('${p.name}')" style="${p.statusClass==='low'?'color:var(--accent-red)':'color:var(--accent-green)'}">
              <i class="fas fa-${p.statusClass==='low'?'pause':'play'}"></i> ${p.statusClass==='low'?'Pause':'Resume'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function editProgram(name) { showToast(`Editing program: ${name}`, 'info'); }
function toggleProgram(name) { showToast(`Program status toggled for: ${name}`, 'info'); }

// ============================================================
// REPORTS INBOX
// ============================================================
function renderReports() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Reports <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Inbox</span></h1><p class="page-subtitle">Review and triage incoming vulnerability reports</p></div>
    </div>

    <div class="widget-card">
      <div class="tabs">
        <button class="tab-btn active" onclick="filterCompanyReports(this,'all')">All (42)</button>
        <button class="tab-btn" onclick="filterCompanyReports(this,'new')">New (12)</button>
        <button class="tab-btn" onclick="filterCompanyReports(this,'triaging')">Triaging (8)</button>
        <button class="tab-btn" onclick="filterCompanyReports(this,'accepted')">Accepted (18)</button>
        <button class="tab-btn" onclick="filterCompanyReports(this,'resolved')">Resolved (4)</button>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Title</th><th>Researcher</th><th>Severity</th><th>Status</th><th>Program</th><th>Submitted</th><th>Actions</th></tr></thead>
          <tbody>
            ${getCompanyReports().map(r => `
              <tr>
                <td style="font-family:var(--font-heading);font-size:0.72rem;color:#a855f7">${r.id}</td>
                <td style="color:var(--text-primary);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.title}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:0.5rem">
                    <div style="width:24px;height:24px;border-radius:50%;background:var(--gradient-btn);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.6rem;font-weight:700;color:var(--bg-dark)">${r.resAvatar}</div>
                    <span style="font-family:var(--font-ui);font-size:0.82rem">${r.researcher}</span>
                  </div>
                </td>
                <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
                <td><span class="badge badge-${r.statusClass}">${r.status}</span></td>
                <td style="font-family:var(--font-ui);font-size:0.82rem">${r.program}</td>
                <td style="font-family:var(--font-ui);font-size:0.8rem">${r.date}</td>
                <td>
                  <div style="display:flex;gap:0.4rem">
                    <button class="btn btn-success btn-sm" onclick="acceptReport('${r.id}')">Accept</button>
                    <button class="btn btn-ghost btn-sm" onclick="viewReportDetail('${r.id}')">View</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterCompanyReports(btn, filter) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function acceptReport(id) {
  showToast(`Report ${id} accepted! Researcher will be notified.`, 'success');
}

function viewReportDetail(id) {
  showToast(`Opening report ${id}...`, 'info');
}

// ============================================================
// NEW PROGRAM
// ============================================================
function renderNewProgram() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Create <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">New Program</span></h1></div>
    </div>
    <div class="dashboard-grid grid-cols-12">
      <div class="col-span-8 report-form-card">
        <form onsubmit="createProgram(event)">
          <div class="form-group"><label class="form-label">Program Name</label><input type="text" class="form-input" placeholder="e.g., CBE Mobile Banking Bug Bounty" required/></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Program Type</label>
              <select class="form-select"><option>Bug Bounty (Paid)</option><option>Vulnerability Disclosure (VDP)</option></select>
            </div>
            <div class="form-group"><label class="form-label">Visibility</label>
              <select class="form-select"><option>Public</option><option>Private (Invite Only)</option></select>
            </div>
          </div>

          <div class="form-group"><label class="form-label">Program Description</label>
            <textarea class="form-input" rows="4" placeholder="Describe your program, what you're protecting, and what makes a valid report..." required></textarea>
          </div>

          <div class="form-group"><label class="form-label">In-Scope Assets (one per line)</label>
            <textarea class="form-input" rows="4" placeholder="*.yourcompany.com&#10;api.yourcompany.com&#10;app.yourcompany.com/api/v2/*"></textarea>
          </div>

          <div class="form-group"><label class="form-label">Out-of-Scope Assets</label>
            <textarea class="form-input" rows="3" placeholder="staging.yourcompany.com&#10;Third-party services"></textarea>
          </div>

          <h3 style="font-family:var(--font-heading);font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);margin:1.5rem 0 1rem">Reward Structure</h3>
          ${['Critical','High','Medium','Low'].map((sev, i) => {
            const colors = ['var(--accent-red)','var(--accent)','#ffc800','var(--accent-green)'];
            return `
              <div style="display:grid;grid-template-columns:120px 1fr 1fr;gap:1rem;align-items:center;margin-bottom:1rem">
                <span class="badge badge-${sev.toLowerCase()}">${sev}</span>
                <div class="form-group" style="margin:0"><input type="text" class="form-input" placeholder="Min e.g. $500"/></div>
                <div class="form-group" style="margin:0"><input type="text" class="form-input" placeholder="Max e.g. $2,000"/></div>
              </div>
            `;
          }).join('')}

          <div class="form-group" style="margin-top:1rem"><label class="form-label">Monthly Bounty Budget (USD)</label>
            <input type="text" class="form-input" placeholder="e.g. $20,000" required/>
          </div>

          <div class="form-group"><label class="form-label">Safe Harbor Statement</label>
            <textarea class="form-input" rows="3" placeholder="We commit to not pursue legal action against researchers acting in good faith...">${company.name} will not take legal action against researchers who act in accordance with this policy and our Code of Conduct.</textarea>
          </div>

          <div style="display:flex;gap:1rem;margin-top:1.5rem">
            <button type="submit" class="btn btn-sm" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.75rem 1.75rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:0.5rem"><i class="fas fa-rocket"></i> Launch Program</button>
            <button type="button" class="btn btn-secondary" onclick="showToast('Draft saved!','info')"><i class="fas fa-save"></i> Save Draft</button>
          </div>
        </form>
      </div>

      <div class="col-span-4">
        <div class="widget-card">
          <div class="widget-header"><span class="widget-title">Setup Checklist</span></div>
          <div style="display:flex;flex-direction:column;gap:0.75rem">
            ${[
              {done:true, text:'Company account verified'},
              {done:true, text:'Contact information added'},
              {done:false, text:'Program scope defined'},
              {done:false, text:'Reward structure set'},
              {done:false, text:'Safe harbor policy added'},
              {done:false, text:'Budget allocated'},
            ].map(item => `
              <div style="display:flex;align-items:center;gap:0.75rem">
                <div style="width:20px;height:20px;border-radius:50%;background:${item.done?'var(--gradient-btn)':'var(--bg-card2)'};border:${item.done?'none':'1px solid var(--border-glow)'};display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:var(--bg-dark);flex-shrink:0">${item.done?'✓':''}</div>
                <span style="font-family:var(--font-ui);font-size:0.85rem;color:${item.done?'var(--text-primary)':'var(--text-muted)'}">${item.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function createProgram(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto"></div>';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 2000));
  showToast('🚀 Program launched! Researchers can now start submitting reports.', 'success', 6000);
  loadPage('programs');
}

// ============================================================
// ANALYTICS
// ============================================================
function renderAnalytics() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Program <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Analytics</span></h1></div>
    </div>
    <div class="dashboard-grid grid-cols-4" style="margin-bottom:1.5rem">
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Total Reports</span><div class="kpi-icon purple"><i class="fas fa-bug"></i></div></div><div class="kpi-value">342</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> +28 this month</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Avg Response Time</span><div class="kpi-icon cyan"><i class="fas fa-clock"></i></div></div><div class="kpi-value">36hr</div><div class="kpi-change up"><i class="fas fa-arrow-down"></i> -4hr improvement</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Resolution Rate</span><div class="kpi-icon green"><i class="fas fa-check"></i></div></div><div class="kpi-value">93%</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> +3% vs last month</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Total Paid Out</span><div class="kpi-icon yellow"><i class="fas fa-coins"></i></div></div><div class="kpi-value">$28K</div><div class="kpi-change up"><i class="fas fa-arrow-up"></i> This year</div></div>
    </div>
    <div class="dashboard-grid grid-cols-2">
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Monthly Report Volume</span></div>
        <div class="chart-bar-group">
          ${[20,35,28,45,38,52,41,58,49,62,55,70].map((h,i) => `<div class="chart-bar" style="height:${h}%;background:linear-gradient(135deg,#7b2fff,#ff6b35)" title="${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}"></div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:0.75rem"><span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jan</span><span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Jun</span><span style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted)">Dec</span></div>
      </div>
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Vulnerability Categories</span></div>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${[
            {cat:'SQL Injection',pct:22,col:'var(--accent-red)'},
            {cat:'Cross-Site Scripting',pct:18,col:'var(--accent)'},
            {cat:'Auth Bypass',pct:15,col:'#ffc800'},
            {cat:'IDOR',pct:14,col:'var(--primary)'},
            {cat:'SSRF',pct:11,col:'#a855f7'},
            {cat:'Other',pct:20,col:'var(--text-muted)'},
          ].map(v => `
            <div>
              <div style="display:flex;justify-content:space-between;font-family:var(--font-ui);font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.3rem"><span>${v.cat}</span><span style="color:${v.col}">${v.pct}%</span></div>
              <div class="progress-bar"><div class="progress-fill" style="width:${v.pct*4}%;background:${v.col}"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// RESEARCHERS PAGE
// ============================================================
function renderResearchers() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Top <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Researchers</span></h1><p class="page-subtitle">Researchers who have contributed to your programs</p></div>
    </div>
    <div class="widget-card">
      <div class="lb-header" style="display:grid;grid-template-columns:50px 1fr 100px 100px 120px 80px">
        <div>#</div><div>Researcher</div><div>Reports</div><div>Accepted</div><div>Rewards Paid</div><div>Action</div>
      </div>
      ${getTopResearchers().map((r,i) => `
        <div class="lb-row" style="display:grid;grid-template-columns:50px 1fr 100px 100px 120px 80px">
          <div class="lb-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i+1}</div>
          <div class="lb-researcher">
            <div class="lb-avatar">${r.avatar}</div>
            <div><div class="lb-name">${r.country} ${r.name}</div><div class="lb-handle">${r.handle}</div></div>
          </div>
          <div class="lb-bugs">${r.reports}</div>
          <div style="font-family:var(--font-heading);font-size:0.85rem;color:var(--primary)">${r.accepted}</div>
          <div class="lb-earnings">${r.paid}</div>
          <div><button class="btn btn-ghost btn-sm" onclick="showToast('Viewing researcher profile','info')">Profile</button></div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// PAYOUTS
// ============================================================
function renderPayouts() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Payout <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Management</span></h1></div>
      <button class="btn btn-sm" onclick="showToast('Manual payout initiated','success')" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.5rem 1.2rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.75rem;cursor:pointer">Manual Payout</button>
    </div>
    <div class="dashboard-grid grid-cols-3" style="margin-bottom:1.5rem">
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Pending Payouts</span><div class="kpi-icon yellow"><i class="fas fa-clock"></i></div></div><div class="kpi-value">$3,200</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Paid This Month</span><div class="kpi-icon green"><i class="fas fa-check"></i></div></div><div class="kpi-value">$8,400</div></div>
      <div class="kpi-card"><div class="kpi-header"><span class="kpi-label">Total Paid (YTD)</span><div class="kpi-icon purple"><i class="fas fa-coins"></i></div></div><div class="kpi-value">$28K</div></div>
    </div>
    <div class="widget-card">
      <div class="widget-header"><span class="widget-title">Payout Queue</span></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Researcher</th><th>Report</th><th>Amount</th><th>Method</th><th>Requested</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${getPayoutQueue().map(p => `
              <tr>
                <td><div style="display:flex;align-items:center;gap:0.5rem"><div style="width:26px;height:26px;border-radius:50%;background:var(--gradient-btn);display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;color:var(--bg-dark)">${p.avatar}</div><span>${p.researcher}</span></div></td>
                <td style="font-family:var(--font-heading);font-size:0.72rem;color:#a855f7">${p.report}</td>
                <td style="font-family:var(--font-heading);font-weight:700;color:var(--accent-green)">${p.amount}</td>
                <td><span class="badge badge-info">${p.method}</span></td>
                <td>${p.date}</td>
                <td><span class="badge badge-${p.statusClass}">${p.status}</span></td>
                <td>${p.status==='Pending'?`<button class="btn btn-success btn-sm" onclick="approvePayout('${p.report}')">Approve</button>`:'<span style="color:var(--text-muted);font-size:0.8rem">—</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function approvePayout(id) {
  showToast(`Payout approved for ${id}! Processing within 24 hours.`, 'success');
}

// ============================================================
// BILLING
// ============================================================
function renderBilling() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header"><div><h1 class="page-title">Billing & <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Subscription</span></h1></div></div>
    <div class="dashboard-grid grid-cols-2">
      <div class="widget-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
          <div>
            <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;color:var(--text-primary)">${company.plan} Plan</div>
            <div style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text-muted)">Renews Oct 31, 2024</div>
          </div>
          <span class="badge badge-low">Active</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.5rem">
          ${[{v:'3',l:'Active Programs'},{v:'Unlimited',l:'Researchers'},{v:'$20K/mo',l:'Bounty Budget'},{v:'24/7',l:'Support'}].map(s=>`<div style="background:var(--bg-card2);border:1px solid var(--border-glow);border-radius:8px;padding:0.875rem"><div style="font-family:var(--font-heading);font-size:0.95rem;font-weight:700;color:#a855f7">${s.v}</div><div style="font-family:var(--font-ui);font-size:0.65rem;color:var(--text-muted);text-transform:uppercase">${s.l}</div></div>`).join('')}
        </div>
        <button class="btn btn-sm" onclick="showToast('Contact sales to upgrade your plan','info')" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.5rem 1.2rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.75rem;cursor:pointer">Upgrade Plan</button>
      </div>
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Payment Method</span></div>
        <div style="padding:1rem;background:var(--bg-card2);border:1px solid var(--border-glow);border-radius:var(--radius);margin-bottom:1rem;display:flex;align-items:center;gap:1rem">
          <span style="font-size:1.5rem">💳</span>
          <div><div style="font-family:var(--font-heading);font-size:0.85rem;color:var(--text-primary)">Visa ending in 4521</div><div style="font-family:var(--font-ui);font-size:0.75rem;color:var(--text-muted)">Expires 12/2026</div></div>
          <span class="badge badge-info" style="margin-left:auto">Primary</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Add payment method','info')"><i class="fas fa-plus"></i> Add Payment Method</button>
      </div>
    </div>
  `;
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header"><div><h1 class="page-title">Company <span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Settings</span></h1></div></div>
    <div class="dashboard-grid grid-cols-2">
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Company Profile</span></div>
        <div class="form-group"><label class="form-label">Company Name</label><input type="text" class="form-input" value="${company.name}"/></div>
        <div class="form-group"><label class="form-label">Work Email</label><input type="email" class="form-input" value="${company.email}"/></div>
        <div class="form-group"><label class="form-label">Company Website</label><input type="url" class="form-input" placeholder="https://yourcompany.et"/></div>
        <div class="form-group"><label class="form-label">Security Contact</label><input type="email" class="form-input" placeholder="security@yourcompany.et"/></div>
        <button class="btn btn-sm" onclick="showToast('Settings saved!','success')" style="background:linear-gradient(135deg,#7b2fff,#ff6b35);color:white;border:none;padding:0.5rem 1.2rem;border-radius:var(--radius);font-family:var(--font-heading);font-size:0.75rem;cursor:pointer"><i class="fas fa-save"></i> Save Changes</button>
      </div>
      <div class="widget-card">
        <div class="widget-header"><span class="widget-title">Security</span></div>
        <div class="form-group"><label class="form-label">Current Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
        <div class="form-group"><label class="form-label">New Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
        <div class="form-group"><label class="form-label">Confirm Password</label><input type="password" class="form-input" placeholder="••••••••"/></div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Password updated!','success')"><i class="fas fa-lock"></i> Update Password</button>
      </div>
    </div>
  `;
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function renderNotifications() {
  const c = document.getElementById('pageContent');
  c.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title"><span style="background:linear-gradient(135deg,#7b2fff,#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Notifications</span></h1></div>
      <button class="btn btn-ghost btn-sm" onclick="showToast('All marked as read','success')">Mark all read</button>
    </div>
    <div class="widget-card">
      ${[
        {icon:'🚨',title:'Critical Report Received',text:'@eth_hunter submitted a critical severity report on your CBE App program.',time:'30 minutes ago',unread:true},
        {icon:'⚠️',title:'SLA Warning',text:'Report #ABY-2024-0885 has been pending for 5 days. SLA breach in 2 days.',time:'2 hours ago',unread:true},
        {icon:'📊',title:'Monthly Report Ready',text:'Your October 2024 security summary report is ready to download.',time:'1 day ago',unread:true},
        {icon:'💰',title:'Budget Alert',text:'You have used 75% ($15,000) of your monthly bounty budget.',time:'2 days ago',unread:false},
        {icon:'👤',title:'New Researcher',text:'22 new researchers joined your programs this month.',time:'3 days ago',unread:false},
      ].map(n => `
        <div style="display:flex;gap:1rem;padding:1.25rem;border-bottom:1px solid rgba(0,245,255,0.05);${n.unread?'background:rgba(168,85,247,0.02);':''}cursor:pointer;transition:all 0.2s" onmouseover="this.style.paddingLeft='1.75rem'" onmouseout="this.style.paddingLeft='1.25rem'">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(123,47,255,0.08);border:1px solid rgba(123,47,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">${n.icon}</div>
          <div style="flex:1">
            <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:600;color:var(--text-primary);margin-bottom:0.25rem">${n.title} ${n.unread?'<span style="display:inline-block;width:6px;height:6px;background:#a855f7;border-radius:50%;margin-left:0.4rem;vertical-align:middle"></span>':''}</div>
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
function getInboxReports() {
  return [
    { id:'#ABY-2024-0895', icon:'🚨', iconBg:'rgba(255,51,102,0.1)', title:'RCE via file upload in document portal', researcher:'@yohannes_sec', date:'1 hour ago', severity:'Critical', statusClass:'new', status:'New' },
    { id:'#ABY-2024-0893', icon:'🔓', iconBg:'rgba(255,107,53,0.1)', title:'IDOR exposing all user account data', researcher:'@meron_hack', date:'3 hours ago', severity:'High', statusClass:'info', status:'Triaging' },
    { id:'#ABY-2024-0891', icon:'🌐', iconBg:'rgba(255,200,0,0.1)', title:'Stored XSS in transaction memo field', researcher:'@selam_bug', date:'6 hours ago', severity:'Medium', statusClass:'info', status:'Triaging' },
    { id:'#ABY-2024-0890', icon:'📧', iconBg:'rgba(0,245,255,0.1)', title:'Insecure password reset token', researcher:'@dawit_0x', date:'1 day ago', severity:'High', statusClass:'info', status:'Triaging' },
  ];
}

function getMyPrograms() {
  return [
    { logo:'🏦', name:'CBE Mobile Banking', reports:156, researchers:89, statusClass:'low', status:'Active' },
    { logo:'🌐', name:'CBE Internet Banking', reports:98, researchers:52, statusClass:'low', status:'Active' },
    { logo:'💳', name:'CBE Card Services', reports:43, researchers:28, statusClass:'medium', status:'Paused' },
  ];
}

function getAllPrograms() {
  return [
    { logo:'🏦', name:'CBE Mobile Banking', scope:'*.cbe.et, api.cbe.et', reports:156, open:8, resolved:92, spent:'$12K', statusClass:'low', status:'Active' },
    { logo:'🌐', name:'CBE Internet Banking', scope:'ib.cbe.et, *.ib.cbe.et', reports:98, open:3, resolved:95, spent:'$9K', statusClass:'low', status:'Active' },
    { logo:'💳', name:'CBE Card Services', scope:'cards.cbe.et', reports:43, open:1, resolved:97, spent:'$4.5K', statusClass:'medium', status:'Paused' },
    { logo:'📱', name:'CBE Birr App', scope:'*.cbebirr.et', reports:45, open:0, resolved:100, spent:'$2.7K', statusClass:'low', status:'Active' },
  ];
}

function companyActivity() {
  return [
    { color:'red', text:'<strong>Critical</strong> report received from @yohannes_sec', time: '1 hour ago' },
    { color:'yellow', text:'SLA warning for report <strong>#ABY-2024-0885</strong>', time: '2 hours ago' },
    { color:'green', text:'<strong>$800</strong> reward paid to @meron_hack', time: '5 hours ago' },
    { color:'cyan', text:'Monthly security digest published', time: '1 day ago' },
    { color:'purple', text:'22 new researchers joined your programs', time: '3 days ago' },
  ];
}

function getCompanyReports() {
  return [
    { id:'#ABY-2024-0895', title:'RCE via file upload in document portal', researcher:'Yohannes T.', resAvatar:'YT', severity:'Critical', statusClass:'new', status:'New', program:'CBE Mobile', date:'1 hr ago' },
    { id:'#ABY-2024-0893', title:'IDOR exposing all user account data', researcher:'Meron A.', resAvatar:'MA', severity:'High', statusClass:'info', status:'Triaging', program:'CBE Internet', date:'3 hrs ago' },
    { id:'#ABY-2024-0891', title:'Stored XSS in transaction memo field', researcher:'Selam G.', resAvatar:'SG', severity:'Medium', statusClass:'info', status:'Triaging', program:'CBE Mobile', date:'6 hrs ago' },
    { id:'#ABY-2024-0890', title:'Insecure password reset token', researcher:'Dawit B.', resAvatar:'DB', severity:'High', statusClass:'info', status:'Triaging', program:'CBE Mobile', date:'1 day ago' },
    { id:'#ABY-2024-0888', title:'SQL injection in search endpoint', researcher:'Biruk H.', resAvatar:'BH', severity:'Critical', statusClass:'low', status:'Accepted', program:'CBE Internet', date:'2 days ago' },
    { id:'#ABY-2024-0882', title:'Session fixation vulnerability', researcher:'Tigist W.', resAvatar:'TW', severity:'Medium', statusClass:'low', status:'Accepted', program:'CBE Card', date:'3 days ago' },
    { id:'#ABY-2024-0878', title:'Information disclosure via error messages', researcher:'Abel T.', resAvatar:'AT', severity:'Low', statusClass:'low', status:'Resolved', program:'CBE Mobile', date:'4 days ago' },
  ];
}

function getTopResearchers() {
  return [
    { name:'Yohannes Tesfaye', handle:'@yohannes_sec', avatar:'YT', country:'🇪🇹', reports:28, accepted:24, paid:'$5,200' },
    { name:'Meron Alemu', handle:'@meron_hack', avatar:'MA', country:'🇪🇹', reports:22, accepted:19, paid:'$4,100' },
    { name:'Dawit Bekele', handle:'@dawit_0x', avatar:'DB', country:'🇪🇹', reports:18, accepted:16, paid:'$3,800' },
    { name:'Selam Girma', handle:'@selam_bug', avatar:'SG', country:'🇪🇹', reports:15, accepted:13, paid:'$2,600' },
    { name:'Biruk Haile', handle:'@biruk_sec', avatar:'BH', country:'🇪🇹', reports:12, accepted:10, paid:'$1,900' },
  ];
}

function getPayoutQueue() {
  return [
    { researcher:'Yohannes T.', avatar:'YT', report:'#ABY-2024-0888', amount:'$2,500', method:'Telebirr', date:'Oct 1, 2024', statusClass:'medium', status:'Pending' },
    { researcher:'Meron A.', avatar:'MA', report:'#ABY-2024-0882', amount:'$800', method:'CBE Birr', date:'Sep 30, 2024', statusClass:'medium', status:'Pending' },
    { researcher:'Dawit B.', avatar:'DB', report:'#ABY-2024-0875', amount:'$450', method:'Bank Transfer', date:'Sep 28, 2024', statusClass:'low', status:'Processing' },
    { researcher:'Selam G.', avatar:'SG', report:'#ABY-2024-0870', amount:'$300', method:'Telebirr', date:'Sep 25, 2024', statusClass:'low', status:'Completed' },
  ];
}
