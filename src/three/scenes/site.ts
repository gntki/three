import * as THREE from 'three'
import {COLOR_BASE, GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";


export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private group: THREE.Group;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  private activeIndex: number = -1;

  private model;
  private animations;

  private clock: THREE.Clock;
  private stats;


  constructor(el: HTMLCanvasElement, size) {
    this.el = el;
    this.size.w = size.w;
    this.size.h = size.h;
    this.scene = new THREE.Scene();

    this.tick = this.tick.bind(this);

    this.init();
  }


  init() {
    // this.createAxesHelper();
    this.createObjects();
    this.createModels();
    this.createLights();
    this.createCamera();
    this.createRender();
    // this.createStats();

    this.setControls();

    this.clock = new THREE.Clock();
    this.tick();

    this.addResizeListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }


  createObjects() {
    const texture = new THREE.TextureLoader().load('src/assets/stone-texture.jpg');
    const mesh = new THREE.Mesh(
      GeometryPack[0],
      new THREE.MeshStandardMaterial({map: texture}));
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(-Math.PI/2, 0, 0);
    this.scene.add(mesh);
  }

  createModels() {
    const loader = new GLTFLoader();

    loader.load(
      'src/models/cat/scene.gltf',
      gltf => {
        this.model = gltf.scene;
        this.animations = gltf.animations;

        this.scene.add(gltf.scene);
        this.model.scale.set(.01,.01,.01);
        this.model.position.set(0,0.1,0);
      },
      xhr => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
      },
      error => {
        console.log('Error: ', error)
      }
    )
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 20);
    const directionalLight = new THREE.DirectionalLight(0x404040, 20);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.size.w / this.size.h);
    this.scene.add(this.camera);
    this.camera.position.set(0, 15, 30);
    this.camera.lookAt(new THREE.Vector3(0,0, 0))
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


  tick() {
    // this.stats.begin();
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
    // this.stats.end();
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

}

