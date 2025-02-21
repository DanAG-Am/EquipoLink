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
The Lost Sentinel combines Zelda-style exploration with RPG progression mechanics. 
Players can freely explore an open world, engage in combat, solve puzzles, and interact with NPCs to complete various quests.
Defeat powerful bosses and collect legendary items!

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

2. [Gameplay](#gameplay)
     Player starts off in the menu. Link walks accross the screen until the player clicks the button to start. 
     A screen with a summary of the game's story is displayed.
     A black screen is shown and then it dissipates. 
     The player is then shown a young man in a dungeon. He is lying on the ground. The player can use the arrow keys to move accross the map. To move from one room to another, the player has to press the upward arrow key.The player will find some npcs, item shops and a warning/advice fairy. In this last room, the player will either find a strong enemy or a hidden treasure in the following room. 
     The player will have to move accross 10 different rooms. In each, the player will find an enemy. Difficulty will increase with each room. 

3. [Mindset](#mindset)
    The player will feel weak in the beginning, since the weapons available may not be able to defeat all of the enemies.
    The player will have to be clever and persevere to gain better items from the shop. 
    
3. [Technical](#technical)

    1. [Screens](#screens)
    Black screen that dissipates to show time and scenery changes in the game. 
    - When the start game screen is dismissed
    - After the player moves from one level to another
    - Game credits 
    Yellow screen with bushes and doors. Random object placement. 
    - When the player enters a new room

    2. [Controls](#controls)
Movement: The player controls the protagonist's movement using the arrow keys (Up, Down, Left, Right).
Up Arrow: Move to the next room (if possible).
Other Arrows: Move in the respective directions within a room or dungeon.

Combat Controls:
Attack: Press “Z” to perform an attack (basic sword or weapon).
Special Attacks/Abilities: Press “X” for special abilities, which the player can acquire throughout the game.

3. [Mechanics](#mechanics)

1. Rooms and Exploration

Rooms and Dungeon Layout:
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

4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

Sum up your game idea in 2 sentences. A kind of elevator pitch. Keep it simple!

### **Gameplay**

What should the gameplay be like? What is the goal of the game, and what kind of obstacles are in the way? What tactics should the player use to overcome them?

### **Mindset**

What kind of mindset do you want to provoke in the player? Do you want them to feel powerful, or weak? Adventurous, or nervous? Hurried, or calm? How do you intend to provoke those emotions?

## _Technical_

---

### **Screens**

1. Title Screen
    1. Options
2. Level Select
3. Game
    1. Inventory
    2. Assessment / Next Level
4. End Credits

_(example)_

### **Controls**

How will the player interact with the game? Will they be able to choose the controls? What kind of in-game events are they going to be able to trigger, and how? (e.g. pressing buttons, opening doors, etc.)

### **Mechanics**

Are there any interesting mechanics? If so, how are you going to accomplish them? Physics, algorithms, etc.

## _Level Design_

---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**

1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

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
    1. PlayerMain
    2. PlayerUnlockable
2. BaseEnemy
    1. EnemyWolf
    2. EnemyGoblin
    3. EnemyGuard (may drop key)
    4. EnemyGiantRat
    5. EnemyPrisoner
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

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they&#39;re interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Goblin (idle, walking, throwing)
        2. Guard (idle, walking, stabbing)
        3. Prisoner (walking, running)
    2. Other
        1. Wolf (idle, walking, running)
        2. Giant Rat (idle, scurrying)
2. Blocks
    1. Dirt
    2. Dirt/Grass
    3. Stone Block
    4. Stone Bricks
    5. Tiled Floor
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Tall Grass
    2. Rodent (idle, scurrying)
    3. Torch
    4. Armored Suit
    5. Chains (matching Weathered Stone Bricks)
    6. Blood stains (matching Weathered Stone Bricks)
4. Other
    1. Chest
    2. Door (matching Stone Bricks)
    3. Gate
    4. Button (matching Weathered Stone Bricks)

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

_(example)_
