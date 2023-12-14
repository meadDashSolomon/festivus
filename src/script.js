import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x808080,
  })
);
scene.add(floor);

/**
 * Festivus Pole
 */
// Base of pole
// const baseColorTexture = textureLoader.load(
//   "/textures/wood/raw_plank_wall_diff_1k.jpg",
//   function (texture) {
//     texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
//     texture.repeat.set(0.25, 0.25);
//     texture.minFilter = THREE.LinearFilter; // Prevent mipmapping blur
//     texture.rotation = Math.PI / 2; // Rotate the texture by 90 degrees
//     texture.center.set(0.5, 0.5); // Set the center for rotation
//   }
// );
// baseColorTexture.colorSpace = THREE.SRGBColorSpace;
// baseColorTexture.wrapS = THREE.RepeatWrapping;
// baseColorTexture.wrapT = THREE.RepeatWrapping;

// const baseNormalTexture = textureLoader.load(
//   "/textures/wood/raw_plank_wall_nor_gl_1k.png",
//   function (texture) {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(0.5, 0.5);
//     texture.rotation = Math.PI / 2; // Rotate the texture by 90 degrees
//     texture.center.set(0.5, 0.5); // Set the center for rotation
//   }
// );

// const baseAORoughnessMetalnessTexture = textureLoader.load(
//   "/textures/wood/raw_plank_wall_arm_1k.jpg",
//   function (texture) {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(0.5, 0.5);
//     texture.rotation = Math.PI / 2; // Rotate the texture by 90 degrees
//     texture.center.set(0.5, 0.5); // Set the center for rotation
//   }
// );

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/stand.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.x = Math.PI / 2;
  gltf.scene.position.z = 0.1;

  // gltf.scene.traverse((child) => {
  //   if (child.isMesh) {
  //     const material = new THREE.MeshStandardMaterial({
  //       map: baseColorTexture,
  //       // normalMap: baseNormalTexture,
  //       // aoMap: baseAORoughnessMetalnessTexture,
  //       // roughnessMap: baseAORoughnessMetalnessTexture,
  //       // metalnessMap: baseAORoughnessMetalnessTexture,
  //     });
  //     child.material = material;
  //   }
  // });

  scene.add(gltf.scene);
});

gltfLoader.load("/models/pole.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.x = Math.PI / 2;
  gltf.scene.position.z = 0.1;

  scene.add(gltf.scene);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize function
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
camera.lookAt(floor.position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
