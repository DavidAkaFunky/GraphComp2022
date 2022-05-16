/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var decreaseX, decreaseY, decreaseZ, decreaseV1, decreaseV2, decreaseV3;

var increaseX, increaseY, increaseZ, increaseV1, increaseV2, increaseV3;

var usingFullViewCamera, usingTopViewCamera, usingSideViewCamera;

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

function createTorus(x, y, z, color, objects){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.TorusGeometry(4, 1, 16, 16);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    
    for (var i = 0; i < objects.length; ++i)
        objects[i].add(mesh);
}

function createCylinder(x, y, z, radius, height, color, objects){
    'use strict';

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.CylinderGeometry(radius, radius, height, 8);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    
    for (var i = 0; i < objects.length; ++i)
        objects[i].add(mesh);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));

    object1 = new THREE.Object3D();
    object2 = new THREE.Object3D();
    object3 = new THREE.Object3D();

    createParallelepiped();
    createPyramid();
    createCylinder(22, 16.5, 0, 2, 11, 0xFF00FF, [object1, object2]);
    for (let i = 0; i < 2; ++i){
        for (let j = 0; j < 2; ++j)
            createTorus(15 + 14 * i, 1 + 10 * j, 0, 0x00FF00, [object1, object2, object3]);
        createCylinder(11 + 14 * i, 6, 0, 1, 8, 0xFF0000, [object1, object2, object3]);
        createCylinder(15 + 14 * i, 6, -4, 1, 8, 0xFF0000, [object1, object2, object3]);
        createCylinder(15 + 14 * i, 6, 4, 1, 8, 0xFF0000, [object1, object2, object3]);
        createCylinder(19 + 14 * i, 6, 0, 1, 8, 0xFF0000, [object1, object2, object3]);
    }

    scene.add(object1);
    scene.add(object2);
    scene.add(object3);
}

function useFullViewCamera() {
    'use strict';

    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 60;
    camera.position.y = 60;
    camera.position.z = 60;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useTopViewCamera() {
    'use strict';

    // TODO: Change to orthographic camera
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    
    camera.position.x = 22;
    camera.position.y = 80;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(22, 0, 0));

}

function useSideViewCamera() {
    'use strict';

    // TODO: Change to orthographic camera
    camera = new THREE.PerspectiveCamera(70,
                                        window.innerWidth / window.innerHeight,
                                        1,
                                        1000);

    camera.position.x = 0;
    camera.position.y = 27;
    camera.position.z = 80;
    camera.lookAt(new THREE.Vector3(0, 27, 0));
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
            usingFullViewCamera = true;
            usingTopViewCamera = false;
            usingSideViewCamera = false;
            break;

        case 50:  // 2
            usingFullViewCamera = false;
            usingTopViewCamera = true;
            usingSideViewCamera = false;
            break;
        
        case 51:  // 3
            usingFullViewCamera = false;
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

            
        // Move along the axis (x, y and z)
        
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
        
        case 67:  // C
        case 99:  // c
            decreaseZ = true;
            break;

        case 68:  // D
        case 100: // d
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
    usingFullViewCamera = true;
    wireframe = true;

    clock = new THREE.Clock();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingFullViewCamera)
        useFullViewCamera();
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
    const deltaV = Math.PI * deltaClock/4; 

    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = wireframe;
        }
    });

    // Update camera position
    camera.position.x += (increaseX - decreaseX) * deltaR;
    camera.position.y += (increaseY - decreaseY) * deltaR;
    camera.position.z += (increaseZ - decreaseZ) * deltaR;

    // TODO: Update rotations based on deltaV

    // Reset update flags
    resetUpdateFlags();

    render();

    requestAnimationFrame(animate);
}