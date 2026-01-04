/**
 * Advanced Interactive Cursor Effects
 * High-Performance Mouse Trail and Interactive Elements
 */

class CursorEffects {
    constructor() {
        this.cursor = null;
        this.trail = [];
        this.trailLength = 20;
        this.ripples = [];

        this.init();
    }

    init() {
        this.createCustomCursor();
        this.createTrailSystem();
        this.setupEventListeners();
        this.animate();
    }

    createCustomCursor() {
        // Custom cursor element
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(124, 77, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.2s, height 0.2s, border-color 0.2s;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);

        // Inner dot
        const innerDot = document.createElement('div');
        innerDot.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            background: rgba(124, 77, 255, 1);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
        this.cursor.appendChild(innerDot);
    }

    createTrailSystem() {
        // Create trail particles
        for (let i = 0; i < this.trailLength; i++) {
            const particle = document.createElement('div');
            particle.className = 'cursor-trail';
            particle.style.cssText = `
                position: fixed;
                width: ${12 - i * 0.4}px;
                height: ${12 - i * 0.4}px;
                background: radial-gradient(circle, 
                    rgba(124, 77, 255, ${0.6 - i * 0.03}),
                    rgba(0, 224, 255, ${0.3 - i * 0.015}));
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                filter: blur(${i * 0.2}px);
                mix-blend-mode: screen;
            `;
            document.body.appendChild(particle);
            this.trail.push({
                element: particle,
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0
            });
        }
    }

    setupEventListeners() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update cursor position immediately
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';

            // Update trail target positions
            this.trail[0].targetX = mouseX;
            this.trail[0].targetY = mouseY;
        });

        // Click ripple effect
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .profile-card, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '40px';
                this.cursor.style.height = '40px';
                this.cursor.style.borderColor = 'rgba(0, 224, 255, 0.8)';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = 'rgba(124, 77, 255, 0.8)';
            });
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid rgba(124, 77, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            transform: translate(-50%, -50%);
            animation: ripple-expand 0.6s ease-out forwards;
        `;

        document.body.appendChild(ripple);
        this.ripples.push(ripple);

        setTimeout(() => {
            ripple.remove();
            this.ripples = this.ripples.filter(r => r !== ripple);
        }, 600);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update trail with smooth following
        for (let i = 0; i < this.trail.length; i++) {
            const particle = this.trail[i];

            if (i === 0) {
                // First particle follows mouse
                particle.x += (particle.targetX - particle.x) * 0.2;
                particle.y += (particle.targetY - particle.y) * 0.2;
            } else {
                // Other particles follow previous one
                const prev = this.trail[i - 1];
                particle.targetX = prev.x;
                particle.targetY = prev.y;
                particle.x += (particle.targetX - particle.x) * 0.15;
                particle.y += (particle.targetY - particle.y) * 0.15;
            }

            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        }
    }
}

// Parallax effect for elements
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 5;
                const x = mouseX * speed;
                const y = mouseY * speed;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Magnetic button effect
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn, button, a.nav-link');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });

            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    // Check if device has mouse (not touch-only)
    if (matchMedia('(pointer:fine)').matches) {
        new CursorEffects();
        new MagneticButtons();
    }
    new ParallaxEffect();
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-expand {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    body.cursor-active {
        cursor: none;
    }
    
    * {
        cursor: none !important;
    }
`;
document.head.appendChild(style);

// Hide default cursor only on desktop
if (matchMedia('(pointer:fine)').matches) {
    document.body.classList.add('cursor-active');
}
