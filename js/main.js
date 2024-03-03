const input = document.getElementById("commandInput");
const canvas = document.getElementById("workCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "48px DotGothic16";
const spaceWidth = ctx.measureText(" ").width;

let noDecoration;
fetch("mc-command-img.json")
.then(response => response.json())
.then(json => noDecoration = json.noDecoration)
.catch(error => {
  console.error(error);
});

const colors = ["#54fcfc", "#fcfc54", "#54fc54", "#fc54fc", "#fca800"];
const paddiing = 25;
canvas.height = 48 + paddiing * 2;

input.addEventListener("input", (e) => {
  const command = input.value;
  const splitedCommand = command.split(" ");
  const textWidth = ctx.measureText(command).width;
  parsePos(splitedCommand);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = textWidth + paddiing * 2;
  ctx.font = "48px DotGothic16";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#1a2638";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let currentX = paddiing;
  let colorArgCount = 0
  for (let index in splitedCommand) {
    const arg = splitedCommand[index];

    if (noDecoration.includes(arg) || arg.startsWith("/") || arg === "") {
      ctx.fillStyle = "#a8a8a8";
    } else {
      ctx.fillStyle = colors[colorArgCount % 5];
      colorArgCount++;
    }

    ctx.fillText(arg, currentX, 48 + paddiing);
    currentX += ctx.measureText(arg).width + spaceWidth;
  }
});

function parsePos(array) {
  if (array.length > 2) {
    for (let index in array) {
      if (index < array.length - 2) {
        index = Number(index);
        const f = array[index];
        const s = array[index + 1];
        const t = array[index + 2];
        if (
          (Number(f) && Number(s) && Number(t)) ||
          (f.startsWith("~") && s.startsWith("~") && t.startsWith("~")) ||
          (f.startsWith("^") && s.startsWith("^") && t.startsWith("^"))
        ) {
          array.splice(index, 3, array.slice(index, index + 3).join(" "));
        }
      }
    }
  }
}