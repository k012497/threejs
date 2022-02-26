import * as THREE from 'three';

// 안개(Fog)
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  // 안개설정 on scene
  scene.fog = new THREE.Fog('black', 5, 7); // 색상, near, far

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.z = 10;
  scene.add(light);

  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  let mesh: THREE.Object3D;
  const meshes: Array<THREE.Object3D> = [];
  for (let i = 0; i < 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5; // 랜덤 & 가운데로 조절
    mesh.position.z = Math.random() * 5 - 2.5; // 랜덤 & 가운데로 조절
    scene.add(mesh);
    meshes.push(mesh);
  }

  function draw() {
    renderer.render(scene, camera);

    meshes.forEach((mesh) => (mesh.rotation.y += 0.01));

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
