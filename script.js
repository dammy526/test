// 預設設定
const defaultSettings = {
    epSystem: {
        addPermission: 'admin',
        dailyReward: 3,
        levels: [
            { name: '[PVT3] Private Third Class', ep: 0 },
            { name: '[PVT2] Private Second Class', ep: 2 },
            { name: '[PVT1] Private First Class', ep: 5 },
            { name: '[PVTM] Private Master Class', ep: 8 },
            { name: '[SPC3] Specialist 3rd Class', ep: 10 }
        ]
    },
    moderation: {
        antiSpamEnabled: true,
        spamLimit: 5,
        warningLimit: 3,
        muteDuration: 10,
        autoModEnabled: false
    },
    automation: {
        welcomeEnabled: true,
        welcomeMessage: '歡迎 {user} 加入伺服器！',
        autoRoleEnabled: false,
        autoRoleName: '',
        statusRotation: true,
        statusMessages: [
            '/ep 查詢 EP',
            '/weather 查天氣',
            'EP 排行榜 / 工單 / 活動'
        ]
    },
    logging: {
        logChannel: '',
        logJoins: true,
        logMessages: true,
        logModActions: true,
        logErrors: false
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    updateBotStatus();
    setInterval(updateBotStatus, 30000); // 每30秒更新狀態
});

// 切換分頁
function openTab(tabName) {
    // 隱藏所有分頁內容
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // 移除所有分頁按鈕的 active 類別
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // 顯示選中的分頁內容和設定按鈕為 active
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 載入設定
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('botSettings')) || defaultSettings;
    
    // EP 系統
    document.getElementById('epAddPermission').value = settings.epSystem.addPermission;
    document.getElementById('dailyReward').value = settings.epSystem.dailyReward;
    renderLevelSettings(settings.epSystem.levels);
    
    // 管理功能
    document.getElementById('antiSpamEnabled').checked = settings.moderation.antiSpamEnabled;
    document.getElementById('spamLimit').value = settings.moderation.spamLimit;
    document.getElementById('warningLimit').value = settings.moderation.warningLimit;
    document.getElementById('muteDuration').value = settings.moderation.muteDuration;
    document.getElementById('autoModEnabled').checked = settings.moderation.autoModEnabled;
    
    // 自動化
    document.getElementById('welcomeEnabled').checked = settings.automation.welcomeEnabled;
    document.getElementById('welcomeMessage').value = settings.automation.welcomeMessage;
    document.getElementById('autoRoleEnabled').checked = settings.automation.autoRoleEnabled;
    document.getElementById('autoRoleName').value = settings.automation.autoRoleName;
    document.getElementById('statusRotation').checked = settings.automation.statusRotation;
    renderStatusMessages(settings.automation.statusMessages);
    
    // 日誌
    document.getElementById('logChannel').value = settings.logging.logChannel;
    document.getElementById('logJoins').checked = settings.logging.logJoins;
    document.getElementById('logMessages').checked = settings.logging.logMessages;
    document.getElementById('logModActions').checked = settings.logging.logModActions;
    document.getElementById('logErrors').checked = settings.logging.logErrors;
    
    showMessage('設定已載入！', 'success');
}

// 儲存設定
function saveSettings() {
    const settings = {
        epSystem: {
            addPermission: document.getElementById('epAddPermission').value,
            dailyReward: parseInt(document.getElementById('dailyReward').value),
            levels: getLevelSettings()
        },
        moderation: {
            antiSpamEnabled: document.getElementById('antiSpamEnabled').checked,
            spamLimit: parseInt(document.getElementById('spamLimit').value),
            warningLimit: parseInt(document.getElementById('warningLimit').value),
            muteDuration: parseInt(document.getElementById('muteDuration').value),
            autoModEnabled: document.getElementById('autoModEnabled').checked
        },
        automation: {
            welcomeEnabled: document.getElementById('welcomeEnabled').checked,
            welcomeMessage: document.getElementById('welcomeMessage').value,
            autoRoleEnabled: document.getElementById('autoRoleEnabled').checked,
            autoRoleName: document.getElementById('autoRoleName').value,
            statusRotation: document.getElementById('statusRotation').checked,
            statusMessages: getStatusMessages()
        },
        logging: {
            logChannel: document.getElementById('logChannel').value,
            logJoins: document.getElementById('logJoins').checked,
            logMessages: document.getElementById('logMessages').checked,
            logModActions: document.getElementById('logModActions').checked,
            logErrors: document.getElementById('logErrors').checked
        }
    };
    
    localStorage.setItem('botSettings', JSON.stringify(settings));
    
    // 這裡可以添加發送到 Bot 的程式碼
    sendSettingsToBot(settings);
    
    showMessage('設定已儲存！', 'success');
}

// 恢復預設設定
function resetSettings() {
    if (confirm('確定要恢復預設設定嗎？這將清除所有自訂設定。')) {
        localStorage.removeItem('botSettings');
        loadSettings();
        showMessage('已恢復預設設定！', 'success');
    }
}

// 等級設定相關函數
function renderLevelSettings(levels) {
    const container = document.getElementById('levelSettings');
    container.innerHTML = '';
    
    levels.forEach((level, index) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level-item';
        levelDiv.innerHTML = `
            <input type="text" value="${level.name}" placeholder="等級名稱" class="level-name">
            <input type="number" value="${level.ep}" placeholder="所需 EP" class="level-ep">
            ${index > 0 ? '<button class="remove-level" onclick="removeLevel(this)">❌</button>' : ''}
        `;
        container.appendChild(levelDiv);
    });
}

function getLevelSettings() {
    const levels = [];
    const levelItems = document.querySelectorAll('.level-item');
    
    levelItems.forEach(item => {
        const name = item.querySelector('.level-name').value;
        const ep = parseInt(item.querySelector('.level-ep').value);
        if (name && !isNaN(ep)) {
            levels.push({ name, ep });
        }
    });
    
    return levels;
}

function addLevel() {
    const levels = getLevelSettings();
    levels.push({ name: '', ep: 0 });
    renderLevelSettings(levels);
}

function removeLevel(button) {
    button.parentElement.remove();
}

// 狀態訊息相關函數
function renderStatusMessages(messages) {
    const container = document.getElementById('statusMessages');
    container.innerHTML = '';
    
    messages.forEach(message => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'status-input';
        input.value = message;
        input.placeholder = '狀態訊息';
        container.appendChild(input);
    });
}

function getStatusMessages() {
    const messages = [];
    const inputs = document.querySelectorAll('.status-input');
    
    inputs.forEach(input => {
        if (input.value.trim()) {
            messages.push(input.value);
        }
    });
    
    return messages;
}

function addStatusMessage() {
    const container = document.getElementById('statusMessages');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'status-input';
    input.placeholder = '狀態訊息';
    container.appendChild(input);
}

// 顯示訊息
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 更新 Bot 狀態（模擬）
function updateBotStatus() {
    // 這裡應該從 Bot 獲取真實狀態
    const status = Math.random() > 0.1 ? '✅ 線上' : '❌ 離線';
    document.getElementById('botStatus').textContent = status;
    
    // 模擬上線時間
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    document.getElementById('uptime').textContent = `${hours} 小時 ${minutes} 分鐘`;
}

// 發送設定到 Bot（需要根據你的 Bot 調整）
function sendSettingsToBot(settings) {
    // 這裡應該發送 HTTP 請求到你的 Bot
    console.log('發送設定到 Bot:', settings);
    
    // 範例：使用 fetch 發送到 Bot 的 API
    /*
    fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
    .then(response => response.json())
    .then(data => {
        console.log('設定已同步到 Bot:', data);
    })
    .catch(error => {
        console.error('同步設定失敗:', error);
        showMessage('同步設定失敗，請檢查 Bot 連線', 'error');
    });
    */
}