
Player = function(x,y,map) {
  var self = {
    speed:0.1,
    jumping:0,
    x:x,
    y:y,
    nextX:x,
    nextY:y,
    slowKeys:0,
    facing:"down",
    map:map
  }

  self.update = function() {
    self.updatePosition();
    self.draw();
  }

  self.updatePosition = function(){
    // TEMPO SPEED BOOST CHEAT:
    if(ih.b) { self.speed = 1; }
    else { self.speed = 0.1; }

    // Add some animation
    if(self.nextX > self.x) { self.x = self.x+self.speed > self.nextX ? self.nextX : self.x+self.speed; }
    else if(self.nextX < self.x) { self.x = self.x-self.speed < self.nextX ? self.nextX : self.x-self.speed; }
    else if(self.nextY > self.y) { self.y = self.y+self.speed > self.nextY ? self.nextY : self.y+self.speed; }
    else if(self.nextY < self.y) { self.y = self.y-self.speed < self.nextY ? self.nextY : self.y-self.speed; }

    // Square out everything
    self.x = Math.round(self.x*100)/100
    self.y = Math.round(self.y*100)/100

    // I'm done with any animation i have, going forward
    if(self.x == self.nextX && self.y == self.nextY) {
      if     (ih.up)    self.nextY--;
      else if(ih.down)  self.nextY++;
      else if(ih.left)  self.nextX--;
      else if(ih.right) self.nextX++;
      else { self.slowKeys = 0; }

      if(self.slowKeys < 5) {
        self.slowKeys++;
        self.updateFacing();
        self.nextY = self.y;
        self.nextX = self.x;
      }

      if(self.x != self.nextX || self.y != self.nextY) {
        var nonWalkableTiles = [0,1,5];
        var type = maps.checkForType(self.nextX, self.nextY);
        if(nonWalkableTiles.indexOf(type) != -1) {
          self.stopMovement();
        }
        if(type == 1) {
        }
        if(type == 2) {
          self.nextY = self.nextY+  2;
        }
        if(type >= 7 && type <= 10) {
          var yDir = self.nextY-self.y;
          var xDir = self.nextX-self.x;

          if(type == 7 && (yDir == -1 || xDir != 0)) { self.stopMovement(); }
          else if(type == 10 && (yDir == 1 || xDir != 0)) { self.stopMovement(); }
          else if(type == 8 && (xDir == 1 || yDir != 0)) { self.stopMovement(); }
          else if(type == 9 && (xDir == -1 || yDir != 0))  { self.stopMovement(); }
          else {
            self.nextX += xDir;
            self.nextY += yDir;
            self.jumping = 30;
          }
          // One Way Streeets!

        }

      }


    }
  }

  self.stopMovement = function() {
    self.nextX = self.x;
    self.nextY = self.y;
  }
  self.superTick = 0;
  self.tempX     = 0;
  self.tempY     = 0;
  self.tmpMod    = 0;
  self.draw = function(){
    // UpdateFacing also confirms if he is in motion right now
    // Maybe find a better name for it? Checkmotion+UpdateFacing? :P
    let walking = self.updateFacing();

    if(self.jumping > 0) {
      let sprite = "walk-down1";
      let x = self.tempX;
      let y = self.tempY;
      if(self.superTick == 0) {
        x = Math.floor(self.x);
        y = Math.floor(self.y);
      }
      else if(self.superTick < 10) {
        y -= 0.01;
      }else if(self.superTick < 15) {
        sprite = "standing-down";
        self.tmpMod+=0.1;
        y += 0.1;
      }
      else if(self.superTick < 17) {
        self.tmpMod += 0.2;
        sprite = "walk-down1";
        y += 0.1;
      }
      else if (self.superTick < 30) {
        self.tmpMod-=0.08;
        sprite = "walk-down2";
        y+=0.1;
      }
      else if(self.superTick > 31){
        self.jumping   =  0;
        self.superTick = -1;
        self.tempX     =  0;
        self.tempY     =  0;
        self.tmpMod    =  0.24;
      }
      self.tempX = x;
      self.tempY = y;
      self.superTick ++;
      let cX = (self.tempX-maps.topX)
      let cY = (self.tempY-maps.topY);

/*
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cX+24, cY+self.tmpMod, 24, 12, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      ctx.restore();
*/
Img.player.drawSprite(self.tempX,self.tempY+self.tmpMod,"shadow");
Img.player.drawSprite(self.tempX,self.tempY,sprite);

    }
    else if(walking) {
      Img.player.drawAnimation(self.x,self.y,"walking-"+self.facing);
    }
    else {
      Img.player.drawSprite(self.x,self.y,"standing-"+self.facing);
    }
	}

  self.updateFacing = function() {
    if(self.nextX > self.x) { self.facing = "right"; }
    else if(self.nextX < self.x) { self.facing = "left"; }
    else if(self.nextY > self.y) { self.facing = "down"; }
    else if(self.nextY < self.y) { self.facing = "up"; }
    else {
      if(ih.right)       { self.facing = "right"; }
  		else if(ih.left)   { self.facing = "left"; }
  		else if(ih.down)   { self.facing = "down"; }
  		else if(ih.up)     { self.facing = "up"; }
      return false;
    }
    return true;
  }

  return self;
}
