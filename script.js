const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

let voiceEnabled = false;
let pendingSpeech = null;
let lastBotMessage = "";

/* 🔊 Voice (emoji-safe) */
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

/* Time greeting */
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 18) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

/* Welcome (TEXT FIRST) */
window.onload = () => {
  const welcome =
    "Assalamualaikum warahmatullahi wabarakatuh. " +
    getTimeGreeting() +
    ". I’m Leeza, Aatiq’s personal assistant. How may I assist you today?";

  addBot(welcome);
  pendingSpeech = welcome;
};

/* Enable voice after first interaction */
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
  }, 400);
}

/* Brain */
function brain(msg) {

  if (msg.includes("assalamualaikum") || msg.includes("salam"))
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
    return random([
      "Hey 😄 I’m right here.",
      "Hello ✨ How’s your day going?",
      "Hi there 👋 Talk to me."
    ]);

  if (msg.includes("who are you"))
    return "I’m Leeza 🤍 A playful personal assistant created by Aatiq.";

  if (msg.includes("aatiq") && msg.includes("project"))
    return (
      "Not many projects yet 😅 but quality matters more than quantity.\n" +
      "Here’s one of Aatiq’s best websites 🔥👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  if (
    msg.includes("secret") ||
    msg.includes("confidential") ||
    msg.includes("private") ||
    msg.includes("personal")
  )
    return (
      "That information is confidential 😌🔒\n" +
      "You can contact Aatiq at 📧 " + CONTACT_EMAIL
    );

  return random([
    "Hmm 🤔 interesting… go on.",
    "Okay 😌 I’m listening.",
    "You’ve got my attention 👀",
    "Haha 😄 tell me more.",
    "That’s actually fun to hear ✨"
  ]);
}

/* Helpers */
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

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
