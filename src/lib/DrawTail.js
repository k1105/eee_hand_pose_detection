import { ReactP5Wrapper } from "react-p5-wrapper";

export const DrawTail = ({ predictionsRef }) => {
  const hip_r = 130;
  const tail_r = [73.4, 42.7, 24.3, 12.7];
  function sketch(p5) {
    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.noStroke();
      p5.fill(0);
    };

    p5.draw = () => {
      p5.background(250);
      p5.push();
      if (typeof predictionsRef.current == "object") {
        try {
          const keys = predictionsRef.current[0].keypoints;
          const finger = [
            // data
            keys[5],
            keys[6],
            keys[7],
            keys[8],
          ];

          const origin = { x: 0, y: 0 };
          let pos;
          let pos_prev;
          p5.translate(p5.width / 2, p5.height / 2);

          //tail
          pos = rigmap(origin, finger[0], 97.6);
          drawInterporatedEllipse(p5, origin, pos, hip_r, tail_r[0], 100);
          pos_prev = pos;
          pos = rigmap(pos_prev, finger[1], 92);
          drawInterporatedEllipse(p5, pos_prev, pos, tail_r[0], tail_r[1], 100);
          pos_prev = pos;
          pos = rigmap(pos_prev, finger[2], 67);
          drawInterporatedEllipse(p5, pos_prev, pos, tail_r[1], tail_r[2], 100);
          pos_prev = pos;
          pos = rigmap(pos_prev, finger[3], 51.3);
          drawInterporatedEllipse(p5, pos_prev, pos, tail_r[2], tail_r[3], 100);
        } catch (e) {}
      }
    };
  }

  const drawInterporatedEllipse = (p5, pos0, pos1, r0, r1, num) => {
    for (let t = 0; t < num; t++) {
      const x = ((pos1.x - pos0.x) / num) * t + pos0.x;
      const y = ((pos1.y - pos0.y) / num) * t + pos0.y;
      const r = ((r1 - r0) / num) * t + r0;
      p5.ellipse(x, y, r);
    }
  };

  const rigmap = (start, mot, d) => {
    const len = Math.sqrt(mot.x ** 2 + mot.y ** 2);
    return { x: (d / len) * mot.x + start.x, y: (d / len) * mot.y + start.y };
  };
  return <ReactP5Wrapper sketch={sketch} />;
};
