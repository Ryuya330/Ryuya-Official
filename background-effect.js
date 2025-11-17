if (window.THREE) {
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        // Basic setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Subtle particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const posArray = new Float32Array(particleCount * 3);

        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 30;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x8a2be2,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        // ========== DRAGON MATERIALS ==========
        const dragonMaterial = new THREE.MeshStandardMaterial({
            color: 0x334488,
            metalness: 0.8,
            roughness: 0.4,
            emissive: 0x112244,
        });

        // ========== DRAGON HEAD ==========
        const head = new THREE.Group();
        const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), dragonMaterial);
        head.add(headBase);

        const snout = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 1.5), dragonMaterial);
        snout.position.set(0, -0.2, -1);
        head.add(snout);

        const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.2), dragonMaterial);
        jaw.position.set(0, -0.6, -0.8);
        head.add(jaw);

        // Horns
        const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.5, 8), dragonMaterial);
        horn1.position.set(0.6, 0.8, 0);
        horn1.rotation.set(0, 0, -Math.PI / 6);
        head.add(horn1);

        const horn2 = horn1.clone();
        horn2.position.x = -0.6;
        horn2.rotation.z = Math.PI / 6;
        head.add(horn2);
        
        const horn3 = new THREE.Mesh(new THREE.ConeGeometry(0.1, 1, 8), dragonMaterial);
        horn3.position.set(0.4, 0.5, -0.8);
        horn3.rotation.set(Math.PI / 4, 0, -Math.PI / 8);
        head.add(horn3);

        const horn4 = horn3.clone();
        horn4.position.x = -0.4;
        horn4.rotation.z = Math.PI / 8;
        head.add(horn4);


        // Eyes
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, emissive: 0xffaa00 });
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eyeMaterial);
        eyeL.position.set(0.5, 0.2, -0.6);
        head.add(eyeL);
        const eyeR = eyeL.clone();
        eyeR.position.x = -0.5;
        head.add(eyeR);

        scene.add(head);

        // ========== DRAGON BODY ==========
        const numBodySegments = 150;
        const curvePoints = [];
        for (let i = 0; i < numBodySegments; i++) {
            curvePoints.push(new THREE.Vector3());
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const bodyGeometry = new THREE.TubeGeometry(curve, numBodySegments, 0.5, 12, false);
        const dragonBody = new THREE.Mesh(bodyGeometry, dragonMaterial);
        scene.add(dragonBody);

        // ========== DRAGON SPIKES ==========
        const spikeGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
        const spikeCount = 50;
        const spikes = new THREE.InstancedMesh(spikeGeometry, dragonMaterial, spikeCount);
        scene.add(spikes);
        const dummy = new THREE.Object3D(); // Used to position instances

        // ========== STARFIELD ==========
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(new THREE.PointsMaterial({ color: 0x888888, size: 0.1 }));
        stars.geometry = starGeometry;
        scene.add(stars);

        // ========== ANIMATION ==========
        camera.position.set(0, -5, 15); // Lower camera angle
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005; // Slower movement

            // Update curve points for body animation
            const pathAmplitude = 4;
            const pathFrequency = 0.1;
            const pathSpeed = time * 2;

            for (let i = 0; i < numBodySegments; i++) {
                const segmentTime = pathSpeed + i * pathFrequency;
                curve.points[i].set(
                    Math.sin(segmentTime) * pathAmplitude,
                    Math.cos(segmentTime * 0.8) * pathAmplitude * 0.5, // Different frequency for y
                    -i * 0.8 // Stretch out the body
                );
            }
            
            // Update body geometry
            const newBodyGeometry = new THREE.TubeGeometry(curve, numBodySegments, 0.5, 12, false);
            dragonBody.geometry.dispose();
            dragonBody.geometry = newBodyGeometry;

            // Update head position and rotation
            const headPos = curve.getPoint(0);
            const nextPos = curve.getPoint(0.01);
            head.position.copy(headPos);
            head.lookAt(nextPos);
            
            // Update spikes
            for (let i = 0; i < spikeCount; i++) {
                const pointIndex = Math.floor(i * (numBodySegments / spikeCount));
                const pos = curve.getPointAt(i / spikeCount);
                const tangent = curve.getTangentAt(i / spikeCount);
                const up = new THREE.Vector3(0, 1, 0);
                const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
                
                dummy.position.copy(pos);
                dummy.position.y += 0.5; // Place on top of the body
                dummy.quaternion.setFromUnitVectors(up, tangent);
                dummy.updateMatrix();
                spikes.setMatrixAt(i, dummy.matrix);
            }
            spikes.instanceMatrix.needsUpdate = true;


            // Update light
            pointLight.position.copy(head.position);
            pointLight.position.y += 2;

            // Update camera
            camera.lookAt(head.position);
            camera.position.z = 15 + Math.sin(time * 1.5) * 5;

            renderer.render(scene, camera);
        }

        // ========== RESIZE HANDLER ==========
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    }
}