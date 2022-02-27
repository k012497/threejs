import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 텍스쳐 변환
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // Texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    '/assets/texture/plastic-wrap.jpg',
    () => {
      console.log('로드 완료');
      draw();
    },
    () => {
      console.log('로드중');
    },
    () => {
      console.log('로드 에러');
    },
  );

  // texture offset
  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  // texture repeat
  texture.repeat.x = 2;
  texture.repeat.y = 2;

  // texture rotation
  texture.rotation = Math.PI * 0.25;
  texture.rotation = THREE.MathUtils.degToRad(60);

  // texture rotation
  texture.center.x = 0.5;
  texture.center.y = 0.5;

  // 이렇게 위치를 옮기거나 반복 시키고 나면 모자라는 부분의 픽셀이 늘어지게 보인다.
  // 해당 부분에 텍스쳐가 계속 이어지도록 설정하려면
  texture.wrapS = THREE.RepeatWrapping; // 수평 방향 텍스쳐 반복
  texture.wrapT = THREE.RepeatWrapping; // 수직 방향 텍스쳐 반복

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
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
