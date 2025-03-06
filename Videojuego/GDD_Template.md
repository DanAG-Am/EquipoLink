# **The Lost Sentinel**

## _Documento de Diseño de Juego_

---

### **Aviso de derechos de autor / información del autor**
- Amilka Daniela Lopez Aguilar A01029277
- Emiliano Deyta Illescas A01785881
- Jin Sik Yoon A01026630

---

## **Índice**

1. [Índice](#índice)
2. [Diseño del Juego](#diseño-del-juego)
   1. [Resumen](#resumen)
   2. [Jugabilidad](#jugabilidad)
   3. [Mentalidad del Jugador](#mentalidad-del-jugador)
3. [Aspectos Técnicos](#aspectos-técnicos)
   1. [Pantallas](#pantallas)
   2. [Controles](#controles)
4. [Mecánicas](#mecánicas)
5. [Diseño de Niveles](#diseño-de-niveles)
   1. [Temas](#temas)
      1. [Ambiente](#ambiente)
      2. [Objetos](#objetos)
         1. [Ambientales](#ambientales)
         2. [Interactivos](#interactivos)
      3. [Desafíos](#desafíos)
6. [Flujo del Juego](#flujo-del-juego)
7. [Desarrollo](#desarrollo)
   1. [Clases Abstractas](#clases-abstractas)
   2. [Clases Derivadas](#clases-derivadas)
8. [Gráficos](#gráficos)
   1. [Atributos de Estilo](#atributos-de-estilo)
   2. [Gráficos Necesarios](#gráficos-necesarios)
9. [Sonidos/Música](#sonidosmúsica)
   1. [Atributos de Estilo](#atributos-de-estilo-1)
   2. [Sonidos Necesarios](#sonidos-necesarios)
   3. [Música Necesaria](#música-necesaria)
10. [Cronograma](#cronograma)

---

## **Diseño del Juego**

### **Resumen**

_The Lost Sentinel_ combina exploración estilo Zelda con mecánicas de progresión RPG. 
Los jugadores pueden explorar un mundo abierto, enfrentar combates en tiempo real, resolver acertijos escondidos e interactuar con NPCs para completar misiones y recoger recompensas.

#### 🎯 **Objetivo Principal:**
El jugador toma el rol de Sentinel, un guerrero que despierta en una mazmorra misteriosa sin recordar cómo llegó ahí. Guiado por un anciano NPC y un hada, Sentinel debe escapar de la mazmorra, descubrir la verdad detrás del **Ejército de la Oscuridad** y derrotar al jefe final antes de que sea demasiado tarde.

**A lo largo del juego, los jugadores podrán:**
- Combatir enemigos cada vez más difíciles en 10 habitaciones desafiantes.
- Interactuar con NPCs que ofrecen misiones, pistas y objetos.
- Mejorar armas, armaduras y habilidades en tiendas y cofres ocultos.
- Derrotar jefes poderosos que protegen la salida de la mazmorra.

---

### **Jugabilidad**

#### **Prólogo**

La oscuridad se disipa. Sentinel despierta en un frío suelo de piedra, con el eco de gotas cayendo a su alrededor. La tenue luz de una antorcha ilumina la cueva.  
Se siente débil, sin recuerdos de cómo llegó allí.  
Un anciano se le acerca. **"Por fin has despertado, joven héroe"**, dice con voz firme.  
Le advierte que su familia ha sido capturada por el **Ejército de la Oscuridad** y que necesita un arma para enfrentarlo.  
**"Sal de la cueva y busca a mi compañero. Él te dará una espada."**  
A pesar de la incertidumbre, Sentinel siente una fuerza desconocida dentro de él.  
Toma la espada de madera y da su primer paso hacia la oscuridad. La verdadera prueba ha comenzado.  

#### **Mentalidad del Jugador**

- El jugador se sentirá débil al inicio, ya que las armas disponibles pueden no ser lo suficientemente fuertes para derrotar a todos los enemigos.
- Tendrá que ser astuto y perseverante para conseguir mejores objetos en la tienda y así avanzar en más niveles del juego.
- Conseguir ventajas servirá como una forma de compromiso e incentivo para que el jugador siga intentando completar el nivel.

---

## _Technical_

---

## **Aspectos Técnicos**

### **Pantallas**

- **Pantalla de Inicio:** Vista previa del mapa. Sentinel camina por la pantalla hasta que el jugador haga clic en el botón de inicio.
- **Pantalla de Historia:** Se muestra un resumen de la historia breve de cómo Sentinel terminó en la mazmorra.
- **Opciones:**
  - El botón de inicio solicitará al jugador que inicie sesión con su nombre de usuario.
  - Pantalla de controles con las teclas de dirección, clic izquierdo, 'Q' y 'Z'.
- **Juego:**
  - **Inventario:** Pantalla con imágenes de todos los objetos recolectados y monedas acumuladas.
  - **Evaluación / Siguiente Nivel:** Pantalla negra que muestra cambios en el tiempo y entorno.
  - **Game Over:** Pantalla negra con el mensaje "Game Over" y un botón para reiniciar.
  - **Pantalla de Mazmorra**
  - **Salida de la mazmorra:** Iluminación natural, mapa con arbustos y suelo amarillo de concreto.
  - **Créditos Finales:** Nombres de los creadores y referencias en formato APA.

### **Controles**

📌 **Movimiento**

- ⬆️ Flecha Arriba → Mover a la siguiente habitación (si la puerta está abierta).
- ⬇️ Flecha Abajo → Regresar a una habitación anterior.
- ⬅️ Flecha Izquierda → Moverse lateralmente en la habitación o entrar en puertas a la izquierda.
- ➡️ Flecha Derecha → Moverse lateralmente en la habitación o entrar en puertas a la derecha.

⚔️ **Combate**

- **"Z"** → Ataque con espada.
- **"X"** → Disparo con arco.
- **"A"** → Colocar bomba (explota tras unos segundos).

🎮 **Interacción**

- **Clic Izquierdo** → Interactuar con NPCs, objetos o abrir cofres.
- **"I"** → Abrir inventario.  
- **"ESC"** → Abrir menú de pausa.

---

### **Mechanics**

#### 1. Distribución de Habitaciones y Mazmorra
- La mazmorra consta de **10 habitaciones** que el jugador debe atravesar para progresar.
- Cada habitación puede tener diferentes diseños, obstáculos, enemigos e interacciones.
- Las habitaciones **3, 6 y 9** contienen:
  - **NPCs** que dan información útil.
  - **Tiendas de objetos** donde se pueden mejorar habilidades y equipamiento.
  - **Hadas consejeras** que ofrecen pistas sobre desafíos futuros.
- Algunas habitaciones contienen **tesoros ocultos** con recompensas valiosas.
- En la última habitación, el jugador se enfrentará a un **jefe poderoso** y podrá obtener un **tesoro especial**.

##### **Progresión de Habitaciones**
- El jugador avanza presionando la **Flecha Arriba** cuando está frente a la **puerta de salida**.
- En los pisos de descanso, puede moverse lateralmente:
  - **Izquierda** → Tienda del anciano.
  - **Derecha** → Reino del hada.
- La dificultad aumenta con cada habitación:
  - Los enemigos se **vuelven un 10% más fuertes** en comparación con la habitación anterior.
  - Los entornos presentan **desafíos más complejos**.

---

#### 2. Mecánicas de Combate y Enemigos

##### **Enemigos**
- Cada habitación contiene al menos **un enemigo**, que el jugador debe derrotar antes de avanzar.
- A medida que el jugador progresa:
  - Los enemigos se **vuelven más fuertes**.
  - Ganan **más velocidad** y nuevas habilidades.

##### **Mecánicas de Combate**
- **Ataque**: Los jugadores pueden derrotar enemigos usando su **arma equipada**. El daño depende de sus estadísticas.
- **Salud**: El jugador tiene una **barra de vida**. Si llega a **0**, muere y debe **reiniciar desde el principio**.

##### **Uso de Objetos en Combate**
- Los jugadores pueden recolectar:
  - **Pociones de curación** que restauran vida.
  - **Objetos de mejora** para fortalecer atributos o armas.
  - **Ítems especiales** que pueden cambiar la estrategia de juego.

---

#### 3. NPCs - Asistencia de Hadas
- En las habitaciones **3, 6 y 9**, hay **hadas consejeras** que:
  - Dan pistas sobre desafíos futuros.  
    _Ejemplo_: "¡Ten cuidado! ¡El próximo enemigo es muy fuerte!"
  - Proporcionan información sobre **tesoros ocultos**.
  - En ocasiones, pueden **recompensar al jugador** con objetos útiles.

---

#### 4. Misiones y Trama

##### **Misión Principal**
- El jugador debe **escapar de la mazmorra** completando la historia principal.
- A lo largo de la aventura, descubrirá el **misterio del Ejército de la Oscuridad** y su relación con Sentinel.

##### **Misiones Secundarias**
- **Tesoros ocultos**: Pueden desbloquear **objetos especiales** o mejoras permanentes.
- Algunas misiones pueden involucrar **enfrentamientos adicionales** con enemigos desafiantes.

---

#### 5. Muerte Permanente y Reinicio
- Al **morir**, el jugador **reinicia desde la primera habitación**.
- Pierde la mayoría de sus recursos, pero conserva:
  - Su **espada inicial**.
  - **Algunas monedas** acumuladas en la partida.
- Esta mecánica obliga a los jugadores a:
  - **Planificar estratégicamente** el uso de recursos.
  - Mejorar su equipo y habilidades para **progresar más en cada intento**.

---

## _Level Design_

---

### **Themes**

### 1. Cámaras de la Mazmorra

#### 🎭 **Ambiente**
- Oscuro, sombrío, opresivo y desafiante.

#### 🏰 **Objetos**
##### 🔹 **Ambientales**
- Iluminación tenue con **antorchas brillantes**.
- Estructuras de **piedra envejecida** con suelo sucio.
- Sonidos de **escombros crujientes** al caminar.
- **Bloques de piedra** y **pilares antiguos**.
- **Puertas representadas como áreas huecas y negras** en los límites de la cámara.

##### 🎮 **Interactivos**
- **Puertas con mecanismos ocultos** que deben activarse para abrirse.
- **NPCs misteriosos** que ofrecen advertencias o pistas crípticas.
- **Trampas ocultas** con picos que infligen daño si el jugador cae en ellas.
- **Cofres escondidos** que contienen monedas o armas mejoradas.

---

### 2. Tienda de Objetos _(Tienda del Anciano)_

#### 🎭 **Ambiente**
- Un espacio **acogedor, tranquilo y cálido**, donde el jugador se siente **seguro**.

#### 🏪 **Objetos**
##### 🔹 **Ambientales**
- **Más iluminado** que la mazmorra, con luces cálidas y tenues.
- **Estantes de madera antiguos**, llenos de objetos curiosos, armas y pociones.
- **Suelos de madera chirriantes** que añaden una sensación de rusticidad.
- Un **gato dormido** en la esquina, aportando un toque de vida.

##### 🎮 **Interactivos**
- **El anciano se enoja** si el jugador intenta tocar sus objetos sin pagar.
- Si el jugador intenta **robar tres veces**, el anciano lo expulsa de la tienda.
- El jugador puede **comprar objetos de curación, mejoras de armas y habilidades** _(HP, Atk, Def, etc.)_.

---

### 3. Reino de las Hadas

#### 🎭 **Ambiente**
- Un lugar **misterioso, de cuento de hadas, mágico y enigmático**.

#### 🌿 **Objetos**
##### 🔹 **Ambientales**
- **Luz natural** filtrándose entre los árboles, creando un ambiente sereno.
- **Rocas cubiertas de musgo flotando** en el aire, aumentando el aire de fantasía.

##### 🎮 **Interactivos**
- Si el jugador intenta **atacar a un hada**, el entorno se **vuelve rojizo y amenazante**.
- **Posibilidad de encontrar cofres** con monedas o artefactos únicos.
- Algunas hadas ofrecen **pistas sobre enemigos poderosos** o tesoros ocultos.
- En ciertos encuentros, el jugador puede **verse obligado a luchar contra hadas hostiles**.

### **Game Flow**

## **Game Flow**

### 📜 **Introducción y Menú de Inicio**
1. El juego comienza con una **pantalla de título**, donde Sentinel camina a través de la pantalla.
2. El jugador debe hacer clic en el **botón "Inicio"** para continuar.
3. Aparece la **pantalla de inicio de sesión**, donde el jugador ingresa su nombre de usuario.
4. Una vez que inicia sesión, el jugador es llevado a la **Pantalla de Historia**.

---

### 🎭 **Pantalla de Historia y Prólogo**
1. Un **prólogo corto** se desplaza de arriba hacia abajo, presentando la historia del juego.
2. La pantalla **se desvanece a negro** y da paso a la **primera escena jugable**.

---

### 🏰 **Despertar en la Mazmorra**
1. Sentinel despierta **inconsciente** en una cámara oscura de piedra.
2. Aparece una pantalla con el **tutorial de controles**:
   - **⬆️⬇️⬅️➡️ Flechas del teclado** → Moverse por el mapa.
   - **"Z"** → Ataque básico con espada.
   - **"X"** → Ataque con arco.
   - **"A"** → Colocar una bomba.
   - **🖱️ Click Izquierdo** → Interactuar con objetos/NPCs.
   - **"I"** → Abrir inventario.
   - **"ESC"** → Abrir el menú de pausa.
3. Sentinel **conoce a un NPC anciano**, quien le explica su misión.
4. El anciano le entrega **una espada de madera** como su primera arma.
5. El jugador puede **explorar la mazmorra** e interactuar con NPCs.

---

### 🏹 **Explorando la Mazmorra**
La mazmorra tiene **10 cámaras**, cada una con:
- **Enemigos** de dificultad creciente.
- **Tiendas** donde el jugador puede comprar mejor equipo.
- **NPCs**, incluidas hadas que dan consejos o advertencias.
- **Habitaciones ocultas** con tesoros o desafíos adicionales.

---

### ⚔️ **Primer Encuentro con un Enemigo**
1. El jugador entra en una habitación y **se enfrenta a su primer enemigo**.
2. Se introduce el **tutorial de combate**:
   - **"Z"** → Ataque con espada.
   - **Estrategias de movimiento** para esquivar ataques enemigos.
3. Al derrotar al enemigo, el jugador **recibe monedas** como recompensa.

---

### 🚪 **Navegación en la Mazmorra**
El jugador avanza enfrentando:
- **Enemigos más fuertes** con nuevas habilidades.
- **Tiendas** para mejorar armas y armaduras.
- **Hadas consejeras**, que dan advertencias sobre peligros futuros.
- Cada **tres habitaciones**, se revelan **más detalles** sobre el pasado de Sentinel y los motivos del villano principal.

---

### 🛒 **Visitación a la Tienda y al Reino de las Hadas**
En las habitaciones **3, 6 y 9**, el jugador puede **visitar**:
   - **🛒 Tienda** para comprar ítems con las monedas obtenidas.
   - **🧚 Reino de las Hadas** para recibir pistas y objetos mágicos.

---

### 🏆 **Batalla contra el Jefe Final y Créditos**
1. En la **décima habitación**, el jugador se enfrenta a un **jefe poderoso**.
2. Si el jugador gana, se muestra una **escena final** de la historia.
3. Aparecen los **créditos finales**, que incluyen:
   - **Retratos de los personajes**.
   - **Nombres de los desarrolladores**.
   - **Créditos de la música y efectos de sonido**.

# **Development**

---

## **Abstract Classes / Components**

### 🏗 **BaseEntity**
Clase padre para todas las entidades del juego (jugadores, enemigos, NPCs, objetos interactivos).  
Define propiedades básicas como posición, movimiento y renderizado.

**📌 Atributos:**
- `position (x, y)`: Define las coordenadas de la entidad en el mundo del juego.
- `sprite`: Representación visual de la entidad.
- `velocity`: Velocidad de movimiento.
- `hitbox`: Límites de detección de colisiones.

**⚙️ Métodos:**
- `update()`: Actualiza la posición y el estado de la entidad.
- `render()`: Dibuja la entidad en la pantalla.
- `collide(other_entity)`: Verifica la colisión con otra entidad.

---

### 👤 **BaseCharacter**
Representa a todos los personajes (jugador, NPCs y enemigos).  
Maneja la salud, el movimiento y las animaciones.

**📌 Atributos:**
- `health`: Puntos de vida del personaje.
- `damage`: Cantidad de daño que el personaje puede causar.
- `inventory`: Lista de objetos que el personaje posee.

**⚙️ Métodos:**
- `move(direction)`: Mueve el personaje en una dirección específica.
- `attack(target)`: Realiza un ataque contra otra entidad.
- `take_damage(amount)`: Reduce la salud en función del daño recibido.
- `interact(object)`: Permite la interacción con objetos o NPCs.

---

### 🏠 **BaseObject**
Representa todos los objetos con los que se puede interactuar (puertas, cofres del tesoro, interruptores).

**📌 Atributos:**
- `is_interactable`: Determina si el objeto puede ser interactivo.

**⚙️ Métodos:**
- `trigger()`: Activa un efecto cuando el objeto es interactuado.

---

### 🎒 **BaseItem**
Representa todos los objetos coleccionables (armas, pociones, objetos de misión).

**📌 Atributos:**
- `effect`: Define el impacto del objeto (curación, aumento de daño, etc.).

**⚙️ Métodos:**
- `use(player)`: Aplica el efecto del objeto al jugador.

---

### ⚔️ **BaseWeapon**
Define las propiedades de diferentes armas.

**📌 Atributos:**
- `damage`: Potencia de ataque.
- `range`: Alcance del arma.

**⚙️ Métodos:**
- `swing()`: Realiza un ataque cuerpo a cuerpo.
- `shoot()`: Dispara un proyectil (para arcos, armas mágicas).

---

## **Derived Classes / Component Compositions**

### 🛡 **PlayerCharacter**
El personaje principal jugable, **Sentinel**, es controlado por el jugador.

**📌 Atributos:**
- `base_health = 100` → Salud base del personaje.
- `base_damage = 10` → Daño base que puede causar.
- `inventory = []` → Inventario vacío al inicio del juego.

---

### 👹 **Enemigos**
Cada tipo de enemigo extiende la clase **BaseEnemy** con comportamientos únicos.

**📌 Atributos:**
- `health`: Puntos de vida del enemigo.
- `damage`: Cantidad de daño que inflige.
- `speed`: Velocidad de movimiento.
- `type_of_attack`: Tipo de ataque que usa.
- `aggression_level`: Nivel de agresividad.

**⚙️ Métodos:**
- `chase(player)`: Si el enemigo persigue rápidamente al jugador.
- `attack()`: Define cómo el enemigo ataca al jugador.
- `flee()`: Si el enemigo huye cuando su salud es baja.

---

### 🏪 **NPCs**

#### 🧓 **Vendedor (Shopkeeper)**
Un anciano que administra la tienda del juego.

**📌 Atributos:**
- `dialogue = ["¡Bienvenido!", "¡No toques eso!", "Compra algo o vete."]`
- `inventory = [Poción de vida, Espada, Arco, Bomba]`

**⚙️ Métodos:**
- `sell_item(player, item)`: Transfiere un objeto al jugador a cambio de oro.
- `kick_out()`: Expulsa al jugador si intenta robar.

#### 🧚 **Hada Consejera (FairyAdviser)**
Un NPC guía que proporciona pistas.

**📌 Atributos:**
- `dialogue = ["¡Cuidado con la siguiente habitación!", "¡Un tesoro oculto espera a los valientes!"]`

**⚙️ Métodos:**
- `give_hint()`: Muestra consejos útiles.

---

### ⚒️ **Objetos**

#### ⚔️ **Espada (Sword)**
El arma estándar de combate cuerpo a cuerpo.

**📌 Atributos:**
- `damage = 10` → Daño causado al atacar.
- `range = 1` → Alcance del golpe.

**⚙️ Métodos:**
- `swing()`: Realiza un ataque con la espada.

---

#### 🏹 **Arco (Bow)**
Un arma de combate a distancia.

**📌 Atributos:**
- `damage = 5` → Daño del proyectil.
- `range = 7` → Alcance del disparo.

**⚙️ Métodos:**
- `shoot_arrow()`: Dispara una flecha.

---

#### 💣 **Bomba (Bomb)**
Explota después de un tiempo determinado.

**📌 Atributos:**
- `damage = 15` → Daño de la explosión.
- `range = 3` → Área de impacto.
- `time = 3` segundos → Tiempo antes de la explosión.

**⚙️ Métodos:**
- `put_bomb()`: Coloca la bomba en el suelo.

---

#### ❤️ **Poción de Salud (Health Potion)**
Objeto consumible que restaura la salud del jugador.

**📌 Atributos:**
- `effect = "restore 30 HP"` → Cantidad de vida recuperada.

**⚙️ Métodos:**
- `use(player)`: Restaura la salud del jugador.

---

### 🎁 **Objetos Interactivos**

#### 🏆 **Cofre del Tesoro (Treasure Chest)**
Un cofre que contiene recompensas.

**📌 Atributos:**
- `contents = ["Oro", "Llave", "Armas"]` → Posibles objetos dentro del cofre.

**⚙️ Métodos:**
- `open(player)`: Da un objeto aleatorio al jugador.

---

#### 🚪 **Puertas (Doors)**
Pasajes entre habitaciones.

**📌 Atributos:**
- `is_locked = True` → Determina si la puerta está bloqueada.

**⚙️ Métodos:**
- `block()`: Evita el acceso hasta que se derroten a los enemigos.

# **Graphics**

---

## 🎨 **Style Attributes**

### 🎨 **Color**
- Los tonos **tierra apagados** dominan el juego, con **marrones oscuros y grises** para las paredes de piedra de la mazmorra.
- Se contrastan con destellos ocasionales de luz de **antorchas en amarillos y naranjas cálidos**.
- **La tienda y el reino de las hadas** presentan colores más brillantes como **dorados, verdes y azules suaves**, generando una atmósfera más acogedora.
- Los **enemigos y jefes** utilizan tonos más oscuros con acentos **rojos o verdes espectrales** para enfatizar el peligro.

---

### 🏗 **Textura**
- **Mazmorra:** Paredes **ásperas y agrietadas**, con un suelo de piedra **frío y rugoso**.
- **Tienda:** Estantes de madera **desgastados pero pulidos**, agregando calidez al entorno.
- **Reino de las hadas:** Texturas suaves como **agua cristalina, piedras cubiertas de musgo y follaje delicado**, contrastando con la dureza de la mazmorra.

---

### 🖌 **Estilo Gráfico**
- **Arte en píxeles**, inspirado en los **RPG retro**.
- Personajes **expresivos** y entornos **detallados**.
- **Animaciones fluidas**, enfocadas en combate y resolución de acertijos.
- Se prioriza la **claridad visual** para que el jugador pueda identificar fácilmente objetos y NPCs interactivos.

---

### 🎬 **Estilo de Animación**
- **Animaciones sutiles** para dar vida al entorno:
  - 🔥 **Antorchas parpadeantes**
  - 🌊 **Olas de agua en movimiento**
- **Animaciones de combate impactantes**, con efectos como:
  - ⚔️ **Cortes de espada**
  - 💥 **Explosiones**
- **NPCs y enemigos con transiciones fluidas** en interacciones:
  - 📢 **Diálogos**
  - 🏹 **Ataques**
  - 🔎 **Zooms o acercamientos cuando sea necesario**

---

### 💡 **Estilo de Iluminación**
- **Mazmorra:** Iluminación **tenue y atmosférica**, con **sombras parpadeantes** proyectadas por antorchas.
- **Tienda:** Más **brillante y cálida**, con luz superior **suave** iluminando los objetos.
- **Reino de las hadas:** Luz **natural filtrándose entre los árboles**.
  - ⚠️ **Cuando hay peligro, la iluminación cambia a tonos rojos ominosos**.

---

### 🔊 **Estilo de Efectos de Sonido**
- **Sonidos ambientales minimalistas**, como:
  - 👣 **Ecos de pasos** en la mazmorra.
  - 🔥 **Antorchas crepitando**.
  - 🐉 **Gruñidos lejanos de enemigos**.
- **Efectos en la tienda:**
  - 🔔 **Suaves tintineos de monedas**.
  - 🛍️ **Sonidos sutiles al mover objetos**.
- **Reino de las hadas:**
  - 🌊 **Sonidos de agua y aves**.
  - 😨 **Cambios a tonos inquietantes cuando aparecen enemigos**.
- **Sonidos de combate impactantes:**
  - ⚔️ **Choques de espadas**.
  - 🐲 **Rugidos de enemigos**.

---

### 🎶 **Estilo de Música**
- 🎼 **Mazmorra:** Sonidos **oscuros y envolventes**, con uso de **piano, cuerdas y percusión suave**.
- 🏪 **Tienda:** Melodía **ligera y tranquila**.
- 🧚 **Reino de las hadas:** Música **misteriosa y mágica**.
  - **⚠️ En momentos de peligro, la música se vuelve más tensa**.

---

### 🖥 **Estilo de UI (Interfaz de Usuario)**
- **Minimalista e intuitiva** 🏹.
- **Íconos en píxeles** para el inventario y la barra de salud.
- **Cuadros de texto claros**, sin bordes distractores.
- **Pantalla de inventario limpia** 📜:
  - 🎒 Objetos claramente etiquetados.
  - 💰 Monedas visibles.

---

### 🚀 **Indicadores de Interactividad**
- **Objetos interactivos destacados** con:
  - ✨ **Brillo sutil** o contorno resaltado.
  - 🔍 **Cambio en la textura**.
- **NPCs con indicaciones visuales:**
  - 🛑 Aura o signos de **exclamación** cuando tienen información importante.
- **Combate:**
  - ❗ **Enemigos parpadean cuando están vulnerables o listos para atacar**.

---

# **Graphics Needed** 🎨🎮

---

## 🎭 **Personaje Jugable**
- 🕹 **Animación en reposo:** De pie sin moverse.
- 🚶 **Animación de caminata:** Ciclo de **4 fotogramas** en todas las direcciones (arriba, abajo, izquierda, derecha).
- ⚔️ **Animación de ataque (Espada):** Animación de **corte** con **3 fotogramas**.
- 🏹 **Animación de ataque (Arco):** Animación de **preparación y disparo** con **2 fotogramas**.

---

## 👾 **Enemigos**
- **Animación en reposo:** 2-3 fotogramas.
- **Animación de movimiento:** 3-4 fotogramas.
- **Animación de ataque:** 2-3 fotogramas.

---

## 🧓 **NPCs**
### 🏪 **Anciano Tendero**
- **Animación en reposo:** De pie detrás del mostrador.
- **Animación enojado:** **Rostro rojo**, tembloroso.

### 🧚 **Hadas NPC**
- **Animación en reposo:** Flotando en su lugar.
- **Animación de hada enojada:** Se vuelve **roja y agresiva**.

---

## 🏰 **Entorno y Tilesets**
### 🔥 **Mazmorra**
- **Paredes:** Ladrillos de **piedra oscura con grietas**.
- **Suelos:** Baldosas variadas (**piedra, musgo, manchas de sangre**).
- **Puertas:** Abiertas o cerradas.
- **Antorchas con llamas encendidas**.

### 🏪 **Tienda**
- **Paredes y suelos de madera**.
- **Estantes** llenos de **armas, pociones y pergaminos**.
- **Mostrador con monedas de oro esparcidas**.
- 🐱 **Gato NPC sentado sobre un barril**.

### 🧝 **Reino de las Hadas**
- **Paleta de colores brillantes en tonos azules y verdes**.
- **Árboles coloridos**.

---

## 🎭 **Objetos Interactivos**
### 💰 **Cofres del tesoro**
- **Cofre cerrado**.
- **Cofre abierto**.

### 🚪 **Puertas**
- **Puerta cerrada**.
- **Puerta abierta**.

---

## 🖥 **Elementos de UI / HUD**
- ❤️ **Barra de salud:** Corazones o barra segmentada.
- 💚 **Barra de resistencia:** Indicador verde debajo de la salud.
- 📜 **Pantalla de inventario:** Espacios para objetos (vacíos o llenos con **armas, pociones, monedas**).
- 💬 **Cuadro de diálogo:** Bocadillo de texto en arte pixelado.
- 💀 **Pantalla de Game Over:**  
  - **Fondo oscuro** con el mensaje **"Has muerto"**.
  - Botones **"Reintentar" / "Salir"**.

---

# **Sounds Needed** 🔊🎶

---

## 🎼 **Efectos de sonido**
- 👣 **Pasos suaves** (suelo de tierra).
- 🏛 **Pasos más marcados** (suelo de piedra).
- 🪂 **Aterrizaje suave** (baja velocidad de caída).
- 💥 **Aterrizaje fuerte** (alta velocidad de caída).
- 🪞 **Vidrio rompiéndose**.
- 🏆 **Apertura de cofre**.
- 🚪 **Apertura de puerta**.

---

## 🎵 **Retroalimentación de Jugador**
- 😌 **Sonido de alivio** (“Ahhhh!” al recuperar salud).
- 😵 **Sonido de impacto** (“Ooomph!” al ser atacado).
- 🔔 **Campanilla alegre** (al obtener una vida extra).
- 🔕 **Campanilla triste** (al morir).

---

# **Music Needed** 🎼🎮

---

## 🎶 **Pistas de fondo**
- 🌲 **Pista de "bosque":**  
  - **Melodía de ritmo lento y tensa** para generar una sensación inquietante.
- 🏰 **Pista de "castillo":**  
  - **Música emocionante** que refuerce la sensación de grandeza y peligro.
- 🏚 **Pista de "mazmorra":**  
  - **Sonido lento y espeluznante** para aumentar la sensación de misterio y tensión.
- 🎬 **Pista de créditos finales:**  
  - **Melodía alegre y satisfactoria** para cerrar la experiencia del jugador.

---

## 🎵 **Easter Egg**
- 🎤 **La canción #1 de Rick Astley:**
  - 🕺 **"Never Gonna Give You Up"** como un **easter egg** o contenido especial dentro del juego.

---
# **📅 Schedule** 🕹️🎮

---

## **Fases de Desarrollo**
### 🛠 **Desarrollo de Clases Base**
- ✅ **Entidad Base**
- ✅ **Jugador Base**
- ✅ **Enemigo Base**
- ✅ **Bloque Base**
- ✅ **Estado Base de la Aplicación**
  - 🌎 **Mundo del juego**
  - 📜 **Mundo del menú**

---

## **🏗 Desarrollo de Características Principales**
- ✅ **Física y colisiones**
- ✅ **Optimización de controles y física**
- ✅ **Clases Derivadas**
  - 🔲 **Bloques**: Móviles, Que caen, Que se rompen, Nube.
  - 👾 **Enemigos**: Soldado, Rata, Otros.
- ✅ **Diseño de niveles**
  - 🎮 **Movimiento y saltos**
  - 🎯 **Mecánica de lanzamiento**
  - 🏗 **Ritmo de aprendizaje**
- ✅ **Sonidos y Música**
  - 🔊 **Efectos de sonido**
  - 🎵 **Banda sonora**

---

# **📅 Plan Semanal**  

## **Semana 1: Configuración Base del Proyecto**
✅ **Implementación de clases base**  
- Creación de las clases **BaseEntity, BaseCharacter, BaseObject, BaseItem, BaseWeapon**.  
- Configuración de atributos y métodos esenciales.  

✅ **Configuración del motor de juego**  
- Definir la **estructura de archivos y carpetas**.  
- Configurar el **motor gráfico** y el **sistema de colisiones**.  
- Implementar un **loop de juego** básico con **renderizado y actualización**.  

✅ **Implementación del menú principal**  
- Creación de la **pantalla de inicio**.  
- Implementación de la **pantalla de selección de usuario y carga de partidas**.  

---

## **Semana 2: Desarrollo del Jugador y Controles**
✅ **Implementación del personaje principal (Sentinel)**  
- Creación de la clase **PlayerCharacter**.  
- Animaciones de **caminar, atacar y recibir daño**.  

✅ **Implementación de los controles**  
- Movimiento con las **teclas de dirección**.  
- Ataques básicos (**espada, arco**).  
- Uso de **objetos del inventario**.  

✅ **Sistema de colisiones y física del jugador**  
- Detección de **colisiones con paredes y objetos**.  
- Implementación de **rebote y empuje al recibir golpes**.  

---

## **Semana 3: Implementación de Enemigos y Combate**
✅ **Creación de la clase EnemyCharacter con diferentes tipos de enemigos**  
- Implementar IA básica (**perseguir al jugador, atacar, patrullar**).  
- Crear enemigos básicos como **ratas y soldados oscuros**.  

✅ **Desarrollo del sistema de combate**  
- Implementación de la **mecánica de ataque y daño**.  
- Sistema de **barra de salud y muertes de enemigos**.  
- Colisiones entre **ataques y enemigos**.  

✅ **Introducción del sistema de habilidades y mejoras**  
- Implementación de **ataques cargados y golpes críticos**.  
- Diferenciación de armas con **distintas velocidades y daños**.  

---

## **Semana 4: Implementación del Inventario y Tienda**
✅ **Creación del sistema de inventario**  
- Menú de **inventario con casillas de objetos**.  
- Implementación de **uso de objetos desde el inventario**.  

✅ **Implementación de la tienda del anciano**  
- **Sistema de compra y venta** de objetos.  
- **Restricciones por monedas y espacio** en el inventario.  
- **Diálogos y mecánicas de interacción** con NPCs.  

✅ **Sistema de recompensas y economía**  

---

## **Semana 5: Diseño de Niveles y Mazmorras**
✅ **Creación de las habitaciones de la mazmorra**  
- Implementación de las **10 habitaciones principales** con diferentes distribuciones.  
- Diseño de **obstáculos y trampas**.  
- Creación de **cofres con recompensas aleatorias**.  

✅ **Mecánicas de exploración**  
- Interacción con **puertas y mecanismos ocultos**.  
- Activación de **trampas y acertijos ambientales**.  
- Implementación del **sistema de progresión por habitaciones**.  

---

## **Semana 6: Implementación de Jefes y Eventos Especiales**
✅ **Creación de la IA del jefe final**  
- Implementación de **fases de combate con ataques especiales**.  
- Comportamiento dinámico del jefe según la **vida restante**.  

✅ **Misiones secundarias y NPCs adicionales**  
- Interacciones avanzadas con NPCs.  
- Recompensas ocultas por explorar ciertas áreas.  

✅ **Incorporación del sistema de diálogos y pistas de la historia**  

---

## **Semana 7: Pulido de Interfaz, HUD y Sonido**
✅ **Implementación del HUD del jugador**  
- **Barra de salud y resistencia**.  
- **Minimapa y brújula** para la mazmorra.  
- **Indicadores de interactividad** en objetos y NPCs.  

✅ **Adición de efectos visuales**  
- **Iluminación dinámica** en las habitaciones.  
- **Partículas de fuego** en antorchas y explosiones.  
- **Brillos** en objetos mágicos y ataques especiales.  

✅ **Integración de efectos de sonido y música**  
- Sonidos **ambientales en la mazmorra**.  
- **Efectos de sonido para golpes, saltos y movimientos**.  
- Implementación de **música de fondo** en cada zona.  

---

## **Semana 8: Optimización y Balanceo del Juego**
✅ **Ajustes en la dificultad del juego**  
- Balance de **daño de armas y resistencia de enemigos**.  
- Modificación de **velocidades de ataque y evasión**.  

✅ **Optimización del rendimiento**  
- Reducción de **consumo de memoria y carga de texturas**.  
- Mejora en la eficiencia del código de **IA y colisiones**.  

✅ **Ajustes en el diseño de niveles y recompensas**  
- Distribución estratégica de **enemigos y cofres**.  
- Revisión de **acertijos para mantener la fluidez del juego**.  

---

## **Semana 9: Pruebas y Corrección de Errores**
✅ **Pruebas de jugabilidad**  
- Testeo de **bugs en mecánicas de combate y exploración**.  
- Corrección de **errores de colisión y físicas**.  

✅ **Balanceo de la dificultad**  
- Ajustes en el **nivel de daño de enemigos y duración de combates**.  
- Ajuste de **precios en la tienda y recompensas**.  

✅ **Pruebas con jugadores externos**  
- Recolección de **retroalimentación y mejoras finales**.  

---

## **Semana 10: Últimos Ajustes y Lanzamiento**
✅ **Implementación de la pantalla de créditos y final del juego**.  
✅ **Integración de cinemáticas y transiciones entre niveles**.  
✅ **Últimos ajustes en animaciones y efectos visuales**.  
✅ **Preparación del juego para distribución y publicación**.