/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let sentRequests = [];
let receivedCount = 2;

/* ═══════════════════════════════════════════
   TAB SWITCHING
═══════════════════════════════════════════ */
function showTab(tabName) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Show selected panel
  document.getElementById(tabName).classList.remove('hidden');
  // Activate selected tab button
  document.getElementById('tab-' + tabName).classList.add('active');
}

/* ═══════════════════════════════════════════
   CONNECT BUTTON
═══════════════════════════════════════════ */
function handleConnect(btn, name, title, imgSrc) {
  if (btn.classList.contains('requested')) return;

  btn.classList.add('requested');
  btn.textContent = 'Requested';
  btn.disabled = true;

  sentRequests.push({ name, title, imgSrc });
  updateSentTab(name, title, imgSrc);
  updateCounters();
  showToast('Connection request sent to ' + name);
}

/* ═══════════════════════════════════════════
   ADD TO SENT LIST
═══════════════════════════════════════════ */
function updateSentTab(name, title, imgSrc) {
  const empty = document.getElementById('sentEmpty');
  if (empty) empty.style.display = 'none';

  const container = document.getElementById('sentList');
  const div = document.createElement('div');
  div.className = 'personCard';
  div.innerHTML = `
    <img src="${imgSrc}" alt="${name}" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'">
    <div class="info">
      <div class="name">${name}</div>
      <div class="job-title">${title}</div>
      <div class="req-time"><i class="fa-regular fa-clock"></i> Just now</div>
    </div>
    <span style="font-size:12px;color:#057642;font-weight:600;"><i class="fa-solid fa-circle-check"></i> Sent</span>
  `;
  container.appendChild(div);
}

/* ═══════════════════════════════════════════
   ACCEPT / IGNORE RECEIVED REQUESTS
═══════════════════════════════════════════ */
function acceptRequest(btn, name, cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.style.transition = 'opacity .3s, transform .3s';
  card.style.opacity = '0';
  card.style.transform = 'translateX(20px)';

  setTimeout(() => {
    card.remove();
    receivedCount = Math.max(0, receivedCount - 1);
    updateCounters();
    showToast('You are now connected with ' + name + '!');
    checkEmptyReceived();
  }, 300);
}

function ignoreRequest(btn, cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.style.transition = 'opacity .3s';
  card.style.opacity = '0';

  setTimeout(() => {
    card.remove();
    receivedCount = Math.max(0, receivedCount - 1);
    updateCounters();
    checkEmptyReceived();
  }, 300);
}

function checkEmptyReceived() {
  const panel = document.getElementById('received');
  const remaining = panel.querySelectorAll('.personCard');
  if (remaining.length === 0) {
    panel.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-envelope" style="font-size:36px;color:#aaa;"></i>
        <p>No pending requests</p>
      </div>`;
  }
}

/* ═══════════════════════════════════════════
   UPDATE COUNTERS
═══════════════════════════════════════════ */
function updateCounters() {
  document.getElementById('count-sent').textContent = sentRequests.length;
  document.getElementById('count-received').textContent = receivedCount;
}

/* ═══════════════════════════════════════════
   ME DROPDOWN
═══════════════════════════════════════════ */
function toggleDropdown() {
  document.getElementById('meDropdown').classList.toggle('open');
}

window.addEventListener('click', function(e) {
  const meItem = document.getElementById('meNavItem');
  const dropdown = document.getElementById('meDropdown');
  if (meItem && !meItem.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

/* ═══════════════════════════════════════════
   TOAST
═══════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
