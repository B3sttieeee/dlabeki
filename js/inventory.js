/* =========================================================
   PIXEL REALMS ONLINE
   INVENTORY.JS
   ULTIMATE INVENTORY / EQUIPMENT / ITEM ENGINE
   ========================================================= */

(() => {

    "use strict";

    /* =========================================================
       VERSION
       ========================================================= */

    const INVENTORY_VERSION = "3.0.0";

    const INVENTORY_STORAGE_KEY =
        "pixel_realms_inventory_v3";

    const EQUIPMENT_STORAGE_KEY =
        "pixel_realms_equipped_v3";

    const INVENTORY_LEGACY_KEYS = [
        "pixel_realms_inventory_v2",
        "pixel_realms_inventory_v1",
        "nasa_inv_v6"
    ];

    const EQUIPMENT_LEGACY_KEYS = [
        "pixel_realms_equipped_v2",
        "pixel_realms_equipped_v1",
        "nasa_eq_v6"
    ];

    /* =========================================================
       GLOBAL INVENTORY
       ========================================================= */

    window.inventory =
        Array.isArray(
            window.inventory
        )
            ? window.inventory
            : [];

    window.equipped = {

        head: null,

        shoulders: null,

        chest: null,

        gloves: null,

        bracers: null,

        weapon: null,

        offhand: null,

        pants: null,

        boots: null,

        amulet: null,

        ring1: null,

        ring2: null,

        artifact: null,

        relic: null,

        ...(window.equipped || {})
    };

    window.inventoryCapacity =
        Number(
            window.inventoryCapacity
        ) ||
        100;

    window.inspectedItem =
        null;

    window.selectedInventoryFilter =
        "all";

    window.selectedInventorySort =
        "power";

    /* =========================================================
       SLOT DEFINITIONS
       ========================================================= */

    const EQUIPMENT_SLOTS = {

        head: {
            name: "HEŁM",
            icon: "🪖"
        },

        shoulders: {
            name: "NARAMIENNIKI",
            icon: "🦾"
        },

        chest: {
            name: "ZBROJA",
            icon: "🛡️"
        },

        gloves: {
            name: "RĘKAWICE",
            icon: "🧤"
        },

        bracers: {
            name: "KARWASZE",
            icon: "🥊"
        },

        weapon: {
            name: "BROŃ",
            icon: "⚔️"
        },

        offhand: {
            name: "OFFHAND",
            icon: "🛡️"
        },

        pants: {
            name: "SPODNIE",
            icon: "👖"
        },

        boots: {
            name: "BUTY",
            icon: "🥾"
        },

        amulet: {
            name: "AMULET",
            icon: "🧿"
        },

        ring1: {
            name: "PIERŚCIEŃ",
            icon: "💍"
        },

        ring2: {
            name: "PIERŚCIEŃ",
            icon: "💍"
        },

        artifact: {
            name: "ARTEFAKT",
            icon: "🔮"
        },

        relic: {
            name: "RELIKT",
            icon: "💠"
        }
    };

    const EQUIPMENT_SLOT_IDS =
        Object.keys(
            EQUIPMENT_SLOTS
        );

    /* =========================================================
       ITEM TYPES
       ========================================================= */

    const ITEM_TYPES = {

        weapon: {
            name: "BROŃ",
            icon: "⚔️"
        },

        armor: {
            name: "ZBROJA",
            icon: "🛡️"
        },

        helmet: {
            name: "HEŁM",
            icon: "🪖"
        },

        gloves: {
            name: "RĘKAWICE",
            icon: "🧤"
        },

        boots: {
            name: "BUTY",
            icon: "🥾"
        },

        amulet: {
            name: "AMULET",
            icon: "🧿"
        },

        ring: {
            name: "PIERŚCIEŃ",
            icon: "💍"
        },

        offhand: {
            name: "OFFHAND",
            icon: "🛡️"
        },

        artifact: {
            name: "ARTEFAKT",
            icon: "🔮"
        },

        relic: {
            name: "RELIKT",
            icon: "💠"
        },

        material: {
            name: "MATERIAŁ",
            icon: "🔩"
        },

        consumable: {
            name: "MIKSTURA",
            icon: "🧪"
        },

        rune: {
            name: "RUNA",
            icon: "◆"
        },

        chest: {
            name: "SKRZYNIA",
            icon: "🎁"
        },

        quest: {
            name: "QUEST",
            icon: "📜"
        }
    };

    /* =========================================================
       RARITY SYSTEM
       ========================================================= */

    const RARITIES = {

        common: {
            id: "common",
            name: "COMMON",
            displayName: "ZWYKŁY",
            color: "var(--common)",
            hex: "#a7b2c5",
            upgradePerLevel: 0.085,
            maxLevel: 25,
            statMultiplier: 1,
            dropWeight: 6000
        },

        rare: {
            id: "rare",
            name: "RARE",
            displayName: "RZADKI",
            color: "var(--rare)",
            hex: "#4d96ff",
            upgradePerLevel: 0.095,
            maxLevel: 30,
            statMultiplier: 1.18,
            dropWeight: 2500
        },

        epic: {
            id: "epic",
            name: "EPIC",
            displayName: "EPICKI",
            color: "var(--epic)",
            hex: "#b75cff",
            upgradePerLevel: 0.105,
            maxLevel: 35,
            statMultiplier: 1.42,
            dropWeight: 1100
        },

        legendary: {
            id: "legendary",
            name: "LEGENDARY",
            displayName: "LEGENDARNY",
            color: "var(--legendary)",
            hex: "#ffb62e",
            upgradePerLevel: 0.12,
            maxLevel: 45,
            statMultiplier: 1.85,
            dropWeight: 350
        },

        mythic: {
            id: "mythic",
            name: "MYTHIC",
            displayName: "MITYCZNY",
            color: "var(--mythic)",
            hex: "#ff425f",
            upgradePerLevel: 0.145,
            maxLevel: 50,
            statMultiplier: 2.5,
            dropWeight: 50
        },

        divine: {
            id: "divine",
            name: "DIVINE",
            displayName: "BOSKI",
            color: "#f7e97b",
            hex: "#f7e97b",
            upgradePerLevel: 0.17,
            maxLevel: 60,
            statMultiplier: 3.4,
            dropWeight: 5
        }
    };

    /* =========================================================
       STATS
       ========================================================= */

    const ITEM_STATS = [

        "dmgBonus",

        "dpsBonus",

        "hpBonus",

        "armorBonus",

        "magicPowerBonus",

        "critBonus",

        "critDamageBonus",

        "lifestealBonus",

        "dodgeBonus",

        "blockBonus",

        "attackSpeedBonus",

        "goldBonus",

        "expBonus",

        "bossDamageBonus",

        "lootBonus",

        "magicFindBonus",

        "armorPenBonus",

        "manaBonus",

        "rageBonus",

        "healthRegenBonus",

        "manaRegenBonus"
    ];

    const INTEGER_STATS = [

        "dmgBonus",

        "dpsBonus",

        "hpBonus",

        "armorBonus",

        "magicPowerBonus",

        "goldBonus",

        "expBonus",

        "bossDamageBonus",

        "lootBonus",

        "manaBonus",

        "rageBonus"
    ];

    const PERCENT_STATS = [

        "critBonus",

        "critDamageBonus",

        "lifestealBonus",

        "dodgeBonus",

        "blockBonus",

        "attackSpeedBonus",

        "goldBonus",

        "expBonus",

        "bossDamageBonus",

        "lootBonus",

        "magicFindBonus",

        "armorPenBonus",

        "healthRegenBonus",

        "manaRegenBonus"
    ];

    /* =========================================================
       AFFIX DATABASE
       ========================================================= */

    const AFFIXES = {

        mighty: {
            id: "mighty",
            name: "MOC",
            description: "+DMG",
            stats: {
                dmgBonus: [15, 140]
            }
        },

        berserker: {
            id: "berserker",
            name: "BERSERKER",
            description: "+DPS, +KRYT",
            stats: {
                dpsBonus: [10, 100],
                critBonus: [1, 8]
            }
        },

        guardian: {
            id: "guardian",
            name: "STRAŻNIK",
            description: "+HP, +ARMOR",
            stats: {
                hpBonus: [100, 1500],
                armorBonus: [10, 140]
            }
        },

        vampiric: {
            id: "vampiric",
            name: "WAMPIR",
            description: "+Lifesteal",
            stats: {
                lifestealBonus: [1, 8]
            }
        },

        hunter: {
            id: "hunter",
            name: "ŁOWCA",
            description: "+Boss Damage",
            stats: {
                bossDamageBonus: [2, 25],
                critBonus: [1, 5]
            }
        },

        lucky: {
            id: "lucky",
            name: "SZCZĘŚCIARZ",
            description: "+Loot",
            stats: {
                lootBonus: [2, 30],
                magicFindBonus: [2, 20]
            }
        },

        scholar: {
            id: "scholar",
            name: "UCZONY",
            description: "+EXP",
            stats: {
                expBonus: [2, 35],
                manaBonus: [20, 300]
            }
        },

        greedy: {
            id: "greedy",
            name: "CHCIWY",
            description: "+Gold",
            stats: {
                goldBonus: [3, 45]
            }
        },

        swift: {
            id: "swift",
            name: "SZYBKI",
            description: "+Attack Speed",
            stats: {
                attackSpeedBonus: [1, 12],
                dodgeBonus: [1, 10]
            }
        },

        arcane: {
            id: "arcane",
            name: "ARCANA",
            description: "+Magic Power",
            stats: {
                magicPowerBonus: [25, 300],
                manaBonus: [30, 450]
            }
        }
    };

    /* =========================================================
       SET DATABASE
       ========================================================= */

    const ITEM_SETS = {

        dragon: {

            id: "dragon",

            name: "ZESTAW SMOCZEGO GNIEWU",

            color: "#ff425f",

            pieces: [

                "dragon_helm",

                "dragon_armor",

                "dragon_weapon",

                "dragon_boots"
            ],

            bonuses: {

                2: {
                    bossDamageBonus: 8
                },

                3: {
                    critBonus: 8
                },

                4: {
                    dmgBonus: 250,
                    bossDamageBonus: 15
                }
            }
        },

        void: {

            id: "void",

            name: "ZESTAW PUSTKI",

            color: "#b75cff",

            pieces: [

                "void_amulet",

                "void_ring",

                "void_artifact"
            ],

            bonuses: {

                2: {
                    lifestealBonus: 6
                },

                3: {
                    magicPowerBonus: 250,
                    lootBonus: 15
                }
            }
        },

        titan: {

            id: "titan",

            name: "ZESTAW TYTANÓW",

            color: "#ffc247",

            pieces: [

                "titan_helm",

                "titan_armor",

                "titan_gloves",

                "titan_boots"
            ],

            bonuses: {

                2: {
                    hpBonus: 1500
                },

                3: {
                    armorBonus: 180
                },

                4: {
                    hpBonus: 3500,
                    armorBonus: 300
                }
            }
        }
    };

    /* =========================================================
       HELPERS
       ========================================================= */

    function safeNumber(
        value,
        fallback = 0
    ) {

        const n =
            Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }

    function safeInteger(
        value,
        fallback = 0
    ) {

        return Math.floor(
            safeNumber(
                value,
                fallback
            )
        );
    }

    function clamp(
        value,
        min,
        max
    ) {

        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );
    }

    function id() {

        return (
            Date.now().toString(
                36
            ) +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 10)
        );
    }

    function getGameData() {

        if (
            !window.gameData ||
            typeof window.gameData !==
                "object"
        ) {

            window.gameData = {};
        }

        return window.gameData;
    }

    function showNotification(
        message,
        title = "INVENTORY"
    ) {

        if (
            typeof window.gameToast ===
            "function"
        ) {

            window.gameToast(
                message,
                title
            );

            return;
        }

        if (
            typeof window.showToast ===
            "function"
        ) {

            window.showToast(
                message,
                title
            );

            return;
        }

        if (
            typeof window.logMessage ===
            "function"
        ) {

            window.logMessage(
                message
            );

            return;
        }

        console.log(
            `[${title}]`,
            message
        );
    }

    function clone(
        value
    ) {

        return JSON.parse(
            JSON.stringify(
                value
            )
        );
    }

    /* =========================================================
       RARITY HELPERS
       ========================================================= */

    function normalizeRarity(
        value
    ) {

        if (
            !value
        ) {

            return "common";
        }

        let rarity =
            String(
                value
            )
            .toLowerCase()
            .trim();

        rarity =
            rarity
                .replace(
                    "tier-",
                    ""
                )
                .replace(
                    "tier_",
                    ""
                );

        if (
            rarity ===
            "mythical"
        ) {

            rarity =
                "mythic";
        }

        if (
            rarity ===
            "legend"
        ) {

            rarity =
                "legendary";
        }

        if (
            !RARITIES[
                rarity
            ]
        ) {

            return "common";
        }

        return rarity;
    }

    function getRarity(
        item
    ) {

        return RARITIES[
            normalizeRarity(
                item?.tier ||
                item?.rarity
            )
        ] ||
        RARITIES.common;
    }

    function getRarityColor(
        item
    ) {

        return getRarity(
            item
        ).color;
    }

    function getRarityName(
        item
    ) {

        return getRarity(
            item
        ).name;
    }

    /* =========================================================
       ITEM ID
       ========================================================= */

    function ensureItemId(
        item
    ) {

        if (
            !item.id
        ) {

            item.id =
                id();
        }

        return item.id;
    }

    /* =========================================================
       QUALITY
       ========================================================= */

    function generateQuality(
        rarity
    ) {

        const ranges = {

            common: [0.85, 1.00],

            rare: [0.90, 1.04],

            epic: [0.95, 1.08],

            legendary: [1.00, 1.12],

            mythic: [1.02, 1.18],

            divine: [1.05, 1.25]
        };

        const range =
            ranges[
                normalizeRarity(
                    rarity
                )
            ] ||
            ranges.common;

        const value =
            range[0] +
            Math.random() *
            (
                range[1] -
                range[0]
            );

        return Number(
            value.toFixed(3)
        );
    }

    function qualityPercent(
        quality
    ) {

        return Math.round(
            safeNumber(
                quality,
                1
            ) *
            100
        );
    }

    function getQualityLabel(
        quality
    ) {

        const q =
            safeNumber(
                quality,
                1
            );

        if (
            q >= 1.18
        ) {

            return "PERFEKT";
        }

        if (
            q >= 1.10
        ) {

            return "WYBITNA";
        }

        if (
            q >= 1.02
        ) {

            return "BARDZO DOBRA";
        }

        if (
            q >= .95
        ) {

            return "DOBRA";
        }

        return "SŁABA";
    }

    function getQualityColor(
        quality
    ) {

        const q =
            safeNumber(
                quality,
                1
            );

        if (
            q >= 1.18
        ) {

            return "#ff425f";
        }

        if (
            q >= 1.10
        ) {

            return "#ffc247";
        }

        if (
            q >= 1.02
        ) {

            return "#38e88d";
        }

        if (
            q >= .95
        ) {

            return "#4d96ff";
        }

        return "#6d7c94";
    }

    /* =========================================================
       UPGRADE
       ========================================================= */

    function getUpgradeLevel(
        item
    ) {

        return Math.max(
            0,
            safeInteger(
                item?.upgradeLevel,
                0
            )
        );
    }

    function getMaxUpgrade(
        item
    ) {

        const rarity =
            getRarity(
                item
            );

        return Math.max(
            1,
            safeInteger(
                item?.upgradeData
                    ?.maxLevel,
                rarity.maxLevel
            )
        );
    }

    function getUpgradePerLevel(
        item
    ) {

        const rarity =
            getRarity(
                item
            );

        return Math.max(
            0.001,
            safeNumber(
                item
                    ?.upgradeData
                    ?.baseIncrease,
                rarity.upgradePerLevel
            )
        );
    }

    function getUpgradeMultiplier(
        item
    ) {

        const level =
            getUpgradeLevel(
                item
            );

        const increase =
            getUpgradePerLevel(
                item
            );

        return Math.pow(
            1 +
            increase,
            level
        );
    }

    /* =========================================================
       ITEM STAT
       ========================================================= */

    function getBaseItemStat(
        item,
        stat
    ) {

        if (
            !item
        ) {

            return 0;
        }

        return Math.max(
            0,
            safeNumber(
                item[stat],
                0
            )
        );
    }

    function getItemStat(
        item,
        stat
    ) {

        if (
            !item
        ) {

            return 0;
        }

        const raw =
            getBaseItemStat(
                item,
                stat
            );

        if (
            raw <= 0
        ) {

            return 0;
        }

        const multiplier =
            getUpgradeMultiplier(
                item
            );

        const result =
            raw *
            multiplier;

        if (
            INTEGER_STATS.includes(
                stat
            )
        ) {

            return Math.floor(
                result
            );
        }

        return Number(
            result.toFixed(2)
        );
    }

    /* =========================================================
       POWER
       ========================================================= */

    function calculateItemPower(
        item
    ) {

        if (
            !item
        ) {

            return 0;
        }

        let power = 0;

        power +=
            getItemStat(
                item,
                "dmgBonus"
            );

        power +=
            getItemStat(
                item,
                "dpsBonus"
            ) *
            1.35;

        power +=
            getItemStat(
                item,
                "hpBonus"
            ) *
            .10;

        power +=
            getItemStat(
                item,
                "armorBonus"
            ) *
            2.2;

        power +=
            getItemStat(
                item,
                "magicPowerBonus"
            ) *
            1.2;

        power +=
            getItemStat(
                item,
                "critBonus"
            ) *
            28;

        power +=
            getItemStat(
                item,
                "critDamageBonus"
            ) *
            6;

        power +=
            getItemStat(
                item,
                "lifestealBonus"
            ) *
            34;

        power +=
            getItemStat(
                item,
                "dodgeBonus"
            ) *
            18;

        power +=
            getItemStat(
                item,
                "blockBonus"
            ) *
            16;

        power +=
            getItemStat(
                item,
                "attackSpeedBonus"
            ) *
            16;

        power +=
            getItemStat(
                item,
                "goldBonus"
            ) *
            7;

        power +=
            getItemStat(
                item,
                "expBonus"
            ) *
            7;

        power +=
            getItemStat(
                item,
                "bossDamageBonus"
            ) *
            13;

        power +=
            getItemStat(
                item,
                "lootBonus"
            ) *
            11;

        power +=
            getItemStat(
                item,
                "magicFindBonus"
            ) *
            11;

        power +=
            getItemStat(
                item,
                "armorPenBonus"
            ) *
            12;

        power +=
            getItemStat(
                item,
                "manaBonus"
            ) *
            .20;

        power +=
            getItemStat(
                item,
                "rageBonus"
            ) *
            .25;

        /*
         * Quality
         */

        const quality =
            safeNumber(
                item.quality,
                1
            );

        power *=
            Math.max(
                .45,
                quality
            );

        /*
         * Upgrade
         */

        const level =
            getUpgradeLevel(
                item
            );

        power *=
            Math.pow(
                1.025,
                level
            );

        /*
         * Rarity
         */

        power *=
            getRarity(
                item
            ).statMultiplier;

        /*
         * Affix quality
         */

        power +=
            (
                Array.isArray(
                    item.affixes
                )
                    ? item.affixes.length
                    : 0
            ) *
            50;

        return Math.floor(
            Math.max(
                0,
                power
            )
        );
    }

    /* =========================================================
       NORMALIZE ITEM
       ========================================================= */

    function normalizeItem(
        raw
    ) {

        if (
            !raw ||
            typeof raw !==
                "object"
        ) {

            return null;
        }

        const item =
            {
                ...raw
            };

        ensureItemId(
            item
        );

        item.name =
            typeof item.name ===
            "string"
                ? item.name
                : "Nieznany Przedmiot";

        item.displayName =
            typeof item.displayName ===
            "string"
                ? item.displayName
                : item.name;

        item.type =
            typeof item.type ===
            "string"
                ? item.type
                : "weapon";

        item.slot =
            typeof item.slot ===
            "string"
                ? item.slot
                : inferSlot(
                    item
                );

        item.tier =
            normalizeRarity(
                item.tier ||
                item.rarity
            );

        item.icon =
            typeof item.icon ===
            "string"
                ? item.icon
                : (
                    ITEM_TYPES[
                        item.type
                    ]?.icon ||
                    "❔"
                );

        item.level =
            Math.max(
                1,
                safeInteger(
                    item.level,
                    1
                )
            );

        item.upgradeLevel =
            Math.max(
                0,
                safeInteger(
                    item.upgradeLevel,
                    0
                )
            );

        item.quality =
            safeNumber(
                item.quality,
                1
            );

        item.qualityPercent =
            qualityPercent(
                item.quality
            );

        /*
         * Stats
         */

        ITEM_STATS.forEach(
            stat => {

                item[stat] =
                    safeNumber(
                        item[stat],
                        0
                    );
            }
        );

        /*
         * Affixes
         */

        item.affixes =
            Array.isArray(
                item.affixes
            )
                ? item.affixes
                : [];

        /*
         * Socket system
         */

        item.sockets =
            Math.max(
                0,
                safeInteger(
                    item.sockets,
                    0
                )
            );

        item.socketedRunes =
            Array.isArray(
                item.socketedRunes
            )
                ? item.socketedRunes
                : [];

        /*
         * Set
         */

        item.setId =
            item.setId ||
            null;

        /*
         * Upgrade
         */

        const rarity =
            getRarity(
                item
            );

        item.upgradeData =
            {
                maxLevel:
                    Math.max(
                        1,
                        safeInteger(
                            item
                                ?.upgradeData
                                ?.maxLevel,
                            rarity.maxLevel
                        )
                    ),

                baseIncrease:
                    Math.max(
                        .001,
                        safeNumber(
                            item
                                ?.upgradeData
                                ?.baseIncrease,
                            rarity.upgradePerLevel
                        )
                    ),

                scalableStats:
                    Array.isArray(
                        item
                            ?.upgradeData
                            ?.scalableStats
                    )
                        ? item
                            .upgradeData
                            .scalableStats
                        : [
                            ...ITEM_STATS
                        ]
            };

        /*
         * Durability
         */

        item.durability =
            clamp(
                safeNumber(
                    item.durability,
                    100
                ),
                0,
                100
            );

        item.maxDurability =
            Math.max(
                1,
                safeNumber(
                    item.maxDurability,
                    100
                )
            );

        /*
         * Bind
         */

        item.bound =
            Boolean(
                item.bound
            );

        /*
         * Favorite
         */

        item.favorite =
            Boolean(
                item.favorite
            );

        /*
         * Calculate power
         */

        item.power =
            calculateItemPower(
                item
            );

        return item;
    }

    /* =========================================================
       INFER SLOT
       ========================================================= */

    function inferSlot(
        item
    ) {

        if (
            item.slot &&
            EQUIPMENT_SLOT_IDS.includes(
                item.slot
            )
        ) {

            return item.slot;
        }

        const type =
            String(
                item.type ||
                ""
            )
            .toLowerCase();

        const map = {

            helmet: "head",

            head: "head",

            armor: "chest",

            chest: "chest",

            weapon: "weapon",

            offhand: "offhand",

            gloves: "gloves",

            bracers: "bracers",

            boots: "boots",

            pants: "pants",

            amulet: "amulet",

            ring: "ring1",

            artifact: "artifact",

            relic: "relic"
        };

        return (
            map[type] ||
            null
        );
    }

    /* =========================================================
       ITEM CREATION
       ========================================================= */

    window.createItem =
        function createItem(
            options = {}
        ) {

            const rarity =
                normalizeRarity(
                    options.rarity ||
                    options.tier ||
                    "common"
                );

            const item =
                normalizeItem(
                    {
                        id:
                            id(),

                        name:
                            options.name ||
                            "Nieznany Przedmiot",

                        displayName:
                            options.displayName ||
                            options.name ||
                            "Nieznany Przedmiot",

                        type:
                            options.type ||
                            "weapon",

                        slot:
                            options.slot ||
                            null,

                        tier:
                            rarity,

                        icon:
                            options.icon ||
                            ITEM_TYPES[
                                options.type
                            ]?.icon ||
                            "❔",

                        level:
                            safeInteger(
                                options.level,
                                1
                            ),

                        quality:
                            options.quality ??
                            generateQuality(
                                rarity
                            ),

                        dmgBonus:
                            safeNumber(
                                options.dmgBonus,
                                0
                            ),

                        dpsBonus:
                            safeNumber(
                                options.dpsBonus,
                                0
                            ),

                        hpBonus:
                            safeNumber(
                                options.hpBonus,
                                0
                            ),

                        armorBonus:
                            safeNumber(
                                options.armorBonus,
                                0
                            ),

                        magicPowerBonus:
                            safeNumber(
                                options.magicPowerBonus,
                                0
                            ),

                        critBonus:
                            safeNumber(
                                options.critBonus,
                                0
                            ),

                        critDamageBonus:
                            safeNumber(
                                options.critDamageBonus,
                                0
                            ),

                        lifestealBonus:
                            safeNumber(
                                options.lifestealBonus,
                                0
                            ),

                        dodgeBonus:
                            safeNumber(
                                options.dodgeBonus,
                                0
                            ),

                        blockBonus:
                            safeNumber(
                                options.blockBonus,
                                0
                            ),

                        attackSpeedBonus:
                            safeNumber(
                                options.attackSpeedBonus,
                                0
                            ),

                        goldBonus:
                            safeNumber(
                                options.goldBonus,
                                0
                            ),

                        expBonus:
                            safeNumber(
                                options.expBonus,
                                0
                            ),

                        bossDamageBonus:
                            safeNumber(
                                options.bossDamageBonus,
                                0
                            ),

                        lootBonus:
                            safeNumber(
                                options.lootBonus,
                                0
                            ),

                        magicFindBonus:
                            safeNumber(
                                options.magicFindBonus,
                                0
                            ),

                        armorPenBonus:
                            safeNumber(
                                options.armorPenBonus,
                                0
                            ),

                        manaBonus:
                            safeNumber(
                                options.manaBonus,
                                0
                            ),

                        rageBonus:
                            safeNumber(
                                options.rageBonus,
                                0
                            ),

                        healthRegenBonus:
                            safeNumber(
                                options.healthRegenBonus,
                                0
                            ),

                        manaRegenBonus:
                            safeNumber(
                                options.manaRegenBonus,
                                0
                            ),

                        affixes:
                            Array.isArray(
                                options.affixes
                            )
                                ? options.affixes
                                : [],

                        sockets:
                            options.sockets ??
                            0,

                        setId:
                            options.setId ||
                            null
                    }
                );

            return item;
        };

    /* =========================================================
       RANDOM AFFIX
       ========================================================= */

    function getRandomAffix() {

        const keys =
            Object.keys(
                AFFIXES
            );

        if (
            keys.length ===
            0
        ) {

            return null;
        }

        const selected =
            keys[
                Math.floor(
                    Math.random() *
                    keys.length
                )
            ];

        return clone(
            AFFIXES[
                selected
            ]
        );
    }

    /* =========================================================
       ROLL AFFIX
       ========================================================= */

    function rollAffixes(
        item,
        count
    ) {

        const finalCount =
            Math.max(
                0,
                safeInteger(
                    count,
                    0
                )
            );

        item.affixes =
            [];

        for (
            let i = 0;
            i < finalCount;
            i++
        ) {

            const affix =
                getRandomAffix();

            if (
                !affix
            ) {

                continue;
            }

            const generated =
                {
                    id:
                        affix.id,

                    name:
                        affix.name,

                    description:
                        affix.description,

                    stats:
                        {}
                };

            Object.entries(
                affix.stats
            ).forEach(
                (
                    [
                        stat,
                        range
                    ]
                ) => {

                    const min =
                        safeNumber(
                            range[0],
                            0
                        );

                    const max =
                        safeNumber(
                            range[1],
                            min
                        );

                    const value =
                        min +
                        Math.random() *
                        (
                            max -
                            min
                        );

                    generated.stats[
                        stat
                    ] =
                        INTEGER_STATS.includes(
                            stat
                        )
                            ? Math.floor(
                                value
                            )
                            : Number(
                                value.toFixed(2)
                            );

                    item[stat] +=
                        generated
                            .stats[
                                stat
                            ];
                }
            );

            item.affixes.push(
                generated
            );
        }

        item.power =
            calculateItemPower(
                item
            );

        return item;
    }

    /* =========================================================
       CREATE RANDOM LOOT
       ========================================================= */

    window.createRandomLoot =
        function createRandomLoot(
            options = {}
        ) {

            const rarity =
                normalizeRarity(
                    options.rarity ||
                    rollRarity()
                );

            const type =
                options.type ||
                rollItemType();

            const slot =
                options.slot ||
                inferSlot(
                    {
                        type
                    }
                );

            const level =
                Math.max(
                    1,
                    safeInteger(
                        options.level,
                        getGameData()
                            ?.player
                            ?.level ||
                        1
                    )
                );

            const rarityData =
                RARITIES[
                    rarity
                ];

            const base =
                Math.max(
                    1,
                    level *
                    rarityData
                        .statMultiplier
                );

            const item =
                createItem(
                    {

                        name:
                            generateItemName(
                                type,
                                rarity
                            ),

                        displayName:
                            generateItemName(
                                type,
                                rarity
                            ),

                        type,

                        slot,

                        rarity,

                        icon:
                            ITEM_TYPES[
                                type
                            ]?.icon ||
                            "❔",

                        level,

                        dmgBonus:
                            type ===
                            "weapon"
                                ? Math.floor(
                                    base *
                                    12
                                )
                                : 0,

                        dpsBonus:
                            type ===
                            "weapon"
                                ? Math.floor(
                                    base *
                                    3
                                )
                                : 0,

                        hpBonus:
                            [
                                "armor",
                                "helmet",
                                "boots",
                                "gloves"
                            ].includes(
                                type
                            )
                                ? Math.floor(
                                    base *
                                    40
                                )
                                : 0,

                        armorBonus:
                            [
                                "armor",
                                "helmet",
                                "gloves",
                                "boots",
                                "offhand"
                            ].includes(
                                type
                            )
                                ? Math.floor(
                                    base *
                                    5
                                )
                                : 0,

                        critBonus:
                            type ===
                            "weapon"
                                ? Number(
                                    (
                                        base *
                                        .04
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        lifestealBonus:
                            [
                                "ring",
                                "amulet",
                                "artifact"
                            ].includes(
                                type
                            )
                                ? Number(
                                    (
                                        base *
                                        .015
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        dodgeBonus:
                            [
                                "boots",
                                "ring"
                            ].includes(
                                type
                            )
                                ? Number(
                                    (
                                        base *
                                        .012
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        goldBonus:
                            type ===
                            "ring"
                                ? Number(
                                    (
                                        base *
                                        .02
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        expBonus:
                            type ===
                            "amulet"
                                ? Number(
                                    (
                                        base *
                                        .02
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        lootBonus:
                            type ===
                            "artifact"
                                ? Number(
                                    (
                                        base *
                                        .02
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        bossDamageBonus:
                            type ===
                            "weapon"
                                ? Number(
                                    (
                                        base *
                                        .018
                                    ).toFixed(
                                        2
                                    )
                                )
                                : 0,

                        sockets:
                            rarity ===
                            "mythic"
                                ? 3
                                :
                            rarity ===
                            "legendary"
                                ? 2
                                :
                            rarity ===
                            "epic"
                                ? 1
                                : 0
                    }
                );

            /*
             * Affix Count
             */

            const affixCountMap = {

                common: 0,

                rare: 1,

                epic: 2,

                legendary: 3,

                mythic: 4,

                divine: 5
            };

            rollAffixes(
                item,
                affixCountMap[
                    rarity
                ] || 0
            );

            /*
             * Set roll
             */

            if (
                Math.random() <
                .18
            ) {

                item.setId =
                    rollSet(
                        type
                    );
            }

            item.power =
                calculateItemPower(
                    item
                );

            return item;
        };

    /* =========================================================
       RARITY ROLL
       ========================================================= */

    function rollRarity() {

        const total =
            Object.values(
                RARITIES
            )
            .reduce(
                (
                    sum,
                    rarity
                ) =>
                    sum +
                    rarity.dropWeight,
                0
            );

        let roll =
            Math.random() *
            total;

        for (
            const rarity of
            Object.values(
                RARITIES
            )
        ) {

            roll -=
                rarity.dropWeight;

            if (
                roll <=
                0
            ) {

                return rarity.id;
            }
        }

        return "common";
    }

    /* =========================================================
       ITEM TYPE ROLL
       ========================================================= */

    function rollItemType() {

        const types = [

            "weapon",

            "armor",

            "helmet",

            "gloves",

            "boots",

            "amulet",

            "ring",

            "offhand",

            "artifact"
        ];

        return types[
            Math.floor(
                Math.random() *
                types.length
            )
        ];
    }

    /* =========================================================
       ITEM NAME GENERATOR
       ========================================================= */

    function generateItemName(
        type,
        rarity
    ) {

        const prefixes = {

            common: [
                "Żelazny",
                "Stary",
                "Wędrowca",
                "Prosty"
            ],

            rare: [
                "Runiczny",
                "Srebrzysty",
                "Łowcy",
                "Mroźny"
            ],

            epic: [
                "Arcane",
                "Pustki",
                "Krwawy",
                "Zaklinacza"
            ],

            legendary: [
                "Smoczy",
                "Tytaniczny",
                "Nieśmiertelny",
                "Płonący"
            ],

            mythic: [
                "Nieskończony",
                "Boski",
                "Kosmiczny",
                "Apokaliptyczny"
            ],

            divine: [
                "Boskiej Chwały",
                "Wieczności",
                "Stwórcy",
                "Transcendentny"
            ]
        };

        const nouns = {

            weapon: [
                "Miecz",
                "Ostrze",
                "Topór",
                "Kosę",
                "Włócznię"
            ],

            armor: [
                "Pancerz",
                "Zbroję",
                "Kirys"
            ],

            helmet: [
                "Hełm",
                "Koronę",
                "Maskę"
            ],

            gloves: [
                "Rękawice",
                "Rękawice Wojownika"
            ],

            boots: [
                "Buty",
                "Obuwie",
                "Nagolenniki"
            ],

            amulet: [
                "Amulet",
                "Talizman",
                "Medalion"
            ],

            ring: [
                "Pierścień",
                "Obrączkę"
            ],

            offhand: [
                "Tarczę",
                "Relikwiarz",
                "Księgę"
            ],

            artifact: [
                "Artefakt",
                "Relikt",
                "Kryształ"
            ]
        };

        const p =
            prefixes[
                rarity
            ] ||
            prefixes.common;

        const n =
            nouns[
                type
            ] ||
            nouns.weapon;

        const prefix =
            p[
                Math.floor(
                    Math.random() *
                    p.length
                )
            ];

        const noun =
            n[
                Math.floor(
                    Math.random() *
                    n.length
                )
            ];

        return `${prefix} ${noun}`;
    }

    /* =========================================================
       SET ROLL
       ========================================================= */

    function rollSet(
        type
    ) {

        const possible =
            Object.values(
                ITEM_SETS
            )
            .filter(
                set =>
                    set.pieces.some(
                        piece =>
                            piece.includes(
                                type
                            )
                    )
            );

        if (
            possible.length ===
            0
        ) {

            return null;
        }

        return possible[
            Math.floor(
                Math.random() *
                possible.length
            )
        ].id;
    }

    /* =========================================================
       ADD ITEM
       ========================================================= */

    window.giveItem =
        function giveItem(
            item
        ) {

            const normalized =
                normalizeItem(
                    item
                );

            if (
                !normalized
            ) {

                return null;
            }

            if (
                window.inventory.length >=
                window.inventoryCapacity
            ) {

                showNotification(
                    "Plecak jest pełny.",
                    "INVENTORY FULL"
                );

                return null;
            }

            normalized.id =
                id();

            normalized.power =
                calculateItemPower(
                    normalized
                );

            window.inventory.push(
                normalized
            );

            saveInventory();

            renderInventory();

            updateInventoryCounter();

            showNotification(
                `Zdobyto: ${normalized.displayName} [${getRarityName(normalized)}]`,
                "NOWY PRZEDMIOT"
            );

            if (
                typeof window.emitGameEvent ===
                "function"
            ) {

                window.emitGameEvent(
                    "itemReceived",
                    {
                        item:
                            normalized
                    }
                );
            }

            return normalized;
        };

    /* =========================================================
       EQUIP
       ========================================================= */

    window.equipItem =
        function equipItem(
            itemId
        ) {

            const index =
                window.inventory.findIndex(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            itemId
                        )
                );

            if (
                index ===
                -1
            ) {

                return false;
            }

            const item =
                window.inventory[
                    index
                ];

            const slot =
                normalizeEquipmentSlot(
                    item.slot ||
                    item.type
                );

            if (
                !slot
            ) {

                showNotification(
                    "Ten przedmiot nie posiada prawidłowego slotu.",
                    "EKWIPUNEK"
                );

                return false;
            }

            /*
             * Ring handling
             */

            let finalSlot =
                slot;

            if (
                item.type ===
                    "ring" ||
                slot ===
                    "ring1"
            ) {

                if (
                    !window.equipped.ring1
                ) {

                    finalSlot =
                        "ring1";

                } else if (
                    !window.equipped.ring2
                ) {

                    finalSlot =
                        "ring2";

                } else {

                    finalSlot =
                        "ring1";
                }
            }

            const old =
                window.equipped[
                    finalSlot
                ];

            if (
                old
            ) {

                window.inventory.push(
                    old
                );
            }

            window.inventory.splice(
                index,
                1
            );

            window.equipped[
                finalSlot
            ] =
                item;

            window.inspectedItem =
                item;

            recalculateStats();

            saveInventory();

            renderInventory();

            inspectItem(
                item
            );

            showNotification(
                `Założono ${item.displayName}.`,
                "EKWIPUNEK"
            );

            if (
                typeof window.emitGameEvent ===
                "function"
            ) {

                window.emitGameEvent(
                    "itemEquipped",
                    {
                        item,
                        slot:
                            finalSlot
                    }
                );
            }

            return true;
        };

    /* =========================================================
       NORMALIZE EQUIPMENT SLOT
       ========================================================= */

    function normalizeEquipmentSlot(
        value
    ) {

        if (
            EQUIPMENT_SLOT_IDS.includes(
                value
            )
        ) {

            return value;
        }

        const map = {

            helmet: "head",

            armor: "chest",

            gloves: "gloves",

            boots: "boots",

            ring: "ring1"
        };

        return (
            map[
                value
            ] ||
            value
        );
    }

    /* =========================================================
       UNEQUIP
       ========================================================= */

    window.unequipItem =
        function unequipItem(
            slot
        ) {

            if (
                !EQUIPMENT_SLOT_IDS.includes(
                    slot
                )
            ) {

                return false;
            }

            const item =
                window.equipped[
                    slot
                ];

            if (
                !item
            ) {

                return false;
            }

            if (
                window.inventory.length >=
                window.inventoryCapacity
            ) {

                showNotification(
                    "Brak miejsca w plecaku.",
                    "EKWIPUNEK"
                );

                return false;
            }

            window.inventory.push(
                item
            );

            window.equipped[
                slot
            ] =
                null;

            if (
                window.inspectedItem?.id ===
                item.id
            ) {

                window.inspectedItem =
                    null;
            }

            recalculateStats();

            saveInventory();

            renderInventory();

            inspectItem(
                null
            );

            showNotification(
                `Zdjęto ${item.displayName}.`,
                "EKWIPUNEK"
            );

            return true;
        };

    /* =========================================================
       UNEQUIP ALL
       ========================================================= */

    window.unequipAll =
        function unequipAll() {

            const occupied =
                EQUIPMENT_SLOT_IDS
                    .filter(
                        slot =>
                            window.equipped[
                                slot
                            ]
                    );

            if (
                occupied.length ===
                0
            ) {

                return false;
            }

            const free =
                window.inventoryCapacity -
                window.inventory.length;

            if (
                free <
                occupied.length
            ) {

                showNotification(
                    "Nie masz wystarczająco miejsca w plecaku.",
                    "EKWIPUNEK"
                );

                return false;
            }

            occupied.forEach(
                slot => {

                    window.inventory.push(
                        window.equipped[
                            slot
                        ]
                    );

                    window.equipped[
                        slot
                    ] =
                        null;
                }
            );

            window.inspectedItem =
                null;

            recalculateStats();

            saveInventory();

            renderInventory();

            inspectItem(
                null
            );

            showNotification(
                "Całe wyposażenie zdjęte.",
                "EKWIPUNEK"
            );

            return true;
        };

    /* =========================================================
       RECALCULATE STATS
       ========================================================= */

    function recalculateStats() {

        /*
         * CORE jest właścicielem
         * ostatecznego przeliczania.
         */

        if (
            typeof window.recalculatePlayerStats ===
            "function" &&
            window.recalculatePlayerStats
                .name !==
                "recalculateStats"
        ) {

            try {

                return window.recalculatePlayerStats();

            } catch (error) {

                console.error(
                    "Core stat recalculation failed:",
                    error
                );
            }
        }

        /*
         * Fallback
         */

        let damage =
            10;

        let dps =
            0;

        let hp =
            100;

        let crit =
            5;

        let lifesteal =
            0;

        let armor =
            0;

        let dodge =
            0;

        let attackSpeed =
            0;

        let gold =
            0;

        let exp =
            0;

        let bossDamage =
            0;

        let loot =
            0;

        EQUIPMENT_SLOT_IDS.forEach(
            slot => {

                const item =
                    window.equipped[
                        slot
                    ];

                if (
                    !item
                ) {

                    return;
                }

                damage +=
                    getItemStat(
                        item,
                        "dmgBonus"
                    );

                dps +=
                    getItemStat(
                        item,
                        "dpsBonus"
                    );

                hp +=
                    getItemStat(
                        item,
                        "hpBonus"
                    );

                crit +=
                    getItemStat(
                        item,
                        "critBonus"
                    );

                lifesteal +=
                    getItemStat(
                        item,
                        "lifestealBonus"
                    );

                armor +=
                    getItemStat(
                        item,
                        "armorBonus"
                    );

                dodge +=
                    getItemStat(
                        item,
                        "dodgeBonus"
                    );

                attackSpeed +=
                    getItemStat(
                        item,
                        "attackSpeedBonus"
                    );

                gold +=
                    getItemStat(
                        item,
                        "goldBonus"
                    );

                exp +=
                    getItemStat(
                        item,
                        "expBonus"
                    );

                bossDamage +=
                    getItemStat(
                        item,
                        "bossDamageBonus"
                    );

                loot +=
                    getItemStat(
                        item,
                        "lootBonus"
                    );
            }
        );

        window.totalDmg =
            Math.floor(
                damage
            );

        window.totalDps =
            Math.floor(
                dps
            );

        window.playerMaxHp =
            Math.floor(
                hp
            );

        window.totalCrit =
            clamp(
                Number(
                    crit.toFixed(
                        2
                    )
                ),
                0,
                100
            );

        window.totalLifesteal =
            clamp(
                Number(
                    lifesteal.toFixed(
                        2
                    )
                ),
                0,
                100
            );

        window.totalArmor =
            Math.max(
                0,
                armor
            );

        window.totalDodge =
            clamp(
                Number(
                    dodge.toFixed(
                        2
                    )
                ),
                0,
                100
            );

        window.totalAttackSpeed =
            attackSpeed;

        window.totalGoldBonus =
            gold;

        window.totalExpBonus =
            exp;

        window.totalBossDamage =
            bossDamage;

        window.totalLootBonus =
            loot;

        window.playerCurrentHp =
            clamp(
                window.playerCurrentHp ??
                window.playerMaxHp,
                0,
                window.playerMaxHp
            );

        return {

            damage:
                window.totalDmg,

            dps:
                window.totalDps,

            hp:
                window.playerMaxHp,

            crit:
                window.totalCrit,

            lifesteal:
                window.totalLifesteal,

            armor:
                window.totalArmor,

            dodge:
                window.totalDodge,

            attackSpeed:
                window.totalAttackSpeed,

            goldBonus:
                window.totalGoldBonus,

            expBonus:
                window.totalExpBonus,

            bossDamage:
                window.totalBossDamage,

            lootBonus:
                window.totalLootBonus
        };
    }

    /* =========================================================
       SAVE
       ========================================================= */

    window.saveInventory =
        function saveInventory() {

            try {

                const payload =
                    window.inventory.map(
                        item =>
                            normalizeItem(
                                item
                            )
                    );

                const equipment =
                    {};

                EQUIPMENT_SLOT_IDS.forEach(
                    slot => {

                        equipment[
                            slot
                        ] =
                            normalizeItem(
                                window.equipped[
                                    slot
                                ]
                            );
                    }
                );

                localStorage.setItem(
                    INVENTORY_STORAGE_KEY,
                    JSON.stringify(
                        payload
                    )
                );

                localStorage.setItem(
                    EQUIPMENT_STORAGE_KEY,
                    JSON.stringify(
                        equipment
                    )
                );

                if (
                    typeof window.emitGameEvent ===
                    "function"
                ) {

                    window.emitGameEvent(
                        "inventorySaved"
                    );
                }

                return true;

            } catch (error) {

                console.error(
                    "Inventory save error:",
                    error
                );

                return false;
            }
        };

    /* =========================================================
       FIND STORED SAVE
       ========================================================= */

    function findStoredData(
        key,
        legacyKeys
    ) {

        let data =
            localStorage.getItem(
                key
            );

        if (
            data
        ) {

            return data;
        }

        for (
            const legacyKey of
            legacyKeys
        ) {

            data =
                localStorage.getItem(
                    legacyKey
                );

            if (
                data
            ) {

                return data;
            }
        }

        return null;
    }

    /* =========================================================
       LOAD
       ========================================================= */

    window.loadInventory =
        function loadInventory() {

            try {

                const inventoryData =
                    findStoredData(
                        INVENTORY_STORAGE_KEY,
                        INVENTORY_LEGACY_KEYS
                    );

                if (
                    inventoryData
                ) {

                    const parsed =
                        JSON.parse(
                            inventoryData
                        );

                    if (
                        Array.isArray(
                            parsed
                        )
                    ) {

                        window.inventory =
                            parsed
                                .map(
                                    normalizeItem
                                )
                                .filter(
                                    Boolean
                                );
                    }
                }

            } catch (error) {

                console.error(
                    "Inventory load error:",
                    error
                );

                window.inventory =
                    [];
            }

            try {

                const equipmentData =
                    findStoredData(
                        EQUIPMENT_STORAGE_KEY,
                        EQUIPMENT_LEGACY_KEYS
                    );

                if (
                    equipmentData
                ) {

                    const parsed =
                        JSON.parse(
                            equipmentData
                        );

                    if (
                        parsed &&
                        typeof parsed ===
                            "object"
                    ) {

                        EQUIPMENT_SLOT_IDS
                            .forEach(
                                slot => {

                                    window.equipped[
                                        slot
                                    ] =
                                        normalizeItem(
                                            parsed[
                                                slot
                                            ]
                                        );
                                }
                            );
                    }
                }

            } catch (error) {

                console.error(
                    "Equipment load error:",
                    error
                );
            }

            /*
             * First launch
             */

            if (
                window.inventory.length ===
                0 &&
                getEquippedCount() ===
                0
            ) {

                generateStarterInventory();
            }

            recalculateStats();

            renderInventory();

            inspectItem(
                null
            );

            updateInventoryCounter();

            return true;
        };

    /* =========================================================
       STARTER INVENTORY
       ========================================================= */

    function generateStarterInventory() {

        const starterItems = [

            createItem(
                {
                    name:
                        "Zardzewiałe Ostrze",

                    displayName:
                        "Zardzewiałe Ostrze",

                    type:
                        "weapon",

                    slot:
                        "weapon",

                    rarity:
                        "common",

                    icon:
                        "⚔️",

                    dmgBonus:
                        25,

                    dpsBonus:
                        5
                }
            ),

            createItem(
                {
                    name:
                        "Skórzana Zbroja",

                    displayName:
                        "Skórzana Zbroja",

                    type:
                        "armor",

                    slot:
                        "chest",

                    rarity:
                        "common",

                    icon:
                        "🛡️",

                    hpBonus:
                        120,

                    armorBonus:
                        8
                }
            ),

            createItem(
                {
                    name:
                        "Pierścień Wędrowca",

                    displayName:
                        "Pierścień Wędrowca",

                    type:
                        "ring",

                    slot:
                        "ring1",

                    rarity:
                        "rare",

                    icon:
                        "💍",

                    critBonus:
                        1.5,

                    lootBonus:
                        2
                }
            )
        ];

        starterItems.forEach(
            item => {

                item.id =
                    id();

                window.inventory.push(
                    normalizeItem(
                        item
                    )
                );
            }
        );

        saveInventory();
    }

    /* =========================================================
       RENDER EQUIPMENT
       ========================================================= */

    function renderEquipment() {

        EQUIPMENT_SLOT_IDS
            .forEach(
                slot => {

                    const item =
                        window.equipped[
                            slot
                        ];

                    const element =
                        document.getElementById(
                            `slot-${slot}`
                        );

                    if (
                        !element
                    ) {

                        return;
                    }

                    if (
                        item
                    ) {

                        const rarity =
                            getRarity(
                                item
                            );

                        element.innerHTML = `

                            <span
                                style="
                                    font-size:27px;
                                    filter:
                                        drop-shadow(
                                            0 5px 5px
                                            rgba(0,0,0,.7)
                                        );
                                "
                            >
                                ${item.icon}
                            </span>

                            ${
                                getUpgradeLevel(
                                    item
                                ) > 0
                                    ? `
                                        <small
                                            style="
                                                position:absolute;
                                                right:3px;
                                                bottom:3px;
                                                padding:2px 4px;
                                                background:#000;
                                                color:var(--gold);
                                                border:1px solid var(--panel-border);
                                                font-family:var(--font-pixel);
                                                font-size:6px;
                                            "
                                        >
                                            +${getUpgradeLevel(item)}
                                        </small>
                                    `
                                    : ""
                            }

                        `;

                        element.style.borderColor =
                            rarity.hex;

                        element.style.boxShadow =
                            `0 0 16px ${rarity.hex}33`;

                        element.title =
                            `${item.displayName}\n` +
                            `${rarity.name}\n` +
                            `POWER: ${item.power}`;

                        element.onclick =
                            () =>
                                inspectItem(
                                    item
                                );

                    } else {

                        element.innerHTML =
                            EQUIPMENT_SLOTS[
                                slot
                            ]?.icon ||
                            "❔";

                        element.style.borderColor =
                            "";

                        element.style.boxShadow =
                            "";

                        element.title =
                            EQUIPMENT_SLOTS[
                                slot
                            ]?.name ||
                            slot;

                        element.onclick =
                            null;
                    }
                }
            );
    }

    /* =========================================================
       RENDER INVENTORY
       ========================================================= */

    window.renderInventory =
        function renderInventory() {

            renderEquipment();

            const grid =
                document.getElementById(
                    "inventory-grid"
                );

            if (
                !grid
            ) {

                return;
            }

            grid.innerHTML =
                "";

            const filtered =
                getFilteredInventory();

            if (
                filtered.length ===
                0
            ) {

                grid.innerHTML = `

                    <div
                        style="
                            grid-column:1/-1;
                            text-align:center;
                            padding:50px 15px;
                            color:var(--text-dim);
                        "
                    >

                        <div
                            style="
                                font-size:55px;
                                margin-bottom:12px;
                            "
                        >
                            🎒
                        </div>

                        <div
                            style="
                                font-family:var(--font-pixel);
                                font-size:9px;
                                margin-bottom:8px;
                            "
                        >
                            BRAK PRZEDMIOTÓW
                        </div>

                        <div
                            style="
                                font-size:17px;
                            "
                        >
                            Pokonuj potwory i otwieraj skrzynie.
                        </div>

                    </div>

                `;

                updateInventoryCounter();

                return;
            }

            filtered.forEach(
                item => {

                    const element =
                        createInventoryElement(
                            item
                        );

                    grid.appendChild(
                        element
                    );
                }
            );

            updateInventoryCounter();
        };

    /* =========================================================
       FILTER
       ========================================================= */

    window.setInventoryFilter =
        function setInventoryFilter(
            filter
        ) {

            window.selectedInventoryFilter =
                filter ||
                "all";

            renderInventory();
        };

    function getFilteredInventory() {

        let items =
            [...window.inventory];

        const filter =
            window.selectedInventoryFilter;

        if (
            filter !==
            "all"
        ) {

            items =
                items.filter(
                    item =>
                        matchInventoryFilter(
                            item,
                            filter
                        )
                );
        }

        items.sort(
            inventorySortFunction(
                window.selectedInventorySort
            )
        );

        return items;
    }

    function matchInventoryFilter(
        item,
        filter
    ) {

        if (
            filter ===
            "weapon"
        ) {

            return item.type ===
                "weapon";
        }

        if (
            filter ===
            "armor"
        ) {

            return [
                "armor",
                "helmet",
                "gloves",
                "boots"
            ].includes(
                item.type
            );
        }

        if (
            filter ===
            "jewelry"
        ) {

            return [
                "ring",
                "amulet"
            ].includes(
                item.type
            );
        }

        if (
            filter ===
            "material"
        ) {

            return [
                "material",
                "rune",
                "consumable"
            ].includes(
                item.type
            );
        }

        if (
            filter ===
            "mythic"
        ) {

            return [
                "mythic",
                "divine"
            ].includes(
                normalizeRarity(
                    item.tier
                )
            );
        }

        return true;
    }

    /* =========================================================
       SORT
       ========================================================= */

    window.sortInventory =
        function sortInventory(
            mode =
                "power"
        ) {

            window.selectedInventorySort =
                mode;

            renderInventory();
        };

    function inventorySortFunction(
        mode
    ) {

        const rarityWeight = {

            common: 1,

            rare: 2,

            epic: 3,

            legendary: 4,

            mythic: 5,

            divine: 6
        };

        if (
            mode ===
            "name"
        ) {

            return (
                (a,b) =>
                    String(
                        a.displayName
                    ).localeCompare(
                        String(
                            b.displayName
                        ),
                        "pl"
                    )
            );
        }

        if (
            mode ===
            "level"
        ) {

            return (
                (a,b) =>
                    getUpgradeLevel(
                        b
                    ) -
                    getUpgradeLevel(
                        a
                    )
            );
        }

        if (
            mode ===
            "rarity"
        ) {

            return (
                (a,b) =>
                    (
                        rarityWeight[
                            normalizeRarity(
                                b.tier
                            )
                        ] ||
                        0
                    ) -
                    (
                        rarityWeight[
                            normalizeRarity(
                                a.tier
                            )
                        ] ||
                        0
                    )
            );
        }

        return (
            (a,b) =>
                calculateItemPower(
                    b
                ) -
                calculateItemPower(
                    a
                )
        );
    }

    /* =========================================================
       CREATE INVENTORY ELEMENT
       ========================================================= */

    function createInventoryElement(
        item
    ) {

        const element =
            document.createElement(
                "div"
            );

        const rarity =
            getRarity(
                item
            );

        element.className =
            "inventory-item";

        element.dataset.itemId =
            item.id;

        element.style.position =
            "relative";

        element.style.display =
            "grid";

        element.style.placeItems =
            "center";

        element.style.height =
            "70px";

        element.style.background =
            "linear-gradient(180deg,#0d1420,#05080d)";

        element.style.border =
            `2px solid ${rarity.hex}`;

        element.style.cursor =
            "pointer";

        element.style.transition =
            "transform .12s ease,box-shadow .12s ease";

        const level =
            getUpgradeLevel(
                item
            );

        const quality =
            item.qualityPercent;

        element.innerHTML = `

            <div
                style="
                    font-size:32px;
                    filter:
                        drop-shadow(
                            0 6px 6px
                            rgba(0,0,0,.8)
                        );
                "
            >
                ${item.icon}
            </div>

            ${
                level > 0
                    ? `
                        <div
                            style="
                                position:absolute;
                                left:3px;
                                top:3px;
                                font-family:var(--font-pixel);
                                font-size:6px;
                                color:var(--gold);
                                background:#000;
                                padding:3px;
                            "
                        >
                            +${level}
                        </div>
                    `
                    : ""
            }

            ${
                item.favorite
                    ? `
                        <div
                            style="
                                position:absolute;
                                right:3px;
                                top:2px;
                                color:var(--gold);
                                font-size:11px;
                            "
                        >
                            ★
                        </div>
                    `
                    : ""
            }

            ${
                Array.isArray(
                    item.affixes
                ) &&
                item.affixes.length > 0
                    ? `
                        <div
                            style="
                                position:absolute;
                                left:4px;
                                bottom:3px;
                                color:var(--gold);
                                font-size:9px;
                            "
                        >
                            ◆
                        </div>
                    `
                    : ""
            }

            <div
                style="
                    position:absolute;
                    right:3px;
                    bottom:3px;
                    font-family:var(--font-pixel);
                    font-size:6px;
                    color:${getQualityColor(
                        item.quality
                    )};
                "
            >
                ${quality}%
            </div>

        `;

        element.title =
            `${item.displayName}\n` +
            `${rarity.name}\n` +
            `LEVEL ${item.level}\n` +
            `+${level}\n` +
            `POWER ${item.power}`;

        element.addEventListener(
            "click",
            () =>
                inspectItem(
                    item
                )
        );

        element.addEventListener(
            "dblclick",
            () =>
                equipItem(
                    item.id
                )
        );

        return element;
    }

    /* =========================================================
       INSPECT
       ========================================================= */

    window.inspectItem =
        function inspectItem(
            item
        ) {

            window.inspectedItem =
                item ||
                null;

            const panel =
                document.getElementById(
                    "inspect-panel"
                );

            if (
                !panel
            ) {

                return;
            }

            if (
                !item
            ) {

                panel.innerHTML = `

                    <div
                        style="
                            padding:50px 15px;
                            text-align:center;
                            color:var(--text-dim);
                        "
                    >

                        <div
                            style="
                                font-size:55px;
                                margin-bottom:12px;
                            "
                        >
                            🔎
                        </div>

                        <div
                            style="
                                font-family:var(--font-pixel);
                                font-size:9px;
                                margin-bottom:8px;
                            "
                        >
                            NIE WYBRANO PRZEDMIOTU
                        </div>

                        <div
                            style="
                                font-size:17px;
                            "
                        >
                            Kliknij przedmiot,
                            aby zobaczyć jego szczegóły.
                        </div>

                    </div>

                `;

                return;
            }

            const rarity =
                getRarity(
                    item
                );

            const level =
                getUpgradeLevel(
                    item
                );

            const max =
                getMaxUpgrade(
                item
            );

            const power =
                calculateItemPower(
                    item
                );

            const stats =
                renderInspectStats(
                    item
                );

            const affixes =
                renderAffixes(
                    item
                );

            const setInfo =
                renderSetInfo(
                    item
                );

            const upgrade =
                renderUpgradePanel(
                    item
                );

            panel.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding-bottom:15px;
                        margin-bottom:15px;
                        border-bottom:2px solid var(--panel-border);
                    "
                >

                    <div
                        style="
                            font-size:70px;
                            margin-bottom:12px;
                            filter:
                                drop-shadow(
                                    0 14px 10px
                                    rgba(0,0,0,.8)
                                );
                        "
                    >
                        ${item.icon}
                    </div>

                    <div
                        style="
                            color:${rarity.color};
                            font-family:var(--font-pixel);
                            font-size:11px;
                        "
                    >
                        ${item.displayName}
                        ${
                            level > 0
                                ? ` +${level}`
                                : ""
                        }
                    </div>

                    <div
                        style="
                            color:${rarity.color};
                            font-family:var(--font-pixel);
                            font-size:7px;
                            margin-top:7px;
                        "
                    >
                        ${rarity.name}
                    </div>

                    <div
                        style="
                            margin-top:9px;
                            color:var(--text-dim);
                        "
                    >
                        POWER:

                        <strong
                            style="
                                color:var(--gold);
                            "
                        >
                            ${power}
                        </strong>
                    </div>

                    <div
                        style="
                            margin-top:4px;
                            font-size:16px;
                            color:var(--text-muted);
                        "
                    >
                        JAKOŚĆ:

                        <strong
                            style="
                                color:${getQualityColor(
                                    item.quality
                                )};
                            "
                        >
                            ${item.qualityPercent}%
                        </strong>

                        · ${getQualityLabel(
                            item.quality
                        )}
                    </div>

                </div>

                ${stats}

                ${affixes}

                ${setInfo}

                ${upgrade}

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:8px;
                        margin-top:12px;
                    "
                >

                    <button
                        class="pixel-btn btn-green"
                        onclick="equipItem('${item.id}')"
                    >
                        ⚔ ZAŁÓŻ PRZEDMIOT
                    </button>

                    <button
                        class="pixel-btn btn-gold"
                        onclick="forgeSelectedItem()"
                    >
                        🔨 ZABIERZ DO KUŹNI
                    </button>

                    <button
                        class="pixel-btn btn-red"
                        onclick="salvageSelectedItem()"
                    >
                        ♻ ROZBIJ NA MATERIAŁY
                    </button>

                </div>

            `;
        };

    function renderInspectStats(
        item
    ) {

        const rows =
            [];

        function add(
            icon,
            name,
            stat,
            color,
            suffix =
                ""
        ) {

            const value =
                getItemStat(
                    item,
                    stat
                );

            if (
                value <=
                0
            ) {

                return;
            }

            rows.push(`

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:10px;
                        padding:5px 0;
                        border-bottom:1px dotted rgba(255,255,255,.08);
                    "
                >

                    <span>
                        ${icon}
                        ${name}
                    </span>

                    <strong
                        style="
                            color:${color};
                        "
                    >
                        +${value}${suffix}
                    </strong>

                </div>
            `);
        }

        add(
            "⚔",
            "DMG",
            "dmgBonus",
            "var(--text-main)"
        );

        add(
            "⚡",
            "DPS",
            "dpsBonus",
            "var(--iron)"
        );

        add(
            "❤️",
            "HP",
            "hpBonus",
            "var(--hp-red)"
        );

        add(
            "🛡",
            "ARMOR",
            "armorBonus",
            "var(--iron)"
        );

        add(
            "✨",
            "MAGIC POWER",
            "magicPowerBonus",
            "var(--xp-purple)"
        );

        add(
            "🎯",
            "KRYT",
            "critBonus",
            "var(--gold)",
            "%"
        );

        add(
            "☠",
            "KRYT DMG",
            "critDamageBonus",
            "var(--hp-red)",
            "%"
        );

        add(
            "🩸",
            "LIFESTEAL",
            "lifestealBonus",
            "var(--hp-red)",
            "%"
        );

        add(
            "💨",
            "DODGE",
            "dodgeBonus",
            "var(--mithril)",
            "%"
        );

        add(
            "🛡",
            "BLOCK",
            "blockBonus",
            "var(--blue)",
            "%"
        );

        add(
            "⚡",
            "ATTACK SPEED",
            "attackSpeedBonus",
            "var(--gold)",
            "%"
        );

        add(
            "🪙",
            "GOLD",
            "goldBonus",
            "var(--gold)",
            "%"
        );

        add(
            "✨",
            "EXP",
            "expBonus",
            "var(--xp-purple)",
            "%"
        );

        add(
            "☠",
            "BOSS DAMAGE",
            "bossDamageBonus",
            "var(--hp-red)",
            "%"
        );

        add(
            "🎁",
            "LOOT",
            "lootBonus",
            "var(--mithril)",
            "%"
        );

        add(
            "💠",
            "MAGIC FIND",
            "magicFindBonus",
            "var(--cyan)",
            "%"
        );

        if (
            rows.length ===
            0
        ) {

            return `
                <div
                    style="
                        color:var(--text-dim);
                        text-align:center;
                        padding:10px;
                    "
                >
                    Brak dodatkowych statystyk.
                </div>
            `;
        }

        return `
            <div
                style="
                    text-align:left;
                    font-size:17px;
                "
            >
                ${rows.join("")}
            </div>
        `;
    }

    /* =========================================================
       AFFIX DISPLAY
       ========================================================= */

    function renderAffixes(
        item
    ) {

        if (
            !Array.isArray(
                item.affixes
            ) ||
            item.affixes.length ===
                0
        ) {

            return "";
        }

        return `

            <div
                style="
                    margin-top:13px;
                    padding-top:10px;
                    border-top:1px dashed var(--panel-border);
                    text-align:left;
                "
            >

                <div
                    style="
                        font-family:var(--font-pixel);
                        font-size:7px;
                        color:var(--xp-purple);
                        margin-bottom:7px;
                    "
                >
                    AFFIXES
                </div>

                ${item.affixes.map(
                    affix =>
                        `

                        <div
                            style="
                                margin-bottom:5px;
                                color:var(--gold);
                                font-size:16px;
                            "
                        >
                            ◆
                            ${affix.name}

                            <span
                                style="
                                    color:var(--text-dim);
                                    margin-left:5px;
                                "
                            >
                                ${affix.description || ""}
                            </span>
                        </div>
                    `
                ).join("")}

            </div>

        `;
    }

    /* =========================================================
       SET BONUS
       ========================================================= */

    function renderSetInfo(
        item
    ) {

        if (
            !item.setId ||
            !ITEM_SETS[
                item.setId
            ]
        ) {

            return "";
        }

        const set =
            ITEM_SETS[
                item.setId
            ];

        const equippedPieces =
            EQUIPMENT_SLOT_IDS
                .map(
                    slot =>
                        window.equipped[
                            slot
                        ]
                )
                .filter(
                    Boolean
                )
                .filter(
                    equippedItem =>
                        equippedItem.setId ===
                        set.id
                )
                .length;

        const possibleBonuses =
            Object.entries(
                set.bonuses
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(a[0]) -
                    Number(b[0])
            );

        return `

            <div
                style="
                    margin-top:13px;
                    padding:11px;
                    border:2px solid ${set.color};
                    background:${set.color}12;
                "
            >

                <div
                    style="
                        font-family:var(--font-pixel);
                        color:${set.color};
                        font-size:8px;
                        margin-bottom:7px;
                    "
                >
                    ${set.name}
                </div>

                <div
                    style="
                        color:var(--text-muted);
                        font-size:15px;
                        margin-bottom:7px;
                    "
                >
                    AKTYWNE:
                    <strong
                        style="
                            color:${set.color};
                        "
                    >
                        ${equippedPieces}
                        /
                        ${set.pieces.length}
                    </strong>
                </div>

                ${possibleBonuses.map(
                    (
                        [
                            count,
                            bonus
                        ]
                    ) => {

                        const text =
                            Object.entries(
                                bonus
                            )
                            .map(
                                (
                                    [
                                        stat,
                                        value
                                    ]
                                ) =>
                                    `${formatStatName(stat)} +${value}${PERCENT_STATS.includes(stat) ? "%" : ""}`
                            )
                            .join(
                                " · "
                            );

                        const active =
                            equippedPieces >=
                            Number(count);

                        return `

                            <div
                                style="
                                    color:${
                                        active
                                            ? set.color
                                            : "var(--text-dim)"
                                    };
                                    font-size:15px;
                                    margin-top:4px;
                                "
                            >
                                ${active ? "✓" : "○"}
                                ${count} części:
                                ${text}
                            </div>
                        `;
                    }
                ).join("")}

            </div>

        `;
    }

    function formatStatName(
        stat
    ) {

        const names = {

            dmgBonus:
                "DMG",

            dpsBonus:
                "DPS",

            hpBonus:
                "HP",

            armorBonus:
                "ARMOR",

            critBonus:
                "KRYT",

            lifestealBonus:
                "LIFESTEAL",

            bossDamageBonus:
                "BOSS DMG",

            lootBonus:
                "LOOT",

            magicFindBonus:
                "MAGIC FIND"
        };

        return (
            names[
                stat
            ] ||
            stat
        );
    }

    /* =========================================================
       UPGRADE PANEL
       ========================================================= */

    function renderUpgradePanel(
        item
    ) {

        const level =
            getUpgradeLevel(
                item
            );

        const max =
            getMaxUpgrade(
                item
            );

        const next =
            getUpgradePreview(
                item
            );

        if (
            level >=
            max
        ) {

            return `

                <div
                    style="
                        margin-top:13px;
                        padding:12px;
                        text-align:center;
                        border:2px solid var(--gold);
                        background:rgba(255,194,71,.04);
                        color:var(--gold);
                    "
                >

                    <div
                        style="
                            font-family:var(--font-pixel);
                            font-size:8px;
                        "
                    >
                        ★ MAKSYMALNY POZIOM ★
                    </div>

                    <div
                        style="
                            margin-top:5px;
                            font-size:15px;
                            color:var(--text-muted);
                        "
                    >
                        ${level}/${max}
                    </div>

                </div>
            `;
        }

        const cost =
            getUpgradeCost(
                item
            );

        return `

            <div
                style="
                    margin-top:13px;
                    padding:11px;
                    border:2px dashed var(--gold);
                    background:rgba(255,194,71,.035);
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        color:var(--text-muted);
                        font-size:15px;
                    "
                >
                    <span>
                        ULEPSZENIE
                    </span>

                    <strong
                        style="
                            color:var(--gold);
                        "
                    >
                        +${level}
                        /
                        +${max}
                    </strong>
                </div>

                <div
                    style="
                        margin-top:7px;
                        display:flex;
                        justify-content:space-between;
                        color:var(--text-muted);
                        font-size:15px;
                    "
                >
                    <span>
                        KOSZT
                    </span>

                    <strong
                        style="
                            color:var(--gold);
                        "
                    >
                        ${formatNumber(cost.gold)}
                        🪙
                    </strong>
                </div>

                <div
                    style="
                        margin-top:3px;
                        display:flex;
                        justify-content:space-between;
                        color:var(--text-muted);
                        font-size:15px;
                    "
                >
                    <span>
                        MATERIAŁY
                    </span>

                    <strong
                        style="
                            color:var(--iron);
                        "
                    >
                        ${cost.iron}
                        🔩
                        ${
                            cost.mithril
                                ? ` · ${cost.mithril} 💎`
                                : ""
                        }
                    </strong>
                </div>

                ${
                    next
                        ? `
                            <div
                                style="
                                    margin-top:9px;
                                    padding-top:8px;
                                    border-top:1px dashed var(--panel-border);
                                    color:var(--green);
                                    font-size:14px;
                                "
                            >
                                Następny poziom zwiększy statystyki.
                            </div>
                        `
                        : ""
                }

            </div>

        `;
    }

    function formatNumber(
        value
    ) {

        return Number(
            safeNumber(
                value,
                0
            )
        ).toLocaleString(
            "pl-PL"
        );
    }

    /* =========================================================
       FORGE SELECTED
       ========================================================= */

    window.forgeSelectedItem =
        function forgeSelectedItem() {

            if (
                !window.inspectedItem
            ) {

                return false;
            }

            return window.forgeItem(
                window.inspectedItem.id
            );
        };

    /* =========================================================
       FORGE
       ========================================================= */

    window.forgeItem =
        function forgeItem(
            itemId
        ) {

            const item =
                findItemEverywhere(
                    itemId ||
                    window.inspectedItem
                        ?.id
                );

            if (
                !item
            ) {

                showNotification(
                    "Nie znaleziono przedmiotu.",
                    "KUŹNIA"
                );

                return false;
            }

            const level =
                getUpgradeLevel(
                    item
                );

            const max =
                getMaxUpgrade(
                    item
                );

            if (
                level >=
                max
            ) {

                showNotification(
                    "Przedmiot osiągnął maksymalny poziom.",
                    "KUŹNIA"
                );

                return false;
            }

            const cost =
                getUpgradeCost(
                    item
                );

            const g =
                getGameData();

            const gold =
                safeNumber(
                    g.gold,
                    safeNumber(
                        g.currencies
                            ?.gold,
                        0
                    )
                );

            const iron =
                safeNumber(
                    g.iron,
                    safeNumber(
                        g.currencies
                            ?.iron,
                        0
                    )
                );

            const mithril =
                safeNumber(
                    g.mithril,
                    safeNumber(
                        g.currencies
                            ?.mithril,
                        0
                    )
                );

            if (
                gold <
                cost.gold
            ) {

                showNotification(
                    `Brakuje ${formatNumber(cost.gold - gold)} 🪙.`,
                    "KUŹNIA"
                );

                return false;
            }

            if (
                iron <
                cost.iron
            ) {

                showNotification(
                    `Brakuje ${formatNumber(cost.iron - iron)} 🔩.`,
                    "KUŹNIA"
                );

                return false;
            }

            if (
                mithril <
                cost.mithril
            ) {

                showNotification(
                    `Brakuje ${formatNumber(cost.mithril - mithril)} 💎.`,
                    "KUŹNIA"
                );

                return false;
            }

            /*
             * Success chance
             */

            const chance =
                getUpgradeSuccessChance(
                    item
                );

            const success =
                Math.random() <
                chance;

            /*
             * Costs
             */

            setCurrency(
                "gold",
                gold -
                cost.gold
            );

            setCurrency(
                "iron",
                iron -
                cost.iron
            );

            setCurrency(
                "mithril",
                mithril -
                cost.mithril
            );

            if (
                success
            ) {

                item.upgradeLevel =
                    level +
                    1;

                item.power =
                    calculateItemPower(
                        item
                    );

                showNotification(
                    `${item.displayName} osiągnął +${item.upgradeLevel}!`,
                    "UPGRADE SUCCESS"
                );

                if (
                    typeof window.emitGameEvent ===
                    "function"
                ) {

                    window.emitGameEvent(
                        "itemUpgraded",
                        {
                            item
                        }
                    );
                }

            } else {

                /*
                 * Fail protection
                 */

                const protectedItem =
                    Boolean(
                        g.settings
                            ?.upgradeProtection
                    );

                if (
                    !protectedItem
                ) {

                    item.upgradeLevel =
                        Math.max(
                            0,
                            level -
                            1
                        );
                }

                item.power =
                    calculateItemPower(
                        item
                    );

                showNotification(
                    protectedItem
                        ? "Porażka, ale ochrona uratowała przedmiot."
                        : `${item.displayName} nie wytrzymał ulepszenia i spadł do +${item.upgradeLevel}.`,
                    "UPGRADE FAIL"
                );
            }

            recalculateStats();

            saveInventory();

            renderInventory();

            inspectItem(
                item
            );

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            return success;
        };

    function getUpgradeSuccessChance(
        item
    ) {

        const level =
            getUpgradeLevel(
                item
            );

        if (
            level <=
            4
        ) {

            return .95;
        }

        if (
            level <=
            9
        ) {

            return .82;
        }

        if (
            level <=
            14
        ) {

            return .68;
        }

        if (
            level <=
            19
        ) {

            return .52;
        }

        if (
            level <=
            29
        ) {

            return .38;
        }

        if (
            level <=
            39
        ) {

            return .25;
        }

        return .15;
    }

    /* =========================================================
       CURRENCY
       ========================================================= */

    function getCurrency(
        type
    ) {

        const g =
            getGameData();

        if (
            g.currencies &&
            Object.prototype.hasOwnProperty.call(
                g.currencies,
                type
            )
        ) {

            return safeNumber(
                g.currencies[
                    type
                ],
                0
            );
        }

        return safeNumber(
            g[
                type
            ],
            0
        );
    }

    function setCurrency(
        type,
        amount
    ) {

        const g =
            getGameData();

        const final =
            Math.max(
                0,
                safeNumber(
                    amount,
                    0
                )
            );

        if (
            g.currencies &&
            Object.prototype.hasOwnProperty.call(
                g.currencies,
                type
            )
        ) {

            g.currencies[
                type
            ] =
                final;

        } else {

            g[
                type
            ] =
                final;
        }

        /*
         * Legacy
         */

        if (
            type ===
            "gold"
        ) {

            g.gold =
                final;
        }

        if (
            type ===
            "iron"
        ) {

            g.iron =
                Math.floor(
                    final
                );
        }

        if (
            type ===
            "mithril"
        ) {

            g.mithril =
                Math.floor(
                    final
                );
        }
    }

    /* =========================================================
       ITEM FIND
       ========================================================= */

    window.findItem =
        function findItem(
            itemId
        ) {

            return (
                window.inventory.find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            itemId
                        )
                ) ||
                null
            );
        };

    function findItemEverywhere(
        itemId
    ) {

        const fromInventory =
            window.findItem(
                itemId
            );

        if (
            fromInventory
        ) {

            return fromInventory;
        }

        for (
            const slot of
            EQUIPMENT_SLOT_IDS
        ) {

            const item =
                window.equipped[
                    slot
                ];

            if (
                item &&
                String(
                    item.id
                ) ===
                String(
                    itemId
                )
            ) {

                return item;
            }
        }

        return null;
    }

    /* =========================================================
       REMOVE ITEM
       ========================================================= */

    window.removeItem =
        function removeItem(
            itemId
        ) {

            const index =
                window.inventory.findIndex(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            itemId
                        )
                );

            if (
                index ===
                -1
            ) {

                return false;
            }

            const item =
                window.inventory[
                    index
                ];

            window.inventory.splice(
                index,
                1
            );

            if (
                window.inspectedItem
                    ?.id ===
                item.id
            ) {

                inspectItem(
                    null
                );
            }

            saveInventory();

            renderInventory();

            return true;
        };

    /* =========================================================
       SALVAGE
       ========================================================= */

    window.salvageItem =
        function salvageItem(
            itemId
        ) {

            const item =
                window.findItem(
                    itemId
                );

            if (
                !item
            ) {

                return false;
            }

            const power =
                calculateItemPower(
                    item
                );

            const level =
                getUpgradeLevel(
                    item
                );

            const rarity =
                getRarity(
                    item
                );

            const gold =
                Math.max(
                    25,
                    Math.floor(
                        power *
                        .18
                    )
                );

            const iron =
                Math.max(
                    5,
                    Math.floor(
                        10 +
                        level *
                        4 *
                        rarity
                            .statMultiplier
                    )
                );

            const mithril =
                (
                    normalizeRarity(
                        item.tier
                    ) ===
                    "legendary" ||
                    normalizeRarity(
                        item.tier
                    ) ===
                    "mythic" ||
                    normalizeRarity(
                        item.tier
                    ) ===
                    "divine"
                )
                    ? Math.max(
                        1,
                        Math.floor(
                            power /
                            12000
                        )
                    )
                    : 0;

            window.removeItem(
                item.id
            );

            setCurrency(
                "gold",
                getCurrency(
                    "gold"
                ) +
                gold
            );

            setCurrency(
                "iron",
                getCurrency(
                    "iron"
                ) +
                iron
            );

            if (
                mithril >
                0
            ) {

                setCurrency(
                    "mithril",
                    getCurrency(
                        "mithril"
                    ) +
                    mithril
                );
            }

            if (
                typeof window.updateStatusUI ===
                "function"
            ) {

                window.updateStatusUI();
            }

            if (
                typeof window.saveGame ===
                "function"
            ) {

                window.saveGame();
            }

            showNotification(
                `Rozbito ${item.displayName}: +${formatNumber(gold)} 🪙 +${formatNumber(iron)} 🔩 ${mithril ? `+${mithril} 💎` : ""}`,
                "SALVAGE"
            );

            return true;
        };

    /* =========================================================
       SELECTED SALVAGE
       ========================================================= */

    window.salvageSelectedItem =
        function salvageSelectedItem() {

            if (
                !window.inspectedItem
            ) {

                return false;
            }

            return window.salvageItem(
                window.inspectedItem.id
            );
        };

    /* =========================================================
       FAVORITE
       ========================================================= */

    window.toggleFavoriteItem =
        function toggleFavoriteItem(
            itemId
        ) {

            const item =
                findItemEverywhere(
                    itemId
                );

            if (
                !item
            ) {

                return false;
            }

            item.favorite =
                !item.favorite;

            saveInventory();

            renderInventory();

            if (
                window.inspectedItem
                    ?.id ===
                item.id
            ) {

                inspectItem(
                    item
                );
            }

            return item.favorite;
        };

    /* =========================================================
       DURABILITY
       ========================================================= */

    window.damageEquipment =
        function damageEquipment(
            amount =
                1
        ) {

            amount =
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        1
                    )
                );

            EQUIPMENT_SLOT_IDS
                .forEach(
                    slot => {

                        const item =
                            window.equipped[
                                slot
                            ];

                        if (
                            !item
                        ) {

                            return;
                        }

                        item.durability =
                            clamp(
                                item.durability -
                                amount,
                                0,
                                item.maxDurability
                            );

                        if (
                            item.durability <=
                            0
                        ) {

                            showNotification(
                                `${item.displayName} jest zużyty.`,
                                "DURABILITY"
                            );
                        }
                    }
                );

            saveInventory();

            if (
                typeof window.emitGameEvent ===
                "function"
            ) {

                window.emitGameEvent(
                    "equipmentDurabilityChanged"
                );
            }
        };

    /* =========================================================
       SOCKET SYSTEM
       ========================================================= */

    window.addRuneToItem =
        function addRuneToItem(
            itemId,
            rune
        ) {

            const item =
                findItemEverywhere(
                    itemId
                );

            if (
                !item ||
                !rune
            ) {

                return false;
            }

            item.socketedRunes =
                Array.isArray(
                    item.socketedRunes
                )
                    ? item.socketedRunes
                    : [];

            if (
                item.socketedRunes.length >=
                item.sockets
            ) {

                showNotification(
                    "Brak wolnych slotów na runy.",
                    "RUNA"
                );

                return false;
            }

            item.socketedRunes.push(
                clone(
                    rune
                )
            );

            /*
             * Add rune stats
             */

            if (
                rune.stats &&
                typeof rune.stats ===
                    "object"
            ) {

                Object.entries(
                    rune.stats
                )
                .forEach(
                    (
                        [
                            stat,
                            value
                        ]
                    ) => {

                        if (
                            ITEM_STATS.includes(
                                stat
                            )
                        ) {

                            item[
                                stat
                            ] +=
                                safeNumber(
                                    value,
                                    0
                                );
                        }
                    }
                );
            }

            item.power =
                calculateItemPower(
                    item
                );

            recalculateStats();

            saveInventory();

            renderInventory();

            inspectItem(
                item
            );

            showNotification(
                `Dodano runę do ${item.displayName}.`,
                "RUNA"
            );

            return true;
        };

    /* =========================================================
       EQUIPPED ITEMS
       ========================================================= */

    window.getEquippedItem =
        function getEquippedItem(
            slot
        ) {

            return (
                window.equipped[
                    slot
                ] ||
                null
            );
        };

    /* =========================================================
       INVENTORY COUNT
       ========================================================= */

    window.getInventoryCount =
        function getInventoryCount() {

            return window.inventory.length;
        };

    window.getEquippedCount =
        function getEquippedCount() {

            return EQUIPMENT_SLOT_IDS
                .filter(
                    slot =>
                        Boolean(
                            window.equipped[
                                slot
                            ]
                        )
                )
                .length;
        };

    /* =========================================================
       GET ITEM POWER
       ========================================================= */

    window.getItemPower =
        calculateItemPower;

    /* =========================================================
       GET BEST ITEM
       ========================================================= */

    window.getBestItem =
        function getBestItem(
            slot
        ) {

            const candidates =
                window.inventory
                    .filter(
                        item =>
                            normalizeEquipmentSlot(
                                item.slot ||
                                item.type
                            ) ===
                            slot
                    );

            if (
                candidates.length ===
                0
            ) {

                return null;
            }

            return candidates.sort(
                (
                    a,
                    b
                ) =>
                    calculateItemPower(
                        b
                    ) -
                    calculateItemPower(
                        a
                    )
            )[0];
        };

    /* =========================================================
       AUTO EQUIP BEST
       ========================================================= */

    window.autoEquipBest =
        function autoEquipBest(
            slot
        ) {

            const item =
                window.getBestItem(
                    slot
                );

            if (
                !item
            ) {

                showNotification(
                    "Brak przedmiotów dla tego slotu.",
                    "AUTO EQUIP"
                );

                return false;
            }

            return window.equipItem(
                item.id
            );
        };

    /* =========================================================
       COMPARE
       ========================================================= */

    window.compareItems =
        function compareItems(
            first,
            second
        ) {

            if (
                !first
            ) {

                return null;
            }

            const result =
                {};

            ITEM_STATS.forEach(
                stat => {

                    result[
                        stat
                    ] =
                        getItemStat(
                            first,
                            stat
                        ) -
                        (
                            second
                                ? getItemStat(
                                    second,
                                    stat
                                )
                                : 0
                        );
                }
            );

            result.power =
                calculateItemPower(
                    first
                ) -
                (
                    second
                        ? calculateItemPower(
                            second
                        )
                        : 0
                );

            return result;
        };

    /* =========================================================
       INVENTORY SORT
       ========================================================= */

    window.sortInventory =
        function sortInventory(
            mode =
                "power"
        ) {

            window.selectedInventorySort =
                mode;

            const rarityWeights = {

                common: 1,

                rare: 2,

                epic: 3,

                legendary: 4,

                mythic: 5,

                divine: 6
            };

            if (
                mode ===
                "name"
            ) {

                window.inventory.sort(
                    (
                        a,
                        b
                    ) =>
                        String(
                            a.displayName
                        ).localeCompare(
                            String(
                                b.displayName
                            ),
                            "pl"
                        )
                );

            } else if (
                mode ===
                "rarity"
            ) {

                window.inventory.sort(
                    (
                        a,
                        b
                    ) =>
                        (
                            rarityWeights[
                                normalizeRarity(
                                    b.tier
                                )
                            ] ||
                            0
                        ) -
                        (
                            rarityWeights[
                                normalizeRarity(
                                    a.tier
                                )
                            ] ||
                            0
                        )
                );

            } else if (
                mode ===
                "level"
            ) {

                window.inventory.sort(
                    (
                        a,
                        b
                    ) =>
                        getUpgradeLevel(
                            b
                        ) -
                        getUpgradeLevel(
                            a
                        )
                );

            } else if (
                mode ===
                "quality"
            ) {

                window.inventory.sort(
                    (
                        a,
                        b
                    ) =>
                        safeNumber(
                            b.quality,
                            0
                        ) -
                        safeNumber(
                            a.quality,
                            0
                        )
                );

            } else {

                window.inventory.sort(
                    (
                        a,
                        b
                    ) =>
                        calculateItemPower(
                            b
                        ) -
                        calculateItemPower(
                            a
                        )
                );
            }

            saveInventory();

            renderInventory();

            return window.inventory;
        };

    /* =========================================================
       SEARCH
       ========================================================= */

    window.searchInventory =
        function searchInventory(
            query
        ) {

            query =
                String(
                    query ||
                    ""
                )
                .trim()
                .toLowerCase();

            const grid =
                document.getElementById(
                    "inventory-grid"
                );

            if (
                !grid
            ) {

                return [];
            }

            if (
                !query
            ) {

                renderInventory();

                return window.inventory;
            }

            const filtered =
                window.inventory
                    .filter(
                        item =>
                            String(
                                item.displayName
                            )
                            .toLowerCase()
                            .includes(
                                query
                            )
                    );

            grid.innerHTML =
                "";

            filtered.forEach(
                item => {

                    grid.appendChild(
                        createInventoryElement(
                            item
                        )
                    );
                }
            );

            return filtered;
        };

    /* =========================================================
       CLEAR INVENTORY
       ========================================================= */

    window.clearInventory =
        function clearInventory() {

            const accepted =
                window.confirm(
                    "Czy na pewno usunąć cały inventory?"
                );

            if (
                !accepted
            ) {

                return false;
            }

            window.inventory =
                [];

            window.inspectedItem =
                null;

            saveInventory();

            renderInventory();

            inspectItem(
                null
            );

            showNotification(
                "Plecak został wyczyszczony.",
                "INVENTORY"
            );

            return true;
        };

    /* =========================================================
       DEBUG ITEMS
       ========================================================= */

    window.createTestItem =
        function createTestItem(
            type =
                "weapon",
            name =
                "Testowy Przedmiot",
            rarity =
                "epic"
        ) {

            const item =
                createItem(
                    {

                        name,

                        displayName:
                            name,

                        type,

                        slot:
                            inferSlot(
                                {
                                    type
                                }
                            ),

                        rarity,

                        icon:
                            ITEM_TYPES[
                                type
                            ]?.icon ||
                            "❔",

                        dmgBonus:
                            type ===
                            "weapon"
                                ? 150
                                : 20,

                        dpsBonus:
                            type ===
                            "weapon"
                                ? 35
                                : 10,

                        hpBonus:
                            [
                                "armor",
                                "helmet",
                                "boots"
                            ]
                            .includes(
                                type
                            )
                                ? 500
                                : 0,

                        armorBonus:
                            [
                                "armor",
                                "helmet"
                            ]
                            .includes(
                                type
                            )
                                ? 50
                                : 10,

                        critBonus:
                            type ===
                            "weapon"
                                ? 4
                                : 1,

                        lifestealBonus:
                            2,

                        lootBonus:
                            5
                    }
                );

            rollAffixes(
                item,
                2
            );

            return window.giveItem(
                item
            );
        };

    /* =========================================================
       GIVE RANDOM LOOT
       ========================================================= */

    window.giveRandomLoot =
        function giveRandomLoot(
            options =
                {}
        ) {

            const item =
                window.createRandomLoot(
                    options
                );

            return window.giveItem(
                item
            );
        };

    /* =========================================================
       FULL INVENTORY STATISTICS
       ========================================================= */

    window.getInventoryStatistics =
        function getInventoryStatistics() {

            const result = {

                total:
                    window.inventory.length,

                common:
                    0,

                rare:
                    0,

                epic:
                    0,

                legendary:
                    0,

                mythic:
                    0,

                divine:
                    0,

                totalPower:
                    0,

                averageQuality:
                    0,

                favorites:
                    0
            };

            window.inventory.forEach(
                item => {

                    const rarity =
                        normalizeRarity(
                            item.tier
                        );

                    if (
                        result[
                            rarity
                        ] !==
                        undefined
                    ) {

                        result[
                            rarity
                        ]++;
                    }

                    result.totalPower +=
                        calculateItemPower(
                            item
                        );

                    result.averageQuality +=
                        safeNumber(
                            item.quality,
                            1
                        );

                    if (
                        item.favorite
                    ) {

                        result.favorites++;
                    }
                }
            );

            if (
                result.total >
                0
            ) {

                result.averageQuality =
                    Number(
                        (
                            result.averageQuality /
                            result.total
                        ).toFixed(
                            3
                        )
                    );
            }

            return result;
        };

    /* =========================================================
       INVENTORY COUNTER
       ========================================================= */

    function updateInventoryCounter() {

        const current =
            window.inventory.length;

        const element =
            document.getElementById(
                "inventory-count"
            );

        if (
            element
        ) {

            element.textContent =
                `${current}/${window.inventoryCapacity}`;
        }

        const capacity =
            document.getElementById(
                "inventory-capacity"
            );

        if (
            capacity
        ) {

            capacity.textContent =
                window.inventoryCapacity;
        }
    }

    /* =========================================================
       SET BONUS CALCULATION
       ========================================================= */

    window.getActiveSetBonuses =
        function getActiveSetBonuses() {

            const result =
                {};

            const counts =
                {};

            EQUIPMENT_SLOT_IDS.forEach(
                slot => {

                    const item =
                        window.equipped[
                            slot
                        ];

                    if (
                        !item ||
                        !item.setId
                    ) {

                        return;
                    }

                    counts[
                        item.setId
                    ] =
                        (
                            counts[
                                item.setId
                            ] ||
                            0
                        ) +
                        1;
                }
            );

            Object.entries(
                counts
            ).forEach(
                (
                    [
                        setId,
                        count
                    ]
                ) => {

                    const set =
                        ITEM_SETS[
                            setId
                        ];

                    if (
                        !set
                    ) {

                        return;
                    }

                    Object.entries(
                        set.bonuses
                    ).forEach(
                        (
                            [
                                required,
                                bonus
                            ]
                        ) => {

                            if (
                                count <
                                Number(
                                    required
                                )
                            ) {

                                return;
                            }

                            Object.entries(
                                bonus
                            )
                            .forEach(
                                (
                                    [
                                        stat,
                                        value
                                    ]
                                ) => {

                                    result[
                                        stat
                                    ] =
                                        (
                                            result[
                                                stat
                                            ] ||
                                            0
                                        ) +
                                        safeNumber(
                                            value,
                                            0
                                        );
                                }
                            );
                        }
                    );
                }
            );

            return result;
        };

    /* =========================================================
       INIT
       ========================================================= */

    function initialize() {

        loadInventory();

        /*
         * Recalculate AFTER Core
         */

        setTimeout(
            () => {

                recalculateStats();

                renderInventory();

                updateInventoryCounter();

                if (
                    window.inventory.length >
                    0
                ) {

                    showNotification(
                        `Plecak gotowy · ${window.inventory.length}/${window.inventoryCapacity}`,
                        "INVENTORY"
                    );
                }

            },
            100
        );
    }

    /* =========================================================
       GLOBAL EXPORTS
       ========================================================= */

    window.ITEM_RARITIES =
        RARITIES;

    window.ITEM_TYPES =
        ITEM_TYPES;

    window.EQUIPMENT_SLOTS =
        EQUIPMENT_SLOTS;

    window.ITEM_AFFIXES =
        AFFIXES;

    window.ITEM_SETS =
        ITEM_SETS;

    window.calculateItemPower =
        calculateItemPower;

    window.normalizeInventoryItem =
        normalizeItem;

    window.getItemStat =
        getItemStat;

    window.getUpgradeMultiplier =
        getUpgradeMultiplier;

    window.getUpgradeCost =
        getUpgradeCost;

    window.getMaxUpgrade =
        getMaxUpgrade;

    window.generateItemQuality =
        generateQuality;

    window.getInventoryQualityLabel =
        getQualityLabel;

    window.getInventoryQualityColor =
        getQualityColor;

    window.rollInventoryRarity =
        rollRarity;

    window.rollInventoryAffixes =
        rollAffixes;

    window.recalculateInventoryStats =
        recalculateStats;

    /* =========================================================
       DOM READY
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once:
                    true
            }
        );

    } else {

        initialize();
    }

})();
