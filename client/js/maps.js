Maps = function(id) {
  self = {
    id:id,
    json:{},
    jsonFile:"maps/"+id+"/json",
    tileset:"maps/"+id+"/img",
    topX:0,
    topY:0,
    preloaded:false,
    doDrawGrid:0
  }

  self.map = new ImageEngine("map_"+self.id, "tileset", self.tileset);

  var request = new XMLHttpRequest();
  request.open('GET', self.jsonFile, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      self.json = JSON.parse(request.responseText);
      self.tilset = self.json.tilesets[0].image;
      self.preloaded= true;
    } else {
    }
  };
  request.send();

  self.findLayer = function(name) {
    for(var l in self.json.layers) {
      if(self.json.layers[l].name == name) return self.json.layers[l];
    }
    return false;
  }


  self.drawLayer = function(layer) {
    layer = self.findLayer(layer);
    let columns = 68;
    let screenWidth = WIDTH / (TILE_WIDTH * SCALE_MULTIPLIER);
    let screenHeight = HEIGHT / (TILE_HEIGHT * SCALE_MULTIPLIER);
    self.topX = player.x - Math.floor(screenWidth / 2) ;
    self.topY = player.y - screenHeight / 2;

    // Offset for smooth screen tile placement and animation
    let offsetX = Math.floor(player.x) - player.x;
    let offsetY = Math.floor(player.y) - player.y;

    // On end of map make it stop moving
    if(screenWidth > layer.width-self.topX) {
      self.topX = layer.width - screenWidth;
      offsetX = 0;
    }
    else if(self.topX < 0) {
      self.topX = 0;
      offsetX = 0;
    }

    // On end of map make it stop moving
    if(screenHeight > layer.height-self.topY) {
      self.topY = layer.height - screenHeight;
      offsetY = 0;
    }
    else if(self.topY < 0) {
      self.topY = 0;
      offsetY = 0;
    }

    for(var y = self.topY; y < self.topY+screenHeight+2;y++) {
      for(var x = self.topX; x < self.topX+screenWidth+1;x++) {
        var dataPos = Math.floor(x) + (Math.floor(y) * layer.width);
        if(dataPos > 0) {
          var tile  = layer.data[dataPos]-1;
          var tileY = Math.floor(tile/columns);
          var tileX = tile - ( tileY * columns);
          ctx.save();
          ctx.globalAlpha = layer.opacity;
          self.map.drawTile(tileX,tileY,x+offsetX,y+offsetY);
          ctx.restore();
        }
      }
    }
    if(self.doDrawGrid) self.drawGrid();
  }

  self.checkForType = function(x,y) {
    var layer = self.findLayer("movement");
    if(!layer) return 1;
    var dataPos = Math.floor(x) + (Math.floor(y) * layer.width);
    var tile = layer.data[dataPos]-1;
    return tile;
  }

  self.drawGrid = function() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    let y = (TILE_HEIGHT*SCALE_MULTIPLIER / 2)+0.5;
    while(y < HEIGHT) {
      ctx.moveTo(0,y);
      ctx.lineTo(WIDTH,y);
      ctx.stroke();
      y += TILE_HEIGHT*SCALE_MULTIPLIER;
    }
    let x = 0.5;
    while(x < WIDTH) {
      ctx.moveTo(x,0);
      ctx.lineTo(x,HEIGHT);
      ctx.stroke();
      x += TILE_WIDTH*SCALE_MULTIPLIER;
    }
    ctx.restore();
  }
  return self;
}
