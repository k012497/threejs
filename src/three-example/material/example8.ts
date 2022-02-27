import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

/**
 * MeshToonMaterial (만화 느낌)
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
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 10;

  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 128);
  // 만화처럼 면이 딱 떨어지는 느낌
  const material = new THREE.MeshToonMaterial({
    color: 'plum',
    gradientMap: gradientTex, // 그라디언트 적용
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  function draw() {
    controls.update();
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
