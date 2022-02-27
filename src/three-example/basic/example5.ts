import * as THREE from 'three';

// 애니메이션 기본 + 성능 보정
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('blue');

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.z = 2;
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 'red',
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const clock = new THREE.Clock();

  // 그리기
  function draw() {
    // clock이 시작되었을 때부터 경과한 시간(초)를 반환
    // 기기마다 성능이 다를 수 있으므로 1초동안 실행되는 횟수는 차이나지만,
    // 1초라는 시간이 지났을 때 반환 값이 1인 것은 동일하므로 어떤 기기에서도 같은 속도를 줄 수 있다.
    const time = clock.getElapsedTime();

    // 각도는 Radian을 사용한다.(360° = 2π)
    mesh.position.y += 0.01;
    // mesh.rotation.y += 0.1;
    // mesh.rotation.y += THREE.MathUtils.degToRad(1); // THREE.MathUtils.degToRad를 사용하면 편리, 초당 60회 호출하면 1초에 60도
    mesh.rotation.y = 2 * time; // 변화를 줄 값에 시간을 이용
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // 인자로 받은 함수를 다음 repaint가 일어나기 전에 한 번 호출하도록 요청
    // 한 번 호출하지만, 지금은 콜백 함수 안에서 다시 requestAnimationFrame를 호출하므로 계속 반복되는 것
    // 초당 60프레임 또는 화면 주사율에 따라 호출됨
    // window.requestAnimationFrame(draw);

    // Threejs 내장 메서드(내부적으로 requestAnimationFrame 사용)
    // WebXR projects(AR/VR 만들 때)는 꼭 setAnimationLoop 사용하도록 함.
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
