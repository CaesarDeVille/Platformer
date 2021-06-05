class MonsterWalk3 extends ObjetEnnemi{
    /**
     * Un monstre qui vole et fait des allez -retours
     * @param {Tableau} scene
     * @param x
     * @param y
     */
    constructor(scene, x, y) {
        super(scene, x, y, "monster-walk3");
        //pas de gravité
        this.body.allowGravity=false;
        this.setCollideWorldBounds(true);
    
        //gestion de la taille...car attention notre png est très grand (et c'est maaaaal car pas optimisé)
        this.setDisplaySize(67,124);

        //on réduit un peu la zone de hit
        this.setBodySize(this.body.width,this.body.height);
        //this.setOffset(50, 50);

        //définir les propriété que l'on va utiliser dans notre animation

        // X
        this.originalX=x;
        this.minX=x-180;
        this.maxX=x+180;

        // Y
        this.originalY=y;
        this.minY=y;
        this.maxY=y;

        // on applique les propriétés du début de l'animation
        this.x=this.minX;
        this.y=this.minY;
        this.alpha=0;
        let me=this;

        //on fait apparaitre notre objet avec un petit delay, puis on lance l'animation
        //ceci a pour effet de décaler les animations pour ce même objet
        scene.tweens.add({
                targets:this,
                duration:500,
                delay:Math.random()*1000,
                alpha:{
                    startDelay:0,
                    from:0,
                    to:1,
                },
                onComplete: function () {
                    me.start();
                }
            })

    }

    start(){
        this.scene.tweens.add({
            targets: this,
            x: {
                from: this.minX,
                to:this.maxX,
                duration: 10*1000,
                ease: 'Sine.easeInOut',
                yoyo: -1,
                repeat:-1,
                flipX:true,
            },
            y: {
                from: this.minY,
                to:this.maxY,
                duration: 500,
                ease: 'Sine.easeInOut',
                yoyo: -1,
                repeat:-1
            }
        });
    }

}