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
      applyNetworkingState(true);
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

function handleFilterOthers(selectEl, inputId) {
  handleOthers(selectEl, inputId);
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
   NETWORKING TOGGLE (My Events sidebar)
============================================================ */
var networkingEnabled = true;

function toggleNetworking() {
  networkingEnabled = document.getElementById('networkingToggle').checked;
  var statusEl = document.getElementById('networkingStatus');
  var labelEl  = document.getElementById('networkingLabel');
  if (statusEl) {
    statusEl.textContent = networkingEnabled ? 'Enabled' : 'Disabled';
  }
  if (labelEl) {
    labelEl.innerHTML = networkingEnabled
      ? '<i class="fa fa-wifi" style="color:#28a745"></i> Networking: <strong id="networkingStatus">Enabled</strong>'
      : '<i class="fa fa-wifi-slash" style="color:#cc1016"></i> Networking: <strong id="networkingStatus">Disabled</strong>';
  }
  showToast(networkingEnabled ? '✅ Networking enabled for attendees' : '🚫 Networking disabled — attendees see stats only');
}

/* ============================================================
   OPEN HOSTED EVENT (host view — with networking toggle)
============================================================ */
function openHostedEvent() {
  var title = document.getElementById('sessionPageTitle');
  if (title) title.textContent = 'AI Startup Networking Mixer';
  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-crown" style="color:#0A66C2"></i> You are hosting &nbsp;·&nbsp; ' +
      '<i class="fa fa-calendar"></i> June 20, 2026 &nbsp;·&nbsp; ' +
      '<i class="fa fa-map-marker-alt"></i> Mumbai · BKC &nbsp;·&nbsp; ' +
      '<i class="fa fa-key" style="color:#c37d16"></i> Code: <strong>847261</strong>';
  }
  applyNetworkingState(true); // host always sees full people list
  showPage('session');
}

/* ============================================================
   OPEN ATTENDING EVENT (attendee view)
============================================================ */
var attendingEventData = {
  fintech: { name:'FinTech Networking Mixer', date:'March 15, 2026', location:'The Lalit, Mumbai', attendees:112 },
  summit:  { name:'Product Leaders Summit 2026', date:'March 20, 2026', location:'Online · Zoom', attendees:340 }
};

function openAttendingEvent(key, isNetworkingOn) {
  var ev = attendingEventData[key];
  if (!ev) return;
  var title = document.getElementById('sessionPageTitle');
  if (title) title.textContent = ev.name;
  var meta = document.getElementById('sessionMeta');
  if (meta) {
    meta.innerHTML =
      '<i class="fa fa-circle-check" style="color:#28a745"></i> Attending &nbsp;·&nbsp; ' +
      '<i class="fa fa-calendar"></i> ' + ev.date + ' &nbsp;·&nbsp; ' +
      '<i class="fa fa-map-marker-alt"></i> ' + ev.location;
  }
  var ndCount = document.getElementById('ndAttendeeCount');
  if (ndCount) ndCount.textContent = ev.attendees;
  applyNetworkingState(isNetworkingOn);
  showPage('session');
}

/* ============================================================
   APPLY NETWORKING STATE (show/hide people vs disabled view)
============================================================ */
function applyNetworkingState(isOn) {
  var tabs         = document.querySelector('#page-session .tabs');
  var peoplePanel  = document.getElementById('people');
  var disabledView = document.getElementById('networkingDisabledView');
  var banner       = document.querySelector('#page-session .livesync-banner');

  if (isOn) {
    if (tabs) tabs.style.display = '';
    if (peoplePanel) peoplePanel.classList.remove('hidden');
    if (disabledView) disabledView.classList.add('hidden');
  } else {
    // Hide tabs and people panel; show disabled message
    if (tabs) tabs.style.display = 'none';
    if (peoplePanel) peoplePanel.classList.add('hidden');
    if (disabledView) disabledView.classList.remove('hidden');
  }
}

/* ============================================================
   PEOPLE PAGE FILTER
============================================================ */
var peopleData = [
  { id:'p1', name:'Rahul Sharma',  title:'PGDM 2024–26 | Marketing | SPJIMR',             interest:'Marketing',           profession:'PGDM Student' },
  { id:'p2', name:'Priya Patel',   title:'PGDM 2024–26 | Finance | SPJIMR',               interest:'Finance',             profession:'Finance Professional' },
  { id:'p3', name:'Sofia Khan',    title:'PGDM 2024–26 | Strategy | SPJIMR',              interest:'Strategy',            profession:'Strategy Consultant' },
  { id:'p4', name:'John Mathew',   title:"SPJIMR Alum '22 | Product Manager | PhonePe",  interest:'Product',             profession:'Product Manager' },
  { id:'p5', name:'Ananya Reddy',  title:'PGDM 2024–26 | Finance | SPJIMR · Ex-Axis Bank',interest:'Finance',            profession:'Finance Professional' },
  { id:'p6', name:'Vikram Nair',   title:"SPJIMR Alum '21 | Associate | Sequoia India",  interest:'Strategy',            profession:'Strategy Consultant' },
  { id:'p7', name:'Divya Menon',   title:'PGDM 2024–26 | Operations & Analytics | SPJIMR',interest:'Analytics',          profession:'Operations Manager' },
  { id:'p8', name:'Aryan Kapoor',  title:"SPJIMR Alum '23 | Strategy | McKinsey",         interest:'Strategy',            profession:'Strategy Consultant' },
  { id:'p9', name:'Neha Joshi',    title:'PGDM 2024–26 | Digital Marketing | SPJIMR',     interest:'Digital Marketing',   profession:'Marketing Professional' },
  { id:'p10',name:'Rohan Desai',   title:"SPJIMR Alum '22 | Supply Chain Manager | Marico",interest:'Operations',        profession:'Operations Manager' },
  { id:'p11',name:'Ishita Bose',   title:'PGDM 2024–26 | Media & Entertainment | SPJIMR', interest:'Media & Entertainment',profession:'Marketing Professional'},
  { id:'p12',name:'Karan Mehta',   title:'PGDM 2024–26 | General Management | SPJIMR',   interest:'Strategy',            profession:'PGDM Student' },
];

function applyPeopleFilter() {
  var profSel   = document.getElementById('filterProfession');
  var profOther = document.getElementById('filterProfessionOther');
  var intSel    = document.getElementById('filterInterest');
  var intOther  = document.getElementById('filterInterestOther');
  if (!profSel) return;

  var prof = profSel.value === 'others' ? (profOther.value || '').toLowerCase().trim()
                                        : profSel.value.toLowerCase();
  var intr = intSel.value === 'others'  ? (intOther.value || '').toLowerCase().trim()
                                        : intSel.value.toLowerCase();

  var cards = document.querySelectorAll('#people .pcard');
  var shown = 0;
  cards.forEach(function(card, i) {
    var pd = peopleData[i];
    if (!pd) { card.style.display = ''; shown++; return; }
    var profMatch = !prof || pd.profession.toLowerCase().includes(prof) || pd.title.toLowerCase().includes(prof);
    var intrMatch = !intr || pd.interest.toLowerCase().includes(intr) || pd.title.toLowerCase().includes(intr);
    if (profMatch && intrMatch) { card.style.display = ''; shown++; }
    else card.style.display = 'none';
  });

  // Update tab count
  var tabBtn = document.getElementById('tabPeople');
  if (tabBtn) tabBtn.textContent = 'People (' + shown + ')';
}

function clearPeopleFilter() {
  ['filterProfession','filterInterest'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  ['filterProfessionOther','filterInterestOther'].forEach(function(id) {
    var el = document.getElementById(id); if (el) { el.value = ''; el.classList.add('hidden'); }
  });
  applyPeopleFilter();
  var tabBtn = document.getElementById('tabPeople');
  if (tabBtn) tabBtn.textContent = 'People (12)';
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
