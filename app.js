document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    window.addEventListener('mousemove', e => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    document.querySelectorAll('a, button, .profile-card, .spotify-embed, .note-card').forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
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
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
            
            void main() {
                vec2 scaledUv = vUv * 4.0;
                float n = noise(scaledUv + u_time * 0.1);
                
                vec2 mouseEffect = u_mouse * 2.0;
                float n2 = noise(scaledUv + mouseEffect);

                float baseColor = smoothstep(0.4, 0.6, n + n2 * 0.5);
                
                vec3 color1 = vec3(0.53, 0.17, 0.89); // Purple
                vec3 color2 = vec3(0.0, 0.75, 1.0); // Deep Sky Blue
                
                vec3 mixedColor = mix(color1, color2, vUv.y + sin(u_time*0.2)*0.2);
                
                gl_FragColor = vec4(mixedColor * baseColor, 1.0);
            }
        `;

        material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) }
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
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        material.uniforms.u_time.value = clock.getElapsedTime();
        material.uniforms.u_mouse.value.lerp(mouse, 0.05);
        renderer.render(scene, camera);
    }
    
    initThree();
});