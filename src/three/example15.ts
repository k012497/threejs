import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

/**
 * 카메라 컨트롤 - OrbitControls, TrackballControls
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
  // 1. OrbitControls
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true; // 움직임을 부드럽게
  // controls.enableZoom = false;
  // controls.maxDistance = 10;
  // controls.minDistance = 3;
  // controls.minPolarAngle = Math.PI / 4; // 내려다 볼 각도 제한 45도
  // controls.minPolarAngle = THREE.MathUtils.degToRad(45);
  // controls.maxPolarAngle = THREE.MathUtils.degToRad(135);
  // controls.target.set(2, 2, 2); // 회전 중심점 좌표
  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 50;

  // 2. TrackballControls
  // 360도 회전 가능, 기본으로 enableDamping 설정됨, update 안 해주면 안 됨
  // const controls = new TrackballControls(camera, renderer.domElement);
  // controls.maxDistance = 20;
  // controls.minDistance = 5;
  // controls.target.set(3, 3, 3);

  // 3. FlyControls
  // 키보드 wasd로 방향키처럼 조작, 좌클릭 앞으로 우클릭 뒤로, r위로 f아래로, q시계 e 반시계방향 회전 가능
  // const controls = new FlyControls(camera, renderer.domElement);
  // controls.rollSpeed = 0.1; // 마우스 따라가는 속도
  // controls.movementSpeed = 3; // 앞뒤좌우 움직임 속도
  // controls.dragToLook = true; // 마우스에 반응하지 않고 드래그에만 반응

  // 4. FirstPersonControls
  // FlyControls의 기능을 수정한 대체 버전
  const controls = new FirstPersonControls(camera, renderer.domElement);
  // controls.movementSpeed = 10;
  // controls.activeLook = false;
  controls.lookSpeed = 0.1; // FlyControls의 rollSpeed
  controls.autoForward = true;

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      // 색상 랜덤. 배경 검은색이니까 50 ~ 255 사이
      color: `rgb(
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)}
			)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5; // -2.5 ~ 2.5 랜덤
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    scene.add(mesh);
  }

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    controls.update(delta); // FlyControls는 delta 인자 필요 - 마우스 위치를 따라 회전

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
