// مكتب الأمين — Alameen Office | Main JavaScript
// Arabic-first, RTL. Lightweight vanilla JS, restrained motion.

document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile menu toggle ----
  var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  var navMenu = document.querySelector('.nav-menu');

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      var icon = mobileMenuBtn.querySelector('i');
      if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
    }
  }

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('active');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      var icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
      }
    });
  }

  // Close mobile menu when clicking a nav link
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ---- WhatsApp modal (multiple triggers) ----
  var whatsappTriggers = document.querySelectorAll('.js-whatsapp-trigger');
  var modalOverlay = document.querySelector('.modal-overlay');
  var modalClose = document.querySelector('.btn-close');
  var btnCopy = document.querySelector('.btn-copy');

  function openModal() { if (modalOverlay) modalOverlay.classList.add('active'); }
  function closeModal() { if (modalOverlay) modalOverlay.classList.remove('active'); }

  whatsappTriggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  if (modalOverlay) {
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      var phoneNumber = '+201030008802';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber).then(function () {
          showToast('تم نسخ رقم الهاتف!');
          closeModal();
        }).catch(function () {
          showToast('تعذّر النسخ، يرجى المحاولة يدويًا');
        });
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
      var name = (document.getElementById('name') || {}).value || '';
      var email = (document.getElementById('email') || {}).value || '';
      var phone = (document.getElementById('phone') || {}).value || '';
      var message = (document.getElementById('message') || {}).value || '';
      name = name.trim(); email = email.trim(); phone = phone.trim(); message = message.trim();

      if (!name || !email || !phone || !message) {
        showToast('يرجى ملء جميع الحقول المطلوبة');
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('يرجى إدخال بريد إلكتروني صحيح');
        return;
      }
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
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // ---- Header shadow on scroll ----
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.pageYOffset > 80
        ? '0 2px 20px rgba(20, 40, 70, 0.12)'
        : '0 2px 10px rgba(20, 40, 70, 0.06)';
    }, { passive: true });
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
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }
});
