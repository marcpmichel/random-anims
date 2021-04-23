
var self={};

function init() {
  document.body.style.backgroundColor = "black";
  self.parent = document.body;
  self.el = document.createElement('canvas');
  self.el.style.position = 'absolute';
  self.el.style.top = '0px';
  self.el.style.left = '0px';
  self.el.style.width = '100%';
  self.el.style.height = '100%';
  self.el.width = window.innerWidth / 2;
  self.el.height = window.innerHeight / 2;
  self.el.style.zIndex = 0xFE;
  self.parent.appendChild(self.el);
  self.canvasCtx = self.el.getContext('2d');
  self.canvasCtx.fillStyle = 'blue';
  self.width = self.el.width;
  self.height = self.el.height;
  self.canvasCtx.scale(1,1);
  self.canvasCtx.font = '32px sans';
  self.canvasCtx.textAlign = 'center';

  function rWidth() { return Math.random()*(self.width-w); }
  function rHeight() { return Math.random()*(self.height-h); }
  function rDir() { return Math.random() * 10.0 - 5.0; }
  var w = 20, h = 20;
  self.entities = [];

  self.letters = {
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

function restart() {
    disabled_entities=0;
    self.entities = [];
    pre();
    setTimeout(function() { anim(); }, 2000);
}


var bouncyness = 0.70
var gravity = 0.8;
var disabled_entities = 0;

function anim() {

  if(disabled_entities == self.entities.length)  {
    setTimeout(function() { restart(); }, 2000);
    return;
  }

  self.canvasCtx.clearRect(0,0,self.width, self.height);

  for(i=0;i<self.entities.length;i++) {
    var e = self.entities[i];

    if(e.disabled) continue;

    if(e.y + e.h > self.height) {
      if(typeof e.bounce == 'undefined') e.bounce = 0;
      e.bounce += 1;
      if(e.bounce > 50) {
        e.disabled = true;
        disabled_entities += 1;
      }
      else {
        e.y = self.height - e.h;
        e.dy = -e.dy;
        e.dy = e.dy * bouncyness;
      }
    }
    if(e.y < 0) {
      e.y = 0;
      e.dy = -e.dy;
      e.dy = e.dy * bouncyness;
    }

    if(e.y > (self.height-e.h*1.5)) {
      if(e.dy > -3 && e.dy < 3) {
        e.dy = (-Math.random()*15)-15;
        e.dx = Math.random()*10-10;
      }
    }

    e.dy = e.dy + gravity;
    e.y = e.y + e.dy;

    if(e.x + e.w > self.width) {
      e.x = self.width - e.w;
      e.dx = -e.dx;
    }

    if(e.x < 0) {
      e.dx = -e.dx;
      e.x = 0;
    }

    e.x = e.x + e.dx;

    self.canvasCtx.fillStyle = e.color;
    self.canvasCtx.fillRect(e.x,e.y,e.w,e.h);
  }

  requestAnimationFrame(anim);
}

function pre() {
  self.canvasCtx.fillStyle = "white";
  var xoffset = 0, yoffset = 0;

  var colors = [ 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white' ];

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
      var o = self.letters[c];
      letter(o, x, y);
      x += 40;
    }
  }

  wordAt("nothing", 0, 20);
  wordAt("to", 40, 100);
  wordAt("play", 80, 180);

}

window.onload = function() {
  init();
  restart();
}
