import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Geometry 기본, 정점(Vertex)에 접근해서 위치를 이용
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
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight('white', 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('white', 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // 카메라를 마우스로 조작 가능

  // Mesh
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); // segment 나누기 (https://threejs.org/docs/?q=geom#api/en/geometries/BoxGeometry)
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 'hotpink',
    side: THREE.DoubleSide, // 어느 쪽 면을 렌더할 지 앞/뒤/양면
    wireframe: true,
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(boxMesh);

  // 정점(Vertex)을 이용할 구 생성
  const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
  // const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'orangered',
    side: THREE.DoubleSide,
    flatShading: true, // 구 표면의 면이 각진 것이 드러나도록
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  // console.log(sphereGeometry.attributes.position.array); // [x, y, z, x, y, z, ...]
  const positionArray: Float32Array = sphereGeometry.attributes.position.array as Float32Array;
  const randomArray: Array<number> = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    // 찌그러진 모양을 만들기 위해 정점(Vertex) 한 개의 x, y, z 좌표를 랜덤으로 조정
    positionArray[i] += (Math.random() - 0.5) * 0.2; // 양음수 골고루 나오기 위해서 0.5 빼줌, 범위 제한하려고 0.2배로 줄임
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    for (let i = 0; i < positionArray.length; i += 3) {
      // 값(y)이 일정한 범위 내에서 늘어났다 줄었다를 반복하는 sin 함수 이용하여 애니메이션
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.01; // 점점 늘어나는 각도(x)를 위해 time 이용
      positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.01;
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.01;
    }

    sphereGeometry.attributes.position.needsUpdate = true;

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
