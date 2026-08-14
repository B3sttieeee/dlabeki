(() => {
    "use strict";

    const SAVE_KEY = "pixel_realms_save_v1";

    const DEFAULT_DATA = {
        gold: 0,
        iron: 0,
        mithril: 0,

        baseDmg: 10,
        baseDps: 0,

        clickPower: 1,
        pickaxeLevel: 1,
        mercenaryLevel: 0,

        level: 1,
        exp: 0,
        maxExp: 100,

        skillPoints: 0,

        prestige: 0,

        skills: {
            hp: 0,
            dmg: 0,
            lifesteal: 0,
            crit: 0
        },

        quests: {
            kills: 0,
            mines: 0,
            killsClaimed: false,
            minesClaimed: false
        }
    };

    window.gameData = structuredCloneSafe(DEFAULT_DATA);

    window.playerMaxHp = 100;
    window.playerCurrentHp = 100;

    window.totalDmg = 10;
    window.totalDps = 0;
    window.totalCrit = 5;
    window.totalLifesteal = 0;

    window.isDead = false;
    window.isFighting = false;

    function structuredCloneSafe(value) {
        return JSON.parse(
            JSON.stringify(value)
        );
    }

    function safeNumber(value, fallback = 0) {
        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }

    function el(id) {
        return document.getElementById(id);
    }

    function text(id, value) {
        const node = el(id);

        if (node) {
            node.textContent = value;
        }
    }

    function mergeData(saved) {

        return {
            ...structuredCloneSafe(DEFAULT_DATA),
            ...(saved || {}),

            skills: {
                ...DEFAULT_DATA.skills,
                ...(saved?.skills || {})
            },

            quests: {
                ...DEFAULT_DATA.quests,
                ...(saved?.quests || {})
            }
        };
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    window.openTab = function(tabId, button) {

        document
            .querySelectorAll(".game-screen")
            .forEach(screen => {
                screen.classList.remove("active");
            });

        document
            .querySelectorAll(".menu-btn")
            .forEach(btn => {
                btn.classList.remove("active");
            });

        const target = el(tabId);

        if (target) {
            target.classList.add("active");
        }

        if (button) {
            button.classList.add("active");
        } else {
            const matching =
                document.querySelector(
                    `.menu-btn[data-screen="${tabId.replace("screen-", "")}"]`
                );

            if (matching) {
                matching.classList.add("active");
            }
        }
    };


    /* =====================================================
       SAVE
       ===================================================== */

    window.saveGame = function() {

        try {

            localStorage.setItem(
                SAVE_KEY,
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

        } catch (error) {
            console.error(
                "Save error:",
                error
            );
        }
    };


    /* =====================================================
       LOAD
       ===================================================== */

    window.loadGame = function() {

        try {

            const saved =
                localStorage.getItem(
                    SAVE_KEY
                );

            if (saved) {

                window.gameData =
                    mergeData(
                        JSON.parse(saved)
                    );
            }

        } catch (error) {

            console.error(
                "Load error:",
                error
            );

            window.gameData =
                structuredCloneSafe(
                    DEFAULT_DATA
                );
        }

        sanitize();

        updateAllUI();

        window.playerMaxHp =
            calculateMaxHp();

        window.playerCurrentHp =
            window.playerMaxHp;

        updateStatus();
    };


    function sanitize() {

        const g =
            window.gameData;

        g.gold =
            Math.max(
                0,
                safeNumber(g.gold)
            );

        g.iron =
            Math.max(
                0,
                Math.floor(
                    safeNumber(g.iron)
                )
            );

        g.mithril =
            Math.max(
                0,
                Math.floor(
                    safeNumber(g.mithril)
                )
            );

        g.level =
            Math.max(
                1,
                Math.floor(
                    safeNumber(g.level, 1)
                )
            );

        g.exp =
            Math.max(
                0,
                safeNumber(g.exp)
            );

        g.maxExp =
            Math.max(
                1,
                safeNumber(g.maxExp, 100)
            );

        g.skillPoints =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.skillPoints
                    )
                )
            );

        g.prestige =
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        g.prestige
                    )
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

        g.skills.hp =
            Math.min(
                50,
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(
                            g.skills.hp
                        )
                    )
                )
            );

        g.skills.dmg =
            Math.min(
                50,
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(
                            g.skills.dmg
                        )
                    )
                )
            );

        g.skills.lifesteal =
            Math.min(
                20,
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(
                            g.skills.lifesteal
                        )
                    )
                )
            );

        g.skills.crit =
            Math.min(
                25,
                Math.max(
                    0,
                    Math.floor(
                        safeNumber(
                            g.skills.crit
                        )
                    )
                );
        );
    }


    /* =====================================================
       STATS
       ===================================================== */

    function calculateMaxHp() {

        const base =
            100 +
            window.gameData.skills.hp *
            20;

        return Math.floor(
            base *
            (
                1 +
                window.gameData.prestige *
                0.5
            )
        );
    }


    window.recalculatePlayerStats =
    function() {

        const g =
            window.gameData;

        let dmg =
            g.baseDmg +
            g.skills.dmg * 10;

        let dps =
            g.baseDps;

        let hp =
            100 +
            g.skills.hp * 20;

        let crit =
            5 +
            g.skills.crit * 2;

        let lifesteal =
            g.skills.lifesteal;

        if (
            window.equipped
        ) {

            Object.values(
                window.equipped
            ).forEach(item => {

                if (!item) {
                    return;
                }

                const level =
                    Number(
                        item.upgradeLevel
                    ) || 0;

                const mult =
                    1 +
                    level * 0.10;

                dmg +=
                    Math.floor(
                        (item.dmgBonus || 0) *
                        mult
                    );

                dps +=
                    Math.floor(
                        (item.dpsBonus || 0) *
                        mult
                    );

                hp +=
                    Math.floor(
                        (item.hpBonus || 0) *
                        mult
                    );

                crit +=
                    Number(
                        item.critBonus || 0
                    );

                lifesteal +=
                    Number(
                        item.lifestealBonus || 0
                    );
            });
        }

        const prestige =
            1 +
            g.prestige * 0.5;

        window.totalDmg =
            Math.floor(
                dmg * prestige
            );

        window.totalDps =
            Math.floor(
                dps * prestige
            );

        window.playerMaxHp =
            Math.max(
                1,
                Math.floor(
                    hp * prestige
                )
            );

        window.totalCrit =
            Math.min(
                100,
                Number(
                    crit.toFixed(1)
                )
            );

        window.totalLifesteal =
            Math.min(
                100,
                Number(
                    lifesteal.toFixed(1)
                )
            );

        window.playerCurrentHp =
            Math.min(
                window.playerCurrentHp,
                window.playerMaxHp
            );

        updateStatus();

        if (
            typeof window.renderCombatStats ===
            "function"
        ) {
            window.renderCombatStats();
        }
    };


    /* =====================================================
       MINING
       ===================================================== */

    window.mineGold = function() {

        const g =
            window.gameData;

        const amount =
            Math.max(
                1,
                Math.floor(
                    g.clickPower +
                    Math.random() *
                    g.pickaxeLevel *
                    2
                )
            );

        g.gold += amount;

        if (
            Math.random() <
            0.05 +
            g.pickaxeLevel *
            0.01
        ) {

            g.iron++;

            logMessage(
                "🔩 Znaleziono Żelazo!"
            );
        }

        if (
            Math.random() <
            0.01 +
            g.pickaxeLevel *
            0.002
        ) {

            g.mithril++;

            logMessage(
                "💎 Znaleziono Mithril!"
            );
        }

        g.quests.mines++;

        updateStatus();

        saveGame();

        const rock =
            document.querySelector(
                ".mine-interact"
            );

        if (rock) {

            rock.style.transform =
                "translateY(5px) scale(.95)";

            setTimeout(() => {
                rock.style.transform = "";
            }, 90);
        }
    };


    /* =====================================================
       SHOP
       ===================================================== */

    window.buyUpgrade =
    function(type) {

        const g =
            window.gameData;

        if (
            type === "pickaxe"
        ) {

            const cost =
                100 *
                g.pickaxeLevel;

            if (
                g.gold < cost
            ) {

                logMessage(
                    "❌ Za mało złota."
                );

                return;
            }

            g.gold -= cost;

            g.clickPower += 3;
            g.pickaxeLevel++;

            logMessage(
                `⛏️ Kilof +1 — poziom ${g.pickaxeLevel}.`
            );
        }


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
                g.gold < cost
            ) {

                logMessage(
                    "❌ Za mało złota."
                );

                return;
            }

            g.gold -= cost;

            g.baseDps += 15;

            g.mercenaryLevel++;

            logMessage(
                `🤖 Dron poziom ${g.mercenaryLevel}.`
            );
        }


        else if (
            type === "heal"
        ) {

            if (
                g.gold < 200
            ) {

                logMessage(
                    "❌ Za mało złota."
                );

                return;
            }

            if (
                window.playerCurrentHp >=
                window.playerMaxHp
            ) {

                logMessage(
                    "❤️ Masz pełne HP."
                );

                return;
            }

            g.gold -= 200;

            window.healPlayer(
                window.playerMaxHp * .5
            );
        }

        updateAllUI();

        saveGame();
    };


    /* =====================================================
       XP
       ===================================================== */

    window.gainExp =
    function(amount) {

        const g =
            window.gameData;

        g.exp +=
            Math.max(
                0,
                Number(amount) || 0
            );

        while (
            g.exp >= g.maxExp
        ) {

            g.exp -=
                g.maxExp;

            g.level++;

            g.maxExp =
                Math.floor(
                    g.maxExp * 1.5
                );

            g.skillPoints += 2;

            window.playerCurrentHp =
                window.playerMaxHp;

            logMessage(
                `✨ AWANS! Osiągnięto poziom ${g.level}.`
            );
        }

        updateAllUI();

        saveGame();
    };


    /* =====================================================
       SKILLS
       ===================================================== */

    window.upgradeSkill =
    function(type) {

        const max = {
            hp: 50,
            dmg: 50,
            lifesteal: 20,
            crit: 25
        };

        if (
            window.gameData.skillPoints <= 0
        ) {

            logMessage(
                "❌ Brak punktów umiejętności."
            );

            return;
        }

        if (
            window.gameData.skills[type] >=
            max[type]
        ) {
            return;
        }

        window.gameData.skills[type]++;
        window.gameData.skillPoints--;

        recalculatePlayerStats();

        updateAllUI();

        saveGame();
    };


    /* =====================================================
       HP
       ===================================================== */

    window.healPlayer =
    function(amount) {

        if (
            window.isDead
        ) {
            return;
        }

        window.playerCurrentHp =
            Math.min(
                window.playerMaxHp,
                window.playerCurrentHp +
                Math.max(
                    0,
                    Number(amount) || 0
                )
            );

        updateStatus();
    };


    window.damagePlayer =
    function(amount) {

        if (
            window.isDead ||
            !window.isFighting
        ) {
            return;
        }

        window.playerCurrentHp -=
            Math.max(
                0,
                Number(amount) || 0
            );

        if (
            window.playerCurrentHp <= 0
        ) {

            window.playerCurrentHp = 0;

            window.isDead = true;
            window.isFighting = false;

            logMessage(
                "☠️ <b>ZGINĄŁEŚ!</b>"
            );

            const attack =
                document.getElementById(
                    "attack-btn"
                );

            const resume =
                document.getElementById(
                    "resume-btn"
                );

            if (attack) {
                attack.classList.add(
                    "hidden"
                );
            }

            if (resume) {
                resume.classList.remove(
                    "hidden"
                );
            }
        }

        updateStatus();
    };


    window.resumeExpedition =
    function() {

        window.playerCurrentHp =
            window.playerMaxHp;

        window.isDead = false;
        window.isFighting = true;

        const attack =
            document.getElementById(
                "attack-btn"
            );

        const resume =
            document.getElementById(
                "resume-btn"
            );

        if (attack) {
            attack.classList.remove(
                "hidden"
            );
        }

        if (resume) {
            resume.classList.add(
                "hidden"
            );
        }

        if (
            typeof window.spawnMonster ===
            "function"
        ) {
            window.spawnMonster();
        }

        updateStatus();
    };


    /* =====================================================
       UI
       ===================================================== */

    function updateStatus() {

        const g =
            window.gameData;

        text(
            "gold-amount",
            Math.floor(g.gold)
        );

        text(
            "iron-amount",
            Math.floor(g.iron)
        );

        text(
            "mithril-amount",
            Math.floor(g.mithril)
        );

        text(
            "prestige-amount",
            g.prestige
        );

        text(
            "player-level",
            g.level
        );

        text(
            "player-exp",
            Math.floor(g.exp)
        );

        text(
            "player-max-exp",
            Math.floor(g.maxExp)
        );

        text(
            "player-current-hp",
            Math.floor(
                window.playerCurrentHp
            )
        );

        text(
            "player-max-hp",
            Math.floor(
                window.playerMaxHp
            )
        );

        const xp =
            g.maxExp > 0
                ? g.exp / g.maxExp * 100
                : 0;

        const xpBar =
            document.getElementById(
                "exp-bar"
            );

        if (xpBar) {
            xpBar.style.width =
                `${Math.min(100, xp)}%`;
        }

        const hpBar =
            document.getElementById(
                "player-hp-bar"
            );

        if (hpBar) {
            hpBar.style.width =
                `${
                    Math.max(
                        0,
                        Math.min(
                            100,
                            window.playerCurrentHp /
                            window.playerMaxHp *
                            100
                        )
                    )
                }%`;
        }

        text(
            "combat-dmg",
            window.totalDmg
        );

        text(
            "combat-dps",
            window.totalDps
        );

        text(
            "combat-crit",
            `${window.totalCrit}%`
        );

        text(
            "combat-lifesteal",
            `${window.totalLifesteal}%`
        );

        text(
            "pickaxe-level",
            g.pickaxeLevel
        );

        text(
            "mercenary-level",
            g.mercenaryLevel
        );

        text(
            "skill-points",
            g.skillPoints
        );

        text(
            "skill-lvl-hp",
            g.skills.hp
        );

        text(
            "skill-lvl-dmg",
            g.skills.dmg
        );

        text(
            "skill-lvl-lifesteal",
            g.skills.lifesteal
        );

        text(
            "skill-lvl-crit",
            g.skills.crit
        );

        text(
            "q-kills",
            g.quests.kills
        );

        text(
            "q-mines",
            g.quests.mines
        );

        text(
            "prestige-multiplier",
            g.prestige * 50
        );

        text(
            "prestige-tokens",
            g.prestige
        );
    }

    function updateAllUI() {

        updateStatus();

        if (
            typeof window.updateShopUI ===
            "function"
        ) {
            window.updateShopUI();
        }

        if (
            typeof window.updateQuestUI ===
            "function"
        ) {
            window.updateQuestUI();
        }

        if (
            typeof window.updateQuestsUI ===
            "function"
        ) {
            window.updateQuestsUI();
        }

        if (
            typeof window.renderInventory ===
            "function"
        ) {
            window.renderInventory();
        }
    }


    /* =====================================================
       QUESTS
       ===================================================== */

    window.updateQuestsUI =
    function() {

        const q =
            window.gameData.quests;

        const kills =
            document.getElementById(
                "q-kills"
            );

        const mines =
            document.getElementById(
                "q-mines"
            );

        if (kills) {
            kills.textContent =
                q.kills;
        }

        if (mines) {
            mines.textContent =
                q.mines;
        }

        const kb =
            document.getElementById(
                "btn-q-kills"
            );

        const mb =
            document.getElementById(
                "btn-q-mines"
            );

        if (kb) {

            kb.disabled =
                q.kills < 10 ||
                q.killsClaimed;

            kb.textContent =
                q.killsClaimed
                    ? "✅ ODEBRANO"
                    : "ODBIERZ 1000 🪙";
        }

        if (mb) {

            mb.disabled =
                q.mines < 50 ||
                q.minesClaimed;

            mb.textContent =
                q.minesClaimed
                    ? "✅ ODEBRANO"
                    : "ODBIERZ 5 💎";
        }
    };


    window.claimQuest =
    function(type) {

        const q =
            window.gameData.quests;

        if (
            type === "kills" &&
            q.kills >= 10 &&
            !q.killsClaimed
        ) {

            q.killsClaimed = true;
            window.gameData.gold += 1000;

            logMessage(
                "📜 Quest ukończony! +1000 🪙"
            );
        }

        if (
            type === "mines" &&
            q.mines >= 50 &&
            !q.minesClaimed
        ) {

            q.minesClaimed = true;
            window.gameData.mithril += 5;

            logMessage(
                "📜 Quest ukończony! +5 💎"
            );
        }

        updateAllUI();
        saveGame();
    };


    /* =====================================================
       PRESTIGE
       ===================================================== */

    window.doPrestige =
    function() {

        if (
            window.gameData.level < 50
        ) {

            logMessage(
                "❌ Prestiż wymaga poziomu 50."
            );

            return;
        }

        if (
            !confirm(
                "Aktywować Prestiż?\n\n" +
                "Stracisz poziom, złoto, rudy " +
                "i skille.\n\n" +
                "Ekwipunek zostaje.\n\n" +
                "+50% DMG / DPS / HP."
            )
        ) {
            return;
        }

        window.gameData.prestige++;

        window.gameData.gold = 0;
        window.gameData.iron = 0;
        window.gameData.mithril = 0;

        window.gameData.level = 1;
        window.gameData.exp = 0;
        window.gameData.maxExp = 100;

        window.gameData.skillPoints = 0;

        window.gameData.skills = {
            hp: 0,
            dmg: 0,
            lifesteal: 0,
            crit: 0
        };

        window.gameData.quests = {
            kills: 0,
            mines: 0,
            killsClaimed: false,
            minesClaimed: false
        };

        recalculatePlayerStats();

        window.playerCurrentHp =
            window.playerMaxHp;

        updateAllUI();

        logMessage(
            `✦ PRESTIŻ ${window.gameData.prestige}!`
        );

        saveGame();
    };


    /* =====================================================
       LOG
       ===================================================== */

    window.logMessage =
    function(message) {

        const log =
            document.getElementById(
                "battle-log"
            );

        if (!log) {
            return;
        }

        const row =
            document.createElement(
                "div"
            );

        row.innerHTML =
            `<span style="color:#53637c">
                [${new Date().toLocaleTimeString("pl-PL")}]
            </span>
            ${message}`;

        log.prepend(row);

        while (
            log.children.length > 80
        ) {
            log.removeChild(
                log.lastElementChild
            );
        }
    };


    /* =====================================================
       COMBAT STATS
       ===================================================== */

    window.renderCombatStats =
    function() {

        text(
            "combat-dmg",
            window.totalDmg
        );

        text(
            "combat-dps",
            window.totalDps
        );

        text(
            "combat-crit",
            `${window.totalCrit}%`
        );

        text(
            "combat-lifesteal",
            `${window.totalLifesteal}%`
        );
    };


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        loadGame();

        if (
            typeof window.loadInventory ===
            "function"
        ) {
            window.loadInventory();
        }

        if (
            typeof window.loadCombat ===
            "function"
        ) {
            window.loadCombat();
        }

        window.isFighting = true;

        if (
            typeof window.spawnMonster ===
            "function"
        ) {
            window.spawnMonster();
        }

        setInterval(() => {

            saveGame();

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

                if (
                    typeof window.enemyAttack ===
                    "function"
                ) {
                    window.enemyAttack();
                }
            }

        }, 1000);
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );

    } else {

        init();
    }

})();