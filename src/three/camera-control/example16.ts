import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { KeyController } from './KeyController';

/**
 * 카메라 컨트롤
 * PointerLockControls에 KeyController 추가해서 마인크래프트 같은 컨트롤 구현
 * @param canvas
 * @returns
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new PointerLockControls(camera, renderer.domElement);

  controls.domElement.addEventListener('click', () => {
    controls.lock();
  });
  controls.addEventListener('lock', () => {
    console.log('lock!');
  });
  controls.addEventListener('unlock', () => {
    console.log('unlock!');
  });

  const keyController = new KeyController();

  function walk() {
    if (keyController.keys['KeyW'] || keyController.keys['ArrowUp']) {
      controls.moveForward(0.02);
    }
    if (keyController.keys['KeyS'] || keyController.keys['ArrowDown']) {
      controls.moveForward(-0.02);
    }
    if (keyController.keys['KeyA'] || keyController.keys['ArrowLeft']) {
      controls.moveRight(-0.02);
    }
    if (keyController.keys['KeyD'] || keyController.keys['ArrowRight']) {
      controls.moveRight(0.02);
    }
  }

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)}
			)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    scene.add(mesh);
  }

  function draw() {
    walk();

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
