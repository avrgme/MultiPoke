// MUST REMEMBER:
// Cheat prevention
// Move events to server side!

// Personal events
// Warp
// Script Events
// Signpost
// Flying position

Events = function() {
  var self = {
    events:[]
  }

  self.activate = function(coords,entity) {

    if(event = self.findEvent(coords)) {
      console.log("Someone activated me! Yeeh");
      event.activate(entity);
    }
  }

  self.findEvent = function(coords) {
    for(let i = 0; i < self.events.length; i++) {
      if(self.events[i].x == coords.x && self.events[i].y == coords.y) {
        return self.events[i];
      }
    }
    return false;
  }

  self.addEvent = function(type,id,data) {
    self.events.push ({
      type:type,
      id:id,
      data:data
    });
  }

  self.addSignpost = function(id, x, y, message) {
    self.events.push({
      type:3,//Signpost
      id:id,
      x:x,
      y:y,
      activate:function(ent){
        console.log(message);
      }
    });
  }

  return self;
}

var events = Events();

var allEvents = [
  {type:3,id:1,x:69,y:270,},

]

events.addSignpost(0,69,270,"ROUTE 2\nVIRIDIAN CITY - PEWTER CITY");

events.addEvent(0,76,275,"warp",function(entity) {
  if(entity == null) return false;
  entity.nextX = 66;
  entity.nextY = 266;
  entity.x = 66;
  entity.y = 266;
});

events.addEvent(1,65,273,"sign",function(entity){

  console.log("This is a cool sign, made out of wood!");
});
