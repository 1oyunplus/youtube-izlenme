/**
 * DATA.JS - LocalStorage Database Yönetimi
 * Tüm kullanıcı ve video verilerini localStorage'da tutar
 */

const DB = {
    // Keys
    USERS_KEY: 'ytcoin_users',
    VIDEOS_KEY: 'ytcoin_videos',
    CURRENT_USER_KEY: 'ytcoin_current_user',

    /**
     * LocalStorage'dan veri oku
     */
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('LocalStorage okuma hatası:', e);
            return null;
        }
    },

    /**
     * LocalStorage'a veri yaz
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('LocalStorage yazma hatası:', e);
            return false;
        }
    },

    /**
     * Tüm kullanıcıları getir
     */
    getUsers() {
        return this.get(this.USERS_KEY) || [];
    },

    /**
     * Kullanıcı kaydet
     */
    saveUsers(users) {
        return this.set(this.USERS_KEY, users);
    },

    /**
     * Kullanıcı ID'sine göre kullanıcı bul
     */
    getUserById(userId) {
        const users = this.getUsers();
        return users.find(u => u.userId === userId);
    },

    /**
     * Kullanıcı adına göre kullanıcı bul
     */
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },

    /**
     * Yeni kullanıcı oluştur
     */
    createUser(username) {
        const users = this.getUsers();
        
        // Kullanıcı zaten var mı kontrol et
        if (this.getUserByUsername(username)) {
            return null;
        }

        const newUser = {
            userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            username: username,
            coin: 100,
            createdAt: Date.now()
        };

        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    },

    /**
     * Kullanıcı coin'ini güncelle
     */
    updateCoins(userId, amount) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.userId === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].coin += amount;
        
        // Coin negatif olamaz
        if (users[userIndex].coin < 0) {
            users[userIndex].coin = 0;
        }

        this.saveUsers(users);

        // Mevcut kullanıcı ise güncelle
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.userId === userId) {
            this.setCurrentUser(users[userIndex]);
        }

        return true;
    },

    /**
     * Mevcut kullanıcıyı getir
     */
    getCurrentUser() {
        return this.get(this.CURRENT_USER_KEY);
    },

    /**
     * Mevcut kullanıcıyı set et
     */
    setCurrentUser(user) {
        return this.set(this.CURRENT_USER_KEY, user);
    },

    /**
     * Çıkış yap
     */
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    },

    /**
     * Tüm videoları getir
     */
    getVideos() {
        return this.get(this.VIDEOS_KEY) || [];
    },

    /**
     * Videoları kaydet
     */
    saveVideos(videos) {
        return this.set(this.VIDEOS_KEY, videos);
    },

    /**
     * Video ekle
     */
    addVideo(videoId, userId) {
        const videos = this.getVideos();
        
        // Video zaten var mı kontrol et
        if (videos.find(v => v.videoId === videoId)) {
            return false;
        }

        const newVideo = {
            videoId: videoId,
            userId: userId,
            uploadedAt: Date.now(),
            watchCount: 0
        };

        videos.push(newVideo);
        this.saveVideos(videos);
        return true;
    },

    /**
     * Video izlenme sayısını artır
     */
    incrementWatchCount(videoId) {
        const videos = this.getVideos();
        const videoIndex = videos.findIndex(v => v.videoId === videoId);
        
        if (videoIndex === -1) return false;

        videos[videoIndex].watchCount++;
        this.saveVideos(videos);
        return true;
    },

    /**
     * Belirli bir kullanıcının videolarını getir
     */
    getUserVideos(userId) {
        const videos = this.getVideos();
        return videos.filter(v => v.userId === userId);
    },

    /**
     * Rastgele video getir (shuffle)
     */
    getRandomVideos() {
        const videos = this.getVideos();
        const shuffled = [...videos].sort(() => Math.random() - 0.5);
        return shuffled;
    },

    /**
     * Sıralı video getir
     */
    getOrderedVideos() {
        const videos = this.getVideos();
        return videos.sort((a, b) => a.uploadedAt - b.uploadedAt);
    },

    /**
     * Demo veriler ekle (test için)
     */
    initDemoData() {
        // Sadece video yoksa demo ekle
        const videos = this.getVideos();
        if (videos.length > 0) return;

        // Demo videolar - Embed izni olan popüler videolar
        const demoVideos = [
            'jNQXAC9IVRw', // Me at the zoo (İlk YouTube videosu)
            '9bZkp7q19f0', // PSY - Gangnam Style
            'kJQP7kiw5Fk', // Luis Fonsi - Despacito
            'fJ9rUzIMcZQ', // Queen - Bohemian Rhapsody
            'OPf0YbXqDm0', // Mark Ronson - Uptown Funk
            'RgKAFK5djSk', // Wiz Khalifa - See You Again
            'rYEDA3JcQqw', // Adele - Rolling in the Deep
        ];

        const demoUserId = 'demo_user_' + Date.now();
        
        demoVideos.forEach(videoId => {
            this.addVideo(videoId, demoUserId);
        });

        console.log('Demo videolar eklendi!');
    }
};

// Sayfa yüklendiğinde demo verileri ekle
if (typeof window !== 'undefined') {
    DB.initDemoData();
}