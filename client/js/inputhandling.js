

InputHandling = function()  {
  var self = {
    down   : false,
    up     : false,
    left   : false,
    right  : false,
    a      : false,
    b      : false,
    start  : false,
    select : false,

    keycodes : {
      down   : 83, // S
      up     : 87, // W
      left   : 65, // A
      right  : 68, // D
      a      : 69, // E
      b      : 81, // Q
      start  : 13, // ENTER
      select : 32, // SPACE
    }
  };

  // Disable Right Click
  document.oncontextmenu = function(e){ e.preventDefault(); }

  document.onkeydown = function(e){
    for(id in self.keycodes) {
      if(self.keycodes[id] == e.keyCode) self[id] = true;
    }
  }
  document.onkeyup = function(e){
    for(id in self.keycodes) {
      if(self.keycodes[id] == e.keyCode) self[id] = false;
    }
  }


  return self;
}
