//Preload
class PlayerPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
         //Player
        this.load.spritesheet('p1-idle', 'assets/character/2 GraveRobber/GraveRobber_idle.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
        this.load.spritesheet('p1-attack', 'assets/character/2 GraveRobber/GraveRobber_attack1.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-walk', 'assets/character/2 GraveRobber/GraveRobber_run.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-jump', 'assets/character/2 GraveRobber/GraveRobber_jump.png', {frameWidth: 48, frameHeight: 48,})
    }
}

//Create
class PlayerCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.player = config.scene.player;

        player = this.physics.add.sprite(game.config.width*0.25, game.config.height/2, 'p1-idle');
        player.direction = 'down';

        //The state machine managing the player
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            swing: new SwingState(),
            dash: new DashState(),
        },[this, this.player]);

        player.setCollideWorldBounds(true);
        player.body.setSize(16, 48, 8, 24);// X, Y, XYOffset
        playerHp=30;    

        this.physics.add.collider(player, platforms);

        //idle
        this.anims.create({
                key: 'p1-idle',
                frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
                frameRate: 6,
            });

        //death
        this.anims.create(
            {
                key: 'p1-death',
                frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 6 }),
                frameRate: 3,
                repeat: 1
            });
        
        this.anims.create(
            {
                key: 'p1-attack',
                frames: this.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
                frameRate: 10,
            });

        this.anims.create(
            {
                key: 'p1-walk',
                frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
                frameRate: 10,
            });
        
        this.anims.create(
            {
                key: 'p1-jump',
                frames: this.anims.generateFrameNumbers('p1-jump', { start: 0, end: 6 }),
                frameRate: 6,
            });       

    }
}

//Update
class PlayerUpdate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.player = config.scene.player;
            
            //Left  
            if (cursors.left.isDown && player.body.touching.down) 
            {
                player.setVelocityX(-240);
                player.anims.play('p1-walk', true).setFlipX(true);
            } 

            else if (cursors.left.isDown) 
            {
                player.setVelocityX(-240);
                player.anims.play('p1-jump', true).setFlipX(true);
            } 

            //Right
            else if (cursors.right.isDown && player.body.touching.down) 
            {
                player.setVelocityX(240);
                player.anims.play('p1-walk', true).setFlipX(false);
            } 

            else if (cursors.right.isDown) 
            {
                player.setVelocityX(240);
                player.anims.play('p1-jump', true).setFlipX(false);
            }

            //Down
            else if (cursors.down.isDown) 
            {
                player.setVelocityY(400);  
                player.anims.play('p1-death', true); 
            } 

            //Mid air
            else if (player.body.touching.down == false)
            {
                player.anims.play('p1-jump', true);
            }

            //Idle   
            else 
            {
                player.setVelocityX(0);
                player.anims.play('p1-idle', true);    
            }

            //Attack
            playerW.x=player.x;
            playerW.y=player.y; 
            playerW.body.setSize(1, 1, 1, 1  );
        
            if (keyR.isDown) 
            {
                player.anims.play('p1-attack', true);
                var weaponRange = 24; 
                 
                if (player.flipX == true)
                {
                    weaponRange = weaponRange * -1
                    playerW.x = player.x + weaponRange; 
                }

                else 
                {
                    playerW.x = player.x + weaponRange;  
                }

                 playerW.body.setSize(24, 8, 8, 12);
                 playerW.setAlpha(1);
                        
            }

            if (keyR.getDuration()>1000/15)
            {
                playerW.body.setSize(1, 1, 1, 1  ) ;
                playerW.x=player.x;
                playerW.setAlpha(0);
            }

            //Jump
            if (cursors.up.isDown && player.body.touching.down) 
            {
                player.setVelocityY(-550);  
            }

            //Dash add timer
            if(cursors.right.isDown && cursors.space.isDown)
            {
                player.setVelocityX(600);
                player.anims.play('p1-jump', true).setFlipX(true);
            }

            else if (cursors.left.isDown && cursors.space.isDown)
            {
                player.setVelocityX(-600);
                player.anims.play('p1-jump', true).setFlipX(false);
            }

        if (Date.now() > lastHitTimeEnemy + 200 == true && playerHp > 5) 
        {
            player.clearTint()
        }
    }
}

//Idle state
class IdleState extends State{
  
    enter(scene, player){
        player.setVelocity(0);
        player.anims.play(`walk-${player.direction}`);
        player.anims.stop();
    }

    execute(scene, player){
        const{left, right, up, down, space, shift} = scene.keys;
        // Transition to swing if pressing space
        if (space.isDown){
            this.stateMachine.transition('swing');
            return;
        }
        // Transition to dash if pressing shift
        if (shift.isDown){
            this.stateMachine.transition('dash');
            return;
        }
        // Transition to move if pressing a movement key
        if (left.isDown || right.isDown || up.isDown || down.isDown){
            this.stateMachine.transition('move');
            return;
        }
    }
}

//Move state
class MoveState extends State {
  execute(scene, player) {
    const {left, right, up, down, space, shift} = scene.keys;
    
    // Transition to swing if pressing space
    if (space.isDown) {
      this.stateMachine.transition('swing');
      return;
    }
    
    // Transition to dash if pressing shift
    if (shift.isDown) {
      this.stateMachine.transition('dash');
      return;
    }
    
    // Transition to idle if not pressing movement keys
    if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
      this.stateMachine.transition('idle');
      return;
    }
    
    player.setVelocity(0);
    if (up.isDown) {
      player.setVelocityY(-100);
      player.direction = 'up';
    } else if (down.isDown) {
      player.setVelocityY(100); 
      player.direction = 'down';
    }
    if (left.isDown) {
      player.setVelocityX(-100);
      player.direction = 'left';
    } else if (right.isDown) {
      player.setVelocityX(100);
      player.direction = 'right';
    }
    
    // player.anims.play(`walk-${player.direction}`, true);
  }
}

//Swing state
class SwingState extends State {
  enter(scene, player) {
    player.setVelocity(0);
    // player.anims.play(`swing-${player.direction}`);
    player.once('animationcomplete', () => {
      this.stateMachine.transition('idle');
    });
  }
}

//Dash state
class DashState extends State {
  enter(scene, player) {
    player.setVelocity(0);
    // player.anims.play(`swing-${player.direction}`);
    switch (player.direction) 
    {
        case 'up':
            player.setVelocityY(-300);
            break;

        case 'down':
            player.setVelocityY(300);
            break;

        case 'left':
            player.setVelocityX(-300);
            break;

        case 'right':
            player.setVelocityX(300);
            break;
    }

    
    // Wait a third of a second and then go back to idle
    scene.time.delayedCall(300, () => {
      this.stateMachine.transition('idle');
    });
  }
}
















//Generate random number
// setInterval(function(){
//     rNum = Phaser.Math.Between(0,300);
// }, 1000);