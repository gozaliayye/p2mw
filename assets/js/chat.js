document.addEventListener('DOMContentLoaded', () => {
    const chatInterface = document.getElementById('chat-interface');
    const loginPrompt = document.getElementById('login-prompt');

    if (!chatInterface) return;

    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    if (!isLoggedIn()) {
        chatInterface.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'block';
        return;
    }

    if (loginPrompt) loginPrompt.style.display = 'none';
    chatInterface.style.display = 'flex';

    // --- TAMBAH DISCLAIMER BANNER ---
    const disclaimer = document.createElement('div');
    disclaimer.style.cssText = `
        background: #fff8e1;
        border-bottom: 1px solid #ffe082;
        padding: 8px 16px;
        font-size: 0.82rem;
        color: #795548;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    `;
    disclaimer.innerHTML = `<span>🚧</span> <span>Fitur konsultasi ini masih dalam tahap pengembangan. Balasan bersifat otomatis sementara.</span>`;
    chatInterface.insertBefore(disclaimer, chatInterface.firstChild);

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const fileUploadBtn = document.getElementById('file-upload-btn');
    const fileInput = document.getElementById('file-input');

    // --- KEY CHAT PER USER ---
    const currentUser = localStorage.getItem('loggedInUser') || 'guest';
    const CHAT_KEY = `natadocChatHistory_${currentUser}`;

    // --- FUNGSI TAMPIL PESAN ---
    function displayMessage(sender, content, type = 'text') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        let bubbleContent = '';
        if (type === 'text') {
            bubbleContent = content.replace(/\n/g, '<br>');
        } else if (type === 'html') {
            bubbleContent = content;
        } else if (type === 'file') {
            bubbleContent = `<i>📎 Mengirim file: ${content}</i>`;
        }

        messageDiv.innerHTML = `<div class="bubble">${bubbleContent}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- TYPING INDICATOR ---
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'admin');
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="bubble" style="display:flex;gap:5px;align-items:center;padding:12px 16px;">
                <span style="width:8px;height:8px;background:var(--accent-color);border-radius:50%;animation:typingDot 1.2s infinite 0s"></span>
                <span style="width:8px;height:8px;background:var(--accent-color);border-radius:50%;animation:typingDot 1.2s infinite 0.2s"></span>
                <span style="width:8px;height:8px;background:var(--accent-color);border-radius:50%;animation:typingDot 1.2s infinite 0.4s"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (!document.getElementById('typing-style')) {
            const style = document.createElement('style');
            style.id = 'typing-style';
            style.textContent = `
                @keyframes typingDot {
                    0%, 60%, 100% { opacity: 0.2; transform: scale(1); }
                    30% { opacity: 1; transform: scale(1.3); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function hideTyping() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    // --- TEMPLATE BALASAN TEKS ---
    function getTemplateReply(message) {
        const msg = message.toLowerCase();

        if (msg.includes('harga') || msg.includes('biaya') || msg.includes('tarif') || msg.includes('berapa')) {
            return `Harga layanan kami bersifat custom tergantung volume dan kondisi arsip Anda. \n\nUntuk estimasi yang akurat, kami menyediakan survey lapangan terlebih dahulu. Tim kami akan datang langsung untuk menilai kondisi arsip Anda.\n\nApakah Anda ingin kami jadwalkan survey lapangan?`;
        }

        if (msg.includes('digitalisasi') || msg.includes('scan') || msg.includes('digital')) {
            return `Layanan Digitalisasi Arsip kami mencakup pemindaian dokumen fisik ke format digital yang terstruktur dan mudah dicari. \n\nCocok untuk dokumen vital yang perlu diakses kapan saja dan dari mana saja. Apakah ada jenis dokumen spesifik yang ingin Anda digitalisasi?`;
        }

        if (msg.includes('rekonstruksi') || msg.includes('penataan') || msg.includes('menumpuk') || msg.includes('berantakan') || msg.includes('tumpuk')) {
            return `Layanan Rekonstruksi Arsip kami dirancang khusus untuk kondisi arsip yang menumpuk dan tidak terstruktur. \n\nTim profesional kami akan memilah, menata, dan memberi label pada setiap dokumen sesuai sistem pengarsipan yang baku. Berapa estimasi jumlah box/dokumen yang perlu ditata?`;
        }

        if (msg.includes('penyusutan') || msg.includes('hapus') || msg.includes('buang') || msg.includes('musnahkan')) {
            return `Layanan Penyusutan Arsip kami membantu memilah dokumen yang sudah tidak bernilai guna untuk dimusnahkan sesuai regulasi yang berlaku. \n\nProses ini dilakukan secara legal dan terdokumentasi sehingga organisasi Anda tetap patuh regulasi. Apakah ada jenis arsip tertentu yang ingin disusutkan?`;
        }

        if (msg.includes('konsultasi') || msg.includes('masalah') || msg.includes('bantuan') || msg.includes('bantu') || msg.includes('solusi')) {
            return `Terima kasih sudah menghubungi NataDoc! 🙏\n\nCeritakan lebih lanjut kondisi arsip Anda — misalnya jenis dokumen, perkiraan jumlah, atau masalah yang paling sering dihadapi. Kami akan bantu rekomendasikan solusi terbaik!`;
        }

        if (msg.includes('lokasi') || msg.includes('alamat') || msg.includes('dimana') || msg.includes('kantor')) {
            return `NataDoc berlokasi di Jatinangor, Jawa Barat. \n\nNamun tim kami bisa datang langsung ke lokasi organisasi Anda untuk survey dan pengerjaan. Silakan hubungi kami di contact.natadoc@gmail.com untuk penjadwalan.`;
        }

        // Default — pesan umum
        return `Terima kasih atas pesannya! 🙏\n\nPesan Anda sudah kami terima dan akan segera ditindaklanjuti oleh tim konsultan NataDoc. Untuk respons lebih cepat, Anda juga bisa menghubungi kami langsung di:\n📧 contact.natadoc@gmail.com`;
    }

    // --- BALASAN JIKA USER KIRIM FILE/GAMBAR ---
    function getFileAnalysisReply() {
        return `Terima kasih sudah mengirimkan foto kondisi arsip Anda! \n\nBerdasarkan dokumen yang Anda kirimkan, tim kami telah melakukan analisis awal. Berikut rekomendasinya:`;
    }

    function getReportCard() {
        return `
            <div class="report-card">
                <h4>📑 Hasil Analisis Awal</h4>
                <p>Berdasarkan foto kondisi arsip Anda, kami merekomendasikan layanan:</p>
                <ul>
                    <li><strong>Rekonstruksi Arsip</strong> — Penataan ulang dokumen yang menumpuk</li>
                    <li><strong>Digitalisasi Arsip</strong> — Dokumen menjadi aman & mudah diakses</li>
                </ul>
                <br>
                <p style="font-size:0.82rem;color:#888;">* Analisis lengkap akan dilakukan saat survey lapangan.</p>
                <br>
                <a href="layanan.html" class="report-btn">Lihat & Checkout Layanan </a>
            </div>
        `;
    }

    // --- MUAT RIWAYAT ---
    let chatHistory = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    if (chatHistory.length === 0) {
        const welcomeMsg = 'Halo! Selamat datang di layanan konsultasi NataDoc 👋\n\nCeritakan kondisi arsip atau dokumen Anda. Kami siap bantu carikan solusi terbaik!\n\nAtau langsung kirim foto kondisi arsip Anda untuk mendapatkan analisis awal.';
        displayMessage('admin', welcomeMsg, 'text');
        saveChat('admin', welcomeMsg, 'text');
    } else {
        chatHistory.forEach(msg => displayMessage(msg.sender, msg.content, msg.type));
    }

    function saveChat(sender, content, type = 'text') {
        chatHistory.push({ sender, content, type });
        localStorage.setItem(CHAT_KEY, JSON.stringify(chatHistory));
    }

    // --- KIRIM PESAN TEKS ---
    sendChatBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (!message) return;

        displayMessage('user', message);
        saveChat('user', message, 'text');
        chatInput.value = '';

        showTyping();
        setTimeout(() => {
            hideTyping();
            const reply = getTemplateReply(message);
            displayMessage('admin', reply, 'text');
            saveChat('admin', reply, 'text');
        }, 1200);
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatBtn.click();
        }
    });

    // --- KIRIM FILE/GAMBAR → ANALISIS TEMPLATE ---
    fileUploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        displayMessage('user', file.name, 'file');
        saveChat('user', file.name, 'file');
        fileInput.value = '';

        showTyping();
        setTimeout(() => {
            hideTyping();
            const analysisReply = getFileAnalysisReply();
            displayMessage('admin', analysisReply, 'text');
            saveChat('admin', analysisReply, 'text');

            setTimeout(() => {
                const report = getReportCard();
                displayMessage('admin', report, 'html');
                saveChat('admin', report, 'html');
            }, 600);
        }, 1500);
    });
});