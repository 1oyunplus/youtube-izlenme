/**
 * VIDEO.JS - Video İzleme ve Coin Kazanma Sistemi
 * Video thumbnail gösterilir, tıklayınca YouTube'da açılır
 */

const VideoPlayer = {
    currentVideoIndex: 0,
    videoQueue: [],
    timer: null,
    currentTime: 0,
    totalTime: 60, // 60 saniye
    isWatching: false,
    currentVideoId: null,
    videoStartTime: null,

    /**
     * Video player'ı başlat
     */
    init() {
        this.loadVideoQueue();
        this.showNextVideo();
    },

    /**
     * Video queue'sunu yükle (rastgele sırala)
     */
    loadVideoQueue() {
        const videos = DB.getRandomVideos();
        this.videoQueue = videos;
        this.currentVideoIndex = 0;

        console.log('Video queue yüklendi:', this.videoQueue.length, 'video');

        // Video yoksa mesaj göster
        if (this.videoQueue.length === 0) {
            this.showNoVideoMessage();
        }
    },

    /**
     * Video yoksa mesaj göster
     */
    showNoVideoMessage() {
        const videoPlayer = document.getElementById('videoPlayer');
        const noVideoMessage = document.getElementById('noVideoMessage');

        if (videoPlayer) videoPlayer.style.display = 'none';
        if (noVideoMessage) noVideoMessage.style.display = 'block';
    },

    /**
     * Sıradaki videoyu göster
     */
    showNextVideo() {
        // Video yoksa
        if (this.videoQueue.length === 0) {
            this.showNoVideoMessage();
            return;
        }

        // Queue bittiyse, yeniden yükle ve karıştır
        if (this.currentVideoIndex >= this.videoQueue.length) {
            console.log('Queue bitti, yeniden yükleniyor...');
            this.loadVideoQueue();
            return;
        }

        const video = this.videoQueue[this.currentVideoIndex];
        this.currentVideoId = video.videoId;

        console.log('Video gösteriliyor:', video.videoId);

        // Video player'ı göster
        const videoPlayer = document.getElementById('videoPlayer');
        const noVideoMessage = document.getElementById('noVideoMessage');

        if (videoPlayer) videoPlayer.style.display = 'block';
        if (noVideoMessage) noVideoMessage.style.display = 'none';

        // Video thumbnail ve buton göster
        this.displayVideoThumbnail(video.videoId);

        // Video bilgisini güncelle
        this.updateVideoInfo(video);

        // Index'i artır
        this.currentVideoIndex++;

        // Timer'ı sıfırla
        this.resetTimer();
    },

    /**
     * Video thumbnail göster ve izleme butonu ekle
     */
    displayVideoThumbnail(videoId) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer) return;

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        videoPlayer.innerHTML = `
            <div class="video-thumbnail-container">
                <img src="${thumbnailUrl}" alt="Video Thumbnail" class="video-thumbnail" 
                     onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
                <div class="video-overlay">
                    <button class="play-button" id="watchVideoBtn">
                        <span class="play-icon">▶</span>
                        <span class="play-text">Videoyu İzle</span>
                    </button>
                    <p class="watch-instruction">
                        60 saniye izle ve <strong>5 Coin</strong> kazan!
                    </p>
                </div>
            </div>
        `;

        // İzle butonuna event ekle
        const watchBtn = document.getElementById('watchVideoBtn');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                this.watchVideo(videoId);
            });
        }
    },

    /**
     * Videoyu YouTube'da aç ve izlemeyi başlat
     */
    watchVideo(videoId) {
        if (this.isWatching) {
            alert('⚠️ Zaten bir video izliyorsunuz!');
            return;
        }

        // YouTube'da aç
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(youtubeUrl, '_blank');

        // İzleme başladı
        this.isWatching = true;
        this.videoStartTime = Date.now();

        // UI'ı güncelle
        this.showWatchingUI();

        // Timer'ı başlat
        this.startTimer();

        console.log('Video izleme başladı:', videoId);
    },

    /**
     * İzleme UI'ını göster
     */
    showWatchingUI() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer) return;

        videoPlayer.innerHTML = `
            <div class="watching-container">
                <div class="watching-animation">
                    <div class="pulse"></div>
                    <span class="watching-icon">👀</span>
                </div>
                <h3 class="watching-title">Video İzleniyor...</h3>
                <p class="watching-text">YouTube sekmesinde videoyu izleyin</p>
                <p class="watching-timer" id="watchingTimer">60 saniye kaldı</p>
                <button class="btn-secondary" id="confirmWatchBtn">
                    ✅ 60 saniye izledim, coin al!
                </button>
                <button class="btn-cancel" id="cancelWatchBtn">
                    ❌ İzlemeyi iptal et
                </button>
            </div>
        `;

        // Onay butonuna event ekle
        const confirmBtn = document.getElementById('confirmWatchBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmWatch();
            });
        }

        // İptal butonuna event ekle
        const cancelBtn = document.getElementById('cancelWatchBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelWatch();
            });
        }
    },

    /**
     * İzlemeyi onayla
     */
    confirmWatch() {
        const elapsed = Math.floor((Date.now() - this.videoStartTime) / 1000);
        
        if (elapsed < this.totalTime) {
            const remaining = this.totalTime - elapsed;
            alert(`⚠️ Henüz ${remaining} saniye daha izlemelisiniz!`);
            return;
        }

        // Coin ver
        this.onVideoCompleted();
    },

    /**
     * İzlemeyi iptal et
     */
    cancelWatch() {
        if (!confirm('Videoyu izlemeyi iptal etmek istediğinize emin misiniz? Coin kazanamazsınız.')) {
            return;
        }

        this.stop();
        alert('⚠️ Video izleme iptal edildi. Coin kazanılmadı.');
        this.showNextVideo();
    },

    /**
     * Video bilgisini güncelle
     */
    updateVideoInfo(video) {
        const videoTitle = document.getElementById('videoTitle');
        if (videoTitle) {
            videoTitle.textContent = `Video ID: ${video.videoId}`;
        }
    },

    /**
     * Timer'ı sıfırla
     */
    resetTimer() {
        this.currentTime = 0;
        this.isWatching = false;
        this.videoStartTime = null;
        this.updateProgressBar();
    },

    /**
     * 60 saniyelik timer'ı başlat
     */
    startTimer() {
        this.currentTime = 0;

        // Önceki timer'ı temizle
        if (this.timer) {
            clearInterval(this.timer);
        }

        // Progress bar'ı sıfırla
        this.updateProgressBar();

        // Her saniye güncelle
        this.timer = setInterval(() => {
            this.currentTime++;
            this.updateProgressBar();

            // İzleme UI'ındaki timer'ı güncelle
            const watchingTimer = document.getElementById('watchingTimer');
            if (watchingTimer) {
                const remaining = this.totalTime - this.currentTime;
                watchingTimer.textContent = remaining > 0 
                    ? `${remaining} saniye kaldı` 
                    : 'Coin almaya hazırsınız!';
            }

            // 60 saniye tamamlandı - otomatik coin ver
            if (this.currentTime >= this.totalTime) {
                this.onVideoCompleted();
            }
        }, 1000);
    },

    /**
     * Progress bar'ı güncelle
     */
    updateProgressBar() {
        const progressBar = document.getElementById('timerProgress');
        const timerText = document.getElementById('timerText');

        if (progressBar) {
            const percentage = (this.currentTime / this.totalTime) * 100;
            progressBar.style.width = percentage + '%';
        }

        if (timerText) {
            if (this.isWatching) {
                const remaining = this.totalTime - this.currentTime;
                timerText.textContent = remaining > 0 
                    ? `${this.currentTime} / ${this.totalTime} saniye - ${remaining}s kaldı` 
                    : 'Tamamlandı!';
            } else {
                timerText.textContent = 'Video izlemeye başlamak için tıklayın';
            }
        }
    },

    /**
     * Video tamamlandığında
     */
    onVideoCompleted() {
        console.log('Video tamamlandı! Coin veriliyor...');

        // Timer'ı durdur
        this.stop();

        // Kullanıcıya coin ver
        const currentUser = DB.getCurrentUser();
        if (currentUser) {
            CoinSystem.rewardWatchVideo(currentUser.userId);
        }

        // Video izlenme sayısını artır
        if (this.currentVideoId) {
            DB.incrementWatchCount(this.currentVideoId);
        }

        // 2 saniye bekle, sonra bir sonraki videoya geç
        setTimeout(() => {
            this.showNextVideo();
        }, 2000);
    },

    /**
     * Player'ı durdur
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.isWatching = false;
        this.currentTime = 0;
        this.videoStartTime = null;
    }
};

// Sayfa yüklendiğinde video player'ı başlat
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    // DOM tamamen yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            VideoPlayer.init();
        });
    } else {
        VideoPlayer.init();
    }
}

// Sayfa kapatılırken timer'ı temizle
window.addEventListener('beforeunload', () => {
    VideoPlayer.stop();
});