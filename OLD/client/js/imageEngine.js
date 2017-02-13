

ImageEngine = function(id, type, img) {
  var self = {
      id:id,
      type:type,
      img:img,
      animationCounterRollover:120,
      animationCounter:0,
      animationLastRoll:0
  }

  self.preloadImage = function() {
    let img = self.img;
    self.img = new Image();
    self.img.src = img;
  }

  self.drawSprite = function(x,y,id) {
    if(self.coords == undefined) return;
    let coords = self.coords[id];

    self._draw(self.img, coords.x, coords.y,
                         coords.w, coords.h,
                         x, y);
  }

  // Draw animation, will change animation based on animationTick
  self.drawAnimation = function(x,y,id) {
    if(self.coords == undefined) return;
    let animation = self.animation[id];

    // Increase the tick for animation which determins the frame
    // speed on the sprite animation.
    if(Date.now() - self.animationLastRoll > self.animationCounterRollover) {
      self.animationCounter++;
      if(self.animationCounter >= animation.length) self.animationCounter = 0;
      self.animationLastRoll = Date.now();
    }
    let coords = animation[self.animationCounter]
    self._draw(self.img, coords.x, coords.y,
                         coords.w, coords.h,
                         x, y);
  }

  // Draw an image if its a clean image,
  // if its a sprite it'll draw the default sprite
  self.drawImage = function(x,y,w,h) {
    if(self.type == "sprite") {
      self.drawSprite(x,y,"default");
      return;
    }
    if(w == undefined) w = self.img.width;
    if(h == undefined) h = self.img.height;
    self._draw(self.img, 0, 0, w, h, x, y);
  }

  // Just a replacement for ctx.drawImage
  self._draw = function(img,sx,sy,w,h,x,y) {
    // Calculate from tile coords to pixel coords within canvas
    let pixelX = (x - maps.topX) * TILE_WIDTH;
    let pixelY = (y - maps.topY) * TILE_HEIGHT;

    pixelX += TILE_WIDTH/2 - w*3/2;
    pixelY += TILE_HEIGHT-h*3
    ctx.save();
    ctx.drawImage(img,sx,sy,w,h,pixelX,pixelY,w*3,h*3);
    ctx.restore();
  }

  // Check if its a json file, if so load it
  if (self.img.split('.').pop() == "json") {
    var request = new XMLHttpRequest();
    request.open('GET', self.img, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        let data = JSON.parse(request.responseText);
        self.coords = data.coords;
        self.animation = data.animation;
        self.img = data.image;
        self.preloadImage();
      } else {
        console.log("Reached target, but some kinda error?");
      }
    };
    request.onerror = function() {
      console.log("Could not load coords?");
    };
    request.send();
  }
  else { self.preloadImage(); }

  return self;
}

var Img = {};
Img.player = new ImageEngine("player", "sprite", "gfx/player.json");
Img.npc = new ImageEngine("npc", "sprite", "gfx/npc.json");
