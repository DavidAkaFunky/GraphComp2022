/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var object1;


function createScene() {
    'use strict';

    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0xD5B895 );

    scene.add(new THREE.AxisHelper(50));

    object1 = new THREE.Object3D();

    scene.add(object1);
}

function createCamera() {
    camera = new THREE.OrthographicCamera(-window.innerWidth / 20,
                                          window.innerWidth / 20,
                                          window.innerHeight / 20,
                                          -window.innerHeight / 20,
                                          -1000,
                                          1000);
}

function useFrontViewCamera() {
    'use strict';

    camera.position.set(0, 27, 80);
    camera.lookAt(new THREE.Vector3(0, 27, 0));
}

function useTopViewCamera() {
    'use strict';
    
    camera.position.set(22, 80, 0);
    camera.lookAt(new THREE.Vector3(22, 0, 0));
}

function useSideViewCamera() {
    'use strict';

    camera.position.set(0, 27, 0);
    camera.lookAt(new THREE.Vector3(-40, 27, 0));
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

    // Choose camera (should it be given a flag to update the camera in animate()?)
    if (e.keyCode == 49) {  // 1
        changedCamera = true;
        usingFrontViewCamera = true;
        usingTopViewCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        changedCamera = true;
        usingFrontViewCamera = false;
        usingTopViewCamera = true;
    }

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y

        
    // Shading mode
    if (e.keyCode == 65 || e.keyCode == 97)  // A, a

    // Illumination calculation
    if (e.keyCode == 83 || e.keyCode == 115)  // S, s
    
    // Turn directional light on/off
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x

    if (e.keyCode == 67 || e.keyCode == 99)  // C, c

    // Turn spotlight on/off
    if (e.keyCode == 68 || e.keyCode == 100)  // D, d

}

function onKeyUp(e) {
    'use strict';

    // Rotate origami figures
    if (e.keyCode == 81 || e.keyCode == 113)  // Q, q

    if (e.keyCode == 87 || e.keyCode == 119)  // W, w

    if (e.keyCode == 69 || e.keyCode == 101)  // E, e

    if (e.keyCode == 82 || e.keyCode == 114)  // R, r

    if (e.keyCode == 84 || e.keyCode == 116)  // T, t

    if (e.keyCode == 89 || e.keyCode == 121)  // Y, y

        
    // Shading mode
    if (e.keyCode == 65 || e.keyCode == 97)  // A, a

    // Illumination calculation
    if (e.keyCode == 83 || e.keyCode == 115)  // S, s
    
    // Turn directional light on/off
    if (e.keyCode == 90 || e.keyCode == 122)  // Z, z

    if (e.keyCode == 88 || e.keyCode == 120)  // X, x

    if (e.keyCode == 67 || e.keyCode == 99)  // C, c

    // Turn spotlight on/off
    if (e.keyCode == 68 || e.keyCode == 100)  // D, d

}

function resetUpdateFlags(){
    'use strict';

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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

}

function animate() {
    'use strict';

    chooseCameraMode();

    const deltaClock = clock.getDelta();

    render();

    requestAnimationFrame(animate);
}