// مكتب الأمين — Alameen Office | Main JavaScript
// Arabic-first, RTL. Lightweight vanilla JS, restrained motion.

document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile menu toggle (toggles the .nav container) ----
  var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  var nav = document.getElementById('nav') || document.querySelector('.nav');

  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle('active', open);
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = mobileMenuBtn.querySelector('i');
      if (icon) { icon.classList.toggle('fa-bars', !open); icon.classList.toggle('fa-times', open); }
    }
  }

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('active'));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  // ---- WhatsApp modal (multiple triggers) ----
  var whatsappTriggers = document.querySelectorAll('.js-whatsapp-trigger');
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalClose = document.querySelector('.btn-close');
  var btnCopy = document.querySelector('.btn-copy');

  function openModal() { if (modalOverlay) modalOverlay.classList.add('active'); }
  function closeModal() { if (modalOverlay) modalOverlay.classList.remove('active'); }

  whatsappTriggers.forEach(function (btn) { btn.addEventListener('click', openModal); });

  if (modalOverlay) {
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      var phoneNumber = '+201030008802';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber)
          .then(function () { showToast('تم نسخ رقم الهاتف!'); closeModal(); })
          .catch(function () { showToast('تعذّر النسخ، يرجى المحاولة يدويًا'); });
      } else {
        showToast('تعذّر النسخ، يرجى المحاولة يدويًا');
      }
    });
  }

  // ---- Contact form (no backend — inform the user) ----
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = get('name'), email = get('email'), phone = get('phone'), message = get('message');
      if (!name || !email || !phone || !message) { showToast('يرجى ملء جميع الحقول المطلوبة'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('يرجى إدخال بريد إلكتروني صحيح'); return; }
      showToast('شكرًا لتواصلك معنا! سنردّ عليك قريبًا.');
      contactForm.reset();
    });
  }

  // ---- Smooth scroll for in-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.header');
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---- Header shadow on scroll ----
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.pageYOffset > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Toast ----
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  // ---- Scroll reveal (restrained; skipped under reduced motion) ----
  var revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ---- Website chat widget ----
  var siteChat = document.querySelector('.site-chat');
  var chatLauncher = document.querySelector('.chat-launcher');
  var chatPanel = document.querySelector('.chat-panel');
  var chatClose = document.querySelector('.chat-close');
  var chatExpand = document.querySelector('.chat-expand');
  var expandedKey = 'alameen_website_chat_expanded';
  var chatForm = document.querySelector('.chat-form');
  var chatInput = document.getElementById('chat-message-input');
  var chatMessages = document.querySelector('.chat-messages');
  var chatApiBase = window.ALAMEEN_CHAT_API_BASE || 'https://agency-booking.alameen-eg.xyz';
  var visitorKey = 'alameen_website_chat_visitor_id';
  var greetingText = 'أهلاً بيك في مكتب الأمين ✈️\n\nاختار رقم الخدمة 👇\n\n1- ✈️ حجز / تعديل طيران\n2- 📋 تأشيرات\n3- 🇸🇦 زيارة عائلية للسعودية\n4- 🚄 قطار الحرمين\n5- 🔲 باركود تأشيرات السعودية\n6- 🔒 موافقات / خطابات ضمان\n7- 📁 تساهيل / إنجاز\n8- ℹ️ استفسار عام\n9- ⭕ طلب خارج القائمة\n\n──────────────\n99- ❌ إنهاء المحادثة\n#- 👤 التواصل مع موظف\n\nأو اكتب استفسارك مباشرةً وهنساعدك. ✍️';
  var chatSeenMessages = {};
  var knownServerMessages = {};
  var historyLoaded = false;
  var pollTimer = null;
  var originalTitle = document.title;
  var unreadCount = 0;
  var windowHasFocus = document.hasFocus();
  var notificationPermissionAsked = false;
  var soundToggle = null;
  var soundEnabled = false;
  var audioContext = null;
  var chatInteracted = false;
  // Dynamic welcome menu fetched from the controller (same source as the AMEEN bot menu);
  // greetingText above is the offline fallback if the fetch fails.
  var welcomeMenuText = null;

  function makeVisitorId() {
    var rand = '';
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(12);
      window.crypto.getRandomValues(bytes);
      rand = Array.prototype.map.call(bytes, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    } else {
      rand = String(Date.now()) + String(Math.random()).slice(2);
    }
    return 'web_' + rand.slice(0, 24);
  }

  function getVisitorId() {
    try {
      var existing = localStorage.getItem(visitorKey);
      if (/^[A-Za-z0-9_-]{8,80}$/.test(existing || '')) return existing;
      var next = makeVisitorId();
      localStorage.setItem(visitorKey, next);
      return next;
    } catch (_) {
      return makeVisitorId();
    }
  }

  function messageKey(item, fallbackPrefix) {
    if (item && item.id) return String(item.id);
    if (item && item.channel_message_id) return String(item.channel_message_id);
    return String(fallbackPrefix || 'msg') + ':' + String(item && item.created_at || '') + ':' + String(item && item.text || '');
  }

  function isIncomingChatMessage(item) {
    if (!item) return false;
    var sender = String(item.sender_type || '').toLowerCase();
    var direction = String(item.direction || '').toLowerCase();
    return direction !== 'inbound' && sender !== 'customer' && sender !== 'user';
  }

  function messagePreview(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  function pageIsBackground() {
    return document.hidden || !windowHasFocus;
  }

  function shouldBadgeIncomingMessage() {
    return pageIsBackground() || !(siteChat && siteChat.classList.contains('open'));
  }

  function updateUnreadUi() {
    if (chatLauncher) {
      if (unreadCount > 0) {
        chatLauncher.setAttribute('data-unread', unreadCount > 9 ? '9+' : String(unreadCount));
        chatLauncher.classList.add('has-unread');
      } else {
        chatLauncher.removeAttribute('data-unread');
        chatLauncher.classList.remove('has-unread');
      }
    }
    document.title = unreadCount > 0 && pageIsBackground()
      ? '(' + unreadCount + ') رسالة جديدة - مكتب الأمين'
      : originalTitle;
  }

  function resetUnreadCount() {
    unreadCount = 0;
    updateUnreadUi();
  }

  function ensureNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'default' || notificationPermissionAsked || !chatInteracted) return;
    notificationPermissionAsked = true;
    try { Notification.requestPermission(); } catch (_) {}
  }

  function showBrowserNotification(text) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      var notification = new Notification('رسالة جديدة من مكتب الأمين', {
        body: messagePreview(text),
        tag: 'alameen-website-chat',
        silent: true
      });
      notification.onclick = function () {
        window.focus();
        openChat();
        notification.close();
      };
    } catch (_) {}
  }

  function playSoftNotificationSound() {
    if (!soundEnabled || !chatInteracted) return;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      var osc = audioContext.createOscillator();
      var gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.16);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.24);
    } catch (_) {}
  }

  function notifyIncomingBatch(messages) {
    if (!messages.length || !shouldBadgeIncomingMessage()) return;
    unreadCount += messages.length;
    updateUnreadUi();
    if (pageIsBackground()) {
      showBrowserNotification(messages[messages.length - 1].text);
      playSoftNotificationSound();
    }
  }

  function trackIncomingMessages(messages, options) {
    if (!Array.isArray(messages)) return;
    var notify = options && options.notify;
    var incoming = [];
    messages.forEach(function (item, index) {
      var key = messageKey(item, 'server:' + index);
      if (!key) return;
      var alreadyKnown = Boolean(knownServerMessages[key]);
      knownServerMessages[key] = true;
      if (notify && historyLoaded && !alreadyKnown && isIncomingChatMessage(item)) {
        incoming.push(item);
      }
    });
    notifyIncomingBatch(incoming);
  }

  function buildNotificationSettings() {
    if (!chatPanel || chatPanel.querySelector('.chat-settings')) return;
    var privacy = chatPanel.querySelector('.chat-privacy');
    var settings = document.createElement('div');
    settings.className = 'chat-settings';
    var label = document.createElement('label');
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'chat-sound-toggle';
    var text = document.createElement('span');
    text.textContent = 'تشغيل تنبيه صوتي';
    label.appendChild(input);
    label.appendChild(text);
    settings.appendChild(label);
    chatPanel.insertBefore(settings, privacy || null);
    soundToggle = input;
    input.addEventListener('change', function () {
      chatInteracted = true;
      soundEnabled = input.checked;
      ensureNotificationPermission();
      if (soundEnabled) playSoftNotificationSound();
    });
  }

  function addChatMessage(text, type, key) {
    if (!chatMessages) return null;
    var normalizedKey = key ? String(key) : '';
    if (normalizedKey && chatSeenMessages[normalizedKey]) return null;
    if (normalizedKey) chatSeenMessages[normalizedKey] = true;
    var msg = document.createElement('div');
    msg.className = 'chat-message ' + (type || 'bot');
    msg.textContent = text;
    if (normalizedKey) msg.setAttribute('data-message-id', normalizedKey);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function renderConversationMessages(messages, options) {
    if (!chatMessages || !Array.isArray(messages)) return;
    trackIncomingMessages(messages, { notify: options && options.notify });
    chatMessages.textContent = '';
    chatSeenMessages = {};
    if (!messages.length) {
      addChatMessage(welcomeMenuText || greetingText, 'bot', 'local:greeting');
      if (!welcomeMenuText) loadWelcomeMenu();
      return;
    }
    messages.forEach(function (item, index) {
      var text = item && item.text ? String(item.text) : '';
      if (!text) return;
      var type = item.direction === 'inbound' || item.sender_type === 'customer' ? 'user' : 'bot';
      if (item.sender_type === 'system' || item.sender_type === 'status') type = 'status';
      addChatMessage(text, type, messageKey(item, 'history:' + index));
    });
  }

  var welcomeMenuLoading = false;
  function loadWelcomeMenu() {
    if (welcomeMenuText || welcomeMenuLoading) return Promise.resolve();
    welcomeMenuLoading = true;
    return fetch(chatApiBase.replace(/\/$/, '') + '/api/public/website-chat/menu', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      return res.json().catch(function () { return {}; });
    }).then(function (data) {
      if (data && data.ok && data.menu) {
        welcomeMenuText = String(data.menu);
        // If no real conversation has loaded yet, refresh so the greeting shows the live menu.
        if (!historyLoaded) renderConversationMessages([]);
      }
    }).catch(function () { /* keep static fallback */ }).finally(function () {
      welcomeMenuLoading = false;
    });
  }

  function loadConversationHistory(options) {
    if (!chatMessages) return Promise.resolve();
    var silent = options && options.silent;
    if (!silent && !historyLoaded) {
      renderConversationMessages([]);
      addChatMessage('جاري تحميل المحادثة...', 'status', 'local:loading-history');
    }
    return fetch(chatApiBase.replace(/\/$/, '') + '/api/public/website-chat/conversation?visitor_id=' + encodeURIComponent(getVisitorId()), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || data.ok === false) throw new Error(data.error || 'LOAD_FAILED');
        renderConversationMessages(data.messages || [], { notify: silent });
        historyLoaded = true;
      });
    }).catch(function () {
      if (!historyLoaded && !silent) renderConversationMessages([]);
    });
  }

  function stopChatPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  function startChatPolling() {
    stopChatPolling();
    pollTimer = setInterval(function () {
      loadConversationHistory({ silent: true });
    }, 8000);
  }

  function scrollChatToBottom() {
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function setChatExpanded(expanded, persist) {
    if (!siteChat || !chatExpand) return;
    siteChat.classList.toggle('expanded', expanded);
    chatExpand.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    chatExpand.setAttribute('aria-label', expanded ? 'تصغير نافذة المحادثة' : 'تكبير نافذة المحادثة');
    chatExpand.setAttribute('title', expanded ? 'تصغير' : 'تكبير');
    var icon = chatExpand.querySelector('i');
    if (icon) { icon.classList.toggle('fa-expand', !expanded); icon.classList.toggle('fa-compress', expanded); }
    if (persist) { try { localStorage.setItem(expandedKey, expanded ? '1' : '0'); } catch (_) {} }
    // Size changed — keep the latest message in view.
    setTimeout(scrollChatToBottom, 60);
  }

  function getStoredExpanded() {
    try { return localStorage.getItem(expandedKey) === '1'; } catch (_) { return false; }
  }

  function openChat() {
    if (!siteChat || !chatPanel || !chatLauncher) return;
    chatInteracted = true;
    buildNotificationSettings();
    resetUnreadCount();
    ensureNotificationPermission();
    siteChat.classList.add('open');
    setChatExpanded(getStoredExpanded(), false);
    chatPanel.setAttribute('aria-hidden', 'false');
    chatLauncher.setAttribute('aria-expanded', 'true');
    loadWelcomeMenu();
    loadConversationHistory({ silent: historyLoaded }).finally(startChatPolling);
    setTimeout(function () { if (chatInput) chatInput.focus(); }, 60);
  }

  function closeChat() {
    if (!siteChat || !chatPanel || !chatLauncher) return;
    siteChat.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatLauncher.setAttribute('aria-expanded', 'false');
    chatLauncher.focus();
  }

  function autosizeChatInput() {
    if (!chatInput) return;
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  }

  buildNotificationSettings();
  if (chatLauncher) chatLauncher.addEventListener('click', openChat);
  if (chatClose) chatClose.addEventListener('click', closeChat);
  if (chatExpand) chatExpand.addEventListener('click', function () {
    setChatExpanded(!siteChat.classList.contains('expanded'), true);
    chatExpand.focus();
  });
  if (chatInput) {
    chatInput.addEventListener('input', autosizeChatInput);
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (chatForm) chatForm.requestSubmit();
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && siteChat && siteChat.classList.contains('open')) closeChat();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && siteChat && siteChat.classList.contains('open')) resetUnreadCount();
    if (!pollTimer && historyLoaded) startChatPolling();
  });
  window.addEventListener('focus', function () {
    windowHasFocus = true;
    if (siteChat && siteChat.classList.contains('open')) resetUnreadCount();
  });
  window.addEventListener('blur', function () {
    windowHasFocus = false;
  });

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      chatInteracted = true;
      var text = chatInput ? chatInput.value.trim() : '';
      if (!text) return;
      if (text.length > 1000) { showToast('الرسالة طويلة جدًا'); return; }
      var localKey = 'local:user:' + Date.now();
      addChatMessage(text, 'user', localKey);
      chatInput.value = '';
      autosizeChatInput();
      var status = addChatMessage('جاري إرسال رسالتك...', 'status', 'local:status:' + Date.now());
      var btn = chatForm.querySelector('button');
      if (btn) btn.disabled = true;
      fetch(chatApiBase.replace(/\/$/, '') + '/api/public/website-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          message: text,
          page_url: window.location.href
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || data.ok === false) throw new Error(data.error || 'SEND_FAILED');
          return data;
        });
      }).then(function (data) {
        if (status) status.remove();
        addChatMessage(data.reply || 'استلمنا رسالتك، وسيتم تحويلها للمتابعة من أحد أفراد الفريق في أقرب وقت.', 'bot', 'reply:' + (data.conversation_id || '') + ':' + Date.now());
        if (data.visitor_id) {
          try { localStorage.setItem(visitorKey, data.visitor_id); } catch (_) {}
        }
        loadConversationHistory({ silent: true });
      }).catch(function () {
        if (status) status.remove();
        addChatMessage('تعذّر إرسال الرسالة الآن. يمكنك استخدام ماسنجر أو رقم خدمة العملاء لحين عودة الخدمة.', 'bot', 'local:error:' + Date.now());
      }).finally(function () {
        if (btn) btn.disabled = false;
        if (chatInput) chatInput.focus();
      });
    });
  }
});
