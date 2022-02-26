import * as THREE from 'three';

// 브라우저 창 사이즈 조절 대응
export function initThreejs(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // devicePixelRatio은 장치의 물리적 픽셀과 CSS 픽셀의 비율 (CSS 픽셀의 크기 / 물리적 픽셀의 크기)
  // 같은 객체를 그릴 때 더 많은 픽셀을 사용해 보다 선명한 이미지를 표현하는 화면을 대응하기 위함
  // 예를 들어 Retina 디스플레이는 픽셀 2배의 이미지를 이용하여 고해상도 이미지를 표현한다.
  // 이 설정을 해주면 canvas width/height가 조정된다. 2면 2배로 설정됨!
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

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
