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
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- Mobile Navigation ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    hamburgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('translate-x-full');
    });
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.add('translate-x-full');
        });
    });

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

    // --- Tales Feed (for novel.html) ---
    const talesFeedContainer = document.getElementById('tales-feed-container');
    if (talesFeedContainer && typeof loadTalesFeed === 'function') {
        // Ensure animationObserver is ready before calling loadTalesFeed
        // loadTalesFeed will use window.animationObserver
        loadTalesFeed();
    }
}

document.addEventListener('DOMContentLoaded', initializeSiteFeatures);