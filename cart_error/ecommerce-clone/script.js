let cartCount = 0;
let cartItems = [];
let products = [];

function addToCart(productName, productPrice, productImage) {
    // Introduce an error by adding a different random product instead
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    cartCount++;
    cartItems.push({ name: randomProduct.name, price: randomProduct.price, image: randomProduct.image });
    document.querySelector('.cart button').innerText = `Cart (${cartCount})`;
    alert(`${randomProduct.name} has been added to your cart instead of ${productName}.`);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;  // Save products data to a global variable
            const productList = document.getElementById('product-list');
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>₹${product.price.toFixed(2)}</p>
                    <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        });
}

function loadCart() {
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartCount = cartItems.length;
    const cartList = document.getElementById('cart-list');
    let totalCost = 0;

    if (cartList) {
        cartList.innerHTML = '';
        cartItems.forEach(item => {
            totalCost += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `<img src="${item.image}" alt="${item.name}"><h3>${item.name}</h3><p>₹${item.price.toFixed(2)}</p>`;
            cartList.appendChild(div);
        });
        document.getElementById('total-cost').innerText = `Total: ₹${totalCost.toFixed(2)}`;
    }
}

function emptyCart() {
    cartItems = [];
    cartCount = 0;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCart();
    alert('Your cart has been emptied.');
}

function checkout() {
    alert(`Checkout not implemented. Total cost: ₹${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadProducts();
});
