import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 텍스쳐 이미지 로드하기 (https://3dtextures.me/)
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // 텍스쳐 이미지 로드하기
  // const textureLoader = new THREE.TextureLoader();
  // const texture = textureLoader.load('/assets/texture/plastic-roughness.jpg');
  // const texture = textureLoader.load(
  //   '/assets/texture/plastic-roughness.jpg',
  //   () => {
  //     console.log('로드 완료');
  //   },
  //   () => {
  //     console.log('로드 중');
  //   },
  //   () => {
  //     console.log('로드 에러');
  //   },
  // );

  // LoadingManager로 텍스쳐 이미지 여러개 로드하기
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log('로드 시작');
  };
  loadingManager.onProgress = (img) => {
    console.log(img + ' 로드');
  };
  loadingManager.onLoad = () => {
    console.log('로드 완료');
    draw();
  };
  loadingManager.onError = () => {
    console.log('에러');
  };

  const textureLoader = new THREE.TextureLoader(loadingManager); // TextureLoader의 매개변수로 넣어준다
  const wrapTex = textureLoader.load('/assets/texture/plastic-wrap.jpg');
  const roughnessTex = textureLoader.load('/assets/texture/plastic-roughness.jpg');

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
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: wrapTex,
  });
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
