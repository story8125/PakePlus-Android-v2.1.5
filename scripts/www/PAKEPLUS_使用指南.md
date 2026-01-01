# PakePlus 打包 Android APP 使用指南

## 功能概述

您的净水倒计时提醒网页应用已经具备以下功能：

### 1. 免电池优化提醒 ✅
- 在设置中新增"电池优化"标签页
- 提供详细的操作步骤说明
- 点击按钮引导用户前往系统电池优化设置
- 提醒用户关闭电池优化以确保提醒功能正常运行

### 2. 自定义提醒声音 ✅
- 支持选择系统默认音效
- 支持上传自定义音乐文件（MP3、WAV等）
- 支持预设音乐文件（放置在 music 文件夹中）
- 提供试听功能
- 自定义音乐保存在本地存储中

## 使用 PakePlus 打包步骤

### 准备工作

1. **确保网页在浏览器中正常运行**
   - 打开 index.html 测试所有功能
   - 确认设置、倒计时、提醒等功能正常

2. **准备音乐文件（可选）**
   - 创建 `music` 文件夹
   - 将预设音乐文件放入该文件夹
   - 支持的格式：mp3, wav, ogg, m4a 等

### PakePlus 打包配置

#### 基本设置
```
应用名称：净水倒计时提醒
包名：com.waterpurifier.timer（或其他）
图标：准备一个 512x512 像素的 PNG 图标
```

#### 权限配置（重要！）
PakePlus 打包时需要申请以下权限：

```
必需权限：
- INTERNET（网络访问）
- VIBRATE（震动提醒）
- WAKE_LOCK（唤醒锁，防止休眠）
- RECEIVE_BOOT_COMPLETED（开机自启动）
- FOREGROUND_SERVICE（前台服务）
- POST_NOTIFICATIONS（Android 13+ 通知权限）
- REQUEST_IGNORE_BATTERY_OPTIMIZATIONS（电池优化权限）
```

#### 清单文件配置
如果 PakePlus 支持自定义 AndroidManifest.xml，添加以下内容：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

<!-- Android 13+ 通知权限 -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<application>
    <!-- 保持前台服务 -->
    <service
        android:name=".ForegroundService"
        android:foregroundServiceType="dataSync"
        android:enabled="true"
        android:exported="false" />

    <!-- 防止休眠 -->
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
</application>
```

### PakePlus 原生桥接配置（高级）

如果 PakePlus 支持 JavaScript 原生桥接，可以在应用中添加以下功能：

#### battery-optimization.js（添加到项目）
```javascript
// 原生桥接接口
window.Android = {
    openBatteryOptimizationSettings: function() {
        // 打开电池优化设置页面
        // 需要 PakePlus 支持
    },

    isIgnoringBatteryOptimizations: function() {
        // 检查是否已忽略电池优化
        // 需要 PakePlus 支持
        return false;
    },

    requestIgnoreBatteryOptimizations: function() {
        // 请求忽略电池优化
        // 需要 PakePlus 支持
    }
};
```

## 打包后测试清单

### 功能测试
- [ ] 应用安装成功
- [ ] 倒计时功能正常
- [ ] 提醒功能正常（有声音和通知）
- [ ] 自定义音乐上传和播放正常
- [ ] 设置保存和加载正常
- [ ] 应用关闭后能正常唤醒提醒

### 后台运行测试
- [ ] 应用在后台运行时提醒正常
- [ ] 手机锁屏后提醒正常
- [ ] 应用切换后不丢失计时状态

### 电池优化测试
- [ ] 点击"前往电池优化设置"能正确跳转
- [ ] 按照步骤关闭电池优化后，后台运行稳定
- [ ] 长时间后台运行不会被系统杀死

## 常见问题解决

### 1. 提醒不播放声音
**原因：** 可能被系统限制或电池优化导致
**解决：**
- 前往电池优化设置，选择"不优化"
- 确保应用有存储权限（自定义音乐需要）
- 检查系统通知设置

### 2. 应用在后台被杀死
**原因：** 电池优化或内存不足
**解决：**
- 关闭电池优化
- 在应用信息中选择"允许后台活动"
- 在多任务界面锁定应用

### 3. 自定义音乐无法播放
**原因：** 文件过大或格式不支持
**解决：**
- 确保音乐文件小于 10MB
- 使用常见格式（MP3、WAV）
- 检查文件是否损坏

### 4. 通知权限未授予
**解决：**
- Android 13+ 需要手动授权通知权限
- 在设置 -> 通知中打开应用通知

## 优化建议

### 提高可靠性
1. 添加前台服务，显示常驻通知
2. 使用 WorkManager 替代定时器（如果支持原生开发）
3. 添加网络请求保活机制

### 用户体验
1. 添加应用内引导，首次使用提示授予权限
2. 在主界面显示电池优化状态
3. 添加倒计时完成后的震动反馈

### 性能优化
1. 优化自定义音乐存储（考虑使用 IndexedDB 替代 localStorage）
2. 减少不必要的定时检查
3. 添加应用崩溃恢复机制

## 注意事项

1. **权限申请时机：** Android 6.0+ 需要在运行时动态申请权限
2. **电池优化：** 不同品牌手机（华为、小米、OPPO等）的设置路径不同
3. **自定义音乐限制：** localStorage 有大小限制（通常5-10MB），单个文件不宜过大
4. **WebView 限制：** 某些原生功能可能无法在 WebView 中完全实现

## 技术支持

如果遇到问题：
1. 查看 PakePlus 官方文档
2. 检查 Android 设备的系统版本和厂商定制
3. 测试不同品牌手机的表现差异
4. 考虑使用 Cordova、Capacitor 等更成熟的 WebView 打包方案

## 替代方案

如果 PakePlus 无法满足需求，可以考虑：

1. **Capacitor** - 支持原生插件，功能更强大
2. **Cordova** - 老牌 WebView 框架，插件丰富
3. **React Native / Flutter** - 原生开发，性能更好但开发成本高
4. **uni-app** - 国内流行，支持多端打包

---

祝您打包顺利！如有问题欢迎反馈。
