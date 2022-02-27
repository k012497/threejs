import * as THREE from 'three';
import dat from 'dat.gui';

/**
 * GUI로 컨트롤(dat.gui)
 * @param canvas
 * @returns
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('black', 5, 7);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  let mesh: THREE.Object3D = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(mesh.position, 'y', -5, 5, 0.01).name('큐브 Y'); // 변화를 줄 객체와 프로퍼티
  gui.add(camera.position, 'x', -10, 10, 0.01).name('카메라 X');
  // gui
  // 	.add(mesh.position, 'z')
  // 	.min(-10) // 변화 범위
  // 	.max(3)
  // 	.step(0.01)
  // 	.name('메쉬의 Z 위치');

  camera.lookAt(mesh.position);

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();
    mesh.rotation.y = time;

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
