const i18n = {
    id: {
        search: "Mau cari apa hari ini?",
        btnSearch: "Cari",
        subGreeting: "Siap membantumu menjelajah internet.",
        ai: "ChatGPT",
        notes: "Catatan Cepat",
        notesPlace: "Tulis ide kamu...",
        music: "Musik & Podcast",
        morning: "Selamat Pagi!",
        noon: "Selamat Siang!",
        afternoon: "Selamat Sore!",
        night: "Selamat Malam!",
        made: "Dibuat oleh yusrb2",
        tipClock: "Lihat Waktu Sekarang",
        tipAi: "Buka ChatGPT",
        tipNotes: "Catatan cepat",
        tipYt: "Buka YouTube",
        tipGh: "Buka GitHub",
        tipMail: "Buka Gmail",
        tipMusic: "Buka Spotify",
        use: "Gunakan",
        btnRun: "Jalankan",
        helpText: `
Pencarian Cepat:
:g query
:b query
:yt query
:gh query
:so query
:ddg query

Sistem:
:lang id|en
:engine google|bing
:reload
:home
:reset
:clear
:time
:date

Catatan:
:note
:note-clear
`,
    },
    en: {
        search: "What are you looking for?",
        btnSearch: "Search",
        subGreeting: "Ready to help you explore the web.",
        ai: "ChatGPT",
        notes: "Quick Notes",
        notesPlace: "Type your ideas...",
        music: "Music & Podcast",
        morning: "Good Morning!",
        noon: "Good Day!",
        afternoon: "Good Afternoon!",
        night: "Good Evening!",
        made: "Made by yusrb2",
        tipClock: "View Current Time",
        tipAi: "Open ChatGPT",
        tipNotes: "Quick Note",
        tipYt: "Open YouTube",
        tipGh: "Open GitHub",
        tipMail: "Open Gmail",
        tipMusic: "Open Spotify",
        use: "Use",
        btnRun: "Run",
        helpText: `
Quick Search:
:g query
:b query
:yt query
:gh query
:so query
:ddg query

System:
:lang id|en
:engine google|bing
:reload
:home
:reset
:clear
:time
:date

Notes:
:note
:note-clear
`,
    },
};

let currentLang = localStorage.getItem("pilastro_lang") || "id";
let currentEngine = localStorage.getItem("pilastro_engine") || "bing";

const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".pilastro-search-container");
const searchBtn = document.getElementById("btn-search");

searchInput.addEventListener("input", () => {
    const isCommand = searchInput.value.trim().startsWith(":");
    const langData = i18n[currentLang];

    searchContainer.classList.toggle("command-mode", isCommand);

    if (isCommand) {
        searchBtn.textContent = langData.btnRun;
    } else {
        searchBtn.textContent = langData.btnSearch;
        searchInput.placeholder = langData.search;
    }
});

function toggleLang() {
    currentLang = currentLang === "id" ? "en" : "id";
    localStorage.setItem("pilastro_lang", currentLang);
    updateUI();
}

function toggleEngine() {
    currentEngine = currentEngine === "bing" ? "google" : "bing";
    localStorage.setItem("pilastro_engine", currentEngine);
    updateUI();
}

function updateUI() {
    const now = new Date();
    const langData = i18n[currentLang];

    document.getElementById("clock").textContent =
        now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    const options = { day: "numeric", month: "short", year: "numeric" };
    document.getElementById("date").textContent = now
        .toLocaleDateString(currentLang === "id" ? "id-ID" : "en-US", options)
        .toUpperCase();

    searchInput.placeholder = langData.search;
    searchBtn.textContent = langData.btnSearch;
    document.getElementById("sub-greeting").textContent = langData.subGreeting;
    document.getElementById("notes-placeholder").placeholder = langData.notesPlace;
    document.getElementById("made-by").textContent = langData.made;
    document.getElementById("lang-btn").textContent = currentLang.toUpperCase();

    document.querySelectorAll("[data-key]").forEach(el => {
        el.textContent = langData[el.getAttribute("data-key")];
    });

    const hour = now.getHours();
    const greet = document.getElementById("greeting");
    if (hour < 11) greet.textContent = langData.morning;
    else if (hour < 15) greet.textContent = langData.noon;
    else if (hour < 19) greet.textContent = langData.afternoon;
    else greet.textContent = langData.night;

    const form = document.getElementById("search-form");
    const engineIcon = document.getElementById("engine-icon").querySelector("i");
    const engineTip = document.getElementById("engine-tooltip");

    if (currentEngine === "google") {
        form.action = "https://www.google.com/search";
        engineIcon.className = "ri-google-fill";
        engineTip.textContent = `${langData.use} Google`;
    } else {
        form.action = "https://www.bing.com/search";
        engineIcon.className = "ri-search-2-line";
        engineTip.textContent = `${langData.use} Bing`;
    }
}

document.getElementById("search-form").addEventListener("submit", function (e) {
    const raw = searchInput.value.trim();
    if (!raw) return;

    if (raw.startsWith(":")) {
        e.preventDefault();
        handleCommand(raw.slice(1));
        searchInput.value = "";
        return;
    }

    const looksLikeURL = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/.test(raw);
    if (looksLikeURL) {
        e.preventDefault();
        const url = raw.startsWith("http") ? raw : `https://${raw}`;
        window.open(url, "_blank");
    }
});

function handleCommand(line) {
    const [cmdRaw, ...args] = line.split(" ");
    const cmd = cmdRaw.toLowerCase();
    const arg = args.join(" ").trim();

    const requireArg = (q, builder) => {
        if (!q) return;
        open(builder(q));
    };

    const commands = {
        g: q => requireArg(q, q => `https://www.google.com/search?q=${encodeURIComponent(q)}`),
        b: q => requireArg(q, q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`),
        yt: q => requireArg(q, q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`),
        gh: q => requireArg(q, q => `https://github.com/search?q=${encodeURIComponent(q)}`),
        so: q => requireArg(q, q => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`),
        ddg: q => requireArg(q, q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`),

        lang: code => {
            if (!["id", "en"].includes(code)) return;
            currentLang = code;
            localStorage.setItem("pilastro_lang", code);
            updateUI();
        },

        engine: name => {
            if (!["google", "bing"].includes(name)) return;
            currentEngine = name;
            localStorage.setItem("pilastro_engine", name);
            updateUI();
        },

        note: () => document.getElementById("notes-placeholder")?.focus(),

        "note-clear": () => {
            const n = document.getElementById("notes-placeholder");
            n.value = "";
            localStorage.removeItem("pilastro_data");
        },

        clear: () => (searchInput.value = ""),
        reload: () => location.reload(),
        home: () => (location.href = "/"),
        reset: () => {
            localStorage.clear();
            location.reload();
        },

        time: () => alert(new Date().toLocaleTimeString()),
        date: () => alert(new Date().toLocaleDateString()),

        help: () => showHelp(),
    };

    if (commands[cmd]) {
        commands[cmd](arg);
    }
}

function open(url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
}

function showHelp() {
    const langData = i18n[currentLang];
    alert(langData.helpText);
}

const notes = document.getElementById("notes-placeholder");
notes.value = localStorage.getItem("pilastro_data") || "";
notes.addEventListener("input", () => localStorage.setItem("pilastro_data", notes.value));

document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }

    if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        notes.focus();
    }

    if (e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleLang();
    }
});

setInterval(updateUI, 30000);
updateUI();
