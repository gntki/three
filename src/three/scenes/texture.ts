import * as THREE from 'three'
import {GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js'


export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  private activeIndex: number = -1;

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
    this.createLights();
    this.createObjects();
    this.createCamera();
    this.createRender();
    this.createStats();

    this.setControls();

    this.clock = new THREE.Clock();
    this.tick();

    this.addResizeListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    const directionalLight = new THREE.DirectionalLight(0x404040, 50);
    const pointLight = new THREE.PointLight(0x404040, 150);
    pointLight.position.set(5, 0, 0);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(pointLight);
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
    this.camera.position.set(0, 0, 15);
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
    this.stats.begin();
    this.orbitControls.update();
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

}

