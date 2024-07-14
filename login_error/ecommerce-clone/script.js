let cartCount = 0;
let cartItems = [];
let products = [
    {
        name: 'Sandisk Cruzer Blade CZ50 USB 2.0 Pendrive (16 GB) - Pack of 5',
        price: 999,
        image: 'images/product1.jpg'
    },
    {
        name: 'Pigeon by Stovekraft Kessel 1.2-Litre Multi-Purpose Kettle (Silver) 600W, Black',
        price: 799,
        image: 'images/product2.jpg'
    },
    {
        name: 'Mediweave KN95 (Equivalent to N95) Mask/Respirator, CE certified, Pack of 5',
        price: 199.99,
        image: 'images/product3.jpg'
    },
    {
        name: 'Amazon Echo (3rd generation) | Smart speaker with Alexa, Charcoal Fabric',
        price: 989.99,
        image: 'images/product4.jpg'
    },
    {
        name: 'New Apple iPad Pro (12.9-inch, Wi-Fi, 128GB) - Silver (4th Generation)',
        price: 159811.99,
        image: 'images/product5.jpg'
    },
    {
        name: 'Netgear R6120-100INS AC1200 Dual-Band Wi-Fi Router (Black, Not a Modem)',
        price: 1991.99,
        image: 'images/product6.jpg'
    },
    {
        name: 'Amazon Brand - Solimo Water Resistant Cotton Mattress Protector 78x72 - King Size, Grey',
        price: 839.99,
        image: 'images/product7.jpg'
    },
    {
        name: 'OPPO F19 Pro (Crystal Silver, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers',
        price: 59877.99,
        image: 'images/product8.jpg'
    }
];

function addToCart(productName, productPrice) {
    cartCount++;
    const productImage = getProductImage(productName);
    cartItems.push({ name: productName, price: productPrice, image: productImage });
    document.querySelector('.cart button').innerText = `Cart (${cartCount})`;
    alert(`${productName} has been added to your cart.`);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getProductImage(productName) {
    const product = products.find(p => p.name === productName);
    return product ? product.image : '';
}

function loadProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
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
        document.getElementById('logout-link').style.display = 'inline';
    } else {
        document.getElementById('login-link').style.display = 'inline';
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
