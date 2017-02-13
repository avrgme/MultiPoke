
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
    collision:1,
    jumping:0,
    running:0,
    walking:0,
    speed:0.1
	};

	self.update = function() {
		self.updatePosition();
		self.draw();
	}

	self.draw = function(){

		self.img.drawSprite(self.x,self.y,"standing-down");
	}

  self.updatePosition = function(){
    // Add some animation
    if(self.nextX > self.x) { self.x = self.x+self.speed > self.nextX ? self.nextX : self.x+self.speed; }
    else if(self.nextX < self.x) { self.x = self.x-self.speed < self.nextX ? self.nextX : self.x-self.speed; }
    else if(self.nextY > self.y) { self.y = self.y+self.speed > self.nextY ? self.nextY : self.y+self.speed; }
    else if(self.nextY < self.y) { self.y = self.y-self.speed < self.nextY ? self.nextY : self.y-self.speed; }

    // Square out everything
    self.x = Math.round(self.x*100)/100
    self.y = Math.round(self.y*100)/100

  }

  self.stopMovement = function() {
    self.nextX = Math.round(self.x);
    self.nextY = Math.round(self.y);
  }

  self.testCollision = function(ent) {
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
