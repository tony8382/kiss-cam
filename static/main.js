
let gameConfig = {
    title: '',
    actions: []
};
let usedActions = [];
let isSpinning = false;
let actionCount = 0;

// 頁面載入時自動讀取設定檔
document.addEventListener('DOMContentLoaded', function () {
    loadConfig();
});

async function loadConfig() {
    try {
        // 顯示載入狀態
        document.getElementById('configStatus').style.display = 'block';
        document.getElementById('configPreview').style.display = 'none';
        document.getElementById('configError').style.display = 'none';

        // 嘗試讀取設定檔
        const response = await fetch('./config.txt');
        if (!response.ok) {
            throw new Error('設定檔案不存在');
        }

        const configText = await response.text();
        parseConfig(configText);

        // 顯示預覽
        showConfigPreview();

    } catch (error) {
        console.error('載入設定檔失敗:', error);
        showConfigError();
    }
}

function parseConfig(configText) {
    const lines = configText.split('\n').filter(line => line.trim() !== '');
    gameConfig.actions = [];

    for (const line of lines) {
        const [key, value] = line.split('=');
        if (!key || !value) continue;

        const trimmedKey = key.trim();
        const trimmedValue = value.trim();

        if (trimmedKey === 'title') {
            gameConfig.title = trimmedValue;
        } else if (trimmedKey.startsWith('action')) {
            const [name, imagePath] = trimmedValue.split(',');
            if (name && imagePath) {
                gameConfig.actions.push({
                    name: name.trim(),
                    image: 'images/' + imagePath.trim()
                });
            }
        }
    }

    if (gameConfig.actions.length === 0) {
        throw new Error('沒有找到有效的動作設定');
    }
}

function showConfigPreview() {
    document.getElementById('configStatus').style.display = 'none';
    document.getElementById('configError').style.display = 'none';
    document.getElementById('configPreview').style.display = 'block';

    // 更新標題
    document.getElementById('gameTitle').textContent = gameConfig.title;
    document.getElementById('titlePreview').textContent = gameConfig.title;
    document.getElementById('countPreview').textContent = gameConfig.actions.length;

    // 生成預覽網格
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';

    gameConfig.actions.forEach((action, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
                        <img class="preview-image" src="${action.image}" alt="${action.name}" 
                            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjc3NDhkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lnJblg4/kuI3lrZjlnKg8L3RleHQ+Cjwvc3ZnPg=='; this.alt='圖片載入失敗';">
                        <div class="preview-label">${action.name}</div>
                    `;
        previewGrid.appendChild(previewItem);
    });
}

function showConfigError() {
    document.getElementById('configStatus').style.display = 'none';
    document.getElementById('configPreview').style.display = 'none';
    document.getElementById('configError').style.display = 'block';
}

function startGame() {
    // 隱藏設定區域，顯示遊戲區域
    document.getElementById('configSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    document.getElementById('resetButton').style.display = 'block';

    // 初始化遊戲狀態
    document.getElementById('remainingCount').textContent = gameConfig.actions.length;

    // 初始化拉霸機
    initializeSlots();

    // 顯示初始訊息
    const selectedAction = document.getElementById('selectedAction');
    selectedAction.innerHTML = '準備好展現甜蜜時刻了嗎？💕';
    setTimeout(() => selectedAction.classList.add('show'), 100);
}

function initializeSlots() {
    for (let i = 1; i <= 3; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = '';

        // 創建多個重複的圖片項目來製造滾動效果
        for (let repeat = 0; repeat < 10; repeat++) {
            for (let j = 0; j < gameConfig.actions.length; j++) {
                const item = document.createElement('div');
                item.className = 'reel-item';
                if (usedActions.includes(j)) {
                    item.classList.add('used');
                }
                item.innerHTML = `<img src="${gameConfig.actions[j].image}" alt="${gameConfig.actions[j].name}" 
                                            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjc3NDhkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lnJblg4/plJnoqqQ8L3RleHQ+Cjwvc3ZnPg=='; this.alt='圖片錯誤';">`;
                reel.appendChild(item);
            }
        }
    }
}

function resetGame() {
    usedActions = [];
    actionCount = 0;
    document.getElementById('actionCount').textContent = '0';
    document.getElementById('remainingCount').textContent = gameConfig.actions.length;
    document.getElementById('spinButton').style.display = 'inline-block';
    document.getElementById('nextButton').style.display = 'none';

    const selectedAction = document.getElementById('selectedAction');
    selectedAction.innerHTML = '準備好展現甜蜜時刻了嗎？💕';
    selectedAction.classList.remove('show');
    setTimeout(() => selectedAction.classList.add('show'), 100);

    // 重新初始化拉霸機
    initializeSlots();

    // 啟用按鈕
    document.getElementById('spinButton').disabled = false;
}

function getAvailableActions() {
    const allIndices = Array.from({ length: gameConfig.actions.length }, (_, i) => i);
    return allIndices.filter(index => !usedActions.includes(index));
}

function spinSlots() {
    if (isSpinning) return;

    const availableActions = getAvailableActions();
    if (availableActions.length === 0) {
        alert('所有動作都已抽完！請點擊重設按鈕重新開始。');
        return;
    }

    isSpinning = true;
    actionCount++;

    // 更新按鈕狀態
    document.getElementById('spinButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';

    // 隱藏之前的結果
    const selectedAction = document.getElementById('selectedAction');
    selectedAction.classList.remove('show');

    // 隨機選擇一個可用的動作
    const selectedIndex = availableActions[Math.floor(Math.random() * availableActions.length)];
    usedActions.push(selectedIndex);

    // 開始拉霸機動畫
    animateSlots(selectedIndex);
}

function animateSlots(targetIndex) {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    let completedReels = 0;

    reels.forEach((reel, reelIndex) => {
        let spinCount = 0;
        const maxSpins = 30 + (reelIndex * 10); // 每個轉輪停止時間不同

        const spinInterval = setInterval(() => {
            const randomOffset = Math.random() * (gameConfig.actions.length * 100);
            reel.style.transform = `translateY(-${randomOffset}px)`;
            spinCount++;

            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);

                // 停在目標位置
                const targetPosition = (targetIndex * 100) + 150; // 150px 是偏移量讓圖片在視窗中央
                reel.style.transform = `translateY(-${targetPosition}px)`;
                reel.style.transition = 'transform 0.5s ease-out';

                completedReels++;

                // 所有轉輪都停止後顯示結果
                if (completedReels === 3) {
                    setTimeout(() => {
                        showResult(targetIndex);
                    }, 500);
                }
            }
        }, 50);
    });
}

function showResult(selectedIndex) {
    // 顯示慶祝動畫
    showCelebration();

    // 更新拉霸機顯示已使用的動作
    initializeSlots();

    setTimeout(() => {
        const selectedAction = document.getElementById('selectedAction');
        selectedAction.innerHTML = `
                        <div style="font-size: 1.8rem; margin-bottom: 15px;">恭喜抽中：${gameConfig.actions[selectedIndex].name}</div>
                        <div style="font-size: 1rem; color: #e2e8f0;">準備展現甜蜜時刻！</div>
                    `;
        selectedAction.classList.add('show');

        // 自動顯示滿版照片
        setTimeout(() => {
            showFullscreen(selectedIndex);
        }, 500);

        // 更新計數器
        document.getElementById('actionCount').textContent = actionCount;
        document.getElementById('remainingCount').textContent = getAvailableActions().length;

        // 顯示下一個按鈕或結束遊戲
        if (getAvailableActions().length > 0) {
            document.getElementById('nextButton').style.display = 'inline-block';
        } else {
            selectedAction.innerHTML += '<br><div style="font-size: 1.2rem; margin-top: 15px;">🎉 所有動作都完成了！點擊重設開始新一輪 🎉</div>';
        }

        isSpinning = false;
    }, 1000);
}

function showFullscreen(imageIndex) {
    const overlay = document.getElementById('fullscreenOverlay');
    const image = document.getElementById('fullscreenImage');
    const title = document.getElementById('fullscreenTitle');

    image.src = gameConfig.actions[imageIndex].image;
    image.onerror = function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Nzc0OGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuWcluePj+i8ieWFpeWkseaVlzwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY3NzQ4ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+6KuL56K66KqNaW1hZ2XmqpTmoYjlkI3lrZfmraPnorY8L3RleHQ+Cjwvc3ZnPg==';
        this.alt = '圖片載入失敗';
    };
    title.textContent = gameConfig.actions[imageIndex].name;

    overlay.classList.add('show');
}

function closeFullscreen() {
    document.getElementById('fullscreenOverlay').classList.remove('show');
}

function showCelebration() {
    const celebrations = ['🎉', '✨', '🎊', '🌟', '💫', '💕', '💖'];
    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];

    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = randomCelebration;
    document.body.appendChild(celebration);

    setTimeout(() => {
        if (document.body.contains(celebration)) {
            document.body.removeChild(celebration);
        }
    }, 1500);
}

// 音效管理
class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('sounds/click.mp3'),
            spin: new Audio('sounds/spin.mp3'),
            stop: new Audio('sounds/stop.mp3'),
            win: new Audio('sounds/win.mp3')
        };
        this.isMuted = false;

        // 設定循環播放
        this.sounds.spin.loop = true;

        // 預加載
        Object.values(this.sounds).forEach(sound => {
            sound.load();
            sound.volume = 0.5;
        });
    }

    play(name) {
        if (this.isMuted || !this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }

    stop(name) {
        if (!this.sounds[name]) return;
        const sound = this.sounds[name];
        sound.pause();
        sound.currentTime = 0;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        // 如果正在播放循環音效，也要處理
        if (this.isMuted) {
            this.stop('spin');
        }

        return this.isMuted;
    }
}

const soundManager = new SoundManager();

function toggleSound() {
    const isMuted = soundManager.toggleMute();
    const btn = document.getElementById('soundToggle');
    btn.textContent = isMuted ? '🔇' : '🔊';
    btn.classList.toggle('muted', isMuted);
}

// Add sound triggers to existing functions
const originalStartGame = startGame;
startGame = function () {
    soundManager.play('click');
    originalStartGame();
};

const originalResetGame = resetGame;
resetGame = function () {
    soundManager.play('click');
    originalResetGame();
};

const originalSpinSlots = spinSlots;
spinSlots = function () {
    soundManager.play('click');
    soundManager.play('spin');
    originalSpinSlots();
};

// Modify animateSlots to stop spin sound and play stop sound
const originalAnimateSlots = animateSlots;
animateSlots = function (targetIndex) {
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    let completedReels = 0;

    reels.forEach((reel, reelIndex) => {
        let spinCount = 0;
        const maxSpins = 30 + (reelIndex * 10);

        const spinInterval = setInterval(() => {
            const randomOffset = Math.random() * (gameConfig.actions.length * 100);
            reel.style.transform = `translateY(-${randomOffset}px)`;
            spinCount++;

            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);

                // Play stop sound
                soundManager.play('stop');

                const targetPosition = (targetIndex * 100) + 150;
                reel.style.transform = `translateY(-${targetPosition}px)`;
                reel.style.transition = 'transform 0.5s ease-out';

                completedReels++;

                if (completedReels === 3) {
                    soundManager.stop('spin');
                    setTimeout(() => {
                        showResult(targetIndex);
                    }, 500);
                }
            }
        }, 50);
    });
};

const originalShowResult = showResult;
showResult = function (selectedIndex) {
    soundManager.play('win');
    // Copy of original showResult logic to avoid recursion issues if we just wrapped it
    // But since showResult calls initializeSlots which is safe, we can just copy the body or wrap it carefully.
    // To be safe and clean, let's just use the original logic but we need to replace the function entirely 
    // because animateSlots calls the global showResult.

    showCelebration();
    initializeSlots();

    setTimeout(() => {
        const selectedAction = document.getElementById('selectedAction');
        selectedAction.innerHTML = `
                        <div style="font-size: 1.8rem; margin-bottom: 15px;">恭喜抽中：${gameConfig.actions[selectedIndex].name}</div>
                        <div style="font-size: 1rem; color: #e2e8f0;">準備展現甜蜜時刻！</div>
                    `;
        selectedAction.classList.add('show');

        setTimeout(() => {
            showFullscreen(selectedIndex);
        }, 500);

        document.getElementById('actionCount').textContent = actionCount;
        document.getElementById('remainingCount').textContent = getAvailableActions().length;

        if (getAvailableActions().length > 0) {
            document.getElementById('nextButton').style.display = 'inline-block';
        } else {
            selectedAction.innerHTML += '<br><div style="font-size: 1.2rem; margin-top: 15px;">🎉 所有動作都完成了！點擊重設開始新一輪 🎉</div>';
        }

        isSpinning = false;
    }, 1000);
};
