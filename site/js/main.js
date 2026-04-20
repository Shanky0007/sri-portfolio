/**
 * main.js — Shared interactivity for all pages
 * Mobile nav toggle, active-nav highlighting, smooth scroll,
 * fade-in observer, and chatbot panel toggle.
 */

(function () {
  'use strict';

  /* ── Mobile Nav Toggle ── */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Active Nav Highlighting ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a, #mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.remove('text-muted-foreground');
      link.classList.add('text-primary');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Intersection Observer Fade-In ── */
  const revealElements = document.querySelectorAll('section');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Chatbot Panel Toggle ── */
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');

  function openChat() {
    if (!chatPanel) return;
    chatPanel.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none', 'scale-95');
    chatPanel.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto', 'scale-100');
    chatToggle.setAttribute('aria-expanded', 'true');
  }

  function closeChat() {
    if (!chatPanel) return;
    chatPanel.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none', 'scale-95');
    chatPanel.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto', 'scale-100');
    chatToggle.setAttribute('aria-expanded', 'false');
  }

  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', function () {
      const isOpen = chatPanel.classList.contains('opacity-100');
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }

  // Close chat on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatPanel && chatPanel.classList.contains('opacity-100')) {
      closeChat();
    }
  });

  /* ── Chatbot Q&A (delegated to contact.js on contact page) ── */
  // The suggestion buttons and input are wired up in contact.js
  // On non-contact pages, clicking suggestions still works via this basic handler
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const suggestions = document.querySelectorAll('.chat-suggestion');

  // Only attach basic handlers if contact.js is NOT loaded
  // contact.js will override these with richer behavior
  if (typeof window.__contactJsLoaded === 'undefined') {
    window.__chatbotReady = false;

    // Wait briefly to see if contact.js loads
    setTimeout(function () {
      if (window.__contactJsLoaded) return;
      attachBasicChatHandlers();
    }, 100);
  }

  function attachBasicChatHandlers() {
    if (!chatMessages) return;

    var ANSWERS = {
      'Tell me about Sriyogya': 'Sriyogya Guggulla is a BBA Digital Technologies student at Mahindra University with international exposure at Cornell University (July 2024) and NUS School of Computing (June 2025, top 20% + commendation). She focuses on business analytics, UX research, and community leadership. Visit the <a href="about.html" class="underline text-[#A67C52]">About</a> page to learn more!',
      'What are her skills?': 'Sriyogya\'s core professional skills: Strategic Thinking, Leadership Excellence, Effective Communication, Analytical Intelligence, Problem-Solving Ability, Decision-Making, and Critical Thinking. Her top-graded core subjects include Online Advertising (A+), Customer Experience (A+), Data Warehousing/BI/Visualization (A), MIS (A), Connected Technologies (A), and more. See the <a href="index.html#skills" class="underline text-[#A67C52]">Home</a> page for the full list.',
      'Show her projects': 'Sriyogya\'s projects include E-commerce Delivery Optimization (NUS — Commendation Award), Travel Right UX Case Study, a Cybersecurity Adoption Study, IPL Player Analytics, Digital Marketing for Riya Designing Studio, and a Smart Irrigation IoT System. Check the <a href="projects.html" class="underline text-[#A67C52]">Projects</a> page for details!',
      'How can I contact her?': 'You can reach Sriyogya at <a href="mailto:sriyogyaguggulla@gmail.com" class="underline text-[#A67C52]">sriyogyaguggulla@gmail.com</a> or +91 9164999999. Visit the <a href="contact.html" class="underline text-[#A67C52]">Contact</a> page for more options.',
      'What is she studying?': 'Sriyogya is pursuing a BBA in Digital Technologies at Mahindra University, Hyderabad. She also completed a Cornell University immersion program (Ithaca, USA, July 2024) and an AI-Powered Business Analytics program at the National University of Singapore (June 2025).',
      'Certifications?': 'Sriyogya holds certifications from Cornell University, NUS School of Computing (AI-Powered Business Analytics), AI Student of the Year — Top 5 (Mahindra × Google Gemini), the Fintenship Program, and UNITAR UN CC:Learn. See the <a href="certifications.html" class="underline text-[#A67C52]">Certifications</a> page!',
      'Extracurriculars?': 'Sriyogya has led a clothing donation drive with Share At Door Step, a vaccination & medical drive in rural Andhra Pradesh, been recognised as a Student Leader in Mahindra University\'s Global Immersion Programme (June 2025), and run a food distribution drive with the Veerabhadra Trust. See <a href="extracurricular.html" class="underline text-[#A67C52]">Extra-Curricular</a> for details.',
      'Resume highlights?': 'Highlights: NUS Commendation Award (top 20%), AI Student of the Year Top 5, Cornell University immersion, 6 applied projects (analytics, UX, IoT, marketing), and community leadership across multiple initiatives. Visit the <a href="resume.html" class="underline text-[#A67C52]">Resume</a> page for the full picture.'
    };

    function addMessage(text, isUser) {
      var bubble = document.createElement('div');
      bubble.className = 'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm border ' +
        (isUser
          ? 'ml-auto bg-[#A67C52] text-white rounded-br-md border-[#A67C52]/20'
          : 'mr-auto bg-white text-[#2B2B2B] rounded-bl-md border-[#A67C52]/10');
      if (isUser) {
        bubble.textContent = text;
      } else {
        bubble.innerHTML = text;
      }
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleQuestion(question) {
      addMessage(question, true);
      var answer = ANSWERS[question] || "I'm not sure about that. Try one of the suggestion buttons above!";
      setTimeout(function () {
        addMessage(answer, false);
      }, 400);
    }

    suggestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = this.getAttribute('data-question') || this.textContent.trim();
        handleQuestion(q);
      });
    });

    if (chatInput && chatSend) {
      chatSend.disabled = false;

      function sendUserMessage() {
        var msg = chatInput.value.trim();
        if (!msg) return;
        chatInput.value = '';
        handleQuestion(msg);
      }

      chatSend.addEventListener('click', sendUserMessage);
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendUserMessage();
        }
      });
    }
  }
})();
