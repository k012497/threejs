import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * MeshStandardMaterial에 효과 더하기
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
  const roughnessTex = textureLoader.load('/assets/texture/plastic-roughness.jpg');
  const wrapTex = textureLoader.load('/assets/texture/plastic-wrap.jpg');

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
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({
    map: wrapTex,
    normalMap: roughnessTex, // 튀어나온 곳과 움푹 틀어간 곳의 빛을 왜곡
    metalness: 0.5,
    roughness: 0.3,
    // aoMap : 그림자를 어둑어둑하게. aoMapIntensity로 조절 가능
  }); // 동그란 이미지 + 입체감인 이미지를 우리가 만든 메시에 적용
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
