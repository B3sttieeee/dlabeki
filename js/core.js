/* =========================================================
   D&E // TERMINAL V6
   CORE ENGINE
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DEFAULT GAME DATA
       ===================================================== */

    const DEFAULT_GAME_DATA = {
        gold: 0,
        iron: 0,
        mithril: 0,

        baseDmg: 10,
        baseDps: 0,

        clickPower: 1,
        pickaxeLevel: 1,
        mercenaryLevel: 0,

        highestDungeon: 1,

        level: 1,
        exp: 0,
        maxExp: 100,

        skillPoints: 0,

        skills: {
            hp: 0,
            dmg: 0,
            lifesteal: 0,
            crit: 0
        },

        prestige: 0,

        quests: {
            kills: 0,
            mines: 0,
            killsClaimed: false,
            minesClaimed: false
        }
    };

    /* =====================================================
       GLOBAL PLAYER STATE
       ===================================================== */

    window.gameData =
        createDefaultGameData();

    window.playerMaxHp = 100;
    window.playerCurrentHp = 100;

    window.isDead = false;
    window.isFighting = false;

    window.gameInitialized = false;

    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY = "nasa_save_v6";

    /* =====================================================
       HELPERS
       ===================================================== */

    function safeNumber(
        value,
        fallback = 0
    ) {
        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }

    function clamp(
        value,
        min,
        max
    ) {
        return Math.min(
            Math.max(value, min),
            max
        );
    }

    function deepClone(obj) {
        return JSON.parse(
            JSON.stringify(obj)
        );
    }

    function createDefaultGameData() {
        return deepClone(
            DEFAULT_GAME_DATA
        );
    }

    function mergeGameData(saved) {

        const defaults =
            createDefaultGameData();

        if (
            !saved ||
            typeof saved !== "object"
        ) {
            return defaults;
        }

        const merged = {
            ...defaults,
            ...saved,

            skills: {
                ...defaults.skills,
                ...(saved.skills || {})
            },

            quests: {
                ...defaults.quests,
                ...(saved.quests || {})
            }
        };

        return merged;
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function setText(
        id,
        value
    ) {
        const element =
            getElement(id);

        if (element) {
            element.textContent =
                value;
        }
    }

    function setWidth(
        id,
        percentage
    ) {
        const element =
            getElement(id);

        if (!element) {
            return;
        }

        element.style.width =
            `${clamp(
                safeNumber(
                    percentage,
                    0
                ),
                0,
                100
            )}%`;
    }

    function notify(message) {
        if (
            typeof window.logMessage ===
            "function"
        ) {
            window.logMessage(
                message
            );
        } else {
            console.log(
                message
            );
        }
    }

    /* =====================================================
       TAB SYSTEM
       ===================================================== */

    window.openTab =
        function openTab(tabId) {

            const screens =
                document.querySelectorAll(
                    ".screen"
                );

            const buttons =
                document.querySelectorAll(
                    ".tab-btn"
                );

            screens.forEach(
                screen => {
                    screen.classList.remove(
                        "active"
                    );
                }
            );

            buttons.forEach(
                button => {
                    button.classList.remove(
                        "active"
                    );
                }
            );

            const targetScreen =
                getElement(tabId);

            if (targetScreen) {
                targetScreen.classList.add(
                    "active"
                );
            }

            /*
             * Najpierw szukamy po data-tab,
             * a dla kompatybilności również
             * po onclick.
             */

            let activeButton =
                document.querySelector(
                    `.tab-btn[data-tab="${tabId}"]`
                );

            if (!activeButton) {
                activeButton =
                    document.querySelector(
                        `.tab-btn[onclick*="${tabId}"]`
                    );
            }

            if (activeButton) {
                activeButton.classList.add(
                    "active"
                );
            }

            /*
             * Potwór atakuje tylko podczas
             * aktywnej zakładki ekspedycji.
             */

            window.isFighting =
                (
                    tabId === "tab-combat" &&
                    !window.isDead
                );

            /*
             * Aktualizacja questów
             */

            if (
                tabId === "tab-quests" &&
                typeof window.updateQuestsUI ===
                    "function"
            ) {
                window.updateQuestsUI();
            }

            /*
             * Odświeżenie inventory
             */

            if (
                tabId === "tab-inventory" &&
                typeof window.renderInventory ===
                    "function"
            ) {
                window.renderInventory();
            }
        };

    /* =====================================================
       SAVE GAME
       ===================================================== */

    window.saveGame =
        function saveGame() {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        window.gameData
                    )
                );

                if (
                    typeof window.saveInventory ===
                    "function"
                ) {
                    window.saveInventory();
                }

                if (
                    typeof window.saveCombat ===
                    "function"
                ) {
                    window.saveCombat();
                }

                return true;

            } catch (error) {

                console.error(
                    "Błąd zapisu gry:",
                    error
                );

                return false;
            }
        };

    /* =====================================================
       LOAD GAME
       ===================================================== */

    window.loadGame =
        function loadGame() {

            try {

                const saved =
                    localStorage.getItem(
                        STORAGE_KEY
                    );

                if (saved) {

                    const parsed =
                        JSON.parse(
                            saved
                        );

                    window.gameData =
                        mergeGameData(
                            parsed
                        );

                } else {

                    window.gameData =
                        createDefaultGameData();
                }

            } catch (error) {

                console.error(
                    "Błąd wczytywania zapisu:",
                    error
                );

                notify(
                    "⚠️ Nie udało się odczytać zapisu. Załadowano bezpieczny profil."
                );

                window.gameData =
                    createDefaultGameData();
            }

            /*
             * Dodatkowe zabezpieczenia
             */

            sanitizeGameData();

            /*
             * Załaduj UI
             */

            if (
                typeof window.updateShopUI ===
                "function"
            ) {
                window.updateShopUI();
            }

            if (
                typeof window.updateSkillsUI ===
                "function"
            ) {
                window.updateSkillsUI();
            }

            if (
                typeof window.updateQuestsUI ===
                "function"
            ) {
                window.updateQuestsUI();
            }

            /*
             * Inventory przelicza dodatkowe statystyki.
             */

            if (
                typeof window.recalculatePlayerStats ===
                "function"
            ) {
                window.recalculatePlayerStats();
            } else {
                window.playerMaxHp =
                    calculateBaseMaxHp();
            }

            /*
             * Po załadowaniu zapisujemy pełne HP.
             */

            window.playerCurrentHp =
                window.playerMaxHp;

            window.isDead = false;
            window.isFighting = false;

            updateStatusUI();

            if (
                typeof window.loadCombat ===
                "function"
            ) {
                try {
                    window.loadCombat();
                } catch (error) {
                    console.error(
                        "Błąd loadCombat():",
                        error
                    );
                }
            }
        };

    /* =====================================================
       SANITIZE GAME DATA
       ===================================================== */

    function sanitizeGameData() {

        const g =
            window.gameData;

        /*
         * Resources
         */

        g.gold =
            Math.max(
                0,
                safeNumber(g.gold)
            );

        g.iron =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.iron
                    )
                )
            );

        g.mithril =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.mithril
                    )
                )
            );

        /*
         * Base stats
         */

        g.baseDmg =
            Math.max(
                0,
                safeNumber(
                    g.baseDmg,
                    10
                )
            );

        g.baseDps =
            Math.max(
                0,
                safeNumber(
                    g.baseDps,
                    0
                )
            );

        g.clickPower =
            Math.max(
                1,
                safeNumber(
                    g.clickPower,
                    1
                )
            );

        /*
         * Upgrades
         */

        g.pickaxeLevel =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.pickaxeLevel,
                        1
                    )
                )
            );

        g.mercenaryLevel =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.mercenaryLevel
                    )
                )
            );

        /*
         * Dungeon
         */

        g.highestDungeon =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.highestDungeon,
                        1
                    )
                )
            );

        /*
         * Level
         */

        g.level =
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        g.level,
                        1
                    )
                )
            );

        g.exp =
            Math.max(
                0,
                safeNumber(
                    g.exp
                )
            );

        g.maxExp =
            Math.max(
                1,
                safeNumber(
                    g.maxExp,
                    100
                )
            );

        /*
         * Skill points
         */

        g.skillPoints =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.skillPoints
                    )
                )
            );

        /*
         * Skills
         */

        g.skills.hp =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.hp
                    )
                ),
                0,
                50
            );

        g.skills.dmg =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.dmg
                    )
                ),
                0,
                50
            );

        g.skills.lifesteal =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.lifesteal
                    )
                ),
                0,
                20
            );

        g.skills.crit =
            clamp(
                Math.floor(
                    safeNumber(
                        g.skills.crit
                    )
                ),
                0,
                25
            );

        /*
         * Prestige
         */

        g.prestige =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.prestige
                    )
                )
            );

        /*
         * Quests
         */

        g.quests.kills =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.quests.kills
                    )
                )
            );

        g.quests.mines =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.quests.mines
                    )
                )
            );

        g.quests.killsClaimed =
            Boolean(
                g.quests.killsClaimed
            );

        g.quests.minesClaimed =
            Boolean(
                g.quests.minesClaimed
            );
    }

    /* =====================================================
       BASE HP
       ===================================================== */

    function calculateBaseMaxHp() {

        const skills =
            window.gameData.skills;

        return Math.max(
            1,

            Math.floor(
                (
                    100 +
                    (
                        skills.hp *
                        20
                    )
                )
                *
                (
                    1 +
                    (
                        window.gameData.prestige *
                        0.5
                    )
                )
            )
        );
    }

    /* =====================================================
       MINING SYSTEM
       ===================================================== */

    window.mineGold =
        function mineGold() {

            const g =
                window.gameData;

            /*
             * Podstawa wydobycia.
             */

            const baseAmount =
                Math.max(
                    1,
                    Math.floor(
                        safeNumber(
                            g.clickPower,
                            1
                        )
                    )
                );

            /*
             * Losowy bonus zależny
             * od poziomu kilofa.
             */

            const randomBonus =
                Math.floor(
                    Math.random() *
                    (
                        Math.max(
                            1,
                            g.pickaxeLevel * 2
                        )
                    )
                );

            const mined =
                baseAmount +
                randomBonus;

            g.gold +=
                mined;

            /*
             * ŻELAZO
             *
             * 5% + 1% za poziom kilofa.
             */

            const ironChance =
                Math.min(
                    0.5,
                    0.05 +
                    (
                        g.pickaxeLevel *
                        0.01
                    )
                );

            if (
                Math.random() <
                ironChance
            ) {

                g.iron++;

                notify(
                    "🔩 Wykopano Żelazo!"
                );
            }

            /*
             * MITHRIL
             */

            const mithrilChance =
                Math.min(
                    0.25,
                    0.01 +
                    (
                        g.pickaxeLevel *
                        0.002
                    )
                );

            if (
                Math.random() <
                mithrilChance
            ) {

                g.mithril++;

                notify(
                    "💠 Wykopano Mithril!"
                );
            }

            /*
             * QUEST
             */

            g.quests.mines++;

            /*
             * UI
             */

            updateStatusUI();

            if (
                typeof window.updateQuestsUI ===
                "function"
            ) {
                window.updateQuestsUI();
            }

            /*
             * Animacja skały
             */

            const rock =
                document.querySelector(
                    ".mine-interact"
                );

            if (rock) {

                rock.style.transform =
                    "scale(0.9) translateY(10px)";

                window.setTimeout(
                    () => {

                        rock.style.transform =
                            "";

                    },
                    80
                );
            }

            /*
             * Jeśli później będzie licznik
             * wydobytych surowców:
             */

            const mineStatus =
                getElement(
                    "mine-status"
                );

            if (mineStatus) {

                mineStatus.innerHTML =
                    `
                        <span class="text-gold">
                            +${mined} 🪙
                        </span>
                    `;
            }

            /*
             * Lekki autosave po kopnięciu.
             */

            saveGame();

            return mined;
        };

    /* =====================================================
       SHOP
       ===================================================== */

    window.buyUpgrade =
        function buyUpgrade(type) {

            const g =
                window.gameData;

            /*
             * KILOF
             */

            if (
                type === "pickaxe"
            ) {

                const cost =
                    100 *
                    g.pickaxeLevel;

                if (
                    g.gold >=
                    cost
                ) {

                    g.gold -=
                        cost;

                    g.clickPower +=
                        3;

                    g.pickaxeLevel++;

                    notify(
                        `⛏️ Kilof ulepszony do poziomu ${g.pickaxeLevel}.`
                    );

                } else {

                    notify(
                        `❌ Brak złota. Potrzebujesz ${cost} 🪙.`
                    );
                }
            }

            /*
             * DRON / MERCENARY
             */

            else if (
                type === "mercenary"
            ) {

                const cost =
                    500 *
                    (
                        g.mercenaryLevel +
                        1
                    );

                if (
                    g.gold >=
                    cost
                ) {

                    g.gold -=
                        cost;

                    g.baseDps +=
                        15;

                    g.mercenaryLevel++;

                    notify(
                        `🤖 Dron bojowy ulepszony do poziomu ${g.mercenaryLevel}.`
                    );

                } else {

                    notify(
                        `❌ Brak złota. Potrzebujesz ${cost} 🪙.`
                    );
                }
            }

            /*
             * HEAL
             */

            else if (
                type === "heal"
            ) {

                const cost =
                    200;

                if (
                    g.gold < cost
                ) {

                    notify(
                        `❌ Brak złota. Potrzebujesz ${cost} 🪙.`
                    );

                } else if (
                    window.playerCurrentHp >=
                    window.playerMaxHp
                ) {

                    notify(
                        "❤️ Masz pełne zdrowie."
                    );

                } else {

                    g.gold -=
                        cost;

                    const amount =
                        Math.floor(
                            window.playerMaxHp *
                            0.5
                        );

                    healPlayer(
                        amount
                    );

                    notify(
                        `❤️ Odzyskano ${amount} HP.`
                    );
                }
            }

            else {
                console.warn(
                    "Nieznany typ upgrade:",
                    type
                );

                return false;
            }

            /*
             * UI
             */

            updateStatusUI();
            updateShopUI();

            if (
                typeof window.recalculatePlayerStats ===
                "function"
            ) {
                window.recalculatePlayerStats();
            }

            saveGame();

            return true;
        };

    /* =====================================================
       SHOP UI
       ===================================================== */

    window.updateShopUI =
        function updateShopUI() {

            const g =
                window.gameData;

            const pickaxeCost =
                100 *
                g.pickaxeLevel;

            const mercenaryCost =
                500 *
                (
                    g.mercenaryLevel +
                    1
                );

            setText(
                "cost-pickaxe",
                pickaxeCost
            );

            setText(
                "cost-merc",
                mercenaryCost
            );
        };

    /* =====================================================
       QUEST SYSTEM
       ===================================================== */

    window.updateQuestsUI =
        function updateQuestsUI() {

            const quests =
                window.gameData.quests;

            /*
             * KILLS
             */

            setText(
                "q-kills",
                quests.kills
            );

            /*
             * MINES
             */

            setText(
                "q-mines",
                quests.mines
            );

            /*
             * KILL QUEST BUTTON
             */

            const btnKills =
                getElement(
                    "btn-q-kills"
                );

            if (btnKills) {

                btnKills.style.borderColor =
                    "";

                if (
                    quests.killsClaimed
                ) {

                    btnKills.disabled =
                        true;

                    btnKills.innerHTML =
                        `
                            ✅ ZROBIONE
                        `;

                } else if (
                    quests.kills >= 10
                ) {

                    btnKills.disabled =
                        false;

                    btnKills.style.borderColor =
                        "var(--accent-gold)";

                    btnKills.innerHTML =
                        `
                            🎁 ODBIERZ —
                            <span class="text-gold">
                                1000 🪙
                            </span>
                        `;

                } else {

                    btnKills.disabled =
                        true;

                    btnKills.innerHTML =
                        `
                            🔒 1000 🪙
                        `;
                }
            }

            /*
             * MINING QUEST BUTTON
             */

            const btnMines =
                getElement(
                    "btn-q-mines"
                );

            if (btnMines) {

                btnMines.style.borderColor =
                    "";

                if (
                    quests.minesClaimed
                ) {

                    btnMines.disabled =
                        true;

                    btnMines.innerHTML =
                        `
                            ✅ ZROBIONE
                        `;

                } else if (
                    quests.mines >= 50
                ) {

                    btnMines.disabled =
                        false;

                    btnMines.style.borderColor =
                        "var(--accent-gold)";

                    btnMines.innerHTML =
                        `
                            🎁 ODBIERZ —
                            <span class="text-accent">
                                5 💠
                            </span>
                        `;

                } else {

                    btnMines.disabled =
                        true;

                    btnMines.innerHTML =
                        `
                            🔒 5 💠
                        `;
                }
            }

            /*
             * PRESTIGE
             */

            setText(
                "prestige-tokens",
                quests
                    ? window.gameData.prestige
                    : 0
            );

            setText(
                "prestige-amount",
                window.gameData.prestige
            );

            setText(
                "prestige-multiplier",
                window.gameData.prestige *
                50
            );
        };

    /* =====================================================
       QUEST CLAIM
       ===================================================== */

    window.claimQuest =
        function claimQuest(type) {

            const q =
                window.gameData.quests;

            let claimed =
                false;

            /*
             * KILLS
             */

            if (
                type === "kills" &&
                q.kills >= 10 &&
                !q.killsClaimed
            ) {

                q.killsClaimed =
                    true;

                window.gameData.gold +=
                    1000;

                notify(
                    "📜 Ukończono zadanie: Pogromca Bestii! +1000 🪙"
                );

                claimed = true;
            }

            /*
             * MINES
             */

            else if (
                type === "mines" &&
                q.mines >= 50 &&
                !q.minesClaimed
            ) {

                q.minesClaimed =
                    true;

                window.gameData.mithril +=
                    5;

                notify(
                    "📜 Ukończono zadanie: Górnik Przodowy! +5 💠"
                );

                claimed = true;
            }

            if (!claimed) {

                notify(
                    "❌ Zadanie nie jest jeszcze gotowe."
                );

                return false;
            }

            updateStatusUI();
            updateQuestsUI();
            saveGame();

            return true;
        };

    /* =====================================================
       PRESTIGE / REBIRTH
       ===================================================== */

    window.doPrestige =
        function doPrestige() {

            const g =
                window.gameData;

            if (
                g.level < 50
            ) {

                notify(
                    "❌ Prestiż wymaga 50 Poziomu."
                );

                return false;
            }

            const confirmed =
                window.confirm(
                    "TWARDY RESET\n\n" +
                    "Stracisz:\n" +
                    "• Poziom\n" +
                    "• Skille\n" +
                    "• Złoto\n" +
                    "• Żelazo\n" +
                    "• Mithril\n" +
                    "• Zadania\n\n" +
                    "Zachowasz Ekwipunek.\n\n" +
                    "Otrzymasz +50% do DMG, DPS i HP.\n\n" +
                    "Czy chcesz aktywować Prestiż?"
                );

            if (!confirmed) {
                return false;
            }

            /*
             * +1 PRESTIGE
             */

            g.prestige++;

            /*
             * RESET RESOURCES
             */

            g.gold = 0;
            g.iron = 0;
            g.mithril = 0;

            /*
             * RESET LEVEL
             */

            g.level = 1;
            g.exp = 0;
            g.maxExp = 100;

            /*
             * RESET SKILLS
             */

            g.skillPoints = 0;

            g.skills = {
                hp: 0,
                dmg: 0,
                lifesteal: 0,
                crit: 0
            };

            /*
             * RESET QUESTS
             */

            g.quests = {
                kills: 0,
                mines: 0,
                killsClaimed: false,
                minesClaimed: false
            };

            /*
             * HP
             */

            window.isDead = false;
            window.isFighting = false;

            /*
             * Recalculate equipment
             */

            if (
                typeof window.recalculatePlayerStats ===
                "function"
            ) {
                window.recalculatePlayerStats();
            }

            window.playerCurrentHp =
                window.playerMaxHp;

            /*
             * UI
             */

            updateStatusUI();
            updateSkillsUI();
            updateQuestsUI();
            updateShopUI();

            if (
                typeof window.renderInventory ===
                "function"
            ) {
                window.renderInventory();
            }

            /*
             * EXPEDITION
             */

            const attackBtn =
                getElement(
                    "attack-btn"
                );

            const resumeBtn =
                getElement(
                    "resume-btn"
                );

            if (attackBtn) {
                attackBtn.style.display =
                    "block";
            }

            if (resumeBtn) {
                resumeBtn.style.display =
                    "none";
            }

            /*
             * LOG
             */

            notify(
                `🌌 PRESTIŻ ${g.prestige} AKTYWOWANY! +50% GLOBALNEGO MNOŻNIKA.`
            );

            saveGame();

            return true;
        };

    /* =====================================================
       EXP / LEVELING
       ===================================================== */

    window.gainExp =
        function gainExp(amount) {

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount
                    )
                );

            if (
                amount <= 0
            ) {
                return false;
            }

            const g =
                window.gameData;

            g.exp +=
                amount;

            let levelUps =
                0;

            /*
             * Obsługa wielu poziomów
             * jednocześnie.
             */

            while (
                g.exp >= g.maxExp
            ) {

                g.exp -=
                    g.maxExp;

                g.level++;

                g.maxExp =
                    Math.max(
                        1,
                        Math.floor(
                            g.maxExp *
                            1.5
                        )
                    );

                /*
                 * 2 punkty za poziom
                 */

                g.skillPoints +=
                    2;

                levelUps++;

                /*
                 * Pełne HP po level up
                 */

                if (
                    typeof window.recalculatePlayerStats ===
                    "function"
                ) {
                    window.recalculatePlayerStats();
                }

                window.playerCurrentHp =
                    window.playerMaxHp;

                notify(
                    `⚡ AWANS! Poziom ${g.level}. +2 punkty skilli.`
                );
            }

            /*
             * UI
             */

            updateStatusUI();
            updateSkillsUI();

            if (
                typeof window.updateQuestsUI ===
                "function"
            ) {
                window.updateQuestsUI();
            }

            saveGame();

            return levelUps;
        };

    /* =====================================================
       SKILL UPGRADE
       ===================================================== */

    window.upgradeSkill =
        function upgradeSkill(type) {

            const g =
                window.gameData;

            const maxLevels = {
                hp: 50,
                dmg: 50,
                lifesteal: 20,
                crit: 25
            };

            if (
                !Object.prototype.hasOwnProperty.call(
                    maxLevels,
                    type
                )
            ) {

                console.warn(
                    "Nieznany skill:",
                    type
                );

                return false;
            }

            if (
                g.skillPoints <= 0
            ) {

                notify(
                    "❌ Brak punktów skilli."
                );

                return false;
            }

            if (
                g.skills[type] >=
                maxLevels[type]
            ) {

                notify(
                    "🔒 Ten skill osiągnął maksymalny poziom."
                );

                return false;
            }

            /*
             * LEVEL UP
             */

            g.skills[type]++;

            g.skillPoints--;

            /*
             * Przelicz statystyki
             */

            if (
                typeof window.recalculatePlayerStats ===
                "function"
            ) {
                window.recalculatePlayerStats();
            }

            /*
             * Jeżeli HP wzrosło,
             * można automatycznie dodać
             * różnicę do aktualnego HP.
             */

            if (
                type === "hp"
            ) {

                const oldMaxHp =
                    window.playerMaxHp;

                /*
                 * recalculatePlayerStats()
                 * już ustawiło nowy max HP.
                 *
                 * Nie healujemy całkowicie,
                 * tylko zwiększamy aktualne HP
                 * o wartość nowego bonusu.
                 */

                if (
                    window.playerCurrentHp >
                    0
                ) {

                    window.playerCurrentHp =
                        Math.min(
                            window.playerMaxHp,
                            window.playerCurrentHp +
                            20
                        );
                }

                /*
                 * Zabezpieczenie dla bardzo starego
                 * kodu, gdy oldMaxHp nie jest używane.
                 */

                void oldMaxHp;
            }

            updateSkillsUI();
            updateStatusUI();

            notify(
                `🧠 Ulepszono skill: ${type} → poziom ${g.skills[type]}.`
            );

            saveGame();

            return true;
        };

    /* =====================================================
       SKILL UI
       ===================================================== */

    window.updateSkillsUI =
        function updateSkillsUI() {

            const g =
                window.gameData;

            setText(
                "skill-points",
                g.skillPoints
            );

            const skills = [
                "hp",
                "dmg",
                "lifesteal",
                "crit"
            ];

            skills.forEach(
                skill => {

                    const element =
                        getElement(
                            `skill-lvl-${skill}`
                        );

                    if (element) {

                        element.textContent =
                            g.skills[skill];
                    }
                }
            );
        };

    /* =====================================================
       HEAL
       ===================================================== */

    window.healPlayer =
        function healPlayer(
            amount
        ) {

            if (
                window.isDead
            ) {
                return 0;
            }

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount
                    )
                );

            if (
                amount <= 0
            ) {
                return 0;
            }

            const oldHp =
                window.playerCurrentHp;

            window.playerCurrentHp =
                Math.min(
                    window.playerMaxHp,
                    window.playerCurrentHp +
                    amount
                );

            const healed =
                window.playerCurrentHp -
                oldHp;

            updateStatusUI();

            return healed;
        };

    /* =====================================================
       DAMAGE PLAYER
       ===================================================== */

    window.damagePlayer =
        function damagePlayer(
            amount
        ) {

            if (
                window.isDead ||
                !window.isFighting
            ) {
                return false;
            }

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount
                    )
                );

            if (
                amount <= 0
            ) {
                return false;
            }

            /*
             * Defense można później
             * dodać tutaj.
             */

            window.playerCurrentHp -=
                amount;

            if (
                window.playerCurrentHp <= 0
            ) {

                window.playerCurrentHp =
                    0;

                playerDies();

            } else {

                updateStatusUI();
            }

            return true;
        };

    /* =====================================================
       PLAYER DEATH
       ===================================================== */

    window.playerDies =
        function playerDies() {

            if (
                window.isDead
            ) {
                return;
            }

            window.isDead =
                true;

            window.isFighting =
                false;

            /*
             * Kara za śmierć:
             * -20% gold
             */

            window.gameData.gold =
                Math.floor(
                    window.gameData.gold *
                    0.8
                );

            notify(
                "<span class='text-red text-bold'>☠️ ZGINĄŁEŚ! Ekspedycja została wstrzymana.</span>"
            );

            /*
             * Buttons
             */

            const attackBtn =
                getElement(
                    "attack-btn"
                );

            const resumeBtn =
                getElement(
                    "resume-btn"
                );

            if (attackBtn) {
                attackBtn.style.display =
                    "none";
            }

            if (resumeBtn) {
                resumeBtn.style.display =
                    "block";
            }

            /*
             * Combat status
             */

            const status =
                getElement(
                    "combat-status"
                );

            if (status) {

                status.innerHTML =
                    `
                        <span class="text-red text-bold">
                            ☠️ POSTAĆ ZGINĘŁA
                        </span>

                        <br>

                        <span class="text-dim">
                            Ekspedycja wstrzymana.
                        </span>
                    `;
            }

            updateStatusUI();
            saveGame();
        };

    /* =====================================================
       RESUME EXPEDITION
       ===================================================== */

    window.resumeExpedition =
        function resumeExpedition() {

            window.playerCurrentHp =
                window.playerMaxHp;

            window.isDead =
                false;

            window.isFighting =
                true;

            const attackBtn =
                getElement(
                    "attack-btn"
                );

            const resumeBtn =
                getElement(
                    "resume-btn"
                );

            if (attackBtn) {
                attackBtn.style.display =
                    "block";
            }

            if (resumeBtn) {
                resumeBtn.style.display =
                    "none";
            }

            updateStatusUI();

            notify(
                "🟢 Ekspedycja wznowiona."
            );

            /*
             * Nowy potwór
             */

            if (
                typeof window.spawnMonster ===
                "function"
            ) {

                window.spawnMonster();
            }

            saveGame();
        };

    /* =====================================================
       STATUS UI
       ===================================================== */

    window.updateStatusUI =
        function updateStatusUI() {

            const g =
                window.gameData;

            /*
             * Resources
             */

            setText(
                "gold-amount",
                Math.floor(
                    g.gold
                )
            );

            setText(
                "iron-amount",
                Math.floor(
                    g.iron
                )
            );

            setText(
                "mithril-amount",
                Math.floor(
                    g.mithril
                )
            );

            setText(
                "prestige-amount",
                Math.floor(
                    g.prestige
                )
            );

            /*
             * HP
             */

            const maxHp =
                Math.max(
                    1,
                    safeNumber(
                        window.playerMaxHp,
                        100
                    )
                );

            window.playerMaxHp =
                maxHp;

            window.playerCurrentHp =
                clamp(
                    safeNumber(
                        window.playerCurrentHp,
                        maxHp
                    ),
                    0,
                    maxHp
                );

            const hpPercentage =
                (
                    window.playerCurrentHp /
                    maxHp
                ) *
                100;

            setWidth(
                "player-hp-bar",
                hpPercentage
            );

            setText(
                "player-current-hp",
                Math.floor(
                    window.playerCurrentHp
                )
            );

            setText(
                "player-max-hp",
                Math.floor(
                    maxHp
                )
            );

            /*
             * HP kolor
             */

            const hpBar =
                getElement(
                    "player-hp-bar"
                );

            if (hpBar) {

                hpBar.classList.remove(
                    "player-hp-fill",
                    "enemy-hp-fill"
                );

                if (
                    hpPercentage <= 25
                ) {

                    hpBar.classList.add(
                        "enemy-hp-fill"
                    );

                } else {

                    hpBar.classList.add(
                        "player-hp-fill"
                    );
                }
            }

            /*
             * LEVEL
             */

            setText(
                "player-level",
                g.level
            );

            /*
             * EXP
             */

            const expPercentage =
                (
                    g.exp /
                    Math.max(
                        1,
                        g.maxExp
                    )
                ) *
                100;

            setWidth(
                "exp-bar",
                expPercentage
            );
        };

    /* =====================================================
       LOG SYSTEM
       ===================================================== */

    window.logMessage =
        function logMessage(
            message
        ) {

            const logDiv =
                getElement(
                    "battle-log"
                );

            /*
             * Log może być wywoływany
             * zanim UI zostanie załadowane.
             */

            if (!logDiv) {

                console.log(
                    message
                );

                return;
            }

            const time =
                `<span class="text-dim">[${new Date().toLocaleTimeString("pl-PL")}]</span>`;

            const entry =
                document.createElement(
                    "div"
                );

            entry.innerHTML =
                `${time} ${message}`;

            /*
             * Najnowszy wpis na górze.
             */

            logDiv.prepend(
                entry
            );

            /*
             * Maksymalna liczba wpisów.
             */

            while (
                logDiv.children.length >
                100
            ) {

                logDiv.removeChild(
                    logDiv.lastElementChild
                );
            }
        };

    /* =====================================================
       RESET PLAYER HP
       ===================================================== */

    function restoreFullHp() {

        window.playerCurrentHp =
            window.playerMaxHp;

        window.isDead =
            false;

        updateStatusUI();
    }

    /* =====================================================
       AUTO ATTACK / GAME TICK
       ===================================================== */

    let gameTickStarted =
        false;

    function startGameTick() {

        if (
            gameTickStarted
        ) {
            return;
        }

        gameTickStarted =
            true;

        /*
         * TICK co sekundę.
         */

        window.setInterval(
            () => {

                /*
                 * Autosave.
                 */

                saveGame();

                /*
                 * Auto DPS.
                 */

                if (
                    window.isFighting &&
                    !window.isDead
                ) {

                    if (
                        window.totalDps > 0 &&
                        typeof window.autoAttack ===
                            "function"
                    ) {

                        window.autoAttack(
                            window.totalDps
                        );
                    }

                    /*
                     * Wróg atakuje.
                     */

                    if (
                        typeof window.enemyAttack ===
                            "function"
                    ) {

                        window.enemyAttack();
                    }
                }

            },
            1000
        );
    }

    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeGame() {

        if (
            window.gameInitialized
        ) {
            return;
        }

        window.gameInitialized =
            true;

        /*
         * Najpierw core save.
         */

        window.loadGame();

        /*
         * Inventory
         */

        if (
            typeof window.loadInventory ===
            "function"
        ) {

            try {

                window.loadInventory();

            } catch (error) {

                console.error(
                    "Błąd loadInventory():",
                    error
                );
            }
        }

        /*
         * Combat
         */

        if (
            typeof window.loadCombat ===
            "function"
        ) {

            try {

                window.loadCombat();

            } catch (error) {

                console.error(
                    "Błąd loadCombat():",
                    error
                );
            }
        }

        /*
         * UI
         */

        updateShopUI();
        updateSkillsUI();
        updateQuestsUI();

        if (
            typeof window.recalculatePlayerStats ===
            "function"
        ) {

            window.recalculatePlayerStats();
        }

        restoreFullHp();
        updateStatusUI();

        /*
         * Start tick.
         */

        startGameTick();

        /*
         * Domyślna zakładka.
         */

        if (
            !document.querySelector(
                ".screen.active"
            )
        ) {

            openTab(
                "tab-mine"
            );
        }

        /*
         * Log startowy.
         */

        notify(
            "🟢 D&E TERMINAL V6 — SYSTEM GOTOWY."
        );
    }

    /* =====================================================
       DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeGame,
            {
                once: true
            }
        );

    } else {

        initializeGame();
    }

    /* =====================================================
       BEFORE UNLOAD SAVE
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {
            saveGame();
        }
    );

})();