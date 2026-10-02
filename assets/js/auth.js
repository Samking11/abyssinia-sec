/* ============================================
   ABYSSINIA SEC - Auth JavaScript
   ============================================ */

'use strict';

// ---- Tab Switching ----
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.animation = 'fadeIn 0.3s ease';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    registerForm.style.animation = 'fadeIn 0.3s ease';
  }
}

// ---- Password Visibility Toggle ----
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// ---- Password Strength ----
function checkPasswordStrength(value) {
  const indicator = document.getElementById('strengthIndicator');
  const segments = ['s1','s2','s3','s4'].map(id => document.getElementById(id));
  const text = document.getElementById('strengthText');
  if (!indicator || !text) return;

  if (!value) { indicator.style.display = 'none'; return; }
  indicator.style.display = 'block';

  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;

  const levels = [
    { score: 1, label: 'Very Weak', class: 'weak', fill: 1 },
    { score: 2, label: 'Weak', class: 'weak', fill: 2 },
    { score: 3, label: 'Fair', class: 'medium', fill: 3 },
    { score: 4, label: 'Strong', class: 'strong', fill: 3 },
    { score: 5, label: 'Very Strong', class: 'strong', fill: 4 },
  ];

  const level = levels[Math.min(score, 5) - 1] || levels[0];
  segments.forEach((seg, i) => {
    seg.className = 'strength-segment';
    if (i < level.fill) seg.classList.add(level.class);
  });
  text.textContent = level.label;
  text.style.color = level.class === 'weak' ? 'var(--accent-red)' : level.class === 'medium' ? '#ffc800' : 'var(--accent-green)';
}

// ---- Checkbox Toggle ----
function toggleCheck(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('checked');
}

// ---- Loading State ----
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

// ---- Researcher Login ----
async function handleResearcherLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  setLoading('loginBtn', true);

  // Simulate API call
  await delay(1800);

  // Demo credentials
  if (email === 'demo@researcher.com' || email.length > 5) {
    localStorage.setItem('absec_user', JSON.stringify({
      role: 'researcher',
      name: 'Eth Hunter',
      email: email,
      handle: '@eth_hunter',
      rank: 12,
      points: 6200,
      avatar: 'EH'
    }));
    showToast('Welcome back! Redirecting to dashboard...', 'success');
    setTimeout(() => { window.location.href = 'dashboard-researcher.html'; }, 1200);
  } else {
    setLoading('loginBtn', false);
    showToast('Invalid credentials. Try again.', 'error');
  }
}

// ---- Researcher Register ----
async function handleResearcherRegister(e) {
  e.preventDefault();
  const terms = document.getElementById('termsCheck');
  if (!terms?.classList.contains('checked')) {
    showToast('Please accept the Terms of Service', 'warning');
    return;
  }

  const firstName = document.getElementById('firstName')?.value;
  const lastName = document.getElementById('lastName')?.value;
  const username = document.getElementById('username')?.value;
  const email = document.getElementById('regEmail')?.value;

  if (!firstName || !lastName || !username || !email) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  setLoading('registerBtn', true);
  await delay(2000);

  localStorage.setItem('absec_user', JSON.stringify({
    role: 'researcher',
    name: `${firstName} ${lastName}`,
    email: email,
    handle: `@${username}`,
    rank: null,
    points: 0,
    avatar: `${firstName[0]}${lastName[0]}`.toUpperCase()
  }));

  showToast('Account created! Welcome to Abyssinia Sec 🎉', 'success');
  setTimeout(() => { window.location.href = 'dashboard-researcher.html'; }, 1400);
}

// ---- Company Login ----
async function handleCompanyLogin(e) {
  e.preventDefault();
  const email = document.getElementById('companyEmail')?.value;
  const password = document.getElementById('companyPassword')?.value;

  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  setLoading('loginBtn', true);
  await delay(1800);

  if (email.length > 5) {
    const domain = email.split('@')[1] || 'company.com';
    const companyName = domain.split('.')[0].replace(/^./, s => s.toUpperCase());
    localStorage.setItem('absec_company', JSON.stringify({
      role: 'company',
      name: `${companyName} Security`,
      email: email,
      plan: 'Enterprise',
      avatar: companyName.substring(0, 2).toUpperCase()
    }));
    showToast('Welcome back! Loading your dashboard...', 'success');
    setTimeout(() => { window.location.href = 'dashboard-company.html'; }, 1200);
  } else {
    setLoading('loginBtn', false);
    showToast('Invalid credentials. Try again.', 'error');
  }
}

// ---- Company Register ----
async function handleCompanyRegister(e) {
  e.preventDefault();
  const terms = document.getElementById('companyTermsCheck');
  if (!terms?.classList.contains('checked')) {
    showToast('Please accept the Company Agreement', 'warning');
    return;
  }

  const companyName = document.getElementById('companyName')?.value;
  const workEmail = document.getElementById('workEmail')?.value;
  const contactFirst = document.getElementById('contactFirst')?.value;

  if (!companyName || !workEmail || !contactFirst) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  setLoading('registerBtn', true);
  await delay(2200);

  localStorage.setItem('absec_company', JSON.stringify({
    role: 'company',
    name: companyName,
    email: workEmail,
    plan: 'Starter',
    avatar: companyName.substring(0, 2).toUpperCase()
  }));

  showToast('Company registered! Our team will contact you within 24h.', 'success');
  setTimeout(() => { window.location.href = 'dashboard-company.html'; }, 1400);
}

// ---- Utility ----
function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  // Auto-fill demo credentials hint
  const loginEmail = document.getElementById('loginEmail');
  const companyEmail = document.getElementById('companyEmail');
  if (loginEmail) loginEmail.placeholder = 'demo@researcher.com';
  if (companyEmail) companyEmail.placeholder = 'demo@company.et';
});
