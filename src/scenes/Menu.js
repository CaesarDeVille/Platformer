class Menu extends Phaser.Scene{
    constructor(){
      super("bootGame");
    }
  
    preload ()
    {
    
        this.load.image('ecran', 'assets/Menuimage.png');
        this.load.audio('Eli', 'assets/Eli.mp3');
        //this.load.image('bouton', 'assets/bouton.png');
        
        
    }
  
    create()
    {
        

     

        this.EnterPressed = false;
        
        this.music = this.sound.add('Eli');
        this.music.play({
        });
       

        this.add.sprite(game.config.width/2, game.config.height/2, 'ecran');
        
  

        //---------- on initialise les touches du clavier pour lancer le jeu, activer/desactiver des options, etc ----------

        /*if(Tableau.current){
            Tableau.current._destroy();
        }
        this.game.scene.start(tableau);
        this.scene.start("aventureBegining");*/

        this.input.keyboard.on('keydown-ENTER', function () //'keydown-SPACE', function () 
        {
            if (!this.EnterPressed & !this.SpacePressed)
            {
                
                this.EnterPressed = true;
                this.cameras.main.fadeOut(1000, 0, 0, 0)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => 
                {
                    this.game.scene.start(TableauTiled);
                    this.music.stop({
                    });
                    this.scene.start("L'Usine");
                })
            }

        }, this);


    }
}