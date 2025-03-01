# **The Lost Sentinel**

## _Game Design Document_

---

##### **Copyright notice / author information / boring legal stuff nobody likes**
- Amilka Daniela Lopez Aguilar A01029277
- Emiliano Deyta Illescas A01785881
- Jin Sik Yoon A01026630

##
## _Index_

---

1. [Index](#index)

2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)  

3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)

3. [Mechanics](#mechanics)

4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges

5. [Game Flow](#game-flow)

6. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)

7. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)

8. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)

9. [Schedule](#schedule)

## _Game Design_

---

### **Summary**
The Lost Sentinel combines Zelda-style exploration with RPG progression mechanics. 
Players can freely explore an open world, engage in combat, solve puzzles, and interact with NPCs to complete various quests.
Defeat powerful bosses and collect legendary items!

### **Gameplay**
What should the gameplay be like? What is the goal of the game, and what kind of obstacles are in the way? What tactics should the player use to overcome them?
Prologue

The darkness dissipates.
The young man awakens and wanders through the dungeon, finding an item shop attended by an elderly man.
On the cold stone floor, a young man slowly opens his eyes. The faint light of a torch flickers on the walls, casting dancing shadows in the damp cave. He tries to rise, but his body feels heavy.
Then, a rough voice breaks the silence.
"At last, you have awakened, young hero."
Before him stands an elderly man with a wrinkled face. He wears a worn-out robe and holds a small wooden staff.
The young man blinks, confused. He doesn't remember how he got there or why he's in this place. His mind is clouded with fog and unanswered questions.
The elderly man steps forward slowly and, with a firm but calm voice, says:
"There is no time to waste. Your family has been captured by the army of darkness."
The young man's eyes widen.
"If you want to save them, you will need a weapon. Leave the cave and turn left. There, my companion will give you a sword."
The young man clenches his fists. He feels fear, uncertainty, but also an undeniable calling.
The elderly man gazes at him intently and adds solemnly:
"The path will be difficult, but your destiny has already been sealed. Go now, hero."
Without hesitation, the young man takes a step forward and ventures into the darkness. The true test is about to begin.
The elderly man hands him a wooden sword and pushes him out of the shop.

Player starts off in the start menu. Link walks accross the screen until the player clicks the button to start. 
A screen with a summary of the game's story is displayed.
A black screen is shown and then it dissipates. 
The player is then shown a young man in a dungeon. He is lying on the ground. The player can use the arrow keys to move accross the map. To move from one room to another, the player has to press the upward arrow key.The player will find some npcs, item shops and a warning/advice fairy. In this last room, the player will either find a strong enemy or a hidden treasure in the following room. 
The player will have to move accross 10 different rooms. In each, the player will find an enemy. Difficulty will increase with each room. 

### **Mindset**

The player will feel weak in the beginning, since the weapons available may not be able to defeat all of the enemies.
The player will have to be clever and persevere to gain better items from the shop in order to complete either the full or more levels of the game. 
Gaining advantages will serve as engagement and as an incentive for the player to keep trying. 

## _Technical_

---

### **Screens**
1. Title Screens: Sneak peak at the map. The main character, Sentinel, walks across the screen until the player clicks the start button.

2. Story Screen: A summary of how Sentinel ended up in the dungeon is displayed. Text flows from top to bottom. Screen dissipates. This screen will appear every 3 chambers to reveal more information about Sentinel's character and his relationship with the main villain. 

3. Options: 
    Start Button will request for the player to log in using appropriate credentials. "Please, try again" message will appear until credentials successfully match. 
        - Username
        - Password
    Game controls screen
        - png of the corresponding key and what the player can do with it. All arrows, cursor and left click, 'Q' and 'Z'
4. Game
    1. Inventory: Screen with square images of all artifacts and items collected. Accumulated currency shown at the upper right of the screen. 
    2. Assessment / Next Level: Black screen that dissipates to show time and scenery changes in the game. Yellow screen with bushes, wood houses and doors to switch between levels. Random object placement as player increases between levels.
    3. Game Over: Black screen with a message that says "Game Over" and a button to restart from the beginning. 
    4. Dungeon Screen (described below)
    5. Leaving the dungeon: natural light, map with bushes and yellow concrete. 

5. End Credits: Black screen that shows all characters in square images. Ends with creators' names and apa references for borrowed or inspiration content (sound effects and music)

_(example)_

### **Controls**

Movement: The player controls the protagonist's movement using the arrow keys (Up, Down, Left, Right).
Up Arrow: Move to the next room (if possible).
Other Arrows: Move in the respective directions within a room or dungeon.

Combat Controls:
Attack: Press “Z” to perform an attack (basic sword or weapon).
Special Attacks/Abilities: Press “X” for special abilities, which the player can acquire throughout the game.

Interactive controls:
Interact: Press left click with the mouse to interact with objects, NPCs, or items.

Inventory: Press "I" to open up the inventory. Player will be able to visualize accumulated currency and items-artefacts. 

### **Mechanics**

1. Rooms and Dungeon Layout:

The dungeon consists of 10 rooms that the player must progress through.
Each room may have different layouts, obstacles, enemies, and interactions.
Some rooms contain NPCs, item shops, warning/advice fairies, or hidden treasures.
In the final room of the dungeon, players will face either a strong boss enemy or discover a hidden treasure that may provide valuable rewards.

Room Progression:

The player advances to the next room by pressing the Up Arrow when near the exit.
Difficulty increases with each room. Enemies become stronger, and the environment presents more complex challenges.

2. Combat and Enemy Mechanics

Enemies:

Each room contains at least one enemy, which the player must defeat before progressing.
As the player advances, enemy difficulty increases—enemies get stronger, faster, and potentially gain new abilities.

Combat Mechanics:

Attack: Players can defeat enemies by using their weapon. The damage output depends on the weapon's stats.
Health: The player has a health bar. If health reaches 0, the player dies and must restart from the beginning.
Item Use in Combat: Items such as healing potions or stat-boosting potions are gained as the player progresses between levels and/or the character dies.

3. NPCS

Fairy Assistance:
Some rooms contain advice fairies that provide helpful hints or warnings about upcoming challenges (e.g., “Be careful! The next enemy is very strong!”).
These fairies may also offer clues to hidden treasures.

4. Quests and Storyline

Main Quest:
The player must complete a main questline that revolves around escaping the dungeon and uncovering the mystery behind the traps and enemies.
Along the way, players will encounter mini-quests from NPCs..

Side Quests:
Hidden treasures unlock items.
Some side quests may also involve combat.

5. Permanent death and Starting Over:

Upon dying, the player must restart the dungeon from the first room, losing most of their resources but keeping the starting sword and some strength.
This creates a challenge where players must carefully strategize and improve their items and abilities to progress further in each subsequent playthrough.


## _Level Design_
---
### **Themes**

1. Dungeon chambers
    1. Mood
        1. Dark, broody, 
    2. Objects
        1. _Ambient_
            1. Lit by torches
            2. Stone-like building, dirty, crumpling noises as player walks through the levelsl, blocks of stone, stone pillars
            3. Doors are represented by hollow, black areas in the corners or bounds of the chamber. 
        2. _Interactive_
            1. Doors
            2. Fairy NPC's
            3. Trapped wildlife (player can give them medicine items and unlock achievements)

2. Shop with old man (npc)
    1. Mood
        1. Inviting, calm, warm
    2. Objects
        1. _Ambient_
            1. More light compared to the dungeon
            2. Antique
            3. Old man NPC standing in front of the shelves with items and weapons
        2. _Interactive_
            1. Old man's do not touch items. He will stop you and get mad. On the third try, he will kick you out. 
            2. Cat
            3. Item and weapon shelves. Player will get to pick one of either or each depending on the run. 

3. Fairy npc's realm 
    1. Mood
        1. Off-putting, mysterious, fairytale
    2. Objects
        1. _Ambient_
            1. Natural light
            2. Has a pond, wildlife and trees
            3. If fairy gets angry (warning fairy), ambient turns hostile, red and scary. 
        2. _Interactive_
            1. Treasure: get coins or a special item. 
            2. Enemies: extremely strong and will have to fight them to continue the game.

_(example)_

### **Game Flow**

1. Player starts in forest
2. Pond to the left, must move right
3. To the right is a hill, player jumps to traverse it (&quot;jump&quot; taught)
4. Player encounters castle - door&#39;s shut and locked
5. There&#39;s a window within jump height, and a rock on the ground
6. Player picks up rock and throws at glass (&quot;throw&quot; taught)
7. … etc.

_(example)_

## _Development_

---

### **Abstract Classes / Components**

1. BasePhysics
    1. BasePlayer
    2. BaseEnemy
    3. BaseObject
2. BaseObstacle
3. BaseInteractable

_(example)_

### **Derived Classes / Component Compositions**

1. BasePlayer
    1. PlayerMainSentinel
2. BaseEnemy
    1. Enemy
    2. Enemy
    3. Enemy
    4. Enemy
    5. Enemy
3. BaseObject
    1. ObjectRock (pick-up-able, throwable)
    2. ObjectChest (pick-up-able, throwable, spits gold coins with key)
    3. ObjectGoldCoin (cha-ching!)
    4. ObjectKey (pick-up-able, throwable)
4. BaseObstacle
    1. ObstacleWindow (destroyed with rock)
    2. ObstacleWall
    3. ObstacleGate (watches to see if certain buttons are pressed)
5. BaseInteractable
    1. InteractableButton

_(example)_

## _Graphics_

---

### **Style Attributes**
1. Color
    Muted earth tones dominate the game, with deep browns and grays for the dungeon's stone walls, contrasted by occasional glimmers of torchlight in warm yellows and oranges. 
    The shop and fairy realms feature brighter colors like golds, greens, and soft blues, giving them a more welcoming atmosphere. 
    The enemies, especially bosses, use darker shades with red or eerie green accents to emphasize danger.

2. Texture
    The dungeon's walls are rough and cracked, with the cold stone underfoot feeling gritty. 
    The shop's wooden shelves are worn but polished, adding warmth to the environment. 
    In the fairy realm, soft textures like smooth water, mossy stones, and delicate foliage provide contrast to the harsh dungeon textures.

3. Graphic style
    The game adopts a pixel art style reminiscent of retro RPGs, with simple yet expressive character sprites and detailed environments. 
    The animation is fluid, focusing on action-heavy moments like combat and puzzle-solving. 
    The visual clarity ensures that the player can easily navigate the environments and identify interactable objects.

4. Animation style
    Subtle, old-school animation with slight movements to bring environments to life (flickering torches, waves of water). 
    Combat animations are simple but impacting, such as slashes or explosions. 
    Non-playable characters and enemies have smooth transitions for interactions, such as talking or attacking, zoom in when necessary.

5. Lighting style
    Dim, atmospheric lighting sets a mysterious tone in the dungeon with torchlight casting flickering shadows. 
    The shop is brighter, with soft overhead light illuminating the items. 
    In the fairy realm, natural light filters through the trees, but hostile elements make the lighting shift to ominous reds when danger is near.

6. Sound effects style
    Minimalistic, atmospheric sounds with echoing footsteps, crackling torches, and distant growls building tension in the dungeon. 
    The shop features the soft chime of items being placed, while the fairy realm has calming water and bird sounds—until it shifts to eerie tones when enemies approach. 
    Combat sounds are punchy and satisfying with sword clashes and enemy roars.

7. Music style
    A haunting, atmospheric soundtrack with a mix of piano, strings, and soft percussion.
    The shop has a light, pleasant melody. 
    The fairy realm has whimsical and mysterious music that turns tense during hostile encounters.

8. UI style
    The UI is simple and intuitive, using pixel-art icons for the inventory and health bar. 
    Text boxes display story elements and NPC interactions clearly, with minimalist borders that don't distract from gameplay. 
    The inventory screen is clean, with clearly labeled items and currency.

9. Interactivity signs 
    Interactive elements are indicated with subtle visual cues, like a glowing outline or a slight shift in the object's texture. 
    NPCs can be highlighted by a small aura or exclamation marks when they have something important to say. 
    In combat, enemies flash or glow when they're vulnerable or ready for an attack.

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Sentinel (idle, walking, throwing, attacking (sword and bow))
        2. Enemy 1(idle, walking, stabbing)

    2. Other
        1. Fairy (idle, flying)
        2. Old man npc (idle, angry, talking/thinking)
2. Blocks
    1. Dirt
    2. Pebbles
    3. Stone Block
    4. Stone Bricks
    5. Stone pillar 
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Bushes
    2. Cracked walls and stone
    3. Torch
    4. Shadows
    5. Rodents
    6. Shops and realms
4. Other
    1. Treasure Chest
    2. Door (hollow, black area)
    3. Gate (appears in front of the door if Sentinel has not fought with enemies)

_(example)_


## _Sounds/Music_

---

### **Style Attributes**

Again, consistency is key. Define that consistency here. What kind of instruments do you want to use in your music? Any particular tempo, key? Influences, genre? Mood?

Stylistically, what kind of sound effects are you looking for? Do you want to exaggerate actions with lengthy, cartoony sounds (e.g. mario&#39;s jump), or use just enough to let the player know something happened (e.g. mega man&#39;s landing)? Going for realism? You can use the music style as a bit of a reference too.

 Remember, auditory feedback should stand out from the music and other sound effects so the player hears it well. Volume, panning, and frequency/pitch are all important aspects to consider in both music _and_ sounds - so plan accordingly!

### **Sounds Needed**

1. Effects
    1. Soft Footsteps (dirt floor)
    2. Sharper Footsteps (stone floor)
    3. Soft Landing (low vertical velocity)
    4. Hard Landing (high vertical velocity)
    5. Glass Breaking
    6. Chest Opening
    7. Door Opening
2. Feedback
    1. Relieved &quot;Ahhhh!&quot; (health)
    2. Shocked &quot;Ooomph!&quot; (attacked)
    3. Happy chime (extra life)
    4. Sad chime (died)

_(example)_

### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;

_(example)_


## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
  2. base app state
        1. game world
        2. menu world
2. develop player and basic block classes
    1. physics / collisions
3. find some smooth controls/physics
4. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
5. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
6. design sounds
7. design music

1. Week 1: Core Setup
Base Classes: Implement base classes (entity, player, enemy, block).
App States: Set up basic game states (game world, menu world).
Player Controls: Develop basic player movement and interactions.

2. Week 2: Physics & Collisions
Player Physics: Implement gravity, jumping, and smooth controls.
Block Mechanics: Set up basic blocks (static, movable, falling).
Collision Detection: Develop collision system for player-block interactions.

3. Week 3: Derived Classes & Advanced Physics
Moving/Falling Blocks: Implement moving platforms and falling blocks.
Enemy AI: Create basic enemy types with simple behaviors.
Combat Mechanics: Develop basic player-enemy interactions (attacking, health).

4. Week 4: Refine Controls & Add Enemies
Smooth Controls: Refine movement and physics for fluid gameplay.
New Enemies: Add more enemy types (e.g., rat, soldier) with varied behaviors.
Combat System: Improve combat mechanics, including animations and attacks.

5. Week 5: Level Design & New Mechanics
Level 1 Design: Create and test the first level with basic mechanics.
Introduce Motion/Jumping: Implement moving platforms, jumping, and environmental puzzles.
Throwing Mechanics: Add object-throwing functionality (bombs, ranged weapons).

6. Week 6: Sounds, Music & Polish
Sound Design: Add sound effects for actions, environments, and enemies.
Music Implementation: Develop and integrate background music.
Polish & Testing: Finalize UI, fix bugs, and balance gameplay.

_(example)_
