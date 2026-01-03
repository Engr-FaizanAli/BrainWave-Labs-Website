/* ===========================
   BRAINWAVE LABS - MAIN JAVASCRIPT
   Single source of truth for all behavior
   =========================== */

// ===========================
// CONFIGURATION
// ===========================

const IMAGES = {
    meeting: ["images/meeting-analyzer.jpg"],
    hospital: ["images/hospital.jpg", "images/hospital1.jpg"],
    sql: ["images/sql-generator.jpg"],
    enterpriseRag: ["images/enterprise-rag.jpg"],

    iits: ["images/iits-simulator.jpg"],
    logistics: ["images/fleet-logistics.jpg"],
    militaryRag: ["images/military-rag.jpg"]
};

// Track current image index for each project
const currentImageIndex = {
    meeting: 0,
    hospital: 0,
    sql: 0,
    enterpriseRag: 0,
    iits: 0,
    logistics: 0,
    militaryRag: 0
};

const CLIENT_LOGOS = {
    saas: [
        "images/clients/saas/client1.png",
        "images/clients/saas/client2.png",
        "images/clients/saas/client3.png"
    ],
    defense: [
        "images/clients/defense/client1.png",
        "images/clients/defense/client2.png"
    ]
};

// ===========================
// PROJECT IMAGE SETUP
// ===========================

function setBackgroundImage(elementId, imageArray, projectKey) {
    const element = document.getElementById(elementId);
    if (!element || !imageArray || imageArray.length === 0) return;

    // Set the first image
    const currentIndex = currentImageIndex[projectKey];
    element.style.backgroundImage = `url('${imageArray[currentIndex]}')`;

    // Store project key in element for navigation
    element.dataset.projectKey = projectKey;

    // Add navigation arrows if there are multiple images
    if (imageArray.length > 1) {
        addNavigationArrows(element, projectKey);
    }
}

function addNavigationArrows(element, projectKey) {
    // Check if arrows already exist
    if (element.querySelector('.image-nav')) return;

    const navContainer = document.createElement('div');
    navContainer.className = 'image-nav';

    const leftArrow = document.createElement('button');
    leftArrow.className = 'image-nav-arrow image-nav-left';
    leftArrow.innerHTML = '‹';
    leftArrow.onclick = (e) => {
        e.stopPropagation();
        navigateImage(projectKey, -1);
    };

    const rightArrow = document.createElement('button');
    rightArrow.className = 'image-nav-arrow image-nav-right';
    rightArrow.innerHTML = '›';
    rightArrow.onclick = (e) => {
        e.stopPropagation();
        navigateImage(projectKey, 1);
    };

    navContainer.appendChild(leftArrow);
    navContainer.appendChild(rightArrow);
    element.appendChild(navContainer);
}

function navigateImage(projectKey, direction) {
    const images = IMAGES[projectKey];
    if (!images || images.length <= 1) return;

    // Update index
    currentImageIndex[projectKey] = (currentImageIndex[projectKey] + direction + images.length) % images.length;

    // Update thumbnail
    const elementId = getElementIdFromProjectKey(projectKey);
    const element = document.getElementById(elementId);
    if (element) {
        element.style.backgroundImage = `url('${images[currentImageIndex[projectKey]]}')`;
    }

    // Update lightbox if open
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg && lightboxImg.dataset.projectKey === projectKey) {
            lightboxImg.src = images[currentImageIndex[projectKey]];
        }
    }
}

function getElementIdFromProjectKey(projectKey) {
    const mapping = {
        meeting: 'img-meeting',
        hospital: 'img-hospital',
        sql: 'img-sql',
        enterpriseRag: 'img-enterprise-rag',
        iits: 'img-iits',
        logistics: 'img-logistics',
        militaryRag: 'img-military-rag'
    };
    return mapping[projectKey];
}

function initializeProjectImages() {
    setBackgroundImage("img-meeting", IMAGES.meeting, "meeting");
    setBackgroundImage("img-hospital", IMAGES.hospital, "hospital");
    setBackgroundImage("img-sql", IMAGES.sql, "sql");
    setBackgroundImage("img-enterprise-rag", IMAGES.enterpriseRag, "enterpriseRag");
    setBackgroundImage("img-iits", IMAGES.iits, "iits");
    setBackgroundImage("img-logistics", IMAGES.logistics, "logistics");
    setBackgroundImage("img-military-rag", IMAGES.militaryRag, "militaryRag");
}

// ===========================
// LIGHTBOX
// ===========================

function openLightbox(element) {
    const projectKey = element.dataset.projectKey;
    const images = IMAGES[projectKey];
    if (!images || images.length === 0) return;

    const img = document.getElementById("lightbox-img");
    const lightbox = document.getElementById("lightbox");

    if (img && lightbox) {
        const currentIndex = currentImageIndex[projectKey];
        img.src = images[currentIndex];
        img.dataset.projectKey = projectKey;
        lightbox.classList.add("active");

        // Show/hide lightbox navigation arrows
        const leftArrow = document.getElementById("lightbox-nav-left");
        const rightArrow = document.getElementById("lightbox-nav-right");

        if (images.length > 1) {
            if (leftArrow) leftArrow.style.display = 'block';
            if (rightArrow) rightArrow.style.display = 'block';
        } else {
            if (leftArrow) leftArrow.style.display = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
        }
    }
}

function closeLightbox(event) {
    const lightbox = document.getElementById("lightbox");
    if (event.target.id === "lightbox" || event.target.className.includes("lightbox-close")) {
        lightbox.classList.remove("active");
    }
}

function navigateLightbox(direction) {
    const img = document.getElementById("lightbox-img");
    if (!img) return;

    const projectKey = img.dataset.projectKey;
    if (!projectKey) return;

    navigateImage(projectKey, direction);
}

function initializeLightbox() {
    // Add navigation arrows to lightbox
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        // Create left arrow
        const leftArrow = document.createElement('button');
        leftArrow.id = 'lightbox-nav-left';
        leftArrow.className = 'lightbox-nav-arrow lightbox-nav-left';
        leftArrow.innerHTML = '‹';
        leftArrow.onclick = (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        };

        // Create right arrow
        const rightArrow = document.createElement('button');
        rightArrow.id = 'lightbox-nav-right';
        rightArrow.className = 'lightbox-nav-arrow lightbox-nav-right';
        rightArrow.innerHTML = '›';
        rightArrow.onclick = (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        };

        lightbox.appendChild(leftArrow);
        lightbox.appendChild(rightArrow);
    }

    // Close on Escape key, navigate with arrow keys
    document.addEventListener("keydown", (e) => {
        const lightbox = document.getElementById("lightbox");
        if (!lightbox) return;

        if (e.key === "Escape") {
            lightbox.classList.remove("active");
        } else if (lightbox.classList.contains("active")) {
            if (e.key === "ArrowLeft") {
                navigateLightbox(-1);
            } else if (e.key === "ArrowRight") {
                navigateLightbox(1);
            }
        }
    });
}

// ===========================
// CLIENTS CAROUSEL
// Consolidated from two duplicate functions
// ===========================

function initializeClientsCarousel(trackId, logos) {
    // Don't initialize if no logos
    if (!logos || logos.length === 0) return;

    const track = document.getElementById(trackId);
    const viewport = track.parentElement;

    if (!track || !viewport) return;

    // Populate track with logos
    logos.forEach(src => {
        const div = document.createElement("div");
        div.className = "client-logo";
        div.style.backgroundImage = `url('${src}')`;
        track.appendChild(div);
    });

    // Duplicate logos for seamless loop (only if more than 1 logo)
    if (logos.length > 1) {
        logos.forEach(src => {
            const div = document.createElement("div");
            div.className = "client-logo";
            div.style.backgroundImage = `url('${src}')`;
            track.appendChild(div);
        });
    }

    // Animation state
    let position = 0;
    let speed = 0.35; // pixels per frame
    let isPaused = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPosition = 0;

    // Animation loop
    function animate() {
        if (!isPaused && !isDragging) {
            position -= speed;

            // Reset position for seamless loop
            const trackWidth = track.scrollWidth / 2;
            if (Math.abs(position) >= trackWidth) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Pause on hover
    viewport.addEventListener("mouseenter", () => {
        isPaused = true;
    });

    viewport.addEventListener("mouseleave", () => {
        if (!isDragging) {
            isPaused = false;
        }
    });

    // Drag support
    viewport.addEventListener("pointerdown", (e) => {
        isDragging = true;
        isPaused = true;
        dragStartX = e.clientX;
        dragStartPosition = position;
        viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        position = dragStartPosition + deltaX;
        track.style.transform = `translateX(${position}px)`;
    });

    viewport.addEventListener("pointerup", (e) => {
        isDragging = false;
        isPaused = false;
        viewport.releasePointerCapture(e.pointerId);
    });

    viewport.addEventListener("pointercancel", (e) => {
        isDragging = false;
        isPaused = false;
        if (e.pointerId !== null) {
            viewport.releasePointerCapture(e.pointerId);
        }
    });
}

// ===========================
// HIDE EMPTY CLIENT SECTIONS
// ===========================

function hideEmptyClientSections() {
    // Hide SaaS section if no logos
    if (!CLIENT_LOGOS.saas || CLIENT_LOGOS.saas.length === 0) {
        const saasTrack = document.getElementById("saas-track");
        if (saasTrack) {
            const saasSection = saasTrack.closest(".clients-section");
            if (saasSection) {
                saasSection.style.display = "none";
            }
        }
    }

    // Hide Defense section if no logos
    if (!CLIENT_LOGOS.defense || CLIENT_LOGOS.defense.length === 0) {
        const defenseTrack = document.getElementById("defense-track");
        if (defenseTrack) {
            const defenseSection = defenseTrack.closest(".clients-section");
            if (defenseSection) {
                defenseSection.style.display = "none";
            }
        }
    }
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize project images (home page only)
    initializeProjectImages();

    // Initialize lightbox (home page only)
    initializeLightbox();

    // Initialize client carousels
    initializeClientsCarousel("saas-track", CLIENT_LOGOS.saas);
    initializeClientsCarousel("defense-track", CLIENT_LOGOS.defense);

    // Hide empty client sections
    hideEmptyClientSections();
});

// ===========================
// EXPOSE FUNCTIONS GLOBALLY
// (needed for onclick handlers)
// ===========================

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
