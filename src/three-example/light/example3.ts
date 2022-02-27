import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

/**
 * 그림자 처리하기 (조명, 물체, 장면)
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 그림자 설정
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값
  // renderer.shadowMap.type = THREE.BasicShadowMap; // 성능 구웃. antialiasing 사라지면서 거친 느낌
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 좀 더 부드러움

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const light = new THREE.PointLight('white', 1, 100, 2);
  light.position.x = -5;
  light.position.y = 3;
  scene.add(light);

  const lightHelper = new THREE.PointLightHelper(light);
  scene.add(lightHelper);

  // 그림자 설정
  light.castShadow = true;
  light.shadow.mapSize.width = 1024; // 그림자 해상도 설정, 기본값 512
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 1; // 범위 제한
  light.shadow.camera.far = 30;
  // light.shadow.radius = 15; // 그림자 가장자리를 부드럽게, 기본값인 THREE.PCFShadowMap에서만 적용

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

  // 그림자 설정
  // 1) castShadow : 다른 물체에 그림자가 생기게 영향을 줄건지
  // 2) receiveShadow : 다른 물체에 영향을 받아서 나한테 그림자가 그려지게 할 건지
  plane.receiveShadow = true; // 서로 영향을 줄 거리면 설정해주는 게 좋다. plane은 이미 바닥이라 그림자 영향줄 거 없으니까 캐스트필요없음
  box.castShadow = true;
  // box.receiveShadow = true;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  plane.rotation.x = -Math.PI * 0.5;
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  scene.add(plane, box, sphere); // 따로따로 추가 안 하고 한꺼번에 추가 가능!

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, 'x', -5, 5).name('ligth x');
  gui.add(light.position, 'y', -5, 5).name('ligth y');
  gui.add(light.position, 'z', -5, 5).name('ligth z');

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

  draw();
}
