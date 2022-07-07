import { useCallback, useRef, useState, useEffect } from "react";
import "./styles.css";
import "@tensorflow/tfjs";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { Hand } from "./Hand";

export default function App() {
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const requestRef = useRef(null);
  const predictionsRef = useRef(null);
  const [ready, setReady] = useState(false);

  let handpose = [
    {
      length: 0,
      thumb: [[], [], [], []],
      indexFinger: [[], [], [], []],
      palmBase: [[]],
      middleFinger: [[], [], [], []],
      ringFinger: [[], [], [], []],
      pinky: [[], [], [], []],
    },
  ];

  const capture = useCallback(async () => {
    if (webcamRef.current && modelRef.current) {
      const predictions = await modelRef.current.estimateHands(
        webcamRef.current.getCanvas()
      );

      if (predictions) {
        predictionsRef.current = predictions;

        if (predictions.length) {
          handpose[0].thumb[0].push({
            x: predictions[0].keypoints[1].x,
            y: predictions[0].keypoints[1].y,
          });
          handpose[0].thumb[1].push({
            x: predictions[0].keypoints[2].x,
            y: predictions[0].keypoints[2].y,
          });
          handpose[0].thumb[2].push({
            x: predictions[0].keypoints[3].x,
            y: predictions[0].keypoints[3].y,
          });
          handpose[0].thumb[3].push({
            x: predictions[0].keypoints[4].x,
            y: predictions[0].keypoints[4].y,
          });
          handpose[0].indexFinger[0].push({
            x: predictions[0].keypoints[5].x,
            y: predictions[0].keypoints[5].y,
          });
          handpose[0].indexFinger[1].push({
            x: predictions[0].keypoints[6].x,
            y: predictions[0].keypoints[6].y,
          });
          handpose[0].indexFinger[2].push({
            x: predictions[0].keypoints[7].x,
            y: predictions[0].keypoints[7].y,
          });
          handpose[0].indexFinger[3].push({
            x: predictions[0].keypoints[8].x,
            y: predictions[0].keypoints[8].y,
          });
          handpose[0].palmBase[0].push({
            x: predictions[0].keypoints[0].x,
            y: predictions[0].keypoints[0].y,
          });
          handpose[0].middleFinger[0].push({
            x: predictions[0].keypoints[9].x,
            y: predictions[0].keypoints[9].y,
          });
          handpose[0].middleFinger[1].push({
            x: predictions[0].keypoints[10].x,
            y: predictions[0].keypoints[10].y,
          });
          handpose[0].middleFinger[2].push({
            x: predictions[0].keypoints[11].x,
            y: predictions[0].keypoints[11].y,
          });
          handpose[0].middleFinger[3].push({
            x: predictions[0].keypoints[12].x,
            y: predictions[0].keypoints[12].y,
          });

          handpose[0].ringFinger[0].push({
            x: predictions[0].keypoints[13].x,
            y: predictions[0].keypoints[13].y,
          });
          handpose[0].ringFinger[1].push({
            x: predictions[0].keypoints[14].x,
            y: predictions[0].keypoints[14].y,
          });
          handpose[0].ringFinger[2].push({
            x: predictions[0].keypoints[15].x,
            y: predictions[0].keypoints[15].y,
          });
          handpose[0].ringFinger[3].push({
            x: predictions[0].keypoints[16].x,
            y: predictions[0].keypoints[16].y,
          });
          handpose[0].pinky[0].push({
            x: predictions[0].keypoints[17].x,
            y: predictions[0].keypoints[17].y,
          });
          handpose[0].pinky[1].push({
            x: predictions[0].keypoints[18].x,
            y: predictions[0].keypoints[18].y,
          });
          handpose[0].pinky[2].push({
            x: predictions[0].keypoints[19].x,
            y: predictions[0].keypoints[19].y,
          });
          handpose[0].pinky[3].push({
            x: predictions[0].keypoints[20].x,
            y: predictions[0].keypoints[20].y,
          });
          handpose[0].length++;
        }
      }
    }

    // ready stateが更新されてもなお同じreadyの値がよばれ続けてしまう
    if (ready) {
      requestRef.current = requestAnimationFrame(capture);
    } else {
      //not working
      requestRef.current = null;
    }
  }, [ready]);

  useEffect(() => {
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

  useEffect(() => {
    if (ready) {
      requestRef.current = requestAnimationFrame(capture);
    } else {
      if (requestRef.current) {
        console.log("cancel");
        cancelAnimationFrame(requestRef.current); //not working
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
        <button
          onClick={() => {
            const downloadLink = document.createElement("a");
            downloadLink.download = "export.json";
            downloadLink.href = URL.createObjectURL(
              new Blob([JSON.stringify(handpose[0])], {
                type: "application/json",
              })
            );
            downloadLink.setAttribute("hidden", true);

            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
          }}
        >
          download
        </button>
      </div>
    </>
  );
}
