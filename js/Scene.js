"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    // bind this to some critical functions
    this.lostLife = this.lostLife.bind(this)
    this.hitBrick = this.hitBrick.bind(this)

    // Overlay element to print score
    const overlay = document.getElementById("overlay");
    this.overlay = overlay

    // Grab the result screen
    const resultScreen = document.getElementById("resultscreen")
    this.resultScreen = resultScreen

    // Other resultScreen related elements
    this.resultScreenElements = {
      score: document.getElementById("resultscreen__score"),
      lives: document.getElementById("resultscreen__lives"),
      result: document.getElementById("resultscreen__result"),
      modal: document.getElementById("resultscreen__modal")
    }

    // Shaders
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    
    // Programs
    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid)
    this.programs.push(this.solidProgram)

    // Geometries
    this.rectGeometry = new RectGeometry(gl)
    this.circleGeometry = new CircleGeometry(gl)

    // Time
    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    // Materials
    this.blackMaterial = new Material(this.solidProgram);
    this.blackMaterial.solidColor = new Vec3(0.0, 0.0, 0.0);

    this.violetMaterial = new Material(this.solidProgram);
    this.indigoMaterial = new Material(this.solidProgram);
    this.blueMaterial = new Material(this.solidProgram);
    this.greenMaterial = new Material(this.solidProgram);
    this.yellowMaterial = new Material(this.solidProgram);
    this.orangeMaterial = new Material(this.solidProgram);
    this.redMaterial = new Material(this.solidProgram);
    
    this.violetMaterial.solidColor =  new Vec3(0.31, 0.18, 0.31);
    this.indigoMaterial.solidColor =  new Vec3(0.29, 0.0, 0.51);
    this.blueMaterial.solidColor =  new Vec3(0.0, 0.0, 1.0);
    this.greenMaterial.solidColor =  new Vec3(0.0, 1.0, 0.0);
    this.yellowMaterial.solidColor =  new Vec3(1.0, 1.0, 0.0);
    this.orangeMaterial.solidColor =  new Vec3(0.8, 0.2, 0.2);
    this.redMaterial.solidColor =  new Vec3(1.0, 0.0, 0.0);

    this.colorMaterials = [this.violetMaterial, this.indigoMaterial, this.blueMaterial, this.greenMaterial, this.yellowMaterial, this.orangeMaterial, this.redMaterial]


    // Meshes
    this.paddleMesh = new Mesh(this.blackMaterial, this.rectGeometry)
    this.ballMesh = new Mesh(this.blackMaterial, this.circleGeometry)

    // Game Objects
    this.gameObjects = []
    this.addBricksToScene();

    // Game States
    this.BEFORE_START = 1
    this.RUNNING = 2
    this.GAME_LOST = 3
    this.GAME_WON = 4
    this.PAUSE = 5
    this.gameState = this.BEFORE_START

    // Pause state is used to save the velocity of the ball before and after pause
    this.pauseState = {
      ballVelocity: new Vec3(0.0, 0.0, 0.0),
      previousState: this.gameState 
    }

    this.score = 0
    this.brickCount = 0
    this.lives = 3

    var paddle = new GameObject(this.paddleMesh);
    paddle.isPaddle = true
    // paddle dimensions:
    // width: 0.2, height: 0.02
    paddle.width = 0.2

    var ball = new BallObject(this.ballMesh, this.hitBrick, this.lostLife);
    this.gameObjects.push(paddle)
    this.gameObjects.push(ball)

    // resize and reposition the ball
    ball.scale = new Vec3 (0.02, 0.02, 1)
    ball.position = new Vec3(0.0, -0.87, 0)
    // put ball on top for top reflection debugging
    // ball.position = new Vec3(0, 0.95, 0)

    // put paddle in the right row
    paddle.position = new Vec3(0.0, -0.9, 0.0)

    this.avatar = paddle
    this.ball = ball

    this.addComponentsAndGatherUniforms(...this.programs);

    // Camera
    this.camera = new OrthoCamera(this.programs);

  }

  addBricksToScene() {
    this.bricks = [];

    /* Some back of the envelope calculation
     * I want 7 rows, 10 cols of bricks
     * thick - 0.12 with 0.03 gap
     * width - 11 gaps, 10 cols = 2.0
     * say 10 * 0.18 = 1.80
     * 9 in the middle each 0.02 = 0.18
     * edges get 0.01
     * therefore, height is 0.12 (after scale)
     * width is 0.18 (after scale)
    */
    for (var i = 0; i < 7; i++) {
      // i is row
      const colorMaterial = this.colorMaterials[i];
      const colorBrickMesh = new Mesh(colorMaterial, this.rectGeometry);

      const brickHeight = 0.09;
      const brickWidth = 0.18;
      const brickPoints = (7 - i) * 10; // 10 for level 1, 20 for level 2 etc. etc.

      for (var j = 0; j < 10; j++) {
        // j is column
        var brick = new GameObject(colorBrickMesh);
        brick.scale = new Vec3(0.18 / 0.2, brickHeight / 0.02, 0.0);
        brick.position.x = -0.99 + 0.09 + j * 0.20;
        brick.position.y = 0.80 - i * (brickHeight + 0.03);
        brick.bottomY = brick.position.y - brickHeight / 2;
        brick.topY = brick.position.y + brickHeight / 2; // add half height
        brick.rightX = brick.position.x + brickWidth / 2;
        brick.leftX = brick.position.x - brickWidth / 2;
        brick.isBrick = true;
        brick.points = brickPoints;
        this.bricks.push(brick);
      }


    }

    this.gameObjects.push(...this.bricks);
  }

  hitBrick(brick) {
    this.score += brick.points
    this.brickCount += 1
    console.log(this.brickCount)
    if (this.brickCount == 70) {
      this.gameState = this.GAME_WON
    }
  }

  lostLife() {
    this.lives -= 1
    this.resetAfterLifeLost()
    if (this.lives == 0) {
      this.gameState = this.GAME_LOST
    }
  }

  resetAfterLifeLost() {
    this.avatar.position.set (0.0, -0.9, 0.0)
    this.ball.position.set(this.avatar.position.plus(0, 0.03, 0))
    this.ball.velocity.set(0, 0, 0)
    this.gameState = this.BEFORE_START
  }

  resetGame() {
    this.gameState = this.BEFORE_START
    // TODO: code to delete all bricks from screen first. Maybe we have too many bricks?
    this.addBricksToScene()

    this.score = 0
    this.brickCount = 0
    this.lives = 3

    this.avatar.position.set (0.0, -0.9, 0.0)
    this.ball.position.set(this.avatar.position.plus(0, 0.03, 0))
    this.ball.velocity.set(0, 0, 0)
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);

    this.camera.setAspectRatio(
      canvas.clientWidth /
      canvas.clientHeight ); 

  }

  pauseGame() {
    this.pauseState.ballVelocity.set(this.ball.velocity)
    this.ball.velocity.set(0.0, 0.0, 0.0)

    this.pauseState.previousState = this.gameState
    this.gameState = this.PAUSE
  }

  resumeGame() {
    this.ball.velocity.set(this.pauseState.ballVelocity)
    this.pauseState.ballVelocity.set(0.0, 0.0, 0.0)

    this.gameState = this.pauseState.previousState
    this.pauseState.previousState = this.PAUSE
  }

  displayWinScreen() {
    this.resultScreen.style.display = 'inline'
    this.resultScreenElements.result.innerHTML = 'won!'
    this.resultScreenElements.score.innerHTML = this.score
    this.resultScreenElements.lives.innerHTML = this.lives
    this.resultScreenElements.modal.style.backgroundColor = 'green'
  }

  displayLoseScreen() {
    this.resultScreen.style.display = 'inline'
    this.resultScreenElements.result.innerHTML = 'lost :('
    this.resultScreenElements.score.innerHTML = this.score
    this.resultScreenElements.lives.innerHTML = this.lives
    this.resultScreenElements.modal.style.backgroundColor = 'red'
  }

  clearResultScreen() {
    this.resultScreen.style.display = 'none'
  }


  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false

    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0; // converting from ms to seconds
    this.timeAtLastFrame = timeAtThisFrame;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;

    // Enable paddle movement
    // logic to prevent paddles from going beyond bounds
    if (this.gameState == this.BEFORE_START | this.gameState == this.RUNNING) {
      if (keysPressed["LEFT"] == true)
      this.avatar.position.x =  Math.max((this.avatar.position.x - 2* dt), -1);

      if (keysPressed["RIGHT"] == true)
      this.avatar.position.x = Math.min((this.avatar.position.x + 2* dt), +1);
    }

    // toggle pausing and resuming
    if (this.gameState == this.RUNNING || this.gameState == this.PAUSE) {
      if (keysPressed["ESCAPE"] == true) {
        keysPressed["ESCAPE"] = false
        if (this.gameState != this.PAUSE) {
          this.pauseGame()
        } else {
          this.resumeGame()
        }
      }
    }
    

    // General state management
    if (this.gameState == this.BEFORE_START) {
      // make sure that the ball moves along with the paddle, but only before the game starts
      this.ball.position.set(this.avatar.position.plus(0, 0.03, 0))
      if(keysPressed["SPACE"] == true) {
        const speed = 1.0
        var theta = Math.PI * Math.random() * (1/2) + Math.PI/4 // random angle from pi/4 - 3pi/4
        this.ball.velocity = new Vec3(speed * Math.cos(theta), speed * Math.sin(theta), 0.0)
        this.gameState = this.RUNNING
      }
    }
    else if (this.gameState == this.RUNNING) {
      
      // TODO: remove this. Only for debugging purposes
      if (keysPressed["R"] == true) {
        this.resetGame()
      }
    }
    else if (this.gameState == this.GAME_WON) {
      this.displayWinScreen()
      if (keysPressed['ENTER']) {
        this.resetGame()
        this.clearResultScreen()
      }
    } 
    else if (this.gameState == this.GAME_LOST) {
      this.displayLoseScreen()
      if (keysPressed['ENTER']) {
        this.resetGame()
        this.clearResultScreen()
      }
    }

    // update the game only in valid game states

    if (this.gameState == this.RUNNING || this.gameState == this.BEFORE_START) {
      // clear the screen
      gl.clearColor(1, 1, 1, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // control loop

      for (let idx = 0; idx < this.gameObjects.length; idx++) {
        if (this.gameObjects[idx].control)
          this.gameObjects[idx].control(keysPressed, this.gameObjects, dt)
      }


      // update loop

      this.camera.update(dt);

      for (let idx = 0; idx < this.gameObjects.length; idx++) {
        if (this.gameObjects[idx].move)
          this.gameObjects[idx].move(dt)
      }


      // draw loop
      for (let idx = 0; idx < this.gameObjects.length; idx++) {
        this.gameObjects[idx].draw(this, this.camera)
      }

      // print on the overlay
      this.overlay.innerHTML = `Score: ${this.score}<br/>Lives: ${this.lives}`
    }

    
  }
}
