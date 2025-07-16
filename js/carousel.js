/**
 * Featured Art Carousel Module
 * Handles interactive carousel functionality for featured artwork section
 */

class FeaturedArtCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        
        // Navigation elements
        this.prevButton = container.querySelector('.carousel-prev');
        this.nextButton = container.querySelector('.carousel-next');
        
        // Touch gesture properties
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.swipeThreshold = 50;
        
        this.init();
    }
    
    /**
     * Initialize the carousel
     */
    init() {
        this.loadArtwork();
        this.setupEventListeners();
        this.render();
    }
    
    /**
     * Load artwork data and populate items array
     */
    loadArtwork() {
        // Get existing carousel items from DOM
        const carouselItems = this.track.querySelectorAll('.carousel-item');
        
        this.items = Array.from(carouselItems).map((item, index) => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3');
            const link = item.querySelector('a');
            
            return {
                id: index + 1,
                title: title ? title.textContent : `Artwork ${index + 1}`,
                image: img ? img.src : '',
                alt: img ? img.alt : `Artwork ${index + 1}`,
                link: link ? link.href : '#',
                element: item
            };
        });
        
        // Set initial active state
        if (this.items.length > 0) {
            this.items[0].element.classList.add('active');
        }
    }
    
    /**
     * Set up event listeners for navigation and touch gestures
     */
    setupEventListeners() {
        // Navigation button listeners
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previous());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        
        // Touch gesture listeners
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    /**
     * Render the current carousel state
     */
    render() {
        if (this.items.length === 0) return;
        
        // Clear all states
        this.items.forEach(item => {
            item.element.classList.remove('active', 'previous');
        });
        
        // Set active item
        this.items[this.currentIndex].element.classList.add('active');
        
        // Update navigation button states
        this.updateNavigationState();
    }
    
    /**
     * Update navigation button accessibility and visual states
     */
    updateNavigationState() {
        // For looping carousel, buttons are always enabled
        // This method can be extended for additional visual feedback
        if (this.prevButton) {
            this.prevButton.setAttribute('aria-label', 
                `Previous artwork: ${this.items[(this.currentIndex - 1 + this.items.length) % this.items.length].title}`
            );
        }
        
        if (this.nextButton) {
            this.nextButton.setAttribute('aria-label', 
                `Next artwork: ${this.items[(this.currentIndex + 1) % this.items.length].title}`
            );
        }
    }
    
    /**
     * Navigate to next artwork
     */
    next() {
        if (this.isAnimating || this.items.length === 0) return;
        
        // Start transition
        this.isAnimating = true;
        
        // Get current and next items
        const currentItem = this.items[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[this.currentIndex];
        
        // Set up next item first
        nextItem.element.classList.add('next');
        
        // Start transition
        currentItem.element.classList.remove('active');
        currentItem.element.classList.add('previous');
        
        // After transition completes
        setTimeout(() => {
            // Clean up classes
            currentItem.element.classList.remove('previous');
            nextItem.element.classList.remove('next');
            // Activate new item
            nextItem.element.classList.add('active');
            // Clear animation lock after burn animation completes
            this.isAnimating = false;
        }, 1200); // Match the 1.2s burn animation duration (40% faster)
    }
    
    /**
     * Navigate to previous artwork
     */
    previous() {
        if (this.isAnimating || this.items.length === 0) return;
        
        // Start transition
        this.isAnimating = true;
        
        // Get current and previous items
        const currentItem = this.items[this.currentIndex];
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        const prevItem = this.items[this.currentIndex];
        
        // Set up previous item first
        prevItem.element.classList.add('next');
        
        // Start transition
        currentItem.element.classList.remove('active');
        currentItem.element.classList.add('previous');
        
        // After transition completes
        setTimeout(() => {
            // Clean up classes
            currentItem.element.classList.remove('previous');
            prevItem.element.classList.remove('next');
            // Activate new item
            prevItem.element.classList.add('active');
            // Clear animation lock after burn animation completes
            this.isAnimating = false;
        }, 1200); // Match the 1.2s burn animation duration (40% faster)
    }
    
    /**
     * Navigate to specific artwork by index
     */
    goTo(index) {
        if (this.isAnimating || this.items.length === 0) return;
        if (index < 0 || index >= this.items.length) return;
        
        this.currentIndex = index;
        this.render();
    }
    
    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }
    
    /**
     * Handle touch move event
     */
    handleTouchMove(e) {
        // Prevent default scrolling during horizontal swipes
        if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
            e.preventDefault();
        }
    }
    
    /**
     * Handle touch end event
     */
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }
    
    /**
     * Process swipe gesture and trigger navigation
     */
    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        // Debug swipe distance
        console.log('Swipe distance:', swipeDistance);
        
        if (Math.abs(swipeDistance) > this.swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                console.log('Swiping right - previous');
                this.previous();
            } else {
                // Swipe left - go to next
                console.log('Swiping left - next');
                this.next();
            }
        } else {
            console.log('Swipe threshold not met:', this.swipeThreshold);
        }
    }
    
    /**
     * Get current artwork data
     */
    getCurrentArtwork() {
        return this.items[this.currentIndex] || null;
    }
    
    /**
     * Get total number of artworks
     */
    getTotalCount() {
        return this.items.length;
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.featured-artwork .carousel-container');
    if (carouselContainer) {
        window.featuredCarousel = new FeaturedArtCarousel(carouselContainer);
    }
});
