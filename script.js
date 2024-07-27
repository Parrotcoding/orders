// Supabase configuration
const SUPABASE_URL = 'https://cfxymcjpewltucsymvog.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeHltY2pwZXdsdHVjc3ltdm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwNDE2NTEsImV4cCI6MjAzNzYxNzY1MX0.P00sv3YYVVkhm2qjqEE1Y7MmXfN8uSsnGo80sCHeXhU';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

    addProductButton.addEventListener('click', async () => {
        const productName = document.getElementById('productName').value;
        if (productName) {
            const { data, error } = await supabase
                .from('products')
                .insert([{ name: productName }]);
            if (error) {
                console.error('Error adding product:', error);
            } else {
                console.log('Product added successfully');
                renderProducts();
            }
            document.getElementById('productName').value = '';
        }
    });

    addOrderButton.addEventListener('click', async () => {
        const orderNumber = document.getElementById('orderNumber').value;
        if (orderNumber && orderNumber >= 1 && orderNumber <= 200) {
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('name');
            if (productsError) {
                console.error('Error fetching products:', productsError);
                return;
            }
            const product = products[Math.floor(Math.random() * products.length)].name;
            const status = getRandomStatus();
            const { data, error } = await supabase
                .from('orders')
                .insert([{ number: orderNumber, product, status }]);
            if (error) {
                console.error('Error adding order:', error);
            } else {
                console.log('Order added successfully');
                renderOrders();
            }
            document.getElementById('orderNumber').value = '';
        }
    });

    async function renderProducts() {
        const { data: products, error } = await supabase
            .from('products')
            .select('*');
        if (error) {
            console.error('Error fetching products:', error);
            return;
        }
        productsList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.textContent = product.name;
            productsList.appendChild(productDiv);
        });
    }

    async function renderOrders() {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*');
        if (error) {
            console.error('Error fetching orders:', error);
            return;
        }
        ordersList.innerHTML = '';
        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.textContent = `Order #${order.number}: ${order.product} - Status: ${order.status}`;
            ordersList.appendChild(orderDiv);
        });
    }

    function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
});
