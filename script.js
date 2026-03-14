/* ============================================================ STATE */
let sentCount     = 0;
let receivedCount = 2;
let peopleCount   = 12;

/* ============================================================ TAB SWITCHING */
function showTab(name) {
  document.querySelectorAll('.tabPanel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tabBtn').forEach(b => b.classList.remove('active'));
  var panel = document.getElementById(name);
  if (panel) panel.classList.remove('hidden');
  var btnMap = { people: 'tabPeople', received: 'tabReceived', sent: 'tabSent' };
  var btn = document.getElementById(btnMap[name]);
  if (btn) btn.classList.add('active');
}

/* ============================================================ CONNECT */
function handleConnect(btn, name, title, img) {
  if (btn.classList.contains('requested')) return;
  btn.classList.add('requested');
  btn.textContent = 'Requested';
  btn.disabled = true;
  sentCount++;
  updateSentTab(name, title, img);
  updateTabCounts();
  showToast('Connection request sent to ' + name);
}

function updateSentTab(name, title, img) {
  var list  = document.getElementById('sentList');
  var empty = document.getElementById('sentEmpty');
  if (!list) return;
  if (empty) empty.style.display = 'none';
  var card = document.createElement('div');
  card.className = 'pcard';
  card.innerHTML =
    '<img src="' + img + '" alt="' + name + '" onerror="this.style.display=\'none\'">' +
    '<div class="pinfo">' +
      '<div class="pname">' + name + '</div>' +
      '<div class="ptitle">' + title + '</div>' +
      '<div class="pmutual" style="color:#057642"><i class="fa fa-check-circle"></i> Request sent</div>' +
    '</div>' +
    '<button class="cbtn requested" disabled>Requested</button>';
  list.appendChild(card);
}

/* ============================================================ ACCEPT / IGNORE */
function acceptReq(btn, name, cardId) {
  var card = document.getElementById(cardId);
  if (!card) return;
  receivedCount--;
  card.remove();
  updateTabCounts();
  showToast('You are now connected with ' + name + '!');
}

function ignoreReq(cardId) {
  var card = document.getElementById(cardId);
  if (!card) return;
  receivedCount--;
  card.style.opacity = '0';
  card.style.transition = 'opacity 0.3s';
  setTimeout(function() { card.remove(); }, 300);
  updateTabCounts();
}

/* ============================================================ TAB COUNTERS */
function updateTabCounts() {
  var s = document.getElementById('tabSent');
  if (s) s.textContent = 'Req Sent (' + sentCount + ')';
  var r = document.getElementById('tabReceived');
  if (r) r.textContent = 'Req Received (' + receivedCount + ')';
}

/* ============================================================ ME DROPDOWN */
function toggleDropdown() {
  var dd = document.getElementById('meDropdown');
  if (dd) dd.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  var nme = document.getElementById('nme');
  var dd  = document.getElementById('meDropdown');
  if (!dd || !nme) return;
  if (!nme.contains(e.target)) dd.classList.remove('open');
});

/* ============================================================ TOAST */
var toastTimer = null;
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.add('hidden'); }, 3000);
}

/* ============================================================ COUNTDOWN TIMER */
var sessionEndTime = Date.now() + ((2 * 24 * 60 * 60) + (4 * 60 * 60) + (37 * 60)) * 1000;

function updateTimer() {
  var remaining = sessionEndTime - Date.now();
  var el = document.getElementById('timerDisplay');
  if (!el) return;
  if (remaining <= 0) {
    el.textContent = 'Session ended';
    el.style.color = '#cc1016';
    return;
  }
  var days  = Math.floor(remaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var mins  = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  el.textContent = (days > 0 ? days + 'd ' : '') + String(hours).padStart(2,'0') + 'h ' + String(mins).padStart(2,'0') + 'm';
}
updateTimer();
setInterval(updateTimer, 30000);

/* ============================================================ PREMIUM PROMPT */
function showPremiumPrompt() {
  showToast('⭐ Upgrade to LinkedIn Premium to unlock this feature');
}

/* ============================================================
   EVENT CREATION FLOW
============================================================ */
var currentStep = 1;

function openCreateEvent() {
  currentStep = 1;
  goStep(1);
  // Reset form
  ['evName','evDesc','evLocation','evDatetime','fGeo','fProfession','fSkills'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fIndustry','fExp','fCompSize','fOTW','evGroup'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  document.querySelectorAll('.tag-opt.selected').forEach(function(t) { t.classList.remove('selected'); });
  var nt = document.getElementById('notifyToggle');
  if (nt) { nt.checked = false; }
  var qrt = document.getElementById('qrToggle');
  if (qrt) { qrt.checked = false; }
  var gt = document.getElementById('groupToggle');
  if (gt) { gt.checked = false; }
  var np = document.getElementById('notifyPanel');
  if (np) np.classList.add('hidden');
  var qa = document.getElementById('qrPreviewArea');
  if (qa) qa.classList.add('hidden');
  openModal('modalCreateEvent');
}

function goStep(n) {
  currentStep = n;
  [1,2,3].forEach(function(i) {
    var panel = document.getElementById('evStep' + i);
    if (panel) panel.classList.toggle('hidden', i !== n);
    var dot = document.getElementById('step' + i + 'dot');
    if (dot) {
      dot.classList.remove('active','done');
      if (i === n) dot.classList.add('active');
      else if (i < n) dot.classList.add('done');
    }
  });

  // Sync notification preview with form values
  if (n === 2) {
    syncNotifPreview();
    document.getElementById('evName').addEventListener('input', syncNotifPreview);
    document.getElementById('evLocation').addEventListener('input', syncNotifPreview);
  }
}

function syncNotifPreview() {
  var name = document.getElementById('evName').value || 'your event';
  var loc  = document.getElementById('evLocation').value || 'your city';
  var pn = document.getElementById('prevEventName');
  var pl = document.getElementById('prevLocation');
  if (pn) pn.textContent = name;
  if (pl) pl.textContent = loc;
  var ql = document.getElementById('qrEventLabel');
  if (ql) ql.textContent = name;
}

function toggleNotifyPanel() {
  var on = document.getElementById('notifyToggle').checked;
  var panel = document.getElementById('notifyPanel');
  if (panel) panel.classList.toggle('hidden', !on);
  if (on) updateReach();
}

function updateReach() {
  // Simulate dynamic reach based on number of filters filled
  var filters = ['fGeo','fProfession','fSkills'];
  var count = 0;
  filters.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.value.trim()) count++;
  });
  ['fIndustry','fExp','fCompSize','fOTW'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el && el.selectedIndex > 0) count++;
  });
  // Narrow down reach with more filters
  var base = 480;
  var reach = Math.max(30, base - count * 55 + Math.floor(Math.random() * 20));
  var el = document.getElementById('reachNum');
  if (el) el.textContent = '~' + reach + ' professionals';
}

function toggleQRPreview() {
  var on = document.getElementById('qrToggle').checked;
  var area = document.getElementById('qrPreviewArea');
  if (area) area.classList.toggle('hidden', !on);
  if (on) syncNotifPreview();
}

function toggleTag(el) {
  el.classList.toggle('selected');
}

function submitEvent() {
  var name = document.getElementById('evName').value.trim();
  var loc  = document.getElementById('evLocation').value.trim();
  if (!name) { showToast('Please enter an event name'); goStep(1); return; }
  if (!loc)  { showToast('Please enter a location');   goStep(1); return; }

  closeModal('modalCreateEvent');

  // Populate dashboard
  document.getElementById('dashEventTitle').textContent = name;
  var notifyOn = document.getElementById('notifyToggle').checked;
  document.getElementById('dNotifSent').textContent = notifyOn ? '500' : '—';

  // Add event to sidebar
  addEventToSidebar(name, loc);

  // Show dashboard after short delay
  setTimeout(function() {
    openModal('modalDashboard');
  }, 400);

  showToast('🚀 "' + name + '" launched successfully!');
}

function addEventToSidebar(name, loc) {
  var now = new Date();
  var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var mon = months[now.getMonth()];
  var day = now.getDate() + 1;

  var container = document.querySelector('.scard .event');
  if (!container) return;
  var parent = container.parentElement;

  var div = document.createElement('div');
  div.className = 'event';
  div.style.background = '#f0f9f0';
  div.style.borderRadius = '6px';
  div.innerHTML =
    '<div class="edate" style="background:#e6f4ea">' +
      '<span class="emon" style="color:#28a745">' + mon + '</span>' +
      '<span class="eday">' + day + '</span>' +
    '</div>' +
    '<div class="einfo">' +
      '<div class="ename">' + name + ' <span style="font-size:10px;background:#28a745;color:#fff;padding:1px 6px;border-radius:10px;margin-left:4px">New</span></div>' +
      '<div class="emeta"><i class="fa fa-map-marker-alt"></i> ' + loc + '</div>' +
      '<div class="emeta"><i class="fa fa-users"></i> 1 attending (you)</div>' +
    '</div>';

  // Insert before the first existing event
  parent.insertBefore(div, container);
}

/* ============================================================
   QR LANDING PAGE PREVIEW
============================================================ */
function openQRPreview() {
  var name = document.getElementById('evName').value || 'Your Event';
  var desc = document.getElementById('evDesc').value || 'A professional networking event.';
  var qlpName = document.getElementById('qlpName');
  var qlpDesc = document.getElementById('qlpDesc');
  if (qlpName) qlpName.textContent = name;
  if (qlpDesc) qlpDesc.textContent = desc;
  var cnt = document.getElementById('qlpCount');
  if (cnt) cnt.textContent = '1';
  openModal('modalQRLanding');
}

var joinCount = 1;
function simulateJoin() {
  joinCount++;
  var cnt = document.getElementById('qlpCount');
  if (cnt) cnt.textContent = joinCount;
  showToast('You joined the networking session!');
  setTimeout(function() { closeModal('modalQRLanding'); }, 1200);
}

/* ============================================================
   MODAL HELPERS
============================================================ */
function openModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('hidden');
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.add('hidden');
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(function(m) {
      m.classList.add('hidden');
    });
  }
});
