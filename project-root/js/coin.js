/**
 * COIN.JS - Coin Kazanma ve Harcama Sistemi
 */

const CoinSystem = {
    /**
     * Kullanıcıya coin ekle
     */
    addCoins(userId, amount) {
        return DB.updateCoins(userId, amount);
    },

    /**
     * Kullanıcıdan coin düş
     */
    removeCoins(userId, amount) {
        return DB.updateCoins(userId, -amount);
    },

    /**
     * Kullanıcının coin'i yeterli mi kontrol et
     */
    hasEnoughCoins(userId, amount) {
        const user = DB.getUserById(userId);
        if (!user) return false;
        return user.coin >= amount;
    },

    /**
     * Video izleme ödülü ver
     */
    rewardWatchVideo(userId) {
        const WATCH_REWARD = 5;
        const success = this.addCoins(userId, WATCH_REWARD);
        
        if (success) {
            this.showCoinPopup(WATCH_REWARD);
            updateCoinDisplay();
        }

        return success;
    },

    /**
     * Video yükleme ücreti kes
     */
    chargeVideoUpload(userId) {
        const UPLOAD_COST = 100;
        
        if (!this.hasEnoughCoins(userId, UPLOAD_COST)) {
            return false;
        }

        return this.removeCoins(userId, UPLOAD_COST);
    },

    /**
     * Coin kazanma popup'ını göster
     */
    showCoinPopup(amount) {
        const popup = document.getElementById('coinPopup');
        if (!popup) return;

        const popupText = popup.querySelector('.popup-text');
        if (popupText) {
            popupText.textContent = `+${amount} Coin!`;
        }

        // Popup'ı göster
        popup.classList.add('show');

        // 2 saniye sonra gizle
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);
    },

    /**
     * Coin satın alma işlemi
     */
    purchaseCoins(userId, amount, price) {
        // Fake ödeme simülasyonu
        const confirmed = confirm(
            `${amount} Coin satın almak istediğinize emin misiniz?\n\nFiyat: ₺${price}\n\n(Bu demo bir ödeme işlemidir)`
        );

        if (!confirmed) return false;

        // Coin'leri ekle
        const success = this.addCoins(userId, amount);

        if (success) {
            alert(`✅ Başarılı!\n\n${amount} Coin hesabınıza eklendi.`);
            updateCoinDisplay();
            return true;
        } else {
            alert('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
            return false;
        }
    }
};

// Global fonksiyonlar olarak export et
window.CoinSystem = CoinSystem;