const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

/* ================= STATE ================= */
let voiceEnabled = false;
let pendingSpeech = null;
let lastBotMessage = "";

/* Anti-spam */
let lastUserMessage = "";
let repeatCount = 0;
let leezaQuestionCount = 0;
let totalMessageCount = 0;

/* 🔊 Voice */
function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;

  const clean = text.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    ""
  );

  const u = new SpeechSynthesisUtterance(clean);
  u.rate = clean.toLowerCase().includes("assalamualaikum") ? 0.9 : 1.0;
  u.pitch = 1.15;
  u.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* Greeting */
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 18) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

/* Welcome */
window.onload = () => {
  const welcome =
    "Assalamualaikum warahmatullahi wabarakatuh. " +
    getTimeGreeting() +
    ". I’m Leeza, Aatiq’s personal assistant.";

  addBot(welcome);
  pendingSpeech = welcome;
};

/* Enable voice */
function enableVoiceOnce() {
  if (voiceEnabled) return;
  voiceEnabled = true;

  if (pendingSpeech) {
    speak(pendingSpeech);
    pendingSpeech = null;
  }

  document.removeEventListener("click", enableVoiceOnce);
  document.removeEventListener("keydown", enableVoiceOnce);
}

document.addEventListener("click", enableVoiceOnce);
document.addEventListener("keydown", enableVoiceOnce);

/* Send */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addUser(text);
  input.value = "";

  setTimeout(() => {
    const reply = brain(text.toLowerCase());
    addBot(reply);
    speak(reply);
  }, 300);
}

/* ================= BRAIN ================= */
function brain(msg) {

  totalMessageCount++;

  /* ---------- STRICT COMMANDS (EXIT EARLY) ---------- */

  // TIME (ONLY TIME)
  if (
    msg === "time" ||
    msg === "time now" ||
    msg === "current time" ||
    msg === "what time is it"
  ) {
    return "Right now it’s " + new Date().toLocaleTimeString();
  }

  // DATE
  if (
    msg === "date" ||
    msg === "today" ||
    msg === "today date" ||
    msg === "what is today" ||
    msg === "what day is today"
  ) {
    return "Today is " + new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /* ---------- ANTI-SPAM TRACKING ---------- */

  if (msg === lastUserMessage) repeatCount++;
  else repeatCount = 0;

  lastUserMessage = msg;

  if (
    msg.includes("leeza") ||
    msg.includes("who are you") ||
    msg.includes("about you")
  ) {
    leezaQuestionCount++;
  }

  if (repeatCount >= 2 || leezaQuestionCount >= 4 || totalMessageCount >= 18) {
    return (
      "That information is confidential 🔒. " +
      "Please contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );
  }

  /* ---------- NORMAL CHAT ---------- */

  if (msg.includes("assalamualaikum") || msg === "salam")
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  if (msg.match(/\b(hi|hello|hey|hii|yo)\b/))
    return "Hello 👋 You’re chatting with Leeza, built by Aatiq.";

  if (msg.includes("how are you"))
    return "I’m doing well 😌 Always happy to support Aatiq’s work.";

  if (msg.includes("who are you"))
    return "I’m Leeza, a personal assistant designed by Aatiq.";

  if (msg.includes("aatiq"))
    return "Aatiq is a focused creator who values clarity, discipline, and quality.";

  if (msg.includes("project") || msg.includes("work"))
    return (
      "Aatiq prefers quality over quantity. " +
      "Here’s one of his projects 👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  if (
    msg.includes("secret") ||
    msg.includes("confidential") ||
    msg.includes("private")
  )
    return (
      "That information is confidential 🔒. " +
      "Contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );

  /* ---------- DEFAULT ---------- */
  return "Aatiq believes meaningful conversations always lead somewhere valuable.";
}

/* ================= UI HELPERS ================= */
function addUser(text) {
  const d = document.createElement("div");
  d.className = "bubble user";
  d.innerHTML = text;
  chatbox.appendChild(d);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addBot(text) {
  lastBotMessage = text;
  const d = document.createElement("div");
  d.className = "bubble bot";
  d.innerHTML = text;
  chatbox.appendChild(d);
  chatbox.scrollTop = chatbox.scrollHeight;
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
