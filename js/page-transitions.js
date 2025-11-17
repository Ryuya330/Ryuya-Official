// Smooth Fade & Zoom Transition Effect
function showPageTransition(callback) {
    const overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
        callback && callback();
        return;
    }

    // Create smooth transition elements
    overlay.innerHTML = `
        <div class="hex-grid"></div>
        <div class="radial-pulse"></div>
        <div class="light-sweep"></div>
        <div class="particles"></div>
    `;

    // パーティクルをランダムに配置
    const particlesContainer = overlay.querySelector('.particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particlesContainer.appendChild(particle);
    }

    // トランジション開始
    requestAnimationFrame(() => {
        overlay.style.display = 'block';
        requestAnimationFrame(() => {
            overlay.classList.add('active');

            // ページ遷移のタイミング
            setTimeout(() => {
                callback && callback();
            }, 300);

            // フェードアウト開始
            setTimeout(() => {
                overlay.classList.remove('active');
                overlay.classList.add('fade-out');
                
                setTimeout(() => {
                    overlay.classList.remove('fade-out');
                    overlay.style.display = 'none';
                    overlay.innerHTML = '';
                }, 400);
            }, 600);
        });
    });
}

// ナビゲーションリンクにトランジション適用
document.addEventListener('DOMContentLoaded', () => {
    // 通常のナビゲーションリンク
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('active')) return;
            
            e.preventDefault();
            const href = this.getAttribute('href');
            
            showPageTransition(() => {
                window.location.href = href;
            });
        });
    });

    // カスタムカーソルがある場合の連携
    const cursor = document.getElementById('cursor-outline');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            if (document.querySelector('.page-transition-overlay.active')) {
                cursor.style.opacity = '0.5';
            } else {
                cursor.style.opacity = '1';
            }
        });
    }
});