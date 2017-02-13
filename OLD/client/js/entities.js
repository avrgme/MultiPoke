
Entity = function(type,id,x,y,facing,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
    nextX:x,
    nextY:y,
		img:img,
    facing:facing,
    speed:0.1
	};
	self.update = function() {
		self.updatePosition();
		self.draw();
	}
	self.draw = function(){
		let x = self.drawX;
		let y = self.drawY;
		self.img.drawImage(x,y);
	}
  self.updatePosition = function(){
    self.drawX = self.x;
    self.drawY = self.y;
  }
  self.testCollision = function(ent) {
    return ((self.nextX == ent.x) && (self.nextY == ent.y));
  }

	return self;
}

Player2 = function(id,x,y,bank,map) {
  var self = {
    id:id,
    position : {
      x:x,
      y:y,
      map:{bank:bank,no:map}
    }
  }

  self.pressingUp         = false;
  self.pressingDown       = false;
  self.pressingLeft       = false;
  self.pressingRight      = false;
  self.pressingUse        = false;
  self.pressingMouseLeft  = false;
  self.pressingMouseRight = false;
  self.slowKeys           = 0;
  self.lastKey            = false;

  self.update = function() {
    self.updatePosition();
    self.draw();
  }

  self.updatePosition = function(){
    if(self.pressingRight)       self.position.x++;
    else if(self.pressingLeft)   self.position.x--;
    else if(self.pressingDown)   self.position.y++;
    else if(self.pressingUp)     self.position.y--;
  }

  self.draw = function(){
    self.img.drawSprite(maps.centerX, maps.centerY, "standing-down");
	}

  return self;
}

Player = function(x,y,id){
	var self = Entity('player',id,x,y,"down",Img.player);
  self.pressingUp         = false;
  self.pressingDown       = false;
  self.pressingLeft       = false;
  self.pressingRight      = false;
  self.pressingUse        = false;
  self.pressingMouseLeft  = false;
  self.pressingMouseRight = false;
  self.slowKeys           = 0;
  self.lastKey            = false;

  self.updatePosition = function(){
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

      // TEMPORARY
      if(self.pressingMouseLeft) self.speed=100;
      else self.speed = 0.1;

      if(self.pressingRight)  self.nextX = self.x + 1;
  		else if(self.pressingLeft)   self.nextX = self.x - 1;
      else if(self.pressingDown)        self.nextY = self.y + 1;
      else if(self.pressingUp)     self.nextY = self.y - 1;
      else { self.slowKeys = 0;}

      if(self.slowKeys < 3) {
        self.slowKeys++;
        self.updateFacing();
        self.nextY = self.y;
        self.nextX = self.x;
      }

      if(self.testCollision({x:69, y:270}) ||
         self.testCollision({x:65, y:273}) ||
         self.testCollision({x:76, y:275})) {
        self.nextY = self.y;
        self.nextX = self.x;
      }

      if(self.pressingUse) {
        let tmpX = self.x;
        let tmpY = self.y;
        if(self.facing == "up")    { tmpY -= 1; }
        if(self.facing == "down")  { tmpY += 1; }
        if(self.facing == "left")  { tmpX -= 1; }
        if(self.facing == "right") { tmpX += 1; }

        events.activate({x:tmpX,y:tmpY},self)
      }
      //events.activate(self,self);


    }
  }
  self.draw = function(){
    let walking = true;
    // UpdateFacing also confirms if he is in motion right now
    // Maybe find a better name for it? Checkmotion+UpdateFacing? :P
    if(!self.updateFacing()) walking = false;

    if(walking)
      self.img.drawAnimation(maps.centerX, maps.centerY, "walking-"+self.facing);
    else
      self.img.drawSprite(maps.centerX, maps.centerY, "standing-"+self.facing);
	}

  self.updateFacing = function() {
    if(self.nextX > self.x) { self.facing = "right"; }
    else if(self.nextX < self.x) { self.facing = "left"; }
    else if(self.nextY > self.y) { self.facing = "down"; }
    else if(self.nextY < self.y) { self.facing = "up"; }
    else {
      if(self.pressingRight)       { self.facing = "right"; }
  		else if(self.pressingLeft)   { self.facing = "left"; }
  		else if(self.pressingDown)   { self.facing = "down"; }
  		else if(self.pressingUp)     { self.facing = "up"; }
      return false;
    }
    return true;
  }

	return self;
}

NPC = function(x,y,id,movement){
  var self = Entity('NPC',id,x,y,"down",Img.npc);
  self.movement = movement;
  self.movementIncrement = 0;
  self.rndWait = 0;
  self.rndWaitNumb = 0;

  self.updatePosition = function(){
    if(self.movement.length == 1) {
      self.rndWait = 1;
      self.getNextPosition();
      return;
    }


    if(self.nextX > self.x)      { self.x = self.x+self.speed > self.nextX ? self.nextX : self.x+self.speed; }
    else if(self.nextX < self.x) { self.x = self.x-self.speed < self.nextX ? self.nextX : self.x-self.speed; }
    else if(self.nextY > self.y) { self.y = self.y+self.speed > self.nextY ? self.nextY : self.y+self.speed; }
    else if(self.nextY < self.y) { self.y = self.y-self.speed < self.nextY ? self.nextY : self.y-self.speed; }

    if (self.nextX == self.x && self.nextY == self.y) {
      if(self.rndWait >= self.rndWaitNumb) {
        self.getNextPosition();
        self.rndWait = 0;
        self.rndWaitNumb = Math.random()*100;
      }
      else {
        self.rndWait++;
      }
    }

/*
}*/

  }

  self.draw = function(){
    let walking = true;
    // Check if i'm heading somewhere
    if     (self.nextX > self.x) { self.facing = "right"; }
    else if(self.nextX < self.x) { self.facing = "left"; }
    else if(self.nextY > self.y) { self.facing = "down"; }
    else if(self.nextY < self.y) { self.facing = "up"; }
    else walking = false;

    if(walking)
      self.img.drawAnimation(self.x, self.y, "walking-"+self.facing);
    else {
      self.img.drawSprite(self.x, self.y, "standing-"+self.facing);
    }
	}


  self.getNextPosition = function() {
    let nd = self.movement[self.movementIncrement];
    if(nd == "U") { self.nextY = self.y - 1; }
    if(nd == "D") { self.nextY = self.y + 1; }
    if(nd == "L") { self.nextX = self.x - 1; }
    if(nd == "R") { self.nextX = self.x + 1; }
    self.movementIncrement++;
    if(self.movementIncrement >= self.movement.length) {
      self.movementIncrement = 0;
    }
  }
  return self;
}
