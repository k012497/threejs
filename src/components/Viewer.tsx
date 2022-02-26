import React, { useEffect, createRef } from 'react';

import { init } from '../three/main';

export function Viewer() {
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    init(canvasRef.current);
  });

  return <canvas id="my-canvas" ref={canvasRef} />;
}

export default Viewer;
