import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Light 애니메이션
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  // AmbientLight: 입체적이지 않은 전체적으로 은은한 조명. 위치가 의미 없고 단독으로는 잘 안 씀
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  // DirectionalLight: 태양광 같은 ..
  const light = new THREE.DirectionalLight('red', 0.5);
  scene.add(light);

  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // 그림자 설정
  light.castShadow = true;
  light.shadow.mapSize.width = 1024; // 기본값 512
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 30;
  // light.shadow.radius = 15; // 기본값인 THREE.PCFShadowMap에서만 적용

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: 'white' });
  const material2 = new THREE.MeshStandardMaterial({ color: 'royalblue' });
  const material3 = new THREE.MeshStandardMaterial({ color: 'gold' });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  plane.rotation.x = -Math.PI * 0.5;
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  scene.add(plane, box, sphere); // 따로따로 추가 안 하고 한꺼번에 추가 가능!

  renderer.render(scene, camera);

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    // 시간에 따라 각도가 늘어나면 원을 그리게 됨
    light.position.x = Math.cos(time); // 밑변 1일 때 x
    light.position.z = Math.sin(time); //밑변 1일 때 y

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

  draw();
}
