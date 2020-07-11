"use strict"; 
/* exported GameObject */
class GameObject extends UniformProvider {
  constructor(mesh) { 
    super("gameObject");
 
    this.velocity = new Vec3(0, 0, 0); 
    this.position = new Vec3(0, 0, 0); 
    this.orientation = 0; 
    this.scale = new Vec3(1, 1, 1); 
 
    this.addComponentsAndGatherUniforms(mesh);
  } 

  move(dt) {
    this.position = this.position.plus(this.velocity.times(dt));
    this.modelMatrix.set();
    this.modelMatrix.scale(this.scale);
    this.modelMatrix.rotate(this.orientation);
    this.modelMatrix.translate(this.position);
  }

  deleteObjFromGameObjects(obj, arr) {
    var objIndex = 0
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == obj) {
        objIndex = i
        break
      }
    }

    arr.splice(objIndex, 1)
  }

  deleteSelfFromGameObjects(arr){
    this.deleteObjFromGameObjects(this, arr)
  }
}
