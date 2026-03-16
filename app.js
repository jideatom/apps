
// ── Global helpers ──
function getState(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } }
function setState(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ── Register SW ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ── Sprint tracker (used on claude.html) ──
const SPRINT_KEY = 'claudeSprintMarch2026';
const SPRINT_TOTAL = 5;

function toggleCourse(id) {
  const s = getState(SPRINT_KEY);
  s[id] = !s[id];
  setState(SPRINT_KEY, s);
  renderSprint();
}

function renderSprint() {
  const s = getState(SPRINT_KEY);
  let done = 0;
  for (let i = 1; i <= SPRINT_TOTAL; i++) {
    const card = document.querySelector('[data-id="c' + i + '"]');
    const chk  = document.getElementById('chk-c' + i);
    if (!card) continue;
    if (s['c' + i]) { card.classList.add('done'); if(chk) chk.textContent = '✓'; done++; }
    else            { card.classList.remove('done'); if(chk) chk.textContent = '○'; }
  }
  const pct = Math.round((done / SPRINT_TOTAL) * 100);
  const fill = document.getElementById('sprintFill');
  const label = document.getElementById('sprintPct');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = pct + '% Complete (' + done + '/' + SPRINT_TOTAL + ')';
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderSprint === 'function') renderSprint();
});
