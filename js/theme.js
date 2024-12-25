// Theme management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button icons
    const lightIcon = themeToggle.querySelector('.theme-icon-light');
    const darkIcon = themeToggle.querySelector('.theme-icon-dark');
    
    if (theme === 'dark') {
        lightIcon.style.display = 'inline-block';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline-block';
    }
}

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = `
        <i class="bi bi-moon-fill theme-icon-dark"></i>
        <i class="bi bi-sun-fill theme-icon-light" style="display: none;"></i>
    `;
    document.body.appendChild(themeToggle);

    initializeTheme();
});
