/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var camera_mode;

var update_x, update_y, update_z, update_v1, update_v2, update_v3;

var parallelepiped, pyramid, torus;

var plane;

// This is the only parallelpiped, so no coordinates are needed
function createParallelepiped(){
    'use strict';
    
    parallelepiped = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.BoxGeometry(Math.sqrt(72), Math.sqrt(512), Math.sqrt(72));
    mesh = new THREE.Mesh(geometry, material);

    parallelepiped.add(mesh);
    parallelepiped.position.set(11, 43, 0);
    parallelepiped.rotation.set(0, 0, Math.PI / 4);

    scene.add(parallelepiped);
}

// This is the only pyramid, so no coordinates are needed
function createPyramid(){
    'use strict';

    pyramid = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.ConeGeometry(Math.sqrt(72), 10, 4);
    mesh = new THREE.Mesh(geometry, material);

    pyramid.add(mesh);
    pyramid.position.set(22, 27, 0);
    pyramid.rotation.set(Math.PI, - Math.PI / 4, 0);

    scene.add(pyramid);
}

function createTorus(x, y, z, color){
    'use strict';

    torus = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.TorusGeometry(4, 1, 16, 16);
    mesh = new THREE.Mesh(geometry, material);

    torus.add(mesh);
    torus.position.set(x, y, z);
    torus.rotation.set(Math.PI / 2, 0, 0);
    
    scene.add(torus);
}

function createCylinder(x, y, z, radius, height, color){
    'use strict';

    var cylinder = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({color: color, wireframe: true })
    geometry = new THREE.CylinderGeometry(radius, radius, height, 8);
    mesh = new THREE.Mesh(geometry, material);

    cylinder.add(mesh);
    cylinder.position.set(x, y, z);
    
    scene.add(cylinder);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));

    createParallelepiped();
    createPyramid();
    createCylinder(22, 16.5, 0, 2, 11, 0xFF00FF);
    for (let i = 0; i < 2; ++i){
        for (let j = 0; j < 2; ++j)
            createTorus(15 + 14 * i, 1 + 10 * j, 0, 0x00FF00);
        createCylinder(11 + 14 * i, 6, 0, 1, 8, 0xFF0000);
        createCylinder(15 + 14 * i, 6, -4, 1, 8, 0xFF0000);
        createCylinder(15 + 14 * i, 6, 4, 1, 8, 0xFF0000);
        createCylinder(19 + 14 * i, 6, 0, 1, 8, 0xFF0000);
    }
}

function createCamera(){
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera_mode = 1;
}

function useFullViewCamera() {
    'use strict';

    camera.position.x = 60;
    camera.position.y = 60;
    camera.position.z = 60;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useTopViewCamera() {
    'use strict';
    
    camera.position.x = 22;
    camera.position.y = 80;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(22, 0, 0));

}

function useSideViewCamera() {
    'use strict';

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
            camera_mode = 1;
            break;

        case 50:  // 2
            camera_mode = 2;
            break;
        
        case 51:  // 3
            camera_mode = 3;
            break;


        // Alternate between solid and wireframe material
        case 52:  // 4
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;


        // Control v1 angle (main branch)
        case 81:  // Q
        case 113: // q
            update_v1 = -1;
            break;

        case 87:  // W
        case 119: // w
            update_v1 = 1;
            break;
           

        // Control v2 angle (secondary branch)
        case 65:  // A
        case 97:  // a
            update_v2 = -1;
            break;

        case 83:  // S
        case 115: // s
            update_v2 = 1;
            break;
        

        // Control v3 angle (tertiary branch)
        case 90:  // Z
        case 122: // z
            update_v3 = -1;
            break;
        
        case 88:  // X
        case 120: // x
            update_v3 = 1;
            break;

            
        // Move along the axis (x, y and z)
        
        case 37:  // Arrow left
            update_x = -1;
            break;

        case 39:  // Arrow right
            update_x = 1;
            break;

        case 40:  // Arrow down
            update_y = -1;
            break;

        case 38:  // Arrow up
            update_y = 1;
            break;
        
        case 67:  // C
        case 99:  // c
            update_z = -1;
            break;

        case 68:  // D
        case 100: // d
            update_z = 1;
            break;
    }
}

function resetUpdateFlags(){
    'use strict';

    update_x = 0;
    update_y = 0;
    update_z = 0;
    update_v1 = 0;
    update_v2 = 0;
    update_v3 = 0;
    camera_mode = 0;
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
    createCamera();

    clock = new THREE.Clock();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    switch (camera_mode){
        case 1:
            useFullViewCamera();
            break;
        case 2:
            useTopViewCamera();
            break;
        case 3:
            useSideViewCamera();
            break;
    }
}

function animate() {
    'use strict';

    chooseCameraMode();

    const delta_clock = clock.getDelta();
    const delta_r = 100 * delta_clock;
    const delta_v = Math.PI * delta_clock/4; 

    // Update camera position
    camera.position.x += update_x * delta_r;
    camera.position.y += update_y * delta_r;
    camera.position.z += update_z * delta_r;
    // TODO: Update rotations based on delta_v

    // Reset update flags
    resetUpdateFlags();

    render();

    requestAnimationFrame(animate);
}