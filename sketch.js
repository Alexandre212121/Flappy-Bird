//Declaring the variables
//bird
var bird, birdCollided

//obstacles
var obstaclesGroup

//ground and roof boundaries
var groundBoundary, roofBoundary

//base
var base

//score
var score = 0  
var scoreDetector

//gameState
const start = 0
const play = 1
const collided = 2

var gameState = start

function preload(){
    b1 = loadAnimation("./images/bluebird-downflap.png", "./images/bluebird-midflap.png", "./images/bluebird-upflap.png")
    b2 = loadAnimation("./images/redbird-midflap.png")
    b3 = loadAnimation("./images/bluebird-midflap.png")

    oInf = loadImage("./images/pipe-greenUp.png")
    oSup = loadImage("./images/pipe-greenDown.png")

    gameOvr = loadImage("./images/gameover.png")
    groundImg = loadImage("./images/base.png")
    backgroundImg = loadImage("./images/background-day.png")
    baseImg = loadImage("./images/base.png")

    numbers = []
    numbers[0] = loadImage("./images/0.png")
    numbers[1] = loadImage("./images/1.png")
    numbers[2] = loadImage("./images/2.png")
    numbers[3] = loadImage("./images/3.png")
    numbers[4] = loadImage("./images/4.png")
    numbers[5] = loadImage("./images/5.png")
    numbers[6] = loadImage("./images/6.png")
    numbers[7] = loadImage("./images/7.png")
    numbers[8] = loadImage("./images/8.png")
    numbers[9] = loadImage("./images/9.png")
}

function setup(){
    let cnv = createCanvas(900, 600)
    
    bg = createSprite(cnv.width/2, cnv.height/2, cnv.width, cnv.height)
    backgroundImg.resize(cnv.width, cnv.height)
    bg.addImage("background", backgroundImg)

    bird = createSprite(150, 285, 35, 35)
    bird.setCollider("rectangle", 0, 0, 35, 35)
    bird.addAnimation("bird1", b1)
    bird.addAnimation("bird2", b2)
    bird.addAnimation("bird3", b3)

    scoreDetector = createSprite(bird.x - 50, cnv.height/2, 5, cnv.height)
    scoreDetector.visible = false
    
    bg.depth = bird.depth - 1

    groundBoundary = createSprite(450, 600, 900, 30)
    groundBoundary.visible = false
    roofBoundary = createSprite(450,0, 900, 15)
    roofBoundary.visible = false

    base = createSprite(10, 500, 400, 400)
    base.shapeColor = color(48, 20, 8)
    

    gameOver = createSprite(cnv.width/2, cnv.height/2, 50, 50)
    gameOver.addImage("gameover", gameOvr)
    gameOver.scale = 1.5
    gameOver.visible = false

    obstaclesGroup = new Group()

}
 
function draw(){
    background(130)

    if(gameState == start){
        bird.changeAnimation("bird3")
        if(keyWentDown("space") || touches.length > 0){
            bird.velocityY = -10
            gameState = play
            touches = []
        }
    }

    if (gameState == play){
        bird.changeAnimation("bird1")
        
        if(base.x > -200){
            base.velocityX = -5
        }
        else{
            base.velocityX = 0
        }
        
        base.lifetime = -1

        bird.velocityY += 1 

        if(bird.isTouching(groundBoundary)){
            bird.velocityY = 0
        }

        bird.collide(groundBoundary)
        bird.collide(roofBoundary)

        birdMovement()
        generateObstacles()
        detectCollision()
        updateScore()
    }
    
    if(gameState == collided){
        gameOver.visible = true 
        reset()
    }

    drawSprites()
    drawScore()
}

function birdMovement(){
    if(keyWentDown("space") || touches.length > 0){
        bird.velocityY = -10
        touches = []
    }
}

function generateObstacles(){
    if(frameCount % 80 == 0){
        var k = 400 * Math.random()

        var obstacleInf = createSprite(950, 400 + k, 50, 450)
        var obstacleSup = createSprite(950, -200 + k, 50, 450)
        
        obstacleInf.isBottom = true
        obstacleInf.passed = false

        obstacleSup.isBottom = false
        obstacleInf.velocityX = -5
        obstacleSup.velocityX = -5

        oInf.resize(obstacleInf.width, obstacleInf.height)
        obstacleInf.addImage("oInf", oInf)
        oSup.resize(obstacleSup.width, obstacleSup.height)
        obstacleSup.addImage("oSup", oSup)

        obstaclesGroup.add(obstacleInf)
        obstaclesGroup.add(obstacleSup)

        obstacleInf.depth = gameOver.depth - 1
        obstacleSup.depth = gameOver.depth - 1
        
        obstacleInf.lifetime = 950/2
        obstacleSup.lifetime = 950/2
    }
    
    
    

    

    
}

function detectCollision(){
    if(bird.isTouching(obstaclesGroup)){
        obstaclesGroup.setVelocityXEach(0)
        obstaclesGroup.setLifetimeEach(-1)

        bird.changeAnimation("bird2")
        bird.velocityY = 0

        gameState = collided
    
    }
}

function reset(){
    if(keyWentDown("space") || touches.length > 0){
            gameState = start

            touches = []

            obstaclesGroup.destroyEach()
            
            base.x = 10
    
            gameOver.visible = false

            bird.y = 285

            score = 0
    }
}

function updateScore(){
    for(let i = 0; i < obstaclesGroup.length; i++){
        let obs = obstaclesGroup[i]

        if(obs.isBottom){
            if (obs.passed === false && obs.x < bird.x){
            obs.passed = true
            score = score + 1
            }
        }
    }   
}

function drawScore(){
    let scoreStrg = score.toString()

    for(let i = 0; i < scoreStrg.length; i++){
        let digit = int(scoreStrg[i])
        image(numbers[digit], 20 + i*20, 50)
    }
}
