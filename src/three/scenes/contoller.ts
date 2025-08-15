import * as THREE from 'three'

export function controller(el) {
  const scene = new THREE.Scene();
  const size = {w: window.innerWidth, h: window.innerHeight}
  console.log('scene', scene)

  //Ось
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper)

  //Объект
  const group = new THREE.Group();
  scene.add(group)
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshBasicMaterial({color: 'green', wireframe: true})
  const mesh1 = new THREE.Mesh(geometry, material);
  const mesh2 = new THREE.Mesh(geometry, material);
  const mesh3 = new THREE.Mesh(geometry, material);

  mesh1.position.set(-1.5, 0, 0);
  mesh3.position.set(1.5, 0, 0);

  group.add(mesh1, mesh2, mesh3)


  //Камера
  const camera = new THREE.PerspectiveCamera(75, size.w/size.h);
  scene.add(camera)
  camera.position.set(0,2, 3);
  camera.lookAt(group.position);

  //Рендер
  const renderer = new THREE.WebGLRenderer({canvas: el.current})
  renderer.setSize(size.w,size.h)
  renderer.render(scene, camera)
}