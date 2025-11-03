// Fungsi untuk mengatur tampilan kartu
function setupCardDisplay() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');

    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'card') {
                document.getElementById('card-display').classList.remove('hidden');
                document.getElementById('qris-display').classList.add('hidden');
                updatePaymentAmounts();
            } else if (this.value === 'qris') {
                document.getElementById('qris-display').classList.remove('hidden');
                document.getElementById('card-display').classList.add('hidden');
                updatePaymentAmounts();
            } else {
                document.getElementById('card-display').classList.add('hidden');
                document.getElementById('qris-display').classList.add('hidden');
            }
        });
    });
}

// Fungsi untuk memperbarui jumlah pembayaran di semua tempat - DIPERBAIKI DENGAN PAJAK
function updatePaymentAmounts() {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    const finalTotal = Math.max(0, subtotal + tax - discount);
    
    // Update di QRIS display
    const qrisAmount = document.getElementById('qris-amount');
    if (qrisAmount) {
        qrisAmount.textContent = finalTotal.toLocaleString('id-ID');
    }
    
    // Update di card display
    const cardAmount = document.getElementById('card-amount');
    if (cardAmount) {
        cardAmount.textContent = finalTotal.toLocaleString('id-ID');
    }
}

// Fungsi untuk mendapatkan jenis kartu yang dipilih
function getSelectedCardType() {
    const selectedCard = document.querySelector('input[name="card-type"]:checked');
    return selectedCard ? selectedCard.value : 'debit';
}

// Fungsi untuk mendapatkan label jenis kartu
function getCardTypeLabel(cardType) {
    const labels = {
        'debit': 'Kartu Debit',
        'flazz': 'Flazz BCA',
        'emoney': 'e-Money Mandiri',
    };
    return labels[cardType] || 'Kartu';
}

// Fungsi untuk menangani proses pembayaran
function processPayment() {
    if (orders.length === 0) {
        showNotification('Tidak ada pesanan untuk diproses!', 'error');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    const finalTotal = Math.max(0, subtotal + tax - discount);
    
    if (paymentMethod === 'card') {
        const cardType = getSelectedCardType();
        const cardLabel = getCardTypeLabel(cardType);
        
        // Simulasi pembayaran kartu
        simulateCardPayment(cardType, cardLabel, finalTotal);
    } else if (paymentMethod === 'qris') {
        document.getElementById('qris-display').classList.remove('hidden');
        updatePaymentAmounts();
        
        // Simulasi pembayaran QRIS
        setTimeout(() => {
            completePayment(paymentMethod, subtotal, tax, discount, finalTotal);
        }, 5000);
    } else {
        completePayment(paymentMethod, subtotal, tax, discount, finalTotal);
    }
}

// Fungsi untuk simulasi pembayaran kartu
function simulateCardPayment(cardType, cardLabel, amount) {
    const instructions = {
        'debit': 'Masukkan kartu ke mesin EDC...',
        'flazz': 'Tempelkan kartu Flazz BCA ke reader...',
        'emoney': 'Tempelkan kartu e-Money Mandiri ke reader...',
    };
    
    showNotification(`Silakan ${instructions[cardType]}`, 'info');
    
    // Simulasi proses pembayaran
    setTimeout(() => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax();
        const discount = calculateDiscount();
        completePayment('card', subtotal, tax, discount, amount, cardLabel);
    }, 3000);
}

// Update fungsi completePayment untuk menerima parameter tambahan - DIPERBAIKI DENGAN PAJAK
function completePayment(paymentMethod, subtotal, tax, discount, finalTotal, cardLabel = '') {
    // Tampilkan ringkasan pesanan dengan pajak
    let orderSummary = "RINGKASAN PESANAN\n\n";
    
    orders.forEach(order => {
        const itemTotal = order.price * order.quantity;
        orderSummary += `${order.name} - ${order.quantity} x Rp ${order.price.toLocaleString('id-ID')} = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    
    orderSummary += `\nSUBTOTAL: Rp ${subtotal.toLocaleString('id-ID')}`;
    orderSummary += `\nPAJAK (10%): Rp ${tax.toLocaleString('id-ID')}`;
    
    if (discount > 0) {
        orderSummary += `\nDISKON: -Rp ${discount.toLocaleString('id-ID')}`;
        orderSummary += `\nPROMO: ${appliedPromo.name}`;
    }
    
    orderSummary += `\nTOTAL: Rp ${finalTotal.toLocaleString('id-ID')}`;
    
    if (paymentMethod === 'card' && cardLabel) {
        orderSummary += `\nMETODE PEMBAYARAN: ${cardLabel.toUpperCase()}`;
    } else {
        orderSummary += `\nMETODE PEMBAYARAN: ${paymentMethod.toUpperCase()}`;
    }
    
    orderSummary += `\n\nTERIMA KASIH ATAS KUNJUNGAN ANDA!`;
    
    alert(orderSummary);
    
    // Reset pesanan setelah pembayaran
    orders = [];
    appliedPromo = null;
    updateOrderDisplay();
    
    // Reset metode pembayaran ke default
    document.getElementById('cash').checked = true;
    document.getElementById('card-display').classList.add('hidden');
    document.getElementById('qris-display').classList.add('hidden');
    
    showNotification('Pembayaran berhasil! Terima kasih.', 'success');
}

// Fungsi untuk mengatur tampilan QRIS
function setupQRISDisplay() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'qris') {
                document.getElementById('qris-display').classList.remove('hidden');
                document.getElementById('card-display').classList.add('hidden');
            } else if (this.value === 'card') {
                document.getElementById('card-display').classList.remove('hidden');
                document.getElementById('qris-display').classList.add('hidden');
            } else {
                document.getElementById('qris-display').classList.add('hidden');
                document.getElementById('card-display').classList.add('hidden');
            }
        });
    });
}