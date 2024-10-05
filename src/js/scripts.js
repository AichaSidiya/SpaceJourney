import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';
import asteroidTexture from '../img/asteroid.jpeg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Add these variables at the beginning of your JavaScript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const hoveredPlanet = { mesh: null };


// Function to scale the hovered planet to a specific size


function createPlanete(size, texture, position, ring, description) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;

    // Store the description on the mesh
    mesh.description = description;

    return { mesh, obj };
}


function createNEO(size, texture, position, description, velocity) {
    const geo = new THREE.SphereGeometry(size, 20, 20);
    const mat = new THREE.MeshStandardMaterial({ map: textureLoader.load(texture) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(position.x, position.y, position.z);
    mesh.description = description; // Store description on the mesh
    mesh.velocity = velocity; // Store velocity for movement
    scene.add(mesh);
    return mesh;
}

function scaleToSize(hoveredPlanet, targetSize) {
    // Create a bounding box to find the current dimensions
    const box = new THREE.Box3().setFromObject(hoveredPlanet.mesh);
    
    // Get the current dimensions of the planet
    const currentSize = box.getSize(new THREE.Vector3()).length();
    
    // Calculate the scale factor needed to reach the target size
    const scaleFactor = targetSize / currentSize;

    // Apply the scale factor to the mesh
    hoveredPlanet.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
}


// Example usage
const targetSize = Math.min(window.innerWidth, window.innerHeight) * 0.25;; // Desired size

let planetsVisible = true; // Flag to control visibility

// Add the mouse move event listener


function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([
        mercury.mesh, venus.mesh, earth.mesh, mars.mesh,
        jupiter.mesh, saturn.mesh, uranus.mesh, neptune.mesh, pluto.mesh
    ]);

    const descriptionDiv = document.getElementById("planet-description");

    if (intersects.length > 0) {
        hoveredPlanet.mesh = intersects[0].object;
        scaleToSize(hoveredPlanet, targetSize);
        planetsVisible = false;

        // Ensure NEOs are visible and stop their movement
        neoObjects.forEach(neo => {
            neo.visible = true; // Ensure NEOs are visible
            neo.velocity = 0; // Stop movement
        });

        descriptionDiv.innerText = hoveredPlanet.mesh.description || "No description available.";
        descriptionDiv.style.display = "block";

        const rect = intersects[0].object.getBoundingClientRect();
        descriptionDiv.style.left = `${rect.left - 150}px`;
        descriptionDiv.style.top = `${rect.top}px`;
    } else {
        planetsVisible = true;
        descriptionDiv.style.display = "none";

        // Allow NEO movement when not hovering over any planet
        neoObjects.forEach(neo => {
            neo.velocity = Math.random() * 2 + 1; // Restart movement with random velocity
        });
    }
}



window.addEventListener('mousemove', onMouseMove);


const mercury = createPlanete(3.2, mercuryTexture, 28, null, "Mercury: \n- Location: Closest planet to the Sun. \n- Composition: Primarily made of iron and rocks.\n- Diameter: Approximately 4,880 kilometers.\n- Surface: No thick atmosphere, leading to temperatures ranging from \n-173 to 427 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis every 59 days.\n- Orbit: Completes an orbit around the Sun every 88 days.\n- Moons: Has no moons.");
const venus = createPlanete(5.8, venusTexture, 44, null, "Venus: \n- Location: Second planet from the Sun.\n- Composition: Made of rocks and minerals, similar in composition to Earth.\n- Diameter: Approximately 12,104 kilometers.\n- Atmosphere: Dense atmosphere mainly composed of carbon dioxide.\n- Temperature: Reaches up to 465 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis every 243 days in a retrograde direction.\n- Orbit: Completes an orbit around the Sun every 225 days.\n- Moons: Has no moons.");
const earth = createPlanete(6, earthTexture, 62, null, "Earth: \n- Location: Third planet from the Sun.\n- Composition: Consists of crust, mantle, and core.\n- Diameter: Approximately 12,742 kilometers.\n- Surface: 71% covered by water.\n- Life: Supports abundant life.\n- Rotation: Rotates on its axis every 24 hours.\n- Orbit: Completes an orbit around the Sun every 365.25 days.\n- Moons: Has one moon.");
const mars = createPlanete(4, marsTexture, 78, null, "Mars: \n- Location: Fourth planet from the Sun.\n- Composition: Made of rocks and minerals, with a thin atmosphere.\n- Diameter: Approximately 6,779 kilometers.\n- Surface: Atmosphere primarily composed of carbon dioxide.\n- Temperature: Ranges from -125 to 20 degrees Celsius.\n- Life: No known life, but interest in past water presence.\n- Rotation: Rotates on its axis every 24.6 hours.\n- Orbit: Completes an orbit around the Sun every 687 days.\n- Moons: Has two small moons: Phobos and Deimos.");
const jupiter = createPlanete(12, jupiterTexture, 100, null, "Jupiter: \n- Location: Fifth planet from the Sun.\n- Composition: Gas giant primarily composed of hydrogen and helium.\n- Diameter: Approximately 139,820 kilometers.\n- Surface: No clear solid surface.\n- Temperature: Ranges from -145 degrees Celsius in the upper atmosphere.\n- Life: No known life.\n- Rotation: Rotates on its axis every 9.9 hours.\n- Orbit: Completes an orbit around the Sun every 11.9 years.\n- Moons: Has more than 79 moons, including Ganymede, the largest moon in the solar system.");
const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
}, "Saturn: \n- Location: Sixth planet from the Sun.\n- Composition: Gas giant composed of hydrogen and helium.\n- Diameter: Approximately 116,460 kilometers.\n- Surface: Known for its distinctive rings.\n- Temperature: Around -178 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis every 10.7 hours.\n- Orbit: Completes an orbit around the Sun every 29.5 years.\n- Moons: Has more than 80 moons, including Titan.");
const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
}, "Uranus: \n- Location: Seventh planet from the Sun.\n- Composition: Gas giant with a composition rich in methane and ammonia.\n- Diameter: Approximately 50,724 kilometers.\n- Surface: Atmosphere composed of hydrogen, helium, and methane.\n- Temperature: Around -224 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis every 17.2 hours.\n- Orbit: Completes an orbit around the Sun every 84 years.\n- Moons: Has 27 moons, including Titania and Oberon.");
const neptune = createPlanete(7, neptuneTexture, 200, null, "Neptune: \n- Location: Eighth and farthest planet from the Sun.\n- Composition: Gas giant with a composition similar to Uranus.\n- Diameter: Approximately 49,244 kilometers.\n- Surface: Atmosphere rich in methane.\n- Temperature: Around -214 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis every 16 hours.\n- Orbit: Completes an orbit around the Sun every 165 years.\n- Moons: Has 14 moons, including Triton.");
const pluto = createPlanete(2.8, plutoTexture, 216, null, "Pluto: \n- Location: Located in the Kuiper Belt.\n- Composition: Primarily rock and ice, with a thin nitrogen, methane, and carbon monoxide atmosphere.\n- Diameter: Approximately 2,377 kilometers.\n- Surface: Varied terrain with icy mountains and plains, reddish tint from tholins.\n- Temperature: Average surface temperature around -229 degrees Celsius.\n- Life: No known life.\n- Rotation: Rotates on its axis once every 6.4 Earth days.\n- Orbit: Highly elliptical orbit taking 248 Earth years to complete.\n- Moons: Has five known moons, including Charon.");


const neoObjects = [];
neoObjects.push(createNEO(2, asteroidTexture, { x: 80, y: 10, z: 0 }, "NEO 1", Math.random() * 2 + 1));
neoObjects.push(createNEO(2.5, asteroidTexture, { x: 90, y: 5, z: -20 }, "NEO 2", Math.random() * 0.5 + 0.1));
neoObjects.push(createNEO(1.5, asteroidTexture, { x: 70, y: 15, z: 10 }, "NEO 3", Math.random() * 0.06 + 0.01));

neoObjects.push(createNEO(2, asteroidTexture, { x: 20, y: 10, z: 0 }, "NEO 1", Math.random() * 5 + 3));
neoObjects.push(createNEO(2.5, asteroidTexture, { x: 90, y: 10, z: -10 }, "NEO 2", Math.random() * 0.5 + 0.3));
neoObjects.push(createNEO(1.5, asteroidTexture, { x: 70, y: 15, z: 50 }, "NEO 3", Math.random() * 0.05 + 0.07));


neoObjects.push(createNEO(2, asteroidTexture, { x: 9, y: 5, z: 0 }, "NEO 1", Math.random() * 8 + 1));
neoObjects.push(createNEO(2.5, asteroidTexture, { x: 90, y: 5, z: -10 }, "NEO 2", Math.random() * 0.8 + 0.1));
neoObjects.push(createNEO(1.5, asteroidTexture, { x: 50, y: 15, z: 10 }, "NEO 3", Math.random() * 0.08 + 0.01));


const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);


function animate() {
    if (planetsVisible) {
        // Self-rotation
        sun.rotateY(0.004);
        mercury.mesh.rotateY(0.004);
        venus.mesh.rotateY(0.002);
        earth.mesh.rotateY(0.02);
        mars.mesh.rotateY(0.018);
        jupiter.mesh.rotateY(0.04);
        saturn.mesh.rotateY(0.038);
        uranus.mesh.rotateY(0.03);
        neptune.mesh.rotateY(0.032);
        pluto.mesh.rotateY(0.008);

        // Around-sun-rotation
        mercury.obj.rotateY(0.04);
        venus.obj.rotateY(0.015);
        earth.obj.rotateY(0.01);
        mars.obj.rotateY(0.008);
        jupiter.obj.rotateY(0.002);
        saturn.obj.rotateY(0.0009);
        uranus.obj.rotateY(0.0004);
        neptune.obj.rotateY(0.0001);
        pluto.obj.rotateY(0.00007);
    }

    // Update NEO positions based on their velocities
    neoObjects.forEach(neo => {
        if (neo.velocity > 0) { // Only move if the velocity is greater than 0
            neo.position.x -= neo.velocity; // Move the NEO along the x-axis
            
            // Optional oscillation effect
            neo.position.y += Math.sin(Date.now() * 0.001) * 0.01; // Example of oscillation
            
            // Reposition NEO if it goes off-screen
            if (neo.position.x < -100) { // Adjust -100 based on your scene dimensions
                neo.position.x = Math.random() * 200 + 100; // Reposition to the right
                neo.position.y = Math.random() * 20 - 10; // Random y position for variation
                neo.position.z = Math.random() * 20 - 10; // Random z position for variation
            }
        }
    });

    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
