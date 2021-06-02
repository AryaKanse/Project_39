var player,back,ground,playerJ,playerH;
var playerPic,backPic;
var obstacle1,obstacle2,obstacle3,obstacle4,coins;
var obstacleGroup,coinsGroup;
var points,score;
var START,PLAY,END;
var gamestate = "START";
var gameEndImg,gameEnd,restart,restartImg,start,startImg;

function preload(){
  
  playerPic = loadAnimation("running1.png","running2.png","running3.png");
  playerJ = loadAnimation("jump.png");
  playerH = loadAnimation("hurt.png");
  
  backPic = loadImage("Background.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  coins = loadImage("coins.png");
  
  gameEndImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  startImg = loadImage("start-button.png");
}

function setup() {
   createCanvas(600,300);
  
   back = createSprite(300,85,900,400);
   back.addImage(backPic);
   back.velocityX = -4;
   back.x = back.width/2;
   back.scale = 0.9;
  
   player = createSprite(50,170,20,40);
   player.addAnimation("running",playerPic);
   player.addAnimation("jump",playerJ);
   player.addAnimation ("hurt",playerH);
   player.scale = 0.22;
   
  player.setCollider("rectangle",0,0,30,85);
  // player.debug = true;
  
   ground = createSprite(100,225,900,20);
   ground.velocityX = -2;
   ground.x = ground.width/2;
   ground.visible = false;
  
   obstacleGroup = new Group();
   coinsGroup = new Group();
  
  start = createSprite(290,190,10,10);
  start.addImage(startImg);
  start.scale=0.3;
  
  gameEnd = createSprite(300,110);
  gameEnd.addImage(gameEndImg);
  gameEnd.scale =0.25;
  gameEnd.visible = false;
  
  restart = createSprite(300,200);
  restart.addImage(restartImg);
  restart.scale =0.06;
  restart.visible = false;
  
   points =0;
}

function draw() {
  background(0);
  if(gamestate==="START"){
    player.visible = false;
    back.visible = false;
    
    textSize(25);
    textFont("Segoe Print");
    fill("red");
    stroke("red");
    text("Save yourself from the hungry Lion !!",70,100);
    text("On the way collect the coins",110,130);
    
    if(mousePressedOver(start)){
      gamestate = "PLAY";
    }
  }
  if(gamestate ==="PLAY"){
    
    start.visible = false;
    
    back.visible = true;
    player.visible = true;
    
    back.x = ground.x;
    
    if(ground.x<300){
      ground.x = ground.width/2;
    }
    if(keyDown("space") && player.y >=130){
      player.velocityY = -8;
      player.changeAnimation("jump",playerJ);
    }
    if(player.isTouching(ground)){
      player.changeAnimation("running",playerPic);
    }
    
    player.velocityY = player.velocityY+0.7;
    
    OBSTACLE();
    spawnCoins();
    
    if(player.isTouching(coinsGroup)){
      coinsGroup.destroyEach();
      points = points+2
    }
     
    if(player.isTouching(obstacleGroup)){
      player.velocityY = 0;
      player.velocityX = 0;
      player.changeAnimation("hurt",playerH);
      
      obstacleGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);
      
      obstacleGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);
      
      gamestate = "END";
    }
  }
  else  if(gamestate === "END"){
      ground.velocityX = 0;
      back.velocityX = 0;
          
      gameEnd.visible = true;
      restart.visible = true;
    
      if(mousePressedOver(restart)){
        reset();
      }
     
    }   
    player.collide(ground);
    player.collide(obstacleGroup);
  
    drawSprites();
  
    fill("grey");
    textSize(16);
    stroke("grey");
    text("SCORE : "+points,500,40);
}
function reset(){
  gamestate = "PLAY";
  back.velocityX = -4;
  ground.velocityX = -2;
  gameEnd.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  coinsGroup.destroyEach();
  points = 0;

}
function OBSTACLE(){
  
  if(World.frameCount%150===0){
    
    var obstacle = createSprite(600,205,10,40);
    obstacle .velocityX = -(6+points/6);
    
    var abc = Math.round(random(1,3));
      switch(abc){
        case 1:obstacle.addImage(obstacle1);
             break;
        case 2:obstacle.addImage(obstacle2); 
             break;
        case 3:obstacle.addImage(obstacle3); 
             break;
        default :break;
      }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 500;
   
   //add each obstacle to the group
    obstacleGroup.add(obstacle);
    
   }
    obstacleGroup.depth = player.depth;
    player.depth = player.depth+1;
 }

function spawnCoins(){
  
  if(frameCount%110===0){
    
    var Coin = createSprite(600,140,10,20);
    Coin.velocityX = -5;
    Coin.y = Math.round(random(60,120));
    Coin.addImage(coins);
    
    //assign lifetime to the variable
    Coin.lifetime = 200;
    
    Coin.scale = 0.1;
    
    //adjust the depth
    Coin.depth = player.depth;
    player.depth = player.depth + 1;
    
    gameEnd.depth = Coin.depth;
    gameEnd.depth = gameEnd.depth+2;
    //add each cloud to the group
    coinsGroup.add(Coin); 
  }  
}