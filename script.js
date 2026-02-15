// ============================================
// PARTICLE ANIMATION SYSTEM
// ============================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        // Responsive particle count based on screen size
        const isMobile = window.innerWidth < 768;
        this.particleCount = isMobile ? 50 : 150; // Much fewer particles on mobile
        this.connectionDistance = isMobile ? 100 : 180; // Shorter connection distance on mobile
        this.seed = 12345; // Fixed seed for consistent pattern
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    // Seeded random number generator for consistent particle positions
    seededRandom() {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        this.seed = 12345; // Reset seed for consistent pattern
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: this.seededRandom() * this.canvas.width,
                y: this.seededRandom() * this.canvas.height,
                vx: (this.seededRandom() - 0.5) * 0.5,
                vy: (this.seededRandom() - 0.5) * 0.5,
                radius: this.seededRandom() * 2.5 + 1.5
            });
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
            this.ctx.fill();
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(167, 139, 250, ${0.4 * (1 - distance / this.connectionDistance)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Mouse interaction - particles move away from cursor
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx += Math.cos(angle) * force * 0.3;
                    particle.vy += Math.sin(angle) * force * 0.3;
                }
            }

            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Friction
            particle.vx *= 0.95;
            particle.vy *= 0.95;

            // Boundary checking
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Random movement
            particle.vx += (Math.random() - 0.5) * 0.05;
            particle.vy += (Math.random() - 0.5) * 0.05;

            // Speed limit
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.connectParticles();
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            // Update particle count and connection distance for new screen size
            const isMobile = window.innerWidth < 768;
            this.particleCount = isMobile ? 50 : 150;
            this.connectionDistance = isMobile ? 100 : 180;
            
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS (Same Page Only)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Skip empty anchors
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// CARD HOVER EFFECTS
// ============================================
const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// FORM SUBMISSION HANDLING
// ============================================
const contactForm = document.querySelector('#contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate inputs
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Disable submit button temporarily
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.style.opacity = '0.6';
        
        // ========================================
        // ⭐ WEB3FORMS SETUP - PASTE YOUR KEY HERE ⭐
        // ========================================
        // STEP 1: Go to https://web3forms.com
        // STEP 2: Enter hello@qtropic.com
        // STEP 3: Get your access key
        // STEP 4: Replace YOUR_ACCESS_KEY_HERE below with your actual key
        // Example: const WEB3FORMS_ACCESS_KEY = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
        // ========================================
        
        const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // <-- PASTE KEY HERE!
        
        // Check if access key is set
        if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
            // Demo mode - no access key provided yet
            setTimeout(() => {
                showNotification(`✅ Demo Mode: Message received from ${name}! To actually send emails, please add your Web3Forms access key in script.js (line 286). Get it free at web3forms.com`, 'success');
                contactForm.reset();
                
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
            }, 1000);
            return; // Stop here in demo mode
        }
        
        const formData = new FormData();
        formData.append('access_key', WEB3FORMS_ACCESS_KEY);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('from_name', 'Qtropic Contact Form');
        formData.append('cc', 'yourgmail@gmail.com'); // Add your Gmail here if you want
        
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success - message sent!
                showNotification(`Thank you, ${name}! Your message has been sent. We'll get back to you at ${email} within 24 hours.`, 'success');
                contactForm.reset();
            } else {
                // Error from Web3Forms
                showNotification('Failed to send message. Please try again or email us directly at hello@qtropic.com', 'error');
            }
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.opacity = '1';
        })
        .catch(error => {
            // Network or other error
            console.error('Form submission error:', error);
            showNotification('Error sending message. Please try again or email us directly at hello@qtropic.com', 'error');
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.style.opacity = '1';
        });
    });

    // Reset border color on input
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#8b5cf6';
        });

        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ============================================
// CTA BUTTON ANIMATION
// ============================================
const ctaButtons = document.querySelectorAll('.cta-button');

ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 35px rgba(139, 92, 246, 0.7)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
    });
});

// ============================================
// INITIALIZE PARTICLE SYSTEM
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// ANIMATED COUNTERS (FOR STATS)
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `© ${currentYear} Qtropic. All rights reserved.`;
}

// ============================================
// PRELOAD OPTIMIZATION
// ============================================
window.addEventListener('load', () => {
    // Add loaded class to body for any load-dependent animations
    document.body.classList.add('loaded');
    
    // Initialize any deferred scripts here
    console.log('Qtropic Portfolio Loaded Successfully');
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}
