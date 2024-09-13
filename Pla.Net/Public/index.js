
import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

// Получение размеров окна браузера
const w = window.innerWidth;
const h = window.innerHeight;

// Создание сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// Создание контроллера камеры с ограничениями
const controls = new OrbitControls(camera, renderer.domElement);
// Устанавливаем максимальное приближение
controls.minDistance = 1.5;
// Это заставит OrbitControls обновляться при каждом кадре
controls.update();




// Создание группы для Земли и настройка её наклона
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

// Добавление возможности управления камерой с помощью мыши
new OrbitControls(camera, renderer.domElement);
// Предполагая, что controls уже созданы с помощью OrbitControls
controls.enableDamping = true; // Включаем затухание (инерцию)
controls.dampingFactor = 0.05; // Сила затухания, экспериментируйте с этим значением, чтобы найти подходящее

// Загрузка и настройка текстур Земли
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

// Добавление эффекта городских огней
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
//earthGroup.add(lightsMesh);

// Добавление облаков
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
//earthGroup.add(cloudsMesh);

// Добавление атмосферного свечения
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
//earthGroup.add(glowMesh);

// Создание звездного поля
const stars = getStarfield({numStars: 8000});
scene.add(stars);

// Добавление источника света, имитирующего Солнце
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Функция анимации для вращения Земли и звездного поля
function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}
animate();

// Обработчик изменения размера окна для корректировки аспекта камеры и размера рендерера
function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);