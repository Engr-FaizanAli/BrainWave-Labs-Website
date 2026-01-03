/* ===========================
   BRAINWAVE LABS - MAIN JAVASCRIPT
   Single source of truth for all behavior
   =========================== */

// ===========================
// CONFIGURATION
// ===========================

const IMAGES = {
    meeting: "images/meeting-analyzer.jpg",
    sql: "images/sql-generator.jpg",
    enterpriseRag: "images/enterprise-rag.jpg",
    iits: "images/iits-simulator.jpg",
    logistics: "images/fleet-logistics.jpg",
    militaryRag: "images/military-rag.jpg"
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

function setBackgroundImage(elementId, imageSrc) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.style.backgroundImage = `url('${imageSrc}')`;
}

function initializeProjectImages() {
    setBackgroundImage("img-meeting", IMAGES.meeting);
    setBackgroundImage("img-sql", IMAGES.sql);
    setBackgroundImage("img-enterprise-rag", IMAGES.enterpriseRag);
    setBackgroundImage("img-iits", IMAGES.iits);
    setBackgroundImage("img-logistics", IMAGES.logistics);
    setBackgroundImage("img-military-rag", IMAGES.militaryRag);
}

// ===========================
// LIGHTBOX
// ===========================

function openLightbox(element) {
    const bg = element.style.backgroundImage;
    const url = bg.slice(5, -2); // Extract URL from url("...")
    const img = document.getElementById("lightbox-img");
    const lightbox = document.getElementById("lightbox");

    if (img && lightbox) {
        img.src = url;
        lightbox.classList.add("active");
    }
}

function closeLightbox(event) {
    const lightbox = document.getElementById("lightbox");
    if (event.target.id === "lightbox" || event.target.className.includes("lightbox-close")) {
        lightbox.classList.remove("active");
    }
}

function initializeLightbox() {
    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const lightbox = document.getElementById("lightbox");
            if (lightbox) {
                lightbox.classList.remove("active");
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
