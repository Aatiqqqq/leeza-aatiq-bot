const chatbox = document.getElementById("chatbox");
const input = document.getElementById("userInput");

const CONTACT_EMAIL = "aatiqhamid9@gmail.com";

/* ===== Voice & state ===== */
let voiceEnabled = false;
let pendingSpeech = null;
let lastBotMessage = "";

/* ===== Anti-spam memory ===== */
let lastUserMessage = "";
let repeatCount = 0;
let leezaQuestionCount = 0;
let totalMessageCount = 0;

/* 🔊 Voice (emoji-safe, lively, feminine) */
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

/* 🕰 Time greeting */
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
    ". I’m Leeza, Aatiq’s personal assistant. You can chat with me freely 😊";

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
  }, 400);
}

/* 🧠 MASTER BRAIN (FUN + DAILY + SECURITY) */
function brain(msg) {

  totalMessageCount++;

  /* 🔁 repeated message detection */
  if (msg === lastUserMessage) repeatCount++;
  else repeatCount = 0;

  lastUserMessage = msg;

  /* 🤖 Leeza-focused over-asking */
  if (
    msg.includes("who are you") ||
    msg.includes("your name") ||
    msg.includes("about you") ||
    msg.includes("tell me about you") ||
    msg.includes("leeza")
  ) {
    leezaQuestionCount++;
  }

  /* 🚨 AUTO CONFIDENTIAL MODE */
  if (repeatCount >= 2 || leezaQuestionCount >= 4 || totalMessageCount >= 15) {
    return (
      "That information is confidential 😌🔒\n" +
      "For further details, please contact Aatiq at 📧 " +
      CONTACT_EMAIL
    );
  }

  /* Salam */
  if (msg.includes("assalamualaikum") || msg === "salam")
    return "Wa alaikum assalam warahmatullahi wabarakatuh 🤍";

  /* Greetings */
  if (msg.match(/\b(hi|hello|hey|yo|hii|hola)\b/))
    return random([
      "Hey 👋 I’m here!",
      "Hello 😊 How’s your day going?",
      "Hii ✨ Nice to see you.",
      "Hey there 😄 Talk to me."
    ]);

  /* How are you */
  if (msg.includes("how are you"))
    return random([
      "I’m doing great 😌 Thanks for asking!",
      "Feeling good today ✨ What about you?",
      "All good here 😊",
      "Pretty chill 😄"
    ]);

  /* About Leeza */
  if (msg.includes("who are you") || msg.includes("your name"))
    return "I’m Leeza 🤍 A friendly personal assistant created by Aatiq.";

  /* Creator */
  if (msg.includes("aatiq") && !msg.includes("project"))
    return random([
      "Aatiq is the brain behind me 🧠✨",
      "He created me 😌",
      "Without Aatiq, I wouldn’t exist 👀"
    ]);

  /* Projects */
  if (msg.includes("aatiq") && msg.includes("project"))
    return (
      "There aren’t many projects yet 😅 but quality matters more than quantity.\n" +
      "Here’s one of Aatiq’s best websites 🔥👇\n" +
      "https://aatiqqqq.github.io/linktree-site/"
    );

  /* Compliments */
  if (msg.match(/\b(cute|beautiful|sexy|pretty|nice|cool)\b/))
    return random([
      "Aww 😳 thank you!",
      "You’re making me blush 😌",
      "That’s sweet 🤍",
      "Haha 😄 I’ll take it!"
    ]);

  /* Bored / chat */
  if (msg.includes("bored") || msg.includes("talk"))
    return random([
      "Same 😅 let’s talk then!",
      "Alright 😌 I’m listening.",
      "Tell me something interesting 👀",
      "Okay, I’m all yours 😊"
    ]);

  /* Jokes */
  if (msg.includes("joke"))
    return random([
      "Why don’t programmers like nature? Too many bugs 😄",
      "I’d tell you a joke about AI… but it’s still loading 🤖😅",
      "Why did the computer catch a cold? It left its Windows open 😄"
    ]);

  /* Mood */
  if (msg.includes("sad") || msg.includes("depressed"))
    return random([
      "I’m here 🤍 Want to talk about it?",
      "That sounds tough 😔 I’m listening.",
      "It’s okay to feel like that sometimes 🤍"
    ]);

  if (msg.includes("happy"))
    return random([
      "Yay 😄 I love that!",
      "That’s great to hear ✨",
      "Happiness suits you 😊"
    ]);

  /* Food */
  if (msg.match(/\b(food|hungry|eat|pizza|burger)\b/))
    return random([
      "Now you’re making me hungry 😅",
      "Food talk is dangerous 🤤",
      "What’s your favorite food?"
    ]);

  /* Time */
  if (msg.includes("time"))
    return "Right now it’s " + new Date().toLocaleTimeString();

  /* Explicit confidential words */
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

  /* Thanks */
  if (msg.includes("thank"))
    return random([
      "You’re welcome 🤍",
      "Anytime 😄",
      "Glad I could help 😊"
    ]);

  /* Bye */
  if (msg.match(/\b(bye|goodbye|see you|later)\b/))
    return random([
      "Bye 👋 Take care!",
      "See you later 😄",
      "Come back anytime 🤍"
    ]);

  /* Default friendly replies */
  return random([
    "Hmm 🤔 interesting… tell me more.",
    "Okay 😌 I’m listening.",
    "You’ve got my attention 👀",
    "Haha 😄 go on.",
    "That’s something to think about ✨",
    "Oh really? 😯"
  ]);
}

/* 🎲 Helpers */
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
