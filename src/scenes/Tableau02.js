class Tableau02 extends Tableau{

    preload() {
        super.preload();
        this.load.image('star', 'assets/star.png');
        this.load.image('ground', 'assets/platform.png');
    }
    create() {
        super.create();

        //un groupe d'étoiles
        this.stars=this.physics.add.group();
        for (let i = 0; i<10; i++){
            this.stars.create(i,0,"star").setCollideWorldBounds(true).setVelocityX(Math.random()*100).setBounce(0.2);
        } 
        //si le joueur touche une étoile dans le groupe...
        this.physics.add.overlap(this.player, this.stars, this.ramasserEtoile, null, this);

        //des plateformes
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.physics.add.collider(this.player, this.platforms);

        //les étoiles rebondissent sur les plateformes
        this.physics.add.collider(this.platforms, this.stars);

    }

}

