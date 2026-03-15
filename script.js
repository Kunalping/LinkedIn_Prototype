/* ============================================================
   PAGE NAVIGATION
============================================================ */
var currentPage = 'mynetwork';
var validCodes = { 'SPJIMR': true, '847261': true, 'KUNAL1': true };

function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.app-page').forEach(function(p) { p.classList.add('hidden'); });
  // Show target
  var pg = document.getElementById('page-' + name);
  if (pg) pg.classList.remove('hidden');
  currentPage = name;

  // Update active nav item
  document.querySelectorAll('.nitem').forEach(function(n) { n.classList.remove('active'); });
  var navMap = { home:'nav-home', mynetwork:'nav-mynetwork', jobs:'nav-jobs',
                 messaging:'nav-messaging', notifications:'nav-notifications', session:'nav-mynetwork' };
  var navEl = document.getElementById(navMap[name]);
  if (navEl) navEl.classList.add('active');

  // Clear badges on visit
  if (name === 'messaging') {
    var b = document.getElementById('msgBadge');
    if (b) b.style.display = 'none';
  }
  if (name === 'notifications') {
    var nb = document.getElementById('notifBadge');
    if (nb) nb.style.display = 'none';
    document.querySelectorAll('.notif-item.unread').forEach(function(n) { n.classList.remove('unread'); });
    document.querySelectorAll('.notif-unread-dot').forEach(function(d) { d.style.display = 'none'; });
  }

  // Close Me dropdown
  var dd = document.getElementById('meDropdown');
  if (dd) dd.classList.remove('open');

  window.scrollTo(0, 0);
}

/* ============================================================
   JOIN LIVESYNC SESSION (code entry)
============================================================ */
function joinSession() {
  var code = (document.getElementById('sessionCodeInput').value || '').trim().toUpperCase();
  if (!code) { showToast('Please enter a 6-digit event code'); return; }
  if (validCodes[code]) {
    showToast('✅ Joining session: AI Startup Networking Mixer...');
    setTimeout(function() {
      document.getElementById('sessionPageTitle').textContent = 'LiveSync Session';
      var meta = document.getElementById('sessionMeta');
      if (meta) {
        meta.innerHTML = '<i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>' + code +
          '</strong> &nbsp;·&nbsp; <i class="fa fa-map-marker-alt"></i> Mumbai · BKC &nbsp;·&nbsp; <i class="fa fa-users"></i> 84 attendees';
      }
      showPage('session');
    }, 600);
  } else {
    showToast('❌ Invalid code. Try SPJIMR or 847261');
  }
}

/* ============================================================
   VIEW EVENT (from My Events card)
============================================================ */
function viewEvent(name, date, location, attendees, code) {
  var title = document.getElementById('sessionPageTitle');
  if (title) title.textContent = name;
  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-calendar" style="color:#0A66C2"></i> ' + date +
      ' &nbsp;·&nbsp; <i class="fa fa-map-marker-alt" style="color:#0A66C2"></i> ' + location +
      ' &nbsp;·&nbsp; <i class="fa fa-users" style="color:#0A66C2"></i> ' + attendees + ' attendees' +
      ' &nbsp;·&nbsp; <i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>' + code + '</strong>';
  }
  showPage('session');
}

/* ============================================================
   OPEN QR FOR EXISTING EVENT
============================================================ */
function openQRForEvent(name) {
  var qlpName = document.getElementById('qlpName');
  var qlpDesc = document.getElementById('qlpDesc');
  if (qlpName) qlpName.textContent = name;
  if (qlpDesc) qlpDesc.textContent = 'A networking event for professionals in AI, Product & Startups.';
  openModal('modalQRLanding');
}

/* ============================================================
   MY NETWORK: ACCEPT / IGNORE PENDING REQUESTS
============================================================ */
function acceptNetReq(name, cardId) {
  var card = document.getElementById(cardId);
  if (!card) return;
  card.style.opacity = '0';
  card.style.transition = 'opacity 0.3s';
  setTimeout(function() { card.remove(); }, 300);
  showToast('You are now connected with ' + name + '!');
}

function ignoreNetReq(cardId) {
  var card = document.getElementById(cardId);
  if (!card) return;
  card.style.opacity = '0';
  card.style.transition = 'opacity 0.3s';
  setTimeout(function() { card.remove(); }, 300);
  showToast('Request dismissed.');
}

/* ============================================================
   SESSION PAGE: TAB SWITCHING
============================================================ */
var sentCount     = 0;
var receivedCount = 2;

function showTab(name) {
  document.querySelectorAll('.tabPanel').forEach(function(p) { p.classList.add('hidden'); });
  document.querySelectorAll('.tabBtn').forEach(function(b) { b.classList.remove('active'); });
  var panel = document.getElementById(name);
  if (panel) panel.classList.remove('hidden');
  var btnMap = { people: 'tabPeople', received: 'tabReceived', sent: 'tabSent' };
  var btn = document.getElementById(btnMap[name]);
  if (btn) btn.classList.add('active');
}

/* ============================================================
   SESSION PAGE: CONNECT
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
   SESSION PAGE: ACCEPT / IGNORE RECEIVED
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

function updateTabCounts() {
  var s = document.getElementById('tabSent');
  if (s) s.textContent = 'Req Sent (' + sentCount + ')';
  var r = document.getElementById('tabReceived');
  if (r) r.textContent = 'Req Received (' + receivedCount + ')';
}

/* ============================================================
   COUNTDOWN TIMER
============================================================ */
var sessionEndTime = Date.now() + ((2 * 24 * 60 * 60) + (4 * 60 * 60) + (37 * 60)) * 1000;

function updateTimer() {
  var remaining = sessionEndTime - Date.now();
  var el = document.getElementById('timerDisplay');
  if (!el) return;
  if (remaining <= 0) { el.textContent = 'Session ended'; el.style.color = '#cc1016'; return; }
  var days  = Math.floor(remaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var mins  = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  el.textContent = (days > 0 ? days + 'd ' : '') + String(hours).padStart(2,'0') + 'h ' + String(mins).padStart(2,'0') + 'm';
}
updateTimer();
setInterval(updateTimer, 30000);

/* ============================================================
   FEED: LIKE TOGGLE
============================================================ */
function toggleLike(btn, postId) {
  var isLiked = btn.classList.contains('liked');
  btn.classList.toggle('liked');
  var statsEl = document.querySelector('#' + postId + ' .post-stats span');
  if (statsEl) {
    var text = statsEl.textContent;
    var match = text.match(/(\d+)/);
    if (match) {
      var count = parseInt(match[1]);
      count = isLiked ? count - 1 : count + 1;
      statsEl.innerHTML = '<i class="fa fa-thumbs-up" style="color:#0A66C2"></i> ' + count + text.substring(text.indexOf('·'));
    }
  }
}

/* ============================================================
   MESSAGING
============================================================ */
var convos = {
  priya:  { name:'Priya Patel', sub:'PGDM 2024–26 | Finance | SPJIMR', img:'https://randomuser.me/api/portraits/women/44.jpg',
    messages:[{from:'them',text:'Hey Kunal! Are you going to the FinTech Mixer on the 15th?'},{from:'me',text:'Yes! I\'ve already registered. Looking forward to it 🎉'},{from:'them',text:'Amazing! Let\'s connect there. I heard Vikram Nair is also attending.'},{from:'them',text:'Hey! Are you coming to the FinTech Mixer?'}] },
  aryan:  { name:'Aryan Kapoor', sub:'SPJIMR Alum \'23 | McKinsey', img:'https://randomuser.me/api/portraits/men/71.jpg',
    messages:[{from:'them',text:'Great connecting at the event, Kunal!'},{from:'me',text:'Likewise! Would love to get your perspective on consulting recruiting.'},{from:'them',text:'Of course, let\'s schedule a call this week.'}] },
  vikram: { name:'Vikram Nair', sub:'SPJIMR Alum \'21 | Sequoia India', img:'https://randomuser.me/api/portraits/men/58.jpg',
    messages:[{from:'them',text:'Hi Kunal, came across your profile. Impressive background.'},{from:'them',text:'Let me know if you\'d like to discuss the opportunity.'}] },
  meera:  { name:'Meera Iyer', sub:'SPJIMR Alum \'21 | BCG Mumbai', img:'https://randomuser.me/api/portraits/women/30.jpg',
    messages:[{from:'them',text:'Thanks for connecting, Kunal!'},{from:'me',text:'Great to be connected! Would love to hear about your BCG journey.'}] }
};

function openConvo(key) {
  var c = convos[key];
  if (!c) return;
  document.querySelectorAll('.convo-item').forEach(function(ci) { ci.classList.remove('active'); });
  event.currentTarget.classList.add('active');
  document.getElementById('msgChatName').textContent = c.name;
  document.getElementById('msgChatSub').textContent = c.sub;
  document.getElementById('msgChatAvatar').src = c.img;
  var msgBox = document.getElementById('msgMessages');
  msgBox.innerHTML = '';
  c.messages.forEach(function(m) {
    var div = document.createElement('div');
    div.className = 'msg-bubble ' + (m.from === 'me' ? 'sent' : 'received');
    div.textContent = m.text;
    msgBox.appendChild(div);
  });
  msgBox.scrollTop = msgBox.scrollHeight;
}

function sendMessage() {
  var input = document.getElementById('msgInput');
  var text = (input.value || '').trim();
  if (!text) return;
  var msgBox = document.getElementById('msgMessages');
  var div = document.createElement('div');
  div.className = 'msg-bubble sent';
  div.textContent = text;
  msgBox.appendChild(div);
  input.value = '';
  msgBox.scrollTop = msgBox.scrollHeight;
  // Simulate reply
  setTimeout(function() {
    var reply = document.createElement('div');
    reply.className = 'msg-bubble received';
    reply.textContent = 'Thanks for your message! Will get back to you shortly.';
    msgBox.appendChild(reply);
    msgBox.scrollTop = msgBox.scrollHeight;
  }, 1200);
}

/* ============================================================
   NOTIFICATIONS
============================================================ */
function markRead(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.remove('unread');
    var dot = el.querySelector('.notif-unread-dot');
    if (dot) dot.style.display = 'none';
  }
}

/* ============================================================
   ME DROPDOWN
============================================================ */
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

/* ============================================================
   PREMIUM PROMPT
============================================================ */
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
  ['evName','evDesc','evLocation','evDatetime','fGeo','fProfession','fSkills'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  ['fIndustry','fExp','evGroup'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  document.querySelectorAll('.tag-opt.selected').forEach(function(t) { t.classList.remove('selected'); });
  var nt = document.getElementById('notifyToggle'); if (nt) nt.checked = false;
  var qrt = document.getElementById('qrToggle'); if (qrt) qrt.checked = false;
  var gt = document.getElementById('groupToggle'); if (gt) gt.checked = false;
  var np = document.getElementById('notifyPanel'); if (np) np.classList.add('hidden');
  var qa = document.getElementById('qrPreviewArea'); if (qa) qa.classList.add('hidden');
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
  if (n === 2) syncNotifPreview();
}

function syncNotifPreview() {
  var name = (document.getElementById('evName') || {}).value || 'your event';
  var loc  = (document.getElementById('evLocation') || {}).value || 'your city';
  var pn = document.getElementById('prevEventName'); if (pn) pn.textContent = name;
  var pl = document.getElementById('prevLocation');  if (pl) pl.textContent = loc;
  var ql = document.getElementById('qrEventLabel');  if (ql) ql.textContent = name;
}

function toggleNotifyPanel() {
  var on = document.getElementById('notifyToggle').checked;
  var panel = document.getElementById('notifyPanel');
  if (panel) panel.classList.toggle('hidden', !on);
  if (on) updateReach();
}

function updateReach() {
  var count = 0;
  ['fGeo','fProfession','fSkills'].forEach(function(id) { var el = document.getElementById(id); if (el && el.value.trim()) count++; });
  ['fIndustry','fExp'].forEach(function(id) { var el = document.getElementById(id); if (el && el.selectedIndex > 0) count++; });
  var reach = Math.max(30, 480 - count * 55 + Math.floor(Math.random() * 20));
  var el = document.getElementById('reachNum'); if (el) el.textContent = '~' + reach + ' professionals';
}

function toggleQRPreview() {
  var on = document.getElementById('qrToggle').checked;
  var area = document.getElementById('qrPreviewArea');
  if (area) area.classList.toggle('hidden', !on);
  if (on) syncNotifPreview();
}

function toggleTag(el) { el.classList.toggle('selected'); }

function submitEvent() {
  var name = (document.getElementById('evName').value || '').trim();
  var loc  = (document.getElementById('evLocation').value || '').trim();
  if (!name) { showToast('Please enter an event name'); goStep(1); return; }
  if (!loc)  { showToast('Please enter a location');   goStep(1); return; }

  // Generate 6-digit code
  var code = Math.floor(100000 + Math.random() * 900000).toString();
  validCodes[code] = true;

  closeModal('modalCreateEvent');

  // Populate dashboard
  document.getElementById('dashEventTitle').textContent = name;
  var notifyOn = document.getElementById('notifyToggle').checked;
  document.getElementById('dNotifSent').textContent = notifyOn ? '500' : '—';

  // Add to My Events sidebar
  addMyEvent(name, loc, code);

  setTimeout(function() { openModal('modalDashboard'); }, 400);
  showToast('🚀 "' + name + '" launched! Code: ' + code);
}

function addMyEvent(name, loc, code) {
  var container = document.querySelector('#page-mynetwork .scard .my-event-card');
  if (!container) return;
  var parent = container.parentElement;
  var div = document.createElement('div');
  div.className = 'my-event-card';
  div.style.borderTop = '2px solid #28a745';
  div.innerHTML =
    '<div class="my-event-info">' +
      '<div class="my-event-name">' + name + ' <span style="font-size:10px;background:#28a745;color:#fff;padding:1px 6px;border-radius:10px">New</span></div>' +
      '<div class="emeta"><i class="fa fa-map-marker-alt"></i> ' + loc + '</div>' +
      '<div class="emeta" style="color:#c37d16"><i class="fa fa-key"></i> Code: <strong>' + code + '</strong></div>' +
    '</div>' +
    '<div class="my-event-actions">' +
      '<button class="btn-primary btn-sm" onclick="viewEvent(\'' + name + '\',\'Today\',\'' + loc + '\',1,\'' + code + '\')">View Event</button>' +
      '<button class="btn-ghost btn-sm" onclick="openQRForEvent(\'' + name + '\')"><i class="fa fa-qrcode"></i> QR</button>' +
      '<button class="btn-ghost btn-sm" onclick="showToast(\'Share link copied!\')"><i class="fa fa-share"></i></button>' +
    '</div>';
  parent.insertBefore(div, container);
}

/* ============================================================
   QR LANDING PAGE PREVIEW
============================================================ */
function openQRPreview() {
  var name = (document.getElementById('evName') || {}).value || 'Your Event';
  var desc = (document.getElementById('evDesc') || {}).value || 'A professional networking event.';
  var qlpName = document.getElementById('qlpName'); if (qlpName) qlpName.textContent = name;
  var qlpDesc = document.getElementById('qlpDesc'); if (qlpDesc) qlpDesc.textContent = desc;
  var cnt = document.getElementById('qlpCount'); if (cnt) cnt.textContent = '1';
  openModal('modalQRLanding');
}

var joinCount = 84;
function simulateJoin() {
  joinCount++;
  var cnt = document.getElementById('qlpCount'); if (cnt) cnt.textContent = joinCount;
  showToast('You joined the networking session!');
  setTimeout(function() { closeModal('modalQRLanding'); }, 1200);
}

/* ============================================================
   MODAL HELPERS
============================================================ */
function openModal(id) { var m = document.getElementById(id); if (m) m.classList.remove('hidden'); }
function closeModal(id) { var m = document.getElementById(id); if (m) m.classList.add('hidden'); }

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.add('hidden');
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(function(m) { m.classList.add('hidden'); });
});
