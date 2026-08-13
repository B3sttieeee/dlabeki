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

// Nawigacja SPA (Single Page Application)
function openTab(tabId) {
    // Ukryj wszystkie ekrany robocze
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Zresetuj wygląd przycisków w nawigacji
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Aktywuj wybrany ekran i przycisk
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function saveGame() {
    localStorage.setItem('nasa_save', JSON.stringify(window.gameData));
    if(typeof saveInventory === 'function') saveInventory();
}

function loadGame() {
    const saved = localStorage.getItem('nasa_save');
    if (saved) window.gameData = { ...window.gameData, ...JSON.parse(saved) };
    updateStats();
    updateShopUI();
}

function mineGold() {
    const mined = window.gameData.clickPower + Math.floor(Math.random() * 3);
    window.gameData.gold += mined;
    updateStats();
    
    const rock = document.querySelector('.rock');
    rock.style.transform = `scale(0.9) translateY(10px)`;
    setTimeout(() => rock.style.transform = 'scale(1) translateY(0)', 80);
}

function buyUpgrade(type) {
    let cost = 0;
    if (type === 'pickaxe') {
        cost = 100 * window.gameData.pickaxeLevel;
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.clickPower += 3;
            window.gameData.pickaxeLevel++;
            logMessage(`SYS: Ulepszono sprzęt wydobywczy (Poziom ${window.gameData.pickaxeLevel}).`);
        }
    } else if (type === 'mercenary') {
        cost = 500 * (window.gameData.mercenaryLevel + 1);
        if (window.gameData.gold >= cost) {
            window.gameData.gold -= cost;
            window.gameData.baseDps += 15;
            window.gameData.mercenaryLevel++;
            logMessage(`SYS: Zainicjowano Drona Bojowego (Jednostka ${window.gameData.mercenaryLevel}).`);
        }
    }
    updateStats();
    updateShopUI();
    if(typeof recalculateTotalStats === 'function') recalculateTotalStats();
}

function updateShopUI() {
    const costPickaxe = document.getElementById('cost-pickaxe');
    const costMerc = document.getElementById('cost-merc');
    if(costPickaxe) costPickaxe.innerText = 100 * window.gameData.pickaxeLevel;
    if(costMerc) costMerc.innerText = 500 * (window.gameData.mercenaryLevel + 1);
}

function logMessage(msg) {
    const logDiv = document.getElementById('battle-log');
    if(!logDiv) return;
    const time = `<span class="log-time">[${new Date().toLocaleTimeString('pl-PL')}]</span>`;
    logDiv.innerHTML = `${time} ${msg}<br>` + logDiv.innerHTML;
}

window.onload = () => {
    loadGame();
    if(typeof loadInventory === 'function') loadInventory();
    if(typeof spawnMonster === 'function') spawnMonster();
    setInterval(saveGame, 5000); // Zapis co 5s
    setInterval(() => {
        if(window.totalDps > 0 && typeof autoAttack === 'function') {
            autoAttack(window.totalDps);
        }
    }, 1000);
};