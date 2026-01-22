const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

/* ===== STATE ===== */
let voiceEnabled = false;
let pendingSpeech = null;

/* Ensure voices load (important for mobile) */
speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

/* 🔊 Best-possible cross-device voice */
function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;

  const cleanText = text.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    ""
  );

  const u = new SpeechSynthesisUtterance(cleanText);
  const voices = speechSynthesis.getVoices();

  const preferred =
    voices.find(v => /female|woman|google|samantha|microsoft/i.test(v.name)) ||
    voices.find(v => /en/i.test(v.lang)) ||
    voices[0];

  if (preferred) u.voice = preferred;

  u.rate = 0.98;
  u.pitch = 1.12;
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

/* Enable voice after first tap */
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

/* Send message */
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

/* 🧠 BRAIN (NO OVERLAPS) */
function brain(msg) {

  /* ⏰ TIME */
  if (
    msg === "time" ||
    msg === "current time" ||
    msg === "time now" ||
    msg === "what time is it"
  ) {
    return "Right now it’s " + new Date().toLocaleTimeString();
  }

  /* 📅 DATE */
  if (
    msg === "date" ||
    msg === "today" ||
    msg === "today date" ||
    msg === "what day is today"
  ) {
    return "Today is " + new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  /* Greetings */
  if (msg.includes("assalamualaikum") || msg === "salam")
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  if (msg.match(/\b(hi|hello|hey|hii|yo)\b/))
    return "Hello 👋 You’re chatting with Leeza, built by Aatiq.";

  /* About */
  if (msg.includes("who are you"))
    return "I’m Leeza, a personal assistant designed by Aatiq.";

  if (msg.includes("aatiq") && msg.includes("project"))
    return (
      "Aatiq believes in quality over quantity. Here’s one of his best projects 👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  if (msg.includes("aatiq"))
    return "Aatiq is a focused creator who values clarity, discipline, and meaningful design.";

  /* Confidential */
  if (
    msg.includes("secret") ||
    msg.includes("private") ||
    msg.includes("confidential")
  ) {
    return (
      "That information is confidential 🔒\n" +
      "Please contact Aatiq at 📧 " + CONTACT_EMAIL
    );
  }

  /* Default */
  return "Aatiq believes meaningful conversations always lead somewhere valuable.";
}

/* UI helpers */
function addUser(text) {
  const div = document.createElement("div");
  div.className = "bubble user";
  div.innerHTML = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addBot(text) {
  const div = document.createElement("div");
  div.className = "bubble bot";
  div.innerHTML = format(text);
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

/* Mobile-safe clickable link */
function format(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    `<a href="$1" target="_blank" rel="noopener"
      style="display:inline-block;margin-top:6px;
      color:#6f7cff;font-weight:600;">
      🔗 Open project
     </a>`
  );
}

/* Enter key */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
