import { ReactP5Wrapper } from "react-p5-wrapper";
import { separatedFinger } from "./separatedFinger";
import { connectedFinger } from "./connectedFinger";
import { shrinkFinger } from "./shrinkFinger";

export const DisplayFinger = ({ predictionsRef }) => {
  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.stroke(0, 170, 100);
      p5.strokeWeight(10);
    };

    p5.draw = () => {
      p5.background(200);
      p5.push();
      if (typeof predictionsRef.current == "object") {
        try {
          for (let index = 0; index < predictionsRef.current.length; index++) {
            const keys = predictionsRef.current[index].keypoints;
            shrinkFinger(p5, keys);
          }
        } catch (e) {}
      }
    };
  }
  return <ReactP5Wrapper sketch={sketch} />;
};
