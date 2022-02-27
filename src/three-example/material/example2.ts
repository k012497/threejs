import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * MeshLamberMaterial, MeshPhongMaterial
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('white');

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.set(1, 0, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  // MeshLambertMaterial 하이라이트, 반사광 없는 재질. 처리할 게 줄어들어 성능 좋앙
  const material1 = new THREE.MeshLambertMaterial({
    color: 'orange', // 각 면이 canvas로 이루어짐
  });
  // MeshPhongMaterial 하이라이트, 반사광 표현 가능
  const material2 = new THREE.MeshPhongMaterial({
    color: 'blue', // 각 면이 canvas로 이루어짐
    shininess: 1000, // 반사정도 조절 가능. 0이면 MeshLambertMaterial
    flatShading: true, // 각지게 표현
  });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -2;
  mesh2.position.x = 2;

  scene.add(mesh1);
  scene.add(mesh2);

  renderer.render(scene, camera);

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
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
