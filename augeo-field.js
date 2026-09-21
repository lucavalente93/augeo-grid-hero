(() => {
  if (window.__augeoFieldLoaded) return;
  window.__augeoFieldLoaded = true;

  const canvas = document.querySelector(".field");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let modules = [];
  let animationFrame = 0;
  let isVisible = true;
  let previousFrameTime = performance.now();

  const ink = [17, 17, 17];
  const accent = [255, 72, 44];
  const wake = [];

  const pointer = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    velocityX: 0,
    velocityY: 0,
    strength: 0,
    active: false,
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function mixColor(from, to, amount) {
    const mix = clamp(amount, 0, 1);
    const red = Math.round(from[0] + (to[0] - from[0]) * mix);
    const green = Math.round(from[1] + (to[1] - from[1]) * mix);
    const blue = Math.round(from[2] + (to[2] - from[2]) * mix);
    return `rgb(${red} ${green} ${blue})`;
  }

  function buildField() {
    const mobile = width < 768;
    const left = mobile ? 18 : Math.max(width * 0.49, width - 760);
    const right = width - (mobile ? 18 : 34);
    const top = mobile ? Math.max(510, height * 0.63) : 62;
    const bottom = height - (mobile ? 44 : 68);
    const gapX = mobile ? 34 : 43;
    const gapY = mobile ? 31 : 37;
    const availableWidth = Math.max(0, right - left);
    const availableHeight = Math.max(0, bottom - top);
    const columns = Math.max(1, Math.floor(availableWidth / gapX));
    const rows = Math.max(1, Math.floor(availableHeight / gapY));
    const fieldWidth = (columns - 1) * gapX;
    const fieldHeight = (rows - 1) * gapY;
    const originX = left + (availableWidth - fieldWidth) * 0.5;
    const originY = top + (availableHeight - fieldHeight) * 0.5;

    modules = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const edgeX = columns > 1 ? column / (columns - 1) : 0.5;
        const edgeY = rows > 1 ? row / (rows - 1) : 0.5;
        const edgeFade = Math.min(
          1,
          Math.min(edgeX, 1 - edgeX, edgeY, 1 - edgeY) * 5 + 0.16,
        );

        modules.push({
          x: originX + column * gapX,
          y: originY + row * gapY,
          row,
          column,
          edgeFade,
        });
      }
    }
  }

  function resize() {
    const bounds = hero.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildField();
    cancelAnimationFrame(animationFrame);
    previousFrameTime = performance.now();
    draw(performance.now());
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);

    const frameTime = Math.min(32, Math.max(1, time - previousFrameTime));
    previousFrameTime = time;
    const mobile = width < 768;
    const pointerEnabled =
      !mobile && !coarsePointer.matches && !reduceMotion.matches;
    const interactive =
      pointerEnabled && (pointer.active || pointer.strength > 0.01);
    const radius = Math.min(178, Math.max(138, width * 0.13));
    const moduleWidth = mobile ? 20 : 26;
    const moduleHeight = mobile ? 3.5 : 4.5;
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    if (pointerEnabled) {
      const positionResponse = 1 - Math.pow(0.84, frameTime / (1000 / 60));
      const strengthResponse =
        1 - Math.pow(pointer.active ? 0.7 : 0.82, frameTime / (1000 / 60));
      const previousX = pointer.x;
      const previousY = pointer.y;

      pointer.x += (pointer.targetX - pointer.x) * positionResponse;
      pointer.y += (pointer.targetY - pointer.y) * positionResponse;
      pointer.velocityX += (pointer.x - previousX - pointer.velocityX) * 0.2;
      pointer.velocityY += (pointer.y - previousY - pointer.velocityY) * 0.2;
      pointer.strength +=
        ((pointer.active ? 1 : 0) - pointer.strength) * strengthResponse;
    }

    while (wake.length > 0 && time - wake[0].createdAt > 220) wake.shift();

    modules.forEach((module, index) => {
      const distance = Math.hypot(pointer.x - module.x, pointer.y - module.y);
      if (interactive && distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    modules.forEach((module, index) => {
      const deltaX = module.x - pointer.x;
      const deltaY = module.y - pointer.y;
      const distance = Math.max(1, Math.hypot(deltaX, deltaY));
      const influence = interactive
        ? Math.max(0, 1 - distance / radius) ** 2 * pointer.strength
        : 0;
      const heat = interactive
        ? Math.max(0, 1 - distance / (radius * 0.78)) ** 1.6 *
          pointer.strength
        : 0;
      let wakeHeat = 0;

      if (pointerEnabled) {
        wake.forEach((point) => {
          const age = time - point.createdAt;
          const life = Math.max(0, 1 - age / 220);
          const wakeDistance = Math.hypot(
            module.x - point.x,
            module.y - point.y,
          );
          const localHeat =
            Math.max(0, 1 - wakeDistance / (radius * 0.52)) ** 2 *
            life *
            0.48;
          wakeHeat = Math.max(wakeHeat, localHeat);
        });
      }

      const colorHeat = Math.max(heat, wakeHeat);
      const ambient = reduceMotion.matches
        ? 0
        : Math.sin(time * 0.00028 + module.row * 0.36 + module.column * 0.21) *
          (mobile ? 0.018 : 0.035);
      const push = influence * 34;
      const x = module.x + (deltaX / distance) * push;
      const y = module.y + (deltaY / distance) * push;
      const angle = ambient + Math.atan2(deltaY, deltaX) * influence * 0.62;
      const isCore =
        index === nearestIndex &&
        nearestDistance < radius * 0.76 &&
        pointer.strength > 0.08;
      const speed = clamp(
        Math.hypot(pointer.velocityX, pointer.velocityY) / 12,
        0,
        1,
      );
      const scaleX =
        1 +
        colorHeat * 0.24 +
        (isCore ? 0.1 : 0) +
        wakeHeat * speed * 0.18;
      const scaleY = 1 + colorHeat * 0.08;
      const colorMix = isCore
        ? 0.72 + pointer.strength * 0.28
        : Math.min(0.7, colorHeat * 0.76);

      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(scaleX, scaleY);
      context.globalAlpha = mobile
        ? 0.3 * module.edgeFade
        : (0.64 + influence * 0.28 + colorHeat * 0.08) * module.edgeFade;
      context.fillStyle = mixColor(ink, accent, colorMix);
      context.fillRect(
        -moduleWidth * 0.5,
        -moduleHeight * 0.5,
        moduleWidth,
        moduleHeight,
      );
      context.restore();
    });

    if (!reduceMotion.matches && isVisible) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  function setPointer(event) {
    const bounds = hero.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const nextY = event.clientY - bounds.top;

    if (
      pointer.active &&
      Math.hypot(nextX - pointer.targetX, nextY - pointer.targetY) > 18
    ) {
      const previousWake = wake[wake.length - 1];
      if (!previousWake || performance.now() - previousWake.createdAt > 24) {
        wake.push({
          x: pointer.targetX,
          y: pointer.targetY,
          createdAt: performance.now(),
        });
        if (wake.length > 7) wake.shift();
      }
    }

    pointer.targetX = nextX;
    pointer.targetY = nextY;
    if (!pointer.active) {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
    }
    pointer.active = true;
  }

  function clearPointer() {
    pointer.active = false;
  }

  function restart() {
    cancelAnimationFrame(animationFrame);
    previousFrameTime = performance.now();
    draw(performance.now());
  }

  function handleVisibility() {
    isVisible = !document.hidden;
    if (isVisible) restart();
  }

  hero.addEventListener("pointermove", setPointer, { passive: true });
  hero.addEventListener("pointerleave", clearPointer, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  reduceMotion.addEventListener("change", restart);

  resize();
})();
