import * as THREE from 'three';
import dat from 'dat.gui';

/**
 * 그룹 만들기(Scene graph)
 * @param canvas
 * @returns
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(2); // size parameter
  scene.add(axesHelper);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);
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

  const group1 = new THREE.Group(); // 태양
  const box1 = new THREE.Mesh(geometry, material);

  const group2 = new THREE.Group(); // 지구
  // const box2 = new THREE.Mesh(geometry, material);
  const box2 = box1.clone(); // Mesh 복제해서 만들기
  box2.scale.set(0.3, 0.3, 0.3);
  group2.position.x = 2;

  // const group3 = new THREE.Object3D();
  const group3 = new THREE.Group(); // 달
  const box3 = box2.clone();
  box3.scale.set(0.15, 0.15, 0.15);
  box3.position.x = 0.5;

  group3.add(box3);
  group2.add(box2, group3);
  group1.add(box1, group2);
  scene.add(group1);

  camera.lookAt(0, 0, 0);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
  gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
  gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    group1.rotation.y += delta;
    group2.rotation.y += delta;
    group3.rotation.y += delta;

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
