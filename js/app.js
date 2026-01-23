window.animationObserver = null; // Declare globally on window object

function initializeSiteFeatures() {
    // Initialize Intersection Observer for animations
    window.animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe animated elements
    document.querySelectorAll('.fade-in-up').forEach(el => animationObserver.observe(el));

    // Initialize animation observer



    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Mobile Navigation ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // メニューの初期状態を必ず閉じる
    if (mobileNav) {
        mobileNav.classList.add('translate-x-full');
    }

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            // メニューの開閉
            if (mobileNav.classList.contains('translate-x-full')) {
                mobileNav.classList.remove('translate-x-full');
            } else {
                mobileNav.classList.add('translate-x-full');
            }
        });

        // モバイルナビのリンクをクリックしたら必ず閉じる
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('translate-x-full');
            });
        });

        // 画面外クリックで閉じる（オーバーレイでない場合はbodyクリックで）
        document.addEventListener('click', (e) => {
            if (
                mobileNav &&
                !mobileNav.classList.contains('translate-x-full') &&
                !mobileNav.contains(e.target) &&
                e.target !== hamburgerBtn &&
                !hamburgerBtn.contains(e.target)
            ) {
                mobileNav.classList.add('translate-x-full');
            }
        });
    } else {
        // 要素がなければ何もしない
    }

    // --- Navigation Active State ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.fade-in-up');

    animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Element became visible:', entry.target);
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        console.log('Observing element:', el);
        animationObserver.observe(el);
    });

    // --- Interactive Card Glow ---
    const cards = document.querySelectorAll('.profile-card');
    cards.forEach(card => {
        const glow = card.querySelector('.glow');
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });
    });

    // Background effect is now handled by background-effect.js

    // --- Spotify Lazy Load ---
    const spotifyIframes = document.querySelectorAll('.spotify-lazy-load');
    const spotifyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' });

    spotifyIframes.forEach(iframe => {
        spotifyObserver.observe(iframe);
    });
    // --- Ryuya Title Animation ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        const ryuyaTitle = document.querySelector('.section-title.ryuya-animate');
        if (ryuyaTitle) {
            const text = ryuyaTitle.textContent;
            // --- Page Transition Animation (墨・光・スライス強化) ---
            function showPageTransition(callback) {
                const overlay = document.querySelector('.page-transition-overlay, #page-transition-overlay');
                if (!overlay) { callback && callback(); return; }
                overlay.classList.add('active');
                overlay.style.background = 'linear-gradient(120deg, #23243a 60%, #1a1a2e 100%), radial-gradient(circle at 60% 40%, rgba(180,180,255,0.15) 0%, rgba(0,0,0,0) 70%), repeating-linear-gradient(-45deg, rgba(80,80,120,0.08) 0 10px, transparent 10px 20px)';
                overlay.style.transition = 'clip-path 0.7s cubic-bezier(.77,0,.18,1), opacity 0.5s';
                overlay.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                overlay.style.opacity = '1';
                overlay.innerHTML = '<div class="slice-flash"></div>';
                const flash = overlay.querySelector('.slice-flash');
                flash.style.position = 'absolute';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.width = '100%';
                flash.style.height = '100%';
                flash.style.background = 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(180,180,255,0.08) 60%, rgba(0,0,0,0) 100%)';
                flash.style.opacity = '0';
                flash.style.pointerEvents = 'none';
                flash.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    overlay.style.clipPath = 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)';
                    overlay.style.opacity = '0.7';
                    flash.style.opacity = '1';
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            overlay.classList.remove('active');
                            overlay.innerHTML = '';
                            overlay.style.clipPath = '';
                            overlay.style.background = '';
                            overlay.style.opacity = '';
                            callback && callback();
                        }, 400);
                    }, 700);
                }, 50);
            }

            // Attach to navigation links (SPA風遷移)
            document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
                link.addEventListener('click', e => {
                    if (link.classList.contains('active')) return;
                    e.preventDefault();
                    showPageTransition(() => {
                        window.location.href = link.getAttribute('href');
                    });
                });
            });
            ryuyaTitle.textContent = '';

            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('ryuya-char');
                span.style.setProperty('--char-index', index);
                ryuyaTitle.appendChild(span);
            });

            setTimeout(() => {
                ryuyaTitle.classList.add('ryuya-animate');
            }, 500);
        }
    }

    // --- Tales Feed (for novel.html) ---
    const talesFeedContainer = document.getElementById('tales-feed-container');
    if (talesFeedContainer && typeof loadTalesFeed === 'function') {
        // Ensure animationObserver is ready before calling loadTalesFeed
        // loadTalesFeed will use window.animationObserver
        loadTalesFeed();
    }
}

document.addEventListener('DOMContentLoaded', initializeSiteFeatures);
// ===== PREMIUM INTERACTIONS =====

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Page transition animation
document.body.classList.add('page-transition');

// Smooth reveal for cards on scroll
const revealOnScroll = () => {
    const cards = document.querySelectorAll('.profile-card, .sns-card');
    cards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8;

        if (cardTop < triggerPoint) {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};

// Initialize cards with hidden state
document.querySelectorAll('.profile-card, .sns-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Enhanced button interactions
document.querySelectorAll('.hero-cta, .premium-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Spotify embed loading optimization
const spotifyEmbeds = document.querySelectorAll('.spotify-embed iframe');
spotifyEmbeds.forEach(iframe => {
    iframe.loading = 'lazy';
});

// Add premium cursor trail effect
const createCursorTrail = () => {
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, rgba(124, 77, 255, 0.6), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                transform: translate(-50%, -50%);
                animation: fade-out 0.6s forwards;
            `;
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 600);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });
};

// Add fade-out keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-out {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style);

createCursorTrail();

console.log('%c Ryuya Official Website', 'font-size: 20px; font-weight: bold; background: linear-gradient(90deg, #7c4dff, #00e0ff); -webkit-background-clip: text; color: transparent;');
console.log('%cPowered by Premium Quality Code', 'font-size: 12px; color: #7c4dff;');

// ===== ULTRA PREMIUM INTERACTIONS =====

// 3D Card Tilt on Mouse Move
document.querySelectorAll('.premium-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});

// Magnetic Button Effect
document.querySelectorAll('.hero-cta, .premium-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Smooth Scroll with Easing
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic Background Color Change on Scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollPercentage = scrollY / (documentHeight - windowHeight);

    const hue = Math.round(270 - (scrollPercentage * 60)); // 270 (purple) to 210 (blue)
    document.body.style.backgroundColor = `hsl(${hue}, 30%, 5%)`;

    lastScrollY = scrollY;
});

// Intersection Observer for Advanced Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.profile-card, .sns-card, .spotify-embed').forEach(el => {
    animateOnScroll.observe(el);
});

// Performance Monitor (Development Only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let fps = 0;
    let lastTime = performance.now();

    function measureFPS() {
        const currentTime = performance.now();
        fps = Math.round(1000 / (currentTime - lastTime));
        lastTime = currentTime;

        console.log(`FPS: ${fps}`);
        requestAnimationFrame(measureFPS);
    }

    // measureFPS(); // Uncomment to enable FPS monitoring
}

// Add ambient sound effect (optional, can be enabled by user)
const enableAmbientSound = false; // Set to true to enable
if (enableAmbientSound) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 110; // Low A note
    gainNode.gain.value = 0.01; // Very quiet ambient

    // oscillator.start(); // Uncomment to enable ambient sound
}

console.log('%c Ultra Premium Mode Activated', 'font-size: 16px; font-weight: bold; background: linear-gradient(90deg, #7c4dff, #00e0ff, #ff00ff); -webkit-background-clip: text; color: transparent;');
console.log('%c Performance Optimized', 'font-size: 12px; color: #00e0ff;');
console.log('%c 3D Effects, Tilt, Magnetic Buttons, Dynamic Colors Active', 'font-size: 12px; color: #7c4dff;');
