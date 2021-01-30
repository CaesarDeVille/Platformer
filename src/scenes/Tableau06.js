class Tableau06 extends Tableau{

    preload() {
        super.preload();
        this.load.image('star', 'assets/star.png');
        this.load.image('monster-violet', 'assets/monster-violet.png');
        this.load.image('MonstreNormal', 'assets/MonstreNormal.png');
        this.load.image('MonstrePetit', 'assets/MonstrePetit.png');

    }
    create() {
        super.create();
        // étoile
        this.stars=this.physics.add.group();
        this.stars.create(600 ,0,"star");

        this.stars.children.iterate(function (child) {
            child.setBounce(1);
            child.setGravity(1);
            child.setCollideWorldBounds(true);
            child.setVelocity( 0,Phaser.Math.Between(-100, 100));
            child.setMaxVelocity(0,500);
        });
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this);

        //notre monstre
        this.monstre=this.physics.add.sprite(300,this.sys.canvas.height-70,"MonstreNormal");
        this.monstre.setOrigin(0,0);
        this.monstre.setDisplaySize(64,64);
        this.monstre.setCollideWorldBounds(true);
        this.monstre.setBounce(1);
        this.monstre.setVelocityX(50);
        this.physics.add.overlap(this.player, this.monstre, this.hitMonster, null, this);

        this.monstre=this.physics.add.sprite(300,this.sys.canvas.height-70,"monster-violet");
        this.monstre.setOrigin(0,0);
        this.monstre.setDisplaySize(90,90);
        this.monstre.setCollideWorldBounds(true);
        this.monstre.setBounce(0.5);
        this.monstre.setVelocityX(30);
        this.physics.add.overlap(this.player, this.monstre, this.hitMonster, null, this);

        this.monstre=this.physics.add.sprite(300,this.sys.canvas.height-70,"MonstrePetit");
        this.monstre.setOrigin(0,0);
        this.monstre.setDisplaySize(40,40);
        this.monstre.setCollideWorldBounds(true);
        this.monstre.setBounce(5);
        this.monstre.setVelocityX(70);
        this.physics.add.overlap(this.player, this.monstre, this.hitMonster, null, this);



    }

}

