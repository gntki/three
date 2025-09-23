// export enum BREAKPOINTS {
//     DESKTOP = "1000px",
//     MOBILE =  "320px"
// }
//
// export enum COLORS {
//     WHITE = "#FFFFFF",
//     BLACK = "#000000"
// }

import * as THREE from "three";

export const CubColors = [
  0xed7272, 0xfc6e3a, 0xf2e746,
  0x89e62c, 0x17e6d4, 0x325be3,
  0xb24dd6, 0xe31092, 0xbf001a
];

export const GROUP_SCALES = {
  MIN: .6,
  MAX: 1.1
}

export const GeometryPack = [
  new THREE.PlaneGeometry(250, 50),
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.CapsuleGeometry(1, 1, 4, 8),
  new THREE.CircleGeometry(1.3, 15),

  new THREE.ConeGeometry(1, 2, 10),
  new THREE.OctahedronGeometry(1.5, 1),
  new THREE.TorusGeometry(1, .5, 20, 10),

  new THREE.TorusKnotGeometry( .8, .3, 50, 7 ),
  new THREE.SphereGeometry( 1.4, 10, 10 ),
  new THREE.TetrahedronGeometry(1.5, 0),
]

export const COLOR_BASE = 0xfefefe;
export const COLOR_ACTIVE = 0xca37de;