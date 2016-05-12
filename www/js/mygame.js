var game = new Phaser.Game(window.innerWidth,window.innerHeight,Phaser.CANVAS,'gamearea');

var starfield;
var hero;
var aliens;
var cursors;
var bullets;
var leftKey,rightKey;
var bullet;
var explosion;
var shot;
var jibaboom;

//vars for touch control
var locX;
 var locY;
 var startX;
 var startY;
 var endX;
 var endY;
 var direction;

var SpaceShooter = {

	preload: function () {
	    game.load.audio('shot','audio/SHOOT007.mp3');
	    game.load.audio('jibaboom','audio/explosion.mp3');
		game.load.image('pewpew','img/bullet.png');
		game.load.image('stars','img/starfield.png');
		game.load.spritesheet('baddie','img/baddie.png',32,32);
		game.load.spritesheet('dude','img/dude.png',32,48);
		game.load.spritesheet('kaboom','img/explode.png',128,128);
	},
	create: function () {

			
		game.physics.startSystem(Phaser.Physics.ARCADE);

			//here, we add the image starfield as a tileSprite. 
		starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
		
		shot=game.add.audio('shot');
		jibaboom=game.add.audio('jibaboom');
		
		aliens=game.add.group();

		aliens.enableBody=true;
		aliens.physicsBodyType = Phaser.Physics.ARCADE;
		//add the bullets as a group, and a whole bunch of other declarations.
		//  Our bullet group
		    bullets = game.add.group();
		    bullets.enableBody = true;
		    bullets.physicsBodyType = Phaser.Physics.ARCADE;
		    bullets.createMultiple(30, 'bullet');
		    bullets.setAll('anchor.x', 0.5);
		    bullets.setAll('anchor.y', 1);
		    bullets.setAll('outOfBoundsKill', true);
		    bullets.setAll('checkWorldBounds', true);

		     //  An explosion pool....yes explosions! woohoo!
		    explosions = game.add.group();
		    explosions.createMultiple(30, 'kaboom');
		    explosions.forEach(setupAlien, this);
		    
		for (var i=0;i<8;i++){
			for(var h=0;h<8;h++){
				var alien=aliens.create(i*50+20,h*50+50,'baddie');
				alien.animations.add('dance',[0,1,2,3],10,true);
				alien.animations.play('dance');
			}
		}
		hero=game.add.sprite(game.world.width/2,game.world.height-100,'dude');
		hero.enableBody=true;
		game.physics.arcade.enable(hero);
		hero.animations.add('walkleft',[0,1,2,3],10,true);
		hero.animations.add('walkright',[5,6,7,8],10,true);

		cursors=game.input.keyboard.createCursorKeys();
		leftKey=game.input.keyboard.addKey(Phaser.Keyboard.A);
		rightKey=game.input.keyboard.addKey(Phaser.Keyboard.D);

		game.inputEnabled=true;
		game.input.onDown.add(beginSwipe);
        game.input.onUp.remove(endSwipe);
        game.input.onTap.add(fireAtEnemy,this);
		
	},
	update: function () {
		
		starfield.tilePosition.y += 2;

			hero.body.velocity.x=0;


		if (cursors.left.isDown || leftKey.isDown) {
			hero.body.velocity.x=-200;
			hero.animations.play('walkleft');

		} else if (cursors.right.isDown || rightKey.isDown){

			hero.body.velocity.x=200;
			hero.animations.play('walkright');

		} else {

			hero.animations.stop();
			hero.frame=4;
		}


		//our first game rule...what to do when a bullets overlap with aliens.
		//overlap requires 5 parameters. You have to let overlap know 5 things in order for 
		//it to work. The first 2 are  what two things are involved in overlap...in this case,
		//bullets and aliens. 
		//Next, what to do when they overlap. The function killAlien will be executed (pun!)
		game.physics.arcade.overlap(bullets,aliens,killAlien,null, this);
		

	}

}

function fireAtEnemy () {

	//no more pew pew! Here's what to do when the mouse is clicked.
	
	//first, create a bullet at the location of the hero.

	bullet=bullets.create(hero.x,hero.y,'pewpew');
	shot.play();
	//next change gradually the position of the bullet image from the location of the hero to the top of the screen..or off the screen
	game.add.tween(bullet).to({y:-100},500,"Linear",true);

}
//we also set up the alien for the explosions 
function setupAlien(alien) {

    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    alien.animations.add('kaboom');

}
//Here is what to do when bullet and alien overlap
function killAlien (bullet,alien){

	bullet.kill();
	alien.kill();
	jibaboom.play();

	//how about some explosions!
	//  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);
}

function moveHero (sprite, pointer, dragX, dragY, snapPoint) {
	console.log("moved");
}


    function beginSwipe(){
        console.log("drag started");
        startX = game.input.worldX;
        startY = game.input.worldY;
        game.input.onDown.remove(beginSwipe);
        game.input.onUp.add(endSwipe);
        
    }
    
    // function to be called when the player releases the mouse/finger
    function endSwipe(){
        // saving mouse/finger coordinates
        endX = game.input.worldX;
        endY = game.input.worldY;
        // determining x and y distance travelled by mouse/finger from the start
        // of the swipe until the end
        var distX = startX-endX;
        var distY = startY-endY;
        // in order to have an horizontal swipe, we need that x distance is at least twice the y distance
        // and the amount of horizontal distance is at least 10 pixels
        if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
            // moving left, calling move function with horizontal and vertical tiles to move as arguments
            if(distX>0){
                    move(-100,0);
               }
               // moving right, calling move function with horizontal and vertical tiles to move as arguments
               else{
                    move(100,0);
               }
        }
        // in order to have a vertical swipe, we need that y distance is at least twice the x distance
        // and the amount of vertical distance is at least 10 pixels
        if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10){
            // moving up, calling move function with horizontal and vertical tiles to move as arguments
            if(distY>0){
                    move(0,-100);
               }
               // moving down, calling move function with horizontal and vertical tiles to move as arguments
               else{
                    move(0,100);
               }
        }   
        // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
        game.input.onDown.add(beginSwipe);
        game.input.onUp.remove(endSwipe);
    }

function move (deltaX,deltaY) {
        locX=hero.x+deltaX;
        locY=hero.y+deltaY;
        game.add.tween(hero).to({x:locX,y:locY},500,"Linear",true);
console.log(deltaX,deltaY);
    }
game.state.add('spaceshooter',SpaceShooter);
game.state.start('spaceshooter');