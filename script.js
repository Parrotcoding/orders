// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const createTab = document.getElementById('createTab');
    const shopTab = document.getElementById('shopTab');
    const createSection = document.getElementById('create');
    const shopSection = document.getElementById('shop');
    const administerTab = document.getElementById('administerTab');
    const viewTab = document.getElementById('viewTab');
    const administerSection = document.getElementById('administer');
    const viewSection = document.getElementById('view');
    const generateCodeButton = document.getElementById('generateCode');
    const deviceCode = document.getElementById('deviceCode');
    const addProductButton = document.getElementById('addProduct');
    const addOrderButton = document.getElementById('addOrder');
    const productsList = document.getElementById('productsList');
    const ordersList = document.getElementById('ordersList');

    createTab.addEventListener('click', () => {
        createSection.classList.remove('hidden');
        shopSection.classList.add('hidden');
    });

    shopTab.addEventListener('click', () => {
        createSection.classList.add('hidden');
        shopSection.classList.remove('hidden');
    });

    administerTab.addEventListener('click', () => {
        administerSection.classList.remove('hidden');
        viewSection.classList.add('hidden');
    });

    viewTab.addEventListener('click', () => {
        administerSection.classList.add('hidden');
        viewSection.classList.remove('hidden');
        renderOrders();
    });

    generateCodeButton.addEventListener('click', () => {
        const code = generateCode();
        deviceCode.textContent = `Device Code: ${code}`;
    });

    addProductButton.addEventListener('click', () => {
        const productName = document.getElementById('productName').value;
        if (productName) {
            const newProductRef = database.ref('products').push();
            newProductRef.set({
                name: productName
            });
            document.getElementById('productName').value = '';
        }
    });

    addOrderButton.addEventListener('click', () => {
        const orderNumber = document.getElementById('orderNumber').value;
        if (orderNumber && orderNumber >= 1 && orderNumber <= 200) {
            database.ref('products').once('value', (snapshot) => {
                const products = snapshot.val();
                const productKeys = Object.keys(products);
                const product = products[productKeys[Math.floor(Math.random() * productKeys.length)]].name;
                const status = getRandomStatus();
                const newOrderRef = database.ref('orders').push();
                newOrderRef.set({
                    number: orderNumber,
                    product: product,
                    status: status
                });
                document.getElementById('orderNumber').value = '';
            });
        }
    });

    database.ref('products').on('value', (snapshot) => {
        const products = snapshot.val();
        renderProducts(products);
    });

    database.ref('orders').on('value', (snapshot) => {
        const orders = snapshot.val();
        renderOrders(orders);
    });

    function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function renderProducts(products) {
        productsList.innerHTML = '';
        for (let key in products) {
            const productDiv = document.createElement('div');
            productDiv.textContent = products[key].name;
            productsList.appendChild(productDiv);
        }
    }

    function renderOrders(orders) {
        ordersList.innerHTML = '';
        for (let key in orders) {
            const orderDiv = document.createElement('div');
            orderDiv.textContent = `Order #${orders[key].number}: ${orders[key].product} - Status: ${orders[key].status}`;
            ordersList.appendChild(orderDiv);
        }
    }

    function getRandomStatus() {
        const statuses = ['Processed', 'In Progress', 'Ready'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
});
