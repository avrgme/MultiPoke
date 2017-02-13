// * Jortenmilo's Class "Remodified"! ;D * //

Gameloop = function( fps , tps , main ) {
  var self = {
    fps:fps,
    tps:tps,
    main:main,
    fpsInterval:false,
    tpsInterval:false,
    then:performance.now(),
    internalTimer:performance.now(),
    fpsCount:0,
    count:0
  }

	self.start = function() {
		//self.fpsInterval = setInterval(self.main.render, 1000/self.fps);
		self.tpsInterval = setInterval(self.main.tick, 1000/self.tps);
    self.renderLoop();

	}

  self.renderLoop = function() {
    window.requestAnimationFrame( self.renderLoop );
    let now = performance.now();
    let elapsed = now-self.then;
    if(elapsed >= 1000/self.fps) {
      self.count ++;
      if(now-self.internalTimer >= 1000) {
        self.fpsCount = self.count;
        self.count = 0;
        self.internalTimer = now - ((now-self.internalTimer) % 1000/self.fps);
      }
      self.then = now - (elapsed % 1000/self.fps);
      self.main.render();
    }
  }

  return self;
}
