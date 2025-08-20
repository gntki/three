import * as THREE from 'three'
import {CubColors} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";

export function controller(el: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const size = {w: window.innerWidth, h: window.innerHeight};

  // Ось
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  //Объект
  const group = new THREE.Group();
  scene.add(group);
  const meshes: THREE.Mesh[] = [];

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
        meshes.push(mesh);
      }
    }
  }
  group.add(...meshes)


  //Камера
  const camera = new THREE.PerspectiveCamera(75, size.w / size.h);
  scene.add(camera);
  camera.position.set(0, 0, 5);

  //orbitControls
  const orbitControls = new OrbitControls(camera, el);
  orbitControls.enableDamping = true;

  //dragControls
  const dragControls = new DragControls(meshes, camera, el);
  dragControls.addEventListener('dragstart', () => {
    orbitControls.enabled = false;
  });

  dragControls.addEventListener('hoveroff', () => {
    orbitControls.enabled = true;
  });

  //Рендер
  const renderer = new THREE.WebGLRenderer({canvas: el});
  renderer.setSize(size.w, size.h);
  renderer.render(scene, camera);


  const clock = new THREE.Clock();

  const tick = () => {
    const delta = clock.getDelta();

    if (orbitControls.enabled) {
      orbitControls.update();
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}

