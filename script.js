document.addEventListener('DOMContentLoaded', function() {
    const timelineImage = document.getElementById('timelineImage');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    
    let scale = 1;
    const ZOOM_STEP = 0.2;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;

    // Zoom in button
    zoomInButton.addEventListener('click', function() {
        if (scale < MAX_SCALE) {
            scale += ZOOM_STEP;
            timelineImage.style.transform = `scale(${scale})`;
        }
    });

    // Zoom out button
    zoomOutButton.addEventListener('click', function() {
        if (scale > MIN_SCALE) {
            scale -= ZOOM_STEP;
            timelineImage.style.transform = `scale(${scale})`;
        }
    });
});
