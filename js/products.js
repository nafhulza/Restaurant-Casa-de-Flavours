// Fungsi untuk mendapatkan nama kategori
function getCategoryName(category) {
    const categoryNames = {
        'appetizer': 'Appetizer',
        'main-course': 'Main Course',
        'dessert': 'Dessert',
        'beverage': 'Beverage'
    };
    return categoryNames[category] || category;
}

// Fungsi untuk setup header yang dapat di-sort
function setupSortableHeaders() {
    const headerColumns = document.querySelectorAll('.header-column');
    
    headerColumns.forEach(column => {
        column.addEventListener('click', function() {
            const sortField = this.getAttribute('data-sort');
            
            // Jika mengklik field yang sama, toggle direction
            if (currentSortField === sortField) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortField = sortField;
                currentSortDirection = 'asc';
            }
            
            // Update UI headers
            updateSortHeaders();
            
            // Load ulang produk dengan sorting baru
            loadProducts();
            
            // Tampilkan notifikasi sorting
            showSortNotification(sortField, currentSortDirection);
        });
    });
}

// Fungsi untuk update tampilan header sort
function updateSortHeaders() {
    const headerColumns = document.querySelectorAll('.header-column');
    
    headerColumns.forEach(column => {
        column.classList.remove('active', 'asc', 'desc');
        
        if (column.getAttribute('data-sort') === currentSortField) {
            column.classList.add('active', currentSortDirection);
        }
    });
}

// Fungsi untuk menampilkan notifikasi sorting
function showSortNotification(sortField, direction) {
    const fieldNames = {
        'name': 'Nama Produk',
        'price': 'Harga',
        'best-seller': 'Status Best Seller'
    };
    
    const directionNames = {
        'asc': 'terurut menaik',
        'desc': 'terurut menurun'
    };
    
    const fieldName = fieldNames[sortField] || sortField;
    const directionName = directionNames[direction] || direction;
    
    showNotification(`Produk diurutkan berdasarkan ${fieldName} (${directionName})`, 'info');
}

// Fungsi untuk memuat produk
function loadProducts() {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    productList.innerHTML = '';
    
    // Filter produk berdasarkan kategori
    let filteredProducts = [...products];
    if (currentFilter === "best-seller") {
        filteredProducts = products.filter(product => product.bestSeller);
    } else if (currentFilter !== "all") {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }
    
    // Sort produk berdasarkan field dan direction yang dipilih
    filteredProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (currentSortField) {
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
            case 'best-seller':
                aValue = a.bestSeller ? 1 : 0;
                bValue = b.bestSeller ? 1 : 0;
                break;
            default:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
        }
        
        if (currentSortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    // Tampilkan produk dalam format grid
    displayProductsAsGrid(filteredProducts);
}

// Fungsi untuk menampilkan produk dalam grid
function displayProductsAsGrid(filteredProducts) {
    const productList = document.querySelector('.product-list');
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = `
            <div class="empty-products">
                <i class="fas fa-search"></i>
                <h3>Tidak ada produk ditemukan</h3>
                <p>Coba ubah filter atau kategori yang dipilih</p>
            </div>
        `;
        return;
    }
    
    // Buat container untuk grid
    const gridContainer = document.createElement('div');
    gridContainer.className = 'products-grid-container';
    
    // Tambahkan setiap produk sebagai row
    filteredProducts.forEach((product, index) => {
        const productRow = document.createElement('div');
        productRow.className = 'product-row';
        productRow.setAttribute('data-id', product.id);
        
        // Tambahkan delay untuk animasi berurutan
        productRow.style.animationDelay = `${index * 0.05}s`;
        
        // Handle gambar dengan fallback
        const imageHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="image-fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; background: var(--accent-color); color: white; border-radius: var(--border-radius-sm);">
                    <i class="fas fa-utensils"></i>
                </div>
            </div>
        `;
        
        productRow.innerHTML = `
            <div class="product-cell product-info-cell">
                ${imageHTML}
                <div class="product-text-info">
                    <div class="product-name-main">${product.name}</div>
                    <div class="product-description-short">${product.description}</div>
                    <div class="product-meta">
                        <span class="product-category-badge">${getCategoryName(product.category)}</span>
                    </div>
                </div>
            </div>
            
            <div class="product-cell price-cell">
                <div class="price-display">
                    <div class="price-amount">Rp ${product.price.toLocaleString('id-ID')}</div>
                    ${product.bestSeller ? '<div class="price-note">Best Seller Price</div>' : ''}
                </div>
            </div>
            
            <div class="product-cell best-seller-cell">
                <div class="best-seller-status">
                    ${product.bestSeller ? 
                        `<div class="best-seller-badge-main">
                            <i class="fas fa-crown"></i> Best Seller
                        </div>` : 
                        '<span class="not-best-seller">Standard Menu</span>'
                    }
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-plus"></i> Tambah
                </button>
            </div>
        `;
        
        // Tambahkan event listener untuk tombol tambah
        const addButton = productRow.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            addToOrder(productId);
        });
        
        gridContainer.appendChild(productRow);
    });
    
    productList.appendChild(gridContainer);
}

// Fungsi untuk preload gambar
function preloadImages() {
    products.forEach(product => {
        const img = new Image();
        img.src = product.image;
    });
}