/**
 * Bird Cursor System - Standalone JavaScript Implementation
 * A complete bird cursor system with physics, animations, and theming
 */

class BirdCursorSystem {
    constructor() {
        this.birdElement = null;
        this.containerElement = null;
        
        // Physics properties
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        
        // Physics configuration
        this.config = {
            springStrength: 0.12,
            dampening: 0.85,
            maxSpeed: 15,
            accelerationRate: 0.2,
            flappingThreshold: 1.5,
            baseScale: 0.45
        };
        
        // Animation state
        this.animationState = {
            isFlapping: false,
            flapIntensity: 1,
            direction: 1,
            rotation: 0,
            pitchRotation: 0,
            scale: this.config.baseScale
        };
        
        // Frame management
        this.animationFrame = null;
        this.isInitialized = false;
        
        // Theme system
        this.themes = {
            robin: {
                bodyGradient: 'linear-gradient(160deg, #8B4513 0%, #A0522D 30%, #CD853F 70%, #DEB887 100%)',
                breastGradient: 'linear-gradient(160deg, #FF8C00 0%, #FF4500 30%, #FF6347 100%)',
                headGradient: 'linear-gradient(160deg, #8B4513 0%, #A0522D 100%)'
            },
            bluebird: {
                bodyGradient: 'linear-gradient(160deg, #4682B4 0%, #5F9EA0 30%, #87CEEB 70%, #B0E0E6 100%)',
                breastGradient: 'linear-gradient(160deg, #87CEEB 0%, #4682B4 30%, #1E90FF 100%)',
                headGradient: 'linear-gradient(160deg, #4682B4 0%, #1E90FF 100%)'
            },
            cardinal: {
                bodyGradient: 'linear-gradient(160deg, #DC143C 0%, #B22222 30%, #FF0000 70%, #FF6347 100%)',
                breastGradient: 'linear-gradient(160deg, #FF0000 0%, #DC143C 30%, #B22222 100%)',
                headGradient: 'linear-gradient(160deg, #8B0000 0%, #DC143C 100%)'
            }
        };
        
        // Presets
        this.presets = {
            energetic: {
                springStrength: 0.18,
                dampening: 0.8,
                maxSpeed: 20,
                accelerationRate: 0.3,
                flappingThreshold: 1.0,
                baseScale: 0.5
            },
            gentle: {
                springStrength: 0.08,
                dampening: 0.9,
                maxSpeed: 10,
                accelerationRate: 0.15,
                flappingThreshold: 2.0,
                baseScale: 0.4
            },
            balanced: {
                springStrength: 0.12,
                dampening: 0.85,
                maxSpeed: 15,
                accelerationRate: 0.2,
                flappingThreshold: 1.5,
                baseScale: 0.45
            }
        };
    }
    
    /**
     * Initialize the bird cursor system
     */
    init() {
        if (this.isInitialized) {
            return;
        }
        
        this.birdElement = document.getElementById('birdCursor');
        this.containerElement = this.birdElement?.querySelector('.bird-container');
        
        if (!this.birdElement || !this.containerElement) {
            console.error('Bird cursor elements not found');
            return;
        }
        
        this.setupEventListeners();
        this.startAnimation();
        this.isInitialized = true;
        
        console.log('Bird cursor system initialized');
    }
    
    /**
     * Set up event listeners for mouse movement
     */
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;
        });
        
        // Initialize position to center of screen
        this.position.x = window.innerWidth / 2;
        this.position.y = window.innerHeight / 2;
        this.target.x = this.position.x;
        this.target.y = this.position.y;
    }
    
    /**
     * Start the animation loop
     */
    startAnimation() {
        const animate = () => {
            this.updatePhysics();
            this.updateAnimation();
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Update physics calculations
     */
    updatePhysics() {
        // Calculate desired direction
        const dx = this.target.x - this.position.x;
        const dy = this.target.y - this.position.y;
        
        // Gradually adjust acceleration
        this.acceleration.x += (dx * this.config.accelerationRate - this.acceleration.x) * 0.1;
        this.acceleration.y += (dy * this.config.accelerationRate - this.acceleration.y) * 0.1;
        
        // Update velocity with spring physics and dampening
        this.velocity.x += this.acceleration.x * this.config.springStrength;
        this.velocity.y += this.acceleration.y * this.config.springStrength;
        
        // Apply dampening
        this.velocity.x *= this.config.dampening;
        this.velocity.y *= this.config.dampening;
        
        // Limit maximum speed
        const currentSpeed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (currentSpeed > this.config.maxSpeed) {
            const scale = this.config.maxSpeed / currentSpeed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
        
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Calculate velocity magnitude for animation triggers
        const velocityMagnitude = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        
        // Determine direction based on horizontal velocity
        if (Math.abs(this.velocity.x) > 0.1) {
            this.animationState.direction = this.velocity.x > 0 ? 1 : -1;
        }
        
        // Update flapping state
        this.updateFlapping(velocityMagnitude);
        
        // Update scale based on velocity
        const dynamicScale = Math.max(0.9, 1 - (velocityMagnitude * 0.001));
        this.animationState.scale = this.config.baseScale * dynamicScale;
    }
    
    /**
     * Update flapping animation based on velocity
     */
    updateFlapping(velocity) {
        if (velocity > this.config.flappingThreshold) {
            this.animationState.isFlapping = true;
            this.animationState.flapIntensity = Math.min(1.5, velocity / this.config.flappingThreshold);
        } else {
            // Add a small delay before stopping flapping
            setTimeout(() => {
                if (velocity <= this.config.flappingThreshold) {
                    this.animationState.isFlapping = false;
                    this.animationState.flapIntensity = 1;
                }
            }, 150);
        }
    }
    
    /**
     * Update animation state
     */
    updateAnimation() {
        // Update flapping class
        if (this.animationState.isFlapping) {
            this.containerElement.classList.add('flapping');
        } else {
            this.containerElement.classList.remove('flapping');
        }
        
        // Update animation duration based on flap intensity
        if (this.animationState.isFlapping) {
            this.birdElement.style.animationDuration = `${0.8 / this.animationState.flapIntensity}s`;
        }
    }
    
    /**
     * Render the bird cursor
     */
    render() {
        if (!this.birdElement || !this.containerElement) {
            return;
        }
        
        // Update position
        this.birdElement.style.left = `${this.position.x}px`;
        this.birdElement.style.top = `${this.position.y}px`;
        this.birdElement.style.transform = 'translate(-50%, -50%)';
        
        // Update bird container transform
        const transform = `scaleX(${this.animationState.direction}) ` +
                         `rotate(${this.animationState.rotation}deg) ` +
                         `rotateX(${this.animationState.pitchRotation}deg) ` +
                         `scale(${this.animationState.scale})`;
        
        this.containerElement.style.transform = transform;
    }
    
    /**
     * Set a preset configuration
     */
    setPreset(presetName) {
        if (this.presets[presetName]) {
            Object.assign(this.config, this.presets[presetName]);
            console.log(`Applied preset: ${presetName}`);
        } else {
            console.warn(`Preset '${presetName}' not found`);
        }
    }
    
    /**
     * Set bird theme
     */
    setTheme(themeName) {
        if (!this.containerElement) {
            return;
        }
        
        // Remove existing theme classes
        Object.keys(this.themes).forEach(theme => {
            this.containerElement.classList.remove(theme);
        });
        
        if (this.themes[themeName]) {
            this.containerElement.classList.add(themeName);
            console.log(`Applied theme: ${themeName}`);
        } else {
            console.warn(`Theme '${themeName}' not found`);
        }
    }
    
    /**
     * Update physics configuration
     */
    updatePhysicsConfig(newConfig) {
        Object.assign(this.config, newConfig);
    }
    
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * Destroy the bird cursor system
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.isInitialized = false;
        console.log('Bird cursor system destroyed');
    }
}

// Global instance
const BirdCursor = new BirdCursorSystem();

// Expose to global scope for easy access
window.BirdCursor = BirdCursor;

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BirdCursor.init());
} else {
    BirdCursor.init();
}

// UI Controls Integration
BirdCursor.updatePhysics = function() {
    const springStrength = parseFloat(document.getElementById('springStrength').value);
    const maxSpeed = parseFloat(document.getElementById('maxSpeed').value);
    const scale = parseFloat(document.getElementById('scale').value);
    
    BirdCursor.updatePhysicsConfig({
        springStrength: springStrength,
        maxSpeed: maxSpeed,
        baseScale: scale
    });
    
    // Update display values
    document.getElementById('springValue').textContent = springStrength;
    document.getElementById('speedValue').textContent = maxSpeed;
    document.getElementById('scaleValue').textContent = scale;
};

BirdCursor.updateScale = function() {
    const scale = parseFloat(document.getElementById('scale').value);
    BirdCursor.updatePhysicsConfig({ baseScale: scale });
    document.getElementById('scaleValue').textContent = scale;
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BirdCursorSystem;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
    window.BirdCursorSystem = BirdCursorSystem;
}