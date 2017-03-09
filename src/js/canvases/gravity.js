$(function () {
  
  // auxiliary functions
  var aux = {};
  aux.degreesToRadians = function (degrees) {
    return degrees * Math.PI / 180; 
  };
  // http://stackoverflow.com/questions/19689715/what-is-the-best-way-to-detect-retina-support-on-a-device-using-javascript
  aux.isHighDensity = function() {
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
  };
  
  // constants
  const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const IS_APPLE  = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  function prepareCanvas(options) {
    
    if (!options.canvasWidth) {
      throw new Error('canvasWidth is required');
    }
    
    if (!options.canvasHeight) {
      throw new Error('canvasHeight is required');
    }
    
    if (!options.canvas) {
      throw new Error('canvas is required');
    }
    
    // wall variables
    var wallWidth = 50;
    var floorPadding = 5;
    var sideWallPadding = 3;
    
    var canvasWidth = options.canvasWidth;
    var canvasHeight = options.canvasHeight + 5;
    var canvas = options.canvas;
    
    // direct access to classes
    var Engine = Matter.Engine;
    var Render = Matter.Render;
    var Common = Matter.Common;
    var Bodies = Matter.Bodies;
    var Runner = Matter.Runner;
    var Composites = Matter.Composites;
    var Events = Matter.Events;
    var World = Matter.World;
    var Vector = Matter.Vector;
    var Mouse = Matter.Mouse;
    var MouseConstraint = Matter.MouseConstraint;
    
    // instances
    var engine = Engine.create();
    var world  = engine.world;
    
    // define world-wide configs
    world.gravity = {
      x: Common.random(-0.2, 0.2),
      // y: 1.4,
      y: Common.random(0.2, 2),
    };

    // pixelRatio 2 makes experience laggy
    // var pixelRatio = aux.isHighDensity() ? 2 : 1;
    var pixelRatio = aux.isHighDensity() ? 1 : 1;
    
    var render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        pixelRatio: pixelRatio,
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false,
        background: '#f5f5f5',
      }
    });
    
    Render.run(render);
    
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);
    
    // create squares
    var squaresStackCompositeTop = IS_MOBILE ? 50 : -500;
    var squaresStackComposite = Composites.stack(0, squaresStackCompositeTop, 32, 5, 0, 0, function (x, y) {
      var size = Common.random(5, 60);
      var angle = aux.degreesToRadians(Common.random(0, 45));
      
      return Bodies.rectangle(
        x,
        y,
        size,
        size,
        {
          angle: angle,
          restitution: 0.1,
          render: {
            fillStyle: '#3eeeb7',
            strokeStyle: '#0adda6',
            lineWidth: 2,
          }
        }
      );
    });
    // make a clone of the squares bodies
    var squares = squaresStackComposite.bodies.concat([]);
    
    // add bodies to the world
    World.add(world, [
      squaresStackComposite,
      // roof
      Bodies.rectangle(
        canvasWidth / 2,
        -1.5 * canvasHeight,
        canvasWidth,
        wallWidth,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        }
      ),
      // floor
      Bodies.rectangle(
        canvasWidth / 2,
        canvasHeight + (wallWidth / 2) - floorPadding,
        canvasWidth,
        wallWidth,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        }
      ),
      // right
      Bodies.rectangle(
        canvasWidth + wallWidth / 2 - sideWallPadding,
        canvasHeight / 2,
        wallWidth,
        canvasHeight * 100,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        }
      ),
      // left
      Bodies.rectangle(
        - wallWidth / 2 + sideWallPadding,
        canvasHeight / 2,
        wallWidth,
        canvasHeight * 100,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        }
      ),
    ]);
    
    if (!IS_MOBILE) {

      setTimeout(function () {
        // add obstacle for the button
        var startNowButtonPos = $('#start-now-buttons').offset();
        var startNowButtonH = $('#start-now-buttons').height();
        var startNowButtonW = $('#start-now-buttons').width();
        
        // obstacle
        World.add(world, Bodies.rectangle(
          startNowButtonPos.left + (startNowButtonW/2),
          startNowButtonPos.top + (startNowButtonH/2),
          startNowButtonW,
          startNowButtonH,
          {
            isStatic: true,
            render: {
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
            }
          }
        ));
      }, 300);
    }
    
    
    if (IS_MOBILE) {
      // no mouse control in mobile
      
      if (window.DeviceMotionEvent !== undefined) {
        // mobile roof
        World.add(world, [
          Bodies.rectangle(
            canvasWidth / 2,
            (- 1 * (wallWidth / 2)) - floorPadding,
            canvasWidth,
            wallWidth,
            {
              isStatic: true,
              render: {
                visible: false,
              }
            }
          ),
        ]);
        
      	window.addEventListener('devicemotion', function(e) {
      		var ax = event.accelerationIncludingGravity.x * 0.6;
      		var ay = event.accelerationIncludingGravity.y  * 0.6;
      		
  		    // define world-wide configs
          world.gravity = {
            x: ax,
            y: IS_APPLE ? ay : ay * -1,
          };		
      	});
      } 
      
    } else {
      // add mouse control
      var mouse = Mouse.create(render.canvas);
      var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 1,
          render: {
            visible: false,
          }
        }
      });
      // https://github.com/liabru/matter-js/issues/84
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      
      World.add(world, mouseConstraint);
      
      // mouse events
      var isDragging = false;
      var wasDragging = false;
      Events.on(mouseConstraint, 'startdrag', function (e) {
        isDragging = true;
      });
      Events.on(mouseConstraint, 'enddrag', function (e) {
        isDragging = false;
        wasDragging = true;
        
        setTimeout(function () {
          wasDragging = false;
        }, 500);
      });
      Events.on(mouseConstraint, 'mousemove', function (e) {
        
        if (isDragging) {
          return;
        }
        
        // console.log('mousemove', e.mouse.absolute);
        var mousePosition = e.mouse.absolute;
        var target = Matter.Query.point(squares, mousePosition)[0];
        
        if (!target) {
          return;
        }
        
        var magnitude = 0.05 * target.mass;
        var direction = Matter.Vector.create(0, -1); // always up
        var force = Matter.Vector.mult(direction, magnitude);
        Matter.Body.applyForce(target, target.position, force);
      });
      
      Events.on(mouseConstraint, 'mouseup', function (e) {
        
        if (wasDragging) {
          return;
        }
        
        // console.log('mouseup', e);
        var size = Common.random(5, 60);
        var angle = aux.degreesToRadians(Common.random(0, 45));
        
        var newSquare = Bodies.rectangle(
          e.mouse.mouseupPosition.x,
          e.mouse.mouseupPosition.y,
          size,
          size,
          {
            angle: angle,
            restitution: 0.1,
            render: {
              fillStyle: '#3eeeb7',
              strokeStyle: '#0adda6',
              lineWidth: 2,
            }
          }
        );
        
        // save to the list of squares
        squares.push(newSquare);
        World.add(world, newSquare);
      });
    }
    
    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function() {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
      }
    }
  }

  var $home = $('#section-home');

  var matterCtrl = prepareCanvas({
    canvas: document.querySelector('#home-canvas'),
    canvasWidth: document.body.clientWidth,
    canvasHeight: $home.height(),
  });

  setTimeout(function () {
    
    $('#thanks').addClass('active');
    
  }, 6000);
});
