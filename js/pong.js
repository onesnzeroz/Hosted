(function () {
  const canvas = document.getElementById("pongCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const game = {
    w: canvas.width,
    h: canvas.height,
    paddleW: 14,
    paddleH: 110,
    leftY: canvas.height / 2 - 55,
    rightY: canvas.height / 2 - 55,
    speed: 7,
    aiSpeed: 5,
    ballX: canvas.width / 2,
    ballY: canvas.height / 2,
    ballR: 10,
    vx: 6,
    vy: 4,
    scoreL: 0,
    scoreR: 0,
    keys: { w: false, s: false }
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function resetBall(direction) {
    game.ballX = game.w / 2;
    game.ballY = game.h / 2;
    game.vx = 6 * direction;
    game.vy = (Math.random() * 6) - 3;
  }

  function update() {
    if (game.keys.w) game.leftY -= game.speed;
    if (game.keys.s) game.leftY += game.speed;
    game.leftY = clamp(game.leftY, 0, game.h - game.paddleH);

    const aiCenter = game.rightY + game.paddleH / 2;
    if (aiCenter < game.ballY - 10) game.rightY += game.aiSpeed;
    if (aiCenter > game.ballY + 10) game.rightY -= game.aiSpeed;
    game.rightY = clamp(game.rightY, 0, game.h - game.paddleH);

    game.ballX += game.vx;
    game.ballY += game.vy;

    if (game.ballY < game.ballR || game.ballY > game.h - game.ballR) game.vy *= -1;

    const leftHit = game.ballX - game.ballR <= 30 + game.paddleW && game.ballY >= game.leftY && game.ballY <= game.leftY + game.paddleH;
    const rightHit = game.ballX + game.ballR >= game.w - 30 - game.paddleW && game.ballY >= game.rightY && game.ballY <= game.rightY + game.paddleH;

    if (leftHit) {
      game.ballX = 30 + game.paddleW + game.ballR;
      game.vx = Math.abs(game.vx) + 0.2;
    }

    if (rightHit) {
      game.ballX = game.w - 30 - game.paddleW - game.ballR;
      game.vx = -Math.abs(game.vx) - 0.2;
    }

    if (game.ballX < 0) {
      game.scoreR += 1;
      resetBall(1);
    }
    if (game.ballX > game.w) {
      game.scoreL += 1;
      resetBall(-1);
    }
  }

  function drawNet() {
    ctx.strokeStyle = "rgba(255,255,255,0.30)";
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(game.w / 2, 0);
    ctx.lineTo(game.w / 2, game.h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function render() {
    ctx.clearRect(0, 0, game.w, game.h);
    drawNet();

    ctx.fillStyle = "#d8e5ff";
    ctx.fillRect(30, game.leftY, game.paddleW, game.paddleH);
    ctx.fillRect(game.w - 30 - game.paddleW, game.rightY, game.paddleW, game.paddleH);

    ctx.beginPath();
    ctx.fillStyle = "#83b1ff";
    ctx.arc(game.ballX, game.ballY, game.ballR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e8f0ff";
    ctx.font = "700 44px Segoe UI, Arial";
    ctx.fillText(String(game.scoreL), game.w / 2 - 90, 58);
    ctx.fillText(String(game.scoreR), game.w / 2 + 62, 58);
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "w") game.keys.w = true;
    if (k === "s") game.keys.s = true;
  });

  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k === "w") game.keys.w = false;
    if (k === "s") game.keys.s = false;
  });

  resetBall(Math.random() > 0.5 ? 1 : -1);
  loop();
})();
