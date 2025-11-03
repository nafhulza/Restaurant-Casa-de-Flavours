// Inisialisasi tema
function initTheme() {
    setupThemeToggle();
    loadSavedTheme();
}

// Fungsi untuk setup toggle tema
function setupThemeToggle() {
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);
}

// Fungsi untuk mengatur tema (gelap/terang)
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Fungsi untuk memuat tema yang disimpan
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');
    
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}