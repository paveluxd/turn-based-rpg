class PlatformsPreload extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);
        this.load = config.scene.load;
        
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform-sm', 'assets/platform-sm.png');
    }
};

class PlatformsCreate extends Phaser.GameObjects.Container
{
    constructor(config)
    {
        super(config.scene);

        this.scene = config.scene;
        this.physics = config.scene.physics;
        this.platforms = config.scene.platforms;
        platforms = this.physics.add.staticGroup();
        platforms.create(408, game.config.height - 24, 'platform');
    }
};