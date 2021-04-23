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
        this.el.width = window.innerWidth / 2;
        this.el.height = window.innerHeight / 2;
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

class RandomRects {
    constructor(canvasCtx, width, height, opts={}) {
        this.canvasCtx = canvasCtx;
        this.width = width;
        this.height = height;
        this.do_not_clear = true;
        this.last_updated_at = Date.now();
        this.count = 0;

        this.palettes = [
            ["ef476f","ffd166","06d6a0","118ab2","073b4c"],
            ["ffac81","ff928b","fec3a6","efe9ae","cdeac0"],
            ["8ecae6","219ebc","023047","ffb703","fb8500"],
            ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
            ["1a535c","4ecdc4","f7fff7","ff6b6b","ffe66d"],
            ["555b6e","89b0ae","bee3db","faf9f9","ffd6ba"],
            ["f72585","7209b7","3a0ca3","4361ee","4cc9f0"],
            ["d8e2dc","ffe5d9","ffcad4","f4acb7","9d8189"],
            ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"],
            ["355070","6d597a","b56576","e56b6f","eaac8b"],
            ["ffbe0b","fb5607","ff006e","8338ec","3a86ff"],
            ["cad2c5","84a98c","52796f","354f52","2f3e46"],
            ["ecc8af","e7ad99","ce796b","c18c5d","495867"],
            ["00296b","003f88","00509d","fdc500","ffd500"],
            ["ecf8f8","eee4e1","e7d8c9","e6beae","b2967d"],
            ["4f000b","720026","ce4257","ff7f51","ff9b54"],
            ["001427","708d81","f4d58d","bf0603","8d0801"],
            ["03045e","0077b6","00b4d8","90e0ef","caf0f8"],
            ["ffbc42","d81159","8f2d56","218380","73d2de"],
            ["07beb8","3dccc7","68d8d6","9ceaef","c4fff9"],
            ["000814","001d3d","003566","cca000","f5cc00"],
            ["efde58","2a8bfb","1e4ca5","193d84","24385a"],
            ["562c2c","f2542d","f5dfbb","0e9594","127475"],
            ["ffd9da","ea638c","89023e","30343f","1b2021"],
            ["96bbbb","618985","414535","f2e3bc","c19875"]
        ];


      this.shapes = [
        function() {
            const w = Math.random() * (this.width / 100) + (this.width / 100);
            const h = Math.random() * (this.height / 5) + (this.height / 5);
            const x = Math.random() * (this.width);
            const y = Math.random() * (this.height);
          return { x:x, y:y, w:w, h:h };
        },
        function() {
            const w = Math.random() * (this.width / 5) + (this.width / 5);
            const h = Math.random() * (this.height / 100) + (this.height / 100);
            const x = Math.random() * (this.width);
            const y = Math.random() * (this.height);
          return { x:x, y:y, w:w, h:h };
        },
        function() {
            const w = Math.random() * (this.height / 10) + (this.width / 10);
            const h = w;
            const x = Math.random() * (this.width);
            const y = Math.random() * (this.height);
          return { x:x, y:y, w:w, h:h };
        },
        function() {
            const w = Math.random() * (this.width / 10) + (this.width / 10);
            const h = Math.random() * (this.height / 10) + (this.height / 10);
            const x = Math.random() * (this.width);
            const y = Math.random() * (this.height);
          return { x:x, y:y, w:w, h:h };
        },
      ];

      this.clear();
    }
    clear() {
      this.colors = this.palettes[Math.floor(Math.random() * this.palettes.length)];
      const r = Math.floor(Math.random() * this.colors.length);
      const t = this.colors[0]; this.colors[0] = this.colors[r]; this.colors[r] = t; //  swap first and random color
      this.canvasCtx.fillStyle = `#${this.colors[0]}`; //'black';
      this.canvasCtx.fillRect(0, 0, this.width, this.height);
      // this.shapeType = Math.floor((Math.random() * 5));
      this.getShape = this.shapes[Math.floor(Math.random() * this.shapes.length)]; 
    }
    update() {
        const timeout =  Date.now() - this.last_updated_at;
        if(timeout > 250) {
            this.count++;
            if(this.count > 30) {
                this.count = 0;
                this.clear();
            }
            this.last_updated_at = Date.now();
            const colorIndex = Math.floor(Math.random() * (this.colors.length - 1)) + 1;
            this.canvasCtx.fillStyle = `#${this.colors[colorIndex]}`;
            const s = this.getShape();
            this.canvasCtx.fillRect(s.x,s.y,s.w,s.h);
        } 
        
    }
}

const runner = new AnimRunner(document.body, RandomRects);
runner.start();


