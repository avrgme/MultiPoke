var yy = 266;
var xx = 66;
var zz = 1;
Main = function() {
  var self = {};

  self.render = function() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw stuff
    maps.drawLayer("ground");
    maps.drawLayer("movement");
    Img.npc.drawAnimation(xx,yy,"walking-"+(zz > 0?"down":"up"));
    player.draw();
    for(i in entities) { entities[i].update(); }
    maps.drawLayer("top");


    // Show debug data:
    ctx.font = "15px Arial";
    ctx.fillText("FPS: "+gameloop.fpsCount + "X: "+player.x+ "Y: "+player.y,10,50);
  }

  self.tick = function() {
    // Loop trough all images, and update the tick for them
    for(i in Img) { Img[i].animationTick(); }
    player.updatePosition();

    yy += 0.1*zz;
    if(yy > 270) { zz *= -1; }
    if(yy < 266) { zz *= -1; }
  }

  return self;
}
