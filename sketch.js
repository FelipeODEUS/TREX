var trex, trex_correndo;
var trex_perdeu;
var solo, soloinvisivel, imagemdosolo;
var nuvem, imagemdanuvem, grupodenuvens;
var Obs1,Obs2,Obs3,Obs4,Obs5,Obs6, grupodeobstaculos;
var score;
var imagemtexto, imagemrestart;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var somJump, somCheckPoint, somDie;


function preload() {
  //Carrega as nossas imagens (como imagens ou animações)
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_perdeu = loadAnimation("trex_collided.png");
  imagemdosolo = loadImage("ground2.png");
  imagemdanuvem = loadImage("cloud.png");
  Obs1 = loadImage("obstacle1.png");
  Obs2 = loadImage("obstacle2.png");
  Obs3 = loadImage("obstacle3.png");
  Obs4 = loadImage("obstacle4.png");
  Obs5 = loadImage("obstacle5.png");
  Obs6 = loadImage("obstacle6.png");
  imagemtexto = loadImage("gameOver.png");
  imagemrestart = loadImage("restart.png");
  somJump = loadSound("jump.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  somDie = loadSound("die.mp3");

}

function setup() {
  //cria a nossa área do jogo (retangular)
  createCanvas(600, 200);
  
  //exemplo de ESCOPO de variável
  var mensagem = "Isso é uma mensagem";
  console.log(mensagem);
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_perdeu);
  trex.scale = 0.5;
  
  
  //criar um sprite do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  
  //criar um sprite do solo invisível (que o T-rex está pisando)
  soloinvisivel = createSprite(150,190,400,10);
  soloinvisivel.visible = false;
  
  //criar os grupos de nuvens e obstáculos
  grupodenuvens = new Group();
  grupodeobstaculos = new Group();
  
  //cria os sprites para o texto de Game Over e o botão de Reiniciar
  GameOver = createSprite(300,100);
  GameOver.addImage(imagemtexto);
  GameOver.scale = 0.5;
  Reiniciar = createSprite(300,140);
  Reiniciar.addImage(imagemrestart);
  Reiniciar.scale = 0.5;
  
  //Imprimir a mensagem Oi5 no console
  //console.log("Oi"+5);
  
  //cria uma variável com um número aleatório arredondado
  //var rand = Math.round(random(1,100));
  //imprimir o valor da variável rand
  //console.log(rand);
  
  //Define a pontuação inicial
  score = 0;
  
  //Altera o raio de colisão do T-Rex
  trex.setCollider("circle",0,0,40);
  //trex.debug=true;
}

function draw() {
  //pinta a cor do fundo
  background('#0000CD');
  
  
  
  //Imprime a pontuação (espaço percorrido)
  text("KM:" + score, 500, 100);
  //Mostrando o estado do Jogo (1=JOGAR, 0=ENCERRAR)
  //console.log("Estado:",estadoJogo);
  
  
  //cria as condições para os estados do Jogo
  if(estadoJogo === JOGAR){
    //faz o solo se mover
    solo.velocityX = -(4 + 3*score/100);
    //Pontuação de acordo de acordo com os frames (números arredondados)
    score = score + Math.round(frameRate()/60);
    if(score > 0 && score %100 === 0){
      somCheckPoint.play();
    }
    
    //Animação do nosso solo
  if (solo.x < 0) {
    solo.x = solo.width / 2;
  }
    
  //pular quando a tecla espaço é acionada
  if (keyDown("space") && trex.y >= 150) {
    trex.velocityY = -10;
    somJump.play();
  }
  
  //Sistema de gravidade
  trex.velocityY = trex.velocityY + 0.8;
  
   //chamando a função gerar nuvens
  gerarNuvens();
  //chamando a função gerar obstáculos
  gerarobstaculos();
  //Toda vez que o dinossauro encotar nos obstáculos, o jogo muda para ENCERRAR
  if(grupodeobstaculos.isTouching(trex)){
    estadoJogo = ENCERRAR;
    somDie.play();
  }
  //Deixa o botão de reiniciar e texto do Game Over invisíveis
  GameOver.visible=false;
  Reiniciar.visible=false;
    
  }
  else if (estadoJogo === ENCERRAR){
    //zera a velocidade do solo e o t-rex não pode mais pular
    solo.velocityX = 0;
    trex.velocityY = 0;
    //Carrega uma animação do T-rex quando bate no obstáculo (olho arregaladado)
    trex.changeAnimation("collided",trex_perdeu);
    //Zera a velocidade X de todos os obstáculos e nuvens
    grupodeobstaculos.setVelocityXEach(0);
    grupodenuvens.setVelocityXEach(0);
    //Os obstáculos e nuvens nunca somem
    grupodeobstaculos.setLifetimeEach(-1);
    grupodenuvens.setLifetimeEach(-1);
    //Deixa o botão de reiniciar e texto do Game Over visíveis
    GameOver.visible=true;
    Reiniciar.visible=true;
    if(mousePressedOver(Reiniciar)){
    reset();
  }
  }
  
  
  //console.log(trex.y);
  //console.log(frameCount);
  
  
  
  
  
  //Faz o t-rex ficar correndo em cima do solo invisível
  trex.collide(soloinvisivel);
  
  
  
  //desenha todos os sprites
  drawSprites();
}

function reset(){
  estadoJogo = JOGAR;
  GameOver.visible=false;
  Reiniciar.visible=false;
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_correndo);
}

function gerarNuvens(){
  //Fazendo as nuvens surgirem a cada 90 quadros (frames)
  if(frameCount % 90 === 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.addImage(imagemdanuvem);
    nuvem.y = Math.round(random(5, 60));
    //nuvem.scale = 0.3;
    nuvem.velocityX = -3;
    //Ajuste das camadas
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //Define um tempo de vida útil para as nuvens
    nuvem.lifetime = 250;  
    
    grupodenuvens.add(nuvem);
   
  }
}

function gerarobstaculos(){
  //Fazendo os obstáculos surgirem a cada 60 quadros (frames)
  if(frameCount %60 === 0){
    var obstaculo = createSprite(600, 165, 10 ,40);
    obstaculo.velocityX = -(6 + 3*score/100);
  //Coloca uma imagem de acordo com o número aleatório
  var rand = Math.round(random(1,6));
  switch(rand){
    case 1:obstaculo.addImage(Obs1);
           break;
    case 2:obstaculo.addImage(Obs2);
           break;
    case 3:obstaculo.addImage(Obs3);
           break;       
    case 4:obstaculo.addImage(Obs4);
           break;       
    case 5:obstaculo.addImage(Obs5);
           break;       
    case 6:obstaculo.addImage(Obs6);
           break;       
    default:break; 
    
  }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 200;
    
    grupodeobstaculos.add(obstaculo);
  }
}