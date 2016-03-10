// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

//Limites del Heroe
yMax = 25;
yMin = 415;
xMin = 30;
xMax = 450;



// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};




//valores iniciales

var princessesCaught = 0;
var heroLifes = 3;
var princessesForNextLevel = 10;
var numStones = 3;
var numMonsters = 2;
var monstersSpeed = 30;
var level = 1;





var monsters = [];
var stones = [];


var meterMonstruos = function(num){
	for (var i = 0; i <= num - 1; ++i) {
	  monsters[i] = {speed: monstersSpeed};
	}
}

var meterPiedras = function(num){
	for (var i = 0; i <= num - 1; ++i) {
	  stones[i] = {};
	}
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var setAll = function(a){
	var i, n = a.length;
    for (i = 0; i < n; ++i) {
    	var vx = 32 + (Math.random() * (canvas.width - 96));
    	var vy = 32 + (Math.random() * (canvas.height - 96));
        a[i].x = vx;
        a[i].y = vy;
        while (
        	hero.x < (a[i].x + 24) && a[i].x < (hero.x + 24)
            && hero.y < (a[i].y + 24) && a[i].y < (hero.y + 24)
            )
        {
        	console.log("aqui")
        	var vx = 32 + (Math.random() * (canvas.width - 96));
	    	var vy = 32 + (Math.random() * (canvas.height - 96));
	        a[i].x = vx;
	        a[i].y = vy;
        }
    }
}

var drawStones = function(a){
	var i, n = a.length;
    for (i = 0; i < n; ++i) {

        	ctx.drawImage(stoneImage, stones[i].x, stones[i].y)
        }
}
var drawMonsters = function(){
	var i, n = monsters.length;
    for (i = 0; i < n; ++i) {

    	if(
    		hero.x < (monsters[i].x + 32) && monsters[i].x < (hero.x + 32)
			&& hero.y < (monsters[i].y + 32) && monsters[i].y < (hero.y + 32)
		    && princess.x < (monsters[i].x + 32) && monsters[i].x < (princess.x + 32)
            && princess.y < (monsters[i].y + 32) && monsters[i].y < (princess.y + 32)
        ){
    		
        }else{

        	ctx.drawImage(monsterImage,  monsters[i].x,  monsters[i].y)
        }

        
    }
}

var touchStones = function (modifier) {
	var i, n = stones.length;
    for (i = 0; i < n; ++i) {

    	if(
    		hero.x < (stones[i].x + 24) && stones[i].x < (hero.x + 24)
            && hero.y < (stones[i].y + 24) && stones[i].y < (hero.y + 24)
        ){
    		if (38 in keysDown) { // Player holding up
				hero.y += hero.speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				hero.y -= hero.speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				hero.x += hero.speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				hero.x -= hero.speed * modifier;
			}	
		}

    }
	
	// body...
}
var touchMonsters = function(modifier){
	var i, n = monsters.length;
    for (i = 0; i < n; ++i) {

    	if(
    		hero.x < (monsters[i].x + 24) && monsters[i].x < (hero.x + 24)
            && hero.y < (monsters[i].y + 24) && monsters[i].y < (hero.y + 24)
        ){
        	--heroLifes;
       		if (heroLifes == -1){
       			
       			if(alert('Game Over!')){}
				else    window.location.reload(); 
       			//resetear todo...
       			princessesCaught = 0;
				heroLifes = 3;
				actualPrincesses = 2;
				numStones = 3;
				numMonsters = 2;
				monstersSpeed = 30;
				level = 1;
       			reset();
       		}else{
       			reset();
       		}
    		
        }
   	}
}

var moveMonsters = function(modifier){
	var i, n = monsters.length;
    for (i = 0; i < n; ++i) {
    		
			x = monsters[i].x - hero.x;
			y = monsters[i].y - hero.y;
			if(x > 0){
				monsters[i].x -= monsters[i].speed * modifier; 
			}else if (x < 0){
				monsters[i].x += monsters[i].speed * modifier;
			}
			if(y > 0){
				monsters[i].y -= monsters[i].speed * modifier; 
			}else if (y < 0){
				monsters[i].y += monsters[i].speed * modifier;
			}
    }
}
// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	//quitamos el tamaño de los arboles
	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));






	meterMonstruos(numMonsters);
	meterPiedras(numStones);

	setAll(stones)
	setAll(monsters)

};


// Update game objects
var update = function (modifier) {

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
			// si el heroe toca la maxima posicion, le coloca en esa misma posicion
			if (hero.y < yMax){
				hero.y = yMax
			}
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if (hero.y > yMin){
				hero.y = yMin
			}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if (hero.x < xMin){
				hero.x = xMin
			}		

	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;

		if (hero.x > xMax){
				hero.x = xMax
			}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		if (princessesCaught == princessesForNextLevel){
			princessesForNextLevel += 10
			numStones += 2;
			numMonsters += 1;
			monstersSpeed += 10;
			level += 1;

		}
		reset();
	}

	moveMonsters(modifier);

	touchStones(modifier);

	touchMonsters(modifier);

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {

		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {



		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady){

		drawStones(stones);

	}
	if (monsterReady){

		drawMonsters();

	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Lifes left: " + heroLifes, 350, 32);
	ctx.fillText("Level: " + level, 32, 420);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds,
// and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
