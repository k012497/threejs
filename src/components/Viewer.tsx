import React, { useRef, useEffect } from 'react';
import {
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BoxGeometry, 
  MeshBasicMaterial, 
  Mesh
} from 'three';

export function Viewer () {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 1, 1000);

    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);

    if(element.current) {
      element.current.appendChild(renderer.domElement);

      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshBasicMaterial({ color: 0xffff00 });
      const cube = new Mesh(geometry, material);
      scene.add(cube);
  
      camera.position.z = 5; // 카메라도 처음에 (0,0,0)에 추가되므로 카메라와 박스가 겹친 상태, 이동 필요 !

      const animate = () => {
        renderer.render(scene, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        requestAnimationFrame(animate);
      }

      animate();
    }

  }, [])

  return <div ref={element} />
}

export default Viewer;