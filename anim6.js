function hslToRGB(hsl, format) {

  function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) { color = 0; }
    return color;
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  var h = hsl.h,
    s = hsl.s,
    l = hsl.l,
    c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c / 2,
    r, g, b;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  r = normalize_rgb_value(r, m);
  g = normalize_rgb_value(g, m);
  b = normalize_rgb_value(b, m);

  if(format == "hex") return rgbToHex(r,g,b); 
  // console.log(rgbToHex(r,g,b));
  // return rgbToHex(r, g, b);
  // var rh = `00${Number(r).toString(16)}`.slice(-2);
  // var rg = `00${Number(h).toString(16)}`.slice(-2);
  // var rb = `00${Number(b).toString(16)}`.slice(-2);
  // var hex = `#${rh}${rg}${rb}`;
  // return hex; 
  return { r: r, g: g, b: b };
}


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

class Kalei {
  constructor(canvasCtx, width, height, opts={}) {
    this.canvasCtx = canvasCtx;
    this.width = width;
    this.height = height;
    this.do_not_clear = true;
    this.timeout = 250;
    this.last_updated_at = 0; // Date.now() - 1000;

    this.setup();
  }

  setup() {
    this.canvasCtx.strokeStyle = "#F1C40F";
    this.canvasCtx.lineWidth = 2;
    this.hidden = 0;
    this.angle = 360 / 6;
    this.wm = this.width / 2;
    this.hm = this.height / 2;
    this.x = this.wm - 80;
    this.y = this.hm - 80;
    this.t = 0.0;
    this.wait = false;
    this.randomParams();
  }

  randomParams() {
    this.hue = Math.random()*360;
    // this.color = hslToRGB({ h: Math.random()*360, s: 0.5, l:0.5 }, "hex");
    // console.log(this.color);
    // this.canvasCtx.fillStyle = this.color;

    this.p1 = Math.ceil(Math.random() * 6);
    this.p2 = Math.ceil(Math.random() * 6);
    this.p3 = Math.ceil(Math.random() * 3 + 1);
    this.p4 = Math.ceil(Math.random() * 3 + 1);
    //
    this.diameter = Math.random() * 40 + 2;
    this.colorSpeed = Math.floor(Math.random()*2) ? Math.ceil(Math.random() * 4) : 1 / Math.ceil(Math.random()*4);
    // console.log(this.colorSpeed);
    this.colorStart = Math.floor(Math.random() * 360);
    //
    this.symetry = Math.ceil(Math.random() * 15 + 1);
    this.divisions = 360 / this.symetry;
    // console.log(this.divisions);
  }

  clear() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height)
  }

  update() {
    this.t = this.t + 0.01;
    if(this.t > 2*Math.PI) {
      this.t = 0;
      this.wait = !this.wait;
      if(this.wait) this.randomParams();
      else this.clear();
    }
    if(this.wait) return;

    // this.hue = (this.hue + 1) % 360
    this.hue = (Math.floor(this.t * this.colorSpeed * 360.0 / (2*Math.PI)) + this.colorStart) % 360;
    this.canvasCtx.fillStyle = hslToRGB({ h: this.hue, s: 0.5, l:0.5 }, "hex");

    for(var a=0; a<360; a+=this.divisions) {
      var rad = a * Math.PI / 180.0;
      var x = Math.cos(rad) * (this.x - this.wm) - Math.sin(rad) * (this.y - this.hm) + this.wm;
      var y = Math.sin(rad) * (this.x - this.wm) + Math.cos(rad) * (this.y - this.hm) + this.hm;
      this.draw(x, y, this.diameter);   
      // this.drawTriangle(x,y,this.diameter);
      // this.drawSquare(x,y,this.diameter);
    }

    this.x = this.x + this.p1 * Math.cos(this.t);
    this.y = this.y + this.p2 * Math.sin(this.t);

  }

  draw(x,y,d=10) {
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(x, y, d, 0, 2 * Math.PI);
    this.canvasCtx.fill();
    // this.canvasCtx.endPath();
  }

  drawTriangle(x,y, d) {
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(x-d/2, y - d/2);
    this.canvasCtx.lineTo(x+d/2, y);
    this.canvasCtx.lineTo(x-d/2, y + d/2);
    this.canvasCtx.lineTo(x-d/2, y - d/2);
    // this.canvasCtx.stroke();
    this.canvasCtx.fill();
  }

  drawSquare(x,y,d) {
    this.canvasCtx.beginPath();
    this.canvasCtx.rect(x,y,d,d);
    this.canvasCtx.fill();
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

}


document.body.style.backgroundColor = 'black';
const runner = new AnimRunner(document.body, Kalei);
runner.start();


