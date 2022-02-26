import * as THREE from 'three';

export function init(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  /**
   * Renderer 생성
   */
  // 1) 미리 만들어둔 canvas 요소를 전달해 생성하는 방법. WebGLRenderer 생성자 인자로 전달한다.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); //antialias : 선을 부드럽게 하는 작업
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2) 옵션 없이 만들어진 Renderer는 domElement속성에 canvas 요소를 갖는다. 이 canvas를 직접 원하는 곳에 붙여주는 방법
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  /**
   * Scene 생성
   */
  const scene = new THREE.Scene();

  /**
   * Camera 생성
   */
  // 1) Perspective Camera(원근 카메라) : 사람의 눈으로 보는 방식
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각(field of view)
    window.innerWidth / window.innerHeight, // 종횡비(aspect) : 화면 너비 / 화면 높이
    0.1, // near : 어느 정도 가까우면 안 보일지
    1000, // far : 어느 정도 멀면 안 보일지
  );

  // 위치 설정 안 하면 기본값 (0, 0, 0)
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  // 2) Orthographic Camera(직교 카메라) : 객체의 크기가 카메라와의 거리에 관계없이 일정
  // const camera = new THREE.OrthographicCamera(
  // 	-(window.innerWidth / window.innerHeight), // left
  // 	window.innerWidth / window.innerHeight, // right,
  // 	1, // top
  // 	-1, // bottom
  // 	0.1, // near
  // 	1000 // far
  // );
  // camera.position.x = 1;
  // camera.position.y = 2;
  // camera.position.z = 5;
  // camera.lookAt(0, 0, 0); // 해당 포지션을 바라보게 설정
  // camera.zoom = 0.5; // 기본값 1
  // camera.updateProjectionMatrix(); // 설정 후 업데이트 해줘야 함
  // scene.add(camera);

  /**
   * Mesh 생성
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1); //  직육면체
  const material = new THREE.MeshBasicMaterial({
    color: 'red', //0xff0000, '#ff0000', ...
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /**
   * 설정이 끝나고 그려주기
   */
  renderer.render(scene, camera);
}
