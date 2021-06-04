class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, "player")
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.world = scene;

        this.setCollideWorldBounds(true)
        this.setBounce(0.3);
        this.setGravityY(700)
        this.setFriction(1,1);
        this.setDisplaySize(36,64);
        this.setBodySize(this.body.width-6,this.body.height);
        this.setOffset(3, 0);
        this.rechargeSonTir = false; //bool pour le rechargement

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 13 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 7 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'stance',
            frames: [ { key: 'player', frame: 7 } ],
            frameRate: 5,
        });

        this.anims.create({
            key: 'back',
            frames: [ { key: 'player', frame: 6 } ],
            frameRate: 5,
        });
        this.anims.create({
            key: 'jumpleft',
            frames: [ { key: 'player', frame: 15 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'jumpright',
            frames: [ { key: 'player', frame: 14 } ],
            frameRate: 20
        });

        this._directionX=0;
        this._directionY=0;

    }

    set directionX(value){
        this._directionX=value;
    }
    set directionY(value){
        this._directionY=value;
    }

    /**
     * arrête le joueur
     */
    stop(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.directionY=0;
        this.directionX=0;
    }

    /**
     * Déplace le joueur en fonction des directions données
     */
    move(){

        switch (true){
            case this._directionX<0:
                this.sens=-1;
                this.setVelocityX(-160);
                if (this.body.directionY<0 && this.body.directionY>0) {
                    this.anims.play('jumpleft', true);
                }
                this.anims.play('left', true);
                
                break;
            case this._directionX>0:
                this.sens=1;
                this.setVelocityX(160);
                this.anims.play('right', true);
                if (this.body.directionY<0 && this.body.directionY>0) {
                    this.anims.play('jumpright', true);
                }
                break;
            default:
                this.setVelocityX(0);
                this.anims.play('turn');
                this.anims.play(this.sens===-1 ? 'back' : 'stance' ,true);
        }

        if(this._directionY<0){
            if(this.body.blocked.down || this.body.touching.down){
                this.setVelocityY(-550);
            }
        }


    }

    shoot()
    {   if(ui.score>0){
            if(this.rechargeSonTir === false) { //on vérifie si on a recharger le coup

                this.rechargeSonTir = true; //lance la recharge
                var bullet = new Tir(this.world,this.x, this.y);
                console.log("Tir");
                setTimeout(function(){
                    bullet.destroy();
                },300);
                setTimeout(function () {
                    Tableau.current.player.rechargeSonTir = false;
                }, 1100);
            }
        }   
    }

}