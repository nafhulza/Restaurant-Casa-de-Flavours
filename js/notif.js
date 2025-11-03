// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Tampilkan notifikasi
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Fungsi untuk mengatur tanggal saat ini
function setupCurrentDate() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}