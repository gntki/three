import * as THREE from 'three'
import {gsap} from "gsap";
import {GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ModelController} from "utils/modelController.ts";


export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  positions = [
    {position: new THREE.Vector3(0, 10, -20)},
    {position: new THREE.Vector3(20, 10, 0)},
    {position: new THREE.Vector3(0, 10, 20)},
    {position: new THREE.Vector3(-20, 10, 0)},
  ]
  spheres: THREE.Object3D[] = [];
  currentIndex: number | null = null;

  private modelController;

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
    this.createStats();

    // this.setControls();

    this.clock = new THREE.Clock();
    this.tick();

    this.addResizeListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }


  createObjects() {
    const spheres = this.positions.map(({position}) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 24, 24),
        new THREE.MeshStandardMaterial({color: 'green'})
      )
      this.spheres.push(sphere)
      sphere.position.set(...position)
      sphere.castShadow = true;
      return sphere
    })

    const texture = new THREE.TextureLoader().load('src/assets/stone-texture.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 4);

    const mesh = new THREE.Mesh(
      GeometryPack[0],
      new THREE.MeshStandardMaterial({map: texture}));
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    mesh.receiveShadow = true;

    this.scene.add(...spheres)
    this.scene.add(mesh);
  }

  createModels() {
    const loader = new GLTFLoader();

    loader.load(
      'src/models/cat/scene.gltf',
      gltf => {
        this.modelController = new ModelController(gltf, this.positions);
        this.modelController.enableShadows();
        this.modelController.addListeners();

        this.scene.add(this.modelController.model);
      },
      xhr => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      error => {
        console.log('Error: ', error)
      }
    )
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 20);
    const directionalLight = new THREE.DirectionalLight(0x404040, 20);

    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.size.w / this.size.h);
    this.scene.add(this.camera);
    this.camera.position.set(0, 13, 30);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }


  createRender() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.el});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

  animateSphere(sphereIndex) {
    if (sphereIndex === this.currentIndex) return;

    // Возвращаем предыдущую сферу в нормальное состояние
    if (this.currentIndex !== null) {
      const previousSphere = this.spheres[this.currentIndex];
      gsap.to(previousSphere.scale, {x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.3)"});
      gsap.to(previousSphere.material.color, {r: 0, g: 1, b: 0, duration: 1, ease: "power2.inOut"});
    }

    // Анимируем новую активную сферу
    if (sphereIndex !== null) {
      const newSphere = this.spheres[sphereIndex];

      gsap.to(newSphere.scale, {x: 2, y: 2, z: 2, duration: 1, ease: "elastic.out(1, 0.3)"});
      gsap.to(newSphere.material.color, {r: 1, g: 0, b: 0, duration: 1, ease: "power2.inOut"});
    }
    this.currentIndex = sphereIndex;
  }

  tick() {
    this.stats.begin();
    const delta = this.clock.getDelta();

    if (this.modelController) {
      this.modelController.move(delta);

      const sphereIndex = this.modelController.getActivePosition();
      this.animateSphere(sphereIndex)
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

}

