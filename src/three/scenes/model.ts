import * as THREE from 'three'
import {GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";


export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;

  private model;
  private animations;
  private mixer: THREE.AnimationMixer | null = null;

  private clock: THREE.Clock;
  private stats;


  constructor(el: HTMLCanvasElement, size) {
    this.el = el;
    this.size.w = size.w;
    this.size.h = size.h;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x252525);

    this.tick = this.tick.bind(this);

    this.init();
  }


  init() {
    // this.createAxesHelper();
    this.createLights();
    this.createObjects();
    this.createModels();
    this.createCamera();
    this.createRender();
    this.createStats();

    this.setControls();

    this.clock = new THREE.Clock();
    // this.addRaycaster();
    this.tick();

    this.addResizeListener();
    // this.addClickListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 20);
    const directionalLight = new THREE.DirectionalLight(0x404040, 150);
    const pointLight = new THREE.PointLight(0x404040, 250);
    pointLight.position.set(5, 0, 0);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(pointLight);
  }

  createModels() {
    const loader = new GLTFLoader();
    loader.load(
      'src/models/black_rat/scene.gltf',
      gltf => {
        this.model = gltf.scene;
        this.animations = gltf.animations;

        this.scene.add(this.model)
        this.model.scale.set(2,2,2);
        this.model.position.set(0,-2,0);

        console.log('this.animations', this.animations)

        if (this.animations && this.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);

          const action = this.mixer.clipAction(this.animations[4])
          action.reset().play();
        }
      },
      xhr => console.log(`${xhr.loaded/xhr.total*100}%`),
      e => console.log(e)
    )
  }

  createObjects() {
    const texture = new THREE.TextureLoader().load('src/assets/stone-texture.jpg');
    const mesh = new THREE.Mesh(
      GeometryPack[0],
      new THREE.MeshStandardMaterial({map: texture})
    );
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
  }


  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.size.w / this.size.h);
    this.scene.add(this.camera);
    this.camera.position.set(-6, 2, 8);
  }


  createRender() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.el});
    this.renderer.setSize(this.size.w, this.size.h);
    this.renderer.render(this.scene, this.camera);
  }

  createStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom)
  }


  setControls() {
    //orbitControls
    this.orbitControls = new OrbitControls(this.camera, this.el);
    this.orbitControls.enableDamping = true;
  }

  addRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.raycaster.setFromCamera( this.pointer, this.camera );
  }

  tick() {
    this.stats.begin();

    const delta = this.clock.getDelta();
    this.orbitControls.update();

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);

    this.stats.end();
    window.requestAnimationFrame(this.tick);
  }



  addResizeListener() {
    window.addEventListener('resize', () => {
      this.size.w = window.innerWidth;
      this.size.h = window.innerHeight

      this.camera.aspect = this.size.w / this.size.h;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.size.w, this.size.h);
      // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.render(this.scene, this.camera);
    })
  }

  addClickListener() {
    window.addEventListener('click', (event)=> {
      this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      const intersects = this.raycaster.intersectObjects(this.model);


      if (intersects) {
        if(this.animations && this.animations.length && this.mixer) {
          this.mixer.stopAllAction();

          const action = this.mixer.clipAction(this.animations[11]);
          action.loop = THREE.LoopOnce; // Проигрываем один раз
          action.clampWhenFinished = true;
          action.reset().play();
        }
      }
      console.log('intersects', intersects)
    })
  }
}

