/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

var clock;

var update_x, update_y, update_z, update_v1, update_v2, update_v3;

var parallelepiped;

// This is the only parallelpiped, so no coordinates are needed
function createParallelepiped(){
    'use strict';
    
    parallelepiped = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00FFFF, wireframe: true });
    geometry = new THREE.BoxGeometry(Math.sqrt(52), Math.sqrt(512), Math.sqrt(52));
    mesh = new THREE.Mesh(geometry, material);

    parallelepiped.add(mesh);
    parallelepiped.position.set(11, 42, 0);
    parallelepiped.rotation.set(0, 0, Math.PI / 4);

    scene.add(parallelepiped);
}
    

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));
    
    createParallelepiped();
}

function createCamera(){
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    useFullViewCamera();
}

function useFullViewCamera() {
    camera.position.x = 80;
    camera.position.y = 80;
    camera.position.z = 80;
    console.log(scene.position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useTopViewCamera() {
    // TODO: Define positions
}

function useSideViewCamera() {
    camera.position.x = 0;
    camera.position.y = 26;
    camera.position.z = 80;
    camera.lookAt(new THREE.Vector3(0, 26, 0));
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
        
        // Choose camera
        case 49:  // 1
            useFullViewCamera();
            break;

        case 50:  // 2
            useTopViewCamera();
            break;
        
        case 51:  // 3
            useSideViewCamera();
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

        case 38:  // Arrow up
            update_y = 1;
            break;

        case 39:  // Arrow right
            update_x = 1;
            break;

        case 40:  // Arrow down
            update_y = -1;
            break;

        case 68:  // D
        case 100: // d
            update_z = 1;
            break;
        
        case 67:  // C
        case 99:  // c
            update_z = -1;
            break;
    }
}

function reset_update_flags(){
    update_x = 0;
    update_y = 0;
    update_z = 0;
    update_v1 = 0;
    update_v2 = 0;
    update_v3 = 0;
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
    createCamera();
    
    clock = new THREE.Clock();
    reset_update_flags();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    var delta_clock = clock.getDelta();
    var delta_r = 10 * delta_clock;
    var delta_v = Math.PI * delta_clock/4; 

    // Update camera position
    camera.position.x += update_x * delta_r;
    camera.position.y += update_y * delta_r;
    camera.position.z += update_z * delta_r;

    // TODO: Update rotations based on delta_v

    // Reset update flags
    reset_update_flags();

    render();

    requestAnimationFrame(animate);
}