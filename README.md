# EquipoLink
Repositorio de equipo que contiene todos los archivos a trabajar en conjunto para la creación del videojuego.

# 🛡️ THE LOST SENTINEL

### by TeamLink

**THE LOST SENTINEL** es un prototipo inspirado en los clásicos juegos de aventura tipo *Zelda*. Controlas a un personaje principal que explora un mundo pixelado desde una vista aérea. El jugador puede moverse libremente por el mapa, interactuar con objetos y usar las diferentes armas para defenderse.

El diseño del mundo se genera con un estilo tipo ASCII, donde el piso está compuesto por tiles aleatorios y las paredes actúan como límites con detección de colisión. El inventario te permite ver cuántos ítems tienes, y está accesible en cualquier momento del juego.

Este prototipo tiene como objetivo sentar las bases de una aventura más grande, con sistemas de combate, exploración, misiones y más.

—

—
## 🌐 Página Web

El videojuego y los desarrolladores de The Lost Sentinel cuentan con una página web principal, donde los jugadores pueden conocer con ayuda de links de redireccionamiento a otras páginas web los siguientes elementos: Historia y nombre de los personajes involucrados, la historia y el propósito del juego, los elementos que conforman al juego (como armas, cofres y mapas), así como los controles del juego. En la parte superior, se encuentran los botones de créditos y de jugar. Créditos contiene la información de los desarrolladores, profesores que imparten el bloque y la liga al repositorio del equipo. 

El jugador se registra o ingresa al juego después de seleccionar el botón de jugar. Se le pregunta por su nombre de usuario y contraseña. Posteriormente, procede a jugar. 

## 🗺️ ¿En qué escena comienza el prototipo?

El prototipo comienza con una **pantalla de inicio** que incluye una **animación de fondo** para ambientar al jugador. Desde ahí, el jugador debe **iniciar sesión** con un usuario y contraseña ya registrados, o presionar el botón de **registro** para crear una nueva cuenta.

Una vez dentro, aparece un **cuadro de prólogo** que introduce la historia. Al presionar **Enter**, el jugador inicia su aventura **dentro de una cueva**, donde puede hablar con un **hombre viejo** que le da una breve introducción.

Después de la conversación, se muestra un **tutorial de controles** para que el jugador pueda familiarizarse con las mecánicas básicas. A partir de ahí, puede comenzar a explorar y practicar.

Cuando el jugador se mueve hacia la **puerta dentro de la cueva**, se activa la transición hacia el **nivel 0**, donde comienza la verdadera aventura.

---

## 🎮 Controles del juego

| Tecla                  | Acción                                                                 |
|------------------------|------------------------------------------------------------------------|
| **Flechas (↑ ↓ ← →)**  | Mueven al jugador en las cuatro direcciones                           |
| **Z**                  | Ataque con espada. Rango corto, golpea justo al frente                 |
| **X**                  | Ataque con arco. Lanza una flecha a larga distancia. Desaparece al golpear o al llegar al límite |
| **C**                  | Ataque con magia. Rango intermedio. Desaparece al alcanzar su distancia máxima |
| **A**                  | Coloca una bomba. Explota después de 2 segundos. Daña si estás en el rango |
| **O**                  | Interactúa con cofres                                                  |
| **D**                  | Toma pociones de regeneración de vida                                  |
| **I**                  | Abre o cierra el inventario                                            |
| **T**                  | Abre o cierra el tutorial de controles                                 |
| **Esc**                | Abre el menú de pausa                                                  |
| **Enter**              | Regresa al juego desde el menú de pausa                                |
| **Espacio (Space)**    | Interactúa con NPCs                                 |

---
Funcionalidades Terminadas

### Pantalla de inicio de juego

Donde se muestra el logo del juego y se le pide al jugador presionar la tecla enter para continuar.

### Prólogo, Pantallas de controles, diálogos de personajes, pantalla de game over. 

Se despliega un prólogo automáticamente después de presionar la tecla enter, tal y como se mencionó anteriormente. Seguido, la pantallas de controles (como se detalla en este README). 

El jugador, si se encuentra en una sala de descanso (junto con el viejito, el hada o vendedor), puede conocer los diálogos de cada uno de ellos. Los diálogos que faltan por implementar en niveles posteriores, se encuentran en un archivo txt para su fácil localización. 

Si el jugador llega a vida 0 HP, se despliega la pantalla de game over. 

### Movimiento del personaje

El jugador se puede mover en 4 direcciones diferentes, norte, sur, este y oeste

### Generación del mapa

Se generan diversos mapas con sus assets o elementos de paredes, obstáculos, pisos. Es una generación aleatoria según un arreglo con caracteres. Este arreglo construye el nivel según un diccionario que indica el número y la posición de sus paredes, pisos y muros. 

### Implementación de las clases enemigo

Se crearon cinco enemigos normales y un jefe final. 

### Generación de nivel predeterminado para NPC

Cada 3 niveles, aparece el nivel con el hada, el viejito y el vendedor. Este es un checkpoint, descanso y oportunidad de mejoramiento para el jugador. De momento, solo contamos con la implementación de esta mecánica en el nivel 0. 

### Acciones del personaje

Dependiendo de qué tipo de armamento ocupe el jugador, se despliegan las animaciones de los respectivos armamentos utilizados. Existen animaciones de up, down, left, right, como las teclas que controlan el movimiento, para cada una de las armas que puede utilizar el personaje principal (espada, magia, arco, bomba).

### Uso de Items

Si el personaje selecciona usar bombas, arco o varita mágica se despliega el proyectil de ítem utilizado y sus animaciones (explosion, impacto). La reducción de items se visualiza tanto en el inventario como en su mana MP en la UI del videojuego. Igualmente, si el personaje encuentra cualquiera de estos elementos, se visualiza el incremento en los items. 

La usabilidad de bomba y arco está sujeta a la cantidad de combas o de flechas con las que cuente el jugador (debe ser mayor a 0). Igualmente, si el usuario hace la compra de cualquiera de estos artefactos o recolecta monedas en los niveles, la cantidad recolectada de monedas, la cantidad de monedas gastadas y los items comprados se refleja en el conteo de los mismos. 

### Interacción con NPCs

El jugador puede interactuar con los personajes del juego (viejito del tutorial, dueño de la tienda, hada) presionando la tecla space. El viejito le proporciona información respecto a la historia del juego, el vendedor le proporciona bombas (5 rupias), flechas (7 rupias) y pociones de regeneración de energía. El hada le proporciona al jugador 10% de ataque al enemigo o al jugador a cambio de 20 rupias (cuestión de suerte).

### Generación aleatoria de enemigos, objetos y items a ganar

Cada que el jugador abre un cofre, tiene ⅓ de probabilidad de obtener una bomba, una flecha o una pocion de regeneracion de vida. 

La cantidad y la posición de rupias es aleatoria por nivel. Se tiene la probabilidad de generar entre 5 hasta 10 rupias, las cuales se ponen aleatoriamente según el ancho y la altura del canvas, respetando cierto margen para que no caigan en las delimitaciones o paredes del mapa.

De una lista con las clases de los enemigos Slime, Bat, Skull, Mage y Knight, se generan 5 enemigos de manera aleatoria y en posiciones aleatorias según la misma mecánica de generación aleatoria de rupias. 

### Desbloqueo de cofres y de puertas 
Los cofres y la transición entre niveles es únicamente posible tras derrotar a todos los enemigos presentes en la habitación actual. 

### Mecánicas de perseguir
Cada enemigo cuenta con un rango, donde si percibe al jugador dentro del mismo, lo persigue y ataca a manera de una colisión entre ambos objetos. 

### Daño 
El daño y la frecuencia de ataque es diferente para cada tipo de enemigo. Un enemigo como skull que ataque en cantidades pequeñas, compensa a través de ataques más frecuentes. 

El daño del jugador es fijo según el tipo de arma y puede matar a los enemigos según el arma y la cantidad de veces que pegue al enemigo. Funciona como una colisión. 
Funcionalidades En Progreso


### Generación de niveles 4 a 10

Repetir, según la plantilla de niveles para cuartos con enemigos y cuartos con NPC. Generar el nivel final donde se encuentra el jefe final. Su clase ya está definida, por lo que faltaría el posicionamiento de todos los ítems referentes a este nivel. 

### Ataques especiales de mago y del jefe final Dragón

Ya que ambos cuentan con un rango alto de reconocimiento de la posición de jugador, estos dos personajes cuentan con ataques a larga distancia. Si bien se cuentan con los sprites y el daño que efectúan estos ataques, falta implementarlos y que estén sujetos a cierta distancia entre el jugador y el enemigo. 

### Continuidad entre niveles

Implementar las mismas condiciones que los niveles 0 a 3 para evitar que el jugador regrese entre cuartos y recolecte monedas infinitas, pero para los niveles 4 a 10.

### Limitar apariciones aleatorias

Condicionar que la generación aleatoria de elementos y de enemigos no pueda ser en muros o paredes, y que no puedan trasladarse a través de estos. 

### Música y efectos de sonido

Contamos con wavs de efectos de sonido para ataque, recolección de items, ruidos de los enemigos al morir, y música temática. Falta implementarlos dentro de sus respectivas clases.

### Elementos de barra de vida de los enemigos 

Para indicarle al jugador su progreso en el combate.

### Escena de cierre

Pantalla con un diálogo de cierre de la historia, donde se diga que paso con Sentinel tras salir de la mazmorra. 

## 📝 Glosario de conceptos para videojuegos **Roguelike** / **Roguelite**

- **Roguelike**: Subgénero de videojuegos que se caracteriza por niveles generados de manera aleatoria, muertes permanentes y una gran dificultad. Cada vez que el jugador muere, comienza de nuevo desde el principio, pero con algo de progreso acumulado.

- **Roguelite**: Similar a los **roguelikes**, pero con menos énfasis en la muerte permanente o más elementos de progresión. Por lo general, los roguelites permiten al jugador retener parte de su progreso tras la muerte, lo que suaviza la dificultad.

- **Permadeath (Muerte Permanente)**: Característica de los juegos roguelike donde, cuando el personaje muere, el jugador debe empezar desde cero sin conservar ningún progreso, como equipo o habilidades.

- **Procedural Generation (Generación Procedural)**: Técnica que se utiliza para crear niveles, mapas o contenidos de manera aleatoria o algorítmica, lo que hace que cada partida sea única.

- **Run**: Una "partida" o intento del jugador dentro de un roguelike. Los jugadores completan una "run" hasta que mueren o alcanzan el final del juego. Cada "run" es diferente debido a la generación aleatoria.

- **Dungeon**: Tipo de nivel o mapa en los juegos roguelike. Generalmente, son mazmorras generadas aleatoriamente que el jugador debe explorar y conquistar, enfrentando enemigos y buscando tesoros.

- **Power-up**: Mejoras temporales o permanentes que el jugador puede obtener durante su aventura. Estas mejoras son el 10% de ataque, las flechas, bombas, pociones y rupias que puede adquirir el jugador.

- **Meta-progresión**: Progreso que persiste entre las partidas, incluso después de la muerte del personaje. Esto es a traves de los checkpoints o mapas con NPC.

- **Boss (Jefe)**: Enemigos grandes y difíciles que suelen aparecer al final de una zona o nivel. Derrotar al jefe Dragon es un reto importante.

- **Mana**: Energía que se consumen al realizar acciones como atacar con magia. La gestión de mana es clave para sobrevivir en estas partidas.

- **Random Events (Eventos Aleatorios)**: Acontecimientos o situaciones inesperadas que pueden ocurrir mientras se explora un nivel. Estos eventos pueden ofrecer desafíos adicionales, recompensas o alteraciones en las reglas del juego.

- **Character Build (Construcción de Personaje)**: La combinación de habilidades, estadísticas y equipo que el jugador selecciona durante una partida. Los roguelikes a menudo permiten al jugador construir su personaje de diferentes maneras, dependiendo de las elecciones que haga durante el juego.

- **Spawn (Aparecer)**: El acto de generar un enemigo, objeto o evento dentro del juego. En muchos roguelikes, los enemigos o eventos pueden "aparecer" aleatoriamente en el mapa durante la exploración.

- **Checkpoint**: Aunque muchos juegos roguelike tradicionales no tienen checkpoints debido a la muerte permanente, algunos roguelites permiten puntos de control donde el jugador puede guardar el progreso de su run.

- **Chests (Cofres)**: Contenedores que aparecen en los niveles y pueden contener botín, armas, objetos o mejoras. Los cofres suelen ser una fuente importante de recursos y tienen probabilidades de contener objetos raros.

- **Unlockables (Desbloqueables)**: Elementos, personajes, armas, o modos que se desbloquean a medida que el jugador progresa en el juego.

- **UI (Interfaz de Usuario)**: Es el conjunto de elementos gráficos y controles mediante los cuales el jugador interactúa con el videojuego. Incluye menús, barras de vida, mapas, botones, etc.

- **NPC (Personaje No Jugador)**: Son los personajes del juego que no son controlados por el jugador. Pueden tener distintos roles, como enemigos, aliados o simplemente elementos de la historia.

- **HUD (Heads-Up Display)**: Pantalla que muestra información importante mientras se juega, como la salud del personaje, munición, puntos, mapas, entre otros. Suele estar en la parte superior o inferior de la pantalla.

- **Cutscene (Cinemática)**: Secuencia de video dentro del juego que avanza la historia, a menudo sin control por parte del jugador.
