// ReactDOM.render(<App />, document.getElementById('root'));

export const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;

const axiom = "FX";

const scaleFactor = 1.5;

const rules: any = {
  X: "+YF-XFX-FY+",
  Y: "-XF+YFY+FX-"
};

const alpha = 90;
const iterations = 5;
const r = 20;

// const input = "FFF-FF-F-F+F+FF-F-FFF";
// const rules = { "X": "Y" };
// const alpha = 90;
// const iterations = 1;
// const r = 30

function solveSystem(input: any, rules: any) {
  let output = "";

  let i = 0;
  let j = 0;

  const ruleKeys = Object.keys(rules);

  while (i < input.length && j < input.length) {
    while (
      ruleKeys.some(ruleKey => ruleKey.startsWith(input.slice(i, j + 1))) &&
      j < input.length
    ) {
      j = j + 1;
    }

    if (i === j) {
      j++;
    }

    const match = input.slice(i, j);

    if (rules[match]) {
      output += rules[match];
    } else {
      output += match;
    }

    i = j;
  }

  return output;
}

let output = axiom;

for (let i = 0; i < iterations; i++) {
  output = solveSystem(output, rules);
}

console.log(output);

console.log("RENDERING----------------------");

const c = document.getElementsByTagName("canvas")[0];
c.width = canvasWidth * 2;
c.height = canvasHeight * 2;
const ctx = c.getContext("2d");

if (ctx) {
  // setup canvas
  ctx.lineWidth = 1;
  ctx.fillStyle = "f4f4f4";
  ctx.fillRect(0, 0, c.width, c.height);

  // set start position and direction
  let turtleState = {
    location: [canvasWidth, canvasHeight],
    direction: alpha,
    currentColor: 0,
    lineLength: r
  }

  let turtleStack = [];

  // set colors
  const strokeStyles = ["ffac8e", "fd7792", "3f4d71", "55ae95"];

  ctx.moveTo(turtleState.location[0], turtleState.location[1]);

  for (const instruction of output.split("")) {
    switch (instruction) {
      case ">": {
        turtleState.lineLength = turtleState.lineLength * scaleFactor
        break;
      }
      case "<": {
        turtleState.lineLength = turtleState.lineLength / scaleFactor
        break;
      }
      case "[": {
        turtleStack.push({ ...turtleState });
        console.log("Storing.", turtleStack)
        break;
      }
      case "]": {
        let nextTurtleState = turtleStack.pop();

        if (nextTurtleState) {
          console.log("GOING TO", nextTurtleState)
          turtleState = nextTurtleState;
        }
        break;
      }
      case "+": {
        turtleState.direction = turtleState.direction + alpha;
        break;
      }
      case "-": {
        turtleState.direction = turtleState.direction - alpha;
        break;
      }
      case "F": {
        const { location, direction, currentColor, lineLength } = turtleState;
        const nextX = location[0] + lineLength * Math.cos((direction * Math.PI) / 180);
        const nextY = location[1] - lineLength * Math.sin((direction * Math.PI) / 180);
        const nextLocation = [nextX, nextY];

        ctx.beginPath();
        ctx.moveTo(location[0], location[1]);
        ctx.lineTo(nextLocation[0], nextLocation[1]);
        ctx.strokeStyle = strokeStyles[currentColor];
        ctx.stroke();

        turtleState.currentColor = (currentColor + 1) % strokeStyles.length;
        turtleState.location = nextLocation;
        break;
      }
    }
  }

  ctx.stroke();
}
