import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import gsap from "gsap";


const container = document.getElementById("robo-container");
const heroSection = document.getElementById("hero-section");

//sence
const scene = new THREE.Scene()
//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

let roboModel;
let mixer;
const clock = new THREE.Timer();

//loader
const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

loader.load('robo.glb', (glb) => {
    roboModel = glb.scene

    roboModel.scale.setScalar(1)
    roboModel.position.y = -1.5
    roboModel.position.x = 2.5
    roboModel.rotation.y = -Math.PI / 4
    scene.add(roboModel);

    const animations = glb.animations;
    if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(roboModel);
        const action = mixer.clipAction(glb.animations[0]);
        action.play();
        //nhay tai cho
        gsap.to(roboModel.position, {
            y: -1.25,
            duration: 1,
            ease: "power2.out",
            yoyo: true,
            repeat: -1,
        });
    }

}, (progress) => {
    console.log((progress.loaded / progress.total * 100) + '% loaded');

}, (err) => {
    console.error(err);

})

//render
const rendered = new THREE.WebGLRenderer({ alpha: true, antialias: true })
rendered.setSize(container.clientWidth, window.innerHeight)
container.appendChild(rendered.domElement)


//light
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 3)
topLight.position.set(5, 5, 3)
scene.add(topLight)

//animate
heroSection.addEventListener("mousemove", (event) => {
    if (!roboModel) return;
    const rect = heroSection.getBoundingClientRect();

    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 2;

    const mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    gsap.to(roboModel.rotation, {
        y: mouseX * 0.8,
        x: mouseY * 0.3,
        duration: 1,
        ease: "power3.out",

        overwrite: true,
    });
});

function animate() {
    requestAnimationFrame(animate);
    // Tính thời gian trôi qua (delta time)
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    rendered.render(scene, camera)
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendered.setSize(container.clientWidth, window.innerHeight)

})
animate()

