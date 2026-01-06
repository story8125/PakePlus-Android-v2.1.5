// ========== 净水倒计时默认配置 ==========
const defaultDrainWastewaterTime = 480; // 8分钟 = 480秒（排废水时间）

const defaultWastewaterConfig = [
    { name: '大废水桶', time: 270 }, // 4.5分钟 = 270秒
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

// ========== 滤芯更换提醒默认配置 ==========
// 主滤芯固定配置（不可删除，可设置安装日期）
const defaultMainFilters = [
    { name: 'PP棉1', months: 6, installDate: null, cost: null },
    { name: '颗粒碳', months: 6, installDate: null, cost: null },
    { name: '烧结碳', months: 12, installDate: null, cost: null },
    { name: 'PP棉2', months: 6, installDate: null, cost: null },
    { name: 'RO膜', months: 24, installDate: null, cost: null }
];

// 次滤芯默认配置（可增删）
const defaultSecondaryFilters = [];

// ========== 提醒设置默认配置 ==========
const defaultNotificationSettings = {
    enableSound: true,       // 声音提醒
    enableVibration: false,  // 震动提醒
    enablePersistent: false,    // 持续提醒
    enableStatusBar: false,    // 常驻状态栏
    keepScreenOn: false,      // 保持屏幕常亮
    immediateReminder: true,   // 即刻提醒
    advanceReminderTime: 5   // 提前提醒时间（秒）
};

// ========== 配置加载和保存 ==========
// 从本地存储加载配置
function loadConfig() {
    const savedWastewater = localStorage.getItem('wastewaterConfig');
    const savedPurified = localStorage.getItem('purifiedConfig');
    const savedMusic = localStorage.getItem('selectedMusic');
    const savedMusicName = localStorage.getItem('selectedMusicName'); // 存储音乐显示名称
    const savedMainFilters = localStorage.getItem('mainFilters');
    const savedSecondaryFilters = localStorage.getItem('secondaryFilters');
    const savedFilterHistory = localStorage.getItem('filterHistory');
    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    const savedDrainWastewaterTime = localStorage.getItem('drainWastewaterTime');

    let wastewaterConfig = defaultWastewaterConfig;
    let purifiedConfig = defaultPurifiedConfig;
    let mainFilters = defaultMainFilters;
    let secondaryFilters = defaultSecondaryFilters;
    let filterHistory = [];
    let notificationSettings = { ...defaultNotificationSettings };

    // 安全解析 wastewaterConfig
    if (savedWastewater && savedWastewater !== 'undefined') {
        try {
            const parsed = JSON.parse(savedWastewater);
            if (Array.isArray(parsed) && parsed.length > 0) {
                wastewaterConfig = parsed;
            }
        } catch (e) {
            console.error('解析 wastewaterConfig 失败:', e);
        }
    }

    // 安全解析 purifiedConfig
    if (savedPurified && savedPurified !== 'undefined') {
        try {
            const parsed = JSON.parse(savedPurified);
            if (Array.isArray(parsed) && parsed.length > 0) {
                purifiedConfig = parsed;
            }
        } catch (e) {
            console.error('解析 purifiedConfig 失败:', e);
        }
    }

    // 安全解析 mainFilters
    if (savedMainFilters && savedMainFilters !== 'undefined') {
        try {
            const parsed = JSON.parse(savedMainFilters);
            if (Array.isArray(parsed) && parsed.length > 0) {
                mainFilters = parsed;
            }
        } catch (e) {
            console.error('解析 mainFilters 失败:', e);
        }
    }

    // 安全解析 secondaryFilters
    if (savedSecondaryFilters && savedSecondaryFilters !== 'undefined') {
        try {
            const parsed = JSON.parse(savedSecondaryFilters);
            if (Array.isArray(parsed) && parsed.length >= 0) {
                secondaryFilters = parsed;
            }
        } catch (e) {
            console.error('解析 secondaryFilters 失败:', e);
        }
    }

    // 安全解析 filterHistory
    if (savedFilterHistory && savedFilterHistory !== 'undefined') {
        try {
            const parsed = JSON.parse(savedFilterHistory);
            if (Array.isArray(parsed)) {
                filterHistory = parsed;
            }
        } catch (e) {
            console.error('解析 filterHistory 失败:', e);
        }
    }

    // 安全解析 notificationSettings
    if (savedNotificationSettings && savedNotificationSettings !== 'undefined') {
        try {
            const parsed = JSON.parse(savedNotificationSettings);
            if (parsed) {
                notificationSettings = { ...defaultNotificationSettings, ...parsed };
            }
        } catch (e) {
            console.error('解析 notificationSettings 失败:', e);
        }
    }

    return {
        wastewaterConfig,
        purifiedConfig,
        selectedMusic: savedMusic && savedMusic !== 'undefined' ? savedMusic : 'default',
        selectedMusicName: savedMusicName && savedMusicName !== 'undefined' ? savedMusicName : null,
        mainFilters,
        secondaryFilters,
        filterHistory,
        notificationSettings,
        drainWastewaterTime: savedDrainWastewaterTime ? parseInt(savedDrainWastewaterTime) : defaultDrainWastewaterTime
    };
}

// 保存配置到本地存储
function saveConfig(config) {
    localStorage.setItem('wastewaterConfig', JSON.stringify(config.wastewaterConfig));
    localStorage.setItem('purifiedConfig', JSON.stringify(config.purifiedConfig));
    localStorage.setItem('selectedMusic', config.selectedMusic);
    if (config.selectedMusicName) {
        localStorage.setItem('selectedMusicName', config.selectedMusicName);
    } else {
        localStorage.removeItem('selectedMusicName');
    }
    // 保存滤芯配置
    if (config.mainFilters) {
        localStorage.setItem('mainFilters', JSON.stringify(config.mainFilters));
    } else {
        localStorage.removeItem('mainFilters');
    }
    if (config.secondaryFilters) {
        localStorage.setItem('secondaryFilters', JSON.stringify(config.secondaryFilters));
    } else {
        localStorage.removeItem('secondaryFilters');
    }
    // 保存滤芯历史记录
    if (config.filterHistory) {
        localStorage.setItem('filterHistory', JSON.stringify(config.filterHistory));
    } else {
        localStorage.removeItem('filterHistory');
    }
    // 保存提醒设置
    if (config.notificationSettings) {
        localStorage.setItem('notificationSettings', JSON.stringify(config.notificationSettings));
    } else {
        localStorage.removeItem('notificationSettings');
    }
}

// ========== 净水倒计时全局变量 ==========
let config = loadConfig();
let wastewaterConfig = config.wastewaterConfig;
let purifiedConfig = config.purifiedConfig;
let selectedMusic = config.selectedMusic;
let selectedMusicName = config.selectedMusicName; // 音乐显示名称
let drainWastewaterTime = config.drainWastewaterTime || defaultDrainWastewaterTime; // 排废水时间

// 音乐文件列表
let musicFiles = [];
let customMusicFiles = []; // 自定义音乐文件列表（不再使用优先级系统）
let customMusicFileObjects = []; // 存储 File 对象引用

// ========== 滤芯更换提醒全局变量 ==========
let mainFilters = []; // 主滤芯列表
let secondaryFilters = []; // 次滤芯列表
let filterHistory = []; // 滤芯更换历史记录
let filterConfigModified = false; // 滤芯配置是否被修改
let originalMainFilters = []; // 原始主滤芯列表(用于恢复)
let originalSecondaryFilters = []; // 原始次滤芯列表(用于恢复)
let skipSaveConfirm = false; // 是否跳过保存确认弹窗(点击"放弃修改"后设置)
let modifiedFilters = { main: new Set(), secondary: new Set() }; // 跟踪修改过的滤芯索引

// ========== 提醒设置全局变量 ==========
let notificationSettings = {
    enableSound: true,
    enableVibration: true,
    enablePersistent: false,
    enableStatusBar: false,
    keepScreenOn: false,
    immediateReminder: false,
    advanceReminderTime: 10
};
let persistentReminderInterval = null; // 持续提醒定时器
let wakeLock = null; // 屏幕唤醒锁

// 加载音乐文件列表
async function loadMusicFiles() {
    // 直接从 IndexedDB 加载自定义音乐到 customMusicFiles 数组
    // 不需要依赖 DOM 元素
    await loadCustomMusicFilesFromIndexedDB();

    // 如果音乐列表 DOM 存在（设置面板已打开），则更新显示
    const musicList = document.getElementById('music-list');
    if (musicList) {
        musicList.innerHTML = '';
        // 尝试加载音乐文件夹中的文件
        await fetchMusicFiles();
    }
}

// 获取音乐文件（静态列出常见格式）
async function fetchMusicFiles() {
    // 由于浏览器安全限制，无法直接读取文件夹内容
    // 移除预设音乐文件检测，只保留系统默认音效和自定义音乐

    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    // 添加默认音效选项
    const defaultMusicItem = document.createElement('div');
    defaultMusicItem.className = 'music-item';
    defaultMusicItem.dataset.music = 'default';
    defaultMusicItem.dataset.custom = 'false';
    defaultMusicItem.onclick = () => selectMusicForDisplay('default', '系统默认音效', false);

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

    // 只添加自定义音乐文件到列表
    addCustomMusicItemsToList();

    // 恢复选中的音乐高亮状态
    restoreSelectedMusicState();
}

// 从 IndexedDB 加载自定义音乐文件到 customMusicFiles 数组
async function loadCustomMusicFilesFromIndexedDB() {
    // 确保 IndexedDB 已初始化
    if (!db) {
        try {
            await initIndexedDB();
        } catch (e) {
            console.error('IndexedDB 初始化失败:', e);
            return;
        }
    }

    try {
        // 从 IndexedDB 加载所有音频文件
        const audioFiles = await loadAudioFromIndexedDB();

        // 清空当前自定义音乐列表
        customMusicFiles = [];

        // 重新构建音乐列表（不再使用优先级排序）
        audioFiles.forEach((audioFile, index) => {
            const musicData = URL.createObjectURL(audioFile.data);
            const displayName = audioFile.name.replace(/\.[^/.]+$/, ''); // 移除文件扩展名
            customMusicFiles.push({
                id: audioFile.id,
                name: displayName, // 显示名称
                originalName: audioFile.name, // 原始文件名
                fileName: displayName, // 使用显示名称作为标识
                data: musicData,
                size: audioFile.size
            });
        });

        console.log('从 IndexedDB 加载音乐文件成功，数量:', customMusicFiles.length);
    } catch (e) {
        console.error('加载自定义音乐失败:', e);
    }
}

// 加载自定义音乐文件（废弃，使用新的 cleanAndLoadMusicFiles）
function loadCustomMusicFiles() {
    // 此函数已被 cleanAndLoadMusicFiles 替代
    // 保留是为了兼容性
}

// 添加音乐项到列表
function addMusicItem(musicData, displayName, fileName, index = -1, isCustom = false) {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    const musicItem = document.createElement('div');
    musicItem.className = 'music-item';
    musicItem.dataset.music = fileName;
    musicItem.dataset.custom = isCustom.toString();

    if (isCustom && index >= 0) {
        musicItem.dataset.index = index;
    }

    // 点击即选择
    musicItem.onclick = (e) => {
        // 如果点击的是删除按钮,不触发选择
        if (e.target.classList.contains('music-delete-btn')) return;
        // 点击即选择，但不自动保存
        selectMusicForDisplay(fileName, displayName, isCustom);
    };

    const icon = isCustom ? '🎶' : '🎵';

    musicItem.innerHTML = `
        <div class="music-icon">${icon}</div>
        <div class="music-info">
            <div class="music-name">${displayName}</div>
            <div class="music-desc">${isCustom ? '自定义音乐' : fileName}</div>
        </div>
        ${isCustom ? `<button class="music-delete-btn" onclick="deleteCustomMusic(${index}, '${fileName}')">🗑️</button>` : ''}
        <div class="music-check">✓</div>
    `;

    musicList.appendChild(musicItem);
}

// 删除自定义音乐
async function deleteCustomMusic(index, fileName) {
    try {
        const music = customMusicFiles[index];
        if (music && music.id) {
            // 从 IndexedDB 删除
            await deleteAudioFromIndexedDB(music.id);
        }

        // 从数组中移除
        customMusicFiles.splice(index, 1);

        // 重新加载列表
        await cleanAndLoadMusicFiles();

        // 如果删除的是当前选中的音乐,切换回默认音效
        if (selectedMusic === fileName) {
            selectMusicForDisplay('default', '系统默认音效', false);
        }

        console.log('音乐删除成功');
    } catch (e) {
        console.error('删除音乐失败:', e);
    }
}

// IndexedDB 数据库名称和版本
const DB_NAME = 'WaterPurifierMusicDB';
const DB_VERSION = 1;
let db = null;

// 初始化 IndexedDB
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('无法打开数据库');
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('数据库打开成功');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            // 创建音乐存储对象
            if (!database.objectStoreNames.contains('music')) {
                database.createObjectStore('music', { keyPath: 'id', autoIncrement: true });
            }
            console.log('数据库升级成功');
        };
    });
}

// 保存音频文件到 IndexedDB
function saveAudioToIndexedDB(file) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('数据库未初始化'));
            return;
        }

        try {
            const transaction = db.transaction(['music'], 'readwrite');
            const store = transaction.objectStore('music');
            const request = store.add({
                name: file.name,
                data: file,
                size: file.size,
                uploadTime: new Date().toISOString()
            });

            request.onsuccess = () => {
                console.log('音频文件保存成功，ID:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('音频文件保存失败:', request.error);
                reject(request.error);
            };

            transaction.onerror = () => {
                console.error('事务失败:', transaction.error);
                reject(transaction.error);
            };
        } catch (e) {
            console.error('创建事务失败:', e);
            reject(e);
        }
    });
}

// 从 IndexedDB 加载所有音频文件
function loadAudioFromIndexedDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve([]);
            return;
        }

        try {
            const transaction = db.transaction(['music'], 'readonly');
            const store = transaction.objectStore('music');
            const request = store.getAll();

            request.onsuccess = () => {
                console.log('加载到音频文件数量:', request.result.length);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('加载音频文件失败:', request.error);
                reject(request.error);
            };

            transaction.onerror = () => {
                console.error('事务失败:', transaction.error);
                reject(transaction.error);
            };
        } catch (e) {
            console.error('创建事务失败:', e);
            reject(e);
        }
    });
}

// 从 IndexedDB 删除音频文件
function deleteAudioFromIndexedDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('数据库未初始化'));
            return;
        }

        try {
            const transaction = db.transaction(['music'], 'readwrite');
            const store = transaction.objectStore('music');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('音频文件删除成功，ID:', id);
                resolve();
            };

            request.onerror = () => {
                console.error('音频文件删除失败:', request.error);
                reject(request.error);
            };

            transaction.onerror = () => {
                console.error('事务失败:', transaction.error);
                reject(transaction.error);
            };
        } catch (e) {
            console.error('创建事务失败:', e);
            reject(e);
        }
    });
}

// 处理自定义音乐上传
async function handleCustomMusicUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // 初始化数据库
    if (!db) {
        try {
            await initIndexedDB();
        } catch (e) {
            console.error('数据库初始化失败:', e);
            showUploadError('存储初始化失败');
            return;
        }
    }

    // 检查是否已有相同文件
    const existingIndex = customMusicFiles.findIndex(m => m.originalName === file.name);
    if (existingIndex !== -1) {
        showUploadError('文件已存在');
        return;
    }

    // 保存到 IndexedDB
    let dbId;
    try {
        dbId = await saveAudioToIndexedDB(file);
    } catch (e) {
        console.error('保存音频失败:', e);
        showUploadError('保存失败，空间不足');
        return;
    }

    // 新音乐添加到列表
    const musicData = URL.createObjectURL(file);
    const displayName = file.name.replace(/\.[^/.]+$/, ''); // 移除文件扩展名
    const newMusic = {
        id: dbId,
        name: displayName, // 显示名称
        originalName: file.name, // 原始文件名
        fileName: displayName, // 使用显示名称作为标识
        data: musicData,
        size: file.size
    };

    // 添加到数组
    customMusicFiles.push(newMusic);

    // 直接添加到UI列表（不再调用 cleanAndLoadMusicFiles）
    const musicList = document.getElementById('music-list');
    if (musicList) {
        const index = customMusicFiles.length - 1;
        addMusicItem(musicData, displayName, displayName, index, true);
        // 清除之前的选中状态
        document.querySelectorAll('.music-item').forEach(item => {
            item.classList.remove('active');
        });
        // 高亮显示新上传的音乐
        const newItem = musicList.lastElementChild;
        if (newItem) {
            newItem.classList.add('active');
        }
        // 同步临时变量
        tempSelectedMusic = displayName;
        tempSelectedMusicName = displayName;
        tempIsCustomMusic = true;
    }

    // 清空input
    input.value = '';

    // 显示成功提示
    showUploadSuccess();

    console.log('音乐上传成功:', displayName);
}

// 显示上传错误
function showUploadError(message) {
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        uploadContainer.style.borderColor = '#e74c3c';
        const uploadText = document.querySelector('.upload-text');
        if (uploadText) {
            uploadText.textContent = message;
            setTimeout(() => {
                uploadText.textContent = '选择文件';
                uploadContainer.style.borderColor = '#e0e0e0';
            }, 2000);
        }
    }
}

// 保存所有音乐的优先级到 IndexedDB
async function saveAllMusicPriorities() {
    if (!db) {
        console.error('数据库未初始化');
        return;
    }

    // 更新 IndexedDB 中的音乐数据,添加 priorityName
    for (let i = 0; i < customMusicFiles.length; i++) {
        const music = customMusicFiles[i];
        music.priorityName = `音乐${i + 1}`;
        music.fileName = `a${i + 1}`;

        try {
            // 更新 IndexedDB
            const transaction = db.transaction(['music'], 'readwrite');
            const store = transaction.objectStore('music');

            const request = store.put({
                id: music.id,
                name: music.originalName, // 保持原始文件名
                data: await getFileFromBlobUrl(music.data), // 重新获取File对象
                size: music.size,
                uploadTime: new Date().toISOString(),
                priorityName: music.priorityName,
                priorityFileName: music.fileName
            });

            await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });

            transaction.onerror = () => {
                console.error('事务失败:', transaction.error);
                throw transaction.error;
            };
        } catch (e) {
            console.error('保存音乐优先级失败:', e);
        }
    }
}

// 从 Blob URL 获取 File 对象
async function getFileFromBlobUrl(blobUrl) {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const filename = 'temp.' + blob.type.split('/')[1];
        return new File([blob], filename, { type: blob.type });
    } catch (e) {
        console.error('获取文件失败:', e);
        return null;
    }
}

// 显示上传成功提示
function showUploadSuccess() {
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        uploadContainer.style.borderColor = '#27ae60';
        uploadContainer.style.background = 'rgba(39, 174, 96, 0.1)';
        const uploadText = document.querySelector('.upload-text');
        if (uploadText) {
            uploadText.textContent = '上传成功 ✓';
            setTimeout(() => {
                uploadText.textContent = '选择文件';
                uploadContainer.style.borderColor = '#e0e0e0';
                uploadContainer.style.background = '#f8f9fa';
            }, 2000);
        }
    }
}

// 选择音乐（用于显示高亮，不保存）
function selectMusicForDisplay(fileName, displayName, isCustom) {
    // 只更新全局变量用于临时显示，不保存到 localStorage
    tempSelectedMusic = fileName;
    tempSelectedMusicName = displayName;
    tempIsCustomMusic = isCustom;

    // 更新选中状态（高亮显示）
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.music === fileName) {
            item.classList.add('active');
        }
    });

    console.log('已选择音乐（暂未保存）:', fileName, displayName);
}

// 试听当前音乐
function testMusic() {
    initAudioContext(); // 确保音频上下文已激活

    // 使用临时变量进行试听
    const originalSelectedMusic = selectedMusic;
    const originalSelectedMusicName = selectedMusicName;

    // 临时使用当前选择的音乐
    selectedMusic = tempSelectedMusic;
    selectedMusicName = tempSelectedMusicName;

    console.log('试听音乐 - tempSelectedMusic:', tempSelectedMusic, 'tempSelectedMusicName:', tempSelectedMusicName);

    playMusic();

    // 恢复原始选择
    selectedMusic = originalSelectedMusic;
    selectedMusicName = originalSelectedMusicName;

    // 10秒后停止
    setTimeout(() => {
        stopMusic();
    }, 10000);
}

// 临时选择变量（用于显示，不保存）
let tempSelectedMusic = selectedMusic;
let tempSelectedMusicName = selectedMusicName;
let tempIsCustomMusic = false;

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

// 排废水倒计时状态
let drainWastewater = {
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    interval: null,
    hasStarted: false,
    notificationTimer: null,
    hasShownNotification: false
};

// 废水倒计时状态
let wastewater = {
    currentIndex: 0,
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    interval: null,
    hasStarted: false,
    firstPhaseComplete: false,
    notificationTimer: null,
    hasShownCompletionModal: false,  // 标记是否已显示完成弹窗
    hasShownNotification: false  // 标记是否已显示过提醒
};

// 全局标记：整个流程是否已显示完成弹窗
let hasShownGlobalCompletionModal = false;

// 净水倒计时状态
let purified = {
    currentIndex: 0,
    currentTime: 0,
    totalTime: 0,
    isRunning: false,
    interval: null,
    hasStarted: false,
    notificationTimer: null,
    hasShownCompletionModal: false,  // 标记是否已显示完成弹窗
    hasShownNotification: false  // 标记是否已显示过提醒
};

// 音频对象
let audio = null;

// 格式化时间显示
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新圆形进度条
function updateCircularProgress(prefix, progress) {
    const circle = document.getElementById(`${prefix}-progress-ring`);
    if (!circle) return;

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

// 检查废水是否全部完成
function isWastewaterAllComplete() {
    return wastewater.hasStarted && wastewater.currentIndex >= wastewaterConfig.length - 1 && !wastewater.isRunning;
}

// 检查净水是否全部完成
function isPurifiedAllComplete() {
    return purified.hasStarted && purified.currentIndex >= purifiedConfig.length - 1 && !purified.isRunning;
}

// 更新废水倒计时显示
function updateWastewaterDisplay() {
    const timeEl = document.getElementById('wastewater-time');
    const labelEl = document.getElementById('wastewater-label');
    const statusEl = document.getElementById('wastewater-status');

    // 如果废水全部完成
    if (isWastewaterAllComplete()) {
        timeEl.style.display = 'none';
        labelEl.textContent = '已完成';
        labelEl.style.display = 'block';
        labelEl.className = 'label completed';
        statusEl.style.display = 'none';
        updateCircularProgress('wastewater', 100);  // 改为100，使圆圈变为红色（废水主题色）
        return;
    }

    if (drainWastewater.hasStarted && !wastewater.hasStarted) {
        // 排废水阶段
        timeEl.textContent = formatTime(drainWastewater.currentTime);
        labelEl.textContent = '排废水中';
        timeEl.style.display = 'block';
        labelEl.style.display = 'block';
        labelEl.className = 'label';

        const progress = ((drainWastewater.totalTime - drainWastewater.currentTime) / drainWastewater.totalTime) * 100;
        updateCircularProgress('wastewater', progress);

        if (drainWastewater.isRunning) {
            statusEl.textContent = '运行中';
            statusEl.className = 'status running';
            statusEl.style.display = 'inline';
        } else {
            statusEl.textContent = '等待操作';
            statusEl.className = 'status';
            statusEl.style.display = 'inline';
        }
        return;
    }

    if (!wastewater.hasStarted) {
        timeEl.textContent = '--:--';
        labelEl.textContent = '未开始';
        timeEl.style.display = 'none';  // 隐藏倒计时
        labelEl.style.display = 'block';
        labelEl.className = 'label';
        labelEl.style.fontSize = '16px';  // 与标题字体大小一致
        labelEl.style.fontWeight = '600';  // 与标题字重一致
        updateCircularProgress('wastewater', 0);
        statusEl.textContent = '等待开始';
        statusEl.className = 'status';
        statusEl.style.display = 'inline';
        return;
    }

    timeEl.textContent = formatTime(wastewater.currentTime);
    labelEl.textContent = wastewaterConfig[wastewater.currentIndex].name;
    timeEl.style.display = 'block';
    labelEl.style.display = 'block';
    labelEl.className = 'label';

    const progress = ((wastewater.totalTime - wastewater.currentTime) / wastewater.totalTime) * 100;
    updateCircularProgress('wastewater', progress);

    if (wastewater.isRunning) {
        statusEl.textContent = '运行中';
        statusEl.className = 'status running';
        statusEl.style.display = 'inline';
    } else {
        statusEl.textContent = '等待操作';
        statusEl.className = 'status';
        statusEl.style.display = 'inline';
    }
}

// 更新净水倒计时显示
function updatePurifiedDisplay() {
    const timeEl = document.getElementById('purified-time');
    const labelEl = document.getElementById('purified-label');
    const statusEl = document.getElementById('purified-status');

    // 如果净水全部完成
    if (isPurifiedAllComplete()) {
        timeEl.style.display = 'none';
        labelEl.textContent = '已完成';
        labelEl.style.display = 'block';
        labelEl.className = 'label completed';
        statusEl.style.display = 'none';
        updateCircularProgress('purified', 100);  // 改为100，使圆圈变为蓝色
        return;
    }

    if (!purified.hasStarted) {
        timeEl.textContent = '--:--';
        labelEl.textContent = '未开始';
        timeEl.style.display = 'none';  // 隐藏倒计时
        labelEl.style.display = 'block';
        labelEl.className = 'label';
        labelEl.style.fontSize = '16px';  // 与标题字体大小一致
        labelEl.style.fontWeight = '600';  // 与标题字重一致
        updateCircularProgress('purified', 0);
        statusEl.textContent = '等待开始';
        statusEl.className = 'status';
        statusEl.style.display = 'inline';
        return;
    }

    timeEl.textContent = formatTime(purified.currentTime);
    labelEl.textContent = purifiedConfig[purified.currentIndex].name;
    timeEl.style.display = 'block';
    labelEl.style.display = 'block';
    labelEl.className = 'label';

    const progress = ((purified.totalTime - purified.currentTime) / purified.totalTime) * 100;
    updateCircularProgress('purified', progress);

    if (purified.isRunning) {
        statusEl.textContent = '运行中';
        statusEl.className = 'status running';
        statusEl.style.display = 'inline';
    } else {
        statusEl.textContent = '等待操作';
        statusEl.className = 'status';
        statusEl.style.display = 'inline';
    }
}

// 播放音乐
function playMusic() {
    stopMusic(); // 先停止当前音乐

    // 检查是否启用声音提醒
    if (!notificationSettings.enableSound) {
        console.log('声音提醒已关闭');
        return;
    }

    // 确保音频上下文已激活
    initAudioContext();

    console.log('尝试播放音乐，selectedMusic:', selectedMusic, 'selectedMusicName:', selectedMusicName);

    if (selectedMusic === 'default' || !selectedMusic) {
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
            console.log('播放系统默认音效');
        } catch (e) {
            console.log('无法播放提示音');
            playSystemBeep();
        }
    } else {
        // 播放自定义音乐
        try {
            // 根据 selectedMusicName 查找音乐
            const musicIndex = customMusicFiles.findIndex(m => m.name === selectedMusicName);
            console.log('查找到的音乐索引:', musicIndex);
            console.log('自定义音乐列表:', customMusicFiles.map(m => ({ name: m.name, id: m.id })));

            if (musicIndex !== -1 && customMusicFiles[musicIndex]) {
                // 重新创建Blob URL（可能手机端URL失效）
                const music = customMusicFiles[musicIndex];
                console.log('音乐数据类型:', music.data);

                audio = new Audio(music.data);
                audio.loop = true;
                audio.muted = false;
                audio.volume = 1.0;

                audio.play().then(() => {
                    console.log('音乐播放成功:', selectedMusicName);
                }).catch(e => {
                    console.log('无法播放音乐:', e);
                    // 如果播放失败,使用系统提示音作为备选
                    playSystemBeep();
                });
            } else {
                // 没有找到音乐,使用系统提示音
                console.log('未找到选中的音乐:', selectedMusicName);
                playSystemBeep();
            }
        } catch (e) {
            console.log('无法播放音乐:', e);
            playSystemBeep();
        }
    }
}

// 播放系统提示音(备选方案)
function playSystemBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 880;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('无法播放系统提示音');
    }
}

// 震动提醒
function vibrate() {
    // 检查是否启用震动提醒
    if (!notificationSettings.enableVibration) {
        console.log('震动提醒已关闭');
        return;
    }

    // 优先使用 HBuilderX 的 plus API
    if (window.plus && plus.device && plus.device.vibrate) {
        try {
            // HBuilderX 5+ API 震动
            plus.device.vibrate(300);
            console.log('HBuilderX 震动调用成功');
        } catch (e) {
            console.log('HBuilderX 震动调用失败:', e);
            // 失败则尝试浏览器震动
            fallbackBrowserVibrate();
        }
    } else {
        // 使用浏览器震动
        fallbackBrowserVibrate();
    }
}

// 浏览器震动备选方案
function fallbackBrowserVibrate() {
    if (navigator.vibrate) {
        try {
            // 震动3秒: 300ms震动,100ms停止,循环
            const pattern = [300, 100, 300, 100, 300, 100, 300, 100, 300, 100];
            const result = navigator.vibrate(pattern);
            console.log('浏览器震动调用结果:', result);

            // 如果返回false,尝试简单的持续震动
            if (result === false) {
                navigator.vibrate(3000);
            }
        } catch (e) {
            console.log('震动功能不可用:', e);
        }
    } else {
        console.log('设备不支持震动功能');
    }
}

// 持续震动提醒(在弹窗显示期间重复震动)
let vibrationInterval = null;
function startVibrationLoop() {
    // 立即震动一次
    vibrate();

    // 每隔2秒震动一次,直到弹窗关闭
    vibrationInterval = setInterval(() => {
        vibrate();
    }, 2000);
}

// 停止震动循环
function stopVibrationLoop() {
    if (vibrationInterval) {
        clearInterval(vibrationInterval);
        vibrationInterval = null;
    }
    // 停止当前的震动
    if (window.plus && plus.device) {
        try {
            plus.device.vibrate(0);
        } catch (e) {
            console.log('停止震动失败:', e);
        }
    } else if (navigator.vibrate) {
        navigator.vibrate(0);
    }
}

// 停止单次震动
function stopSingleVibration() {
    // 停止当前的震动（不停止循环）
    if (window.plus && plus.device) {
        try {
            plus.device.vibrate(0);
        } catch (e) {
            console.log('停止震动失败:', e);
        }
    } else if (navigator.vibrate) {
        navigator.vibrate(0);
    }
}

// 启动持续提醒
function startPersistentReminder() {
    // 先停止之前的持续提醒
    stopPersistentReminder();

    // 每隔30秒重复提醒
    persistentReminderInterval = setInterval(() => {
        playMusic();
        vibrate();
        console.log('持续提醒触发');
    }, 30000);
}

// 停止持续提醒
function stopPersistentReminder() {
    if (persistentReminderInterval) {
        clearInterval(persistentReminderInterval);
        persistentReminderInterval = null;
        console.log('持续提醒已停止');
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
    if (notificationSettings.enableSound) {
        playMusic();
    }

    // 单次震动（仅在弹窗显示时震动一次）
    if (notificationSettings.enableVibration) {
        vibrate();
    }

    // 启动持续提醒
    if (notificationSettings.enablePersistent) {
        startPersistentReminder();
    }

    // 视觉提醒:闪烁相关计时器区域
    if (wastewater.isRunning || drainWastewater.isRunning) {
        const wastewaterSection = document.querySelector('.timer-section.wastewater');
        if (wastewaterSection) {
            wastewaterSection.classList.add('flash-warning', 'pulse-warning');
            // 6秒后移除动画
            setTimeout(() => {
                wastewaterSection.classList.remove('flash-warning', 'pulse-warning');
            }, 6000);
        }
    }

    if (purified.isRunning) {
        const purifiedSection = document.querySelector('.timer-section.purified');
        if (purifiedSection) {
            purifiedSection.classList.add('flash-warning', 'pulse-warning');
            // 6秒后移除动画
            setTimeout(() => {
                purifiedSection.classList.remove('flash-warning', 'pulse-warning');
            }, 6000);
        }
    }
}

// 关闭提醒弹窗
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    stopMusic(); // 停止音乐
    stopSingleVibration(); // 停止单次震动
    stopVibrationLoop(); // 停止震动循环
    stopPersistentReminder(); // 停止持续提醒

    // 如果是大废水桶完成（当前正在大废水桶阶段且弹窗是"净水装大白桶"），启动净水倒计时
    if (wastewater.hasStarted === true && wastewater.currentIndex === 0 && purified.hasStarted === false) {
        // 显示"净水开始后请点击"按钮
        const confirmBtn = document.getElementById('purified-start-confirm');
        if (confirmBtn) {
            confirmBtn.style.display = 'block';
        }
    }

    // 如果是大白桶完成（当前是大白桶阶段且弹窗是"请更换透明大圆桶"）
    if (purified.hasStarted === true && purified.currentIndex === 0) {
        // 显示"更换透明大圆桶后请点击"按钮
        const completeBtn = document.getElementById('purified-complete');
        if (completeBtn) {
            completeBtn.textContent = '更换透明大圆桶后请点击';
            completeBtn.style.display = 'block';
        }
    }

    // 如果是大废水桶完成（当前是大废水桶阶段且弹窗是"红色废水桶已满"）
    if (wastewater.hasStarted === true && wastewater.currentIndex === 0 && purified.hasStarted === true) {
        // 显示"更换废水桶后请点击"按钮（在废水倒计时区域）
        const completeBtn = document.getElementById('wastewater-complete');
        if (completeBtn) {
            completeBtn.textContent = '更换废水桶后请点击';
            completeBtn.style.display = 'block';
        }
    }
}

// 开始废水倒计时
function startWastewater() {
    // 清除可能存在的旧定时器
    if (wastewater.interval) {
        clearInterval(wastewater.interval);
        wastewater.interval = null;
    }
    if (drainWastewater.interval) {
        clearInterval(drainWastewater.interval);
        drainWastewater.interval = null;
    }

    // 重置全局完成弹窗标记（新的废水流程开始）
    hasShownGlobalCompletionModal = false;

    // 重置提醒标记
    wastewater.hasShownNotification = false;

    // 如果 wastewater 已经开始过，说明是从大废水桶切换到小废水桶，不要再进入排废水阶段
    if (wastewater.hasStarted && !drainWastewater.hasStarted) {
        // 直接进入倒计时
        wastewater.isRunning = true;
        document.getElementById('wastewater-start').style.display = 'none';
        document.getElementById('wastewater-complete').style.display = 'none';

        // 设置提醒
        setupWastewaterNotification();

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
        return;
    }

    if (!drainWastewater.hasStarted) {
        // 先进入排废水阶段（只在第一次点击"开始"时执行）
        drainWastewater.hasStarted = true;
        drainWastewater.hasShownNotification = false; // 重置提醒标记
        drainWastewater.totalTime = drainWastewaterTime;
        drainWastewater.currentTime = drainWastewater.totalTime;

        // 设置排废水提醒
        setupDrainWastewaterNotification();

        drainWastewater.isRunning = true;
        document.getElementById('wastewater-start').style.display = 'none';

        drainWastewater.interval = setInterval(() => {
            if (drainWastewater.currentTime > 0) {
                drainWastewater.currentTime--;
                updateWastewaterDisplay();
            } else {
                clearInterval(drainWastewater.interval);
                clearTimeout(drainWastewater.notificationTimer);
                drainWastewater.isRunning = false;
                drainWastewater.hasStarted = false;
                handleDrainWastewaterComplete();
            }
        }, 1000);

        updateWastewaterDisplay();
        return;
    }

    if (!wastewater.hasStarted) {
        // 初始开始：大废水桶
        wastewater.hasStarted = true;
        wastewater.currentIndex = 0;
        wastewater.totalTime = wastewaterConfig[0].time;
        wastewater.currentTime = wastewater.totalTime;

        // 设置提醒
        setupWastewaterNotification();
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

// 设置排废水倒计时提醒
function setupDrainWastewaterNotification() {
    clearTimeout(drainWastewater.notificationTimer);

    // 即刻提醒：不设置提前提醒定时器，只在倒计时结束时通过 handleDrainWastewaterComplete 显示完成弹窗
    if (notificationSettings.immediateReminder) {
        console.log('即刻提醒模式，不设置排废水提前提醒');
        return;
    }

    // 提前提醒：在排废水结束前提前设定秒数提醒
    const notificationTime = drainWastewater.totalTime - notificationSettings.advanceReminderTime;
    console.log('设置排废水提前提醒:', notificationTime, '秒（总时长:', drainWastewater.totalTime, '秒，提前:', notificationSettings.advanceReminderTime, '秒）');

    if (notificationTime > 0) {
        drainWastewater.notificationTimer = setTimeout(() => {
            if (drainWastewater.isRunning) {
                showDrainWastewaterReminder();
            }
        }, notificationTime * 1000);
    } else {
        // 如果提前时间大于等于总时长，则在开始时提醒
        drainWastewater.notificationTimer = setTimeout(() => {
            if (drainWastewater.isRunning) {
                showDrainWastewaterReminder();
            }
        }, 0);
    }
}

// 显示排废水倒计时提醒
function showDrainWastewaterReminder() {
    // 防止重复提醒
    if (drainWastewater.hasShownNotification) {
        console.log('排废水倒计时提醒已显示，跳过重复提醒');
        return;
    }
    drainWastewater.hasShownNotification = true;
    showModal('即将完成清洗，请准备净水');
}

// 处理排废水完成
function handleDrainWastewaterComplete() {
    // 如果使用提前提醒模式且已经显示过提醒，就不再显示完成弹窗
    if (!notificationSettings.immediateReminder && drainWastewater.hasShownNotification) {
        console.log('提前提醒模式下已显示提醒，跳过完成弹窗');
        drainWastewater.hasShownNotification = false;

        // 立即显示"净水开始后请点击"按钮
        const confirmBtn = document.getElementById('purified-start-confirm');
        if (confirmBtn) {
            confirmBtn.style.display = 'block';
        }

        // 无论用户是否点击"确定"，都立刻开始大废水桶倒计时
        setTimeout(() => {
            startMainWastewater();
        }, 1000);
        return;
    }

    // 即刻提醒模式：显示完成弹窗
    showModal('已完成清洗，请开始净水');

    // 立即显示"净水开始后请点击"按钮
    const confirmBtn = document.getElementById('purified-start-confirm');
    if (confirmBtn) {
        confirmBtn.style.display = 'block';
    }

    // 无论用户是否点击"确定"，都立刻开始大废水桶倒计时
    setTimeout(() => {
        startMainWastewater();
    }, 1000);
}

// 开始大废水桶倒计时（从排废水阶段切换过来）
function startMainWastewater() {
    // 清除可能存在的旧定时器
    if (wastewater.interval) {
        clearInterval(wastewater.interval);
        wastewater.interval = null;
    }

    wastewater.hasStarted = true;
    wastewater.currentIndex = 0;
    wastewater.totalTime = wastewaterConfig[0].time;
    wastewater.currentTime = wastewater.totalTime;

    // 设置提醒
    setupWastewaterNotification();

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

// 设置废水倒计时提醒
function setupWastewaterNotification() {
    clearTimeout(wastewater.notificationTimer);

    // 即刻提醒：不设置提前提醒定时器，只在倒计时结束时通过 handleWastewaterComplete 显示完成弹窗
    if (notificationSettings.immediateReminder) {
        console.log('即刻提醒模式，不设置提前提醒');
        return;
    }

    // 提前提醒：在倒计时结束前提前设定秒数提醒
    const notificationTime = wastewater.totalTime - notificationSettings.advanceReminderTime;
    console.log('设置提前提醒:', notificationTime, '秒（总时长:', wastewater.totalTime, '秒，提前:', notificationSettings.advanceReminderTime, '秒）');

    if (notificationTime > 0) {
        wastewater.notificationTimer = setTimeout(() => {
            if (wastewater.isRunning) {
                showWastewaterReminder();
            }
        }, notificationTime * 1000);
    } else {
        // 如果提前时间大于等于总时长，则在开始时提醒
        wastewater.notificationTimer = setTimeout(() => {
            if (wastewater.isRunning) {
                showWastewaterReminder();
            }
        }, 0);
    }
}

// 显示废水倒计时提醒
function showWastewaterReminder() {
    // 防止重复提醒
    if (wastewater.hasShownNotification) {
        console.log('废水倒计时提醒已显示，跳过重复提醒');
        return;
    }
    wastewater.hasShownNotification = true;

    // 显示所有桶的提醒（包括大废水桶）
    const bucketName = wastewaterConfig[wastewater.currentIndex].name;
    showModal(`${bucketName}即将装满，请注意`);
}

// 处理废水倒计时完成
function handleWastewaterComplete() {
    const startBtn = document.getElementById('wastewater-start');
    const completeBtn = document.getElementById('wastewater-complete');

    // 防止重复显示弹窗
    if (wastewater.hasShownCompletionModal) {
        console.log('完成弹窗已显示，跳过重复显示');
        return;
    }
    wastewater.hasShownCompletionModal = true;

    // 如果使用提前提醒模式且已经显示过提醒，就不再显示完成弹窗
    if (!notificationSettings.immediateReminder && wastewater.hasShownNotification) {
        console.log('提前提醒模式下已显示提醒，跳过完成弹窗');
        wastewater.hasShownNotification = false;

        // 仍然需要显示完成按钮
        if (wastewater.currentIndex === 0) {
            completeBtn.textContent = '更换废水桶后请点击';
            completeBtn.style.display = 'block';
        } else if (wastewater.currentIndex < wastewaterConfig.length - 1) {
            completeBtn.textContent = '更换废水桶后请点击';
            completeBtn.style.display = 'block';
        }

        updateWastewaterDisplay();
        return;
    }

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
        // 【删除】"所有废水桶已完成！"弹窗和"完成"按钮
        console.log('[已删除] 所有废水桶完成弹窗和按钮');
        completeBtn.style.display = 'none';  // 不显示完成按钮
        updateWastewaterDisplay();  // 更新显示为"已完成"
        return;
        // showModal('所有废水桶已完成！');
    }

    updateWastewaterDisplay();
}

// 完成废水倒计时（用户点击已完成）
function completeWastewater() {
    // 重置弹窗标记，允许下一个桶显示弹窗
    wastewater.hasShownCompletionModal = false;
    // 重置提醒标记，允许下一个桶显示提醒
    wastewater.hasShownNotification = false;

    if (wastewater.currentIndex < wastewaterConfig.length - 1) {
        // 进入下一个桶
        wastewater.currentIndex++;
        wastewater.totalTime = wastewaterConfig[wastewater.currentIndex].time;
        wastewater.currentTime = wastewater.totalTime;
        startWastewater();
    } else {
        // 全部完成
        document.getElementById('wastewater-complete').style.display = 'none';
        // 【删除】"所有废水倒计时已完成！"弹窗
        console.log('[已删除] 所有废水倒计时已完成弹窗');
        updateWastewaterDisplay();  // 更新显示为"已完成"
        return;
        // showModal('所有废水倒计时已完成！');
    }
}

// 确认开始净水倒计时（用户点击"净水开始后请点击"按钮）
function confirmPurifiedStart() {
    // 隐藏确认按钮
    const confirmBtn = document.getElementById('purified-start-confirm');
    if (confirmBtn) {
        confirmBtn.style.display = 'none';
    }

    // 启动净水倒计时
    startPurified();
}

// 开始净水倒计时
function startPurified() {
    // 重置全局完成弹窗标记（新的净水流程开始）
    hasShownGlobalCompletionModal = false;

    // 重置提醒标记
    purified.hasShownNotification = false;

    // 检查是否有需要更换的滤芯
    if (checkFilterReminder().length > 0) {
        showFilterReminderModal();
        return;
    }

    if (!purified.hasStarted) {
        purified.hasStarted = true;
        purified.currentIndex = 0;
        purified.totalTime = purifiedConfig[0].time;
        purified.currentTime = purified.totalTime;
    }

    purified.isRunning = true;
    document.getElementById('purified-start').style.display = 'none';
    document.getElementById('purified-complete').style.display = 'none';

    // 设置提醒
    setupPurifiedNotification();

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

// 设置净水倒计时提醒
function setupPurifiedNotification() {
    clearTimeout(purified.notificationTimer);

    // 即刻提醒：不设置提前提醒定时器，只在倒计时结束时通过 handlePurifiedComplete 显示完成弹窗
    if (notificationSettings.immediateReminder) {
        console.log('即刻提醒模式，不设置提前提醒');
        return;
    }

    // 提前提醒：在倒计时结束前提前设定秒数提醒
    const notificationTime = purified.totalTime - notificationSettings.advanceReminderTime;
    console.log('设置净水提前提醒:', notificationTime, '秒（总时长:', purified.totalTime, '秒，提前:', notificationSettings.advanceReminderTime, '秒）');

    // 提前提醒逻辑
    if (notificationTime > 0) {
        purified.notificationTimer = setTimeout(() => {
            if (purified.isRunning) {
                // 最后一个桶：显示完成弹窗
                if (purified.currentIndex === purifiedConfig.length - 1) {
                    showCompletionModal();
                } else {
                    // 其他桶（包括大白桶）：显示"即将装满，请注意"
                    showPurifiedReminder();
                }
            }
        }, notificationTime * 1000);
    } else if (notificationTime <= 0) {
        // 如果提前时间大于等于总时长，则在开始时提醒
        purified.notificationTimer = setTimeout(() => {
            if (purified.isRunning) {
                // 最后一个桶：显示完成弹窗
                if (purified.currentIndex === purifiedConfig.length - 1) {
                    showCompletionModal();
                } else {
                    // 其他桶（包括大白桶）：显示"即将装满，请注意"
                    showPurifiedReminder();
                }
            }
        }, 0);
    }
}

// 显示净水倒计时提醒
function showPurifiedReminder() {
    // 防止重复提醒
    if (purified.hasShownNotification) {
        console.log('净水倒计时提醒已显示，跳过重复提醒');
        return;
    }
    purified.hasShownNotification = true;

    const bucketName = purifiedConfig[purified.currentIndex].name;
    showModal(`${bucketName}即将装满，请注意`);
}

// 处理净水倒计时完成
function handlePurifiedComplete() {
    const completeBtn = document.getElementById('purified-complete');

    // 防止重复显示弹窗
    if (purified.hasShownCompletionModal) {
        console.log('净水完成弹窗已显示，跳过重复显示');
        return;
    }
    purified.hasShownCompletionModal = true;

    // 如果使用提前提醒模式且已经显示过提醒，就不再显示完成弹窗（最后一个桶除外）
    if (!notificationSettings.immediateReminder && purified.hasShownNotification && purified.currentIndex < purifiedConfig.length - 1) {
        console.log('提前提醒模式下已显示提醒，跳过完成弹窗');
        purified.hasShownNotification = false;

        // 仍然需要显示完成按钮
        if (purified.currentIndex === 0) {
            completeBtn.textContent = '更换透明大圆桶后请点击';
            completeBtn.style.display = 'block';
        } else if (purified.currentIndex === 1) {
            completeBtn.textContent = '更换透明小桶后请点击';
            completeBtn.style.display = 'block';
        } else if (purified.currentIndex < purifiedConfig.length - 1) {
            completeBtn.textContent = '更换透明小桶后请点击';
            completeBtn.style.display = 'block';
        }

        updatePurifiedDisplay();
        return;
    }

    // 如果是最后一个桶且已经显示过提醒（提前提醒模式），不重复显示
    if (!notificationSettings.immediateReminder && purified.hasShownNotification && purified.currentIndex === purifiedConfig.length - 1) {
        console.log('提前提醒模式下最后一个桶已完成提醒，跳过重复显示');
        purified.hasShownNotification = false;
        completeBtn.style.display = 'none';
        updatePurifiedDisplay();
        return;
    }

    if (purified.currentIndex === 0) {
        // 大白桶完成
        // 提前提醒模式下，大白桶的弹窗已在 setupPurifiedNotification 中提前显示，这里不再重复显示
        // 即刻提醒模式下，显示"请更换透明大圆桶"
        if (notificationSettings.immediateReminder) {
            showModal('请更换透明大圆桶');
        }
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
        // 直接显示完成弹窗
        completeBtn.style.display = 'none';
        showCompletionModal();
    }

    updatePurifiedDisplay();
}

// 完成净水倒计时（用户点击已完成）
function completePurified() {
    // 重置弹窗标记，允许下一个桶显示弹窗
    purified.hasShownCompletionModal = false;
    // 重置提醒标记，允许下一个桶显示提醒
    purified.hasShownNotification = false;

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
    // 防止重复显示
    if (hasShownGlobalCompletionModal) {
        console.log('全局完成弹窗已显示，跳过重复显示');
        return;
    }
    hasShownGlobalCompletionModal = true;

    document.getElementById('completion-modal').style.display = 'flex';
    playMusic();
    startVibrationLoop();

    // 视觉提醒:两个计时器区域都闪烁
    const wastewaterSection = document.querySelector('.timer-section.wastewater');
    const purifiedSection = document.querySelector('.timer-section.purified');

    if (wastewaterSection) {
        wastewaterSection.classList.add('flash-warning', 'pulse-warning');
        setTimeout(() => {
            wastewaterSection.classList.remove('flash-warning', 'pulse-warning');
        }, 6000);
    }

    if (purifiedSection) {
        purifiedSection.classList.add('flash-warning', 'pulse-warning');
        setTimeout(() => {
            purifiedSection.classList.remove('flash-warning', 'pulse-warning');
        }, 6000);
    }
}

// 关闭完成弹窗
function closeCompletionModal() {
    document.getElementById('completion-modal').style.display = 'none';
    stopMusic();
    stopSingleVibration();
    stopVibrationLoop();
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
async function loadSettingsToForm() {
    // 排废水时间设置
    const drainTimeInput = document.getElementById('drain-wastewater-time');
    if (drainTimeInput) {
        drainTimeInput.value = (drainWastewaterTime / 60).toFixed(1);
    }

    // 废水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input && wastewaterConfig && wastewaterConfig[i]) {
            const time = wastewaterConfig[i].time;
            if (time && time > 0) {
                input.value = (time / 60).toFixed(1);
            } else {
                input.value = '';
            }
        }
    }

    // 净水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input && purifiedConfig && purifiedConfig[i]) {
            const time = purifiedConfig[i].time;
            if (time && time > 0) {
                input.value = (time / 60).toFixed(1);
            } else {
                input.value = '';
            }
        }
    }

    // 加载提醒设置
    loadNotificationSettingsToForm();

    // 清空历史遗留的音乐列表，只加载当前有效的自定义音乐
    await cleanAndLoadMusicFiles();
}

// 使用指定配置加载设置到表单（用于恢复默认）
async function loadSettingsToFormWithConfig(tempConfig) {
    console.log('加载配置到表单 - tempConfig:', tempConfig);

    // 排废水时间设置
    const drainTimeInput = document.getElementById('drain-wastewater-time');
    if (drainTimeInput) {
        const drainTime = tempConfig.drainWastewaterTime !== undefined ? tempConfig.drainWastewaterTime : defaultDrainWastewaterTime;
        drainTimeInput.value = (drainTime / 60).toFixed(1);
        console.log('排废水时间设置:', drainTimeInput.value, '（原始值:', drainTime, '秒）');
    }

    // 废水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input && tempConfig.wastewaterConfig && tempConfig.wastewaterConfig[i]) {
            const time = tempConfig.wastewaterConfig[i].time;
            if (time && time > 0) {
                input.value = (time / 60).toFixed(1);
                console.log(`废水桶 ${i} 设置:`, input.value);
            } else {
                input.value = '';
            }
        }
    }

    // 净水桶设置 - 将秒转换为分钟显示
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input && tempConfig.purifiedConfig && tempConfig.purifiedConfig[i]) {
            const time = tempConfig.purifiedConfig[i].time;
            if (time && time > 0) {
                input.value = (time / 60).toFixed(1);
                console.log(`净水桶 ${i} 设置:`, input.value);
            } else {
                input.value = '';
            }
        }
    }

    // 加载提醒设置
    const soundCheckbox = document.getElementById('enable-sound');
    const vibrationCheckbox = document.getElementById('enable-vibration');
    const persistentCheckbox = document.getElementById('enable-persistent');
    const statusBarCheckbox = document.getElementById('enable-statusbar');
    const keepScreenOnCheckbox = document.getElementById('keep-screen-on');
    const immediateReminderCheckbox = document.getElementById('immediate-reminder');
    const advanceReminderTimeInput = document.getElementById('advance-reminder-time');
    const advanceReminderTimeContainer = document.getElementById('advance-reminder-time-container');

    if (soundCheckbox) soundCheckbox.checked = tempConfig.notificationSettings.enableSound;
    if (vibrationCheckbox) vibrationCheckbox.checked = tempConfig.notificationSettings.enableVibration;
    if (persistentCheckbox) persistentCheckbox.checked = tempConfig.notificationSettings.enablePersistent;
    if (statusBarCheckbox) statusBarCheckbox.checked = tempConfig.notificationSettings.enableStatusBar;
    if (keepScreenOnCheckbox) keepScreenOnCheckbox.checked = tempConfig.notificationSettings.keepScreenOn;
    if (immediateReminderCheckbox) immediateReminderCheckbox.checked = tempConfig.notificationSettings.immediateReminder;
    if (advanceReminderTimeInput) advanceReminderTimeInput.value = tempConfig.notificationSettings.advanceReminderTime;

    // 根据即刻提醒状态显示/隐藏提前提醒时间输入框
    if (advanceReminderTimeContainer) {
        advanceReminderTimeContainer.style.display = tempConfig.notificationSettings.immediateReminder ? 'none' : 'block';
    }

    // 更新临时音乐选择变量
    tempSelectedMusic = tempConfig.selectedMusic || 'default';
    tempSelectedMusicName = tempConfig.selectedMusicName || null;
    console.log('更新临时音乐选择变量:', tempSelectedMusic, tempSelectedMusicName);

    // 加载音乐列表
    await cleanAndLoadMusicFiles();
}

// 添加自定义音乐项到列表
function addCustomMusicItemsToList() {
    customMusicFiles.forEach((music, index) => {
        addMusicItem(music.data, music.name, music.fileName, index, true);
    });
}

// 清理并加载音乐文件
async function cleanAndLoadMusicFiles() {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    musicList.innerHTML = '';

    // 只添加系统默认音效和当前有效的自定义音乐
    addSystemDefaultMusic();

    // 加载有效的自定义音乐（检查URL是否仍然有效）
    await loadValidCustomMusic();

    // 恢复选中的音乐高亮状态
    restoreSelectedMusicState();
}

// 添加系统默认音效
function addSystemDefaultMusic() {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    const defaultMusicItem = document.createElement('div');
    defaultMusicItem.className = 'music-item';
    defaultMusicItem.dataset.music = 'default';
    defaultMusicItem.dataset.custom = 'false';
    defaultMusicItem.onclick = () => selectMusicForDisplay('default', '系统默认音效', false);

    defaultMusicItem.innerHTML = `
        <div class="music-icon">🔔</div>
        <div class="music-info">
            <div class="music-name">系统默认音效</div>
            <div class="music-desc">系统默认</div>
        </div>
        <div class="music-check">✓</div>
    `;

    musicList.appendChild(defaultMusicItem);
}

// 加载有效的自定义音乐
async function loadValidCustomMusic() {
    const musicList = document.getElementById('music-list');
    if (!musicList) return;

    // 从 IndexedDB 加载所有音频文件
    const audioFiles = await loadAudioFromIndexedDB();

    // 清空当前自定义音乐列表
    customMusicFiles = [];

    // 重新构建音乐列表（不再使用优先级排序）
    audioFiles.forEach((audioFile, index) => {
        const musicData = URL.createObjectURL(audioFile.data);
        const displayName = audioFile.name.replace(/\.[^/.]+$/, ''); // 移除文件扩展名
        customMusicFiles.push({
            id: audioFile.id,
            name: displayName, // 显示名称
            originalName: audioFile.name, // 原始文件名
            fileName: displayName, // 使用显示名称作为标识
            data: musicData,
            size: audioFile.size
        });
    });

    // 添加到列表
    customMusicFiles.forEach((music, index) => {
        addMusicItem(music.data, music.name, music.fileName, index, true);
    });
}

// 恢复选中音乐的状态
function restoreSelectedMusicState() {
    // 清除所有选中状态
    document.querySelectorAll('.music-item').forEach(item => {
        item.classList.remove('active');
    });

    console.log('恢复选中状态 - selectedMusic:', selectedMusic, 'selectedMusicName:', selectedMusicName);

    // 恢复选中的音乐
    if (selectedMusic === 'default' || !selectedMusic) {
        const defaultItem = document.querySelector('[data-music="default"]');
        if (defaultItem) {
            defaultItem.classList.add('active');
        }
        // 同步临时变量
        tempSelectedMusic = 'default';
        tempSelectedMusicName = '系统默认音效';
        tempIsCustomMusic = false;
    } else if (selectedMusicName) {
        // 查找对应的自定义音乐项
        const customItem = document.querySelector(`[data-music="${selectedMusicName}"]`);
        if (customItem) {
            customItem.classList.add('active');
            // 同步临时变量
            tempSelectedMusic = selectedMusicName;
            tempSelectedMusicName = selectedMusicName;
            tempIsCustomMusic = true;
        }
    }
}

// 保存设置
function saveSettings() {
    console.log('=== 开始保存设置 ===');
    console.log('保存前全局变量 - wastewaterConfig:', JSON.stringify(wastewaterConfig));
    console.log('保存前全局变量 - purifiedConfig:', JSON.stringify(purifiedConfig));
    console.log('保存前全局变量 - drainWastewaterTime:', drainWastewaterTime);

    // 保存排废水时间 - 将分钟转换为秒
    const drainTimeInput = document.getElementById('drain-wastewater-time');
    if (drainTimeInput) {
        const drainValue = parseFloat(drainTimeInput.value);
        console.log('排废水时间 - 表单值:', drainTimeInput.value, '解析后:', drainValue);
        drainWastewaterTime = isNaN(drainValue) ? defaultDrainWastewaterTime : Math.round(drainValue * 60);
        localStorage.setItem('drainWastewaterTime', drainWastewaterTime);
        console.log('排废水时间 - 保存后:', drainWastewaterTime);
    }

    // 保存废水桶时间 - 将分钟转换为秒
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input) {
            const value = parseFloat(input.value);
            console.log(`废水桶 ${i} - 表单值:`, input.value, '解析后:', value, '当前配置:', wastewaterConfig[i].time);
            if (!isNaN(value) && value > 0) {
                wastewaterConfig[i].time = Math.round(value * 60);
                console.log(`废水桶 ${i} - 更新后:`, wastewaterConfig[i].time);
            }
            // 如果输入无效，保持原有值不变
        }
    }

    // 保存净水桶时间 - 将分钟转换为秒
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input) {
            const value = parseFloat(input.value);
            console.log(`净水桶 ${i} - 表单值:`, input.value, '解析后:', value, '当前配置:', purifiedConfig[i].time);
            if (!isNaN(value) && value > 0) {
                purifiedConfig[i].time = Math.round(value * 60);
                console.log(`净水桶 ${i} - 更新后:`, purifiedConfig[i].time);
            }
            // 如果输入无效，保持原有值不变
        }
    }

    // 保存音乐选择（从临时变量保存）
    selectedMusic = tempSelectedMusic;
    selectedMusicName = tempSelectedMusicName;

    console.log('保存音乐选择 - tempSelectedMusic:', tempSelectedMusic, 'selectedMusic:', selectedMusic);
    console.log('保存音乐选择 - tempSelectedMusicName:', tempSelectedMusicName, 'selectedMusicName:', selectedMusicName);

    // 保存提醒设置
    saveNotificationSettings();

    // 保存到本地存储
    saveConfig({
        wastewaterConfig,
        purifiedConfig,
        selectedMusic,
        selectedMusicName,
        notificationSettings,
        drainWastewaterTime
    });

    console.log('保存完成 - wastewaterConfig:', JSON.stringify(wastewaterConfig));
    console.log('保存完成 - purifiedConfig:', JSON.stringify(purifiedConfig));
    console.log('保存完成 - drainWastewaterTime:', drainWastewaterTime);
    console.log('=== 保存设置完成 ===');

    // 更新显示（只有保存后才生效）
    updateWastewaterDisplay();
    updatePurifiedDisplay();

    closeSettings();
}

// 恢复默认设置
async function resetSettings() {
    console.log('恢复默认设置 - 默认配置:', defaultWastewaterConfig, defaultPurifiedConfig);

    // 临时配置，只更新表单，不修改全局变量
    const tempConfig = {
        wastewaterConfig: JSON.parse(JSON.stringify(defaultWastewaterConfig)),
        purifiedConfig: JSON.parse(JSON.stringify(defaultPurifiedConfig)),
        selectedMusic: 'default',
        selectedMusicName: null,
        notificationSettings: { ...defaultNotificationSettings },
        drainWastewaterTime: defaultDrainWastewaterTime
    };

    // 更新临时音乐选择变量
    tempSelectedMusic = 'default';
    tempSelectedMusicName = null;

    console.log('恢复默认设置 - 临时配置:', tempConfig);

    // 只重新加载表单显示，不修改全局变量，不保存到localStorage
    await loadSettingsToFormWithConfig(tempConfig);

    // 验证表单值是否正确更新
    console.log('=== 验证表单值 ===');
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`wastewater-time-${i}`);
        if (input) {
            console.log(`废水桶 ${i} 表单值:`, input.value);
        }
    }
    for (let i = 0; i < 5; i++) {
        const input = document.getElementById(`purified-time-${i}`);
        if (input) {
            console.log(`净水桶 ${i} 表单值:`, input.value);
        }
    }
}

// 清除 IndexedDB 中的自定义音乐
async function clearCustomMusicFromIndexedDB() {
    if (!db) {
        await initIndexedDB();
    }

    try {
        const transaction = db.transaction(['music'], 'readwrite');
        const store = transaction.objectStore('music');
        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => {
                console.log('自定义音乐已清除');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
        transaction.onerror = () => {
            console.error('事务失败:', transaction.error);
            throw transaction.error;
        };
    } catch (e) {
        console.error('清除自定义音乐失败:', e);
    }
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

// 清理无效的 localStorage 数据
function cleanInvalidLocalStorage() {
    const keysToRemove = ['wastewaterConfig', 'purifiedConfig', 'selectedMusic', 'selectedMusicName', 'mainFilters', 'secondaryFilters'];

    keysToRemove.forEach(key => {
        const value = localStorage.getItem(key);
        if (value === 'undefined' || value === 'null' || value === '') {
            console.log(`清理无效的 localStorage 项: ${key}`);
            localStorage.removeItem(key);
        }
    });

    // 尝试解析配置，如果解析失败则删除
    try {
        const savedWastewater = localStorage.getItem('wastewaterConfig');
        if (savedWastewater) {
            try {
                const parsed = JSON.parse(savedWastewater);
                if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0] || !parsed[0].time) {
                    console.log('发现无效的 wastewaterConfig，清理中...');
                    localStorage.removeItem('wastewaterConfig');
                }
            } catch (e) {
                console.log('wastewaterConfig 解析失败，清理中...');
                localStorage.removeItem('wastewaterConfig');
            }
        }

        const savedPurified = localStorage.getItem('purifiedConfig');
        if (savedPurified) {
            try {
                const parsed = JSON.parse(savedPurified);
                if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0] || !parsed[0].time) {
                    console.log('发现无效的 purifiedConfig，清理中...');
                    localStorage.removeItem('purifiedConfig');
                }
            } catch (e) {
                console.log('purifiedConfig 解析失败，清理中...');
                localStorage.removeItem('purifiedConfig');
            }
        }

        const savedMainFilters = localStorage.getItem('mainFilters');
        if (savedMainFilters) {
            try {
                const parsed = JSON.parse(savedMainFilters);
                if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0] || !parsed[0].name) {
                    console.log('发现无效的 mainFilters，清理中...');
                    localStorage.removeItem('mainFilters');
                }
            } catch (e) {
                console.log('mainFilters 解析失败，清理中...');
                localStorage.removeItem('mainFilters');
            }
        }

        const savedSecondaryFilters = localStorage.getItem('secondaryFilters');
        if (savedSecondaryFilters) {
            try {
                const parsed = JSON.parse(savedSecondaryFilters);
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    console.log('发现无效的 secondaryFilters，清理中...');
                    localStorage.removeItem('secondaryFilters');
                }
            } catch (e) {
                console.log('secondaryFilters 解析失败，清理中...');
                localStorage.removeItem('secondaryFilters');
            }
        }
    } catch (e) {
        console.error('清理 localStorage 时出错:', e);
        // 如果解析出错，清除所有配置
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}

// 页面加载完成后请求通知权限
window.addEventListener('load', async () => {
    // 先清理无效的 localStorage 数据
    cleanInvalidLocalStorage();

    requestNotificationPermission();

    // 重新加载配置（确保 selectedMusic 从 localStorage 读取）
    config = loadConfig();

    // 更新所有配置变量（确保使用最新的配置）
    wastewaterConfig = config.wastewaterConfig;
    purifiedConfig = config.purifiedConfig;
    selectedMusic = config.selectedMusic;
    selectedMusicName = config.selectedMusicName;

    // 初始化滤芯配置（使用深拷贝避免引用问题）
    mainFilters = JSON.parse(JSON.stringify(config.mainFilters));
    secondaryFilters = JSON.parse(JSON.stringify(config.secondaryFilters));
    filterHistory = config.filterHistory || [];

    // 初始化提醒设置
    notificationSettings = config.notificationSettings || { ...defaultNotificationSettings };

    console.log('配置加载 - selectedMusic:', selectedMusic, 'selectedMusicName:', selectedMusicName);
    console.log('配置加载 - wastewaterConfig:', wastewaterConfig);
    console.log('配置加载 - purifiedConfig:', purifiedConfig);
    console.log('配置加载 - mainFilters:', mainFilters);
    console.log('配置加载 - secondaryFilters:', secondaryFilters);

    // 同步临时变量（确保临时变量与配置一致）
    tempSelectedMusic = selectedMusic;
    tempSelectedMusicName = selectedMusicName;
    tempIsCustomMusic = (selectedMusic !== 'default' && selectedMusicName !== null);

    // 应用屏幕常亮和常驻状态栏设置
    setTimeout(() => {
        applyKeepScreenOn();
        applyStatusBarSetting();
    }, 100);

    // 等待 HBuilderX Plus API 加载
    if (window.plus) {
        document.addEventListener('plusready', async () => {
            console.log('Plus API 已就绪');
            // 请求震动权限
            try {
                plus.device.vibrate(0);
            } catch (e) {
                console.log('震动权限请求失败:', e);
            }
            // 初始化 IndexedDB
            await initIndexedDB();
            // 加载音乐文件并恢复播放
            await loadMusicFiles();
            updateWastewaterDisplay();
            updatePurifiedDisplay();

            // 检查是否有需要更换的滤芯
            if (checkFilterReminder().length > 0) {
                showFilterReminderModal();
            }

            // 应用屏幕常亮和常驻状态栏设置（在Plus API就绪后）
            applyKeepScreenOn();
            applyStatusBarSetting();
        }, false);
    } else {
        // 非 HBuilderX 环境,直接初始化
        await initIndexedDB();
        // 加载音乐文件并恢复播放
        await loadMusicFiles();
        updateWastewaterDisplay();
        updatePurifiedDisplay();

        // 检查是否有需要更换的滤芯
        if (checkFilterReminder().length > 0) {
            showFilterReminderModal();
        }
    }
});

// 初始化音频上下文(在用户首次交互时)
let audioContextInitialized = false;
function initAudioContext() {
    if (!audioContextInitialized) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                audioContextInitialized = true;
            }
        } catch (e) {
            console.log('无法初始化音频上下文:', e);
        }
    }
}

// 在用户首次点击时初始化音频上下文
document.addEventListener('click', initAudioContext, { once: true });
document.addEventListener('touchstart', initAudioContext, { once: true });

// 防止页面关闭时不小心丢失进度
window.addEventListener('beforeunload', (e) => {
    if (wastewater.isRunning || purified.isRunning) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// ========== 滤芯更换提醒功能 ==========

// 折叠状态存储
let sectionCollapseState = {
    'section-main': false,
    'section-secondary': false,
    'section-history': false
};

// 折叠/展开区域
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = section.querySelector('.collapse-icon');

    sectionCollapseState[sectionId] = !sectionCollapseState[sectionId];

    if (sectionCollapseState[sectionId]) {
        // 折叠
        const listEl = section.querySelector('.filter-list');
        if (listEl) listEl.style.display = 'none';
        const historyListEl = section.querySelector('.filter-history-list');
        if (historyListEl) historyListEl.style.display = 'none';
        const btn = section.querySelector('.btn');
        if (btn) btn.style.display = 'none';
        const note = section.querySelector('.filter-section-note');
        if (note) note.style.display = 'none';
        icon.textContent = '▶';
    } else {
        // 展开
        const listEl = section.querySelector('.filter-list');
        if (listEl) listEl.style.display = 'block';
        const historyListEl = section.querySelector('.filter-history-list');
        if (historyListEl) historyListEl.style.display = 'block';
        const btn = section.querySelector('.btn');
        if (btn) btn.style.display = 'block';
        const note = section.querySelector('.filter-section-note');
        if (note) note.style.display = 'block';
        icon.textContent = '▼';
    }

    // 保存折叠状态
    localStorage.setItem('sectionCollapseState', JSON.stringify(sectionCollapseState));
}

// 恢复折叠状态
function restoreCollapseState() {
    const savedState = localStorage.getItem('sectionCollapseState');
    if (savedState) {
        sectionCollapseState = JSON.parse(savedState);
    }

    // 应用折叠状态
    Object.keys(sectionCollapseState).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const icon = section.querySelector('.collapse-icon');
        if (sectionCollapseState[sectionId]) {
            // 折叠
            const listEl = section.querySelector('.filter-list');
            if (listEl) listEl.style.display = 'none';
            const historyListEl = section.querySelector('.filter-history-list');
            if (historyListEl) historyListEl.style.display = 'none';
            const btn = section.querySelector('.btn');
            if (btn) btn.style.display = 'none';
            const note = section.querySelector('.filter-section-note');
            if (note) note.style.display = 'none';
            if (icon) icon.textContent = '▶';
        }
    });
}

// 显示滤芯页面
function showFilterPage() {
    document.getElementById('filter-page').classList.add('active');

    // 先保存原始配置状态,用于取消时恢复
    originalMainFilters = JSON.parse(JSON.stringify(mainFilters));
    originalSecondaryFilters = JSON.parse(JSON.stringify(secondaryFilters));
    console.log('保存原始配置:', originalMainFilters, originalSecondaryFilters);

    // 重置修改标记
    filterConfigModified = false;
    modifiedFilters.main.clear();
    modifiedFilters.secondary.clear();

    loadFilterPage();
    restoreCollapseState();
}

// 验证次滤芯是否填写完整
function validateSecondaryFiltersBeforeClose() {
    return new Promise((resolve) => {
        const unfilledFilters = [];
        secondaryFilters.forEach((filter, index) => {
            // 只要名字是默认的,就认为未填写,不管其他字段是否填写
            if (filter.name === '请填写滤芯品牌与类型') {
                unfilledFilters.push({ index, filter });
            }
        });

        if (unfilledFilters.length > 0) {
            const filter = unfilledFilters[0];
            showCustomModal('请填写滤芯的品牌与类型',
                '请填写滤芯的品牌与类型',
                () => {
                    // 用户点击"去修改"
                    const nameElement = document.querySelector(`[data-index="${filter.index}"].editable-name`);
                    if (nameElement) {
                        nameElement.classList.add('highlight-name');
                        nameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    resolve(false); // 不继续关闭
                },
                () => {
                    // 用户点击"放弃修改",只删除当前配置中的未填写滤芯
                    // 不修改 originalSecondaryFilters,保持原始状态不变
                    // 从后往前删除,避免索引变化问题
                    for (let i = unfilledFilters.length - 1; i >= 0; i--) {
                        secondaryFilters.splice(unfilledFilters[i].index, 1);
                    }
                    loadSecondaryFilters();
                    skipSaveConfirm = true; // 标记跳过保存确认弹窗
                    resolve(true); // 继续关闭
                },
                '去修改',
                '放弃修改'
            );
        } else {
            resolve(true); // 没有未填写的,继续关闭
        }
    });
}

// 验证滤芯信息是否完整(用于点击"确定修改"时)
function validateFilterInfoBeforeSave() {
    const incompleteFilters = [];

    // 只检查修改过的主滤芯
    modifiedFilters.main.forEach(index => {
        if (index >= mainFilters.length) return;

        const filter = mainFilters[index];
        let isIncomplete = false;
        let incompleteFields = [];

        // 如果填写了任意字段,则需要完整填写所有字段
        if (filter.installDate || filter.months || filter.cost) {
            if (!filter.installDate) {
                isIncomplete = true;
                incompleteFields.push('安装日期');
            }
            if (!filter.months) {
                isIncomplete = true;
                incompleteFields.push('使用寿命');
            }
            if (!filter.cost && filter.cost !== 0) {
                isIncomplete = true;
                incompleteFields.push('购入费用');
            }
        }

        if (isIncomplete) {
            incompleteFilters.push({ type: 'main', index, filter, incompleteFields });
        }
    });

    // 只检查修改过的次滤芯
    modifiedFilters.secondary.forEach(index => {
        if (index >= secondaryFilters.length) return;

        const filter = secondaryFilters[index];
        let isIncomplete = false;
        let incompleteFields = [];

        // 检查名称
        if (!filter.name || filter.name === '') {
            isIncomplete = true;
            incompleteFields.push('名称');
        }

        // 如果填写了任意字段,则需要完整填写所有字段
        if (filter.installDate || filter.months || filter.cost) {
            if (!filter.installDate) {
                isIncomplete = true;
                incompleteFields.push('安装日期');
            }
            if (!filter.months) {
                isIncomplete = true;
                incompleteFields.push('使用寿命');
            }
            if (!filter.cost && filter.cost !== 0) {
                isIncomplete = true;
                incompleteFields.push('购入费用');
            }
        }

        if (isIncomplete) {
            incompleteFilters.push({ type: 'secondary', index, filter, incompleteFields });
        }
    });

    return incompleteFilters;
}

// 隐藏滤芯页面
async function hideFilterPage() {
    console.log('hideFilterPage 被调用,当前状态:', {
        filterConfigModified,
        mainFilters,
        secondaryFilters,
        originalMainFilters,
        originalSecondaryFilters
    });

    // 检查次滤芯是否有未填写的项
    const canClose = await validateSecondaryFiltersBeforeClose();

    // 如果用户点击"去修改",则不继续关闭
    if (!canClose) {
        return;
    }

    // 如果有修改且未设置跳过标记,显示确认弹窗
    if (filterConfigModified && !skipSaveConfirm) {
        showCustomModal('是否保存修改',
            '您已修改滤芯信息，是否保存修改到更换记录？',
            () => {
                // 用户点击"确定修改",先验                () => {
                    // 用户点击"确定修改",先验证信息完整性
                    const incompleteFilters = validateFilterInfoBeforeSave();
                    if (incompleteFilters.length > 0) {
                        // 有不完整的信息,弹出提示
                        showCustomModal('提示',
                            '为了准确管理滤芯，请完善信息',
                            () => {
                                // 用户点击"确定",高亮需完善的区域
                                const filter = incompleteFilters[0];
                                const incompleteFields = filter.incompleteFields;

                                // 根据缺失的字段高亮对应区域
                                let targetElement = null;
                                if (incompleteFields.includes('名称')) {
                                    targetElement = document.querySelector(`[data-index="${filter.index}"].editable-name`);
                                } else if (incompleteFields.includes('安装日期')) {
                                    targetElement = document.querySelector(`.filter-install-date[data-index="${filter.index}"][data-type="${filter.type}"]`);
                                } else if (incompleteFields.includes('使用寿命')) {
                                    targetElement = document.querySelector(`.filter-months-input[data-index="${filter.index}"][data-type="${filter.type}"]`);
                                } else if (incompleteFields.includes('购入费用')) {
                                    targetElement = document.querySelector(`.filter-cost-input[data-index="${filter.index}"][data-type="${filter.type}"]`);
                                }

                                if (targetElement) {
                                    targetElement.classList.add('highlight-name');
                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    // 2秒后移除高亮
                                    setTimeout(() => {
                                        targetElement.classList.remove('highlight-name');
                                    }, 2000);
                                }
                            },
                            () => {
                                // 用户点击"取消",恢复原始状态并返回主页
                                console.log('用户点击取消，恢复原始状态, originalMainFilters:', originalMainFilters);
                                mainFilters = JSON.parse(JSON.stringify(originalMainFilters));
                                secondaryFilters = JSON.parse(JSON.stringify(originalSecondaryFilters));
                                console.log('恢复后 mainFilters:', mainFilters);
                                document.getElementById('filter-page').classList.remove('active');
                                saveFilterConfig();
                                filterConfigModified = false;
                                modifiedFilters.main.clear();
                                modifiedFilters.secondary.clear();
                            },
                            '确定',
                            '取消'
                        );
                    } else {
                        // 信息完整,保存修改
                        updateFilterHistoryFromConfig();
                        document.getElementById('filter-page').classList.remove('active');
                        saveFilterConfig();
                        filterConfigModified = false;
                        modifiedFilters.main.clear();
                        modifiedFilters.secondary.clear();
                    }
                },
            () => {
                // 用户点击"取消",恢复原始状态
                console.log('恢复原始状态, originalMainFilters:', originalMainFilters);
                mainFilters = JSON.parse(JSON.stringify(originalMainFilters));
                secondaryFilters = JSON.parse(JSON.stringify(originalSecondaryFilters));
                console.log('恢复后 mainFilters:', mainFilters);
                document.getElementById('filter-page').classList.remove('active');
                saveFilterConfig();
                filterConfigModified = false;
                modifiedFilters.main.clear();
                modifiedFilters.secondary.clear();
            },
            '确定修改',
            '取消'
        );
    } else {
        // 没有修改,直接退出
        document.getElementById('filter-page').classList.remove('active');
        saveFilterConfig();
    }

    // 重置跳过标记
    skipSaveConfirm = false;
}

// 根据当前配置更新历史记录
function updateFilterHistoryFromConfig() {
    // 处理主滤芯
    mainFilters.forEach(filter => {
        if (filter.installDate) {
            addFilterHistory(filter.name, filter.installDate, filter.cost || null);
        }
    });

    // 处理次滤芯
    secondaryFilters.forEach(filter => {
        if (filter.installDate && filter.name !== '请填写滤芯品牌与类型') {
            addFilterHistory(filter.name, filter.installDate, filter.cost || null);
        }
    });

    // 刷新历史记录显示
    loadFilterHistory();
}

// 加载滤芯页面数据
function loadFilterPage() {
    loadMainFilters();
    loadSecondaryFilters();
    loadFilterHistory();
    checkFilterPredictions();
}

// 加载主滤芯
function loadMainFilters() {
    const mainFilterList = document.getElementById('main-filter-list');
    if (!mainFilterList) return;

    mainFilterList.innerHTML = '';

    mainFilters.forEach((filter, index) => {
        const filterItem = createMainFilterItem(filter, index);
        mainFilterList.appendChild(filterItem);
    });
}

// 加载次滤芯
function loadSecondaryFilters() {
    const secondaryFilterList = document.getElementById('secondary-filter-list');
    if (!secondaryFilterList) return;

    secondaryFilterList.innerHTML = '';

    secondaryFilters.forEach((filter, index) => {
        const filterItem = createSecondaryFilterItem(filter, index);
        secondaryFilterList.appendChild(filterItem);
    });
}

// 创建主滤芯项
function createMainFilterItem(filter, index) {
    const div = document.createElement('div');
    div.className = 'filter-item filter-item-main swipe-item';

    const status = getFilterStatus(filter.installDate, filter.months);
    const progress = getFilterProgress(filter.installDate, filter.months);

    div.innerHTML = `
        <div class="filter-item-header">
            <div style="display: flex; align-items: center; flex: 1; gap: 8px;">
                <span class="filter-item-name">${filter.name}</span>
            </div>
            <span class="filter-status ${status.class}">${status.text}</span>
            <div class="swipe-delete-btn">
                <button class="filter-item-delete" onclick="clearMainFilterData(${index})">🗑️</button>
            </div>
        </div>
        <div class="filter-item-details">
            <div class="filter-item-row">
                <label class="filter-item-label">安装日期:</label>
                <input type="date" class="filter-item-input filter-install-date" data-index="${index}" data-type="main"
                       value="${filter.installDate || ''}" onchange="updateFilterDate(this, 'main', ${index})">
            </div>
            <div class="filter-item-row">
                <label class="filter-item-label">使用寿命:</label>
                <input type="number" class="filter-item-input filter-months-input" data-index="${index}" data-type="main"
                       value="${filter.months}" min="1" max="120" onchange="updateFilterMonths(this, 'main', ${index})">
                <span style="color: #7f8c8d; font-size: 14px;">个月</span>
            </div>
            <div class="filter-item-row">
                <label class="filter-item-label">购入费用:</label>
                <input type="number" class="filter-item-input filter-cost-input" data-index="${index}" data-type="main"
                       value="${filter.cost || ''}" min="0" step="0.01" placeholder="0.00"
                       onchange="updateFilterCost(this, 'main', ${index})">
                <span style="color: #7f8c8d; font-size: 14px;">元</span>
            </div>
            ${filter.installDate ? `
            <div class="filter-progress-section">
                <div class="filter-progress-label">
                    <span>剩余寿命</span>
                    <span class="progress-remaining-text">${progress.remaining}个月 / ${filter.months}个月</span>
                </div>
                <div class="filter-change-count">
                    已更换${getFilterChangeCount(filter.name)}次
                </div>
                <div class="filter-progress-bar">
                    <div class="filter-progress-fill ${progress.color}" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    // 添加左滑删除功能
    let startX = 0;
    let isSwiping = false;

    div.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });

    div.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        if (diffX < -50) { // 左滑超过50像素
            const deleteBtn = div.querySelector('.swipe-delete-btn');
            if (deleteBtn) {
                deleteBtn.classList.add('visible');
            }
            isSwiping = false;
        } else if (diffX > 50) { // 右滑超过50像素
            const deleteBtn = div.querySelector('.swipe-delete-btn');
            if (deleteBtn) {
                deleteBtn.classList.remove('visible');
            }
            isSwiping = false;
        }
    }, { passive: true });

    div.addEventListener('touchend', () => {
        isSwiping = false;
    });

    return div;
}

// 创建次滤芯项
function createSecondaryFilterItem(filter, index) {
    const div = document.createElement('div');
    div.className = 'filter-item swipe-item';

    const status = getFilterStatus(filter.installDate, filter.months);
    const progress = getFilterProgress(filter.installDate, filter.months);

    div.innerHTML = `
        <div class="filter-item-header">
            <div style="display: flex; align-items: center; flex: 1; gap: 8px; margin-right: 8px;">
                ${filter.name ?
                    `<span class="filter-item-name editable-name" data-index="${index}" onclick="editFilterName(${index})">${filter.name}</span>` :
                    `<span class="filter-item-name editable-name unfilled-name" data-index="${index}" onclick="editFilterName(${index})">请填写滤芯品牌与类型</span>`
                }
            </div>
            <span class="filter-status ${status.class}">${status.text}</span>
            <div class="swipe-delete-btn">
                <button class="filter-item-delete" onclick="deleteSecondaryFilter(${index})">🗑️</button>
            </div>
        </div>
        <div class="filter-item-details">
            <div class="filter-item-row">
                <label class="filter-item-label">安装日期:</label>
                <input type="date" class="filter-item-input filter-install-date" data-index="${index}" data-type="secondary"
                       value="${filter.installDate || ''}" onchange="updateFilterDate(this, 'secondary', ${index})">
            </div>
            <div class="filter-item-row">
                <label class="filter-item-label">使用寿命:</label>
                <input type="number" class="filter-item-input filter-months-input" data-index="${index}" data-type="secondary"
                       value="${filter.months}" min="1" max="120" onchange="updateFilterMonths(this, 'secondary', ${index})">
                <span style="color: #7f8c8d; font-size: 14px;">个月</span>
            </div>
            <div class="filter-item-row">
                <label class="filter-item-label">购入费用:</label>
                <input type="number" class="filter-item-input filter-cost-input" data-index="${index}" data-type="secondary"
                       value="${filter.cost || ''}" min="0" step="0.01" placeholder="0.00"
                       onchange="updateFilterCost(this, 'secondary', ${index})">
                <span style="color: #7f8c8d; font-size: 14px;">元</span>
            </div>
            ${filter.installDate ? `
            <div class="filter-progress-section">
                <div class="filter-progress-label">
                    <span>剩余寿命</span>
                    <span class="progress-remaining-text">${progress.remaining}个月 / ${filter.months}个月</span>
                </div>
                <div class="filter-change-count">
                    已更换${getFilterChangeCount(filter.name)}次
                </div>
                <div class="filter-progress-bar">
                    <div class="filter-progress-fill ${progress.color}" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    // 添加左滑删除功能
    let startX = 0;
    let isSwiping = false;

    div.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });

    div.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        if (diffX < -50) { // 左滑超过50像素
            const deleteBtn = div.querySelector('.swipe-delete-btn');
            if (deleteBtn) {
                deleteBtn.classList.add('visible');
            }
            isSwiping = false;
        } else if (diffX > 50) { // 右滑超过50像素
            const deleteBtn = div.querySelector('.swipe-delete-btn');
            if (deleteBtn) {
                deleteBtn.classList.remove('visible');
            }
            isSwiping = false;
        }
    }, { passive: true });

    div.addEventListener('touchend', () => {
        isSwiping = false;
    });

    return div;
}

// 获取滤芯状态
function getFilterStatus(installDate, months) {
    if (!installDate) {
        return { text: '未设置', class: 'ok' };
    }

    const now = new Date();
    const install = new Date(installDate);
    const diffMonths = (now.getFullYear() - install.getFullYear()) * 12 +
                      (now.getMonth() - install.getMonth());

    if (diffMonths >= months) {
        return { text: '需更换', class: 'overdue' };
    } else if (diffMonths >= months - 1) {
        return { text: '即将到期', class: 'warning' };
    } else {
        return { text: '正常', class: 'ok' };
    }
}

// 获取滤芯进度
function getFilterProgress(installDate, months) {
    if (!installDate) {
        return { remaining: '-', percentage: 0, color: '' };
    }

    const now = new Date();
    const install = new Date(installDate);
    const diffMonths = (now.getFullYear() - install.getFullYear()) * 12 +
                      (now.getMonth() - install.getMonth());

    const remaining = Math.max(0, months - diffMonths);
    const percentage = Math.max(0, Math.min(100, (remaining / months) * 100));

    let color = '';
    if (diffMonths >= months) {
        color = 'overdue';
    } else if (diffMonths >= months - 1) {
        color = 'warning';
    } else if (diffMonths >= months - 2) {
        color = 'caution';
    } else {
        color = 'ok';
    }

    return { remaining, percentage, color };
}

// 检查滤芯更换预测
function checkFilterPredictions() {
    const allFilters = [...mainFilters, ...secondaryFilters];
    const predictions = [];
    const suggestions = [];

    allFilters.forEach(filter => {
        if (!filter.installDate || !filter.months) return;

        const progress = getFilterProgress(filter.installDate, filter.months);
        // 当剩余寿命小于等于10%时显示预测
        if (progress.remaining > 0 && progress.percentage <= 10) {
            const install = new Date(filter.installDate);
            const expiryDate = new Date(install);
            expiryDate.setMonth(expiryDate.getMonth() + filter.months);
            const now = new Date();
            const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

            predictions.push({
                name: filter.name,
                daysRemaining,
                months: filter.months,
                filter
            });
        }
    });

    // 如果有需要预测的滤芯，检查是否需要智能建议
    if (predictions.length > 0) {
        const prediction = predictions[0];

        // 查找其他即将到期的滤芯（使用期超过80%）
        const nearExpiryFilters = [];
        allFilters.forEach(filter => {
            if (!filter.installDate || !filter.months) return;
            if (filter === prediction.filter) return; // 跳过当前预测的滤芯

            const progress = getFilterProgress(filter.installDate, filter.months);
            const install = new Date(filter.installDate);
            const now = new Date();
            const usedMonths = (now.getFullYear() - install.getFullYear()) * 12 +
                              (now.getMonth() - install.getMonth());

            // 使用期超过80%且未到期
            if (progress.percentage <= 20 && progress.percentage > 0) {
                nearExpiryFilters.push({
                    name: filter.name,
                    usedMonths,
                    totalMonths: filter.months
                });
            }
        });

        // 如果有其他即将到期的滤芯，显示智能建议
        if (nearExpiryFilters.length > 0) {
            const suggestion = nearExpiryFilters[0];
            const predictionModal = document.getElementById('filter-prediction-modal');
            if (predictionModal) {
                predictionModal.style.display = 'flex';
                const predictionMessage = predictionModal.querySelector('.prediction-message');
                if (predictionMessage) {
                    predictionMessage.textContent = `您本次需要更换${prediction.name}。${suggestion.name}也已使用${suggestion.usedMonths}个月（建议${suggestion.totalMonths}个月更换），考虑一并更换以获得最佳水质吗？`;
                }
            }
        } else {
            // 只显示单个滤芯的预测
            const predictionModal = document.getElementById('filter-prediction-modal');
            if (predictionModal) {
                predictionModal.style.display = 'flex';
                const predictionMessage = predictionModal.querySelector('.prediction-message');
                if (predictionMessage) {
                    predictionMessage.textContent = `根据您的使用习惯，${prediction.name}预计将在${prediction.daysRemaining}天后需要更换，建议提前购买准备。`;
                }
            }
        }
    }
}

// 关闭预测弹窗
function closePredictionModal() {
    const modal = document.getElementById('filter-prediction-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 编辑滤芯名称
function editFilterName(index) {
    // 查找次滤芯项（跳过主滤芯）
    const allFilterItems = document.querySelectorAll('.filter-item');
    let secondaryFilterIndex = 0;
    for (let i = 0; i < allFilterItems.length; i++) {
        if (!allFilterItems[i].classList.contains('filter-item-main')) {
            if (secondaryFilterIndex === index) {
                const filterItem = allFilterItems[i];
                const nameEl = filterItem.querySelector('.editable-name');
                const currentName = nameEl.textContent;

                // 创建输入框
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'filter-item-input filter-name-input';
                input.value = currentName;
                input.onblur = () => saveFilterName(index, input.value);
                input.onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        saveFilterName(index, input.value);
                    }
                };

                // 替换文本为输入框
                nameEl.replaceWith(input);
                input.focus();
                break;
            }
            secondaryFilterIndex++;
        }
    }
}

// 保存滤芯名称
function saveFilterName(index, newName) {
    if (newName && newName.trim()) {
        secondaryFilters[index].name = newName.trim();
        modifiedFilters.secondary.add(index);
    }
    loadSecondaryFilters(); // 重新加载显示
}

// 更新滤芯名称
function updateFilterName(input, index) {
    secondaryFilters[index].name = input.value;
    modifiedFilters.secondary.add(index);
}

// 验证安装日期
function validateFilterDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
        showCustomModal('提示', '安装日期不能超过今天');
        input.value = '';
        return false;
    }
    return true;
}

// 更新滤芯安装日期
function updateFilterDate(input, type, index) {
    // 验证日期不能超过今天
    if (input.value && !validateFilterDate(input)) {
        return;
    }

    const oldDate = type === 'main' ? mainFilters[index].installDate : secondaryFilters[index].installDate;
    const newDate = input.value || null;

    if (type === 'main') {
        mainFilters[index].installDate = newDate;
        modifiedFilters.main.add(index);
    } else {
        secondaryFilters[index].installDate = newDate;
        modifiedFilters.secondary.add(index);
    }

    // 标记配置已修改
    filterConfigModified = true;

    // 刷新显示状态
    if (type === 'main') {
        loadMainFilters();
    } else {
        loadSecondaryFilters();
    }
}

// 更新滤芯购入费用
function updateFilterCost(input, type, index) {
    const oldCost = type === 'main' ? mainFilters[index].cost : secondaryFilters[index].cost;
    const newCost = parseFloat(input.value) || 0;
    const filterName = type === 'main' ? mainFilters[index].name : secondaryFilters[index].name;
    const installDate = type === 'main' ? mainFilters[index].installDate : secondaryFilters[index].installDate;

    if (type === 'main') {
        mainFilters[index].cost = newCost;
        modifiedFilters.main.add(index);
    } else {
        secondaryFilters[index].cost = newCost;
        modifiedFilters.secondary.add(index);
    }

    // 标记配置已修改
    filterConfigModified = true;

    saveFilterConfig();
}

// 更新滤芯使用寿命
function updateFilterMonths(input, type, index) {
    const months = parseInt(input.value) || 1;
    if (type === 'main') {
        mainFilters[index].months = months;
        modifiedFilters.main.add(index);
    } else {
        secondaryFilters[index].months = months;
        modifiedFilters.secondary.add(index);
    }

    // 标记配置已修改
    filterConfigModified = true;

    // 刷新显示状态
    if (type === 'main') {
        loadMainFilters();
    } else {
        loadSecondaryFilters();
    }
}

// 添加次滤芯
function addSecondaryFilter() {
    const newIndex = secondaryFilters.length;
    const newFilter = {
        name: '',
        months: 6,
        installDate: null,
        cost: null
    };
    secondaryFilters.push(newFilter);

    // 标记配置已修改并记录新添加的滤芯
    filterConfigModified = true;
    modifiedFilters.secondary.add(newIndex);

    const secondaryFilterList = document.getElementById('secondary-filter-list');
    const filterItem = createSecondaryFilterItem(newFilter, newIndex);
    secondaryFilterList.appendChild(filterItem);

    // 自动打开名称编辑框
    editFilterName(newIndex);
}

// 删除次滤芯
function deleteSecondaryFilter(index) {
    showCustomModal('确认删除', `确定要删除次滤芯"${secondaryFilters[index].name}"吗？`, () => {
        secondaryFilters.splice(index, 1);
        // 标记配置已修改
        filterConfigModified = true;
        // 删除时需要更新后续索引，这里简化处理，清空所有修改记录
        modifiedFilters.secondary.clear();
        loadSecondaryFilters();
    });
}

// 清除主滤芯数据（清除安装日期、使用寿命和购入费用）
function clearMainFilterData(index) {
    const filter = mainFilters[index];

    // RO膜默认24个月，其他滤芯默认6个月
    const defaultMonths = filter.name.includes('RO膜') ? 24 : 6;

    showCustomModal('确认清除', `确定要清除"${filter.name}"的安装日期、使用寿命和购入费用吗？`, () => {
        // 清除数据
        filter.installDate = '';
        filter.months = defaultMonths;
        filter.cost = '';

        // 标记配置已修改
        filterConfigModified = true;
        modifiedFilters.main.add(index);

        // 刷新显示
        loadMainFilters();
        saveFilterConfig();
    });
}

// 保存滤芯配置
function saveFilterConfig() {
    config.mainFilters = mainFilters;
    config.secondaryFilters = secondaryFilters;
    config.filterHistory = filterHistory;
    saveConfig(config);
}

// 加载滤芯历史记录
function loadFilterHistory() {
    const historyList = document.getElementById('filter-history-list');
    const historyStats = document.getElementById('filter-history-stats');
    if (!historyList) return;

    historyList.innerHTML = '';
    historyStats.innerHTML = '';

    if (filterHistory.length === 0) {
        const emptyTip = document.createElement('div');
        emptyTip.className = 'filter-history-empty';
        emptyTip.textContent = '暂无历史记录';
        historyList.appendChild(emptyTip);
        return;
    }

    // 统计费用
    let totalCost = 0;
    let recordsWithCost = 0;
    const dates = [];

    filterHistory.forEach(record => {
        if (record.cost && record.cost > 0) {
            totalCost += record.cost;
            recordsWithCost++;
        }
        if (record.date) {
            dates.push(new Date(record.date));
        }
    });

    // 计算月均成本
    let monthlyCost = 0;
    if (dates.length > 1) {
        const earliestDate = Math.min(...dates);
        const latestDate = Math.max(...dates);
        const monthsDiff = Math.max(1, Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24 * 30)));
        monthlyCost = totalCost / monthsDiff;
    } else if (dates.length === 1 && recordsWithCost > 0) {
        monthlyCost = totalCost;
    }

    // 创建统计看板
    const statsContainer = document.createElement('div');
    statsContainer.className = 'history-stats-container';

    const totalCostCard = document.createElement('div');
    totalCostCard.className = 'history-stat-card';
    totalCostCard.innerHTML = `
        <div class="stat-label">累计总花费</div>
        <div class="stat-value">¥${totalCost.toFixed(2)}</div>
        <div class="stat-sub">共${filterHistory.length}次更换</div>
    `;

    const monthlyCostCard = document.createElement('div');
    monthlyCostCard.className = 'history-stat-card';
    monthlyCostCard.innerHTML = `
        <div class="stat-label">月均滤芯成本</div>
        <div class="stat-value">¥${monthlyCost.toFixed(2)}</div>
        <div class="stat-sub">基于使用时长计算</div>
    `;

    statsContainer.appendChild(totalCostCard);
    statsContainer.appendChild(monthlyCostCard);
    historyStats.appendChild(statsContainer);

    // 创建图表
    createHistoryCharts();

    // 统计主滤芯和次滤芯的更换记录
    const mainFilterStats = {};
    const secondaryFilterStats = {};

    filterHistory.forEach((record, index) => {
        // 判断是主滤芯还是次滤芯
        const isMain = mainFilters.some(f => f.name === record.filterName);
        if (isMain) {
            if (!mainFilterStats[record.filterName]) {
                mainFilterStats[record.filterName] = [];
            }
            mainFilterStats[record.filterName].push({ ...record, originalIndex: index });
        } else {
            if (!secondaryFilterStats[record.filterName]) {
                secondaryFilterStats[record.filterName] = [];
            }
            secondaryFilterStats[record.filterName].push({ ...record, originalIndex: index });
        }
    });

    // 创建主滤芯分组
    if (Object.keys(mainFilterStats).length > 0) {
        const mainGroup = createFilterHistoryGroup('主滤芯', mainFilterStats);
        historyList.appendChild(mainGroup);
    }

    // 创建次滤芯分组
    if (Object.keys(secondaryFilterStats).length > 0) {
        const secondaryGroup = createFilterHistoryGroup('次滤芯', secondaryFilterStats);
        historyList.appendChild(secondaryGroup);
    }
}

// 创建滤芯历史记录分组
function createFilterHistoryGroup(groupTitle, filterStats) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'history-group';

    // 分组标题
    const groupTitleEl = document.createElement('div');
    groupTitleEl.className = 'history-group-title';

    // 统计总费用
    let totalCost = 0;
    Object.values(filterStats).forEach(records => {
        records.forEach(record => {
            if (record.cost) {
                totalCost += record.cost;
            }
        });
    });

    groupTitleEl.textContent = `${groupTitle} 购入费用：${totalCost.toFixed(0)}元`;
    groupDiv.appendChild(groupTitleEl);

    // 滤芯项列表
    Object.keys(filterStats).forEach(filterName => {
        const records = filterStats[filterName];
        const count = records.length;

        // 统计该滤芯的总费用
        let filterTotalCost = 0;
        records.forEach(record => {
            if (record.cost) {
                filterTotalCost += record.cost;
            }
        });

        // 滤芯项（带折叠功能）
        const filterItem = document.createElement('div');
        filterItem.className = 'history-filter-item';

        const filterItemHeader = document.createElement('div');
        filterItemHeader.className = 'history-filter-item-header';
        filterItemHeader.onclick = () => toggleFilterHistoryItem(filterItem);

        const filterNameEl = document.createElement('div');
        filterNameEl.className = 'history-filter-name';
        filterNameEl.innerHTML = `<span class="filter-name-text">${filterName}</span><span class="filter-cost">${filterTotalCost > 0 ? `：购入费用${filterTotalCost.toFixed(0)}元` : ''}</span><span class="filter-count">已更换${count}次</span>`;

        const expandIcon = document.createElement('span');
        expandIcon.className = 'history-expand-icon';
        expandIcon.textContent = '▼';

        filterItemHeader.appendChild(filterNameEl);
        filterItemHeader.appendChild(expandIcon);

        // 详细记录列表（默认隐藏）
        const recordsList = document.createElement('div');
        recordsList.className = 'history-filter-records';
        recordsList.style.display = 'none';

        // 按时间倒序排列
        const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedRecords.forEach(record => {
            const recordItem = document.createElement('div');
            recordItem.className = 'history-record-item';

            const date = new Date(record.date);
            const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

            recordItem.innerHTML = `
                <span class="record-date">${dateStr} ${record.cost ? `费用${record.cost.toFixed(0)}元` : ''}</span>
                <button class="record-delete-btn" onclick="deleteHistoryItem(${record.originalIndex})">🗑️</button>
            `;

            recordsList.appendChild(recordItem);
        });

        filterItem.appendChild(filterItemHeader);
        filterItem.appendChild(recordsList);
        groupDiv.appendChild(filterItem);
    });

    return groupDiv;
}

// 切换滤芯历史记录项的展开/折叠
function toggleFilterHistoryItem(filterItem) {
    const recordsList = filterItem.querySelector('.history-filter-records');
    const expandIcon = filterItem.querySelector('.history-expand-icon');

    if (recordsList.style.display === 'none') {
        recordsList.style.display = 'block';
        expandIcon.textContent = '▶';
        expandIcon.style.transform = 'rotate(90deg)';
    } else {
        recordsList.style.display = 'none';
        expandIcon.textContent = '▼';
        expandIcon.style.transform = 'rotate(0deg)';
    }
}

// 创建历史记录项
function createHistoryItem(record, index) {
    const div = document.createElement('div');
    div.className = 'filter-history-item';

    const date = new Date(record.date);
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    div.innerHTML = `
        <div class="history-item-content">
            <div class="history-item-name">${record.filterName}</div>
            <div class="history-item-date">${dateStr}</div>
        </div>
        <button class="history-item-delete" onclick="deleteHistoryItem(${filterHistory.indexOf(record)})">🗑️</button>
    `;

    return div;
}

// 添加滤芯更换历史记录
function addFilterHistory(filterName, installDate, cost = null) {
    // 查找是否已有相同滤芯和日期的记录
    const existingIndex = filterHistory.findIndex(record =>
        record.filterName === filterName && record.date === installDate
    );

    if (existingIndex !== -1) {
        // 更新现有记录
        filterHistory[existingIndex].cost = cost;
        filterHistory[existingIndex].timestamp = Date.now();
    } else {
        // 添加新记录
        const record = {
            filterName,
            date: installDate,
            cost: cost,
            timestamp: Date.now()
        };

        filterHistory.push(record);
    }

    // 限制历史记录数量，最多保留100条
    if (filterHistory.length > 100) {
        filterHistory.shift();
    }
}

// 统计滤芯更换次数
function getFilterChangeCount(filterName) {
    return filterHistory.filter(record => record.filterName === filterName).length;
}

// 创建历史记录图表
function createHistoryCharts() {
    const chartsContainer = document.getElementById('filter-history-charts');
    if (!chartsContainer) return;

    chartsContainer.innerHTML = '';

    if (filterHistory.length === 0) return;

    // 创建费用趋势折线图
    const costChart = createCostTrendChart();
    if (costChart) {
        chartsContainer.appendChild(costChart);
    }

    // 创建更换频次日历热力图
    const calendarChart = createChangeFrequencyHeatmap();
    if (calendarChart) {
        chartsContainer.appendChild(calendarChart);
    }
}

// 创建费用趋势折线图
function createCostTrendChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';

    const chartTitle = document.createElement('div');
    chartTitle.className = 'chart-title';
    chartTitle.textContent = '费用趋势';
    chartContainer.appendChild(chartTitle);

    // 按月统计费用
    const monthlyCosts = {};
    filterHistory.forEach(record => {
        if (!record.cost || !record.date) return;
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyCosts[monthKey]) {
            monthlyCosts[monthKey] = 0;
        }
        monthlyCosts[monthKey] += record.cost;
    });

    // 获取最近6个月
    const months = Object.keys(monthlyCosts).sort().slice(-6);
    const costs = months.map(m => monthlyCosts[m]);

    if (months.length === 0) return null;

    const maxCost = Math.max(...costs);
    const width = 300;
    const height = 150;
    const padding = 40;

    // 创建SVG
    let svgContent = `
        <svg viewBox="0 0 ${width} ${height}" class="cost-chart">
            <!-- Y轴标签 -->
            <text x="10" y="20" font-size="10" fill="#7f8c8d">¥${maxCost}</text>
            <text x="10" y="${height - padding}" font-size="10" fill="#7f8c8d">¥0</text>
    `;

    // 绘制网格线
    svgContent += `<line x1="${padding}" y1="${padding}" x2="${width}" y2="${padding}" stroke="#e0e0e0" stroke-width="1"/>`;
    svgContent += `<line x1="${padding}" y1="${height - padding}" x2="${width}" y2="${height - padding}" stroke="#e0e0e0" stroke-width="1"/>`;

    // 绘制折线
    const points = months.map((month, i) => {
        const x = padding + (i * (width - padding) / Math.max(1, months.length - 1));
        const y = height - padding - (costs[i] / maxCost * (height - 2 * padding));
        return `${x},${y}`;
    }).join(' ');

    svgContent += `<polyline points="${points}" fill="none" stroke="#667eea" stroke-width="2" />`;

    // 绘制数据点
    months.forEach((month, i) => {
        const x = padding + (i * (width - padding) / Math.max(1, months.length - 1));
        const y = height - padding - (costs[i] / maxCost * (height - 2 * padding));
        svgContent += `<circle cx="${x}" cy="${y}" r="4" fill="#667eea" />`;
        svgContent += `<text x="${x}" y="${height - 10}" font-size="10" fill="#7f8c8d" text-anchor="middle">${month.slice(5)}</text>`;
    });

    svgContent += '</svg>';

    const chartDiv = document.createElement('div');
    chartDiv.innerHTML = svgContent;
    chartContainer.appendChild(chartDiv);

    return chartContainer;
}

// 创建更换频次日历热力图
function createChangeFrequencyHeatmap() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';

    const chartTitle = document.createElement('div');
    chartTitle.className = 'chart-title';
    chartTitle.textContent = '更换频次';
    chartContainer.appendChild(chartTitle);

    // 统计最近12个月的更换次数
    const monthlyChanges = {};
    const now = new Date();

    // 初始化最近12个月（按月份顺序排列，1月在左上角）
    const months = [];
    for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const monthKey = `2025-${String(month).padStart(2, '0')}`;
        monthlyChanges[monthKey] = 0;
        months.push(monthKey);
    }

    // 统计更换次数
    filterHistory.forEach(record => {
        if (!record.date) return;
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyChanges.hasOwnProperty(monthKey)) {
            monthlyChanges[monthKey]++;
        }
    });

    const maxChanges = Math.max(...Object.values(monthlyChanges), 1);

    // 创建热力图容器
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';

    months.forEach((month, index) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';

        const count = monthlyChanges[month];
        const intensity = count / maxChanges;
        const displayCount = count === 0 ? '-' : `${count}次`;
        const displayStyle = count === 0 ? 'color: #999;' : '';

        cell.innerHTML = `
            <div class="heatmap-cell-title">${parseInt(month.slice(5))}月</div>
            <div class="heatmap-cell-bar" style="opacity: ${intensity}"></div>
            <div class="heatmap-cell-count" style="${displayStyle}">${displayCount}</div>
        `;

        // 点击月份显示当月的更换记录
        cell.onclick = () => showMonthFilterHistory(month);

        heatmapContainer.appendChild(cell);
    });

    chartContainer.appendChild(heatmapContainer);

    return chartContainer;
}

// 显示某月的滤芯更换记录
function showMonthFilterHistory(monthKey) {
    // 查找当月所有更换记录
    const monthlyRecords = filterHistory.filter(record => {
        if (!record.date) return false;
        const date = new Date(record.date);
        const recordMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return recordMonthKey === monthKey;
    });

    if (monthlyRecords.length === 0) {
        showCustomModal(
            `${parseInt(monthKey.slice(5))}月更换记录`,
            `该月没有滤芯更换记录。`,
            () => {}
        );
        return;
    }

    // 创建记录列表显示
    let recordListHTML = monthlyRecords.map((record, index) => `
        <div style="
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            border-left: 3px solid #667eea;
        ">
            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 4px;">${record.filterName}</div>
            <div style="font-size: 13px; color: #7f8c8d;">
                <div>更换日期: ${record.date}</div>
                ${record.cost ? `<div>购入费用: ¥${record.cost.toFixed(2)}</div>` : ''}
            </div>
        </div>
    `).join('');

    showCustomModal(
        `${monthKey.slice(5)}月更换记录`,
        `<div style="max-height: 300px; overflow-y: auto;">
            ${recordListHTML}
        </div>
        <div style="text-align: center; margin-top: 12px; font-size: 13px; color: #95a5a6;">
            共${monthlyRecords.length}次更换
        </div>`,
        () => {},
        null,
        '确认',
        '取消',
        true  // 使用HTML内容
    );
}

// 删除历史记录项
function deleteHistoryItem(index) {
    showCustomModal('确认删除', '确定要删除这条历史记录吗？', () => {
        filterHistory.splice(index, 1);
        saveFilterConfig();
        loadFilterHistory();
    });
}

// 清空历史记录
function clearFilterHistory() {
    showCustomModal('确认清空', '确定要清空所有历史记录吗？此操作不可恢复。', () => {
        filterHistory = [];
        saveFilterConfig();
        loadFilterHistory();
    });
}

// 加载提醒设置到表单
function loadNotificationSettingsToForm() {
    const soundCheckbox = document.getElementById('enable-sound');
    const vibrationCheckbox = document.getElementById('enable-vibration');
    const persistentCheckbox = document.getElementById('enable-persistent');
    const statusBarCheckbox = document.getElementById('enable-statusbar');
    const keepScreenOnCheckbox = document.getElementById('keep-screen-on');
    const immediateReminderCheckbox = document.getElementById('immediate-reminder');
    const advanceReminderTimeInput = document.getElementById('advance-reminder-time');
    const advanceReminderTimeContainer = document.getElementById('advance-reminder-time-container');

    if (soundCheckbox) soundCheckbox.checked = notificationSettings.enableSound;
    if (vibrationCheckbox) vibrationCheckbox.checked = notificationSettings.enableVibration;
    if (persistentCheckbox) persistentCheckbox.checked = notificationSettings.enablePersistent;
    if (statusBarCheckbox) statusBarCheckbox.checked = notificationSettings.enableStatusBar;
    if (keepScreenOnCheckbox) keepScreenOnCheckbox.checked = notificationSettings.keepScreenOn;
    if (immediateReminderCheckbox) immediateReminderCheckbox.checked = notificationSettings.immediateReminder;
    if (advanceReminderTimeInput) advanceReminderTimeInput.value = notificationSettings.advanceReminderTime;

    // 根据即刻提醒状态显示/隐藏提前提醒时间输入框
    if (advanceReminderTimeContainer) {
        advanceReminderTimeContainer.style.display = notificationSettings.immediateReminder ? 'none' : 'block';
    }
}

// 保存提醒设置
function saveNotificationSettings() {
    const soundCheckbox = document.getElementById('enable-sound');
    const vibrationCheckbox = document.getElementById('enable-vibration');
    const persistentCheckbox = document.getElementById('enable-persistent');
    const statusBarCheckbox = document.getElementById('enable-statusbar');
    const keepScreenOnCheckbox = document.getElementById('keep-screen-on');
    const immediateReminderCheckbox = document.getElementById('immediate-reminder');
    const advanceReminderTimeInput = document.getElementById('advance-reminder-time');

    notificationSettings.enableSound = soundCheckbox.checked;
    notificationSettings.enableVibration = vibrationCheckbox.checked;
    notificationSettings.enablePersistent = persistentCheckbox.checked;
    notificationSettings.enableStatusBar = statusBarCheckbox.checked;
    notificationSettings.keepScreenOn = keepScreenOnCheckbox.checked;
    notificationSettings.immediateReminder = immediateReminderCheckbox.checked;
    notificationSettings.advanceReminderTime = parseInt(advanceReminderTimeInput.value) || 10;

    saveConfig(config);

    // 应用屏幕常亮设置
    applyKeepScreenOn();

    console.log('提醒设置已保存:', notificationSettings);
}

// 切换即刻提醒
function toggleImmediateReminder() {
    const checkbox = document.getElementById('immediate-reminder');
    const container = document.getElementById('advance-reminder-time-container');

    if (checkbox.checked) {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
    }
}

// 检查滤芯是否需要更换
function checkFilterReminder() {
    const allFilters = [...mainFilters, ...secondaryFilters];
    const now = new Date();
    const needReplaceFilters = [];

    for (const filter of allFilters) {
        if (!filter.installDate) continue;

        const install = new Date(filter.installDate);
        const diffMonths = (now.getFullYear() - install.getFullYear()) * 12 +
                          (now.getMonth() - install.getMonth());

        // 如果使用月数达到或超过寿命月数，需要提醒
        if (diffMonths >= filter.months) {
            console.log('检测到需要更换的滤芯:', filter.name);
            needReplaceFilters.push(filter.name);
        }
    }

    return needReplaceFilters;
}

// 关闭滤芯提醒弹窗
function closeFilterReminder() {
    document.getElementById('filter-reminder-modal').style.display = 'none';
    stopMusic();
    stopSingleVibration();
    stopVibrationLoop();
    stopPersistentReminder();
}

// 显示滤芯提醒弹窗
function showFilterReminderModal() {
    const needReplaceFilters = checkFilterReminder();
    const messageElement = document.querySelector('#filter-reminder-modal .modal-message');

    if (needReplaceFilters.length === 1) {
        // 只有一条滤芯需要更换，显示滤芯名称
        messageElement.textContent = `本月需更换${needReplaceFilters[0]}，请按时进行更换操作`;
    } else {
        // 多条滤芯需要更换，显示数量
        messageElement.textContent = `本月需更换${needReplaceFilters.length}条滤芯，请按时进行更换操作`;
    }

    document.getElementById('filter-reminder-modal').style.display = 'flex';
    playMusic();
    startVibrationLoop();

    // 启动持续提醒
    if (notificationSettings.enablePersistent) {
        startPersistentReminder();
    }
}

// 自定义弹窗函数（支持HTML内容）
function showCustomModal(title, message, onConfirm, onCancel = null, confirmText = '确认', cancelText = '取消', useHTML = false) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.2s ease;
    `;

    // 创建弹窗内容
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 32px;
        width: 90%;
        max-width: 360px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        animation: slideIn 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.3);
    `;

    // 添加样式动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from {
                transform: translateY(-20px) scale(0.95);
                opacity: 0;
            }
            to {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        font-size: 20px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 16px 0;
    `;

    // 消息
    const messageEl = document.createElement('div');
    if (useHTML) {
        messageEl.innerHTML = message;
    } else {
        messageEl.textContent = message;
    }
    messageEl.style.cssText = `
        font-size: 15px;
        color: #7f8c8d;
        line-height: 1.6;
        margin: 0 0 24px 0;
        text-align: left;
    `;

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 12px;
        justify-content: center;
    `;

    // 确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.textContent = confirmText;
    confirmBtn.style.cssText = 'flex: 1; max-width: 140px;';
    confirmBtn.onclick = () => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        if (onConfirm) onConfirm();
    };

    buttonContainer.appendChild(confirmBtn);

    // 取消按钮（如果提供）
    if (onCancel !== null) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = cancelText;
        cancelBtn.style.cssText = 'flex: 1; max-width: 140px;';
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
            if (onCancel) onCancel();
        };
        buttonContainer.appendChild(cancelBtn);
    }

    modal.appendChild(titleEl);
    modal.appendChild(messageEl);
    modal.appendChild(buttonContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// ========== 常驻状态栏功能 ==========

// 应用屏幕常亮设置
function applyKeepScreenOn() {
    if (notificationSettings.keepScreenOn) {
        acquireWakeLock();
    } else {
        releaseWakeLock();
    }
}

// 获取屏幕唤醒锁
function acquireWakeLock() {
    // 先释放现有的锁
    releaseWakeLock();

    // 尝试使用 Screen Wake Lock API（现代浏览器）
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen')
            .then(lock => {
                wakeLock = lock;
                console.log('屏幕常亮已启用');

                // 监听唤醒锁被释放的事件
                wakeLock.addEventListener('release', () => {
                    console.log('屏幕常亮已释放');
                    wakeLock = null;
                    // 如果用户仍然需要屏幕常亮，尝试重新获取
                    if (notificationSettings.keepScreenOn) {
                        // 延迟重新获取，避免立即请求
                        setTimeout(() => {
                            if (notificationSettings.keepScreenOn) {
                                acquireWakeLock();
                            }
                        }, 100);
                    }
                });
            })
            .catch(err => {
                console.log('无法获取屏幕唤醒锁:', err);
                // 如果失败，尝试使用HBuilderX的API
                fallbackToPlusKeepScreenOn();
            });
    } else {
        // 回退到HBuilderX API
        fallbackToPlusKeepScreenOn();
    }
}

// HBuilderX API 备选方案
function fallbackToPlusKeepScreenOn() {
    if (window.plus && plus.device && plus.device.setWakelock) {
        try {
            plus.device.setWakelock(true);
            console.log('HBuilderX 屏幕常亮已启用');
        } catch (e) {
            console.log('HBuilderX 屏幕常亮设置失败:', e);
        }
    }
}

// 释放屏幕唤醒锁
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('屏幕唤醒锁已释放');
    }

    // 如果使用HBuilderX API，释放常亮
    if (window.plus && plus.device && plus.device.setWakelock) {
        try {
            plus.device.setWakelock(false);
            console.log('HBuilderX 屏幕常亮已关闭');
        } catch (e) {
            console.log('关闭屏幕常亮失败:', e);
        }
    }
}

// 设置常驻状态栏
function setStatusBarMode(enable) {
    if (window.plus && plus.navigator) {
        try {
            if (enable) {
                // 设置为沉浸式状态栏（常驻）
                plus.navigator.setStatusBarStyle('light');
                console.log('常驻状态栏已启用');
            } else {
                // 恢复默认
                plus.navigator.setStatusBarStyle('dark');
                console.log('常驻状态栏已关闭');
            }
        } catch (e) {
            console.log('设置状态栏失败:', e);
        }
    }
}

// 应用常驻状态栏设置
function applyStatusBarSetting() {
    setStatusBarMode(notificationSettings.enableStatusBar);
}








