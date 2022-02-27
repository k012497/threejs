import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

/**
 * 여러 이미지 텍스쳐를 적용한 큐브
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
  const dice1 = textureLoader.load('/assets/texture/dice1.png');
  const dice2 = textureLoader.load('/assets/texture/dice2.png');
  const dice3 = textureLoader.load('/assets/texture/dice3.png');
  const dice4 = textureLoader.load('/assets/texture/dice4.png');
  const dice5 = textureLoader.load('/assets/texture/dice5.png');
  const dice6 = textureLoader.load('/assets/texture/dice6.png');

  // 각 텍스쳐를 사용한 material 배열을 만들어 Mesh에 적용
  const materials = [
    new THREE.MeshBasicMaterial({ map: dice5 }), // 우
    new THREE.MeshBasicMaterial({ map: dice2 }), // 좌
    new THREE.MeshBasicMaterial({ map: dice3 }), // 상
    new THREE.MeshBasicMaterial({ map: dice4 }), // 하
    new THREE.MeshBasicMaterial({ map: dice1 }), // 앞
    new THREE.MeshBasicMaterial({ map: dice6 }), // 뒤
  ];

  dice1.magFilter = THREE.NearestFilter; // 픽셀 작은 이미지 다룰 때, 색의 경계를 명확하게 픽셀 하나하나를 살려줌
  dice2.magFilter = THREE.NearestFilter;
  dice3.magFilter = THREE.NearestFilter;
  dice4.magFilter = THREE.NearestFilter;
  dice5.magFilter = THREE.NearestFilter;
  dice6.magFilter = THREE.NearestFilter;

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, materials);
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
