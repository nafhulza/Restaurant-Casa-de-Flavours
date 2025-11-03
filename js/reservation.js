// Fungsi untuk mengatur form reservasi
function setupReservationForm() {
    const reservationForm = document.querySelector('.reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil data form
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const specialRequests = document.getElementById('special-requests').value;
            
            // Tampilkan konfirmasi
            const confirmationMessage = `
                Reservasi Berhasil!
                
                Nama: ${name}
                Telepon: ${phone}
                Tanggal: ${date}
                Waktu: ${time}
                Jumlah Tamu: ${guests}
                Permintaan Khusus: ${specialRequests || 'Tidak ada'}
                
                Kami akan menghubungi Anda untuk konfirmasi.
            `;
            
            alert(confirmationMessage);
            
            // Reset form
            reservationForm.reset();
            
            showNotification('Reservasi berhasil dikirim!', 'success');
        });
    }
}