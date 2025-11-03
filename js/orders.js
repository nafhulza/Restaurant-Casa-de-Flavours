// Fungsi untuk menambahkan produk ke pesanan
function addToOrder(productId) {
    const product = products.find(p => p.id === productId);
    
    // Cek apakah produk sudah ada di pesanan
    const existingOrder = orders.find(o => o.id === productId);
    
    if (existingOrder) {
        existingOrder.quantity += 1;
    } else {
        orders.push({
            id: product.id,
            name: product.name,
            portion: "Reguler",
            quantity: 1,
            price: product.price
        });
    }
    
    updateOrderDisplay();
    
    // Tampilkan notifikasi
    showNotification(`${product.name} telah ditambahkan ke pesanan`);
}

// Fungsi untuk menghitung subtotal tanpa promo
function calculateSubtotal() {
    return orders.reduce((total, order) => total + (order.price * order.quantity), 0);
}

// FUNGSI PAJAK YANG DIPERBAIKI
function calculateTax() {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.1); // Pajak 10% dengan pembulatan
}

// Fungsi untuk memperbarui kuantitas pesanan
function updateQuantity(productId, change) {
    const order = orders.find(o => o.id === productId);
    
    if (order) {
        order.quantity += change;
        
        // Jika kuantitas menjadi 0, hapus item dari pesanan
        if (order.quantity <= 0) {
            removeFromOrder(productId);
        } else {
            updateOrderDisplay();
        }
    }
}

// Fungsi untuk menghapus item dari pesanan
function removeFromOrder(productId) {
    const product = products.find(p => p.id === productId);
    orders = orders.filter(o => o.id !== productId);
    updateOrderDisplay();
    
    // Tampilkan notifikasi
    showNotification(`${product.name} telah dihapus dari pesanan`);
}

// Fungsi untuk memperbarui tampilan pesanan - DIPERBAIKI DENGAN PAJAK
function updateOrderDisplay() {
    const orderItems = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');
    const taxAmountElement = document.getElementById('tax-amount');
    const discountElement = document.getElementById('discount-amount');
    const finalPriceElement = document.getElementById('final-price');
    const promoInfoElement = document.getElementById('promo-info');
    
    // Kosongkan tabel pesanan
    orderItems.innerHTML = '';
    
    // Hitung subtotal
    const subtotal = calculateSubtotal();
    
    // Hitung pajak - FUNGSI INI SEKARANG BEKERJA
    const tax = calculateTax();
    
    // Hitung diskon
    const discount = calculateDiscount();
    
    // Hitung total akhir (subtotal + pajak - diskon)
    const finalTotal = Math.max(0, subtotal + tax - discount);
    
    // Tambahkan setiap item pesanan ke tabel
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        const itemTotal = order.price * order.quantity;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.name}</td>
            <td>${order.portion}</td>
            <td>
                <div class="qty-controls">
                    <button class="qty-btn minus" data-id="${order.id}">-</button>
                    <span class="qty-value">${order.quantity}</span>
                    <button class="qty-btn plus" data-id="${order.id}">+</button>
                </div>
            </td>
            <td>Rp ${itemTotal.toLocaleString('id-ID')}</td>
            <td><button class="remove-btn" data-id="${order.id}">Hapus</button></td>
        `;
        
        orderItems.appendChild(row);
    });
    
    // Jika tidak ada pesanan, tampilkan pesan kosong
    if (orders.length === 0) {
        orderItems.innerHTML = `
            <tr>
                <td colspan="6" class="empty-order">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Belum ada pesanan</p>
                </td>
            </tr>
        `;
    }
    
    // Perbarui tampilan harga
    totalPriceElement.textContent = subtotal.toLocaleString('id-ID');
    
    // Tampilkan pajak - ELEMENT INI SEKARANG ADA
    if (taxAmountElement) {
        taxAmountElement.textContent = tax.toLocaleString('id-ID');
    }
    
    // Tampilkan diskon jika ada promo
    if (discountElement) {
        discountElement.textContent = discount.toLocaleString('id-ID');
        document.getElementById('discount-display').style.display = discount > 0 ? 'flex' : 'none';
    }
    
    if (finalPriceElement) {
        finalPriceElement.textContent = finalTotal.toLocaleString('id-ID');
    }
    
    // Update jumlah di pembayaran
    updatePaymentAmounts();
    
    // Tampilkan info promo
    if (promoInfoElement) {
        if (appliedPromo) {
            promoInfoElement.innerHTML = `
                <div class="applied-promo">
                    <span>Promo: ${appliedPromo.name}</span>
                    <button class="remove-promo-btn" onclick="removePromo()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        } else {
            promoInfoElement.innerHTML = '';
        }
    }
    
    // Tambahkan event listener untuk tombol kuantitas dan hapus
    document.querySelectorAll('.qty-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.qty-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromOrder(productId);
        });
    });
}