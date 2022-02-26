import * as THREE from 'three';

// 배경의 색, 투명도 설정
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // alpha : 배경 투명
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  // renderer.setClearAlpha(0.5); // 투명도 0-1 조절
  // renderer.setClearColor(0x00ff00); // 배경 색상 조절
  // renderer.setClearColor('#00ff00');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('blue'); // Renderer보다 Scene background에 우선 순위

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 'red',
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  function resizeCanvas() {
    // 카메라
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 카메라 투영에 관련된 값에 변화가 있을 경우 실행
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resizeCanvas);
}
