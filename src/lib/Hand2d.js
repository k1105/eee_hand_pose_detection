import React from "react";
import "@tensorflow/tfjs";
import { useFrame } from "@react-three/fiber";
const scale = (point) => -(point * 800) / 50;

export const Hand2d = ({ predictionsRef }) => {
  const palm = React.useRef();

  useFrame(() => {
    if (predictionsRef.current.length) {
      const point = predictionsRef.current[0].keypoints3D[0];
      palm.current.position.x = -scale(point.x);
      palm.current.position.y = scale(point.y);
      palm.current.position.z = scale(point.z);
    }
  });

  return <></>;
};
