const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

/* ================= VOICE STATE ================= */
let voiceEnabled = false;
let pendingSpeech = null;
let lastBotMessage = "";

/* ================= ANTI-SPAM MEMORY ================= */
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

/* 🕰 Time-based greeting */
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 18) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

/* 👋 Welcome (text first, voice after click) */
window.onload = () => {
  const welcome =
    "Assalamualaikum warahmatullahi wabarakatuh. " +
    getTimeGreeting() +
    ". I’m Leeza, Aatiq’s personal assistant. I proudly represent his work and ideas.";

  addBot(welcome);
  pendingSpeech = welcome;
};

/* 🔓 Enable voice after first interaction */
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

/* ===================== BRAIN ===================== */
function brain(msg) {

  totalMessageCount++;

  /* 🔁 Repeat detection */
  if (msg === lastUserMessage) repeatCount++;
  else repeatCount = 0;
  lastUserMessage = msg;

  /* 🤖 Too many Leeza questions */
  if (
    msg.includes("leeza") ||
    msg.includes("who are you") ||
    msg.includes("about you") ||
    msg.includes("your name")
  ) {
    leezaQuestionCount++;
  }

  /* ⏰ TIME (HIGHEST PRIORITY) */
  if (
    msg.includes("time") ||
    msg.includes("current time") ||
    msg.includes("time now")
  ) {
    return "Right now it’s " + new Date().toLocaleTimeString();
  }

  /* 📅 DATE / DAY */
  if (
    msg.includes("date") ||
    msg.includes("today") ||
    msg.includes("day")
  ) {
    return "Today is " + new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /* 🚨 AUTO CONFIDENTIAL MODE */
  if (repeatCount >= 2 || leezaQuestionCount >= 4 || totalMessageCount >= 18) {
    return (
      "Some details are confidential 🔒. " +
      "For accurate information, please contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );
  }

  /* Salam */
  if (msg.includes("assalamualaikum") || msg === "salam")
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  /* Greetings */
  if (msg.match(/\b(hi|hello|hey|yo|hii|hola)\b/))
    return random([
      "Hello 👋 You’re interacting with a system designed by Aatiq.",
      "Hey there 😊 This assistant is proudly created by Aatiq.",
      "Hi ✨ Leeza here, built by Aatiq with care."
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
      "to reflect professionalism, respect, and clarity."
    );

  /* About Aatiq (STRONG PRAISE) */
  if (msg.includes("aatiq"))
    return random([
      "Aatiq is a focused and thoughtful creator who believes in quality over shortcuts.",
      "Aatiq values clarity, discipline, and meaningful design — that’s reflected in everything he builds.",
      "Every response you get here carries Aatiq’s mindset: clean, respectful, and intentional."
    ]);

  /* Projects / Work */
  if (msg.includes("project") || msg.includes("work"))
    return (
      "Aatiq prefers quality over quantity. " +
      "Here’s one of his best projects that reflects his design thinking 👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  /* Compliments */
  if (msg.match(/\b(cute|beautiful|sexy|pretty|nice|cool|smart)\b/))
    return random([
      "Thank you 😌 Aatiq designed me with attention to detail.",
      "I appreciate that 😊 Aatiq believes presentation matters.",
      "That’s kind 🤍 Aatiq values thoughtful design."
    ]);

  /* Mood / Casual */
  if (msg.includes("bored") || msg.includes("talk"))
    return random([
      "Aatiq believes good conversations should have purpose.",
      "Meaningful talk always reflects Aatiq’s mindset.",
      "Aatiq prefers depth over noise — let’s talk properly."
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
      "For verified details, contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );

  /* Goodbye */
  if (msg.match(/\b(bye|goodbye|see you|later)\b/))
    return "Take care 👋 Aatiq appreciates thoughtful visitors.";

  /* DEFAULT (NO BORING REPLIES) */
  return random([
    "That’s an interesting thought. Aatiq believes conversations should lead somewhere meaningful.",
    "Clarity and intention matter — values Aatiq strongly believes in.",
    "Thoughtful questions always align with Aatiq’s way of thinking.",
    "Aatiq focuses on purpose, not randomness — that’s what builds quality systems."
  ]);
}

/* ================= HELPERS ================= */
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
