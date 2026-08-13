// js/combat.js

const enemyNames = ["Ożywiony Truposz", "Szkielet Wojownik", "Mroczny Kultysta", "Demon z Otchłani", "Upadły Anioł"];
let enemyHp = 100;
let enemyMaxHp = 100;
let dungeonLevel = 1;

function spawnMonster() {
    // Skalowanie HP w stylu hack'n'slash (+40% co poziom)
    enemyMaxHp = Math.floor(100 * Math.pow(1.4, window.gameData.highestDungeon - 1));
    enemyHp = enemyMaxHp;
    dungeonLevel = window.gameData.highestDungeon;

    const randomName = enemyNames[(dungeonLevel - 1) % enemyNames.length];
    const isBoss = dungeonLevel % 5 === 0;
    
    const displayLevel = isBoss ? `BOSS Lv.${dungeonLevel}` : `Lv.${dungeonLevel}`;
    const displayName = isBoss ? `☠️ ${randomName} ☠️` : randomName;

    document.getElementById('dungeon-level').innerText = displayLevel;
    document.getElementById('monster-name').innerText = displayName;
    document.getElementById('monster-name').style.color = isBoss ? '#ff0000' : '#ff5722';
    
    updateHpUI();
}

function playerAttack() {
    dealDamage(window.totalDmg, true);
}

function autoAttack(dps) {
    // Funkcja wywoływana z core.js co 1 sekundę
    if (enemyHp > 0) {
        dealDamage(dps, false);
    }
}

function dealDamage(amount, isClick) {
    if (enemyHp <= 0) return; // Zapobiega biciu po śmierci

    // 15% szansy na krytyk (x2 obrażeń) przy klikaniu
    let finalDmg = amount;
    let isCrit = false;
    
    if (isClick && Math.random() < 0.15) {
        finalDmg *= 2;
        isCrit = true;
    }

    enemyHp -= finalDmg;
    
    if (isClick) {
        const msg = isCrit ? `<span class="log-dmg">💥 KRYTYK! Zadasz ${finalDmg} DMG!</span>` : `Zadajesz ${finalDmg} DMG.`;
        logMessage(msg);
    }

    if (enemyHp <= 0) {
        enemyHp = 0;
        updateHpUI();
        defeatMonster();
    } else {
        updateHpUI();
        if (isClick) playHitAnimation();
    }
}

function updateHpUI() {
    const percent = Math.max(0, (enemyHp / enemyMaxHp) * 100);
    const bar = document.getElementById('monster-hp');
    bar.style.width = percent + '%';
    
    document.getElementById('current-hp').innerText = enemyHp;
    document.getElementById('max-hp').innerText = enemyMaxHp;
}

function playHitAnimation() {
    const card = document.querySelector('.monster-card');
    card.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
    setTimeout(() => card.style.transform = 'translate(0, 0)', 50);
}

function defeatMonster() {
    // Złoto rośnie wykładniczo
    const reward = Math.floor((Math.random() * 20 + 30) * Math.pow(1.3, dungeonLevel - 1));
    window.gameData.gold += reward;
    updateStats();
    
    logMessage(`🏆 Potwór pokonany! Zdobywasz <span class="log-gold">${reward} 🪙</span>`);
    
    window.gameData.highestDungeon++;
    saveGame(); // Zapisujemy postęp dungeonu

    setTimeout(() => {
        spawnMonster();
    }, 800);
}