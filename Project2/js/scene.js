/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var material, geometry, mesh;

var clock;

var usingFixedOrthogonalCamera, usingFixedPerspectiveCamera, usingRocketPerspectiveCamera;

const earthRadius = 50;

const spaceRadius = 1.2 * earthRadius;

const rocketLength = earthRadius / 11;

var decreaseLat, decreaseLong;

var increaseLat, increaseLong;

var rocketLat, rocketLong; // Should it still move after we leave the key up?

var object1, object2;

var quadrants;

function getRandomSize(min, max) {
    'use strict';
    return Math.random() * (max - min + 0.0001) + min + 0.0001;
}

function getRandomAngle() {
    return Math.random() * 2 * Math.PI;
}

function convertFromSpherical(radius, lat, long) {
    const n = Math.sin(lat) * radius;
    return new THREE.Vector3(n * Math.sin(long), Math.cos(lat)* radius, n * Math.cos(long));
}

function setPosition(meshOrObject, lat, long){
    var vec = convertFromSpherical(spaceRadius, lat, long);
    meshOrObject.position.set(vec.x, vec.y, vec.z);
}

function findQuadrant(lat, long) {
    if (0 <= lat && lat < Math.PI / 2){
        if (- Math.PI <= long && long < 0)
            return 0;
        else
            return 1;
    }
    else{
        if (- Math.PI <= long && long < 0)
            return 2;
        else
            return 3;
    }
}

function addToQuadrant(lat, long, radius) {
    quadrants[findQuadrant(lat, long)].push([convertFromSpherical(radius, lat, long), radius, false]);
}

// Assuming there is only one collision
function detectCollision(deltaLat, deltaLong) {
    /*var quadrant = quadrants[findQuadrant(rocketLat, rocketLong)];
    for (var i = 0; i < quadrant.length; ++i)
        var dist = convertFromSpherical(spaceRadius, rocketLat + deltaLat, rocketLong + deltaLong).distanceTo(quadrant[i][0]);
        console.log(rocketLength);
        console.log(quadrant[i]);
        const radiiSum = rocketLength + quadrant[i][1];
        if (dist <= radiiSum){
            quadrant[i][2] = true;
            return convertFromSpherical(spaceRadius, rocketLat + deltaLat, rocketLong + deltaLong).sub(quadrant[i][0]) * quadrant[i][1] / rocketLength
        }
    */
    return new THREE.Vector3(0, 0, 0);
}

function removeDebris() {
    var quadrant = quadrants[findQuadrant(rocketLat, rocketLong)];
    for (var i = 0; i < quadrant.length; i++)
        if (quadrant[i][2])
            quadrant.splice(i, 1);
}

function createSphere() {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'blue'})
    geometry = new THREE.SphereGeometry(earthRadius, 16, 16);
    mesh = new THREE.Mesh(geometry, material);
    
    object1.add(mesh);
}

function createCube() {
    'use strict';

    const size = getRandomSize(earthRadius/(24*Math.sqrt(3)), earthRadius/(20*Math.sqrt(3)));
    material = new THREE.MeshBasicMaterial({ color: 'green'});
    geometry = new THREE.BoxGeometry(size, size, size);
    mesh = new THREE.Mesh(geometry, material);

    const lat = getRandomAngle() / 2;
    const long = getRandomAngle();

    addToQuadrant(lat, long, size*Math.sqrt(3));
    setPosition(mesh, lat, long);
    
    console.log(lat, long);

    object1.add(mesh);
}

function createCone() {
    'use strict';

    const size = getRandomSize(earthRadius/24, earthRadius/20);
    material = new THREE.MeshBasicMaterial({color: 'red'})
    geometry = new THREE.ConeGeometry(size/2, size, 8);
    mesh = new THREE.Mesh(geometry, material);
    
    const lat = getRandomAngle() / 2;
    const long = getRandomAngle();

    addToQuadrant(lat, long, size);
    setPosition(mesh, lat, long);

    console.log(lat, long);

    object1.add(mesh);
}

function createParallelepiped(length, width, height, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'yellow'})
    geometry = new THREE.BoxGeometry(length, width, height);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    object2.add(mesh);

}

function createCapsule(radius, length, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({color: 'red'})
    geometry = new THREE.CapsuleGeometry(radius, length, x, y, z);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    object2.add(mesh);

}

function createRocket() {
    'use strict';



    createParallelepiped(rocketLength / 2, (3/4) * rocketLength, rocketLength / 2, 0, 0, 0);
    createParallelepiped(rocketLength / 4, rocketLength / 4, rocketLength / 4, 0, rocketLength / 2, 0);
    createCapsule(rocketLength / 8, (3/8) * rocketLength, - (3/8) * rocketLength, - rocketLength / 4, 19);
    createCapsule(30, 30, (3/8) * rocketLength, - rocketLength / 4, 19);
    //createCapsule(/* Add parameters */);
    //createCapsule(/* Add parameters */);
    //createCapsule(/* Add parameters */);
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    //scene.add(new THREE.AxisHelper(50));
    
    object1 = new THREE.Object3D();
    object2 = new THREE.Object3D();

    for (var i = 0; i < 7; ++i) { // The debris cannot be overlapped
        createCube();
        createCone();
    }

    // Create Earth
    createSphere();

    // Create Rocket
    createRocket();

    // Initial latitute and longitude
    rocketLat = getRandomAngle() / 2;
    rocketLong = getRandomAngle();
    
    setPosition(object2, rocketLat, rocketLong);

    object1.add(object2);
    scene.add(object1);
}

function useFixedOrthogonalCamera() {
    'use strict';

    camera = new THREE.OrthographicCamera(-window.innerWidth / 10,
                                          window.innerWidth / 10,
                                          window.innerHeight / 10,
                                          -window.innerHeight / 10,
                                          -1000,
                                          1000);

    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useFixedPerspectiveCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(60,
                                          window.innerWidth/window.innerHeight,
                                          1,
                                          1000);
    // TODO
    camera.position.set(0, 0, 125);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function useRocketPerspectiveCamera() {
    'use strict';

    // TODO
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
        usingFixedOrthogonalCamera = true;
        usingFixedPerspectiveCamera = false;
        usingRocketPerspectiveCamera = false;
    }
    else if (e.keyCode == 50) {  // 2
        usingFixedOrthogonalCamera = false;
        usingFixedPerspectiveCamera = true;
        usingRocketPerspectiveCamera = false;
    }
    else if (e.keyCode == 51) {  // 3
        usingFixedOrthogonalCamera = false;
        usingFixedPerspectiveCamera = false;
        usingRocketPerspectiveCamera = true;
    }

    // Change object's latitude and longitude

    if (e.keyCode == 37)  // Arrow left
        decreaseLong = true;

    if (e.keyCode == 39)  // Arrow right
        increaseLong = true;

    if (e.keyCode == 40)  // Arrow down
        increaseLat = true;

    if (e.keyCode == 38)  // Arrow up
        decreaseLat = true;
}

function onKeyUp(e) {
    'use strict';

    if (e.keyCode == 37)  // Arrow left
        decreaseLong = false;

    if (e.keyCode == 39)  // Arrow right
        increaseLong = false;

    if (e.keyCode == 40)  // Arrow down
        increaseLat = false;

    if (e.keyCode == 38)  // Arrow up
        decreaseLat = false;
}

function resetUpdateFlags(){
    'use strict';

    decreaseLat = false;   increaseLat = false;
    decreaseLong = false;  increaseLong = false;
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

    quadrants = [[], [], [], []];
    createScene();
    resetUpdateFlags();
    useFixedOrthogonalCamera();
    usingFixedOrthogonalCamera = true;

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function chooseCameraMode(){
    'use strict';

    if (usingFixedOrthogonalCamera)
        useFixedOrthogonalCamera();
    else if (usingFixedPerspectiveCamera)
        useFixedPerspectiveCamera();
    else if (usingRocketPerspectiveCamera)
        useRocketPerspectiveCamera();
}

function animate() {
    'use strict';

    chooseCameraMode();
    
    const deltaClock = clock.getDelta();
    const deltaAngle = Math.PI * deltaClock / 10; 

    const deltaRocketLat = (increaseLat - decreaseLat);
    const deltaRocketLong = (increaseLong - decreaseLong);
    const norm = Math.sqrt(deltaRocketLat ** 2 + deltaRocketLong ** 2); 

    if (norm > 0) {
        rocketLat = (rocketLat + deltaRocketLat * deltaAngle / norm);
        rocketLong = (rocketLong + deltaRocketLong * deltaAngle / norm) % Math.PI;

        if (rocketLat < 0)
            rocketLat = 0;
        
        else if (rocketLat > Math.PI)
            rocketLat = Math.PI;

    }

    setPosition(object2, rocketLat, rocketLong);

    if (norm > 0)
        object2.position.sub(detectCollision(deltaRocketLat * deltaAngle / norm, deltaRocketLong * deltaAngle / norm));

    render();

    requestAnimationFrame(animate);
}