import * as THREE from 'three'
import {CubColors, GROUP_SCALES} from "@constants/constants.ts";

export function controller(el) {
  const scene = new THREE.Scene();
  const size = {w: window.innerWidth, h: window.innerHeight};

  //Ось
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  //Объект
  const group = new THREE.Group();
  scene.add(group);
  const meshes = [];

  let colorId = 0;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for(let x=-1.2; x<=1.2; x+=1.2) {
    for(let y=-1.2; y<=1.2; y+=1.2) {
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: CubColors[colorId], wireframe: true
      }));
      mesh.position.set(x,y,0)
      mesh.scale.set(.55,.55,.55)
      meshes.push(mesh);
      colorId++;
    }
  }
  group.add(...meshes)


  //Камера
  const camera = new THREE.PerspectiveCamera(75, size.w / size.h);
  scene.add(camera);
  camera.position.set(0, 0, 3);

  //Рендер
  const renderer = new THREE.WebGLRenderer({canvas: el.current});
  renderer.setSize(size.w, size.h);
  renderer.render(scene, camera);


  const clock = new THREE.Clock();
  let grow = false;

  const tick = () => {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    meshes.forEach((el, id) => {
      const mult = id%2===0 ? 1 : -1;
      el.rotation.x += delta * mult;
      el.rotation.y += delta * mult * .4;
    })

    camera.position.x = Math.cos(elapsedTime);
    camera.position.y = Math.sin(elapsedTime);
    camera.lookAt(new THREE.Vector3(0,0,0))

    const mult = grow ? 1 : -1;
    const speed = .1;
    group.scale.x += delta * mult * speed;
    group.scale.y += delta * mult * speed;
    group.scale.z += delta * mult * speed;

    if(grow && group.scale.x >= GROUP_SCALES.MAX) {
      grow = false;
    } else if (group.scale.x <= GROUP_SCALES.MIN) {
      grow = true;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}