// Theme management for Spirited Away Art Shop
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeLabel = document.querySelector('.theme-label');
        this.htmlElement = document.documentElement;
        this.STORAGE_KEY = 'spirited-art-theme';
        this.DARK_MODE_CLASS = 'dark-mode';
        
        this.initialize();
    }

    initialize() {
        // Set up initial theme based on stored preference or system preference
        this.setInitialTheme();
        
        // Add event listeners
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setInitialTheme() {
        // Check localStorage first
        const storedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        if (storedTheme) {
            // Use stored preference
            this.setTheme(storedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark);
        }
    }

    toggleTheme() {
        const isDark = this.htmlElement.classList.contains(this.DARK_MODE_CLASS);
        this.setTheme(!isDark);
    }

    setTheme(isDark) {
        // Update class on html element
        if (isDark) {
            this.htmlElement.classList.add(this.DARK_MODE_CLASS);
        } else {
            this.htmlElement.classList.remove(this.DARK_MODE_CLASS);
        }

        // Update toggle label
        this.themeLabel.textContent = isDark ? 'Dark' : 'Light';

        // Save preference to localStorage
        localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});