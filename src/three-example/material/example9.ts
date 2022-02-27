import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * MeshNormalMaterial
 * Normal: 법선(면에 수직으로 뻗어 나가는 선)
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // Texture
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = () => {
    draw();
  };
  loadingManager.onError = () => {
    console.error('failed to load image');
  };
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const gradientTex = textureLoader.load('/assets/texture/gradient.png');
  gradientTex.magFilter = THREE.NearestFilter;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshNormalMaterial(); // 법선 방향에 따른 rgb 설정을 해줌
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  function draw() {
    renderer.setAnimationLoop(draw);
    renderer.render(scene, camera);
  }

  function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resizeCanvas);
}
