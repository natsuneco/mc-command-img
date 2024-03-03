const input = document.getElementById("commandInput");
const canvas = document.getElementById("workCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "48px serif";
const spaceWidth = ctx.measureText(" ").width;

let noDecoration;
fetch("mc-command-img.json")
.then(response => response.json())
.then(json => noDecoration = json.noDecoration)
.catch(error => {
  console.error(error);
});

const colors = ["#54fcfc", "#fcfc54", "#54fc54", "#fc54fc", "#fca800"]

input.addEventListener("input", (e) => {
  const command = input.value;
  const splitedCommand = command.split(" ");
  const textWidth = ctx.measureText(command).width;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = textWidth;
  ctx.font = "48px serif";

  let currentX = 0;
  let colorArgCount = 0
  for (let index in splitedCommand) {
    const arg = splitedCommand[index];

    if (noDecoration.includes(arg) || index == 0) {
      ctx.fillStyle = "#a8a8a8";
    } else {
      ctx.fillStyle = colors[colorArgCount % 5];
      colorArgCount++;
    }

    ctx.fillText(arg, currentX, 48);
    currentX += ctx.measureText(arg).width + spaceWidth;
  }
});
