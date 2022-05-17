/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var decreaseX, decreaseY, decreaseZ, decreaseV1, decreaseV2, decreaseV3;

var increaseX, increaseY, increaseZ, increaseV1, increaseV2, increaseV3;

var usingFrontViewCamera, usingTopViewCamera, usingSideViewCamera;

var wireframe;

var object1, object2, object3;

// This is the only parallelpiped, so no coordinates are needed
function createParallelepiped(){
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.BoxGeometry(Math.sqrt(72), Math.sqrt(512), Math.sqrt(72));
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(11, 43, 0);
    mesh.rotation.set(0, 0, Math.PI / 4);

    object1.add(mesh);
}

// This is the only pyramid, so no coordinates are needed
function createPyramid(){
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.ConeGeometry(Math.sqrt(72), 10, 4);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(22, 27, 0);
    mesh.rotation.set(Math.PI, - Math.PI / 4, 0);

    object1.add(mesh);
}

function createTorus(x, y, z, color, object){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.TorusGeometry(4, 1, 16, 16);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    
    object.add(mesh);
}

function createCylinder(x, y, z, radius, height, color, object){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.CylinderGeometry(radius, radius, height, 8);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    
    object.add(mesh);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));

    object1 = new THREE.Object3D();

    object2 = new THREE.Object3D();
    object2.position.set(22, 16.5, 0);

    object3 = new THREE.Object3D();
    object3.position.set(0, -5.5, 0);

    createParallelepiped();
    createPyramid();
    createCylinder(0, 0, 0, 2, 11, 0xFF00FF, object2);
    for (let i = 0; i < 2; ++i){
        for (let j = 0; j < 2; ++j)
            createTorus(-7 + 14 * i, -10 + 10 * j, 0, 0x00FF00, object3);
        createCylinder(-11 + 14 * i, -5, 0, 1, 8, 0xFF0000, object3);
        createCylinder(-7 + 14 * i, -5, -4, 1, 8, 0xFF0000, object3);
        createCylinder(-7 + 14 * i, -5, 4, 1, 8, 0xFF0000, object3);
        createCylinder(-3 + 14 * i, -5, 0, 1, 8, 0xFF0000, object3);
    }

    object2.add(object3);
    object1.add(object2);
    scene.add(object1);
}

function useFrontViewCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(-window.innerWidth / 25,
                                          window.innerWidth / 25,
                                          window.innerHeight / 25,
                                          -window.innerHeight / 25,
                                          -100,
                                          100);

    camera.position.set(0, 27, 80);
    camera.lookAt(new THREE.Vector3(0, 27, 0));
}

function useTopViewCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(-window.innerWidth / 25,
                                          window.innerWidth / 25,
                                          -window.innerHeight / 25,
                                          window.innerHeight / 25,
                                          -100,
                                          100);
    
    camera.position.set(22, 80, 0);
    camera.lookAt(new THREE.Vector3(22, 0, 0));

}

function useSideViewCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(-window.innerWidth / 25,
                                          window.innerWidth / 25,
                                          window.innerHeight / 25,
                                          -window.innerHeight / 25,
                                          -100,
                                          100);

    // TODO: Define camera position
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

// TODO: Allow multiple key press
function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        
        // Choose camera (should it be given a flag to update the camera in animate()?)
        case 49:  // 1
            usingFrontViewCamera = true;
            usingTopViewCamera = false;
            usingSideViewCamera = false;
            break;

        case 50:  // 2
            usingFrontViewCamera = false;
            usingTopViewCamera = true;
            usingSideViewCamera = false;
            break;
        
        case 51:  // 3
            usingFrontViewCamera = false;
            usingTopViewCamera = false;
            usingSideViewCamera = true;
            break;


        // Alternate between solid and wireframe material
        case 52:  // 4
            wireframe = !wireframe;
            break;


        // Control v1 angle (main branch)
        case 81:  // Q
        case 113: // q
            decreaseV1 = true;
            break;

        case 87:  // W
        case 119: // w
            increaseV1 = true;
            break;
           

        // Control v2 angle (secondary branch)
        case 65:  // A
        case 97:  // a
            decreaseV2 = true;
            break;

        case 83:  // S
        case 115: // s
            increaseV2 = true;
            break;
        

        // Control v3 angle (tertiary branch)
        case 90:  // Z
        case 122: // z
            decreaseV3 = true;
            break;
        
        case 88:  // X
        case 120: // x
            increaseV3 = true;
            break;

            
        // Move object along the axis (x, y and z)
        
        case 37:  // Arrow left
            decreaseX = true;
            break;

        case 39:  // Arrow right
            increaseX = true;
            break;

        case 40:  // Arrow down
            decreaseY = true;
            break;

        case 38:  // Arrow up
            increaseY = true;
            break;

        case 68:  // D
        case 100: // d
            decreaseZ = true;
            break;

        case 67:  // C
        case 99:  // c
            increaseZ = true;
            break;
    }
}

function resetUpdateFlags(){
    'use strict';

    decreaseX = false;  increaseX = false;
    decreaseY = false;  increaseY = false;
    decreaseZ = false;  increaseZ = false;
    decreaseV1 = false; increaseV1 = false;
    decreaseV2 = false; increaseV2 = false;
    decreaseV3 = false; increaseV3 = false;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    resetUpdateFlags();
    usingFrontViewCamera = true;
    wireframe = true;

    clock = new THREE.Clock();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingFrontViewCamera)
        useFrontViewCamera();
    else if (usingTopViewCamera)
        useTopViewCamera();
    else if (usingSideViewCamera)
        useSideViewCamera();
}

function animate() {
    'use strict';

    chooseCameraMode();

    const deltaClock = clock.getDelta();
    const deltaR = 100 * deltaClock;
    const deltaV = Math.PI * deltaClock / 2; 

    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = wireframe;
        }
    });

    // Update object position
    object1.position.x += (increaseX - decreaseX) * deltaR;
    object1.position.y += (increaseY - decreaseY) * deltaR;
    object1.position.z += (increaseZ - decreaseZ) * deltaR;

    // Update rotations based on deltaV
    object1.rotateY((increaseV1 - decreaseV1) * deltaV);
    object2.rotateY((increaseV2 - decreaseV2) * deltaV);
    object3.rotateX((increaseV3 - decreaseV3) * deltaV);


    // Reset update flags
    resetUpdateFlags();

    render();

    requestAnimationFrame(animate);
}