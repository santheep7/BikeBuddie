import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBikeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff7043, 2, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Create multiple bikes/particles
    const bikes = [];
    const bikeGeometry = new THREE.Group();

    // Simple bike shape using basic geometries
    const createBike = () => {
      const bike = new THREE.Group();

      // Wheels
      const wheelGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
      const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      frontWheel.rotation.y = Math.PI / 2;
      frontWheel.position.set(0.8, 0, 0);
      
      const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      backWheel.rotation.y = Math.PI / 2;
      backWheel.position.set(-0.8, 0, 0);

      // Frame
      const frameGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
      const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff7043,
        metalness: 0.6,
        roughness: 0.3
      });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(0, 0.3, 0);

      // Seat
      const seatGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.3);
      const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.7
      });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(-0.3, 0.5, 0);

      // Handlebar
      const handlebarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
      const handlebarMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        metalness: 0.9,
        roughness: 0.1
      });
      const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
      handlebar.rotation.z = Math.PI / 2;
      handlebar.position.set(0.8, 0.6, 0);

      bike.add(frontWheel, backWheel, frame, seat, handlebar);
      return bike;
    };

    // Create multiple floating bikes
    for (let i = 0; i < 5; i++) {
      const bike = createBike();
      bike.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      );
      bike.rotation.y = Math.random() * Math.PI * 2;
      bike.scale.set(0.5, 0.5, 0.5);
      bikes.push(bike);
      scene.add(bike);
    }

    // Particle system for trail effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xff7043,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 10;
    camera.position.y = 2;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate and move bikes
      bikes.forEach((bike, index) => {
        bike.rotation.y += 0.01;
        bike.rotation.x += 0.005;
        
        // Float animation
        bike.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        
        // Move bikes in circle
        const angle = Date.now() * 0.0005 + index * (Math.PI * 2 / bikes.length);
        bike.position.x = Math.cos(angle) * 8;
        bike.position.z = Math.sin(angle) * 8;
      });

      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Camera follows mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2 + 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Animate point light
      pointLight.position.x = Math.sin(Date.now() * 0.001) * 5;
      pointLight.position.z = Math.cos(Date.now() * 0.001) * 5;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBikeScene;
