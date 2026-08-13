// js/core.js

// Zmienne globalne z domyślnymi wartościami (jeśli gracz jest nowy)
window.gold = 0;
window.playerDmg = 10;
window.clickPower = 1; 

// Próba wczytania zapisu przy starcie strony
function loadGame() {
    const saved = localStorage.getItem('dungeonsAndEggsSave');
    if (saved) {
        const data = JSON.parse(saved);
        window.gold = data.gold;
        window.playerDmg = data.playerDmg;
        window.clickPower = data.clickPower;
        logToBattle("Wczytano zapis gry.");
    } else {
        logToBattle("Witaj w Dungeons & Eggs!");
    }
    updateUI();
}

// Zapisywanie (wywoływane co jakiś czas albo po ważnej akcji)
function saveGame() {
    const data = {
        gold: window.gold,
        playerDmg: window.playerDmg,
        clickPower: window.clickPower
    };
    localStorage.setItem('dungeonsAndEggsSave', JSON.stringify(data));
}

// Funkcja aktualizująca widok (odświeża liczby na ekranie)
function updateUI() {
    document.getElementById('gold-amount').innerText = window.gold;
    document.getElementById('player-dmg').innerText = window.playerDmg;
}

// System wypisywania wiadomości w prawym dolnym rogu
function logToBattle(msg) {
    const logDiv = document.getElementById('battle-log');
    // Dodajemy godzinę dla lepszego efektu logów
    const time = new Date().toLocaleTimeString('pl-PL', { hour12: false });
    logDiv.innerHTML = `<span style="color: #666;">[${time}]</span> ${msg}<br>` + logDiv.innerHTML;
}

// Mechanika Kopalni (Clicker)
function mineGold() {
    // Bazowe złoto z kliknięcia + lekki losowy bonus
    const mined = window.clickPower + Math.floor(Math.random() * 3);
    window.gold += mined;
    updateUI();
    
    // Wizualny bajer - trzęsienie skały
    const rock = document.querySelector('.rock');
    rock.style.transform = `scale(0.9) rotate(${Math.random() * 10 - 5}deg)`;
    setTimeout(() => { rock.style.transform = 'scale(1) rotate(0deg)'; }, 100);
}

// Ulepszanie kilofa (zwiększa złoto z kliknięcia)
let pickaxeLevel = 1;
function upgradePickaxe() {
    const cost = 100 * pickaxeLevel;
    if (window.gold >= cost) {
        window.gold -= cost;
        window.clickPower += 2;
        pickaxeLevel++;
        logToBattle(`🆙 Ulepszono kilof! Moc kopania: ${window.clickPower}`);
        updateUI();
    } else {
        logToBattle(`❌ Potrzebujesz ${cost} złota na ulepszenie!`);
    }
}

// Start gry
window.onload = () => {
    loadGame();
    // Automatyczny zapis co 10 sekund
    setInterval(saveGame, 10000); 
};