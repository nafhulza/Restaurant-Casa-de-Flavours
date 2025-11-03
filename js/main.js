// Inisialisasi halaman saat dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Set tanggal saat ini
    setupCurrentDate();
    
    // Set tema dari localStorage
    loadSavedTheme();
    
    // Setup event listeners
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);
    document.getElementById('checkout-btn').addEventListener('click', processPayment);
    
    // Setup komponen lainnya
    setupTabs();
    setupFilters();
    setupSortableHeaders();
    setupQRISDisplay();
    setupCardDisplay();
    setupReservationForm();
    
    // Preload gambar untuk performa yang lebih baik
    preloadImages();
    
    // Muat produk dan pesanan
    loadProducts();
    updateOrderDisplay();
    
    // Update sort headers untuk state awal
    updateSortHeaders();
});