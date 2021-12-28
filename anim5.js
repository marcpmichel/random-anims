class AnimRunner {

    constructor(parent, klass) {
      this.klass = klass;
      this.build(parent);
    }

    build(parent) {
        this.parent = parent;
        this.el = document.createElement('canvas');
        this.el.style.position = 'absolute';
        this.el.style.top = '0px';
        this.el.style.left = '0px';
        this.el.style.width = '100%';
        this.el.style.height = '100%';
        this.el.width = window.innerWidth;
        this.el.height = window.innerHeight;
        this.el.style.zIndex = 0xFE;
        parent.appendChild(this.el);
        this.canvasCtx = this.el.getContext('2d');
        this.canvasCtx.fillStyle = 'blue';
        this.width = this.el.width;
        this.height = this.el.height;
        this.canvasCtx.scale(1, 1);
        this.canvasCtx.font = '3vmin sans';
        this.canvasCtx.textAlign = 'center';
        return this.el;
    }

    start() {
        this.animFrameId && cancelAnimationFrame(this.animFrameId);
        this.anim = new this.klass(this.canvasCtx, this.width, this.height);
        this.updateFn = this.update.bind(this);
        this.animFrameId = requestAnimationFrame(this.updateFn);
    }

    stop() {
        this.animFrameId && cancelAnimationFrame(this.animFrameId);
    }

    update() {
        if(!this.anim.do_not_clear) {
            this.canvasCtx.clearRect(0, 0, this.width, this.height)
        }
        this.anim.update();
        this.animFrameId = requestAnimationFrame(this.updateFn);
    }
}

class Startup {
  constructor(canvasCtx, width, height, opts={}) {
    this.canvasCtx = canvasCtx;
    this.width = width;
    this.height = height;
    this.do_not_clear = true;
    this.timeout = 250;
    this.last_updated_at = 0; // Date.now() - 1000;

    this.canvasCtx.strokeStyle = "#F1C40F";
    this.canvasCtx.lineWidth = 2;
    console.log(this.width);
    this.size = this.width / 10;
    this.gap = this.size / 200;
    this.hidden = 0;

    this.first = 0;
    this.nbelem = 7;
    this.triangles = [];
    this.colors = [];
    for(var i=0; i<this.nbelem; i++) {
      this.triangles.push({x: this.width / 4 - (i - this.nbelem / 2.0) * (this.size + this.gap) / 1.5, y: this.height/2 - this.size/2});
      var c = parseInt((256 / this.nbelem) * i);
      var color = '#'+ (c * 256 * 256  + c * 256 + c).toString(16);
      this.colors.push(color);
      console.log(`${i} : ${color}`);
    }
    this.canvasCtx.fillStyle = '#FFAB12';
  }
  
  update() {
    const delay = Date.now() - this.last_updated_at;
    if(delay < 250) return;
    this.last_updated_at = Date.now();

    this.first = (this.first + 1) % this.nbelem;
    console.log(this.first);

    for(var i=0; i<this.nbelem; i++) {
      var c = (this.first + i) % this.nbelem;
      // console.log(this.colors[c]);
      this.canvasCtx.fillStyle = this.colors[c];
      this.canvasCtx.strokeStyle = this.colors[c];
      // console.log(this.triangles[i].x);
      this.drawTriangle(this.triangles[i].x, this.triangles[i].y, this.size);
    }
  }

  drawTriangle(x,y, d) {
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(2*x-d/2, y - d/2);
    this.canvasCtx.lineTo(2*x+d/2, y);
    this.canvasCtx.lineTo(2*x-d/2, y + d/2);
    this.canvasCtx.lineTo(2*x-d/2, y - d/2);
    this.canvasCtx.stroke();
    this.canvasCtx.fill();
  }

}


document.body.style.backgroundColor = 'black';
const runner = new AnimRunner(document.body, Startup);
runner.start();


