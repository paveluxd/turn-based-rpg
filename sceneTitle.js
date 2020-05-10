class SceneTitle extends Phaser.Scene {
    constructor() {
        super('SceneTitle');
    }
    
    preload()
    {
    	
    }

    create() {
        this.text=this.add.text(game.config.width/2 ,game.config.height/2-80 ,'Game title',{color:0xff0000});
        this.text.setOrigin(0.5,0.5);

        this.text=this.add.text(game.config.width/2 ,game.config.height/2-100 ,winText,{color:0xff0000});
        this.text.setOrigin(0.5,0.5);


        this.text=this.add.text(game.config.width/2 ,game.config.height/2 ,'Press to Play',{color:0xff0000});
        this.text.setInteractive();
        this.text.on('pointerdown', () => this.scene.start('SceneMain'));
        this.text.setOrigin(0.5,0.5);
    }

    update() 
    {

    }
}