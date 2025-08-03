// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: 'iPhone 14 Pro',
        price: 999.99,
        image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c',
        description: 'Latest iPhone with dynamic island and pro camera system'
    },
    {
        id: 2,
        name: 'MacBook Air M2',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9',
        description: 'Powerful laptop with M2 chip and all-day battery life'
    },
    {
        id: 3,
        name: 'Sony WH-1000XM4',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
        description: 'Premium wireless noise-canceling headphones'
    },
    {
        id: 4,
        name: 'Apple Watch Series 8',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d',
        description: 'Advanced health monitoring and fitness tracking'
    },
    {
        id: 5,
        name: 'iPad Air',
        price: 599.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
        description: 'Versatile tablet for work and entertainment'
    },
    {
        id: 6,
        name: 'Samsung Galaxy S23 Ultra',
        price: 1199.99,
        image: 'https://images.unsplash.com/photo-1678911820864-e5c67e784c08',
        description: 'Ultimate Android flagship with S Pen'
    },
    {
        id: 7,
        name: 'Nintendo Switch OLED',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e',
        description: 'Hybrid gaming console with vibrant OLED display'
    },
    {
        id: 8,
        name: 'DJI Mini 3 Pro',
        price: 759.99,
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f',
        description: 'Compact drone with professional camera capabilities'
    },
    {
        id: 9,
        name: 'GoPro HERO11 Black',
        price: 499.99,
        image: 'https://images.unsplash.com/photo-1522273400909-fd1a8f77637e',
        description: 'Advanced action camera for adventure enthusiasts'
    },
    {
        id: 10,
        name: 'Bose QuietComfort Earbuds II',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
        description: 'True wireless earbuds with world-class noise cancellation'
    }
];

// Local Storage Keys
const CART_KEY = 'shopease_cart';

// Initialize cart in local storage
if (!localStorage.getItem(CART_KEY)) {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
}

// Helper Functions
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY));
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Display Products
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${formatPrice(product.price)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('shopease_current_user');
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartUI();
    alert('Product added to cart!');
}

function updateCartUI() {
    const cart = getCart();
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Update cart count in navbar
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Update cart page if it exists
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartContainer.innerHTML = `
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <h3>${item.name}</h3>
                        <div class="cart-item-details">
                            <p>Price: ${formatPrice(item.price)}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Subtotal: ${formatPrice(item.price * item.quantity)}</p>
                            <button onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h3>Total: ${formatPrice(cartTotal)}</h3>
                <button onclick="checkout()">Checkout</button>
            </div>
        `;
    }
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    updateCartUI();
}

function checkout() {
    // In a real application, this would handle payment processing
    alert('Thank you for your purchase!');
    localStorage.setItem(CART_KEY, JSON.stringify([]));
    updateCartUI();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartUI();
});