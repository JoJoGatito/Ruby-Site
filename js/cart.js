/**
 * Cart System Module
 * Handles shopping cart functionality with localStorage persistence
 */

const CartSystem = {
    // Storage key for cart data
    STORAGE_KEY: 'spirited_away_cart',

    // Initialize cart from localStorage or create empty cart
    initCart() {
        const savedCart = localStorage.getItem(this.STORAGE_KEY);
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        return {
            items: {},
            totalItems: 0,
            totalPrice: 0
        };
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },

    // Get current cart contents
    getCart() {
        return this.initCart();
    },

    // Add item to cart
    addItem(item) {
        const cart = this.getCart();
        const { id, name, price, image } = item;

        if (cart.items[id]) {
            cart.items[id].quantity += 1;
        } else {
            cart.items[id] = {
                name,
                price,
                image,
                quantity: 1
            };
        }

        this.updateCartTotals(cart);
        this.saveCart(cart);
        this.updateCartIndicator();
        this.showConfirmation(name);

        return cart;
    },

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const cart = this.getCart();
        
        if (cart.items[itemId]) {
            if (quantity > 0) {
                cart.items[itemId].quantity = quantity;
            } else {
                this.removeItem(itemId);
                return;
            }
        }

        this.updateCartTotals(cart);
        this.saveCart(cart);
        this.updateCartIndicator();
    },

    // Remove item from cart
    removeItem(itemId) {
        const cart = this.getCart();
        
        if (cart.items[itemId]) {
            delete cart.items[itemId];
            this.updateCartTotals(cart);
            this.saveCart(cart);
            this.updateCartIndicator();
        }
    },

    // Clear entire cart
    clearCart() {
        const emptyCart = {
            items: {},
            totalItems: 0,
            totalPrice: 0
        };
        this.saveCart(emptyCart);
        this.updateCartIndicator();
    },

    // Calculate cart totals
    updateCartTotals(cart) {
        cart.totalItems = Object.values(cart.items)
            .reduce((total, item) => total + item.quantity, 0);
        
        cart.totalPrice = Object.values(cart.items)
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Update cart indicator in header
    updateCartIndicator() {
        const cart = this.getCart();
        const indicator = document.querySelector('.cart-count');
        if (indicator) {
            indicator.textContent = cart.totalItems;
            indicator.style.display = cart.totalItems > 0 ? 'block' : 'none';
        }
    },

    // Show confirmation message
    showConfirmation(itemName) {
        const message = document.createElement('div');
        message.className = 'cart-confirmation';
        message.innerHTML = `
            <div class="cart-confirmation-content">
                <p>"${itemName}" added to cart!</p>
            </div>
        `;
        document.body.appendChild(message);

        // Remove message after animation
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }
};

// Export as module
export default CartSystem;