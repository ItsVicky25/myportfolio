// Universal Navbar JavaScript
// This file provides consistent navbar functionality across all pages

// Audio functionality
let backgroundAudio = null;
let isAudioMuted = true;

// Initialize background audio
function initAudio() {
    backgroundAudio = new Audio('jungle.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.3; // Set to 30% volume
    
    // Preload the audio
    backgroundAudio.preload = 'auto';
    
    backgroundAudio.addEventListener('canplaythrough', () => {
        console.log('Background audio loaded and ready');
    });
    
    backgroundAudio.addEventListener('error', (e) => {
        console.error('Error loading background audio:', e);
    });
}

function toggleAudio() {
    const audioIcon = document.querySelector('.audio-icon svg');
    
    if (!backgroundAudio) {
        initAudio();
    }
    
    isAudioMuted = !isAudioMuted;
    
    if (isAudioMuted) {
        // Pause audio
        if (backgroundAudio) {
            backgroundAudio.pause();
        }
        // Muted icon (speaker with X)
        audioIcon.innerHTML = `
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(255,255,255,0.9)"/>
            <line x1="23" y1="9" x2="17" y2="15" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round"/>
            <line x1="17" y1="9" x2="23" y2="15" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round"/>
        `;
    } else {
        // Play audio
        if (backgroundAudio) {
            backgroundAudio.play().catch(e => {
                console.log('Autoplay prevented, user interaction required:', e);
            });
        }
        // Unmuted icon (speaker with sound waves)
        audioIcon.innerHTML = `
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(255,255,255,0.9)"/>
            <path d="M19.07 4.93C20.97 6.83 21.97 9.35 21.97 12C21.97 14.65 20.97 17.17 19.07 19.07M15.54 8.46C16.49 9.41 16.97 10.7 16.97 12C16.97 13.3 16.49 14.59 15.54 15.54" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
    }
    
    console.log(`Background audio ${isAudioMuted ? 'muted' : 'playing'}`);
}

// Navigation functionality
function initNavigation() {
    // Navigation functionality for navbar icons
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.add('bubble-click');
            setTimeout(() => {
                this.classList.remove('bubble-click');
            }, 600);
            
            // Handle navigation based on icon class
            if (this.classList.contains('home-icon')) {
                window.location.href = 'index.html?skipIntro=true';
            } else if (this.classList.contains('twitter-icon')) {
                window.open('https://twitter.com/', '_blank');
            } else if (this.classList.contains('github-icon')) {
                window.open('https://github.com/', '_blank');
            } else if (this.classList.contains('kaggle-icon')) {
                window.open('https://kaggle.com/', '_blank');
            } else if (this.classList.contains('medium-icon')) {
                window.open('https://medium.com/', '_blank');
            } else if (this.classList.contains('linkedin-icon')) {
                window.open('https://linkedin.com/', '_blank');
            } else if (this.classList.contains('contact-icon')) {
                window.location.href = 'mailto:your.email@example.com';
            } else if (this.classList.contains('audio-icon')) {
                toggleAudio();
            }
        });
    });
}

// Navbar toggle functionality
function initNavbarToggle() {
    const navbar = document.querySelector('.glass-card');
    const navbarToggle = document.getElementById('navbarToggle');
    let hideTimeout;
    let isNavbarOpen = false;
    
    if (!navbar || !navbarToggle) return;
    
    // Auto-show navbar on page load after intro animations (only on index page)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            if (!isNavbarOpen) {
                navbar.classList.add('show');
                navbarToggle.classList.add('navbar-open');
                isNavbarOpen = true;
            }
        }, 16000); // Show after all intro animations complete
    } else {
        // Show navbar immediately on other pages
        navbar.classList.add('show');
        navbarToggle.classList.add('navbar-open');
        isNavbarOpen = true;
    }

    // Navbar Toggle Functionality
    navbarToggle.addEventListener('click', () => {
        isNavbarOpen = !isNavbarOpen;
        
        if (isNavbarOpen) {
            navbar.classList.add('show');
            navbarToggle.classList.add('navbar-open');
            clearTimeout(hideTimeout);
        } else {
            navbar.classList.remove('show');
            navbarToggle.classList.remove('navbar-open');
        }
    });
    
    // Mouse proximity detection for navbar
    document.addEventListener('mousemove', (e) => {
        const leftEdgeDistance = e.clientX;
        
        if (leftEdgeDistance < 100 && !isNavbarOpen) {
            navbar.classList.add('show');
            navbarToggle.classList.add('navbar-open');
            isNavbarOpen = true;
            clearTimeout(hideTimeout);
        } else if (leftEdgeDistance > 150 && isNavbarOpen && !navbar.matches(':hover')) {
            hideTimeout = setTimeout(() => {
                navbar.classList.remove('show');
                navbarToggle.classList.remove('navbar-open');
                isNavbarOpen = false;
            }, 500);
        }
    });
    
    // Keep navbar open when hovering over it
    navbar.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });
    
    navbar.addEventListener('mouseleave', () => {
        if (isNavbarOpen) {
            hideTimeout = setTimeout(() => {
                navbar.classList.remove('show');
                navbarToggle.classList.remove('navbar-open');
                isNavbarOpen = false;
            }, 500);
        }
    });
}

// Load navbar HTML content
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarContainer.innerHTML = html;
                initNavigation();
                initNavbarToggle();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                // Fallback - keep existing navbar if fetch fails
                initNavigation();
                initNavbarToggle();
            });
    } else {
        // If no container, init with existing navbar
        initNavigation();
        initNavbarToggle();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    loadNavbar();
});