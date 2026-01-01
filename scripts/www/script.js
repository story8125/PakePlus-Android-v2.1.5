// 默认配置
const defaultWastewaterConfig = [
    { name: '大废水桶', time: 750 }, // 12分30秒 = 750秒
    { name: '小废水桶', time: 990 }, // 16分30秒 = 990秒
    { name: '小废水桶', time: 990 },
    { name: '小废水桶', time: 990 },
    { name: '小废水桶', time: 990 }
];

const defaultPurifiedConfig = [
    { name: '大白桶', time: 2400 }, // 40分钟 = 2400秒
    { name: '透明大圆桶', time: 1200 }, // 20分钟 = 1200秒
    { name: '透明小桶', time: 480 }, // 8分钟 = 480秒
    { name: '透明小桶', time: 480 },
    { name: '透明小桶', time: 480 }
];

// 从本地存储加载配置
function loadConfig() {
    const savedWastewater = localStorage.getItem('wastewaterConfig');
    const savedPurified = localStorage.getItem('purifiedConfig');
    const savedMusic = localStorage.getItem('selectedMusic');

    return {
        wastewaterConfig: savedWastewater ? JSON.parse(savedWastewater) : defaultWastewaterConfig,
        purifiedConfig: savedPurified ? JSON.parse(savedPurified) : defaultPurifiedConfig,
        selectedMusic: savedMusic || 'default'
    };
}

// 保存配置到本地存储
function saveConfig(config) {
    localStorage.setItem('wastewaterConfig', JSON.stringify(config.wastewaterConfig));
    localStorage.setItem('purifiedConfig', JSON.stringify(config.purifiedConfig));
    localStorage.setItem('selectedMusic', config.selectedMusic);
}

// 加载配置
let config = loadConfig();
let wastewaterConfig = config.wastewaterConfig;
let purifiedConfig = config.purifiedConfig;
let selectedMusic = config.selectedMusic;

// 音乐文件列表
let musicFiles = [];
let customMusicFiles = []; // 自定义音乐文件列表

// 加载音乐文件列表
function loadMusicFiles() {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    musicList.innerHTML = '';

    // 尝试加载音乐文件夹中的文件
    fetchMusicFiles();
}

// 获取音乐文件（静态列出常见格式）
async function fetchMusicFiles() {
    // 由于浏览器安全限制，无法直接读取文件夹内容
    // 这里列出常见的音乐文件名，用户可以自行添加到music文件夹
    const commonMusicFiles = [
        { name: 'alarm1.mp3', displayName: '闹钟提醒 1' },
        { name: 'alarm2.mp3', displayName: '闹钟提醒 2' },
        { name: 'alarm3.mp3', displayName: '闹钟提醒 3' },
        { name: 'alarm1.wav', displayName: '闹钟提醒 1 (WAV)' },
        { name: 'alarm2.wav', displayName: '闹钟提醒 2 (WAV)' },
        { name: 'bell.mp3', displayName: '清脆铃声' },
        { name: 'morning.mp3', displayName: '早晨铃声' },
        { name: 'gentle.mp3', displayName: '柔和提醒' },
        { name: 'notify.mp3', displayName: '通知提示音' }
    ];

    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    // 添加默认音效选项
    const defaultMusicItem = document.createElement('div');
    defaultMusicItem.className = 'music-item';
    defaultMusicItem.dataset.music = 'default';
    defaultMusicItem.onclick = () => selectMusic('default');

    if (selectedMusic === 'default') {
        defaultMusicItem.classList.add('active');
    }

    defaultMusicItem.innerHTML = `
        <div class="music-icon">🔔</div>
        <div class="music-info">
            <div class="music-name">系统默认音效</div>
            <div class="music-desc">系统默认</div>
        </div>
        <div class="music-check">✓</div>
    `;

    musicList.appendChild(defaultMusicItem);

    // 添加预设音乐文件
    for (const music of commonMusicFiles) {
        // 检查音乐文件是否存在
        const audio = new Audio(`music/${music.name}`);
        const fileExists = await new Promise((resolve) => {
            audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
            audio.addEventListener('error', () => resolve(false), { once: true });
            // 设置超时，避免一直等待
            setTimeout(() => resolve(false), 1000);
        });

        if (fileExists) {
            addMusicItem(music.name, music.displayName, music.name);
        }
    }

    // 加载自定义音乐文件
    loadCustomMusicFiles();
}

// 加载自定义音乐文件
function loadCustomMusicFiles() {
    const savedCustomMusic = localStorage.getItem('customMusicFiles');
    if (savedCustomMusic) {
        customMusicFiles = JSON.parse(savedCustomMusic);
        customMusicFiles.forEach((music, index) => {
            addMusicItem(music.data, music.name, music.fileName, index, true);
        });
    }
}

// 添加音乐项到列表
function addMusicItem(musicData, displayName, fileName, index = 0, isCustom = false) {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    const musicItem = document.createElement('div');
    musicItem.className = 'music-item';

    if (isCustom) {
        musicItem.dataset.music = `custom-${index}`;
        musicItem.dataset.custom = 'true';
        musicItem.onclick = () => selectCustomMusic(index);
    } else {
        musicItem.dataset.music = fileName;
        musicItem.dataset.custom = 'false';
        musicItem.onclick = () => selectMusic(fileName);
    }

    const currentMusic = isCustom ? `custom-${index}` : fileName;
    if (selectedMusic === currentMusic) {
        musicItem.classList.add('active');
    }

    const icon = isCustom ? '🎶' : '🎵';

    musicItem.innerHTML = `
        <div class="music-icon">${icon}</div>
        <div class="music-info">
            <div class="music-name">${displayName}</div>
            <div class="music-desc">${isCustom ? '自定义音乐' : fileName}</div>
        </div>
        <div class="music-check">✓</div>
    `;

    musicList.appendChild(musicItem);
}

// 处理自定义音乐上传
function handleCustomMusicUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
        alert('音乐文件过大，请选择小于10MB的文件');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const musicData = e.target.result;
        const musicName = file.name.replace(/\.[^/.]+$/, ''); // 去除扩展名

        // 添加到自定义音乐列表
        customMusicFiles.push({
            name: musicName,
            fileName: file.name,
            data: musicData
        });

        // 保存到本地存储
        try {
            localStorage.setItem('customMusicFiles', JSON.stringify(customMusicFiles));
        } catch (e) {
            alert('音乐文件太大，无法保存到本地存储');
            customMusicFiles.pop();
            return;
        }

        // 添加到UI
        const index = customMusicFiles.length - 1;
        addMusicItem(musicData, musicName, file.name, index, true);

        // 自动选择新上传的音乐
        selectCustomMusic(index);

        // 清空input
        input.value = '';
    };

    reader.readAsDataURL(file);
}

// 选择自定义音乐
function selectCustomMusic(index) {
    selectedMusic = `custom-${index}`;

    // 更新选中状态
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.music === selectedMusic) {
            item.classList.add('active');
        }
    });

    // 更新select元素
    const musicSelect = document.getElementById('music-select');
    if (musicSelect) {
        // 添加自定义选项
        let customOption = musicSelect.querySelector(`option[value="custom-${index}"]`);
        if (!customOption) {
            customOption = document.createElement('option');
            customOption.value = `custom-${index}`;
            musicSelect.appendChild(customOption);
        }
        musicSelect.value = `custom-${index}`;
    }
}

// 试听当前音乐
function testMusic() {
    playMusic();
    // 5秒后停止
    setTimeout(() => {
        stopMusic();
    }, 5000);
}

// 选择音乐
function selectMusic(music) {
    selectedMusic = music;

    // 更新选中状态
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.music === music) {
            item.classList.add('active');
        }
    });
}

// 切换标签页
function switchTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // 显示选中的标签内容
    document.getElementById(`tab-${tabName}`).style.display = 'block';

    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 废水倒计时状态
let wastewater = {
    currentIndex: 0,
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    interval: null,
    hasStarted: false,
    firstPhaseComplete: false,
    notificationTimer: null
};

// 净水倒计时状态
let purified = {
    currentIndex: 0,
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    interval: null,
    hasStarted: false,
    notificationTimer: null
};

// 音频对象
let audio = null;

// 格式化时间显示
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新废水倒计时显示
function updateWastewaterDisplay() {
    const timeEl = document.getElementById('wastewater-time');
    const labelEl = document.getElementById('wastewater-label');
    const progressEl = document.getElementById('wastewater-progress');
    const statusEl = document.getElementById('wastewater-status');

    if (!wastewater.hasStarted) {
        timeEl.textContent = '--:--';
        labelEl.textContent = '未开始';
        progressEl.style.width = '0%';
        statusEl.textContent = '等待开始';
        statusEl.className = 'status';
        return;
    }

    timeEl.textContent = formatTime(wastewater.currentTime);
    labelEl.textContent = wastewaterConfig[wastewater.currentIndex].name;

    const progress = ((wastewater.totalTime - wastewater.currentTime) / wastewater.totalTime) * 100;
    progressEl.style.width = progress + '%';

    if (wastewater.isRunning) {
        statusEl.textContent = '运行中';
        statusEl.className = 'status running';
    } else {
        statusEl.textContent = '等待操作';
        statusEl.className = 'status';
    }
}

// 更新净水倒计时显示
function updatePurifiedDisplay() {
    const timeEl = document.getElementById('purified-time');
    const labelEl = document.getElementById('purified-label');
    const progressEl = document.getElementById('purified-progress');
    const statusEl = document.getElementById('purified-status');

    if (!purified.hasStarted) {
        timeEl.textContent = '--:--';
        labelEl.textContent = '未开始';
        progressEl.style.width = '0%';
        statusEl.textContent = '等待开始';
        statusEl.className = 'status';
        return;
    }

    timeEl.textContent = formatTime(purified.currentTime);
    labelEl.textContent = purifiedConfig[purified.currentIndex].name;

    const progress = ((purified.totalTime - purified.currentTime) / purified.totalTime) * 100;
    progressEl.style.width = progress + '%';

    if (purified.isRunning) {
        statusEl.textContent = '运行中';
        statusEl.className = 'status running';
    } else {
        statusEl.textContent = '等待操作';
        statusEl.className = 'status';
    }
}

// 播放音乐
function playMusic() {
    stopMusic(); // 先停止当前音乐

    if (selectedMusic === 'default') {
        // 使用系统自带的音效
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('无法播放提示音');
        }
    } else if (selectedMusic.startsWith('custom-')) {
        // 播放自定义音乐
        try {
            const index = parseInt(selectedMusic.replace('custom-', ''));
            if (customMusicFiles[index]) {
                audio = new Audio(customMusicFiles[index].data);
                audio.loop = true;
                audio.play().catch(e => console.log('无法播放音乐:', e));
            }
        } catch (e) {
            console.log('无法播放音乐:', e);
        }
    } else {
        // 播放选定的音乐文件
        try {
            audio = new Audio(`music/${selectedMusic}`);
            audio.loop = true;
            audio.play().catch(e => console.log('无法播放音乐:', e));
        } catch (e) {
            console.log('无法播放音乐:', e);
        }
    }
}

// 停止音乐
function stopMusic() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
    }
}

// 显示提醒弹窗
function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').style.display = 'flex';

    // 播放音乐
    playMusic();
}

// 关闭提醒弹窗
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    stopMusic(); // 停止音乐

    // 如果是"净水装大白桶"的提醒，启动净水倒计时
    if (wastewater.currentIndex === 0 && purified.hasStarted === false) {
        startPurified();
    }
}

// 开始废水倒计时
function startWastewater() {
    if (!wastewater.hasStarted) {
        // 初始开始：大废水桶
        wastewater.hasStarted = true;
        wastewater.currentIndex = 0;
        wastewater.totalTime = wastewaterConfig[0].time;
        wastewater.currentTime = wastewater.totalTime;

        // 设置提前10秒定时提醒
        const notificationTime = wastewater.totalTime - 10;
        if (notificationTime > 0) {
            clearTimeout(wastewater.notificationTimer);
            wastewater.notificationTimer = setTimeout(() => {
                if (wastewater.currentIndex === 0 && wastewater.isRunning) {
                    showModal('净水装大白桶');
                } else if (wastewater.isRunning) {
                    const bucketName = wastewaterConfig[wastewater.currentIndex].name;
                    showModal(`${bucketName}即将装满，请注意`);
                }
            }, notificationTime * 1000);
        }
    }

    wastewater.isRunning = true;
    document.getElementById('wastewater-start').style.display = 'none';
    document.getElementById('wastewater-complete').style.display = 'none';

    wastewater.interval = setInterval(() => {
        if (wastewater.currentTime > 0) {
            wastewater.currentTime--;
            updateWastewaterDisplay();
        } else {
            clearInterval(wastewater.interval);
            clearTimeout(wastewater.notificationTimer);
            wastewater.isRunning = false;
            handleWastewaterComplete();
        }
    }, 1000);

    updateWastewaterDisplay();
}

// 处理废水倒计时完成
function handleWastewaterComplete() {
    const startBtn = document.getElementById('wastewater-start');
    const completeBtn = document.getElementById('wastewater-complete');

    if (wastewater.currentIndex === 0) {
        // 大废水桶完成
        showModal('红色废水桶已满，请更换小废水桶');
        completeBtn.textContent = '更换废水桶后请点击';
        completeBtn.style.display = 'block';
    } else if (wastewater.currentIndex < wastewaterConfig.length - 1) {
        // 小废水桶完成，还有下一个
        showModal('废水已满，请更换水桶');
        completeBtn.textContent = '更换废水桶后请点击';
        completeBtn.style.display = 'block';
    } else {
        // 所有废水桶完成
        showModal('所有废水桶已完成！');
        completeBtn.textContent = '完成';
        completeBtn.style.display = 'block';
    }

    updateWastewaterDisplay();
}

// 完成废水倒计时（用户点击已完成）
function completeWastewater() {
    if (wastewater.currentIndex < wastewaterConfig.length - 1) {
        // 进入下一个桶
        wastewater.currentIndex++;
        wastewater.totalTime = wastewaterConfig[wastewater.currentIndex].time;
        wastewater.currentTime = wastewater.totalTime;
        startWastewater();
    } else {
        // 全部完成
        document.getElementById('wastewater-complete').style.display = 'none';
        showModal('所有废水倒计时已完成！');
    }
}

// 开始净水倒计时
function startPurified() {
    if (!purified.hasStarted) {
        purified.hasStarted = true;
        purified.currentIndex = 0;
        purified.totalTime = purifiedConfig[0].time;
        purified.currentTime = purified.totalTime;
    }

    purified.isRunning = true;
    document.getElementById('purified-start').style.display = 'none';
    document.getElementById('purified-complete').style.display = 'none';

    // 设置提前10秒定时提醒
    const notificationTime = purified.totalTime - 10;
    if (notificationTime > 0 && purified.currentIndex > 0) {
        clearTimeout(purified.notificationTimer);
        purified.notificationTimer = setTimeout(() => {
            if (purified.isRunning) {
                const bucketName = purifiedConfig[purified.currentIndex].name;
                showModal(`${bucketName}即将装满，请注意`);
            }
        }, notificationTime * 1000);
    }

    purified.interval = setInterval(() => {
        if (purified.currentTime > 0) {
            purified.currentTime--;
            updatePurifiedDisplay();
        } else {
            clearInterval(purified.interval);
            clearTimeout(purified.notificationTimer);
            purified.isRunning = false;
            handlePurifiedComplete();
        }
    }, 1000);

    updatePurifiedDisplay();
}

// 处理净水倒计时完成
function handlePurifiedComplete() {
    const completeBtn = document.getElementById('purified-complete');

    if (purified.currentIndex === 0) {
        // 大白桶完成
        showModal('请更换透明大圆桶');
        completeBtn.textContent = '更换透明大圆桶后请点击';
        completeBtn.style.display = 'block';
    } else if (purified.currentIndex === 1) {
        // 透明大圆桶完成
        showModal('请更换透明小桶');
        completeBtn.textContent = '更换透明小桶后请点击';
        completeBtn.style.display = 'block';
    } else if (purified.currentIndex < purifiedConfig.length - 1) {
        // 透明小桶完成，还有下一个
        showModal('请更换透明小桶');
        completeBtn.textContent = '更换透明小桶后请点击';
        completeBtn.style.display = 'block';
    } else {
        // 最后一个透明小桶完成
        showModal('已完成净水，请关闭水源');
        completeBtn.textContent = '已完成';
        completeBtn.style.display = 'block';
    }

    updatePurifiedDisplay();
}

// 完成净水倒计时（用户点击已完成）
function completePurified() {
    if (purified.currentIndex < purifiedConfig.length - 1) {
        // 进入下一个桶
        purified.currentIndex++;
        purified.totalTime = purifiedConfig[purified.currentIndex].time;
        purified.currentTime = purified.totalTime;
        startPurified();
    } else {
        // 全部完成
        document.getElementById('purified-complete').style.display = 'none';
        showCompletionModal();
    }
}

// 显示完成弹窗
function showCompletionModal() {
    document.getElementById('completion-modal').style.display = 'flex';
    playMusic();
}

// 关闭完成弹窗
function closeCompletionModal() {
    document.getElementById('completion-modal').style.display = 'none';
    stopMusic();
}

// 显示设置面板
function showSettings() {
    document.getElementById('settings-modal').style.display = 'flex';
    loadSettingsToForm();
}

// 关闭设置面板
function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

// 加载设置到表单
function loadSettingsToForm() {
    // 废水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input && wastewaterConfig[i]) {
            input.value = (wastewaterConfig[i].time / 60).toFixed(1);
        }
    }

    // 净水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input && purifiedConfig[i]) {
            input.value = (purifiedConfig[i].time / 60).toFixed(1);
        }
    }

    // 更新音乐选择状态
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.music === selectedMusic) {
            item.classList.add('active');
        }
    });
}

// 保存设置
function saveSettings() {
    // 保存废水桶时间 - 将分钟转换为秒
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input) {
            wastewaterConfig[i].time = Math.round(parseFloat(input.value) * 60) || wastewaterConfig[i].time;
        }
    }

    // 保存净水桶时间 - 将分钟转换为秒
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input) {
            purifiedConfig[i].time = Math.round(parseFloat(input.value) * 60) || purifiedConfig[i].time;
        }
    }

    // 保存音乐选择
    const musicSelect = document.getElementById('music-select');
    if (musicSelect) {
        selectedMusic = musicSelect.value;
    }

    // 保存到本地存储
    saveConfig({
        wastewaterConfig,
        purifiedConfig,
        selectedMusic
    });

    closeSettings();
}

// 恢复默认设置
function resetSettings() {
    wastewaterConfig = JSON.parse(JSON.stringify(defaultWastewaterConfig));
    purifiedConfig = JSON.parse(JSON.stringify(defaultPurifiedConfig));
    selectedMusic = 'default';
    customMusicFiles = [];
    localStorage.removeItem('customMusicFiles');
    saveConfig({ wastewaterConfig, purifiedConfig, selectedMusic });
    loadSettingsToForm();
    updateWastewaterDisplay();
    updatePurifiedDisplay();
}

// 前往电池优化设置
function goToBatterySettings() {
    // 尝试多种方式引导用户到电池优化设置
    // 方式1：尝试打开Android设置（如果是在WebView中）
    if (window.Android) {
        // PakePlus或其他WebView可能提供的接口
        try {
            window.Android.openBatteryOptimizationSettings();
            return;
        } catch (e) {
            console.log('无法调用Android接口');
        }
    }

    // 方式2：提示用户手动前往
    alert('请手动前往系统设置\n\n步骤：\n1. 打开手机设置\n2. 找到"应用"或"应用管理"\n3. 找到本应用\n4. 点击"电池"或"电池优化"\n5. 选择"不优化"或"无限制"');
}

// 请求通知权限
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// 显示浏览器通知
function showBrowserNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('净水提醒', {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>'
        });
    }
}

// 页面加载完成后请求通知权限
window.addEventListener('load', () => {
    requestNotificationPermission();
    loadMusicFiles(); // 加载音乐文件列表
    updateWastewaterDisplay();
    updatePurifiedDisplay();
});

// 防止页面关闭时不小心丢失进度
window.addEventListener('beforeunload', (e) => {
    if (wastewater.isRunning || purified.isRunning) {
        e.preventDefault();
        e.returnValue = '';
    }
});
