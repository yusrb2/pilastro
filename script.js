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
:so query ()
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
let currentIndex = -1;

const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".pilastro-search-container");
const suggestionEl = document.getElementById("suggestions");
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

    showSuggestions(searchInput.value.trim());
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

function showSuggestions(value) {
    const history = getHistory();
    currentIndex = -1;
    suggestionEl.innerHTML = "";

    if (!value) {
        suggestionEl.style.display = "none";
        return;
    }

    const matches = history.filter(item => item.toLowerCase().startsWith(value.toLowerCase()));

    if (!matches.length) {
        suggestionEl.style.display = "none";
        return;
    }

    matches.forEach(item => {
        const div = document.createElement("div");
        div.className = "suggestion-item";

        const textSpan = document.createElement("span");
        textSpan.className = "suggestion-text";
        textSpan.textContent = item;

        const delBtn = document.createElement("span");
        delBtn.className = "delete-btn";
        delBtn.innerHTML = "&times;";
        
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeFromHistory(item);
            showSuggestions(searchInput.value.trim());
            searchInput.focus();
        });

        div.addEventListener("click", () => {
            searchInput.value = item;
            suggestionEl.style.display = "none";
            searchInput.focus();
        });

        div.appendChild(textSpan);
        div.appendChild(delBtn);
        suggestionEl.appendChild(div);
    });

    suggestionEl.style.display = "block";
}

function saveToHistory(query) {
    if (!query || query.startsWith(":")) return;

    let history = getHistory();

    history = history.filter(item => item !== query);
    history.unshift(query);

    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    saveHistory(history);
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

const HISTORY_KEY = "pilastro_history";
const MAX_HISTORY = 20;

function getHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveHistory(list) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const raw = searchInput.value.trim();

    if (!raw) return;

    if (raw.startsWith(":")) {
        handleCommand(raw.slice(1));
    } else if (/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/.test(raw)) {
        const url = raw.startsWith("http") ? raw : `https://${raw}`;
        window.open(url, "_blank");
    } else {
        const query = encodeURIComponent(raw);
        const searchUrl =
            currentEngine === "google"
                ? `https://www.google.com/search?q=${query}`
                : `https://www.bing.com/search?q=${query}`;
        window.open(searchUrl, "_blank");
    }

    saveToHistory(raw);

    searchInput.value = "";

    if (suggestionEl) suggestionEl.style.display = "none";
    searchContainer.classList.remove("command-mode");

    searchBtn.textContent = i18n[currentLang].btnSearch;
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

function updateActive(items) {
    items.forEach(item => item.classList.remove("active"));

    const selectedItem = items[currentIndex];
    selectedItem.classList.add("active");

    const textOnly = selectedItem.querySelector(".suggestion-text").textContent;

    searchInput.value = textOnly;
}

function removeFromHistory(itemToRemove) {
    let history = getHistory();
    history = history.filter(item => item !== itemToRemove);
    saveHistory(history);
}

const notes = document.getElementById("notes-placeholder");
notes.value = localStorage.getItem("pilastro_data") || "";
notes.addEventListener("input", () => localStorage.setItem("pilastro_data", notes.value));

document.addEventListener("keydown", e => {
    const items = document.querySelectorAll(".suggestion-item");

    if (!items.length) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex++;
        if (currentIndex >= items.length) currentIndex = 0;
        updateActive(items);
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex--;
        if (currentIndex < 0) currentIndex = items.length - 1;
        updateActive(items);
    }

    if (e.key === "Enter" && currentIndex >= 0) {
        e.preventDefault();
        items[currentIndex].click();
    }

    if (e.key === "Escape") {
        suggestionEl.style.display = "none";
        currentIndex = -1;
    }

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

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => console.log("SW registered"))
            .catch(console.error);
    });
}
