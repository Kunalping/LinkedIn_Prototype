/* ============================================================ SESSION COUNTDOWN TIMER */
// Session duration: 2 days, 4 hours, 37 minutes from page load
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

  el.textContent =
    (days > 0 ? days + 'd ' : '') +
    String(hours).padStart(2,'0') + 'h ' +
    String(mins).padStart(2,'0') + 'm';
}

updateTimer();
setInterval(updateTimer, 30000); // refresh every 30s

/* ============================================================ PREMIUM PROMPT */
function showPremiumPrompt() {
  showToast('⭐ Upgrade to LinkedIn Premium to unlock this feature');
}

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
