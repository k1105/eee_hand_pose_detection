import React from "react";
import "./styles.css";
import "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { Hand } from "./Hand";

export default function App() {
  const webcamRef = React.useRef(null);
  const modelRef = React.useRef(null);
  const requestRef = React.useRef(null);
  const predictionsRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  const capture = React.useCallback(async () => {
    if (webcamRef.current && modelRef.current) {
      const predictions = await modelRef.current.estimateHands(
        webcamRef.current.getCanvas()
      );

      if (predictions) {
        predictionsRef.current = predictions;
      }
    }

    if (ready) {
      requestRef.current = requestAnimationFrame(capture);
    } else {
      requestRef.current = null;
    }
  }, [ready]);

  React.useEffect(() => {
    const load = async () => {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "tfjs",
        modelType: "full",
      };
      modelRef.current = await handPoseDetection.createDetector(
        model,
        detectorConfig
      );
    };

    load();
  }, []);

  React.useEffect(() => {
    if (ready) {
      requestRef.current = requestAnimationFrame(capture);
    } else {
      if (requestRef.current) {
        console.log("cancel");
        cancelAnimationFrame(requestRef.current);
      }
    }
  }, [ready]);

  return (
    <>
      <Canvas shadowmap="true" srgb="true" camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.4} />
        <spotLight
          position={[3, 0, 11]}
          angle={0.6}
          penumbra={1}
          intensity={0.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <mesh position={[0, 0, -10]} receiveShadow castShadow>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#00010a" />
        </mesh>
        {ready && <Hand predictionsRef={predictionsRef} />}
      </Canvas>
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 10,
        }}
      >
        <Webcam
          width="200"
          height="113"
          mirrored
          id="webcam"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      </div>
      <div
        style={{
          backgroundColor: "rgba(23,32,23,0.3)",
          position: "absolute",
          color: "white",
          display: "flex",
          cursor: "pointer",
          top: 10,
          left: 10,
        }}
      >
        <button
          onClick={() => {
            setReady(!ready);
          }}
        >
          Start hand tracking{" "}
          <span role="img" aria-label="Start">
            🖐
          </span>
        </button>
      </div>
    </>
  );
}
