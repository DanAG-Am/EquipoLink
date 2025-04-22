/*
 * Autor: TeamLink
 * Fecha: 2025-03-24
 */

//clases con los metodos de tienda, hada y viejo. Se llaman sus sprites, update, se dibujan y hacen su evento segun lo acordado por el dialogo
document.fonts.load("12px Game",).then((loadedFonts) => {});
function Tienda() {
    this.image = new Image();
    this.image.src = "../../Videojuego/Assets/GameAssets/NPC/Merchant_1.png";
    this.shopItemsImage = new Image();
    this.shopItemsImage.src = "../../Videojuego/Assets/GameAssets/NPC/Item_shop.png";
    this.position = new Vec(canvasWidth / 2 - 200, 200);
    this.width = 32;
    this.height = 32;
    this.box = {
        position: new Vec(this.position.x, this.position.y),
        width: this.width,
        height: this.height
    };
    this.dialogueTexts = [
        ["Bienvenido a mi tienda"]
    ];
    this.dialogueStage = 0;
}

Tienda.prototype.draw = function(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
};

Tienda.prototype.drawDialogue = function(ctx) {
    let boxWidth = 420;
    let boxHeight = 180;
    let boxX = this.position.x + 50 - ((boxWidth - this.width) / 2);
    let boxY = this.position.y - boxHeight - 10;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = "white";
    ctx.font = "12px Game";
    ctx.textAlign = "center";

    let texts = this.dialogueTexts[this.dialogueStage];
    let lineHeight = 25;
    let startY = boxY + 25;
    
    for (let i = 0; i < texts.length; i++) {
        ctx.fillText(texts[i], boxX + boxWidth / 2, startY + i * lineHeight);
    }

    let scaledWidth = boxWidth - 100;
    let scaledHeight = 120;
    let imgX = boxX + 5;
    let imgY = boxY + 30;
    ctx.drawImage(this.shopItemsImage, imgX, imgY, scaledWidth, scaledHeight);
    let itemButtonWidth = 80;
    let itemButtonHeight = 24;
    let firstButtonX = boxX + 20;
    let buttonY = imgY + scaledHeight - 20;
    let secondButtonX = firstButtonX + 100;
    let thirdButtonX = secondButtonX + 100;
    let fourthButtonX = thirdButtonX + 100;
    
    // Botón 1
    ctx.fillStyle = "#222";
    ctx.fillRect(firstButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(firstButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    
    // Botón 2
    ctx.fillStyle = "#222";
    ctx.fillRect(secondButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeRect(secondButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    
    // Botón 3
    ctx.fillStyle = "#222";
    ctx.fillRect(thirdButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeRect(thirdButtonX, buttonY, itemButtonWidth, itemButtonHeight);

    // Botón 4: Subir MaxHP
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(fourthButtonX, buttonY - 60, itemButtonWidth, itemButtonHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(fourthButtonX, buttonY - 60, itemButtonWidth, itemButtonHeight);
    ctx.drawImage(rupeeImg, fourthButtonX + 25, buttonY - 80, 12, 12);
    ctx.restore();

    // Botón 5: Subir MaxMP
    ctx.save();
    ctx.fillStyle = "lightblue";
    ctx.fillRect(fourthButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.strokeRect(fourthButtonX, buttonY, itemButtonWidth, itemButtonHeight);
    ctx.drawImage(rupeeImg, fourthButtonX + 25, buttonY - 20, 12, 12);
    ctx.restore();

    this.buttonPositions = {
        button1: { x: firstButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight },
        button2: { x: secondButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight },
        button3: { x: thirdButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight },
        button4: { x: fourthButtonX, y: buttonY - 60, width: itemButtonWidth, height: itemButtonHeight },
        button5: { x: fourthButtonX, y: buttonY, width: itemButtonWidth, height: itemButtonHeight }
    };

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "10px Game";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("COMPRAR", firstButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("COMPRAR", secondButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("COMPRAR", thirdButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("Max-HP", fourthButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2 - 60);
    ctx.fillText("Max-MP", fourthButtonX + itemButtonWidth / 2, buttonY + itemButtonHeight / 2);
    ctx.fillText("30", fourthButtonX + 50, buttonY - 75, 20, 20);
    ctx.fillText("30", fourthButtonX + 50, buttonY - 15, 20, 20);
    ctx.restore();
    
    ctx.fillStyle = "white";
    ctx.font = "8px Game";
    ctx.textAlign = "center";
    let instruction;
    if (this.dialogueStage < this.dialogueTexts.length - 1) {
        instruction = "Presiona space para continuar";
    } else {
        instruction = "Presiona space para cerrar";
    }
    ctx.fillText(instruction, boxX + boxWidth / 2, boxY + boxHeight - 10);
    
    ctx.restore();
};

Tienda.prototype.nextDialogue = function() {
    if (this.dialogueStage < this.dialogueTexts.length - 1) {
        this.dialogueStage++;
    }
};

Tienda.prototype.getHitbox = function() {
    return {
         position: new Vec(this.position.x, this.position.y),
         width: this.width,
         height: this.height
    };
};

function showPurchaseDialog(itemType) {
    let purchaseDialog = document.getElementById("purchaseDialog");
    let purchaseMessage = document.getElementById("purchaseMessage");
    purchaseMessage.innerText = "¿Cuántas " + itemType + " deseas comprar?";
    document.getElementById("purchaseQuantity").value = "1";
    purchaseDialog.style.display = "block";
}

class Fairy {
    constructor() {
      this.width = 32;
      this.height = 32;
      this.position = new Vec(canvasWidth - 200 - this.width, 200);
      this.sprite = new Image();
      this.sprite.src = "../../Videojuego/Assets/GameAssets/NPC/Fairy_1.png";
      this.effectActive = false;
      this.effectDuration = 10000;
    }
  
    draw(ctx) {
      ctx.drawImage(this.sprite, this.position.x, this.position.y, this.width, this.height);
    }
  
    getHitbox() {
      return {
        position: this.position,
        width: this.width,
        height: this.height
      };
    }
  
    drawDialogue(ctx) {
        let boxWidth = 320;
        let boxHeight = 180;
        let boxX = this.position.x - ((boxWidth - this.width) / 2);
        let boxY = this.position.y - boxHeight - 10;
        
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        
        if (this.effectActive) {
          ctx.font = "12px Game";
          ctx.fillText("No puedes ver tu futuro", boxX + boxWidth / 2, boxY + 70);
          ctx.fillText("en este momento", boxX + boxWidth / 2, boxY + 110);
        } else {
          ctx.font = "12px Game";
          ctx.fillText("¿Quieres ver qué te espera", boxX + boxWidth / 2, boxY + 40);
          ctx.fillText("en el futuro?", boxX + boxWidth / 2, boxY + 60);
          ctx.fillText("Averigualo por 20 rupias", boxX + boxWidth / 2, boxY + 80);
          
          // Botón "Ver futuro"
          let btnWidth = 120;
          let btnHeight = 40;
          // Se posiciona un poco más arriba para dejar espacio al texto adicional
          let btnX = boxX + (boxWidth - btnWidth) / 2;
          let btnY = boxY + boxHeight - btnHeight - 30;
          ctx.fillStyle = "gray";
          ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
          ctx.strokeStyle = "white";
          ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
          ctx.fillStyle = "white";
          ctx.font = "10px Game";
          ctx.fillText("Ver futuro", boxX + boxWidth / 2, btnY + btnHeight/2 + 6);
          // Guarda la posición del botón para la detección del clic
          this.button = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
          
          // Texto pequeño debajo del botón
          ctx.font = "8px Game";
          ctx.fillText("Presiona Space para cerrar", boxX + boxWidth / 2, btnY + btnHeight + 15);
        }
        ctx.restore();
      }
  
    processInteraction() {
      if (playerStats.rupees < 20) {
        showSimpleDialog("No tienes suficientes rupias");
        interactingFairy = false;
        return;
      }
      if (this.effectActive) {
        showSimpleDialog("No puedes ver tu futuro en este momento");
        interactingFairy = false;
        return;
      }
      playerStats.rupees -= 20;
      let outcome = Math.random();
      if (outcome < 0.5) {
        showSimpleDialog("Tu espíritu guerrero crece");
        playerStats.life = Math.round(playerStats.life * 1.1);
        playerStats.damageSword = Math.round(playerStats.damageSword * 1.1);
        playerStats.damageArrow = Math.round(playerStats.damageArrow * 1.1);
        playerStats.damageMagic = Math.round(playerStats.damageMagic * 1.1);
        playerStats.damageBomb = Math.round(playerStats.damageBomb * 1.1);
      } else {
        showSimpleDialog("Un mal oscuro crece rápidamente");
        fairyEnemyBuffMultiplier *= 2;
        game.levelEnemies.forEach(enemy => {
          if (enemy.maxLife !== undefined) {
              enemy.maxLife = Math.round(enemy.maxLife * 2);
              enemy.life = enemy.maxLife;
          } else {
              enemy.life = Math.round(enemy.life * 2);
          }
          if (enemy.attack !== undefined) {
              enemy.attack = Math.round(enemy.attack * 2);
          }
        });
        fairyEnemyBuffActive = true;
      }
      this.effectActive = true;
      setTimeout(() => {
        this.effectActive = false;
      }, this.effectDuration);
    }
  }

  class OldMan {
    constructor(position) {
      this.position = position;
      this.width = 32;
      this.height = 32;
      // Carga la imagen del Old Man (puedes agregar más imágenes si deseas animación o variación)
      this.image = new Image();
      this.image.src = "../../Videojuego/Assets/GameAssets/NPC/Old_man.png";
      
      // Textos de diálogo, igual que en Merchant y Fairy
      this.dialogueTexts = [
        ["Por fin has despertado, joven héroe!"],
        ["Tu hermano ha sido capturado", "por el Ejército de la Oscuridad!"],
        ["Ha sido llevado a su fortaleza...", "donde su líder..."],
        ["¡El Rey Aquamentus!"],
        ["Te doy unas armas para empezar tu exploración.", "Intenta visitar a la tienda para mejorar tus habilidades."]
      ];
      this.dialogueStage = 0;
    }
  
    // Dibuja al Old Man
    draw(ctx) {
      ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
  
    // Devuelve su hitbox para evitar que el jugador lo atraviese
    getHitbox() {
      return {
        position: this.position,
        width: this.width,
        height: this.height
      };
    }
  
    // Dibuja el diálogo del Old Man con el mismo formato que el de Merchant y Fairy
    drawDialogue(ctx) {
      let boxWidth = 320;
      let boxHeight = 180;
      let boxX = this.position.x - ((boxWidth - this.width) / 2);
      let boxY = this.position.y - boxHeight - 10;
      
      ctx.save();
      ctx.fillStyle = "black";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      
      ctx.fillStyle = "white";
      ctx.font = "12px Game";
      ctx.textAlign = "center";
      
      let lines = this.dialogueTexts[this.dialogueStage] || ["..."];
      let lineHeight = 25;
      let startY = boxY + 30;
      lines.forEach((line, i) => {
        ctx.fillText(line, boxX + boxWidth / 2, startY + i * lineHeight);
      });
      
      ctx.font = "10px Game";
      let instruction = (this.dialogueStage < this.dialogueTexts.length - 1) ?
                        "Presiona Enter para continuar" : "Presiona Enter para cerrar";
      ctx.fillText(instruction, boxX + boxWidth / 2, boxY + boxHeight - 10);
      
      ctx.restore();
    }
  }

  function drawNPCTutorial(ctx) {
    let boxWidth = 320;
    let boxHeight = 180;
    let boxX = game.oldMan.position.x - ((boxWidth - 32) / 2);
    let boxY = game.oldMan.position.y - boxHeight - 10;
    
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.fillStyle = "white";
    ctx.font = "12px Game";
    ctx.textAlign = "center";
    let lineHeight = 80;
    let startY1 = boxY + 60;
    let startY2 = boxY + 90;
    ctx.fillText("Corre, Sentinel.", boxX + boxWidth / 2, startY1);
    ctx.fillText("Una aventura te espera.", boxX + boxWidth / 2, startY2);
    ctx.font = "10px Game";
    ctx.fillText("Presiona Space para cerrar", boxX + boxWidth / 2, startY2 + lineHeight);
    ctx.restore();
  }