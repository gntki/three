import * as THREE from 'three'
import {COLOR_ACTIVE, COLOR_BASE, GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { gsap } from "gsap";

export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private group: THREE.Group;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;

  private activeIndex: number = -1;

  private clock: THREE.Clock;


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

    this.clock = new THREE.Clock();
    this.tick();

    this.addResizeListener();
    this.addClickListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }


  createObjects() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    let index = 0;
    for (let x = -5; x <= 5; x += 5) {
      for (let y = -5; y <= 5; y += 5) {
          const mesh = new THREE.Mesh(
            GeometryPack[index], new THREE.MeshBasicMaterial({
            color: COLOR_BASE, wireframe: true
          }));
          mesh.position.set(x, y, 0);
          // @ts-ignore
          mesh.index = index;
          // @ts-ignore
          mesh.basePositions = {x: x, y: y, z: 0};
          this.group.add(mesh)
          index+=1;
        }

    }
    this.scene.add(this.group);

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


  setControls() {
    //orbitControls
    this.orbitControls = new OrbitControls(this.camera, this.el);
    this.orbitControls.enableDamping = true;
  }


  tick() {
    const delta = this.clock.getDelta();
    if(this.activeIndex!==-1) {
      this.group.children[this.activeIndex].rotation.y += delta/2;
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

  addClickListener() {
    const handleClick = (e) => {
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera(pointer, this.camera);

      const intersects = raycaster.intersectObject(this.group);

      console.log(this.group.children)
      if(this.activeIndex !== -1) {
        // @ts-ignore
        this.group.children[this.activeIndex].material.color.set(COLOR_BASE);
        // @ts-ignore
        const {x, y, z} = this.group.children[this.activeIndex].basePositions;
        gsap.to(this.group.children[this.activeIndex].position, {
          x: x,
          y: y,
          z: z,
          duration: .5,
          ease: "power3.out"
        })
        this.activeIndex = -1;
      }

      for ( let i = 0; i < intersects.length; i ++ ) {
        // @ts-ignore
        intersects[i].object.material.color.set(COLOR_ACTIVE);
        // @ts-ignore
        this.activeIndex = intersects[i].object.index;
        gsap.to(this.group.children[this.activeIndex].position, {
          x: 0,
          y: 0,
          z: 10,
          duration: .5,
          ease: "power3.out"
        })
      }
    }

    window.addEventListener('click', handleClick)
  }
}

