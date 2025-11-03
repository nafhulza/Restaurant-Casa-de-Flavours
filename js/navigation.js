// Fungsi untuk mengatur tab navigasi
function setupTabs() {
    const tabItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Hapus kelas active dari semua item
            tabItems.forEach(i => {
                i.classList.remove('active');
            });
            
            // Sembunyikan semua konten tab
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Tambahkan kelas active ke item yang diklik
            this.classList.add('active');
            
            // Tampilkan konten tab yang sesuai
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Fungsi untuk mengatur filter produk
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Hapus kelas active dari semua filter
            filterBtns.forEach(b => {
                b.classList.remove('active');
            });
            
            // Tambahkan kelas active ke filter yang diklik
            this.classList.add('active');
            
            // Perbarui filter saat ini
            currentFilter = this.getAttribute('data-filter');
            
            // Muat ulang produk dengan filter baru
            loadProducts();
        });
    });
}