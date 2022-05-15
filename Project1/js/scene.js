/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

var clock;

var update_x = 0, update_y = 0, update_z = 0;

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

}

function createCamera(){
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    useFullViewCamera();
    camera.lookAt(scene.position);
}

function useFullViewCamera() {
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
}

function useTopViewCamera() {
    // TODO: Define positions
}

function useSideViewCamera() {
    // TODO: Define positions
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

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
            // TODO (Decrease v1 angle)
            break;

        case 87:  // W
        case 119: // w
            break;
            // TODO (Increase v1 angle)
           

        // Control v2 angle (secondary branch)
        case 65:  // A
        case 97:  // a
            // TODO (Decrease v2 angle)
            break;

        case 83:  // S
        case 115: // s
            break;
            // TODO (Increase v2 angle)
        

        // Control v3 angle (tertiary branch)
        case 90:  // Z
        case 122: // z
            break;
            // TODO (Decrease v3 angle)
        
        case 88:  // X
        case 120: // x
            break;
            // TODO (Increase v3 angle)

            
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

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    var delta_r = 10 * clock.getDelta();

    // Update camera position
    camera.position.x += update_x * delta_r;
    camera.position.y += update_y * delta_r;
    camera.position.z += update_z * delta_r;

    // Update flags
    update_x = 0;
    update_y = 0;
    update_z = 0;
    render();

    requestAnimationFrame(animate);
}