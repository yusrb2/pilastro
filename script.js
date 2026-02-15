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
        use: "Gunakan"
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
        use: "Use"
    }
};

let currentLang = localStorage.getItem('pilastro_lang') || 'id';
let currentEngine = localStorage.getItem('pilastro_engine') || 'bing';

function toggleLang() {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    localStorage.setItem('pilastro_lang', currentLang);
    updateUI();
}

function toggleEngine() {
    currentEngine = currentEngine === 'bing' ? 'google' : 'bing';
    localStorage.setItem('pilastro_engine', currentEngine);
    updateUI();
}

function updateUI() {
    const now = new Date();
    const langData = i18n[currentLang];

    document.getElementById('clock').textContent = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options).toUpperCase();

    document.getElementById('search-input').placeholder = langData.search;
    document.getElementById('btn-search').textContent = langData.btnSearch;
    document.getElementById('sub-greeting').textContent = langData.subGreeting;
    document.getElementById('notes-placeholder').placeholder = langData.notesPlace;
    document.getElementById('made-by').textContent = langData.made;
    document.getElementById('lang-btn').textContent = currentLang.toUpperCase();
    
    document.querySelectorAll('[data-key]').forEach(el => {
        el.textContent = langData[el.getAttribute('data-key')];
    });

    const hour = now.getHours();
    const greet = document.getElementById('greeting');
    if(hour < 11) greet.textContent = langData.morning;
    else if(hour < 15) greet.textContent = langData.noon;
    else if(hour < 19) greet.textContent = langData.afternoon;
    else greet.textContent = langData.night;

    const form = document.getElementById('search-form');
    const engineIcon = document.getElementById('engine-icon').querySelector('i');
    const engineTip = document.getElementById('engine-tooltip');
    
    if(currentEngine === 'google') {
        form.action = "https://www.google.com/search";
        engineIcon.className = "ri-google-fill";
        engineTip.textContent = `${langData.use} Google`;
    } else {
        form.action = "https://www.bing.com/search";
        engineIcon.className = "ri-search-2-line";
        engineTip.textContent = `${langData.use} Bing`;
    }
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    const input = document.getElementById('search-input').value.trim();

    const looksLikeURL = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/.test(input);

    if (looksLikeURL) {
        e.preventDefault();
        const url = input.startsWith('http') ? input : `https://${input}`;
        window.open(url, '_blank');
    }
});

const notes = document.getElementById('notes-placeholder');
notes.value = localStorage.getItem('pilastro_data') || '';
notes.addEventListener('input', () => localStorage.setItem('pilastro_data', notes.value));

setInterval(updateUI, 30000);
updateUI();