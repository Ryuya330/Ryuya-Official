/**
 * Performance Monitor and Optimizer
 * High-Performance PC Optimization
 */

class PerformanceOptimizer {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frames = 0;
        this.fpsDisplay = null;
        this.quality = 'high'; // 'low', 'medium', 'high', 'ultra'
        
        this.init();
    }
    
    init() {
        this.detectCapabilities();
        this.createFPSMonitor();
        this.optimizeForDevice();
        this.monitorPerformance();
    }
    
    detectCapabilities() {
        // Detect GPU tier
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                console.log('GPU:', renderer);
                
                // High-end GPUs
                if (renderer.includes('RTX') || renderer.includes('RX 6') || renderer.includes('RX 7')) {
                    this.quality = 'ultra';
                } else if (renderer.includes('GTX 16') || renderer.includes('GTX 10')) {
                    this.quality = 'high';
                } else {
                    this.quality = 'medium';
                }
            }
        }
        
        // Check for high refresh rate
        if (window.screen && window.screen.refreshRate) {
            if (window.screen.refreshRate >= 120) {
                console.log('High refresh rate detected:', window.screen.refreshRate);
                this.quality = 'ultra';
            }
        }
        
        // Check memory
        if (performance.memory) {
            const totalMemory = performance.memory.jsHeapSizeLimit;
            if (totalMemory > 4 * 1024 * 1024 * 1024) { // > 4GB
                console.log('High memory available');
            }
        }
        
        console.log('Quality setting:', this.quality);
        this.applyQualitySettings();
    }
    
    applyQualitySettings() {
        const settings = {
            low: {
                particleCount: 500,
                shadowQuality: 'low',
                antialiasing: false,
                bloomEnabled: false
            },
            medium: {
                particleCount: 1500,
                shadowQuality: 'medium',
                antialiasing: true,
                bloomEnabled: false
            },
            high: {
                particleCount: 4500,
                shadowQuality: 'high',
                antialiasing: true,
                bloomEnabled: true
            },
            ultra: {
                particleCount: 8000,
                shadowQuality: 'ultra',
                antialiasing: true,
                bloomEnabled: true
            }
        };
        
        const currentSettings = settings[this.quality];
        document.documentElement.setAttribute('data-quality', this.quality);
        
        // Apply settings to CSS variables
        document.documentElement.style.setProperty('--particle-count', currentSettings.particleCount);
    }
    
    createFPSMonitor() {
        // Create FPS display (can be hidden for production)
        this.fpsDisplay = document.createElement('div');
        this.fpsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            display: none; /* Hidden by default */
        `;
        document.body.appendChild(this.fpsDisplay);
        
        // Show with Ctrl+Shift+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                this.fpsDisplay.style.display = 
                    this.fpsDisplay.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    monitorPerformance() {
        const measure = () => {
            const currentTime = performance.now();
            this.frames++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
                this.fpsDisplay.textContent = `FPS: ${this.fps} | Quality: ${this.quality}`;
                
                // Auto-adjust quality based on FPS
                if (this.fps < 30 && this.quality !== 'low') {
                    this.downgradeQuality();
                } else if (this.fps > 55 && this.quality !== 'ultra') {
                    // Could upgrade quality here if desired
                }
                
                this.frames = 0;
                this.lastTime = currentTime;
            }
            
            requestAnimationFrame(measure);
        };
        
        requestAnimationFrame(measure);
    }
    
    downgradeQuality() {
        const qualityLevels = ['ultra', 'high', 'medium', 'low'];
        const currentIndex = qualityLevels.indexOf(this.quality);
        if (currentIndex < qualityLevels.length - 1) {
            this.quality = qualityLevels[currentIndex + 1];
            console.warn('Performance issue detected, downgrading to:', this.quality);
            this.applyQualitySettings();
        }
    }
    
    optimizeForDevice() {
        // Preload critical assets
        this.preloadAssets();
        
        // Enable hardware acceleration
        this.enableHardwareAcceleration();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Lazy load images
        this.lazyLoadImages();
    }
    
    preloadAssets() {
        // Preload critical fonts
        const fonts = [
            'Inter',
            'Noto Serif JP'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    enableHardwareAcceleration() {
        // Add CSS transforms to key elements for GPU acceleration
        const elements = document.querySelectorAll('.profile-card, .sns-card, h1, h2, section');
        elements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform';
        });
    }
    
    optimizeAnimations() {
        // Use requestAnimationFrame for smooth animations
        if (this.quality === 'ultra' || this.quality === 'high') {
            // Enable all animations
            document.body.classList.add('high-performance');
        } else {
            // Reduce animation complexity
            document.body.classList.add('reduced-animations');
        }
    }
    
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Public method to get current FPS
    getFPS() {
        return this.fps;
    }
    
    // Public method to change quality manually
    setQuality(quality) {
        if (['low', 'medium', 'high', 'ultra'].includes(quality)) {
            this.quality = quality;
            this.applyQualitySettings();
        }
    }
}

// Initialize performance optimizer
const perfOptimizer = new PerformanceOptimizer();

// Expose to window for debugging
window.perfOptimizer = perfOptimizer;

// Add quality toggle for testing (Ctrl+Shift+Q)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
        const qualities = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = qualities.indexOf(perfOptimizer.quality);
        const nextQuality = qualities[(currentIndex + 1) % qualities.length];
        perfOptimizer.setQuality(nextQuality);
        console.log('Quality changed to:', nextQuality);
    }
});

console.log('Performance Optimizer loaded. Press Ctrl+Shift+P to toggle FPS monitor, Ctrl+Shift+Q to cycle quality levels.');
