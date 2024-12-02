document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('image-container');
    const image = document.getElementById('zoomable-image');
    
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let start = { x: 0, y: 0 };
    
    function setTransform() {
        image.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    // Function to fit image to screen
    function fitImageToScreen() {
        if (!image.naturalWidth) return; // Skip if image hasn't loaded

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        // Calculate scale to fit both width and height
        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        scale = Math.min(scaleX, scaleY) * 0.95; // 95% of fit to ensure it's visible

        // Center the image
        pointX = (containerWidth - (imageWidth * scale)) / 2;
        pointY = (containerHeight - (imageHeight * scale)) / 2;

        setTransform();
    }

    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        // Get mouse position relative to container
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Get mouse position relative to image
        const imageX = (mouseX - pointX) / scale;
        const imageY = (mouseY - pointY) / scale;

        // Calculate new scale
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * zoomFactor;
        scale = Math.min(Math.max(0.1, newScale), 10);

        // Calculate new position to zoom at cursor
        pointX = mouseX - imageX * scale;
        pointY = mouseY - imageY * scale;

        setTransform();
    });

    // Mouse drag
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    });

    container.addEventListener('mousemove', (e) => {
        e.preventDefault();
        if (!panning) return;
        pointX = e.clientX - start.x;
        pointY = e.clientY - start.y;
        setTransform();
    });

    container.addEventListener('mouseup', () => {
        panning = false;
    });

    // Touch events for mobile
    let lastDistance = 0;
    let initialScale = 1;
    let lastCenter = { x: 0, y: 0 };

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            // Get initial distance between two fingers
            lastDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = scale;

            // Calculate initial center point
            lastCenter = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            // Calculate new distance
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            
            // Calculate center point between fingers
            const center = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2
            };

            // Get touch point relative to image
            const rect = container.getBoundingClientRect();
            const touchX = center.x - rect.left;
            const touchY = center.y - rect.top;

            // Get touch position relative to image
            const imageX = (touchX - pointX) / scale;
            const imageY = (touchY - pointY) / scale;
            
            // Calculate new scale
            const newScale = initialScale * (distance / lastDistance);
            scale = Math.min(Math.max(0.1, newScale), 10);
            
            // Update position to zoom at touch point
            pointX = touchX - imageX * scale;
            pointY = touchY - imageY * scale;
            
            setTransform();
        } else if (e.touches.length === 1) {
            // Single finger pan
            const touch = e.touches[0];
            if (!start.x) {
                start.x = touch.clientX - pointX;
                start.y = touch.clientY - pointY;
            }
            pointX = touch.clientX - start.x;
            pointY = touch.clientY - start.y;
            setTransform();
        }
    });

    container.addEventListener('touchend', () => {
        start = { x: 0, y: 0 };
        lastDistance = 0;
        lastCenter = { x: 0, y: 0 };
    });

    // Prevent default touch behaviors
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize image position to fit screen
    if (image.complete) {
        fitImageToScreen();
    }
    
    image.addEventListener('load', fitImageToScreen);
    window.addEventListener('resize', fitImageToScreen);
});
