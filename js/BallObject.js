class BallObject extends GameObject {
    constructor(mesh, hitBrick, lostLife) {
        super(mesh)
        this.radius = 0.02
        this.hitBrick = hitBrick
        this.lostLife = lostLife
    }

    control(keysPressed, gameObjects, dt) {
        // bounce off walls
        this.wallReflections()


        for (var gameObj of gameObjects) {
            if (gameObj.isBrick) {
                this.brickReflections(gameObj, gameObjects)
            } else if (gameObj.isPaddle) {
                this.paddleReflection(gameObj)
            }
        }
    }

    move(dt) {
        super.move(dt)
    }

    wallReflections() {

        if (this.position.x + this.radius >= 1.0) {
            // reflected off right wall
            this.velocity.x = -Math.abs(this.velocity.x)
            // console.log("right bounce")
        }
        else if (this.position.x + this.radius <= -1.0) {
            // reflected off left wall
            this.velocity.x = Math.abs(this.velocity.x)
            // console.log("left bounce")
        }
        else if (this.position.y + this.radius >= 1.0) {
            // reflected off top wall
            this.velocity.y = -Math.abs(this.velocity.y)
            // console.log("top bounce")
        }
        else if (this.position.y + this.radius <= -1.0) {
            // reflected off bottom wall
            // this.velocity.y = Math.abs(this.velocity.y)
            // No more bottom bounce. If this happens, you lose!
            // console.log("bottom bounce")
            this.lostLife()
        }
    }

    brickReflections(brick, gameObjects) {
        // bottom wall of brick
        if (this.position.x < brick.rightX && this.position.x > brick.leftX && this.position.y < brick.bottomY && brick.bottomY - this.position.y < this.radius) {
            // check if the ball is between the right and left bounds, is below the brick, and is within radius distance of brick
            this.velocity.y = -Math.abs(this.velocity.y)
            this.hitBrick(brick)
            this.deleteObjFromGameObjects(brick, gameObjects)

        } 
        // top wall
        else if (this.position.x < brick.rightX && this.position.x > brick.leftX && this.position.y > brick.topY && this.position.y - brick.topY < this.radius) {
            // check if the ball is between the right and left bounds, is below the brick, and is within radius distance of brick
            this.velocity.y = Math.abs(this.velocity.y)
            this.hitBrick(brick)
            this.deleteObjFromGameObjects(brick, gameObjects)
        } 
        // left wall
        else if (this.position.y < brick.topY && this.position.y > brick.bottomY && this.position.x < brick.leftX && brick.leftX - this.position.x < this.radius) {
            // console.log("left bounce")
            this.velocity.x = -Math.abs(this.velocity.x)
            this.hitBrick(brick)
            this.deleteObjFromGameObjects(brick, gameObjects)
        } 
        // right wall
        else if (this.position.y < brick.topY && this.position.y > brick.bottomY  && this.position.x > brick.rightX && this.position.x - brick.rightX < this.radius) {
            // console.log("right bounce")
            this.velocity.x = Math.abs(this.velocity.x)
            this.hitBrick(brick)
            this.deleteObjFromGameObjects(brick, gameObjects)
        }
        
    }

    paddleReflection(paddle) {
        // reflect the ball if it's above the paddle, within horizontal bounds, and within radius distance of paddle
        const paddleLeftX = paddle.position.x - paddle.width/2
        const paddleRightX = paddle.position.x + paddle.width/2
        if (this.position.y > paddle.position.y && this.position.y - paddle.position.y < this.radius && this.position.x > paddleLeftX && this.position.x < paddleRightX) {
            this.velocity.y = Math.abs(this.velocity.y)
        }
    }
}

