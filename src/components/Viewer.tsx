import React, { useRef, useEffect } from 'react';
import { load } from '../three/three';

export function Viewer () {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    load(canvas.current as HTMLElement);
  }, []);

  return <canvas ref={canvas} width={window.innerWidth} height={window.innerHeight}/>
}

export default Viewer;