export function windowResizeHandler (imageCloud) {

    imageCloud.camera.aspect = window.innerWidth / window.innerHeight;
    imageCloud.camera.updateProjectionMatrix();
    imageCloud.renderer.setSize(window.innerWidth, window.innerHeight);
    imageCloud.controls.handleResize();
}

export function windowMouseMoveHandler (event, imageCloud) {

    imageCloud.mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
    imageCloud.mouse.y = - (event.clientY/window.innerHeight) * 2 + 1;

    imageCloud.mouseX = event.clientX;
    imageCloud.mouseY = event.clientY;

}