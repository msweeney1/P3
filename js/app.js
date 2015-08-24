/**
 * @fileoverview This files defines the Enemy, Player and Gem classes and instantiates objects of these 
 * classes to implement game functionality.
 */

/* @const */var CANVAS_WIDTH=505;

/**
 * Height of each element (grass,water,block/road) in the map
 * @const {number} 
 */
var BLOCK_HEIGHT=80;

/**
 * Player moves 80 px vertically across the canvas in each step
 * @const {number} 
 */
var STEP_Y=80;

/**
 * Player moves 95 pixels horizontally across the canvas in each step
 * @const {number} 
 */
var STEP_X=95;

/**
 * Height and width of bug to check for collision
 * @const {number}
 * @const {number} 
 */
var BUG_HEIGHT=70;
var BUG_WIDTH=101;

/**
 * Randomly choose bug speeds from this array
 * @const {Array.number} 
 */
var BUG_SPEED =[80,100,120]; 

/**
 * Maximum number of bugs in the game
 * @const {number} 
 */
var MAX_BUGS=3; 

/**
 * Actual bug image starts after 75 pixels down vertically in the sprite
 * @const {number} 
 */
var SLIDE_BUG_Y=75;

/**
 * Records high scores of player across game loops
 * @type {number} 
 */
var HIGH_SCORE=0;

/**
 * Control variable to specify pause state of game
 * @type {boolean} 
 */
var PAUSED=true;

/**
 * Initial X and Y position of player
 * @const {number}
 * @const {number} 
 */
var INITIAL_X_PLAYER=200;
var INITIAL_Y_PLAYER=400;

/**
 * Height and width of player to check for collision
 * @const {number}
 * @const {number} 
 */
var PLAYER_HEIGHT=80; 
var PLAYER_WIDTH=75;

/**
 * Actual player image starts after 15 pixels to the right horizontally in the sprite
 * @const {number}
 */
var SLIDE_PLAYER_X=15;

/**
 * Actual player image starts after 75 pixels down vertically in the sprite
 * @const {Number}
 */
var SLIDE_PLAYER_Y=60; 

/**
 * Game is over when time runs out or player looses all lives
 * @type {Boolean}
 */
var GAME_OVER=false;

/**
 * maximum number of gems at any given time. 
 * When player takes all gems displayed, new ones are shown.  
 * @const {Number}
 */
var MAX_GEMS=3;

/**
 * New gem colors are chosen randomly from this array
 * @type {Array}
 */
var GEM_COLORS=['Blue','Green','Orange'];

/* @const */ var GEM_WIDTH=101;

/**
 * Possible y locations where the gems can be i.e y locations on the grey blocks.
 * @type {Array}
 */
var GEM_Y_LOCATIONS=[25+BLOCK_HEIGHT,110+BLOCK_HEIGHT,190+BLOCK_HEIGHT];

/**
 * Stores enemy objects in the game
 * @type {Array}
*/
var allEnemies= [];

/**
 * Stores gems objects in the game
 * @type {Array}
 */
var allGems=[];

/**
 * Time in seconds for one game loop  
 * @const {Number}
 */
var MAX_TIME=30;

/**
 * Counts down from MAX_TIME to 0 and represents one loop in game.
 * @type {Number}
 */
var timerLoop=MAX_TIME;

/**
 * Set to true when game finishes because times up.
 * @type {Boolean}
 */
var TIMES_UP=false;

/**
 * Set to true when games finishes because player lives finished.
 * @type {Boolean}
 */
var LIVES_UP=false;

/**
 * ENEMY CLASS. This class defines the features and implements the functionality of 
 * 'enemy/bugs' in the game.
 * @param {number} x Represents the horizontal x-axis position of enemy on canvas.
 * @param {number} y Represents the vertical y-axis position of enemy on canvas
 * @param {number} speed Represents the rate of displacement of enemy objects along the
     horizontal axis
 * @constructor
 */
var Enemy = function(x,y,speed) {
    /**
     * Name of the image representing the enemy
     * @type {String}
     */
    this.sprite = 'images/enemy-bug.png';
    this.x=x;
    this.y=y;
    this.speed=speed;
}

/**
 * Update the enemy's position
 * @param  {Number} dt A time delta between ticks.
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!PAUSED) this.x=this.x+this.speed*dt;
    
    if (this.x>=CANVAS_WIDTH) {
        this.x=0; // reset enemy to the left of the canvas
       
        //generate a random number between 0 and 3 
        //to decide what row the bug re-appears from
        var rand1=generateRandom(3,0);
       
        if (rand1==0) this.y=65;
        if (rand1==1) this.y=145;
        if (rand1==2) this.y=225;
    }
}


/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    if(!GAME_OVER)//if game is not over, draw Image
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Player Class. This class defines the features and implements the functionality of 
 * player in the game.
 * @param {number} x Represents the horizontal x-axis position of player on canvas.
 * @param {number} y Represents the vertical y-axis position of player on canvas
 * @param {number} maxLife Represents the maximum number of lives player has in one 
     run of the game.
 * @param {number} score Represents score of the player.
 * @constructor
 */
var Player=function(x,y,maxLife,score){
    this.x=x;
    this.y=y;
    this.maxLife=maxLife;
    this.score=score;

    /**
     * Name of Image representing the player
     * @type {String}
     */
    this.sprite='images/char-cat-girl.png';
    /**
     * Lives Remaining. Initially set to maximum Lives
     * @type {Number}
     */
    this.lives=maxLife;
    
}
/**
 * Update the position of the player, check for collision with enemy to reset player
 * location and score points when colliding with gems
 * @param  {Number} dt A time delta between ticks.
 */
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    /**
     * Format for defining the bounding rectangle for player and bug to check for collision
     * r1 = {
     *  top:  The y-value of the top of the rectangle
     *  bottom:  the y-value of the bottom of the rectangle
     *  right: the x-value of the right side of the rectangle
     *  left:  the x-value of the left side of the rectangle
     * };
     * @type {Object}
     */
    player1= {
         'top':   this.y+SLIDE_PLAYER_Y,
         'bottom': this.y+SLIDE_PLAYER_Y+PLAYER_HEIGHT,
         'right': this.x+SLIDE_PLAYER_X+PLAYER_WIDTH,
         'left': this.x+SLIDE_PLAYER_X
    };
    /**
     * Loop through all bugs in allEnemies and check if player collides with any.
     */
    for (enemyBug in allEnemies){
        bug={
             'top':   allEnemies[enemyBug].y+SLIDE_BUG_Y,
             'bottom': allEnemies[enemyBug].y+SLIDE_BUG_Y+BUG_HEIGHT,
             'right': allEnemies[enemyBug].x+BUG_WIDTH-20,
             'left': allEnemies[enemyBug].x+20
        };

        if(!(player1.left>(bug.right-10) || player1.right < (bug.left+10) ||player1.top>=(bug.bottom-10) || player1.bottom <=(bug.top+10))) {
            handleEnemyCollision();       
            break;//avoid multiple life loss
        }

    }
    /**
     * Check for Gem Collision with player. Loop through all gems.
     */
    for (gem in allGems) {
        gem1={
             'top':   allGems[gem].y+40,//adjust for start for gem image..25
             'bottom': allGems[gem].y+80,//block height is gem height..so if player is in that block
             'right': allGems[gem].x+GEM_WIDTH,
             'left': allGems[gem].x
        };
        if(allGems[gem].visible) { //if the hit gem is visible
            if(!(player1.left>(gem1.right) || player1.right < (gem1.left) ||player1.top>(gem1.bottom) || player1.bottom <(gem1.top))) {    
               //increase score
                this.score+=5;
                //UPDATE SCORE
                $("#score").html('<p>'+this.score+'</p>');
                //hide gem indicating it has been taken by player
                allGems[gem].visible=false;
                //play sound
                var audio = document.getElementById("audio");
                audio.play();
            }

        }
    }
}
/**
 * Draw Player on canvas
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
/**
 * Move the player according to the key pressed
 * @param  {KeyCode} keycode Represents up, down , left or right key press
 */
Player.prototype.handleInput = function(keycode) {

    var newpos; //new position of player after key press
    if(!PAUSED){
        //ensure that the player stays in bound
        switch (keycode) {
            case 'up':
                newpos=this.y-STEP_Y;
                this.y= (newpos>BLOCK_HEIGHT) ? newpos : BLOCK_HEIGHT;
                break;
            case 'down':
                newpos=this.y+STEP_Y;
                this.y= (newpos<=INITIAL_Y_PLAYER) ? newpos : INITIAL_Y_PLAYER;  
                break;
            case 'left':
                newpos=this.x-STEP_X;
                if(newpos>=0) this.x=newpos;
                break;
            case 'right':
                newpos=this.x+STEP_X;
                //incorpotate for the point where the actual image starts
                if((newpos+SLIDE_PLAYER_X +PLAYER_WIDTH)<=CANVAS_WIDTH) this.x=newpos;   
        } 
    }
}
/**
* Gems Class. This class represents objects the player must collide to score points
* @param {number} x Represents the horizontal x-axis position of Gems on canvas.
* @param {number} y Represents the vertical y-axis position of Gems on canvas
* @param {boolean} visible Represents whether the gem is visible to player or not
* @constructor
*/
var Gems =function(color,x,y,visible){
    /**
     * Name of gem based of its color.
     * @type {String}
     */
    this.sprite='images/Gem'+color+'.png';
    this.x=x;
    this.y=y;
    this.visible=true;//gems are hidden when player collides with them
                    //and are re-positioned and re-appear when all displayed
                    // gems are taken by player
}
/**
 *  Checks if all gems are taken i.e. not visible,
 *  if so, generate new positions and colors for gems and make them visible
 */
Gems.prototype.update=function(){
    /**
     * check how many gems are invisible on the canvas
     * @type {Number}
     */
    var allgone=0;
    for (g in allGems) {
        if (allGems[g].visible==false) allgone++;
    }
   /**
    * If all gems are invisible, redisplay gems at new random
    * position and new colors.
    */
    if (allgone==allGems.length){//generate random positions and make gems visible
        for ( g in allGems){
            //select random x position i.e one of the five blocks in a row
            var randX=generateRandom(5,0);    
            //select random y position i.e what row to show bug in
            var randY=generateRandom(3,0);
            //select random color for the bug
            var rand2=generateRandom(3,0);
            
            allGems[g].visible=true;
            allGems[g].x=randX*GEM_WIDTH;
            allGems[g].y=GEM_Y_LOCATIONS[randY];
            allGems[g].sprite='images/Gem'+GEM_COLORS[rand2]+'.png';
        }    
    }
}
/**
 * Draw gems on the canvas if game is not finishes
 */
Gems.prototype.render=function(){
    if(!GAME_OVER)//if game is not over and Gem is visible draw it
        if(this.visible) ctx.drawImage(Resources.get(this.sprite), this.x, this.y,100,100);
}


// Place all enemy objects in an array called allEnemies

/**
 * Place the player object in a variable called player
 * @type {Player}
 */
var player= new Player(INITIAL_X_PLAYER,INITIAL_Y_PLAYER,5,0);    
 //create enemy bugs, gems and push them to the global allEnemies, allGems array

/**
 * Load heart images to represent life
 * @type {String}
 */
var HTML_Life="<img class='life1' src='images/Heart.png' height='15%' width='15%'>"; 
/**
 * Dsiplay msxLife hearts and append to DOM
 */
for (i=0;i<player.maxLife;i++){
    $(".heart-img").append(HTML_Life);
}
$(".life1").hide(); //Initially Hide them, display them only when Start/Restart pressed


/**
 * Instantiate allEnemies and allGems global arrays. Called by gameStartRestart()
 */
function instantiateGameObjects() {
    for (i=0; i<MAX_BUGS;i++) {
        //generate a random starting position in the row
        var randX=generateRandom((CANVAS_WIDTH-BUG_WIDTH),0);
        //select a random index to choose speed of the bug from the array BUG_SPEED
        var rand2=generateRandom(3,0);
        
        //select random y position i.e what row to show bug in
        var randY=generateRandom(3,0);//generate a number in the range [0,3) to pick from on the three rows in the map
        var y;
        if (randY==0) y=65; //y location for the first row
        if (randY==1) y=145; //y location for the second row
        if (randY==2) y=225; //y location for the third row
        
        //start bugs from the left of the canvas, makes the game easier to play instead of a random location
        var enemy1= new Enemy(0,y,BUG_SPEED[rand2]);
        allEnemies.push(enemy1);
    }

    for (i=0; i<MAX_GEMS;i++) {
        //generate a random x position in the row from the five blocks in each row
        var randX=generateRandom(4,0);
        
        //select random y position i.e what row to show gem in
        var randY=generateRandom(3,0);
    
        //select random index to choose color from the GEM_COLORS array 
        var rand2=generateRandom(3,0);

        //last argument initially make the gem visible    
        var gem1= new Gems(GEM_COLORS[rand2],randX*GEM_WIDTH,GEM_Y_LOCATIONS[randY],true);
        allGems.push(gem1);
    }
    $("#pausePlayButton").prop("disabled",true); //enable the pause button

}

/**
 * Handle Collision with Enemy, player set to initial position, lives decreased by 1
 * Checks if game over in case player runs out of lives. Called by Player.prototype.Update()
 */
function handleEnemyCollision(){
    //reset to initial player position
    player.x=INITIAL_X_PLAYER;
    player.y=INITIAL_Y_PLAYER;
     //decrease life hearts
    player.lives=player.lives-1;
    //find the last visible child (heart) and make it invisible
    $(".heart-img").find(":visible:last").hide(); 
    
    if (player.lives==0) { //player has used all lives and the game loop is over
        PAUSED=true; //to freeze game objects
        
        //disable Pause/Play Button and enable Start/restart Button
        $("#restartStartButton").prop("disabled",false);
        $("#pausePlayButton").prop("disabled",true);
        
        GAME_OVER=true;
        LIVES_UP=true;
         //display high score   
        if (player.score>HIGH_SCORE) {
            $("#new-high-score").show();
            HIGH_SCORE=player.score;
            $("#high-score").show();
            $("#scoreHigh").html(HIGH_SCORE);
        }
    }
}
/**
 * Generate a random Rumber between 'x' and 'y' 
 */
function generateRandom(x,y) {
    return Math.floor(Math.random() *x + y);
}


/**
 * Call back function when Pause/Play button is pressed.
 * Set the PAUSE variable to control the and rename Pause/Play button.
 *  Player has one button to Pause or Play the Game. When the game is running, 
 * the button displays 'Pause', when the user clicks 'Pause', the game is paused 
 * and the button label changes to 'Play'.
 * Now the player can press 'Play' to resume the game.
 */
function gamePause() {
    //game already in pause state when button is pressed and player wants to resume game
    if($("#pausePlayButton").html()=='Play'){
        PAUSED=false;
        ctx.globalAlpha=1; //restore normal display
        $("#pausePlayButton").html('Pause');//re-label button to Pause        
    }
    //Game in play and player wants to pause
    else if($("#pausePlayButton").html()=='Pause'){
        PAUSED=true;
        ctx.globalAlpha=0.5;//change opacity of canvas to indicate pause state
        $("#pausePlayButton").html('Play');
    }    
}

/**
 * Resets games to display all lives, reset score ,reset player position. 
 * Called by gameStartRestart()
 */
function gameReset() {
    $(".life1").show();//show all lives i.e. heart images
    //reset SCORE & player.lives
    player.score=0; 
    player.lives=player.maxLife;
    $("#score").html("<p id='score'>"+player.score+'</p>');//Display SCORE 
    //reset player to original position
    player.x=INITIAL_X_PLAYER; 
    player.y=INITIAL_Y_PLAYER;
}

/**
* Call back function for the setInterval(...) method. 
* Called every second to update the Game timer.
* Checks if player ran out of time and updates game state variables
*/
function displayTimer() {
    if(!PAUSED) {//if game is paused do not decrement the timer
        timerLoop--;
        
        $("#countdown").html("<h1 id='countdown1'>"+timerLoop+'</h1>'); 
        
        if (timerLoop==0) { //game loop is over
            TIMES_UP=true;
            PAUSED=true;//control variable to stop the motion of game objects is set to true
            GAME_OVER=true; //bugs and gems to stop displaying
            player.x=INITIAL_X_PLAYER;
            player.y=INITIAL_Y_PLAYER;
            
            //disable  Play/Pause Button and Enable Start/Restart Button
            $("#restartStartButton").prop("disabled",false);
            $("#pausePlayButton").prop("disabled",true);
            //if high_score greater than player score, update High Score
            if (player.score>HIGH_SCORE) {
                $("#new-high-score").show();
                HIGH_SCORE=player.score;
                $("#high-score").show();
                $("#scoreHigh").html(HIGH_SCORE);
            }
        } 
    }
}
/**
 * Call back function for Start/Restart Button
 * Updates game state variables to reflect start of game and creates enemy and gem objects anew
 */
function gameStartRestart(){
     timerLoop=MAX_TIME; //resetTimer
     PAUSED=false;
     GAME_OVER=false;
     TIMES_UP=false;
     LIVES_UP=false;
    
    //update Timer
    $("#countdown").html("<h1 id='countdown1'>"+timerLoop+'</h1>');
    //empty all gems and enemies array and recreate them
    while(allEnemies.length > 0) {
        allEnemies.pop();
    }
    while(allGems.length > 0) {
          allGems.pop();
    }       

    instantiateGameObjects();//recreate bugs and gems
    
    gameReset();//reset game
    //enable play/pause and disable start/restart button
    $("#pausePlayButton").prop("disabled",false);
    $("#restartStartButton").prop("disabled",true);
    
    //switch the button labels between Start and Restart
    if($("#restartStartButton").html()=="Start") {
        $("#restartStartButton").html("Restart");        
    }
    else if($("#restartStartButton").html()=='ReStart') {
        $("#restartStartButton").html('Start'); 
    }
    $("#new-high-score").hide();
}

/** 
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

    