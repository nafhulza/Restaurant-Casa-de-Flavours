// Fungsi untuk memuat dan menampilkan promo
function loadPromos() {
    const promoContainer = document.querySelector('.promo-cards');
    if (!promoContainer) return;

    activePromos.forEach(promo => {
        const promoCard = document.createElement('div');
        promoCard.className = 'promo-card';
        promoCard.innerHTML = `
            <div class="promo-badge">${getPromoBadgeText(promo)}</div>
            <h3>${promo.name}</h3>
            <p>${promo.description}</p>
            <div class="promo-details">
                <div class="promo-code">Kode: <strong>${promo.code}</strong></div>
                <div class="promo-date">Berlaku hingga: ${new Date(promo.validUntil).toLocaleDateString('id-ID')}</div>
            </div>
            <button class="apply-promo-btn" data-promo-id="${promo.id}">
                Gunakan Promo
            </button>
        `;
        promoContainer.appendChild(promoCard);
    });

    // Tambahkan event listener untuk tombol apply promo
    document.querySelectorAll('.apply-promo-btn').forEach(button => {
        button.addEventListener('click', function() {
            const promoId = parseInt(this.getAttribute('data-promo-id'));
            applyPromo(promoId);
        });
    });
}

// Fungsi untuk mendapatkan teks badge promo
function getPromoBadgeText(promo) {
    switch(promo.discountType) {
        case 'percentage':
            return `${promo.discountValue}% OFF`;
        case 'fixed_amount':
            return `DISKON Rp ${promo.discountValue.toLocaleString('id-ID')}`;
        case 'free_item':
            return 'GRATIS ITEM';
        case 'buy_x_get_y':
            return 'BUY X GET Y';
        default:
            return 'PROMO';
    }
}

// Fungsi untuk menerapkan promo
function applyPromo(promoId) {
    const promo = activePromos.find(p => p.id === promoId);
    if (!promo) {
        showNotification('Promo tidak ditemukan!', 'error');
        return;
    }

    // Validasi promo
    const validation = validatePromo(promo);
    if (!validation.isValid) {
        showNotification(validation.message, 'error');
        return;
    }

    appliedPromo = promo;
    showNotification(`Promo "${promo.name}" berhasil diterapkan!`, 'success');
    updateOrderDisplay();
}

// Fungsi untuk validasi promo
function validatePromo(promo) {
    const totalPrice = calculateSubtotal();
    
    // Cek minimum order
    if (totalPrice < promo.minOrder) {
        return {
            isValid: false,
            message: `Minimum order Rp ${promo.minOrder.toLocaleString('id-ID')} untuk promo ini`
        };
    }

    // Cek kategori yang berlaku
    if (promo.applicableCategories[0] !== 'all') {
        const hasApplicableItems = orders.some(order => {
            const product = products.find(p => p.id === order.id);
            return promo.applicableCategories.includes(product.category);
        });
        
        if (!hasApplicableItems) {
            return {
                isValid: false,
                message: 'Tidak ada item yang memenuhi syarat promo'
            };
        }
    }

    // Cek tanggal berlaku
    const today = new Date();
    const validUntil = new Date(promo.validUntil);
    if (today > validUntil) {
        return {
            isValid: false,
            message: 'Promo sudah kadaluarsa'
        };
    }

    return { isValid: true, message: 'Promo valid' };
}

// Fungsi untuk menghitung diskon
function calculateDiscount() {
    if (!appliedPromo) return 0;

    const subtotal = calculateSubtotal();
    const promo = appliedPromo;

    switch(promo.discountType) {
        case 'percentage':
            return (subtotal * promo.discountValue) / 100;
        
        case 'fixed_amount':
            return Math.min(promo.discountValue, subtotal);
        
        case 'free_item':
            // Cari item termurah dari kategori yang sesuai
            const applicableProducts = products.filter(p => 
                promo.applicableCategories.includes(p.category)
            );
            if (applicableProducts.length > 0) {
                const cheapestProduct = applicableProducts.reduce((min, p) => 
                    p.price < min.price ? p : min
                );
                return cheapestProduct.price;
            }
            return 0;
        
        case 'buy_x_get_y':
            // Hitung berapa banyak item yang memenuhi syarat
            const applicableOrders = orders.filter(order => {
                const product = products.find(p => p.id === order.id);
                return promo.applicableCategories.includes(product.category);
            });
            
            if (applicableOrders.length >= promo.minOrder) {
                // Cari item termurah untuk diberikan gratis
                const applicableProducts = products.filter(p => 
                    promo.applicableCategories.includes(p.category)
                );
                if (applicableProducts.length > 0) {
                    const cheapestProduct = applicableProducts.reduce((min, p) => 
                        p.price < min.price ? p : min
                    );
                    return cheapestProduct.price;
                }
            }
            return 0;
        
        default:
            return 0;
    }
}

// Fungsi untuk menghapus promo
function removePromo() {
    appliedPromo = null;
    showNotification('Promo berhasil dihapus', 'success');
    updateOrderDisplay();
}