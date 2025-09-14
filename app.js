// グローバルなエラーハンドラー: 非致命的な AbortError を捕捉
        window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && event.reason.name === 'AbortError') {
                event.preventDefault();
                console.warn('A non-critical AbortError was handled gracefully.');
            }
        });

        

        document.addEventListener('DOMContentLoaded', function() {

            // --- セキュリティ強化: クリックジャッキング防止 ---
            if (window.top !== window.self) {
                try {
                    // 親ウィンドウのURLを現在のウィンドウのURLに書き換える
                    window.top.location.href = window.self.location.href;
                } catch (e) {
                    // クロスオリジンで失敗した場合は、コンテンツを非表示にする
                    console.error('Frame-busting failed due to cross-origin restrictions.');
                    document.body.innerHTML = '<h1 style="color:white; text-align:center; padding-top: 20vh;">このコンテンツはフレーム内では表示できません。</h1>';
                }
            }

            // --- セキュリティ強化: onerror属性のインラインJSを排除 ---
            document.body.addEventListener('error', (e) => {
                const target = e.target;
                if (!target || target.tagName !== 'IMG') return;

                // 画像のフォールバック処理
                if (target.classList.contains('image-fallback-replace')) {
                    const fallbackSrc = target.getAttribute('data-fallback-src');
                    if (fallbackSrc) {
                        target.onerror = null; // 無限ループを防止
                        target.src = fallbackSrc;
                    }
                } else if (target.classList.contains('image-fallback')) {
                    const action = target.getAttribute('data-fallback-action');
                    if (action === 'hide-parent' && target.parentElement) {
                        target.parentElement.style.display = 'none';
                    } else if (action === 'hide-self') {
                        target.style.display = 'none';
                    }
                }
            }, true); // キャプチャフェーズでイベントを捕捉

            
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileNav = document.getElementById('mobile-nav');
            const navLinks = document.querySelectorAll('.nav-link');
            const transitionOverlay = document.getElementById('page-transition-overlay');
            const header = document.querySelector('header');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');
            const particlesJsDiv = document.getElementById('particles-js');

            // --- ハンバーガーメニューロジック ---
            hamburgerBtn.addEventListener('click', function() {
                this.classList.toggle('is-active');
                mobileNav.classList.toggle('is-active');
            });
            
            // --- SPAナビゲーション & 遷移ロジック ---
            let isTransitioning = false;

            function runGlitchTransition(callback) {
                if (isTransitioning) return;
                isTransitioning = true;
                transitionOverlay.style.pointerEvents = 'auto';
                const cells = Array.from({ length: 400 }, () => {
                    const cell = document.createElement('div');
                    cell.classList.add('transition-cell');
                    transitionOverlay.appendChild(cell);
                    return cell;
                });
                cells.forEach(cell => setTimeout(() => {
                    cell.style.opacity = '1';
                    cell.style.transform = 'scale(1)';
                }, Math.random() * 500));
                setTimeout(() => {
                    callback();
                    cells.forEach(cell => setTimeout(() => {
                        cell.style.opacity = '0';
                        cell.style.transform = 'scale(0)';
                    }, Math.random() * 500));
                    setTimeout(() => {
                        transitionOverlay.innerHTML = '';
                        transitionOverlay.style.pointerEvents = 'none';
                        isTransitioning = false;
                    }, 1000);
                }, 700);
            }

            function navigateToPage(pageId) {
                console.log(`Navigating to page: ${pageId}`);
                const currentPage = document.querySelector('.page-content.is-active');
                if ((currentPage && currentPage.id === pageId) || isTransitioning) {
                    if (mobileNav.classList.contains('is-active')) {
                        hamburgerBtn.classList.remove('is-active');
                        mobileNav.classList.remove('is-active');
                    }
                    return;
                }
                runGlitchTransition(() => {
                    if (currentPage) {
                        console.log(`Hiding page: ${currentPage.id}`);
                        currentPage.classList.remove('is-active');
                    }
                    const nextPage = document.getElementById(pageId);
                    if (nextPage) {
                        console.log(`Showing page: ${pageId}`);
                        nextPage.classList.add('is-active');
                    } else {
                        console.error(`Page not found: ${pageId}`);
                    }
                    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                    document.querySelectorAll(`.nav-link[data-page="${pageId}"]`).forEach(activeLink => activeLink.classList.add('active'));
                    AOS.refresh();
                    window.scrollTo(0, 0);
                    if (mobileNav.classList.contains('is-active')) {
                        hamburgerBtn.classList.remove('is-active');
                        mobileNav.classList.remove('is-active');
                    }
                });
            }

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageId = link.getAttribute('data-page');
                    if(pageId) navigateToPage(pageId);
                });
            });

            // --- Particles.js設定 ---
            // const particlesConfig = { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": ["#8139f5", "#00cde9", "#39f581", "#ff00ff"] }, "shape": { "type": "circle" }, "opacity": { "value": 0.6, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 4, "random": true, "anim": { "enable": true, "speed": 10, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 3, "direction": "none", "random": true, "straight": false, "out_mode": "out" } }, "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "grab": { "distance": 200, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } } }, "retina_detect": true };

            // --- メインコンテンツ表示関数 ---
            function showMainContent() {
                if (header) header.style.display = 'flex';
                if (main) main.style.display = 'block';
                if (footer) footer.style.display = 'flex';
                // if (particlesJsDiv && typeof particlesJS !== 'undefined') {
                //     particlesJS('particles-js', particlesConfig);
                // }
                document.body.style.cursor = 'auto';
            }

            // ======================================================
            // --- AIギャラリーロジック (削除済み) ---
            // ======================================================

            // ======================================================
            // --- note RSSフィード読み込み ---
            // ======================================================
            function loadNoteFeed() {
                console.log('Attempting to load Note feed...');
                const feedContainer = document.querySelector('#page-media .note-feed-container');
                if (!feedContainer) {
                    console.warn('Note feed container not found.');
                    return;
                }

                feedContainer.innerHTML = '<p style="text-align: center;">最新の記事を読み込んでいます...</p>';

                const rssUrl = 'https://note.com/ryuya_330/rss';
                const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

                fetch(apiUrl)
                    .then(response => {
                        console.log('Note feed fetch response received:', response);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Note feed data:', data);
                        if (data.status === 'ok') {
                            feedContainer.innerHTML = ''; // ローディングメッセージをクリア
                            data.items.forEach(item => {
                                const snippet = item.description.replace(/<[^>]*>/g, "").substring(0, 150) + '...';
                                const pubDate = new Date(item.pubDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

                                const cardHtml = `
                                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="note-card">
                                        <img src="${item.thumbnail}" alt="" class="note-card-thumbnail image-fallback" data-fallback-action="hide-self">
                                        <div class="note-card-content">
                                            <h4 class="note-card-title">${item.title}</h4>
                                            <p class="note-card-date">${pubDate}</p>
                                            <p class="note-card-snippet">${snippet}</p>
                                        </div>
                                    </a>
                                `;
                                feedContainer.insertAdjacentHTML('beforeend', cardHtml);
                            });
                        } else {
                            throw new Error('RSS feed could not be loaded.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching note feed:', error);
                        feedContainer.innerHTML = '<p style="text-align: center;">記事の読み込みに失敗しました。後でもう一度お試しください。</p>';
                    });
            }
            loadNoteFeed();

            


            // ======================================================
            // --- セキュリティ & コンテンツ保護 ---
            // ======================================================
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('dragstart', event => {
                if (event.target.tagName === 'IMG') event.preventDefault();
            });
            
            if (!/Mobi|Android/i.test(navigator.userAgent)) {
                const devToolsBlocker = document.getElementById('devtools-blocker');
                const devtoolsDetector = { isOpen: false };
                Object.defineProperty(devtoolsDetector, 'toString', { get: function() { this.isOpen = true; return ''; } });
                setInterval(() => {
                    devtoolsDetector.isOpen = false;
                    console.log('%c', devtoolsDetector);
                    if (devtoolsDetector.isOpen && devToolsBlocker) {
                        devToolsBlocker.style.display = 'block';
                    }
                }, 1500);
            }

            // ======================================================
            // --- 一般的なUI & 初期化 ---
            // ======================================================
            AOS.init({ once: true, offset: 100, duration: 1000 });
            showMainContent();
            
            document.querySelectorAll('.announcement-toggle').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const item = toggle.parentElement;
                    const details = item.querySelector('.announcement-details');
                    const isOpening = !item.classList.contains('is-open');
                    
                    document.querySelectorAll('.announcement-item.is-open').forEach(openItem => {
                        if (openItem !== item) {
                            openItem.classList.remove('is-open');
                            openItem.querySelector('.announcement-details').style.maxHeight = null;
                        }
                    });

                    if (isOpening) {
                        item.classList.add('is-open');
                        details.style.maxHeight = details.scrollHeight + 'px';
                    } else {
                        item.classList.remove('is-open');
                        details.style.maxHeight = null;
                    }
                });
            });

            window.addEventListener('scroll', function() {
                const header = document.querySelector('header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        });