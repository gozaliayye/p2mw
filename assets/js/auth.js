document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk mensimulasikan status login
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Fungsi untuk mendapatkan nama pengguna yang login
    function getLoggedInUser() {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    }

    // Fungsi untuk memperbarui tampilan header
    function updateAuthLinks() {
        const authLink = document.getElementById('auth-link');
        const user = getLoggedInUser();

       if (isLoggedIn() && user) {
    // Cukup tampilkan nama saja (Fathia), karena ikon sudah ada di HTML sebelah kirinya
    authLink.innerHTML = user.name.split(' ')[0]; 
    authLink.href = 'profile.html';
} else {
            authLink.innerHTML = 'Login';
            authLink.href = 'login.html';
        }
    }

    // Panggil saat halaman dimuat
    updateAuthLinks();

    // --- LOGIKA REGISTER ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Konfirmasi password tidak cocok!');
                return;
            }

            // Simulasi penyimpanan akun
            let users = JSON.parse(localStorage.getItem('natadocUsers')) || [];
            if (users.find(u => u.email === email)) {
                alert('Email ini sudah terdaftar!');
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('natadocUsers', JSON.stringify(users));
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = 'login.html';
        });
    }

    // --- LOGIKA LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            let users = JSON.parse(localStorage.getItem('natadocUsers')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                alert(`Selamat datang kembali, ${user.name}!`);
                window.location.href = 'profile.html'; // Arahkan ke profil atau beranda
            } else {
                alert('Email atau password salah.');
            }
        });
    }

    // --- LOGIKA LOGOUT ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            alert('Anda telah logout.');
            window.location.href = 'index.html';
        });
    }

    // --- LOGIKA UNTUK HALAMAN PROFIL ---
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const detailName = document.getElementById('detail-name');
    const detailEmail = document.getElementById('detail-email');

    if (profileName && profileEmail && detailName && detailEmail) {
        if (isLoggedIn()) {
            const user = getLoggedInUser();
            profileName.textContent = user.name;
            profileEmail.textContent = user.email;
            detailName.textContent = user.name;
            detailEmail.textContent = user.email;
            // Jika ada info tambahan (misal: whatsapp), bisa ditampilkan di sini
            // document.getElementById('detail-whatsapp').textContent = user.whatsapp || '-';
        } else {
            alert('Anda belum login. Silakan login terlebih dahulu.');
            window.location.href = 'login.html';
        }
    }
});