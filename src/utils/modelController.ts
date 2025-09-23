import * as THREE from 'three'

export class ModelController {
  model;
  mixer: THREE.AnimationMixer;
  animations: {[key: string]: THREE.AnimationAction} = {};

  angle: number = 0;
  radius: number = 20;
  isMoving: boolean = false;

  constructor(model) {
    this.model = model.scene;
    this.model.castShadow = true;
    const animations = model.animations;

    this.model.scale.set(.015,.015,.015);
    this.model.position.set(this.radius * Math.cos(this.angle), 0.1, this.radius * Math.sin(this.angle));

    if(animations && animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.model)

      this.animations.walk = this.mixer.clipAction(animations[0]);

    }
  }

  move(delta) {
    if(!this.isMoving) return;
    if(this.animations.walk) {
      this.animations.walk.play();
      this.updateMixer(delta)
    }

    this.angle+=.005;

    this.model.position.x =  this.radius * Math.cos(this.angle);
    this.model.position.z = this.radius * Math.sin(this.angle);
    this.model.rotation.y = -this.angle;
  }

  enableShadows() {
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        child.frustumCulled = true;
      }
    });

    console.log('Shadows enabled for model');
  }

  updateMixer(delta) {
    this.mixer.update(delta);
  }



  addListeners() {
    window.addEventListener('keydown', (e)=> {
      if(e.key==='w') this.isMoving = true;
    })
    window.addEventListener('keyup', (e)=> {
      if(e.key==='w') this.isMoving = false;
    })
  }

}