/* ============================================================
   STATE
============================================================ */
let sentCount    = 0;
let receivedCount = 2; // pre-loaded sample requests

/* ============================================================
   TAB SWITCHING
============================================================ */
function showTab(name) {
  // hide all panels
  document.querySelectorAll('.tabPanel').forEach(p => p.classList.add('hidden'));
  // deactivate all tab buttons
  document.querySelectorAll('.tabBtn').forEach(b => b.classList.remove('active'));

  // show target panel
  var panel = document.getElementById(name);
  if (panel) panel.classList.remove('hidden');

  // activate matching button
  var btnMap = { people: 'tabPeople', received: 'tabReceived', sent: 'tabSent' };
  var btn = document.getElementById(btnMap[name]);
  if (btn) btn.classList.add('active');
}

/* ============================================================
   CONNECT BUTTON
============================================================ */
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

/* ============================================================
   ACCEPT / IGNORE RECEIVED REQUESTS
============================================================ */
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

/* ============================================================
   TAB COUNTERS
============================================================ */
function updateTabCounts() {
  var sentBtn = document.getElementById('tabSent');
  if (sentBtn) sentBtn.textContent = 'Req Sent (' + sentCount + ')';

  var recvBtn = document.getElementById('tabReceived');
  if (recvBtn) recvBtn.textContent = 'Req Received (' + receivedCount + ')';
}

/* ============================================================
   ME DROPDOWN
============================================================ */
function toggleDropdown() {
  var dd = document.getElementById('meDropdown');
  if (!dd) return;
  dd.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  var nme = document.getElementById('nme');
  var dd  = document.getElementById('meDropdown');
  if (!dd || !nme) return;
  if (!nme.contains(e.target)) {
    dd.classList.remove('open');
  }
});

/* ============================================================
   TOAST
============================================================ */
var toastTimer = null;

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.add('hidden'); }, 3000);
}
