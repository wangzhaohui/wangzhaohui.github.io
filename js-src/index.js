(function($){
  const canvas = $.querySelector('.header .header-bg');
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = canvas.parentNode.clientHeight;
  const ctx = canvas.getContext('2d');

  class Rect {
    constructor(lineWidth, strokeStyle, x, y, w, h) {
      this.lineWidth = lineWidth;
      this.strokeStyle = strokeStyle;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
    get pos() {
      return [this.x, this.y];
    }
    set pos(pos) {
      this.x = pos[0];
      this.y = pos[1];
    }
  }

  const rects = [];
  for(let i = 0; i < 20; i++) {
    const w = getRandom(50, 100);
    const h = getRandom(50, 100);
    rects.push(new Rect(
      '1',
      getRandomRgba(),
      getRandom(0, canvas.width - w),
      getRandom(0, canvas.height - h),
      w,
      h
    ));
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rects.forEach((rect) => {
      const oldPos = rect.pos;
      rect.pos = [oldPos[0] + getRandom(-1, 2), oldPos[1] + getRandom(-1, 2)];
      drawRect(rect);
    });
  }, /* 41.67 */10);

  function drawRect(rect) {
    ctx.beginPath();
    ctx.lineWidth = rect.lineWidth;
    ctx.strokeStyle = rect.strokeStyle;
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.stroke();
  }

  function getRandom(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }

  function getRandomRgba() {
    return `rgba(${getRandom(0, 255)},${getRandom(0, 255)},${getRandom(0, 255)},1)`;
  }

})(document);