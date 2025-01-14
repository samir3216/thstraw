const sys = document.getElementById('Camera');

sys.style.transform = 'translate(0px, -1000px)';

let time = 0;

var w = window.innerWidth;
var h = window.innerHeight;

let mode = 1;

let frequency = 0.01; // Speed of the oscillation

function updatePosition() {
    const amplitude = 10; // Maximum movement in pixels
    

    // Calculate the new position using the sine function
    const offsetX = Math.sin(time) * amplitude;
    const offsetY = Math.cos(time) * amplitude;

    if (mode == 1) {
        document.body.style.backgroundColor = `rgb(${offsetY + 174}, 216, 2300)`;
        sys.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
    }
    if (mode == 2) {
        frequency = 0.2;
        document.body.style.backgroundColor = `rgb(0, 0, 0)`;
        sys.style.transform = `translateX(${offsetX + 200}px) translateY(${offsetY + 400}px)`;
        sys.style.transform = `rotate(${offsetX + 100}deg)`;
    }
    if (mode == 3) {
        document.body.style.backgroundImage  = `url("https://akamai.sscdn.co/letras/360x360/albuns/f/8/0/c/2219101715612081.jpg")`;
        sys.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
    }

    // Increment the timer
    time += frequency;

    if(time > 13) {
        time = 0;
    } // integer overflow blocking

    requestAnimationFrame(updatePosition);
    
}

setTimeout(function() {
    updatePosition();
  }, 1000);



// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: "red" });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var geometry2 = new THREE.BoxGeometry(1, 1, 1);
var material2 = new THREE.MeshBasicMaterial({ color: "blue" });
var cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube2);
cube2.rotation.z =+ 10;
cube2.position.set(-5, 0, -5);

var planegeometry = new THREE.BoxGeometry(100, 1, 100);
var planematerial = new THREE.MeshBasicMaterial({ color: "white" });
var plane = new THREE.Mesh(planegeometry, planematerial);
scene.add(plane);
plane.position.set(0, -1, 0);

camera.position.z = 4;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isRendering = false;

setTimeout(function() {
    isRendering = true;
    container.imageUrl = "";
    animate(); // Start the animation loop
}, 10000);

function replaceWithImage(imageUrl) {
    // Remove the THREE.js canvas
    container.removeChild(renderer.domElement);
    
    // Create an image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    container.appendChild(img);

    renderer.dispose();
    geometry.dispose();
    material.dispose();
    geometry2.dispose();
    material2.dispose();
    planegeometry.dispose();
    planematerial.dispose();
}

function handleKeyPress(event) {
    if (!isRendering) return;
    
    const key = event.key.toLowerCase();
    switch (key) {
        case 'w':
            const velocity = new THREE.Vector3(0, 0, -0.1);
            velocity.applyQuaternion(camera.quaternion);
            camera.position.add(velocity);
            break;
        case 'a':
            camera.rotation.y += 0.1;
            break;
        case 's':
            const backwardVelocity = new THREE.Vector3(0, 0, 0.1);
            backwardVelocity.applyQuaternion(camera.quaternion);
            camera.position.add(backwardVelocity);
            break;
        case 'd':
            camera.rotation.y -= 0.1;
            break;
        case 'q':
            document.getElementById('ding').play();
            window.open('https://codepen.io/samir3216/pen/bGOwbgO', '_blank');
            document.title = "...";
            break;
    }
}

function onMouseClick(event) {
    if (!isRendering) return;
   
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
   
    raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
    raycaster.ray.direction
        .set(mouse.x, mouse.y, 0.5)
        .unproject(camera)
        .sub(raycaster.ray.origin)
        .normalize();
   
    // Check blue cube (cube2)
    let intersectsCube2 = raycaster.intersectObject(cube2);
    if (intersectsCube2.length > 0) {
        console.log("Blue cube clicked!");
        isRendering = false;
       
        const imageUrl = 'https://media.tenor.com/iq4EysFjtSAAAAAM/homer-homer-simpson.gif';
        replaceWithImage(imageUrl);
       
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('click', onMouseClick);
        cancelAnimationFrame(animationFrameId);
        mode = 2;
        window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0', '_blank');
        document.title = "THE REGGIE CONSPIRACY THEORY";
        return;
    }
    
    // Check red cube (cube)
    let intersectsCube1 = raycaster.intersectObject(cube);
    if (intersectsCube1.length > 0) {
        console.log("Red cube clicked!");
        isRendering = false;
       
        const imageUrl = 'https://media.tenor.com/XDOcj0uAUpsAAAAM/don-pollo-un-video-mas-mi-gente.gif';
        replaceWithImage(imageUrl);
       
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('click', onMouseClick);
        cancelAnimationFrame(animationFrameId);
        document.getElementById('ding').play();
        mode = 3;
        document.title = "Um video ma mi gente";
        return;
    }
}

document.addEventListener('keydown', handleKeyPress);
window.addEventListener('click', onMouseClick, false);

let animationFrameId;

function animate() {
    if (!isRendering) return;
    
    animationFrameId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
