import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * MeshBasicMaterial
 * @param canvas
 */
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('blue');

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // MeshBasicMaterial은 빛과 그림자에 영향을 받지 않아서 조명이 필요 없으며 성능이 빠르다.

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // CanvasTexture
  const texCanvas = document.createElement('canvas');
  const texContext = texCanvas.getContext('2d');
  texCanvas.width = 500;
  texCanvas.height = 500;
  const canvasTexture = new THREE.CanvasTexture(texCanvas);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture, // 각 면이 canvas로 이루어짐
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    if (texContext) {
      texContext.fillStyle = 'green';
      texContext.fillRect(0, 0, 500, 500);
      texContext.fillStyle = 'white';
      texContext.fillRect(time * 50, 100, 50, 50); // 시간이 흐르면서 x축 따라 이동
      texContext.font = 'bold 50px sans-serif';
      texContext.fillText('오잉?', 200, 200);
    }

    if (material.map) {
      material.map.needsUpdate = true;
    }

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
