/*
 * FPS Counter Class
 * Usage: Read the code
 */


FPS = function(wanted) {
  var self = {
    wanted:wanted,
    interval:1000/wanted,
    then:performance.now(),
    fps:0,
    count:0,
    internalTimer: 0,
    calculateFps:1
  }

  self.readyForNewFrame = function() {
    let now = performance.now();
    let elapsed = now-self.then;
    if(elapsed >= self.interval) {
      if(self.calculateFps) {
        self.count ++;
        if(now-self.internalTimer >= 1000) {
          self.fps = self.count;
          self.count = 0;
          self.internalTimer = now;
        }
      }
      self.then = now - (elapsed % self.interval);
      return true;
    }
    return false;
  }

  return self;

}
