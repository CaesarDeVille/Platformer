class TableauTiled extends Tableau{
    constructor(){
        super("L'Usine")
    }
    /**
     * Ce tableau démontre comment se servir de Tiled, un petit logiciel qui permet de designer des levels et de les importer dans Phaser (entre autre).
     *
     * Ce qui suit est très fortement inspiré de ce tuto :
     * https://stackabuse.com/phaser-3-and-tiled-building-a-platformer/
     *
     * Je vous conseille aussi ce tuto qui propose quelques alternatives (la manière dont son découpées certaines maisons notamment) :
     * https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
     */
    preload() {
        super.preload();
        // ------pour TILED-------------
        // nos images
        this.load.image('tir', 'assets/metale.png');
        this.load.image('tiles', 'assets/Tiled/Tuile1.png');
        //les données du tableau qu'on a créé dans TILED
        this.load.tilemapTiledJSON('map', 'assets/Tiled/CarteXXIV.json');
        this.load.image('star', 'assets/star.png');
        this.load.image('checkp', 'assets/checkp.png');
        this.load.image('tower', 'assets/tour.png');
        this.load.audio('beta', 'assets/Beta.mp3');
        this.load.audio('bloodsound', 'assets/bloodsound.mp3');
        // -----et puis aussi-------------
        this.load.image('monster-walk3', 'assets/monster-walk3.png');
        this.load.image('monster-walk2', 'assets/monster-walk2.png');
        //this.load.image('night', 'assets/night.jpg');
        //atlas de texture généré avec https://free-tex-packer.com/app/
        //on y trouve notre étoiles et une tête de mort
        //this.load.atlas('particles', 'assets/particles/particles.png', 'assets/particles/particles.json');
    }
    create() {
        super.create();

        //on en aura besoin...
        let ici=this;
        this.music = this.sound.add('beta');
        this.music.play({
            loop:true
        });
        //--------chargement de la tile map & configuration de la scène-----------------------

        //notre map
        this.map = this.make.tilemap({ key: 'map' });
        //nos images qui vont avec la map
        this.tileset = this.map.addTilesetImage('Tuile1', 'tiles');

        //on agrandit le champ de la caméra du coup
        let largeurDuTableau=this.map.widthInPixels;
        let hauteurDuTableau=this.map.heightInPixels;
        this.physics.world.setBounds(0, 0, largeurDuTableau,  hauteurDuTableau);
        this.cameras.main.setBounds(0, 0, largeurDuTableau, hauteurDuTableau);
        this.cameras.main.startFollow(this.player, true, 1, 1);

        //---- ajoute les plateformes simples ----------------------------

        this.Physique = this.map.createLayer('Physique', this.tileset, 0, 0);
        this.Lava2 = this.map.createLayer('Lava2', this.tileset, 0, 0);
        this.Lava = this.map.createLayer('Lava', this.tileset, 0, 0);
        this.Fond1 = this.map.createLayer('Fond1', this.tileset, 0, 0);
        this.Fond2 = this.map.createLayer('Fond2', this.tileset, 0, 0);
        this.Fond3 = this.map.createLayer('Fond3', this.tileset, 0, 0);
        this.Tuyo = this.map.createLayer('Tuyo', this.tileset, 0, 0);
        this.Tag = this.map.createLayer('Tag', this.tileset, 0, 0); 

        

        
        
        //this.derriere = this.map.createLayer('derriere', this.tileset, 0, 0);
        //this.devant = this.map.createLayer('devant', this.tileset, 0, 0);

        //on définit les collisions, plusieurs méthodes existent:

        // 1 La méthode que je préconise (il faut définir une propriété dans tiled pour que ça marche)
        //permet de travailler sur un seul layer dans tiled et des définir les collisions en fonction des graphiques
        //exemple ici https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
        this.Physique.setCollisionByProperty({ collides: true });
        //this.lave.setCollisionByProperty({ collides: true });

        // 2 manière la plus simple (là où il y a des tiles ça collide et sinon non)
        //this.Physique.setCollisionByExclusion(-1, true);
        this.Lava.setCollisionByExclusion(-1, true);

        // 3 Permet d'utiliser l'éditeur de collision de Tiled...mais ne semble pas marcher pas avec le moteur de physique ARCADE, donc oubliez cette option :(
        //this.map.setCollisionFromCollisionGroup(true,true,this.plateformesSimples);

        this.checkPoints = this.physics.add.staticGroup();
        this.checkPointsObjects = this.map.getObjectLayer('Check')['objects'];
        //on crée des checkpoints pour chaque objet rencontré
        this.checkPointsObjects.forEach(checkPointObject => 
        {
            this.point=this.checkPoints.create(checkPointObject.x+16,checkPointObject.y-16,'checkp')/*.play('cp', true)*/.setDisplaySize(32,32).setBodySize(32,32);
            //.setOrigin(14,12.4);
            /*point.blendMode=Phaser.BlendModes.COLOR_DODGE;*/
            this.point.checkPointObject=checkPointObject;
            this.checkPointsLight = this.add.pointlight(checkPointObject.x+32, checkPointObject.y+32, 0, 75, 0.15).setDepth(987+1);
            this.checkPointsLight.attenuation = 0.05;
            this.checkPointsLight.color.setTo(255, 150, 50);
        });


        
        //----------les étoiles (objets) ---------------------

        // c'est un peu plus compliqué, mais ça permet de maîtriser plus de choses...
        this.stars = this.physics.add.group({
            allowGravity: true,
            immovable: false,
             bounceY:0
        });
        this.starsObjects = this.map.getObjectLayer('stars')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.starsObjects.forEach(starObject => {
        //     Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let star = this.stars.create(starObject.x+15, starObject.y ,'star');
            this.physics.add.overlap(this.player, star, this.ramasserEtoile, null, this);
        });

        this.tower = this.physics.add.group({
            allowGravity: false,
            immovable: false,
             bounceY:0
        });
        this.towerObjects = this.map.getObjectLayer('tower')['objects'];
        // On crée des étoiles pour chaque objet rencontré
        this.towerObjects.forEach(towerObject => {
        //     Pour chaque étoile on la positionne pour que ça colle bien car les étoiles ne font pas 64x64
            let star = this.tower.create(towerObject.x+32, towerObject.y-92 ,'tower');
            this.physics.add.overlap(this.player, this.tower, this.ramasserTour, null, this);
        });

        //----------les monstres volants (objets tiled) ---------------------

       // let monstersContainer=this.add.container();
       // this.flyingMonstersObjects = this.map.getObjectLayer('flyingMonsters')['objects'];
        // On crée des montres volants pour chaque objet rencontré
       // this.flyingMonstersObjects.forEach(monsterObject => {
        //    let monster=new MonsterFly(this,monsterObject.x,monsterObject.y);
         //   monstersContainer.add(monster);
        // });

         //----------Le Boss (objets tiled) ---------------------

       this.monstersContainer=this.add.container();
       this.Boss1 = this.map.getObjectLayer('Boss1')['objects'];
        // On crée des montres volants pour chaque objet rencontré
       this.Boss1.forEach(Boss1Object => {
        let monster=new MonsterWalk3(this,Boss1Object.x+250,Boss1Object.y);
         this.monstersContainer.add(monster);
        });
        this.mw2 = [];
        this.mw2[0] = new MonsterWalk2 (this, 2950, 2304, 'monster-walk2');
        this.mw2[1] = new MonsterWalk2 (this, 3012, 2304, 'monster-walk2');
        this.mw2[2] = new MonsterWalk2 (this, 1000, 480, 'monster-walk2');
        this.mw2[3] = new MonsterWalk2 (this, 1300, 512, 'monster-walk2');
        this.mw2[4] = new MonsterWalk2 (this, 1600, 480, 'monster-walk2');
        this.mw2[5] = new MonsterWalk2 (this, 1900, 512, 'monster-walk2');
        this.mw2[6] = new MonsterWalk2 (this, 2100, 480, 'monster-walk2');
        this.mw2.forEach(monster=>{
            this.monstersContainer.add(monster);
        });
        //--------effet sur la lave------------------------

     //   this.laveFxContainer=this.add.container();
       // this.lave.forEachTile(function(tile){ //on boucle sur TOUTES les tiles de lave pour générer des particules
         //   if(tile.index !== -1){ //uniquement pour les tiles remplies

                /*
                //dé-commenter pour mieux comprendre ce qui se passe
                console.log("lave tile",tile.index,tile);
                let g=ici.add.graphics();
                laveFxContainer.add(g);
                g.setPosition(tile.pixelX,tile.pixelY)
                g.lineStyle(1,0xFF0000);
                g.strokeRect(0, 0, 64, 64);
                */

                //on va créer des particules
              /*  let props={
                    frame: [
                        //'star', //pour afficher aussi des étoiles
                        'death-white'
                    ],
                    frequency:200,
                    lifespan: 2000,
                    quantity:2,
                    x:{min:-32,max:32},
                    y:{min:-12,max:52},
                    tint:[  0xC11A05,0x883333,0xBB5500,0xFF7F27 ],
                    rotate: {min:-10,max:10},
                    speedX: { min: -10, max: 10 },
                    speedY: { min: -20, max: -30 },
                    scale: {start: 0, end: 1},
                    alpha: { start: 1, end: 0 },
                    blendMode: Phaser.BlendModes.ADD,
                }; */
         //       let props2={...props}; //copie props sans props 2
           //     props2.blendMode=Phaser.BlendModes.MULTIPLY; // un autre blend mode plus sombre

                //ok tout est prêt...ajoute notre objet graphique
            //    let laveParticles = ici.add.particles('particles');

                //ajoute le premier émetteur de particules
             //   laveParticles.createEmitter(props);
                //on ne va pas ajouter le second effet émetteur mobile car il consomme trop de ressources
            //    if(!ici.isMobile) {
          //          laveParticles.createEmitter(props2); // ajoute le second
           //     }
                // positionne le tout au niveau de la tile
              //  laveParticles.x=tile.pixelX+32;
             //   laveParticles.y=tile.pixelY+32;
            //    ici.laveFxContainer.add(laveParticles);

                //optimisation (les particules sont invisibles et désactivées par défaut)
                //elles seront activées via update() et optimizeDisplay()
             //   laveParticles.pause();
               // laveParticles.visible=false;
                //on définit un rectangle pour notre tile de particules qui nous servira plus tard
              //  laveParticles.rectangle=new Phaser.Geom.Rectangle(tile.pixelX,tile.pixelY,64,64);

           // }

        //})

        //--------allez on se fait un peu la même en plus simple mais avec les étoiles----------

    /*    let starsFxContainer=ici.add.container();
        this.stars.children.iterate(function(etoile) {
            let particles=ici.add.particles("particles","star");
            let emmiter=particles.createEmitter({
                tint:[  0xFF8800,0xFFFF00,0x88FF00,0x8800FF ],
                rotate: {min:0,max:360},
                scale: {start: 0.8, end: 0.5},
                alpha: { start: 1, end: 0 },
                blendMode: Phaser.BlendModes.ADD,
                speed:40
            });
            etoile.on("disabled",function(){
                emmiter.on=false;
            })
            emmiter.startFollow(etoile);
            starsFxContainer.add(particles);
        });   */




        //----------débug---------------------
        
        //pour débugger les collisions sur chaque layer
        let debug=this.add.graphics().setAlpha(this.game.config.physics.arcade.debug?0.75:0);
        if(this.game.config.physics.arcade.debug === false){
            debug.visible=false;
        }
        //débug solides en vers
        this.Physique.renderDebug(debug,{
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(0, 255, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        });
        //debug lave en rouge
     /*   this.lave.renderDebug(debug,{
            tileColor: null, // Couleur des tiles qui ne collident pas
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255), //Couleur des tiles qui collident
            faceColor: null // Color of colliding face edges
        }); */


        //---------- parallax ciel (rien de nouveau) -------------

        //on change de ciel, on fait une tileSprite ce qui permet d'avoir une image qui se répète
       /* this.sky=this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'night'
        );
        this.sky2=this.add.tileSprite(
            0,
            0,
            this.sys.canvas.width,
            this.sys.canvas.height,
            'night'
        );
        this.sky.setOrigin(0,0);
        this.sky2.setOrigin(0,0);
        this.sky.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        this.sky2.setScrollFactor(0);//fait en sorte que le ciel ne suive pas la caméra
        this.sky2.blendMode=Phaser.BlendModes.ADD;  */

        //----------collisions---------------------

        //quoi collide avec quoi?
        this.physics.add.collider(this.player, this.Physique);
        this.physics.add.collider(this.Boss1, this.Physique);
        this.physics.add.collider(this.player, this.Lava ,function(){ici.restart()},null,this);
        this.physics.add.collider(this.stars, this.Physique);
        this.physics.add.collider(this.tower, this.Physique);
        //si le joueur touche une étoile dans le groupe...

        this.physics.add.overlap(this.player, this.checkPoints, function(player, checkPoint)
        {   
            //ui.perds();
            ici.saveCheckPoint(checkPoint.checkPointObject.name);
        });

        //--------- Z order -----------------------

        //on définit les z à la fin
        let z=1000; //niveau Z qui a chaque fois est décrémenté.
      //  debug.setDepth(z--);
        this.blood.setDepth(z--);
        this.monstersContainer.setDepth(z--);
        //this.monsterwalk2.setDepth(z--);
        this.stars.setDepth(z--);
        this.tower.setDepth(z--);
        //starsFxContainer.setDepth(z--);
        this.Physique.setDepth(z--);
      //this.laveFxContainer.setDepth(z--);
        this.Lava2.setDepth(z--);
        this.Lava.setDepth(z--);
        this.player.setDepth(z--);
        this.checkPoints.setDepth(z--);
        this.Tuyo.setDepth(z--);
        this.Tag.setDepth(z--);
        this.Fond1.setDepth(z--);
        this.Fond3.setDepth(z--);
        this.Fond2.setDepth(z--);

      /*  this.derriere.setDepth(z--);
        this.sky2.setDepth(z--);
        this.sky.setDepth(z--); */
//Save & Restore checkpoint
        this.restoreCheckPoint();

     }
     saveCheckPoint(checkPointName)
        {
        //this.unique = false;
        if (localStorage.getItem("Check") !== checkPointName) // this.unique == false
        {
            //console.log("on atteint le checkpoint", checkPointName);
            localStorage.setItem("Check", checkPointName);

            /*this.checkpointSound = this.sound.add('criCorbeau');

            var musicConfig = 
            {
                mute: false,
                volume: 1,
                rate : 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay:0,
            }
            this.checkpointSound.play(musicConfig);
           //this.unique = true;*/
        }
    }

    //---------------------------------- FIN DE SAVECHECKPOINT ----------------------------------


    restoreCheckPoint()
    {
        let storedCheckPoint=localStorage.getItem("Check")
        if(storedCheckPoint)
        {
            this.checkPointsObjects.forEach(checkPointObject => 
            {
                if(checkPointObject.name === storedCheckPoint)
                {
                    this.player.setPosition(checkPointObject.x, checkPointObject.y);//+432);
                    //console.log("on charge le checkpoint", checkPointName);
                }
            });
        }
    } //---------------------------------- FIN DE RESTORECHECKPOINT ----------------------------------

    /**
     * Permet d'activer, désactiver des éléments en fonction de leur visibilité dans l'écran ou non
     */
 /*   optimizeDisplay(){
        //return;
        let world=this.cameras.main.worldView; // le rectagle de la caméra, (les coordonnées de la zone visible)

        // on va activer / désactiver les particules de lave
        for( let particule of this.laveFxContainer.getAll()){ // parcours toutes les particules de lave
            if(Phaser.Geom.Rectangle.Overlaps(world,particule.rectangle)){
                //si le rectangle de la particule est dans le rectangle de la caméra
                if(!particule.visible){
                    //on active les particules
                    particule.resume();
                    particule.visible=true;
                }
            }else{
                //si le rectangle de la particule n'est PAS dans le rectangle de la caméra
                if(particule.visible){
                    //on désactive les particules
                    particule.pause();
                    particule.visible=false;
                }
            }
        }

        // ici vous pouvez appliquer le même principe pour des monstres, des étoiles etc...
    }

    /**
     * Fait se déplacer certains éléments en parallax
     */
    moveParallax(){
        //le ciel se déplace moins vite que la caméra pour donner un effet paralax
        this.sky.tilePositionX=this.cameras.main.scrollX*0.6;
        this.sky.tilePositionY=this.cameras.main.scrollY*0.6;
        this.sky2.tilePositionX=this.cameras.main.scrollX*0.7+100;
        this.sky2.tilePositionY=this.cameras.main.scrollY*0.7+100;
    }

    restart(){
        let s = this;
        this.saigne(s.player,function(){
            //à la fin de la petite anim, on relance le jeu
            s.blood.visible=false;
            s.player.isDead=false;
            s.player.disableBody(true,true);
        })

        this.time.delayedCall(1000, function(){s.scene.restart()}); 
    }

/*
    update(){
        super.update();
        this.moveParallax();

        //optimisation
        //teste si la caméra a bougé
        let actualPosition=JSON.stringify(this.cameras.main.worldView);
        if(
            !this.previousPosition
            || this.previousPosition !== actualPosition
        ){
            this.previousPosition=actualPosition;
            this.optimizeDisplay();
        }
    }



*/
} 