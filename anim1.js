

function onReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
} 

function init() {
    document.body.style.backgroundColor = "black";
    this.parent = document.body;
    this.el = document.createElement('canvas');
    this.el.style.position = 'absolute';
    this.el.style.top = '0px';
    this.el.style.left = '0px';
    this.el.style.width = '100%';
    this.el.style.height = '100%';
    this.el.width = window.innerWidth / 2;
    this.el.height = window.innerHeight / 2;
    this.el.style.zIndex = 0xFE;
    this.parent.appendChild(this.el);
    this.canvasCtx = this.el.getContext('2d');
    this.canvasCtx.fillStyle = 'blue';
    this.width = this.el.width;
    this.height = this.el.height;
    this.canvasCtx.scale(1,1);
    this.canvasCtx.font = '32px sans';
    this.canvasCtx.textAlign = 'center';

  function rWidth() { return Math.random()*(this.width-w); }
  function rHeight() { return Math.random()*(this.height-h); }
  function rDir() { return Math.random() * 10.0 - 5.0; } 
  var w = 20, h = 20;
  /*
  this.entities = [
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'red', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'yellow', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'green', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'blue', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'cyan', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'white', dx: rDir(), dy: rDir() },
    { x: rWidth(), y:rHeight(), w: w, h: h, color: 'magenta', dx: rDir(), dy: rDir() },
  ];
  */
  this.entities = [];

  this.letters = {
    "a": [ 0,0, 1,0, 2,0, 0,1, 2,1, 0,2, 1,2, 2,2, 0,3, 2,3, 0,4, 2,4 ],
    "b": [ ],
    "c": [ ],
    "d": [ ],
    "e": [ ],
    "f": [ ],
    "g": [ 0,0, 1,0, 2,0, 0,1, 0,2, 1,2, 2,2, 0,3, 2,3, 0,4, 1,4, 2,4 ],
    "h": [ 0,0, 2,0, 0,1, 2,1, 0,2, 1,2, 2,2, 0,3, 2,3, 0,4, 2,4 ],
    "i": [ 1,0, 1,1, 1,2, 1,3, 1,4 ],
    "j": [],
    "k": [],
    "l": [ 0,0, 0,1, 0,2, 0,3, 0,4, 1,4, 2,4 ],
    "m": [],
    "n": [ 0,0, 2,0, 0,1, 1,1, 2,1, 0,2, 1,2, 2,2, 0,3, 1,3, 2,3, 0,4, 2,4 ],
    "o": [ 0,0, 1,0, 2,0, 0,1, 2,1, 0,2, 2,2, 0,3, 2,3, 0,4, 1,4, 2,4 ],
    "p": [ 0,0, 1,0, 2,0, 0,1, 2,1, 0,2, 1,2, 2,2, 0,3, 0,4 ],
    "q": [],
    "r": [],
    "s": [],
    "t": [0,0, 1,0, 2,0, 1,1, 1,2, 1,3, 1,4 ],
    "u": [],
    "v": [],
    "w": [],
    "x": [],
    "y": [ 0,0, 2,0, 0,1, 2,1, 1,2, 1,3, 1,4 ],
    "z": []
  };
}

var bouncyness = 0.70
var gravity = 0.8;
var disabled_entities = 0;
function anim() {

  if(disabled_entities == this.entities.length)  {
    setTimeout(() => { restart(); }, 2000);
    return;
  }

  this.canvasCtx.clearRect(0,0,this.width, this.height);

  for(i=0;i<this.entities.length;i++) {
    var e = entities[i];

    if(e.disabled) continue;

      if(e.y + e.h > this.height) {
        if(typeof e.bounce == 'undefined') e.bounce = 0;
        e.bounce += 1; 
        if(e.bounce > 50) {
          e.disabled = true;
          disabled_entities += 1;
        }
        else {
          e.y = this.height - e.h;
          e.dy = -e.dy;
          e.dy = e.dy * bouncyness;
        }
      }
      if(e.y < 0) {
        e.y = 0;
        e.dy = -e.dy; 
        e.dy = e.dy * bouncyness;
      }

      if(e.y > (this.height-e.h*1.5)) {
        if(e.dy > -3 && e.dy < 3) {
          e.dy = (-Math.random()*15)-15;
          e.dx = Math.random()*10-10;
        }
      }

      e.dy = e.dy + gravity;
      e.y = e.y + e.dy;

      if(e.x + e.w > this.width) {
        e.x = this.width - e.w;
        e.dx = -e.dx;
      }

      if(e.x < 0) {
        e.dx = -e.dx;
        e.x = 0;
      }

      e.x = e.x + e.dx;

      this.canvasCtx.fillStyle = e.color;
      this.canvasCtx.fillRect(e.x,e.y,e.w,e.h);
    }

  requestAnimationFrame(anim);
}

function pre() {
  this.canvasCtx.fillStyle = "white";
  var xoffset = 0, yoffset = 0;

  var colors = [ 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white' ];

  var self = this;
  function letter(o, x, y) {
      for(var i=0;i<o.length; i+=2) {
        var col = colors[Math.floor(Math.random()*colors.length)];
        self.canvasCtx.fillStyle = col;
        self.canvasCtx.fillRect(x + o[i]*10, y + o[i+1]*10, 10, 10);
        self.entities.push({x: x+o[i]*10, y: y+o[i+1]*10, w: 10, h: 10, color: col, dx: Math.random()*10.0-5.0, dy: Math.random()*10.0-5.0});
      }
  }

  function wordAt(w, x, y) {
    for(l=0;l<w.length;l++) {
      var c = w.charAt(l);
      var o = this.letters[c];
      letter(o, x, y);
      x += 40;
    }
  }

  wordAt("nothing", 0, 20);
  wordAt("to", 40, 100);
  wordAt("play", 80, 180);

}

function restart() {
      disabled_entities=0; 
      this.entities = []; 
      pre(); 
      setTimeout(() => { anim(); }, 2000); 
}

window.onload = function() {
  init();
  restart();
}
