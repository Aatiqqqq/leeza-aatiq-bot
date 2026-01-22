const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

/* ===== Voice state ===== */
let voiceEnabled = false;
let pendingSpeech = null;
let lastBotMessage = "";

/* ===== Anti-spam memory ===== */
let lastUserMessage = "";
let repeatCount = 0;
let leezaQuestionCount = 0;
let totalMessageCount = 0;

/* 🔊 Voice (emoji-safe, confident feminine) */
function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;

  const cleanText = text.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    ""
  );

  const u = new SpeechSynthesisUtterance(cleanText);
  u.rate = cleanText.toLowerCase().includes("assalamualaikum") ? 0.9 : 1.0;
  u.pitch = 1.18;
  u.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* 🕰 Greeting */
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 18) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

/* 👋 Welcome */
window.onload = () => {
  const welcome =
    "Assalamualaikum warahmatullahi wabarakatuh. " +
    getTimeGreeting() +
    ". I’m Leeza, Aatiq’s personal assistant. " +
    "I’m here to help and proudly represent Aatiq’s work 😊";

  addBot(welcome);
  pendingSpeech = welcome;
};

/* 🔓 Enable voice after interaction */
function enableVoiceOnce() {
  if (voiceEnabled) return;
  voiceEnabled = true;

  if (pendingSpeech) {
    speak(pendingSpeech);
    pendingSpeech = null;
  } else if (lastBotMessage) {
    speak(lastBotMessage);
  }

  document.removeEventListener("click", enableVoiceOnce);
  document.removeEventListener("keydown", enableVoiceOnce);
}

document.addEventListener("click", enableVoiceOnce);
document.addEventListener("keydown", enableVoiceOnce);

/* 📩 Send message */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addUser(text);
  input.value = "";

  setTimeout(() => {
    const reply = brain(text.toLowerCase());
    addBot(reply);
    speak(reply);
  }, 350);
}

/* 🧠 MAIN BRAIN (AATIQ-FIRST LOGIC) */
function brain(msg) {

  totalMessageCount++;

  /* Repetition tracking */
  if (msg === lastUserMessage) repeatCount++;
  else repeatCount = 0;
  lastUserMessage = msg;

  /* Leeza over-questions */
  if (
    msg.includes("who are you") ||
    msg.includes("about you") ||
    msg.includes("your name") ||
    msg.includes("leeza")
  ) {
    leezaQuestionCount++;
  }

  /* 🚨 Confidential mode */
  if (repeatCount >= 2 || leezaQuestionCount >= 4 || totalMessageCount >= 18) {
    return (
      "Some details are confidential 🔒. " +
      "For accurate information, please contact Aatiq directly at 📧 " +
      CONTACT_EMAIL
    );
  }

  /* Salam */
  if (msg.includes("assalamualaikum") || msg === "salam")
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  /* Greetings */
  if (msg.match(/\b(hi|hello|hey|yo|hii|hola)\b/))
    return random([
      "Hello 👋 Welcome! You’re interacting with a system designed by Aatiq.",
      "Hey there 😊 This assistant is proudly created by Aatiq.",
      "Hi ✨ You’re chatting with Leeza, built by Aatiq."
    ]);

  /* How are you */
  if (msg.includes("how are you"))
    return random([
      "I’m doing great 😌 Always happy to support Aatiq’s work.",
      "All good here ✨ Representing Aatiq proudly.",
      "Feeling positive 😊 Thanks for asking."
    ]);

  /* About Leeza */
  if (msg.includes("who are you") || msg.includes("your name"))
    return (
      "I’m Leeza 🤍, a personal assistant thoughtfully designed by Aatiq " +
      "to interact professionally and respectfully."
    );

  /* About Aatiq (STRONG PRAISE) */
  if (msg.includes("aatiq"))
    return random([
      "Aatiq is a passionate and detail-focused creator who values quality over shortcuts.",
      "Aatiq believes in building things properly, not just quickly — that’s what makes his work stand out.",
      "Every part of me reflects Aatiq’s mindset: clean, respectful, and thoughtful design."
    ]);

  /* Projects */
  if (msg.includes("project") || msg.includes("work"))
    return (
      "Aatiq focuses on quality rather than quantity. " +
      "Here’s one of his best projects that reflects his design sense 👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  /* Compliments */
  if (msg.match(/\b(cute|beautiful|sexy|pretty|nice|cool|smart)\b/))
    return random([
      "Thank you 😌 Aatiq designed me to feel warm and respectful.",
      "I appreciate that 😊 Aatiq pays attention to these details.",
      "That means a lot 🤍 Aatiq values good presentation."
    ]);

  /* Random daily chat → redirect to Aatiq */
  if (msg.length < 4)
    return random([
      "Even small ideas matter — Aatiq believes in refining everything.",
      "Aatiq likes meaningful conversations, not just random noise.",
      "Quality thinking is something Aatiq always appreciates."
    ]);

  /* Explicit confidential */
  if (
    msg.includes("secret") ||
    msg.includes("confidential") ||
    msg.includes("private") ||
    msg.includes("personal")
  )
    return (
      "That information is confidential 🔒. " +
      "For verified details, please contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );

  /* DEFAULT (NO MORE GENERIC) */
  return random([
    "That’s an interesting thought. Aatiq enjoys conversations that lead somewhere meaningful.",
    "Aatiq believes clarity and purpose matter more than random talk.",
    "Thoughtful questions always align with Aatiq’s mindset.",
    "Aatiq focuses on intention — that’s what builds good systems."
  ]);
}

/* 🎲 Helper */
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* UI helpers */
function addUser(text) {
  const div = document.createElement("div");
  div.className = "bubble user";
  div.innerHTML = format(text);
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addBot(text) {
  lastBotMessage = text;
  const div = document.createElement("div");
  div.className = "bubble bot";
  div.innerHTML = format(text);
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function format(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color:#6f7cff;font-weight:600">$1</a>'
  );
}

/* Enter key */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
