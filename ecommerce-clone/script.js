let cartCount = 0;
let cartItems = [];

function addToCart(productName, productPrice, productImage) {
    cartCount++;
    cartItems.push({ name: productName, price: productPrice, image: productImage });
    document.querySelector('.cart button').innerText = `Cart (${cartCount})`;
    alert(`${productName} has been added to your cart.`);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(products => {
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

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.text();
    })
    .then(message => {
        alert(message);
        window.location.href = 'login.html';
    })
    .catch(error => alert(error.message));
}

function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.text();
    })
    .then(message => {
        alert(message);
        localStorage.setItem('username', username);
        window.location.href = 'index.html';
    })
    .catch(error => alert(error.message));
}

function loadUsername() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username-display').innerText = `Hello, ${username}`;
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'inline';
    } else {
        document.getElementById('login-link').style.display = 'inline';
        document.getElementById('register-link').style.display = 'inline';
        document.getElementById('logout-link').style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadUsername();
    loadProducts();

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
});
