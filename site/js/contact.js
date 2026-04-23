/**
 * contact.js — Enhanced chatbot for the Contact page.
 * Overrides the basic handlers from main.js with richer, contact-page-specific behavior.
 */

(function () {
  'use strict';

  // Signal to main.js that contact.js is loaded
  window.__contactJsLoaded = true;

  var chatMessages = document.getElementById('chat-messages');
  var chatInput = document.getElementById('chat-input');
  var chatSend = document.getElementById('chat-send');
  var suggestions = document.querySelectorAll('.chat-suggestion');

  if (!chatMessages) return;

  /* ── Canned Answers ── */
  var ANSWERS = {
    'Tell me about Sriyogya':
      'Sriyogya Guggulla is a BBA Digital Technologies student at Mahindra University, Hyderabad. She combines business understanding with analytical thinking, with hands-on experience in data analytics, Power BI dashboards, ML-based prediction, UX research, and community-led initiatives. Her international exposure includes a Cornell University immersion program (Ithaca, USA, July 2024) and an AI-Powered Business Analytics program at the National University of Singapore (June 2025), where she ranked in the top 20% of the cohort with a commendation letter. Her goal is to build a career in business analytics and consulting.',

    'What are her skills?':
      '<strong>Professional Skills</strong><br>' +
      '• <strong>Strategic Thinking</strong> — long-term, data-driven approaches to sustainable growth<br>' +
      '• <strong>Leadership Excellence</strong> — leading with clarity and accountability<br>' +
      '• <strong>Effective Communication</strong> — conveying ideas across diverse audiences<br>' +
      '• <strong>Analytical Intelligence</strong> — turning data and trends into insights<br>' +
      '• <strong>Problem-Solving Ability</strong> — structured thinking to implement solutions<br>' +
      '• <strong>Decision-Making Skills</strong> — evaluating options critically and timely<br>' +
      '• <strong>Critical Thinking</strong> — objective, logical, well-reasoned conclusions<br><br>' +
      '<strong>Core Subjects (top grades):</strong> Online Advertising (A+), Customer Experience (A+), Data Warehousing/BI/Visualization (A), Management Information Systems (A), Connected Technologies (A), Productions & Operations Management (A), Branding & Brand Management (A), Business Communications (A).',

    'Show her projects':
      '<strong>1. E-commerce Delivery Optimization (NUS — Commendation Award)</strong> — Built Power BI dashboards and ML delay-prediction models for Brazil\'s e-commerce market.<br><br>' +
      '<strong>2. Travel Right — UX Case Study</strong> — Designed a unified travel platform with a personalized assistant to reduce decision fatigue.<br><br>' +
      '<strong>3. Cybersecurity Adoption Study</strong> — Surveys + Z/T/Chi-square tests to uncover why people don\'t adopt personal cybersecurity.<br><br>' +
      '<strong>4. IPL Player Analytics & Auction Strategy</strong> — Performance metrics and a value index to surface undervalued players.<br><br>' +
      '<strong>5. Digital Marketing Strategy (Riya Designing Studio)</strong> — SEO, SEM, and social strategy for scalable customer acquisition.<br><br>' +
      '<strong>6. Smart Irrigation System (IoT)</strong> — Soil-moisture sensors + weather data projecting 30–50% water savings.<br><br>' +
      'Visit <a href="projects.html" class="underline text-[#6e56cf]">Projects</a> for full details!',

    'How can I contact her?':
      'You can reach Sriyogya through:<br><br>' +
      '📧 <strong>Email:</strong> <a href="mailto:sriyogyaguggulla@gmail.com" class="underline text-[#6e56cf]">sriyogyaguggulla@gmail.com</a><br>' +
      '📱 <strong>Phone:</strong> <a href="tel:+919164999999" class="underline text-[#6e56cf]">+91 9164999999</a><br>' +
      '💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/sriyogya-guggulla-0b16aa2a0/" target="_blank" rel="noopener noreferrer" class="underline text-[#6e56cf]">sriyogya-guggulla</a><br><br>' +
      'Or use the "Send an Email" button above!',

    'What is she studying?':
      'Sriyogya is pursuing a <strong>BBA in Digital Technologies</strong> at Mahindra University, Hyderabad. Her international academic exposure includes a <strong>Cornell University</strong> immersion program (Ithaca, USA, July 2024) and an <strong>AI-Powered Business Analytics</strong> program at the <strong>National University of Singapore, School of Computing</strong> (June 9–22, 2025), where she was awarded a commendation letter and ranked in the top 20% of the cohort.',

    'Certifications?':
      '<strong>1. Cornell University Certificate</strong> — Immersion program at Cornell (Ithaca, USA, July 2024)<br>' +
      '<strong>2. AI-Powered Business Analytics</strong> — NUS School of Computing, top 20% + commendation<br>' +
      '<strong>3. AI Student of the Year — Top 5 Rank</strong> — AI Hub, Mahindra University × Google Gemini<br>' +
      '<strong>4. Fintenship Program</strong> — Finance internship with 3 real-time projects (portfolio tracker, financial statement analysis, budget tracker)<br>' +
      '<strong>5. UN CC:Learn — Climate Change Certification</strong> — UNITAR, October 2023<br><br>' +
      'See <a href="certifications.html" class="underline text-[#6e56cf]">Certifications</a> for the full list with images.',

    'Extracurriculars?':
      '<strong>👕 Clothing Donation Drive</strong> — Led a drive with Share At Door Step, coordinating collection and pickup while promoting sustainability.<br><br>' +
      '<strong>🩺 Vaccination & Medical Drive</strong> — Led a rural community health drive in Andhra Pradesh with local health centres and volunteers.<br><br>' +
      '<strong>🌍 Student Leader — Global Immersion Programme</strong> — Recognised at Mahindra University (June 2025) for leadership and coordination.<br><br>' +
      '<strong>🍽️ Food Distribution Drive</strong> — Partnered with Veerabhadra Trust to distribute meals to underserved communities.<br><br>' +
      'More at <a href="extracurricular.html" class="underline text-[#6e56cf]">Extra-Curricular</a>.',

    'Resume highlights?':
      '<strong>Highlights:</strong><br>' +
      '• <strong>NUS Commendation Award</strong> — Top 20% of the AI-Powered Business Analytics cohort<br>' +
      '• <strong>AI Student of the Year — Top 5</strong> at the AI Hub × Google Gemini Business Analyst Challenge<br>' +
      '• <strong>Cornell University immersion</strong> (Ithaca, USA, July 2024)<br>' +
      '• <strong>6 applied projects</strong> spanning analytics, UX, research, sports analytics, marketing, and IoT<br>' +
      '• <strong>Community leadership</strong> across clothing, health, food-distribution, and student-led programs<br><br>' +
      'Visit the <a href="resume.html" class="underline text-[#6e56cf]">Resume</a> page for the full picture.'
  };

  /* ── Fuzzy matching for free-text input ── */
  function findBestAnswer(input) {
    var lower = input.toLowerCase().trim();

    // Direct keyword matching
    if (lower.match(/about|who|tell me|introduce|herself|Sriyogya/)) return ANSWERS['Tell me about Sriyogya'];
    if (lower.match(/skill|able|can do|capable|competenc|tools/)) return ANSWERS['What are her skills?'];
    if (lower.match(/project|work|portfolio|built|made|created/)) return ANSWERS['Show her projects'];
    if (lower.match(/contact|reach|email|phone|connect|linkedin|mail/)) return ANSWERS['How can I contact her?'];
    if (lower.match(/study|education|university|degree|bba|college|cima|learning/)) return ANSWERS['What is she studying?'];
    if (lower.match(/certif|course|training|credential/)) return ANSWERS['Certifications?'];
    if (lower.match(/extra|curricular|activit|club|volunteer|community|blog|competition/)) return ANSWERS['Extracurriculars?'];
    if (lower.match(/resume|cv|experience|intern|job|career|download/)) return ANSWERS['Resume highlights?'];
    if (lower.match(/hi|hello|hey|greet/)) return "Hello! I'm Sriyogya's virtual assistant. Feel free to ask me about her background, skills, projects, or how to get in touch!";

    return "I'm not sure about that. Try clicking one of the suggestion buttons, or ask about Sriyogya's skills, projects, education, certifications, or contact info!";
  }

  /* ── DOM helpers ── */
  function addMessage(text, isUser) {
    var bubble = document.createElement('div');
    bubble.className = 'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm border ' +
      (isUser
        ? 'ml-auto bg-[#6e56cf] text-white rounded-br-md border-[#6e56cf]/20'
        : 'mr-auto bg-white text-[#2a2a4a] rounded-bl-md border-[#6e56cf]/10');
    if (isUser) {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = text;
    }
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    var indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed mr-auto bg-white text-[#2a2a4a] rounded-bl-md shadow-sm border border-[#6e56cf]/10';
    indicator.innerHTML = '<span class="inline-flex gap-1"><span class="w-2 h-2 bg-[#6e56cf]/40 rounded-full animate-bounce" style="animation-delay:0ms"></span><span class="w-2 h-2 bg-[#6e56cf]/40 rounded-full animate-bounce" style="animation-delay:150ms"></span><span class="w-2 h-2 bg-[#6e56cf]/40 rounded-full animate-bounce" style="animation-delay:300ms"></span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    var indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function handleQuestion(question) {
    addMessage(question, true);
    showTypingIndicator();

    var answer = ANSWERS[question] || findBestAnswer(question);
    setTimeout(function () {
      removeTypingIndicator();
      addMessage(answer, false);
    }, 400);
  }

  /* ── Wire up suggestion buttons ── */
  suggestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var q = this.getAttribute('data-question') || this.textContent.trim();
      handleQuestion(q);
    });
  });

  /* ── Wire up text input ── */
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

})();
