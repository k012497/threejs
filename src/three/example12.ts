import * as THREE from 'three';
import dat from 'dat.gui';

/**
 * 위치 이동(position), 크기 조정(scale), 회전(rotation)
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

  const axesHelper = new THREE.AxesHelper(2); // size parameter
  scene.add(axesHelper);

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
  gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
  gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
  gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

  camera.lookAt(mesh.position);

  const clock = new THREE.Clock();

  // Rotation
  // mesh.rotation.x = Math.PI / 2;
  mesh.rotation.reorder('YXZ'); // 회전축을 독립시켜서 바꿔줌
  mesh.rotation.z = THREE.MathUtils.degToRad(45);
  mesh.rotation.x = THREE.MathUtils.degToRad(20);

  function draw() {
    const time = clock.getElapsedTime();

    // Position
    // mesh.rotation.y = time;
    // mesh.position.set(-1, 2, -1); // x, y, z 포지션 한꺼번에 세팅하기
    // console.log(mesh.position.length()); // 원점으로부터의 벡터 길이
    // console.log(mesh.position.distanceTo(new THREE.Vector3(1, 2, 0))); // vactor3 = 3차원 공간에서의 위치
    // console.log(mesh.position.distanceTo(camera.position)); // Vector3 객체 아니어도 가능

    // Scale
    // mesh.scale.set(1, 1, 1); // 기본값은 1
    mesh.scale.x = 2;

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
