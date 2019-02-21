(function($){
  const canvas = $.querySelector('.header .header-bg');
  canvas.width = canvas.parentNode.clientWidth;
  canvas.height = canvas.parentNode.clientHeight;
  const ctx = canvas.getContext('2d');

  class Rect {
    constructor(lineWidth, strokeStyle, x, y, w, h, directX, directY) {
      this.lineWidth = lineWidth;
      this.strokeStyle = strokeStyle;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.directX = directX;
      this.directY = directY;
    }
    get pos() {
      return [this.x, this.y];
    }
    set pos(pos) {
      this.x = pos[0];
      this.y = pos[1];
    }
    turnXReverse() {
      this.directX *= -1;
    }
    turnYReverse() {
      this.directY *= -1;
    }
  }

  // Generate rects
  const rects = [];
  for(let i = 0; i < 20; i++) {
    const length = Math.min(canvas.width, canvas.height);
    const w = getRandom(length * 0.1, length * 0.3);
    const h = getRandom(length * 0.1, length * 0.3);
    rects.push(new Rect(
      '1',
      getRandomRgba(30, 220),
      getRandom(0, canvas.width - w),
      getRandom(0, canvas.height - h),
      w,
      h,
      getRandomFrom([-1, 1]),
      getRandomFrom([-1, 1])
    ));
  }

  // Motion
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rects.forEach((rect) => {
      const oldPos = rect.pos;
      rect.pos = [oldPos[0] + rect.directX * 1, oldPos[1] + rect.directY * 1];

      const result = checkEdge(rect);
      if (result.x) {
        rect.turnXReverse();
      }
      if (result.y) {
        rect.turnYReverse();
      }
      drawRect(rect);
    });
  }, 30);
  
  function drawRect(rect) {
    ctx.beginPath();
    ctx.lineWidth = rect.lineWidth;
    ctx.strokeStyle = rect.strokeStyle;
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.stroke();

    ctx.fillStyle = rect.strokeStyle;
    ctx.fill();
  }

  // Motion edge check
  function checkEdge(rect) {
      return {
        x: rect.x <= 0 || rect.x + rect.w >= canvas.width,
        y: rect.y <= 0 || rect.y + rect.h >= canvas.height
      };
  }

  function getRandom(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }

  function getRandomRgba(min = 0, max = 255, alpha = 1) {
    return `rgba(${getRandom(min, max)},${getRandom(min, max)},${getRandom(min, max)},${alpha})`;
  }

  function getRandomFrom(arr) {
    const len = arr.length;
    var num = getRandom(0, len);
    return arr[num];
  }

})(document);