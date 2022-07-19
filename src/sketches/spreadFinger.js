export const spreadFinger = (p5, keys) => {
    p5.push();
    const base_x = keys[0].x;
    const base_y = keys[0].y;
    const fingerNames = ["thumb", "index finger", "middle finger", "ring finger", "pinky"]

    p5.translate(0, window.innerHeight /2);
        
    let start;
    let end;
    for(let n = 0; n < 5; n++) {
        start = 4 * n + 1;
        end = 4 * n + 4;
        p5.push();
        p5.translate(window.innerWidth/6 * (n + 1), 0);
        p5.push();
        p5.translate(0, 200);
        p5.noStroke();
        p5.textAlign(p5.CENTER);
        p5.textSize(25);
        p5.text(fingerNames[n], 0, 0);
        p5.pop();
        for (let i = start; i < end; i++) {
            for(let k = 0; k < 5; k++) {
                p5.push();
                p5.rotate(p5.TWO_PI / 5 * k);
                p5.line(
                    3 * (keys[i].x - keys[start].x),
                    3 * (keys[i].y - keys[start].y),
                    3 * (keys[i + 1].x - keys[start].x),
                    3 * (keys[i + 1].y - keys[start].y)
                );
                p5.pop();
            }
        }
        p5.pop();
    }

    p5.pop();
};
