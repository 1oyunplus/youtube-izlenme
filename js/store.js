/**
 * STORE.JS - Coin Mağazası ve Satın Alma Sistemi
 */

// Store sayfasındaysak
if (window.location.pathname.includes('store.html')) {
    
    // Tüm satın alma butonlarını seç
    const buyButtons = document.querySelectorAll('.btn-buy');

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const coins = parseInt(button.dataset.coins);
            const price = parseInt(button.dataset.price);

            // Kullanıcı kontrolü
            const currentUser = DB.getCurrentUser();
            if (!currentUser) {
                alert('❌ Giriş yapmalısınız!');
                window.location.href = 'login.html';
                return;
            }

            // Satın alma işlemi
            CoinSystem.purchaseCoins(currentUser.userId, coins, price);
        });
    });
}