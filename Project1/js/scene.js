/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

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
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
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
        case 50:  // 2
            useTopViewCamera();
        case 51:  // 3
            useSideViewCamera();


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

        case 87:  // W
        case 119: // w
            // TODO (Increase v1 angle)
           

        // Control v2 angle (secondary branch)
        case 65:  // A
        case 97:  // a
            // TODO (Decrease v2 angle)

        case 83:  // S
        case 115: // s
            // TODO (Increase v2 angle)
        

        // Control v3 angle (tertiary branch)
        case 90:  // Z
        case 122: // z
            // TODO (Decrease v3 angle)
        
        case 88:  // X
        case 120: // x
            // TODO (Increase v3 angle)

            
        // Move along the axis (x, y and z)
        case 37:  // Arrow up
            // TODO (Increase y value)

        case 38:  // Arrow down
            // TODO (Reduce y value)

        case 39:  // Arrow left
            // TODO (Reduce x value)

        case 40:  // Arrow right
            // TODO (Increase x value)

        case 68:  // D
        case 100: // d
            // TODO (Decrease z value)
        
        case 67:  // C
        case 99:  // c
            // TODO (Increase z value)
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

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    render();

    requestAnimationFrame(animate);
}