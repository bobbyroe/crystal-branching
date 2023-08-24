import * as THREE from "three";
import getBgSphere from "./getBgSphere.js";
import { OrbitControls } from "../libs/jsm143/controls/OrbitControls.js";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const sceneGroup = new THREE.Group();
sceneGroup.update = function (time) {
  sceneGroup.rotation.x = time * 0.0002;
  sceneGroup.rotation.y = time * 0.0001;
  sceneGroup.children.forEach((mesh, i) => {
    mesh.update(time);
  });
};
scene.add(sceneGroup);

const size = 0.35;
const geometry = new THREE.BoxGeometry(size, size, size);
const defaultVec3 = new THREE.Vector3();

function getBox({ hue = 0, index = 0, size = 1, trajectory = defaultVec3 }) {
  const color = new THREE.Color().setHSL(hue, 1, 0.01);
  color.offsetHSL(0, Math.random() * 0.2, index * 0.076);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
  });
  const spacing = 0.25;
  const position = trajectory.clone().multiplyScalar(index * spacing + 0.25);
  const rotation = new THREE.Euler(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  const startSize = 0;
  mesh.scale.setScalar(startSize);
  mesh.rotation.copy(rotation);
  mesh.update = function (time) {
    const scale = Math.sin(time * -0.002 + index * 0.1);
    mesh.scale.setScalar(scale * size);
  };
  return mesh;
}
// middle box
sceneGroup.add(getBox({}));
function getBranch({ trajectory }) {
  const numBoxes = 12;
  const hue = 0.15 + Math.random() * 0.1 + 0.05;
  for (let i = 0; i < numBoxes; i += 1) {
    let size = 1 - i / numBoxes;
    sceneGroup.add(getBox({ hue, index: i + 1, size, trajectory }));
  }
}
const numBranches = 24;
for (let i = 0; i < numBranches; i += 1) {
  const trajectory = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();
  getBranch({ trajectory });
}

const bgSphere = getBgSphere({ hue: 0.765 });
scene.add(bgSphere);
scene.add(new THREE.HemisphereLight(0xffffff, 0x442200, 1));

function animate(t = 0) {
  requestAnimationFrame(animate);
  sceneGroup.update(t);
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);