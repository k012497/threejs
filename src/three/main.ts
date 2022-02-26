import * as THREE from 'three';

// 1. Renderer 생성

// 1) Renderer는 domElement속성에 canvas 요소를 갖는다. 이 canvas를 직접 원하는 곳에 붙여주는 방법
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// 2) 미리 만들어둔 canvas 요소를 이용해 생성하는 방법. WebGLRenderer 인자로 전달
const canvas = document.getElementById('my-canvas');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
}
