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
      userRole = 'attendee';
      document.getElementById('sessionPageTitle').textContent = 'LiveSync Session';
      var meta = document.getElementById('sessionMeta');
      if (meta) {
        meta.innerHTML = '<i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>' + code +
          '</strong> &nbsp;·&nbsp; <i class="fa fa-map-marker-alt"></i> Mumbai · BKC &nbsp;·&nbsp; <i class="fa fa-users"></i> 84 attendees';
      }
      var roleBar = document.getElementById('sessionRoleBar');
      if (roleBar) roleBar.classList.add('hidden');
      applyNetworkingState(isNetworkingEnabled);
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
  applyNetworkingState(true);
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
  ['fIndustry','fProfessionSel','fExp','fCompSize','fOTW','fInterestsSel','evGroup'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  // Reset others inputs
  ['fIndustryOther','fProfessionOther','fExpOther','fCompSizeOther','fInterestsOther'].forEach(function(id) {
    var el = document.getElementById(id); if (el) { el.value=''; el.classList.add('hidden'); }
  });
  document.querySelectorAll('.tag-opt.selected').forEach(function(t) { t.classList.remove('selected'); });
  var nt = document.getElementById('notifyToggle'); if (nt) nt.checked = false;
  var qrt = document.getElementById('qrToggle'); if (qrt) qrt.checked = false;
  var gt = document.getElementById('groupToggle'); if (gt) gt.checked = false;
  var np = document.getElementById('notifyPanel'); if (np) np.classList.add('hidden');
  var qa = document.getElementById('qrPreviewArea'); if (qa) qa.classList.add('hidden');
  // Reset QR date fields
  ['qrStartDt','qrEndDt'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  var qrErr = document.getElementById('qrDateError');   if (qrErr) qrErr.classList.add('hidden');
  var qrSum = document.getElementById('qrDateSummary'); if (qrSum) qrSum.classList.add('hidden');
  var gp = document.getElementById('groupPanel'); if (gp) gp.classList.add('hidden');
  // reset group mode back to create
  var cp = document.getElementById('groupCreatePanel'); if (cp) cp.classList.remove('hidden');
  var ap = document.getElementById('groupAttachPanel'); if (ap) ap.classList.add('hidden');
  var cb = document.getElementById('groupModeCreate'); if (cb) cb.classList.add('active');
  var ab = document.getElementById('groupModeAttach'); if (ab) ab.classList.remove('active');
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
  ['fGeo'].forEach(function(id) { var el = document.getElementById(id); if (el && el.value.trim()) count++; });
  ['fIndustry','fProfessionSel','fExp','fCompSize','fOTW','fInterestsSel'].forEach(function(id) {
    var el = document.getElementById(id); if (el && el.value && el.value !== 'others') count++;
  });
  // Count Others custom inputs too
  ['fIndustryOther','fProfessionOther','fExpOther','fCompSizeOther','fInterestsOther'].forEach(function(id) {
    var el = document.getElementById(id); if (el && el.value.trim()) count++;
  });
  var reach = Math.max(30, 480 - count * 55 + Math.floor(Math.random() * 20));
  var el = document.getElementById('reachNum'); if (el) el.textContent = '~' + reach + ' professionals';
}

function toggleQRPreview() {
  var on = document.getElementById('qrToggle').checked;
  var area = document.getElementById('qrPreviewArea');
  if (area) area.classList.toggle('hidden', !on);
  if (on) {
    syncNotifPreview();
    // Pre-fill start date with event date if set, else now
    var evDt = document.getElementById('evDatetime');
    var startEl = document.getElementById('qrStartDt');
    var endEl   = document.getElementById('qrEndDt');
    if (startEl && !startEl.value) {
      var base = (evDt && evDt.value) ? new Date(evDt.value) : new Date();
      startEl.value = toLocalDatetimeInput(base);
      // Default end = event date (same day end)
      if (endEl && !endEl.value) {
        var defEnd = new Date(base);
        defEnd.setHours(23, 59, 0, 0);
        endEl.value = toLocalDatetimeInput(defEnd);
      }
    }
  }
}

function toLocalDatetimeInput(d) {
  var pad = function(n) { return String(n).padStart(2,'0'); };
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) +
         'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function validateQRDates() {
  var startEl   = document.getElementById('qrStartDt');
  var endEl     = document.getElementById('qrEndDt');
  var errorEl   = document.getElementById('qrDateError');
  var summaryEl = document.getElementById('qrDateSummary');
  if (!startEl || !endEl || !errorEl || !summaryEl) return true;

  var startVal = startEl.value;
  var endVal   = endEl.value;

  if (!startVal || !endVal) {
    errorEl.classList.add('hidden');
    summaryEl.classList.add('hidden');
    return true;
  }

  var start = new Date(startVal);
  var end   = new Date(endVal);
  var diffMs   = end - start;
  var maxMs    = 5 * 24 * 60 * 60 * 1000; // 5 days

  if (end <= start) {
    errorEl.textContent = '⚠ End date & time must be after start date & time.';
    errorEl.classList.remove('hidden');
    summaryEl.classList.add('hidden');
    return false;
  }

  if (diffMs > maxMs) {
    errorEl.textContent = '⚠ End date cannot exceed 5 days from start date.';
    errorEl.classList.remove('hidden');
    summaryEl.classList.add('hidden');
    return false;
  }

  // Valid — show summary
  errorEl.classList.add('hidden');
  var diffHours = Math.round(diffMs / (1000 * 60 * 60));
  var diffDays  = Math.floor(diffHours / 24);
  var remHours  = diffHours % 24;
  var durLabel  = diffDays > 0
    ? diffDays + 'd ' + (remHours > 0 ? remHours + 'h' : '')
    : diffHours + 'h';
  summaryEl.innerHTML =
    '<i class="fa fa-circle-check" style="color:#28a745"></i> QR active for <strong>' +
    durLabel.trim() + '</strong>';
  summaryEl.classList.remove('hidden');
  return true;
}

function toggleTag(el) { el.classList.toggle('selected'); }

function submitEvent() {
  var name = (document.getElementById('evName').value || '').trim();
  var loc  = (document.getElementById('evLocation').value || '').trim();
  if (!name) { showToast('Please enter an event name'); goStep(1); return; }
  if (!loc)  { showToast('Please enter a location');   goStep(1); return; }

  // Validate QR dates if QR is enabled
  var qrOn = document.getElementById('qrToggle');
  if (qrOn && qrOn.checked) {
    if (!validateQRDates()) {
      showToast('⚠ Please fix the QR date range before launching');
      return;
    }
  }

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

  var toggleId  = 'nt_' + code;
  var labelId   = 'nl_' + code;
  var statusId  = 'ns_' + code;

  // Initialise networking state for this new event (default: enabled)
  if (!(code in eventNetworkingState)) eventNetworkingState[code] = true;

  var div = document.createElement('div');
  div.className = 'my-event-card hosted-event';
  div.style.borderTop = '2px solid #28a745';
  div.innerHTML =
    '<div class="event-role-badge host-badge"><i class="fa fa-crown"></i> Hosting</div>' +
    '<div class="my-event-info">' +
      '<div class="my-event-name">' + name +
        ' <span style="font-size:10px;background:#28a745;color:#fff;padding:1px 6px;border-radius:10px">New</span>' +
      '</div>' +
      '<div class="emeta"><i class="fa fa-map-marker-alt"></i> ' + loc + '</div>' +
      '<div class="emeta" style="color:#c37d16"><i class="fa fa-key"></i> Code: <strong>' + code + '</strong></div>' +
    '</div>' +
    '<div class="networking-toggle-row">' +
      '<span class="networking-toggle-label" id="' + labelId + '">' +
        '<i class="fa fa-wifi" style="color:#28a745"></i> Networking: <strong id="' + statusId + '">Enabled</strong>' +
      '</span>' +
      '<label class="toggle-switch">' +
        '<input type="checkbox" id="' + toggleId + '" data-code="' + code + '" checked ' +
          'onchange="toggleNetworkingForEvent(this,\'' + labelId + '\',\'' + statusId + '\')">' +
        '<span class="toggle-slider"></span>' +
      '</label>' +
    '</div>' +
    '<div class="my-event-actions">' +
      '<button class="btn-primary btn-sm" ' +
        'onclick="openHostedEventByName(\'' + name + '\',\'' + loc + '\',\'' + code + '\',\'' + toggleId + '\')">View Event</button>' +
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

/* ============================================================
   START LIVESYNC — INSTANT NETWORKING
============================================================ */
var lsCode         = null;   // active session code
var lsDurationMins = 10;     // chosen duration
var lsEndTime      = null;   // timestamp when session expires
var lsTimerInterval = null;  // setInterval handle for countdown
var lsExpired      = false;

function openStartLivesync() {
  // Show config step, hide others
  document.getElementById('lsStepConfig').classList.remove('hidden');
  document.getElementById('lsStepActive').classList.add('hidden');
  document.getElementById('lsStepExpired').classList.add('hidden');
  // Reset duration radio UI
  document.getElementById('lsDur10').classList.add('selected');
  document.getElementById('lsDur60').classList.remove('selected');
  // Wire up duration card clicks
  document.getElementById('lsDur10').addEventListener('click', function() {
    document.getElementById('lsDur10').classList.add('selected');
    document.getElementById('lsDur60').classList.remove('selected');
    this.querySelector('input').checked = true;
  });
  document.getElementById('lsDur60').addEventListener('click', function() {
    document.getElementById('lsDur60').classList.add('selected');
    document.getElementById('lsDur10').classList.remove('selected');
    this.querySelector('input').checked = true;
  });
  openModal('modalStartLivesync');
}

function launchLivesync() {
  // Read inputs
  var nameVal = (document.getElementById('lsName').value || '').trim() || 'LiveSync Session';
  var durRadio = document.querySelector('input[name="lsDuration"]:checked');
  lsDurationMins = durRadio ? parseInt(durRadio.value) : 10;

  // Generate 6-digit code
  lsCode = Math.floor(100000 + Math.random() * 900000).toString();
  validCodes[lsCode] = true;
  lsExpired = false;

  // Set end time
  lsEndTime = Date.now() + lsDurationMins * 60 * 1000;

  // Populate active step UI
  document.getElementById('lsActiveName').textContent = nameVal;
  document.getElementById('lsCodeDisplay').textContent = lsCode;

  // Switch to active step
  document.getElementById('lsStepConfig').classList.add('hidden');
  document.getElementById('lsStepActive').classList.remove('hidden');
  document.getElementById('lsStepExpired').classList.add('hidden');

  // Start countdown in modal
  updateLsModalTimer();
  if (lsTimerInterval) clearInterval(lsTimerInterval);
  lsTimerInterval = setInterval(function() {
    updateLsModalTimer();
    updateLsBanner();
  }, 1000);

  // Show hint
  showToast('⚡ Session started! Code: ' + lsCode);

  // Pre-populate the session page
  document.getElementById('sessionPageTitle').textContent = nameVal;
  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML = '<i class="fa fa-bolt" style="color:#c37d16"></i> Instant LiveSync &nbsp;·&nbsp; ' +
      '<i class="fa fa-key"></i> Code: <strong>' + lsCode + '</strong> &nbsp;·&nbsp; ' +
      '<i class="fa fa-clock"></i> ' + lsDurationMins + ' min session';
  }

  // Show the banner on the session page
  var banner = document.getElementById('livesyncBanner');
  if (banner) {
    banner.classList.remove('hidden');
    document.getElementById('livesyncBannerTitle').textContent = nameVal;
    updateLsBanner();
  }
}

function updateLsModalTimer() {
  var remaining = lsEndTime - Date.now();
  var pill = document.getElementById('lsActiveTimerPill');
  if (!pill) return;

  if (remaining <= 0) {
    clearInterval(lsTimerInterval);
    lsExpired = true;
    // Switch to expired step
    document.getElementById('lsStepActive').classList.add('hidden');
    document.getElementById('lsStepExpired').classList.remove('hidden');
    // Update banner
    var banner = document.getElementById('livesyncBanner');
    if (banner) {
      document.getElementById('livesyncBannerTimer').textContent = '⏹ Session ended';
      document.querySelector('.livesync-live-dot').style.background = '#aaa';
      document.querySelector('.livesync-live-dot').style.animation = 'none';
    }
    return;
  }

  var mins = Math.floor(remaining / 60000);
  var secs = Math.floor((remaining % 60000) / 1000);
  var label = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  pill.textContent = label;

  // Turn amber when < 2 minutes remain
  pill.classList.toggle('ending', mins < 2);
}

function updateLsBanner() {
  var remaining = lsEndTime - Date.now();
  var el = document.getElementById('livesyncBannerTimer');
  if (!el) return;
  if (remaining <= 0) { el.textContent = '⏹ Session ended'; return; }
  var mins = Math.floor(remaining / 60000);
  var secs = Math.floor((remaining % 60000) / 1000);
  el.textContent = 'Ends in: ' + String(mins).padStart(2,'0') + 'm ' + String(secs).padStart(2,'0') + 's';
}

function endLivesync() {
  clearInterval(lsTimerInterval);
  lsExpired = true;
  document.getElementById('lsStepActive').classList.add('hidden');
  document.getElementById('lsStepExpired').classList.remove('hidden');
  var el = document.getElementById('livesyncBannerTimer');
  if (el) el.textContent = '⏹ Session ended';
  showToast('LiveSync session ended.');
}

function resetLivesync() {
  document.getElementById('lsName').value = '';
  document.getElementById('lsStepExpired').classList.add('hidden');
  document.getElementById('lsStepConfig').classList.remove('hidden');
  document.getElementById('lsDur10').classList.add('selected');
  document.getElementById('lsDur60').classList.remove('selected');
  var r = document.querySelector('input[name="lsDuration"][value="10"]');
  if (r) r.checked = true;
}

function goToLivesyncPage() {
  closeModal('modalStartLivesync');
  showPage('session');
}

// Called from session page banner "Show Code" button
function showLivesyncCode() {
  if (!lsCode) { showToast('No active instant session'); return; }
  showToast('Session Code: ' + lsCode);
}

// Called from session page banner "QR" button
function showLivesyncQR() {
  openModal('modalStartLivesync');
  // Show the active step directly
  document.getElementById('lsStepConfig').classList.add('hidden');
  document.getElementById('lsStepExpired').classList.add('hidden');
  document.getElementById('lsStepActive').classList.remove('hidden');
}

/* ============================================================
   "OTHERS" HANDLER — Step 2 filters
============================================================ */
function handleOthers(selectEl, inputId) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  if (selectEl.value === 'others') {
    inp.classList.remove('hidden');
    inp.focus();
  } else {
    inp.classList.add('hidden');
    inp.value = '';
  }
}

/* ============================================================
   GROUP PANEL TOGGLE & MODE SWITCH (Step 3)
============================================================ */
function toggleGroupPanel() {
  var on = document.getElementById('groupToggle').checked;
  var panel = document.getElementById('groupPanel');
  if (panel) panel.classList.toggle('hidden', !on);
}

function switchGroupMode(mode) {
  var createPanel = document.getElementById('groupCreatePanel');
  var attachPanel = document.getElementById('groupAttachPanel');
  var createBtn   = document.getElementById('groupModeCreate');
  var attachBtn   = document.getElementById('groupModeAttach');
  if (mode === 'create') {
    createPanel.classList.remove('hidden');
    attachPanel.classList.add('hidden');
    createBtn.classList.add('active');
    attachBtn.classList.remove('active');
  } else {
    attachPanel.classList.remove('hidden');
    createPanel.classList.add('hidden');
    attachBtn.classList.add('active');
    createBtn.classList.remove('active');
  }
}

/* ============================================================
   QR DURATION RADIO WIRING (Step 3)
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  var dur10 = document.getElementById('qrDur10');
  var dur60 = document.getElementById('qrDur60');
  if (dur10) {
    dur10.addEventListener('click', function() {
      dur10.classList.add('selected');
      dur60.classList.remove('selected');
    });
  }
  if (dur60) {
    dur60.addEventListener('click', function() {
      dur60.classList.add('selected');
      dur10.classList.remove('selected');
    });
  }
});

/* ============================================================
   NETWORKING STATE — per-event dictionary (keyed by event code)
   eventNetworkingState is the ONLY source of truth.
   No other variable controls individual event networking state.
============================================================ */
var eventNetworkingState = {
  '847261': true   // static hosted event starts enabled
};

/* code of the event currently open in the session view */
var activeEventCode = '847261';

var userRole = 'host';

/* read state for a given code (defaults true on first access) */
function getNetworking(code) {
  if (!(code in eventNetworkingState)) eventNetworkingState[code] = true;
  return eventNetworkingState[code];
}

/* write state — ONLY function allowed to mutate eventNetworkingState */
function setNetworking(code, isOn) {
  eventNetworkingState[code] = isOn;
}

/* convenience getter for the active event */
function activeNetworking() {
  return getNetworking(activeEventCode);
}

/* ============================================================
   PRIVATE: update one event's sidebar label only
   Never touches any other event's DOM or state.
============================================================ */
function _refreshSidebarLabel(labelId, statusId, isOn) {
  var labelEl = document.getElementById(labelId);
  if (!labelEl) return;
  labelEl.innerHTML = isOn
    ? '<i class="fa fa-wifi" style="color:#28a745"></i> Networking: <strong id="' + statusId + '">Enabled</strong>'
    : '<i class="fa fa-wifi-slash" style="color:#cc1016"></i> Networking: <strong id="' + statusId + '">Disabled</strong>';
}

/* ============================================================
   NETWORKING TOGGLE — static hosted event (id: networkingToggle, code: 847261)
   Only called by the static event's checkbox. Does NOT touch dynamic events.
============================================================ */
function toggleNetworking(checkbox) {
  var code = '847261';
  var isOn = checkbox.checked;

  setNetworking(code, isOn);
  _refreshSidebarLabel('networkingLabel', 'networkingStatus', isOn);

  showToast(isOn
    ? '✅ Networking enabled — attendees can now connect'
    : '🚫 Networking disabled — attendees see stats only');

  // Only refresh session page if THIS event is the one open
  if (currentPage === 'session' && activeEventCode === code) {
    if (userRole === 'host') renderHostSessionHeader();
    else applyNetworkingState(isOn);
  }
}

/* ============================================================
   PER-EVENT TOGGLE — dynamic events created at runtime
   Each checkbox carries data-code="<eventCode>" so it knows
   exactly which event it belongs to.
   Does NOT touch the static event's checkbox or any other event.
============================================================ */
function toggleNetworkingForEvent(checkbox, labelId, statusId) {
  var code = checkbox.getAttribute('data-code');
  if (!code) return;
  var isOn = checkbox.checked;

  setNetworking(code, isOn);
  _refreshSidebarLabel(labelId, statusId, isOn);

  showToast(isOn
    ? '✅ Networking enabled — attendees can now connect'
    : '🚫 Networking disabled — attendees see stats only');

  // Only refresh session page if THIS event is the one open
  if (currentPage === 'session' && activeEventCode === code) {
    if (userRole === 'host') renderHostSessionHeader();
    else applyNetworkingState(isOn);
  }
}

/* ============================================================
   OPEN HOSTED EVENT — static (code: 847261)
============================================================ */
function openHostedEvent() {
  userRole        = 'host';
  activeEventCode = '847261';

  var titleEl = document.getElementById('sessionPageTitle');
  if (titleEl) titleEl.textContent = 'AI Startup Networking Mixer';

  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-crown" style="color:#0A66C2"></i> You are hosting &nbsp;·&nbsp; ' +
      '<i class="fa fa-calendar"></i> June 20, 2026 &nbsp;·&nbsp; ' +
      '<i class="fa fa-map-marker-alt"></i> Mumbai · BKC &nbsp;·&nbsp; ' +
      '<i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>847261</strong>';
  }

  renderHostSessionHeader();
  applyNetworkingState(true); // host always sees full people list
  showPage('session');
}

/* ============================================================
   OPEN HOSTED EVENT BY NAME — dynamically created events
============================================================ */
function openHostedEventByName(name, loc, code, toggleId) {
  userRole        = 'host';
  activeEventCode = code;

  // Initialise state to enabled if this event hasn't been seen before
  if (!(code in eventNetworkingState)) eventNetworkingState[code] = true;

  var titleEl = document.getElementById('sessionPageTitle');
  if (titleEl) titleEl.textContent = name;

  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-crown" style="color:#0A66C2"></i> You are hosting &nbsp;·&nbsp; ' +
      '<i class="fa fa-map-marker-alt"></i> ' + loc +
      ' &nbsp;·&nbsp; <i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>' + code + '</strong>';
  }

  renderHostSessionHeader();        // reads getNetworking(activeEventCode) — correct
  applyNetworkingState(true);       // host always sees full people list
  showPage('session');
}

/* ============================================================
   SESSION ROLE BAR — host view (reads per-event state via activeEventCode)
============================================================ */
function renderHostSessionHeader() {
  var roleBar = document.getElementById('sessionRoleBar');
  if (!roleBar) return;
  // Always read from per-event dict, never from a shared DOM checkbox
  var isOn = getNetworking(activeEventCode);
  roleBar.className = 'session-role-bar host-role-bar';
  roleBar.innerHTML =
    '<div class="srb-left">' +
      '<span class="srb-badge host-badge-inline"><i class="fa fa-crown"></i> You are hosting</span>' +
      '<span class="srb-sep">·</span>' +
      '<span id="srbNetStatus" class="srb-net-status ' + (isOn ? 'net-on' : 'net-off') + '">' +
        '<i class="fa ' + (isOn ? 'fa-wifi' : 'fa-wifi-slash') + '"></i> ' +
        'Networking ' + (isOn ? 'Enabled' : 'Disabled') +
      '</span>' +
    '</div>' +
    '<div class="srb-right">' +
      '<label class="toggle-switch" style="margin-left:8px">' +
        '<input type="checkbox" id="inlineNetworkingToggle" data-code="' + activeEventCode + '" ' +
          (isOn ? 'checked' : '') + ' onchange="inlineToggleNetworking(this)">' +
        '<span class="toggle-slider"></span>' +
      '</label>' +
      '<button class="btn-ghost btn-sm" style="margin-left:8px" ' +
        'onclick="openQRForEvent(\'' + activeEventCode + '\')">' +
        '<i class="fa fa-qrcode"></i> QR' +
      '</button>' +
    '</div>';
  roleBar.classList.remove('hidden');
}

/* inline toggle inside the session page role bar —
   writes only to eventNetworkingState[activeEventCode] */
function inlineToggleNetworking(checkbox) {
  var code = checkbox ? checkbox.getAttribute('data-code') : activeEventCode;
  var isOn = checkbox ? checkbox.checked : false;
  if (!code) return;

  setNetworking(code, isOn);

  // Sync the sidebar checkbox for this specific event only
  if (code === '847261') {
    var sc = document.getElementById('networkingToggle');
    if (sc) sc.checked = isOn;
    _refreshSidebarLabel('networkingLabel', 'networkingStatus', isOn);
  } else {
    var dc = document.getElementById('nt_' + code);
    if (dc) dc.checked = isOn;
    _refreshSidebarLabel('nl_' + code, 'ns_' + code, isOn);
  }

  // Update inline status pill
  var pill = document.getElementById('srbNetStatus');
  if (pill) {
    pill.className = 'srb-net-status ' + (isOn ? 'net-on' : 'net-off');
    pill.innerHTML = '<i class="fa ' + (isOn ? 'fa-wifi' : 'fa-wifi-slash') + '"></i> Networking ' + (isOn ? 'Enabled' : 'Disabled');
  }

  showToast(isOn ? '✅ Networking enabled — attendees can now connect' : '🚫 Attendees now see stats-only view');
}

/* ============================================================
   OPEN ATTENDING EVENT — attendee view (reads per-event state)
============================================================ */
var attendingEventData = {
  fintech: { name:'FinTech Networking Mixer',    date:'March 15, 2026', location:'The Lalit, Mumbai', attendees:112, code:'847261' },
  summit:  { name:'Product Leaders Summit 2026', date:'March 20, 2026', location:'Online · Zoom',     attendees:340, code:'SUMMIT' }
};

function openAttendingEvent(key, defaultNetworkingOn) {
  userRole = 'attendee';
  var ev = attendingEventData[key];
  if (!ev) return;

  activeEventCode = ev.code;

  // If this event's code is already in the dict (e.g. host toggled it), use that.
  // Otherwise use the static default passed in from the HTML onclick.
  if (!(ev.code in eventNetworkingState)) {
    eventNetworkingState[ev.code] = defaultNetworkingOn;
  }
  var isOn = eventNetworkingState[ev.code];

  var titleEl = document.getElementById('sessionPageTitle');
  if (titleEl) titleEl.textContent = ev.name;

  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-circle-check" style="color:#28a745"></i> You are attending &nbsp;·&nbsp; ' +
      '<i class="fa fa-calendar"></i> ' + ev.date + ' &nbsp;·&nbsp; ' +
      '<i class="fa fa-map-marker-alt"></i> ' + ev.location;
  }

  var ndCount = document.getElementById('ndAttendeeCount');
  if (ndCount) ndCount.textContent = ev.attendees;

  renderAttendeeSessionHeader(isOn);
  applyNetworkingState(isOn);
  showPage('session');
}

function renderAttendeeSessionHeader(isOn) {
  var roleBar = document.getElementById('sessionRoleBar');
  if (!roleBar) return;
  roleBar.className = 'session-role-bar attendee-role-bar';
  roleBar.innerHTML =
    '<div class="srb-left">' +
      '<span class="srb-badge attendee-badge-inline"><i class="fa fa-user"></i> You are attending</span>' +
      '<span class="srb-sep">·</span>' +
      '<span class="srb-net-status ' + (isOn ? 'net-on' : 'net-off') + '">' +
        '<i class="fa ' + (isOn ? 'fa-wifi' : 'fa-wifi-slash') + '"></i> ' +
        'Networking ' + (isOn ? 'Open' : 'Not yet enabled') +
      '</span>' +
    '</div>' +
    (isOn
      ? '<div class="srb-right srb-tip">Connect with people in this session</div>'
      : '<div class="srb-right srb-tip">The host hasn\'t enabled networking yet</div>');
  roleBar.classList.remove('hidden');
}

/* ============================================================
   APPLY NETWORKING STATE — controls what the session page shows
============================================================ */
function applyNetworkingState(isOn) {
  var tabsRow      = document.querySelector('#page-session .tabs');
  var peoplePanel  = document.getElementById('people');
  var disabledView = document.getElementById('networkingDisabledView');

  if (isOn) {
    if (tabsRow)      tabsRow.style.display = '';
    if (peoplePanel)  { peoplePanel.classList.remove('hidden'); peoplePanel.style.display = ''; }
    if (disabledView) disabledView.classList.add('hidden');
    showTab('people');
  } else {
    if (tabsRow)      tabsRow.style.display = 'none';
    if (peoplePanel)  { peoplePanel.classList.add('hidden'); peoplePanel.style.display = 'none'; }
    if (disabledView) disabledView.classList.remove('hidden');
  }
}

/* ============================================================
   PEOPLE PAGE — CHIP FILTER SYSTEM
============================================================ */
var activeFilters = { prof: '', interest: '' };

function toggleChipMenu(menuId) {
  // Close all other menus first
  document.querySelectorAll('.li-chip-menu').forEach(function(m) {
    if (m.id !== menuId) m.classList.add('hidden');
  });
  var menu = document.getElementById(menuId);
  if (menu) menu.classList.toggle('hidden');
}

// Close menus on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.li-filter-chip-wrap')) {
    document.querySelectorAll('.li-chip-menu').forEach(function(m) { m.classList.add('hidden'); });
  }
});

function selectChip(type, value) {
  if (value === 'others') {
    // Show the text input row, don't close menu yet
    var rowId  = type === 'prof' ? 'chipProfOtherRow'   : 'chipIntOtherRow';
    var row    = document.getElementById(rowId);
    if (row) { row.classList.remove('hidden'); row.querySelector('input').focus(); }
    return;
  }

  activeFilters[type] = value;

  // Hide the others row and clear its input
  var rowId  = type === 'prof' ? 'chipProfOtherRow'   : 'chipIntOtherRow';
  var inpId  = type === 'prof' ? 'chipProfOtherInput' : 'chipIntOtherInput';
  var row    = document.getElementById(rowId);
  var inp    = document.getElementById(inpId);
  if (row) row.classList.add('hidden');
  if (inp) inp.value = '';

  // Update chip label
  var chipId = type === 'prof' ? 'chipProf' : 'chipInt';
  var chip   = document.getElementById(chipId);
  if (chip) {
    var label = value || (type === 'prof' ? 'Profession' : 'Interest');
    chip.innerHTML = label + ' <i class="fa fa-chevron-down li-chip-caret"></i>';
    chip.classList.toggle('li-chip-active', !!value);
  }

  // Close menu
  var menuId = type === 'prof' ? 'chipProfMenu' : 'chipIntMenu';
  var menu   = document.getElementById(menuId);
  if (menu) menu.classList.add('hidden');

  applyPeopleFilter();
}

var peopleData = [
  { name:'Rahul Sharma',  title:'PGDM 2024–26 | Marketing | SPJIMR',              interest:'Marketing',            profession:'PGDM Student' },
  { name:'Priya Patel',   title:'PGDM 2024–26 | Finance | SPJIMR',                interest:'Finance',              profession:'Finance Professional' },
  { name:'Sofia Khan',    title:'PGDM 2024–26 | Strategy | SPJIMR',               interest:'Strategy',             profession:'Strategy Consultant' },
  { name:'John Mathew',   title:"SPJIMR Alum '22 | Product Manager | PhonePe",   interest:'Product',              profession:'Product Manager' },
  { name:'Ananya Reddy',  title:'PGDM 2024–26 | Finance | SPJIMR · Ex-Axis Bank', interest:'Finance',              profession:'Finance Professional' },
  { name:'Vikram Nair',   title:"SPJIMR Alum '21 | Associate | Sequoia India",   interest:'Strategy',             profession:'Strategy Consultant' },
  { name:'Divya Menon',   title:'PGDM 2024–26 | Operations & Analytics | SPJIMR', interest:'Analytics',            profession:'Operations Manager' },
  { name:'Aryan Kapoor',  title:"SPJIMR Alum '23 | Strategy | McKinsey",          interest:'Strategy',             profession:'Strategy Consultant' },
  { name:'Neha Joshi',    title:'PGDM 2024–26 | Digital Marketing | SPJIMR',      interest:'Digital Marketing',    profession:'Marketing Professional' },
  { name:'Rohan Desai',   title:"SPJIMR Alum '22 | Supply Chain Manager | Marico",interest:'Operations',           profession:'Operations Manager' },
  { name:'Ishita Bose',   title:'PGDM 2024–26 | Media & Entertainment | SPJIMR',  interest:'Media & Entertainment',profession:'Marketing Professional' },
  { name:'Karan Mehta',   title:'PGDM 2024–26 | General Management | SPJIMR',    interest:'Strategy',             profession:'PGDM Student' },
];

function applyPeopleFilter() {
  // Read chip selections (custom input overrides)
  var profCustom = (document.getElementById('chipProfOtherInput') || {}).value || '';
  var intCustom  = (document.getElementById('chipIntOtherInput')  || {}).value || '';
  var prof = (profCustom.trim() || activeFilters.prof).toLowerCase();
  var intr = (intCustom.trim()  || activeFilters.interest).toLowerCase();

  var cards = document.querySelectorAll('#people .pcard');
  var shown = 0;
  cards.forEach(function(card, i) {
    var pd = peopleData[i];
    if (!pd) { card.style.display = ''; shown++; return; }
    var profMatch = !prof || pd.profession.toLowerCase().includes(prof) || pd.title.toLowerCase().includes(prof);
    var intrMatch = !intr || pd.interest.toLowerCase().includes(intr)  || pd.title.toLowerCase().includes(intr);
    if (profMatch && intrMatch) { card.style.display = ''; shown++; }
    else card.style.display = 'none';
  });

  // Update tab count
  var tabBtn = document.getElementById('tabPeople');
  if (tabBtn) tabBtn.textContent = 'People (' + shown + ')';

  // Show/hide clear button
  var hasFilter = !!(prof || intr);
  var resetBtn  = document.getElementById('liFilterReset');
  if (resetBtn) resetBtn.classList.toggle('hidden', !hasFilter);
}

function clearPeopleFilter() {
  activeFilters = { prof: '', interest: '' };

  // Reset chips to default labels
  var chipProf = document.getElementById('chipProf');
  if (chipProf) { chipProf.innerHTML = 'Profession <i class="fa fa-chevron-down li-chip-caret"></i>'; chipProf.classList.remove('li-chip-active'); }
  var chipInt = document.getElementById('chipInt');
  if (chipInt) { chipInt.innerHTML = 'Interest <i class="fa fa-chevron-down li-chip-caret"></i>'; chipInt.classList.remove('li-chip-active'); }

  // Clear other inputs & hide rows
  ['chipProfOtherInput','chipIntOtherInput'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  ['chipProfOtherRow','chipIntOtherRow'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.classList.add('hidden');
  });

  // Show all cards
  document.querySelectorAll('#people .pcard').forEach(function(c) { c.style.display = ''; });
  var tabBtn = document.getElementById('tabPeople');
  if (tabBtn) tabBtn.textContent = 'People (12)';

  var resetBtn = document.getElementById('liFilterReset');
  if (resetBtn) resetBtn.classList.add('hidden');
}

/* ============================================================
   PREMIUM ACTIONS (now functional for premium user)
============================================================ */
function sendToAll() {
  var cards = document.querySelectorAll('#people .pcard');
  var count = 0;
  cards.forEach(function(card) {
    var btn = card.querySelector('.cbtn');
    if (btn && !btn.classList.contains('requested') && card.style.display !== 'none') {
      btn.classList.add('requested');
      btn.textContent = 'Requested';
      btn.disabled = true;
      count++;
      // Add to sent tab silently
      var nameEl  = card.querySelector('.pname');
      var titleEl = card.querySelector('.ptitle');
      var imgEl   = card.querySelector('img');
      if (nameEl) {
        sentCount++;
        updateSentTab(nameEl.textContent, titleEl ? titleEl.textContent : '', imgEl ? imgEl.src : '');
      }
    }
  });
  updateTabCounts();
  if (count > 0) showToast('⭐ Sent ' + count + ' connection requests!');
  else showToast('All visible attendees already requested.');
}

function joinGroup() {
  showToast('⭐ You joined: SPJIMR PGDM Batch 2024–26');
  var bar = document.querySelector('.join-group-bar .prem-btn');
  if (bar) { bar.textContent = 'Joined ✓'; bar.disabled = true; bar.style.opacity = '0.8'; }
}
