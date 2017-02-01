$(function () {
  
  var aux = {};
  
  aux.degreesToRadians = function (degrees) {
    return degrees * Math.PI / 180; 
  };
  
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
    var World = Matter.World;
    var Mouse = Matter.Mouse;
    var MouseConstraint = Matter.MouseConstraint;
    
    // instances
    var engine = Engine.create();
    var world  = engine.world;
    
    // define world-wide configs
    world.gravity = {
      x: Common.random(-0.2, 0.2),
      y: Common.random(0.2, 2),
    };
    
    var render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
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
    var squares = Composites.stack(0, -500, 32, 5, 0, 0, function (x, y) {
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

    var buttonPos = $('#start-now-buttons').offset();
    var buttonHeight = $('#start-now-buttons').height();
    var buttonWidth = $('#start-now-buttons').width();
    
    // add bodies to the world
    World.add(world, [
      squares,
      // obstacle
      Bodies.rectangle(
        buttonPos.left + (buttonWidth/2),
        buttonPos.top + (buttonHeight/2),
        buttonWidth,
        buttonHeight,
        {
          isStatic: true,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'transparent',
            lineWidth: 0,
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
        canvasHeight,
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
        canvasHeight,
        {
          isStatic: true,
          render: {
            visible: false,
          }
        }
      ),
    ]);
    
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
  
  var matterCtrl = prepareCanvas({
    canvas: document.querySelector('#home-canvas'),
    canvasWidth: document.body.clientWidth,
    canvasHeight: window.innerHeight,
  });
});
