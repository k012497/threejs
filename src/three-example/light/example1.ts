import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

/**
 * Light 기본 사용법
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
