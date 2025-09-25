import * as THREE from 'three'

export class ModelController {
  private model;
  private mixer: THREE.AnimationMixer;
  private animations: {[key: string]: THREE.AnimationAction} = {};

  private angle: number = 0;
  private radius: number = 20;
  private isMoving: boolean = false;

  positions;
  activePosition: number | null = null;

  constructor(model, positions) {
    this.positions = positions;

    this.initModel(model);
  }


  initModel(model) {
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
      this.checkNearPosition();
      this.updateMixer(delta)
    }

    this.angle+=.007;

    this.model.position.x =  this.radius * Math.cos(this.angle);
    this.model.position.z = this.radius * Math.sin(this.angle);
    this.model.rotation.y = -this.angle;
  }

  checkNearPosition() {
    let value = null;
    this.positions.forEach((el,id) => {
      if(this.model.position.distanceTo(el.position) < 11) {
        value = id;
      }
    })

    this.activePosition = value;
  }

  getActivePosition() {
    return this.activePosition
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
      if(e.key==='ArrowUp') this.isMoving = true;
    })
    window.addEventListener('keyup', (e)=> {
      if(e.key==='ArrowUp') this.isMoving = false;
    })
  }

}