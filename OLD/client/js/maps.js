Maps = function(id, img) {
  var self = {
    id:id,
    image:new Image(),
    topX:0,
    topY:0,
    centerX:0,
    centerY:0,
    doDrawGrid:0
  }

  self.image.src = img;

  self.draw = function() {
    let x = (player.x - Math.floor(WIDTH / TILE_WIDTH / 2)) * TILE_WIDTH;
    let y = (player.y - Math.floor(HEIGHT / TILE_HEIGHT / 2)) * TILE_HEIGHT;

    x = Math.round(x)
    y = Math.round(y)

    ctx.drawImage(self.image,x/3,y/3,WIDTH/3, HEIGHT/3,0,0,WIDTH,HEIGHT);

    self.topX = x / TILE_WIDTH;
    self.topY = y / TILE_HEIGHT;
    self.centerX = self.topX + Math.floor(WIDTH / TILE_WIDTH / 2);
    self.centerY = self.topY + Math.floor(HEIGHT / TILE_WIDTH / 2);

    if(self.doDrawGrid) self.drawGrid();
  }

  self.drawGrid = function() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    let y = 0.5;
    while(y < 700) {
      if(y > 0) {
      ctx.moveTo(0,y);
      ctx.lineTo(900,y);
      ctx.stroke();
      }
      y += TILE_HEIGHT;
    }
    let x = 0.5;
    while(x < 900) {
      if(x > 0) {
      ctx.moveTo(x,0);
      ctx.lineTo(x,900);
      ctx.stroke();
      }
      x += TILE_WIDTH;
    }
  }

  return self;
}
