import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from 'cannon-es';

/**
 * 물리엔진 적용 - cannon.js 기본
 * http://schteppe.github.io/cannon.js/docs/
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

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 15);
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Physics
  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0); // 마이너스 해야 떨어짐

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  world.addBody(floorBody);

  const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  const boxBody = new CANNON.Body({
    mass: 0.1,
    position: new CANNON.Vec3(0, 15, 0),
    shape: boxShape,
  });
  boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 2, 0), Math.PI / 4);
  world.addBody(boxBody);

  // Mesh
  const gltfLoader = new GLTFLoader();
  let diceMesh: THREE.Object3D<THREE.Event>;
  gltfLoader.load('/assets/model/dice.glb', (gltf) => {
    diceMesh = gltf.scene.children[0];
    scene.add(diceMesh);
    draw();
  });

  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 'green' }),
  );
  floorMesh.rotateX(-Math.PI / 2);
  scene.add(floorMesh);

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 화면 주사율(delta)에 따라 대응
    world.step(cannonStepTime, delta, 3); // 갱신 시간 간격, timeSinceLastCalled(성능 보정용), 간격 메우는 시도 최대 몇 번 할 건지

    diceMesh.position.copy(boxBody.position as any); // 위치 똑같이 적용
    diceMesh.quaternion.copy(boxBody.quaternion as any); // 회전 똑같이 적용

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
}
