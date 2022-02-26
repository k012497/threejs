import React, { useEffect, createRef } from 'react';

import { initThreejs } from '../three/main';

export function Viewer() {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    initThreejs(canvasRef.current);
  });

  return <canvas id="my-canvas" ref={canvasRef} />;
}

export default Viewer;
