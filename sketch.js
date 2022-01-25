//Cria as variáveisdo cenário, dos NPCs e do personagem
var caminho,imgCaminho;
var jogador1,jogador2,jogador3;
var imgCaminho,img1CiclistaPrincipal,img2CiclistaPrincipal;

//Cria as variáveis que irão armazenar as imagens dos NPCs
var opRosaimg1,opRosaimg2;
var opAmareloimg1,opAmareloimg2;
var opVermelhoimg1,opVermelhoimg2;

//Cria a variável que irá armazenar a imagem do fim de jogo e o som do sino da bicicleta
var imgFimJogo,sinoBicicleta;

//Cria os grupos dos NPCs
var CGRosa, CGAmarelo,CGVermelho; 

//Estados do Jogo
var ENCERRAMENTO =0;
var JOGAR =1;
var estadoJogo = JOGAR;

//Cria uma variável, com valor zero, que irá contar a pontuação do jogo
var distancia=0;
var fimdeJogo;

function preload(){
  
  //Carrega as animações dos objetos no cenário
  img1CiclistaPrincipal = loadAnimation("mainPlayer1.png","mainPlayer2.png");
  img2CiclistaPrincipal= loadAnimation("mainPlayer3.png");
  
  opRosaimg1 = loadAnimation("opponent1.png","opponent2.png");
  opRosaimg2 = loadAnimation("opponent3.png");

  opAmareloimg1 = loadAnimation("opponent4.png","opponent5.png");
  opAmareloimg2 = loadAnimation("opponent6.png");
  
  opVermelhoimg1 = loadAnimation("opponent7.png","opponent8.png");
  opVermelhoimg2 = loadAnimation("opponent9.png");
  
  //Carrega o som da bicicleta
  sinoBicicleta = loadSound("bell.mp3");
  
  //Carrega as imagens do cenário
  imgCaminho = loadImage("Road.png");
  imgFimJogo = loadImage("gameOver.png");
}

function setup(){

  //Delimita a área do jogo
  createCanvas(1200,300);
  
  //Move o plano de fundo
  caminho=createSprite(100,150);
  caminho.addImage(imgCaminho);
  caminho.velocityX = -5;

  //cria o ciclista correndo de bicicleta e dá uma área de colisã
  ciclistaPrincipal  = createSprite(70,150);
  ciclistaPrincipal.addAnimation("SahilRunning",img1CiclistaPrincipal);
  ciclistaPrincipal.scale=0.07;
  ciclistaPrincipal.setCollider("circle", 0, 0, 450);
  
  //Cria a imagem do fim de jogo e a deixa invisível
  fimdeJogo = createSprite(350,150);
  fimdeJogo.addImage(imgFimJogo);
  fimdeJogo.scale = 0.8;
  fimdeJogo.visible = false;  
  
  //Cria os grupos dos NPCs
  CGRosa = new Group();
  CGAmarelo = new Group();
  CGVermelho = new Group();
}

function draw() {
  
  //Dá cor ao plano de fundo
  background(0);
  
  //Desenha todos as linhas de comando
  drawSprites();
  
  //Caso o modo de jogo for "JOGAR", o jogo ganha animação e movimento
  if(estadoJogo===JOGAR){
   
  //A variante "distancia" aumento a cada frame, fazendo com que possamos contabilizar os pontos do jogo
  distancia = distancia + Math.round(getFrameRate()/50);
    
  //Aumenta a velocidade do cenário caso a distancia seja divisível por 150
  caminho.velocityX = -(6 + 2*distancia/150);
  
  //Faz com que o ciclista se mova no eixo Y com o mouse
  ciclistaPrincipal.y = World.mouseY;
  
  //Cria as bordas e faz com que o ciclista colida nelas
  edges= createEdgeSprites();
  ciclistaPrincipal.collide(edges);
  
  //código para resetar o plano de fundo
  if(caminho.x < 0 ){
    caminho.x = width/2;
  }
  
  //Caso a tecla "espaço" seja pressionada, o som do sino da bicicleta toca
  if(keyDown("space")) {
    sinoBicicleta.play();
  }
  
  //Variável R que escolhe um número de 1 a 3, que seleciona aleatóriamente qual cor deve ser o próximo NPC
  if(World.frameCount%150 == 0){
    var r = Math.round(random(1,3));
    if (r == 1) {
      ciclistaRosa();
  } else if (r == 2) {
      ciclistaAmarelo();
  } else {
      ciclistaVermelho();
  }
}
  
  //Caso o NPC Rosa encoste no ciclita, o jogo acaba
  if(CGRosa.isTouching(ciclistaPrincipal)){
    estadoJogo = ENCERRAMENTO;
    jogador1.velocityY = 0;
    jogador1.addAnimation("opponentPlayer1",opRosaimg2);
  }
  
  //Caso o NPC Amarelo encoste no ciclita, o jogo acaba
  if(CGAmarelo.isTouching(ciclistaPrincipal)){
    estadoJogo = ENCERRAMENTO;
    jogador2.velocityY = 0;
    jogador2.addAnimation("opponentPlayer2",opAmareloimg2);
  }
  
  //Caso o NPC Vermelho encoste no ciclita, o jogo acaba
  if(CGVermelho.isTouching(ciclistaPrincipal)){
    estadoJogo = ENCERRAMENTO;
    jogador3.velocityY = 0;
    jogador3.addAnimation("opponentPlayer3",opVermelhoimg2);
  }
    
 }else if (estadoJogo === ENCERRAMENTO) {
    
    //Caso o estado do jogo seja "ENCERRAMENTO", a variante "fim de jogo" vira visível
    fimdeJogo.visible = true;
    
    //Aparece um texto demonstrando como reiniciar o jogo após perder
    textSize(15);
    fill("white");
    text("Aperte R para reiniciar!", 200,200);
    
    //Deixa todos os objetos do cenário imóveis
    caminho.velocityX = 0;
    imgCaminho.velocityY = 0;
    ciclistaPrincipal.addAnimation("SahilRunning",img2CiclistaPrincipal);
    
    //Deixa o NPC rosa imóvel e permanecendo na tela
    CGRosa.setVelocityXEach(0);
    CGRosa.setLifetimeEach(-1);
     
    //Deixa o NPC amarelo imóvel e permanecendo na tela
    CGAmarelo.setVelocityXEach(0);
    CGAmarelo.setLifetimeEach(-1);
  
    //Deixa o NPC vermelho imóvel e permanecendo na tela
    CGVermelho.setVelocityXEach(0);
    CGVermelho.setLifetimeEach(-1);
    
    //Caso a tecla R seja pressionada, a função "reiniciar" é acionada
    if(keyDown("r")){
      Reiniciar();
    }
  }
  
  //Cria um texto que dá ao jogador o feedback de pontos no jogo
  textSize(15);
  fill("black");
  text("Distância: "+ distancia, 550, 20);
}

function ciclistaRosa(){
  //Cria o NPC Rosa
  jogador1 =createSprite(1100,Math.round(random(50, 250)));
  jogador1.scale =0.06;
  jogador1.velocityX = -(6 + 2*distancia/150);
  jogador1.addAnimation("opponentPlayer1",opRosaimg1);
        
  //Dá ao NPC Rosa uma área de colisão
  jogador1.setCollider("circle", 0, 0, 450);
  
  //Dá ao NPC Rosa um tempo de vida
  jogador1.setLifetime=170;
  
  //Adiciona o NPC Rosa a um grupo
  CGRosa.add(jogador1);
}

function ciclistaAmarelo(){
  //Cria o NPC Amarelo
  jogador2 =createSprite(1100,Math.round(random(50, 250)));
  jogador2.scale =0.06;
  jogador2.velocityX = -(6 + 2*distancia/150);
  jogador2.addAnimation("opponentPlayer2",opAmareloimg1);
        
  //Dá ao NPC Amarelo uma área de colisão
  jogador2.setCollider("circle", 0, 0, 450);
  
  //Dá ao NPC Amarelo um tempo de vida
  jogador2.setLifetime=170;
  
  //Adiciona o NPC Amarelo a um grupo
  CGAmarelo.add(jogador2);
}

function ciclistaVermelho(){
  //Cria o NPC Vermelho
  jogador3 =createSprite(1100,Math.round(random(50, 250)));
  jogador3.scale =0.06;
  jogador3.velocityX = -(6 + 2*distancia/150);
  jogador3.addAnimation("opponentPlayer3",opVermelhoimg1);
        
  //Dá ao NPC Vermelho uma área de colisão
  jogador3.setCollider("circle", 0, 0, 450);
  
  //Dá ao NPC Vermelho um tempo de vida
  jogador3.setLifetime=170;
  
  //Adiciona o NPC Vermelho a um grupo
  CGVermelho.add(jogador3);
}
function Reiniciar(){
  
  //Muda o estado do jogo para "JOGAR"
  estadoJogo = JOGAR;
  
  //Variável "fimdeJogo" fica invisível
  fimdeJogo.visible = 0;
  
  //Muda a animação do ciclista
  ciclistaPrincipal.addAnimation("SahilRunning", img1CiclistaPrincipal);
  
  //Destrói todos os grupos de NPCs
  CGRosa.destroyEach();
  CGAmarelo.destroyEach();
  CGVermelho.destroyEach();
  
  //Muda o valor da variável "distancia" para 0
  distancia = 0;
}

