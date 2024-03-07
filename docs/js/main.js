const commandInput = document.getElementById("commandInput");
const dropShadowCheck = document.getElementById("dropShadow");
const roundCornersCheck = document.getElementById("roundCorners");
const canvas = document.getElementById("workCanvas");
const ctx = canvas.getContext("2d");

const downloadButton = document.getElementById("downloadButton");
const copyButton = document.getElementById("copyButton");
const copyButtonText = document.getElementById("copyButtonText");

let noDecoration;
fetch("/mc-command-img/mc-command-img.json")
.then(response => response.json())
.then((json) => {
  noDecoration = json.noDecoration;
  drawCommand();
})
.catch(error => {
  window.alert("エラーが発生しました\nError occurred");
  console.error(error);
});

const colors = ["#54fcfc", "#fcfc54", "#54fc54", "#fc54fc", "#fca800"];
const shadowColors = ["#153e3e", "#3e3e15", "#153e15", "#3e153e", "#3e2900"];
const fontSize = 48;
const paddiing = 40;
canvas.height = fontSize + paddiing * 2;
ctx.font = `${fontSize}px DotGothic16`;
const spaceWidth = ctx.measureText(" ").width;

commandInput.addEventListener("input", drawCommand);
commandInput.addEventListener("change", drawCommand);
dropShadowCheck.addEventListener("change", drawCommand);
roundCornersCheck.addEventListener("change", drawCommand);

downloadButton.addEventListener("click", () => {
  let link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "command-img.png";
  link.click();
});

copyButton.addEventListener("click", () => {
  canvas.toBlob((blob) => {
    const item = new ClipboardItem({
      "image/png": blob
    });
    navigator.clipboard.write([item])
    .then(() => {
      showCopyMessage(true);
    })
    .catch((error) => {
      showCopyMessage(false);
    });
  });
});

function drawCommand() {
  const command = commandInput.value;
  const dropShadow = dropShadowCheck.checked;
  const roundCorners = roundCornersCheck.checked;
  const splitedCommand = command.split(" ");
  const textWidth = ctx.measureText(command).width;
  parsePos(splitedCommand);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = textWidth + paddiing * 2;
  ctx.font = `${fontSize}px DotGothic16`;
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#1a2638";
  if (roundCorners) {
    fillRoundRect(0, 0, canvas.width, canvas.height, 20);
  } else {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  let currentX = paddiing;
  let colorArgCount = 0
  for (let index in splitedCommand) {
    const arg = splitedCommand[index];

    if (noDecoration.includes(arg) || arg.startsWith("/") || arg.startsWith("run ") || arg === "") {
      if (dropShadow) {
        ctx.fillStyle = "#292929";
        ctx.fillText(arg, currentX + 5, fontSize + paddiing + 5);
      }
      ctx.fillStyle = "#a8a8a8";
      ctx.fillText(arg, currentX, fontSize + paddiing);
    } else {
      if (dropShadow) {
        ctx.fillStyle = shadowColors[colorArgCount % 5];
        ctx.fillText(arg, currentX + 5, fontSize + paddiing + 5);
      }
      ctx.fillStyle = colors[colorArgCount % 5];
      ctx.fillText(arg, currentX, fontSize + paddiing);
      colorArgCount++;
    }

    currentX += ctx.measureText(arg).width + spaceWidth;
  }
}

function parsePos(array) {
  for (let index in array) {
    index = Number(index);
    if (array.length > 2 && index < array.length - 2) {
      const f = array[index];
      const s = array[index + 1];
      const t = array[index + 2];
      if (
        (Number(f) !== NaN && Number(s) !== NaN && Number(t) !== NaN) ||
        (f.startsWith("~") && s.startsWith("~") && t.startsWith("~")) ||
        (f.startsWith("^") && s.startsWith("^") && t.startsWith("^"))
      ) {
        array.splice(index, 3, array.slice(index, index + 3).join(" "));
      }
    }
    if (array[index] === "run" && array[index + 1] !== undefined) {
      array.splice(index, 2, array.slice(index, index + 2).join(" "));
    }
  }
}

function createRoundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, Math.PI * (3/2), 0, false);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1/2), false);
  ctx.lineTo(x + r, y + h);       
  ctx.arc(x + r, y + h - r, r, Math.PI * (1/2), Math.PI, false);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3/2), false);
  ctx.closePath();
}

function fillRoundRect(x, y, w, h, r) {
  createRoundRectPath(x, y, w, h, r);
  ctx.fill();
}

function showCopyMessage(status) {
  if (status) {
    copyButtonText.textContent = copyButton.dataset.successfulText;
  } else {
    copyButtonText.textContent = copyButton.dataset.failedText;
  }
  window.setTimeout(() => {
    copyButtonText.textContent = copyButton.dataset.normalText;
  }, 3000);
}
