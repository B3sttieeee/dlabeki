// js/core.js

window.gameData = {
    gold: 0,
    baseDmg: 10,
    baseDps: 0,
    clickPower: 1,
    pickaxeLevel: 1,
    mercenaryLevel: 0,
    highestDungeon: 1
};

// Nawigacja
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Zapis i wczytywanie
function saveGame() {
    localStorage.setItem('dlabeki_save', JSON.stringify(window.gameData));
    saveInventory(); // Z inventory.js
}

function loadGame() {
    const saved = localStorage.getItem('dlabeki_save');
    if (saved) {
        window.gameData = { ...window.gameData, ...JSON.parse(saved) };
    }
    updateStats();
}

// Kopalnia
function mineGold() {
    const mined = window.gameData.clickPower + Math.floor(Math.random() * 3);
    window.gameData.gold += mined;
    updateStats();
    
    const rock = document.querySelector('.rock');
    rock.style.transform = `scale(0.9) rotate(${Math.random() * 10 - 5}deg)`;
    setTimeout(() => rock.style.transform = 'scale(1) rotate(0deg)', 100);
}

// Sklep (Ulepszenia za złoto)
function buyUpgrade(type) {
    if (type === 'pickaxe') {
        const cost = 100 * window.gameData.pickaxeLevel;
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.clickPower += 3;
            window.gameData.pickaxeLevel++;
            logMessage(`🆙 Kilof ulepszony! Moc kopania: ${window.gameData.clickPower}`);
        } else logMessage("❌ Za mało złota na kilof.");
    } else if (type === 'mercenary') {
        const cost = 500 * (window.gameData.mercenaryLevel + 1);
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.baseDps += 15;
            window.gameData.mercenaryLevel++;
            logMessage(`🔥 Wynajęto najemnika! Bazowy DPS: ${window.gameData.baseDps}`);
        } else logMessage("❌ Za mało złota na najemnika.");
    }
    updateStats();
    recalculateTotalStats(); // Z inventory.js
}

function logMessage(msg) {
    const logDiv = document.getElementById('battle-log');
    if(!logDiv) return;
    const time = `<span class="log-time">[${new Date().toLocaleTimeString('pl-PL')}]</span>`;
    logDiv.innerHTML = `${time} ${msg}<br>` + logDiv.innerHTML;
}

// Inicjalizacja
window.onload = () => {
    loadGame();
    if(typeof loadInventory === 'function') loadInventory();
    if(typeof spawnMonster === 'function') spawnMonster();
    
    // Auto-Zapis
    setInterval(saveGame, 10000);
    
    // Pętla DPS (Auto-atak)
    setInterval(() => {
        if(window.totalDps > 0 && typeof autoAttack === 'function') {
            autoAttack(window.totalDps);
        }
    }, 1000); // Równiutko co sekundę
};