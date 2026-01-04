/**
 * Enhanced 3D Background with Advanced Effects
 * Optimized for High-Performance PCs
 */

class EnhancedBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('bg-canvas'),
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.particles = [];
        this.geometries = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Camera position
        this.camera.position.z = 50;
        
        // Create advanced particle system
        this.createAdvancedParticles();
        
        // Create flowing geometries
        this.createFlowingGeometries();
        
        // Add nebula effect
        this.createNebulaEffect();
        
        // Add lighting
        this.setupLighting();
        
        // Mouse tracking
        this.setupMouseTracking();
        
        // Window resize handler
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation
        this.animate();
    }
    
    createAdvancedParticles() {
        // Create multiple particle systems with different properties
        const particleConfigs = [
            { count: 2000, color: 0x7c4dff, size: 0.5, speed: 0.3 },
            { count: 1500, color: 0x00e0ff, size: 0.3, speed: 0.5 },
            { count: 1000, color: 0xff00ff, size: 0.7, speed: 0.2 },
        ];
        
        particleConfigs.forEach(config => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(config.count * 3);
            const velocities = new Float32Array(config.count * 3);
            
            for (let i = 0; i < config.count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 200;
                positions[i + 1] = (Math.random() - 0.5) * 200;
                positions[i + 2] = (Math.random() - 0.5) * 100;
                
                velocities[i] = (Math.random() - 0.5) * config.speed;
                velocities[i + 1] = (Math.random() - 0.5) * config.speed;
                velocities[i + 2] = (Math.random() - 0.5) * config.speed;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                color: config.color,
                size: config.size,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const particles = new THREE.Points(geometry, material);
            this.scene.add(particles);
            this.particles.push({ mesh: particles, velocities, speed: config.speed });
        });
    }
    
    createFlowingGeometries() {
        // Create animated geometric shapes
        const geometries = [
            new THREE.TorusGeometry(10, 1, 16, 100),
            new THREE.OctahedronGeometry(8, 0),
            new THREE.IcosahedronGeometry(6, 0)
        ];
        
        geometries.forEach((geometry, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: [0x7c4dff, 0x00e0ff, 0xff00ff][index],
                transparent: true,
                opacity: 0.15,
                wireframe: true,
                blending: THREE.AdditiveBlending
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                -30 - index * 20
            );
            
            this.scene.add(mesh);
            this.geometries.push({
                mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            });
        });
    }
    
    createNebulaEffect() {
        // Create large spheres with gradient material for nebula effect
        const nebulaGeometry = new THREE.SphereGeometry(30, 32, 32);
        const nebulaMaterial = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x7c4dff) },
                color2: { value: new THREE.Color(0x00e0ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float noise = sin(vPosition.x * 0.1 + time) * cos(vPosition.y * 0.1 + time);
                    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
                    float alpha = (1.0 - length(vUv - 0.5) * 2.0) * 0.2;
                    gl_FragColor = vec4(color, alpha);
                }
            `
        });
        
        for (let i = 0; i < 3; i++) {
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial.clone());
            nebula.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                -50 - i * 30
            );
            this.scene.add(nebula);
            this.geometries.push({
                mesh: nebula,
                rotationSpeed: { x: 0.001, y: 0.001, z: 0 },
                isnebula: true
            });
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);
        
        // Point lights with colors
        const lights = [
            { color: 0x7c4dff, position: [50, 50, 50], intensity: 2 },
            { color: 0x00e0ff, position: [-50, -50, 50], intensity: 2 },
            { color: 0xff00ff, position: [0, 50, -50], intensity: 1.5 }
        ];
        
        lights.forEach(light => {
            const pointLight = new THREE.PointLight(light.color, light.intensity);
            pointLight.position.set(...light.position);
            this.scene.add(pointLight);
        });
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particleSystem => {
            const positions = particleSystem.mesh.geometry.attributes.position.array;
            const velocities = particleSystem.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Update position with velocity
                positions[i] += velocities[i] * (1 + Math.sin(this.time * 0.001) * 0.5);
                positions[i + 1] += velocities[i + 1] * (1 + Math.cos(this.time * 0.001) * 0.5);
                positions[i + 2] += velocities[i + 2];
                
                // Wrap around
                if (Math.abs(positions[i]) > 100) positions[i] *= -0.9;
                if (Math.abs(positions[i + 1]) > 100) positions[i + 1] *= -0.9;
                if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -0.9;
                
                // Add mouse interaction
                const dx = positions[i] - this.mouseX * 50;
                const dy = positions[i + 1] - this.mouseY * 50;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) {
                    positions[i] += dx * 0.01;
                    positions[i + 1] += dy * 0.01;
                }
            }
            
            particleSystem.mesh.geometry.attributes.position.needsUpdate = true;
            particleSystem.mesh.rotation.y += 0.0002;
        });
    }
    
    updateGeometries() {
        this.geometries.forEach(geo => {
            geo.mesh.rotation.x += geo.rotationSpeed.x;
            geo.mesh.rotation.y += geo.rotationSpeed.y;
            geo.mesh.rotation.z += geo.rotationSpeed.z;
            
            // Floating motion
            if (!geo.floatOffset) geo.floatOffset = Math.random() * Math.PI * 2;
            geo.mesh.position.y += Math.sin(this.time * 0.001 + geo.floatOffset) * 0.02;
            
            // Update nebula shader
            if (geo.isnebula && geo.mesh.material.uniforms) {
                geo.mesh.material.uniforms.time.value = this.time * 0.001;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time++;
        
        // Smooth camera movement based on mouse
        this.targetX = this.mouseX * 5;
        this.targetY = this.mouseY * 5;
        
        this.camera.position.x += (this.targetX - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.targetY - this.camera.position.y) * 0.02;
        
        // Update particles and geometries
        this.updateParticles();
        this.updateGeometries();
        
        // Rotate entire scene slightly
        this.scene.rotation.y = Math.sin(this.time * 0.0001) * 0.05;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedBackground();
});
