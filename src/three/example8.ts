import * as THREE from 'three';
import gsap from 'gsap';

// 라이브러리 이용 애니메이션 GreenSock aka GSAP
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('black', 5, 7);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.z = 10;
  scene.add(light);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  let mesh: THREE.Object3D = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function draw() {
    renderer.render(scene, camera);

    renderer.setAnimationLoop(draw);
  }

  function animateMesh() {
    gsap.to(mesh.position, {
      duration: 1,
      y: 1,
      z: 3,
    }); // 변화를 줄 객체, 변화 내용

    gsap.to(mesh.rotation, {
      duration: 1,
      y: 3,
      z: 3,
    });
  }

  function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resizeCanvas);

  draw();
  animateMesh();
}
