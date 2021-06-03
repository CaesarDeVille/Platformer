class Tir extends ObjetPhysique{

   constructor(scene, x, y){
       super(scene, x, y, "tir");
       scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.allowGravity=false;
      this.setDisplaySize(20,9);
      this.setBodySize(this.body.width,this.body.height);

      this.setVelocityX(800);
      this.setBounce(1);
      this.setDepth(1000);
      ui.perds();
      let tir = this;
      scene.physics.add.collider(this, scene.Physique, function(){
         tir.destroy()
      });
      scene.monstersContainer.iterate(monster=>{
         scene.physics.add.collider(this, monster, function(){
            monster.Tmortlol();
            tir.destroy()
         }, null, scene);
      })
      
    }
}