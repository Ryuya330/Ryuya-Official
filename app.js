function initializeSiteFeatures() {
    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    const updateCursorPosition = (x, y) => {
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        cursorOutline.style.left = `${x}px`;
        cursorOutline.style.top = `${y}px`;
    };

    window.addEventListener('mousemove', e => {
        updateCursorPosition(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    document.querySelectorAll('a, button, .profile-card, .spotify-embed, .note-card').forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        // For touch devices, we might want to add a similar effect on touchstart/touchend
        // For now, keeping it mouse-specific to avoid conflicts with native touch behavior
    });

    

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

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 一度表示されたら監視を停止
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => animationObserver.observe(el));
    
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

    // --- Note RSS Feed ---
    const noteFeedContainer = document.getElementById('note-feed-container');
    if (noteFeedContainer) {
        loadNoteFeed();
    }

    function loadNoteFeed() {
        noteFeedContainer.innerHTML = '<p class="text-center">最新の記事を読み込んでいます...<\/p>';
        const rssUrl = 'https://note.com/ryuya_330/rss';
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(data => {
                if (data.status === 'ok') {
                    noteFeedContainer.innerHTML = '';
                    data.items.forEach(item => { // Display all articles
                        const snippet = item.description.replace(/<[^>]*>/g, "").substring(0, 100) + '...';
                        const pubDate = new Date(item.pubDate).toLocaleDateString('ja-JP');
                        const thumbnailHtml = item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}" class="w-full md:w-48 h-auto rounded-md object-cover">` : '';
                        const cardHtml = `
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="note-card block rounded-lg p-6">
                                <div class="flex flex-col md:flex-row md:items-center gap-6">
                                    ${thumbnailHtml}
                                    <div>
                                        <h4 class="text-xl font-bold mb-2 hover:text-accent-color transition-colors">${item.title}<\/h4>
                                        <p class="text-sm text-gray-400 mb-3">${pubDate}<\/p>
                                        <p class="text-gray-300">${snippet}<\/p>
                                    <\/div>
                                <\/div>
                            <\/a>`;
                        noteFeedContainer.insertAdjacentHTML('beforeend', cardHtml);
                    });
                } else {
                    throw new Error('RSS feed could not be loaded.');
                }
            })
            .catch(error => {
                console.error('Error fetching note feed:', error);
                noteFeedContainer.innerHTML = '<p class="text-center text-red-400">記事の読み込みに失敗しました。<\/p>';
            });
    }
    
    // --- Three.js Background ---
    let scene, camera, renderer, material;
    const mouse = new THREE.Vector2();

    function initThree() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;
        
        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const geometry = new THREE.PlaneGeometry(window.innerWidth/100, window.innerHeight/100, 1, 1);
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec2 vUv;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform vec2 u_resolution; // 解像度を追加

            // 2D Random
            float random (vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            // 2D Noise
            float noise (vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);

                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));

                vec2 u = f*f*(3.0-2.0*f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            // FBM (Fractal Brownian Motion) for more complex noise
            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                float frequency = 0.0;
                for (int i = 0; i < 4; i++) {
                    value += amplitude * noise(st);
                    st *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
            
            void main() {
                vec2 uv = vUv;
                vec2 aspectCorrectedUv = uv * u_resolution / min(u_resolution.x, u_resolution.y);

                // Glitch effect based on time and noise
                float glitchStrength = sin(u_time * 10.0) * 0.07 + 0.07; // Increased glitch strength
                glitchStrength *= fbm(uv * 20.0 + u_time * 1.0); // Increased noise impact
                uv.x += glitchStrength * (random(uv + u_time) - 0.5);
                uv.y += glitchStrength * (random(uv * 2.0 + u_time) - 0.5);

                // Base noise pattern with additional FBM layer
                vec2 scaledUv = uv * 8.0;
                float n = fbm(scaledUv + u_time * 0.05); // First FBM layer
                float n2 = fbm(uv * 15.0 + u_time * 0.1); // Second FBM layer for more complexity
                float combinedNoise = (n + n2) * 0.5; // Combine and normalize

                // Mouse interaction
                vec2 mouseEffect = (u_mouse + 1.0) * 0.5;
                mouseEffect = mix(vec2(0.5), mouseEffect, 1.0); // Stronger mouse influence
                float mouseDist = distance(uv, mouseEffect);
                float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.7; // Increased influence area and strength

                // Combine noise and mouse influence
                float finalNoise = combinedNoise + mouseInfluence;

                // Digital line/grid pattern
                vec2 gridUv = uv * 20.0;
                float gridX = step(0.9, fract(gridUv.x));
                float gridY = step(0.9, fract(gridUv.y));
                float gridPattern = max(gridX, gridY) * 0.1; // グリッドの強度

                // Colors
                vec3 color1 = vec3(0.0, 0.0, 0.2 + sin(u_time * 0.5) * 0.05); // Dark Blue with subtle pulse
                vec3 color2 = vec3(0.0, 0.7 + sin(u_time * 0.7) * 0.05, 1.0); // Cyan with subtle pulse
                vec3 color3 = vec3(0.8 + sin(u_time * 0.9) * 0.05, 0.2, 1.0); // Magenta with subtle pulse
                
                vec3 mixedColor = mix(color1, color2, finalNoise);
                mixedColor = mix(mixedColor, color3, smoothstep(0.6, 1.0, finalNoise + mouseInfluence));

                // Final color with grid and glitch
                gl_FragColor = vec4(mixedColor * (finalNoise + gridPattern), 1.0);
            }
        `;

        material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } // 解像度を追加
            },
            vertexShader,
            fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onMouseMove, false);

        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onTouchMove(event) {
        if (event.touches.length > 0) {
            mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.u_time.value = clock.getElapsedTime();
        material.uniforms.u_mouse.value.lerp(mouse, 0.05);
        renderer.render(scene, camera);
    }
    
    initThree();

    window.addEventListener('touchmove', onTouchMove, { passive: false });

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
    }, { rootMargin: '0px 0px 200px 0px' }); // ビューポートから200px手前で読み込み開始

    spotifyIframes.forEach(iframe => {
        spotifyObserver.observe(iframe);
    });
        // --- Ryuya Title Animation ---
    const ryuyaTitle = document.querySelector('.section-title.ryuya-animate');
    if (ryuyaTitle) {
        const text = ryuyaTitle.textContent;
        ryuyaTitle.textContent = ''; // 元のテキストをクリア

        // 各文字をspanで囲み、DOMに追加
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('ryuya-char');
            span.style.setProperty('--char-index', index);
            ryuyaTitle.appendChild(span);
        });

        // アニメーションを適用
        setTimeout(() => {
            ryuyaTitle.classList.add('ryuya-animate');
        }, 500); // ページのロードから少し遅れて開始
    }
}

// Make the function globally accessible
initializeSiteFeatures();
