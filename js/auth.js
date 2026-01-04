/**
 * AUTH.JS - Kullanıcı Girişi ve Kimlik Doğrulama
 */

// Kullanıcı giriş kontrolü
function checkAuth() {
    const currentUser = DB.getCurrentUser();
    
    // Login sayfasında değilsek ve kullanıcı yoksa, login'e yönlendir
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return null;
    }

    // Login sayfasındaysak ve kullanıcı varsa, ana sayfaya yönlendir
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
        return currentUser;
    }

    return currentUser;
}

// Header'daki kullanıcı bilgilerini güncelle
function updateUserDisplay() {
    const currentUser = DB.getCurrentUser();
    if (!currentUser) return;

    const usernameEl = document.getElementById('headerUsername');
    if (usernameEl) {
        usernameEl.textContent = currentUser.username;
    }
}

// Coin sayısını güncelle
function updateCoinDisplay() {
    const currentUser = DB.getCurrentUser();
    if (!currentUser) return;

    // DB'den güncel kullanıcıyı çek
    const updatedUser = DB.getUserById(currentUser.userId);
    if (!updatedUser) return;

    // LocalStorage'daki mevcut kullanıcıyı güncelle
    DB.setCurrentUser(updatedUser);

    const coinCountEl = document.getElementById('coinCount');
    if (coinCountEl) {
        coinCountEl.textContent = updatedUser.coin;
    }
}

// Çıkış yap
function logout() {
    DB.logout();
    window.location.href = 'login.html';
}

// Login sayfası için
if (window.location.pathname.includes('login.html')) {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('usernameInput');

    if (loginBtn && usernameInput) {
        // Enter tuşu ile giriş
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        });

        // Login butonuna tıklanınca
        loginBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();

            if (!username) {
                alert('❌ Lütfen bir kullanıcı adı girin!');
                return;
            }

            if (username.length < 3) {
                alert('❌ Kullanıcı adı en az 3 karakter olmalıdır!');
                return;
            }

            // Kullanıcı var mı kontrol et
            let user = DB.getUserByUsername(username);

            // Yoksa oluştur
            if (!user) {
                user = DB.createUser(username);
                if (!user) {
                    alert('❌ Kullanıcı oluşturulamadı!');
                    return;
                }
                console.log('Yeni kullanıcı oluşturuldu:', user);
            } else {
                console.log('Mevcut kullanıcı ile giriş:', user);
            }

            // Kullanıcıyı kaydet ve ana sayfaya yönlendir
            DB.setCurrentUser(user);
            window.location.href = 'index.html';
        });
    }
}

// Diğer sayfalarda auth kontrolü ve logout butonu
if (!window.location.pathname.includes('login.html')) {
    // Sayfa yüklendiğinde auth kontrolü
    checkAuth();
    updateUserDisplay();
    updateCoinDisplay();

    // Logout butonu
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                logout();
            }
        });
    }

    // Her 2 saniyede bir coin'i güncelle (başka sekmede değişirse)
    setInterval(() => {
        updateCoinDisplay();
    }, 2000);
}