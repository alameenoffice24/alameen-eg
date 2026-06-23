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
  var chatForm = document.querySelector('.chat-form');
  var chatInput = document.getElementById('chat-message-input');
  var chatMessages = document.querySelector('.chat-messages');
  var chatApiBase = window.ALAMEEN_CHAT_API_BASE || 'https://agency-booking.alameen-eg.xyz';
  var visitorKey = 'alameen_website_chat_visitor_id';
  var greetingText = 'أهلًا بك في مكتب الأمين. اكتب استفسارك وسنساعدك في المتابعة.';
  var chatSeenMessages = {};
  var historyLoaded = false;
  var pollTimer = null;

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

  function renderConversationMessages(messages) {
    if (!chatMessages || !Array.isArray(messages)) return;
    chatMessages.textContent = '';
    chatSeenMessages = {};
    if (!messages.length) {
      addChatMessage(greetingText, 'bot', 'local:greeting');
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
        renderConversationMessages(data.messages || []);
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
    if (document.hidden) return;
    pollTimer = setInterval(function () {
      if (!siteChat || !siteChat.classList.contains('open') || document.hidden) {
        stopChatPolling();
        return;
      }
      loadConversationHistory({ silent: true });
    }, 7000);
  }

  function openChat() {
    if (!siteChat || !chatPanel || !chatLauncher) return;
    siteChat.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    chatLauncher.setAttribute('aria-expanded', 'true');
    loadConversationHistory({ silent: historyLoaded }).finally(startChatPolling);
    setTimeout(function () { if (chatInput) chatInput.focus(); }, 60);
  }

  function closeChat() {
    if (!siteChat || !chatPanel || !chatLauncher) return;
    siteChat.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
    chatLauncher.setAttribute('aria-expanded', 'false');
    stopChatPolling();
    chatLauncher.focus();
  }

  function autosizeChatInput() {
    if (!chatInput) return;
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  }

  if (chatLauncher) chatLauncher.addEventListener('click', openChat);
  if (chatClose) chatClose.addEventListener('click', closeChat);
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
    if (document.hidden) stopChatPolling();
    else if (siteChat && siteChat.classList.contains('open')) startChatPolling();
  });

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
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
