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
});
