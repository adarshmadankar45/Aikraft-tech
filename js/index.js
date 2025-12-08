// Initialize Lucide Icons
lucide.createIcons();

// Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        // Trigger Entrance Animations
        initAnimations();
    }, 1500);
});

// Mobile Menu Function
// Mobile Menu Function
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.classList.contains('translate-x-full');

    if (isOpen) {
        // Open menu
        menu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
    } else {
        // Close menu
        menu.classList.add('translate-x-full');
        document.body.style.overflow = 'auto';
        document.body.classList.remove('menu-open');
    }

    // Re-initialize icons after menu toggle
    lucide.createIcons();
}

// Close mobile menu when clicking on links
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
    });
});

// Close mobile menu when pressing escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('mobile-menu');
        if (!menu.classList.contains('translate-x-full')) {
            toggleMobileMenu();
        }
    }
});

// Close mobile menu when clicking outside (on the backdrop)
document.getElementById('mobile-menu').addEventListener('click', (e) => {
    if (e.target.id === 'mobile-menu') {
        toggleMobileMenu();
    }
});

// Enhanced resize handler for Three.js
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 250); // Debounce resize events
});

// Disable tilt effect on mobile for better performance
if (window.innerWidth <= 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.style.transform = 'none';
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
    });
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
    // Hero Reveal
    gsap.from('.gs-reveal', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Section Headers
    gsap.utils.toArray('section').forEach(section => {
        const heading = section.querySelectorAll('h2, h3');
        if(heading.length) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });

    // Reveal Left
    gsap.utils.toArray('.gs-reveal-left').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Reveal Right
    gsap.utils.toArray('.gs-reveal-right').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Reveal Up Stagger
    gsap.utils.toArray('.gs-reveal-up').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

// 3D Tilt Effect for Cards (only enable on desktop)
if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// THREE.JS BACKGROUND (Structural Tech/Network)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const container = document.getElementById('canvas-container');
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create a geometric tech shape (Icosahedron wireframe)
const geometry = new THREE.IcosahedronGeometry(10, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x06B6D4,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Add connecting nodes (particles but structured)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 45; // Spread
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x3B82F6,
    transparent: true,
    opacity: 0.6,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

camera.position.z = 20;

// Mouse Interaction & Rotation Logic
let mouseX = 0;
let mouseY = 0;

// Rotation variables
let baseRotationSpeed = 0.002;
let rotationSpeed = baseRotationSpeed;
let isMoving = false;
let moveTimeout;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

    // Mouse is moving, speed up rotation
    isMoving = true;
    rotationSpeed = 0.02; // "Slowly fast" speed

    // Clear previous timeout
    if(moveTimeout) clearTimeout(moveTimeout);

    // Set a timeout to detect when mouse stops
    moveTimeout = setTimeout(() => {
        isMoving = false;
    }, 100);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Smoothly interpolate rotation speed
    // If moving, we are at 0.02. If stopped, lerp back to 0.002
    if (!isMoving) {
        rotationSpeed = THREE.MathUtils.lerp(rotationSpeed, baseRotationSpeed, 0.05);
    }

    // Apply rotation
    sphere.rotation.y += rotationSpeed;
    sphere.rotation.x += rotationSpeed * 0.5;

    // Particles rotate slightly slower/opposite for depth
    particlesMesh.rotation.y = -elapsedTime * 0.05;

    // Subtle tilt based on mouse position (still kept for depth)
    sphere.rotation.x += (mouseY * 0.0001);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg');
        nav.style.background = 'rgba(5, 11, 20, 0.9)';
    } else {
        nav.classList.remove('shadow-lg');
        nav.style.background = 'rgba(5, 11, 20, 0.7)';
    }
});

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Only trigger if the click wasn't on a link
        if (!e.target.closest('a')) {
            const projectLink = card.querySelector('a');
            if (projectLink) {
                window.open(projectLink.href, '_blank');
            }
        }
    });
});

// Portfolio icon interactions
document.querySelectorAll('.portfolio-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering card click
        const portfolioLink = icon.closest('a').href;
        window.open(portfolioLink, '_blank');
    });
});
// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact form');
    const emailModal = document.getElementById('email-modal');
    const closeModal = document.getElementById('close-modal');
    const copyEmailBtn = document.getElementById('copy-email');
    const openEmailBtn = document.getElementById('open-email');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const firstName = formData.get('firstName') || document.querySelector('input[type="text"]:first-of-type').value;
            const lastName = formData.get('lastName') || document.querySelectorAll('input[type="text"]')[1].value;
            const email = formData.get('email') || document.querySelector('input[type="email"]').value;
            const message = formData.get('message') || document.querySelector('textarea').value;

            // Store form data for email
            window.formData = {
                firstName,
                lastName,
                email,
                message,
                subject: `New Contact Form Submission from ${firstName} ${lastName}`,
                body: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`
            };

            // Show modal
            emailModal.classList.remove('hidden');
            emailModal.classList.add('flex');
            document.body.style.overflow = 'hidden';

            // Re-initialize icons in modal
            lucide.createIcons();
        });
    }

    // Close modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', closeEmailModal);
    }

    // Close modal when clicking outside
    if (emailModal) {
        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                closeEmailModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !emailModal.classList.contains('hidden')) {
            closeEmailModal();
        }
    });

    // Copy email functionality
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function() {
            const email = 'aikrafttechnologies@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                // Show success feedback
                const originalText = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Copied!';
                copyEmailBtn.style.background = '#10b981';
                copyEmailBtn.style.borderColor = '#10b981';
                copyEmailBtn.style.color = 'white';

                // Re-initialize icon
                lucide.createIcons();

                // Reset after 2 seconds
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalText;
                    copyEmailBtn.style.background = '';
                    copyEmailBtn.style.borderColor = '';
                    copyEmailBtn.style.color = '';
                    lucide.createIcons();
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
                alert('Failed to copy email address. Please copy it manually: aikrafttechnologies@gmail.com');
            });
        });
    }

    // Open email client functionality
    if (openEmailBtn) {
        openEmailBtn.addEventListener('click', function() {
            const email = 'aikrafttechnologies@gmail.com';
            const subject = window.formData?.subject || 'Contact Form Submission';
            const body = window.formData?.body || 'I would like to get in touch with you.';

            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, '_blank');
        });
    }

    function closeEmailModal() {
        emailModal.classList.add('hidden');
        emailModal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
});

// Update the existing form submission handler to prevent default behavior
document.querySelector('#contact form')?.addEventListener('submit', function(e) {
    e.preventDefault();
});