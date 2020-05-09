//Preload
class PlayerPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
         //Player
        
        this.load.spritesheet('p1-death', 'assets/character/2 GraveRobber/GraveRobber_death.png', {frameWidth: 48,frameHeight: 48,});
        
        this.load.spritesheet('p1-walk', 'assets/p-run.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-jump', 'assets/p-jump.png', {frameWidth: 48, frameHeight: 48,})

        this.load.spritesheet('p1-idle', 'assets/p-idle.png', {frameWidth: 48, frameHeight: 48,})
        this.load.spritesheet('p1-attack', 'assets/p-attack.png', {frameWidth: 48, frameHeight: 48,})
    }
}

//Create
class PlayerCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        //Varables for class
        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.anims = config.scene.anims;
        this.platforms = config.scene.platforms;
        this.player = config.scene.player;
        this.enemy = config.scene.enemy;

        //Add player
        player = this.physics.add.sprite(game.config.width*0.25, game.config.height/2, 'p1-idle');

        //Properties
        player.direction = 'right';
        player.setCollideWorldBounds(true);
        player.body.setSize(16, 48, 8, 24);// X, Y, XYOffset
        
        //Rec
        rectW = this.scene.add.graphics();
        
        //Collider
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(rectW, platforms);


        //ANIMATIONS

        //Idle
        this.anims.create({
                key: 'p1-idle',
                frames: this.anims.generateFrameNumbers('p1-idle', { start: 0, end: 4 }),
                frameRate: 6,
                repeat: -1
            });

        //Death
        this.anims.create(
            {
                key: 'p1-death',
                frames: this.anims.generateFrameNumbers('p1-death', { start: 1, end: 2 }),
                frameRate: 6,
                repeat: 0
            });

        //Attack
        this.anims.create(
            {
                key: 'p1-attack',
                frames: this.anims.generateFrameNumbers('p1-attack', { start: 0, end: 6 }),
                frameRate: 10,
                repeat:0
            });

        //Walk
        this.anims.create(
            {
                key: 'p1-walk',
                frames: this.anims.generateFrameNumbers('p1-walk', { start: 0, end: 6 }),
                frameRate: 10,
            });

        //Jump
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
            

            //Attack
            playerW.x=player.x;
            playerW.y=player.y; 
            playerW.body.setSize(1, 1, 1, 1  );
        
            if (keyAction1.isDown) 
            {
                player.anims.play('p1-attack', true);
                var weaponRange = 24; 
                 
                if (player.flipX == true)
                {
                    weaponRange = -weaponRange
                    playerW.x = player.x + weaponRange; 
                }

                else 
                {
                    playerW.x = player.x + weaponRange;  
                }

                 playerW.body.setSize(24, 8, 8, 12);
                 playerW.setAlpha(1);
                        
            }

            if (keyAction1.getDuration()>1000/15)
            {
                playerW.body.setSize(1, 1, 1, 1  ) ;
                playerW.x=player.x;
                playerW.setAlpha(0);
            }
    }
}


// IDLE
class IdleState extends State{
  
    enter(scene){
        player.setVelocity(0);
        player.anims.play('p1-idle', true);        
    }

    execute(scene){
        const{left, right, up, down, space, shift} = keys;

        // Transition to dash
        if (space.isDown || space.isDown && left.isDown || space.isDown && right.down){
            this.stateMachine.transition('dash');
            return;
        }

        // Transition to move
        if (left.isDown || right.isDown ){
            this.stateMachine.transition('move');
            return;
        }

        // Transition to jump
        if (keys.up.isDown && player.body.touching.down || player.body.touching.down == 'false' ){
            this.stateMachine.transition('jump');
            return;
        }

        // Transition to attack
        if (keys.shift.isDown || key1.isDown || key2.isDown  ){
            this.stateMachine.transition('attack');
            return;
        }
    }
}

// MOVE
class MoveState extends State {
  execute(scene) {
    const {left, right, up, down, space, shift} = keys;
    
    // to dash
    if (space.isDown || space.isDown && left.isDown || space.isDown && right.down) {
        // if(player.direction =='left' && player.body.velocity.x < 0){
        //     player.body.setVelocityX(-moveVel + 200);
        // }
        // else if (player.body.velocity.x > 0) {
        //     player.body.setVelocityX(moveVel - 200);
        // }  
      this.stateMachine.transition('dash');
      return;
    }
    
    // to idle
    if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
      this.stateMachine.transition('idle');
      return;
    }

    // to jump
    if (keys.up.isDown && player.body.touching.down){
        this.stateMachine.transition('jump');
        return;
    }

    // to attack
    if ( key1.isDown || key2.isDown ){
        this.stateMachine.transition('attack');
        return;
    }
    
    if (left.isDown && player.body.touching.down) {
        player.setVelocityX(-moveVel);
        player.direction = 'left';
        player.anims.play('p1-walk', true).setFlipX(true);
    } 

    else if (right.isDown && player.body.touching.down) {
        player.setVelocityX(moveVel);
        player.direction = 'right';
        player.anims.play('p1-walk', true).setFlipX(false);
    }
  }
}

// DASH
class DashState extends State {
    enter(scene) {
        player.anims.play('p1-death', true);    
    }

    execute(scene) {
        dashTime+=10;
        
        if(keys.space.isUp){
            if(dashTime>300){
                dashTime=300;
            }

            if(player.direction == 'left'){
                player.setVelocityX(-dashVel);
            } 

            else if(player.direction == 'right'){
                player.setVelocityX(dashVel);
            }

            else if(player.direction == 'up'){
                player.setVelocityY(-dashVel);
            }

            // //Delay transition to idle
            scene.time.delayedCall(dashTime, () => { 
                if(player.body.touching.down){
                    this.stateMachine.transition('idle');
                } else{
                    this.stateMachine.transition('jump');
                }
                
                dashTime=20;
                
            });          
        }      
    }
}

// JUMP
class JumpState extends State {
    enter(scene) {
    
        if (keys.up.isDown && player.body.touching.down){
            player.setVelocityY(-jumpVel);
            player.anims.play('p1-jump', true); 
            player.direction = 'up';

            scene.time.delayedCall(jumpTime, () => {  
                player.setVelocityY(-floatVelY);
            });   
        }  
    }

    execute(scene){
        const{left, right, up, down, space, shift} = keys;
        
        if (keys.right.isDown){
            player.setVelocityX(floatVelX);
            player.anims.play('p1-jump', true).setFlipX(false);
            player.direction = 'right';
        }

        else if (keys.left.isDown){
            player.setVelocityX(-floatVelX);
            player.anims.play('p1-jump', true).setFlipX(true);
            player.direction = 'left';
        }

        else if (keys.up.isDown){
            player.direction = 'up'
        }

        if (keys.down.isDown){        
            player.setVelocityY(floatVelY);
            player.anims.play('p1-jump', true);
            // player.direction = 'down'
        }

        //Transition to idle
        if (player.body.touching.down){

            if (left.isDown || right.isDown ){
                this.stateMachine.transition('move');
            return;

            }
            else{
                this.stateMachine.transition('idle');
            }
            
        } 

        // Transition to dash
        if (space.isDown || space.isDown && left.isDown || space.isDown && right.down){
            this.stateMachine.transition('dash');
            return;
        }; 
    }
}

//ATTACK
class AttackState extends State{
    enter(scene) {
        player.setVelocity(0);
        player.anims.play('p1-attack', true);

        scene.physics.add.existing(rectW);
        rectW.body.setAllowGravity(false);
        rectW.body.width = 5;
        rectW.body.height = 5;
                rectW.y = 0;
        
        if (key1.isDown){ 
        
            if (player.direction=='left'){
                rectW.x = player.x - weaponRange;
                rectW.y = player.y;

            }
            else {
                rectW.x = player.x + weaponRange;
                rectW.y = player.y;
            }    
        }
    }

    execute(scene){
        const{left, right, up, down, space, shift} = keys;
        rectW.y = 0;

        scene.time.delayedCall(attTime, () => { 
            if (left.isDown || right.isDown ){
                // to move
                this.stateMachine.transition('move');
                return;
            } 
            else if (keys.up.isDown && player.body.touching.down){
                //to jump
                this.stateMachine.transition('jump');
                return;
            }
            else if ( key1.isDown ==false || key2.isDown==false  ){
                // to idle
                this.stateMachine.transition('idle');  
                return;
            }
        });
    }
}












//Generate random number
// setInterval(function(){
//     rNum = Phaser.Math.Between(0,300);
// }, 1000);