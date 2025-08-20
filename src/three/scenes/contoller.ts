import * as THREE from 'three'
import {CubColors} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";

export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];
  private orbitControls: OrbitControls;
  private dragControls: DragControls;


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
    this.createCamera();
    this.createRender();

    this.setControls();

    this.tick();

    this.addResizeListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }


  createObjects() {
    const group = new THREE.Group();
    this.scene.add(group);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometrySphere = new THREE.SphereGeometry(.5, 32, 16);

    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {

          const cond = x === 0 && y === 0 && z === 0;
          const _geometry = cond ? geometrySphere : geometry;

          const mesh = new THREE.Mesh(_geometry, new THREE.MeshBasicMaterial({
            color: CubColors[(Math.random() * 9).toFixed(0)], wireframe: !cond
          }));

          mesh.position.set(x, y, z)
          mesh.scale.set(1, 1, 1)

          this.meshes.push(mesh);
        }
      }
    }

    group.add(...this.meshes)
  }


  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.size.w / this.size.h);
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 5);
  }


  createRender() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.el});
    this.renderer.setSize(this.size.w, this.size.h);
    this.renderer.render(this.scene, this.camera);
  }


  setControls() {
    //orbitControls
    this.orbitControls = new OrbitControls(this.camera, this.el);
    this.orbitControls.enableDamping = true;

    //dragControls
    this.dragControls = new DragControls(this.meshes, this.camera, this.el);
    this.dragControls.addEventListener('dragstart', (e) => {
      this.orbitControls.enabled = false;
    });

    this.dragControls.addEventListener('hoveroff', (e) => {
      this.orbitControls.enabled = true;
    });
  }


  tick() {
    console.log('tick')
    if (this.orbitControls.enabled) {
      this.orbitControls.update();
    }

    this.orbitControls.update();

    this.renderer.render(this.scene, this.camera);
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

