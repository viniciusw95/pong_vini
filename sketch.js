let minhaRaquete;
let bolinha;
let raqueteOponente;
let erro = 0;
let contErro = 0;

let meusPontos;
let pontosOponente;

let meuPlacar;
let placarOponente;

// sons do jogo
let trilha;
let raquetada;
let ponto;

// opção multiplayer
let botaoMultiplayer;
let labelMultiplayer;

let titulo;
let botaoUmJogador;
let botaoDoisJogadores;

function preload() {
  trilha = loadSound('trilha.mp3');
  raquetada = loadSound('raquetada.mp3');
  ponto = loadSound('ponto.mp3');
}

class Bolinha {
  constructor(x, y, diametro) {
    this.x = x;
    this.y = y;
    this.diametro = 20;
    this.raio = this.diametro / 2;
    this.velocidadeX = 6;
    this.velocidadeY = 6;
  }
  
  afastarDaMinhaRaquete() {
    this.x = minhaRaquete.x + minhaRaquete.width;
    this.x += this.raio; 
  }
  afastarDaRaqueteOponente() {
    this.x = raqueteOponente.x - this.raio;
  }
  
  verificaColisaoBordas() {    
    if (this.y + this.raio > height || this.y - this.raio < 0) {
      this.velocidadeY *= -1;
    }
    if (this.x + this.raio > width || this.x - this.raio < 0) { 
      this.inverterVelocidadeX();
      sortearErro();
      ponto.play();
      
      if (this.x + this.raio > width) {
        meusPontos += 1;
        this.afastarDaRaqueteOponente();
      } else {
        pontosOponente += 1;
        this.afastarDaMinhaRaquete();
      }
      
    }
  }
  
  inverterVelocidadeX() {
    this.velocidadeX *= -1;
  }

  movimentaBolinha() {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;
  }

  mostraBolinha() {
    fill(255, 255, 255);
    circle(this.x, this.y, this.diametro);
  }
  
  verificaColisaoRaquete(raquete) {
    let colidiu = collideRectCircle(raquete.x, 
                                   raquete.y,
                                   raquete.width,
                                   raquete.height,
                                   this.x, this.y,
                                   this.raio);    
    if (colidiu) {
      this.inverterVelocidadeX();
      raquetada.play();
            
      if (raquete === raqueteOponente) {
        this.afastarDaRaqueteOponente();
      } else {
        // colidiu com minha raquete
        this.afastarDaMinhaRaquete();
      }
      sortearErro();
    }
  }
  
  distanciaBordaDireita() {
    return abs(width - this.x - this.raio);
  }
  
}


class Raquete {
  constructor(x, y, width, height, cor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cor = cor;
    
    this.paraCima = UP_ARROW;
    this.paraBaixo = DOWN_ARROW;
  }
  
  mostrar() {
    fill(this.cor);
    rect(this.x, this.y, this.width, this.height);
  }
  
  verificaMovimento() {
    if (keyIsDown(this.paraCima)) {
      this.y -= 10;    
    }
    if (keyIsDown(this.paraBaixo)) {
      this.y += 10;
    }
  }
  
  seguirBolinha() {
    contErro += erro;
    this.y = bolinha.y + contErro;
  }
  
}

class Placar {
  constructor(x, y, width, height, cor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.cor = cor;
    this.raioAresta = 5;
  }
  
  mostrar(pontos) {

    stroke(255);
    fill(this.cor);
    rect(this.x, this.y, this.width, this.height,
         this.raioAresta);
    noStroke();
    textAlign(CENTER);
    textSize(15);
    // cor dos pontos: amarela
    fill(251, 255, 68); 
    text(pontos, this.x + 20, this.y + 15);
  }
}

function setup() {
  createCanvas(600, 400);
  
  meusPontos = 0;
  pontosOponente = 0;
  
  // minha raquete
  let widthRaquete = 10;
  let heightRaquete = 80;
  let yRaquete = height / 2;
  let xRaquete = 5;
  
  let corMinhaRaquete = color(66, 133, 244);
  minhaRaquete = new Raquete(xRaquete, yRaquete - heightRaquete/2, 
                             widthRaquete, heightRaquete,
                            corMinhaRaquete);

  bolinha = new Bolinha(width / 2, height / 2);
  
  
  // raquete do oponente
  let corRaqueteOponente = color(234, 67, 53);
  let xRaqueteOponente = width - widthRaquete - 5;
  raqueteOponente = new Raquete(xRaqueteOponente,
                                yRaquete, widthRaquete,
                                heightRaquete,
                                corRaqueteOponente);
  
  // placares
  let xPlacar = 150;
  let yPlacar = 365;
  let widthPlacar = 40;
  let heightPlacar = 20;
  meuPlacar = new Placar(xPlacar, yPlacar,
                         widthPlacar,heightPlacar,
                         minhaRaquete.cor);
  
  
  let xPlacarOponente = 420;
  let yPlacarOponente = 365;
  placarOponente = new Placar(xPlacarOponente, yPlacarOponente,
                             widthPlacar, heightPlacar,
                             raqueteOponente.cor);
  
  mostrarMenu();
  
  // para esperar até o usuário aperte no botão de Play
  noLoop();
}

function mostrarMenu() {
  titulo = createElement('h1', 'Pong!');
  titulo.position(270, 200);
  titulo.style('color', '#FFFFFF');
  
  botaoUmJogador = createElement('button', '1 jogador');
  botaoUmJogador.position(230, 300);
  botaoUmJogador.mouseClicked(iniciarJogo);
 
  botaoDoisJogadores = createElement('button', '2 jogadores');
  botaoDoisJogadores.position(315, 300);
  botaoDoisJogadores.mouseClicked(iniciarDoisJogadores);
}

function draw() {
  background(0);
  
  bolinha.movimentaBolinha();
  bolinha.mostraBolinha();
  
  minhaRaquete.verificaMovimento();
  minhaRaquete.mostrar();

  raqueteOponente.seguirBolinha();
  raqueteOponente.mostrar();
  
  bolinha.verificaColisaoRaquete(minhaRaquete);
  bolinha.verificaColisaoRaquete(raqueteOponente);
  bolinha.verificaColisaoBordas();
 
  meuPlacar.mostrar(meusPontos);
  placarOponente.mostrar(pontosOponente);
}


function sortearErro() {
  // apenas se estiver do lado esquerdo da tela, i.e, tocando 
  // ou na minhaRaquete ou na borda esquerda
  if (bolinha.x <= width / 2) {
    // vai errar em até 1.2x o diâmetro da bolinha
    erro = 1.2 * bolinha.diametro;
    
    // ajustando para errar tanto para cima quanto para baixo
    erro = getRndInteger(-(raqueteOponente.height+erro), erro);
    
    // 'distribuindo' o erro ao longo da distância, para
    // suavizar o movimento do oponente    
    erro /= bolinha.distanciaBordaDireita();
    erro *= abs(bolinha.velocidadeX);
  } else {
    erro *= -1;
  }
}

// funçao de arredondar da w3schools
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}

function iniciarDoisJogadores() {
  raqueteOponente.paraCima = 87;
  raqueteOponente.paraBaixo = 83;
  raqueteOponente.seguirBolinha = raqueteOponente.verificaMovimento;
  iniciarJogo();
}

function iniciarJogo() {
  titulo.style('visibility', 'hidden');
  botaoUmJogador.style('visibility', 'hidden');
  botaoDoisJogadores.style('visibility', 'hidden');
  
  trilha.loop();
  loop();
}
