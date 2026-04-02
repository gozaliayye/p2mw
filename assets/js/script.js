document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA KERANJANG BELANJA (SHOPPING CART) ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    
    // Ambil cart dari localStorage jika ada, atau buat array kosong
    let cart = JSON.parse(localStorage.getItem('natadocCart')) || [];

    // Fungsi Utama: Update Tampilan Keranjang
    function updateCartUI() {
        if (!cartItemsList || !cartTotalSpan) return; 

        cartItemsList.innerHTML = '';
        let total = 0;

        // 1. TAMPILKAN DAFTAR ITEM
        if (cart.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Keranjang kosong.';
            li.style.fontStyle = 'italic';
            li.style.color = '#777';
            cartItemsList.appendChild(li);
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.marginBottom = '10px';
                li.style.borderBottom = '1px solid #eee';
                li.style.paddingBottom = '5px';
                
                li.innerHTML = `
                    <div>
                        <span style="font-weight:500;">${item.name}</span> <br> 
                        <small style="color: var(--secondary-color);">Rp ${item.price.toLocaleString('id-ID')}</small>
                    </div>
                    <button class="remove-btn" data-index="${index}" style="background: #ff4d4d; color: white; border: none; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-weight:bold;">&times;</button>
                `;
                cartItemsList.appendChild(li);
                total += item.price;
            });

            // Aktifkan Tombol Hapus (X)
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indexToRemove = e.target.dataset.index;
                    cart.splice(indexToRemove, 1);
                    localStorage.setItem('natadocCart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
        } // <--- TADI KAMU KURANG KURUNG TUTUP INI

        cartTotalSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    // Jalankan saat halaman dimuat
    updateCartUI();

    // Event Listener: Tombol "Pilih Layanan"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceCard = button.closest('.service-card');
            const id = serviceCard.dataset.id;
            const name = serviceCard.dataset.name;
            const price = parseFloat(serviceCard.dataset.price);

            // Cek duplikat
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                alert(`${name} sudah ada di keranjang.`);
            } else {
                cart.push({ id, name, price });
                localStorage.setItem('natadocCart', JSON.stringify(cart));
                updateCartUI();
                alert(`${name} berhasil ditambahkan!`);
            }
        });
    });

    // Event Listener: Tombol Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Keranjang kosong. Pilih layanan dulu.');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }

    // --- LOGIKA NOTIFIKASI (Tandai Baca) ---
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            const notifications = document.querySelectorAll('.notification-item');
            notifications.forEach(item => {
                item.classList.remove('unread');
            });
            
            let notifData = JSON.parse(localStorage.getItem('natadocNotifications')) || [];
            notifData.forEach(n => n.read = true);
            localStorage.setItem('natadocNotifications', JSON.stringify(notifData));
            
            alert('Semua notifikasi ditandai sudah dibaca.');
        });
    }
});