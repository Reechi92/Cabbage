// ==========================================
// KAPUSTA CLICKER — MEGA UPDATE (FIXED v2)
// + Престиж, Автокликер, Крит, Комбо, Урожай, Скины, Частицы, Тема
// ==========================================

// ===== 1. DOM ЭЛЕМЕНТЫ =====
const levelCounter = document.querySelector('.level-num');
const counterBtn = document.getElementById('clickerBtn');
const clickerImg = document.getElementById('clickerImg');
const skinWrapper = document.getElementById('skinWrapper');
const progressBarInner = document.querySelector('.progress-bar-inner');
const titleCounter = document.querySelector('.titleCounter');
const earnTapInt = document.querySelector('.e-tap');
const infoLvl = document.querySelector('.info-lvl');
const upgradeLvl = document.querySelector('.lvl-text');
const boostTitleCounter = document.querySelector('.boost-titleCounter');
const particlesContainer = document.getElementById('particlesContainer');
const comboBar = document.getElementById('comboBar');
const comboFill = document.getElementById('comboFill');
const comboText = document.getElementById('comboText');

const btnShop = document.getElementById('openShopBtn');
const rightPanel = document.getElementById('rightPanel');
const btnUpgrade = document.getElementById('openUpgradeBtn');
const btnTasks = document.getElementById('openTasksBtn');
const btnHarvest = document.getElementById('openHarvestBtn');
const leftPanel = document.getElementById('leftPanel');
const tasksList = document.getElementById('tasksList');
const skinsGrid = document.getElementById('skinsGrid');

const energyUnit = document.querySelector('.energy-unit');
const energyCapacity = document.querySelector('.energy-capacity');
const earnHour = document.querySelector('.e-hour');

const boostOverlay = document.getElementById('boostModalOverlay');
const tasksOverlay = document.getElementById('tasksModalOverlay');
const levelOverlay = document.getElementById('myModalOverlay');
const offlineOverlay = document.getElementById('offlineModalOverlay');
const harvestOverlay = document.getElementById('harvestModalOverlay');
const prestigeOverlay = document.getElementById('prestigeModalOverlay');

// ===== 2. УТИЛИТЫ =====
function formatNumber(value) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1).replace('.0', '') + 'k';
    return value.toString();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (type === 'error') toast.style.borderColor = '#ff6b6b';
    if (type === 'success') toast.style.borderColor = '#69F279';
    if (type === 'crit') toast.style.borderColor = '#FFCA0A';
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ===== ПЛАВНОЕ ПОЯВЛЕНИЕ ТЕКСТА (фикс #1) =====
function createFloatingText(x, y, text, isCrit = false) {
    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = text;
    floatText.style.position = 'fixed';
    floatText.style.left = `${x}px`;
    floatText.style.top = `${y}px`;
    floatText.style.zIndex = '99999';
    floatText.style.whiteSpace = 'nowrap';
    floatText.style.opacity = '1';
    if (isCrit) {
        floatText.classList.add('float-crit');
    }
    document.body.appendChild(floatText);
    // Удаляем после полного цикла анимации (появление + полёт + исчезновение)
    setTimeout(() => floatText.remove(), isCrit ? 2500 : 1800);
}

// ===== ЧАСТИЦЫ =====
function createParticles(x, y, count = 6, isCrit = false) {
    const colors = isCrit 
        ? ['#FFCA0A', '#FF6B6B', '#FFD700', '#FFA500']
        : ['#00d2ff', '#3a7bd5', '#899CE6', '#69F279'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (Math.PI * 2 * i) / count;
        const distance = 30 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30;

        particle.style.position = 'fixed';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.width = isCrit ? `${6 + Math.random() * 6}px` : `${4 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.zIndex = '9999';
        particle.style.pointerEvents = 'none';
        particle.style.borderRadius = '50%';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// ===== КРИТ-ВСПЫШКА НА ЭКРАНЕ (фикс #2) =====
let critFlashTimeout = null;
function triggerCritFlash() {
    const flash = document.getElementById('critScreenFlash');
    if (!flash) return;
    flash.classList.add('active');
    clearTimeout(critFlashTimeout);
    critFlashTimeout = setTimeout(() => flash.classList.remove('active'), 400);
}

function saveGame() {
    const data = {
        counter, level, levelProgress, clicksForLevelUp, energy, maxEnergy,
        clickPower, upLvlBtn, buttonCost, progressIncrement,
        infoEarnHour, priceEarnHour, lvlBtnRevenue,
        boostUnit, limitPrice, lvlLimit,
        tasks, totalClicks, currentRankIndex,
        shopData,
        prestigeLevel, prestigeMultiplier,
        autoclickerLevel, autoclickerPrice,
        critLevel, critChance, critPrice,
        activeSkin, unlockedSkins,
        theme,
        lastHarvestTime,
        lastSaveTime: Date.now()
    };
    localStorage.setItem('kapustaSave', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('kapustaSave');
    if (!saved) return null;
    try { return JSON.parse(saved); } catch (e) { return null; }
}

function calculateClicksForLevel(lvl) {
    return Math.floor(10 * Math.pow(1.3, lvl));
}

function updateUI() {
    if (titleCounter) titleCounter.textContent = formatNumber(counter);
    if (boostTitleCounter) boostTitleCounter.textContent = formatNumber(counter);
    if (levelCounter) levelCounter.textContent = level;
    if (infoLvl) infoLvl.textContent = `Ваш уровень ${level}`;

    const progressPercent = Math.min(100, (levelProgress / clicksForLevelUp) * 100);
    if (progressBarInner) progressBarInner.style.width = `${progressPercent}%`;

    const progressText = document.getElementById('progressBarText');
    if (progressText) progressText.textContent = `${formatNumber(levelProgress)} / ${formatNumber(clicksForLevelUp)}`;

    if (earnTapInt) earnTapInt.textContent = formatNumber(Math.floor(clickPower * prestigeMultiplier));
    if (upgradeLvl) upgradeLvl.textContent = `${upLvlBtn} ур`;

    const priceText = document.querySelector('.price-text');
    if (priceText) priceText.textContent = formatNumber(buttonCost);

    if (earnHour) earnHour.textContent = formatNumber(Math.floor(infoEarnHour * prestigeMultiplier));
    if (energyUnit) energyUnit.textContent = energy;
    if (energyCapacity) energyCapacity.textContent = maxEnergy;

    const boostUnitEl = document.querySelector('.boost-unit');
    if (boostUnitEl) boostUnitEl.textContent = boostUnit;

    const limitPriceEl = document.querySelector('.limit-price');
    if (limitPriceEl) limitPriceEl.textContent = formatNumber(limitPrice);

    const lvlLimitEl = document.querySelector('.lvl-limit');
    if (lvlLimitEl) lvlLimitEl.textContent = lvlLimit + ' lvl';

    // Прибыль
    const numberHourEl = document.querySelector('.number-hour');
    const priceHourEl = document.querySelector('.price-hour');
    const lvlRevenueEl = document.querySelector('.lvl-revenue');
    if (numberHourEl) numberHourEl.textContent = formatNumber(500 * Math.pow(2, lvlBtnRevenue - 1));
    if (priceHourEl) priceHourEl.textContent = formatNumber(priceEarnHour);
    if (lvlRevenueEl) lvlRevenueEl.textContent = `${lvlBtnRevenue} ур`;

    // Автокликер
    const autoclickerPriceEl = document.querySelector('.autoclicker-price');
    const autoclickerLvlEl = document.querySelector('.autoclicker-lvl');
    if (autoclickerPriceEl) autoclickerPriceEl.textContent = formatNumber(autoclickerPrice);
    if (autoclickerLvlEl) autoclickerLvlEl.textContent = `${autoclickerLevel} ур`;

    // Крит
    const critChanceEl = document.querySelector('.crit-chance');
    const critPriceEl = document.querySelector('.crit-price');
    const critLvlEl = document.querySelector('.crit-lvl');
    if (critChanceEl) critChanceEl.textContent = Math.floor(critChance * 10) / 10;
    if (critPriceEl) critPriceEl.textContent = formatNumber(critPrice);
    if (critLvlEl) critLvlEl.textContent = `${critLevel} ур`;

    // Престиж
    const prestigeInfo = document.getElementById('prestigeInfo');
    const prestigeSection = document.getElementById('prestigeSection');
    if (prestigeInfo) {
        prestigeInfo.style.display = prestigeLevel > 0 ? 'flex' : 'none';
        const pLvl = document.querySelector('.prestige-level');
        const pMult = document.querySelector('.prestige-mult');
        if (pLvl) pLvl.textContent = prestigeLevel;
        if (pMult) pMult.textContent = prestigeMultiplier.toFixed(1);
    }
    if (prestigeSection) {
        prestigeSection.style.display = level >= 20 ? 'block' : 'none';
    }

    // Урожай бейдж
    const harvestBadge = document.getElementById('harvestBadge');
    if (harvestBadge) {
        const canPlay = !lastHarvestTime || (Date.now() - lastHarvestTime) >= 3600000;
        harvestBadge.classList.toggle('hidden', !canPlay);
    }

    updateUpgradeButtons();
    updateShopCards();
    renderSkins();
}

function updateUpgradeButtons() {
    const clickBtn = document.getElementById('upgradeClickBtn');
    const revenueBtn = document.getElementById('upgradeRevenueBtn');
    const autoclickerBtn = document.getElementById('upgradeAutoclickerBtn');
    const critBtn = document.getElementById('upgradeCritBtn');

    if (clickBtn) clickBtn.style.opacity = (counter < buttonCost || upLvlBtn >= 35) ? '0.5' : '1';
    if (revenueBtn) revenueBtn.style.opacity = (counter < priceEarnHour) ? '0.5' : '1';
    if (autoclickerBtn) autoclickerBtn.style.opacity = (counter < autoclickerPrice) ? '0.5' : '1';
    if (critBtn) critBtn.style.opacity = (counter < critPrice || critLevel >= 20) ? '0.5' : '1';
}

function updateShopCards() {
    document.querySelectorAll('.shop-card, .marketing-card').forEach(card => {
        const cardType = card.dataset.card;
        if (!cardType || !shopData[cardType]) return;
        const data = shopData[cardType];
        const priceEl = card.querySelector('.card-price, .price-ad');
        if (priceEl && data) card.style.opacity = (counter < data.price) ? '0.5' : '1';
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    if (leftPanel) leftPanel.classList.remove('open-lp');
    if (rightPanel) rightPanel.classList.remove('open-rp');
}

// ===== 3. СОСТОЯНИЕ ИГРЫ =====
const saved = loadGame();

let counter = saved?.counter || 0;
let level = saved?.level || 0;
let levelProgress = saved?.levelProgress || 0;
let clicksForLevelUp = saved?.clicksForLevelUp || calculateClicksForLevel(level);

let energy = saved?.energy || 1500;
let maxEnergy = saved?.maxEnergy || 1500;

let clickPower = saved?.clickPower || 1;
let upLvlBtn = saved?.upLvlBtn || 1;
let buttonCost = saved?.buttonCost || 100;
let progressIncrement = saved?.progressIncrement || 10;

let infoEarnHour = saved?.infoEarnHour || 0;
let priceEarnHour = saved?.priceEarnHour || 100;
let lvlBtnRevenue = saved?.lvlBtnRevenue || 1;

let boostUnit = saved?.boostUnit || 6;
const boostLimit = 6;

let limitPrice = saved?.limitPrice || 2000;
let lvlLimit = saved?.lvlLimit || 1;

let tasks = saved?.tasks || [
    { id: 'tg_click', title: 'Подписаться на Telegram', reward: 5000, completed: false, claimed: false },
    { id: 'click_100', title: 'Сделать 100 тапов', reward: 2000, completed: false, claimed: false, progress: 0 },
    { id: 'buy_upgrade', title: 'Купить 1 улучшение', reward: 3000, completed: false, claimed: false }
];
let totalClicks = saved?.totalClicks || 0;

// ===== НОВЫЕ ФИЧИ — СОСТОЯНИЕ =====
let prestigeLevel = saved?.prestigeLevel || 0;
let prestigeMultiplier = saved?.prestigeMultiplier || 1.0;

let autoclickerLevel = saved?.autoclickerLevel || 0;
let autoclickerPrice = saved?.autoclickerPrice || 5000;

let critLevel = saved?.critLevel || 1;
let critChance = saved?.critChance || 5;
let critPrice = saved?.critPrice || 2000;

let activeSkin = saved?.activeSkin || 'default';
let unlockedSkins = saved?.unlockedSkins || ['default'];

let theme = saved?.theme || 'dark';

let lastHarvestTime = saved?.lastHarvestTime || 0;

// ===== 4. СКИНЫ =====
const skins = [
    { id: 'default', name: 'Обычная', filter: '', unlock: 'start' },
    { id: 'gold', name: 'Золотая', filter: 'skin-gold', unlock: 'level', value: 10 },
    { id: 'diamond', name: 'Алмазная', filter: 'skin-diamond', unlock: 'level', value: 25 },
    { id: 'rainbow', name: 'Радужная', filter: 'skin-rainbow', unlock: 'prestige', value: 1 },
    { id: 'pixel', name: 'Пиксельная', filter: 'skin-pixel', unlock: 'level', value: 40 },
    { id: 'dark', name: 'Тёмная', filter: 'skin-dark', unlock: 'level', value: 50 },
];

function isSkinUnlocked(skin) {
    if (skin.unlock === 'start') return true;
    if (skin.unlock === 'level') return level >= skin.value;
    if (skin.unlock === 'prestige') return prestigeLevel >= skin.value;
    return false;
}

function renderSkins() {
    if (!skinsGrid) return;
    skinsGrid.innerHTML = '';
    skins.forEach(skin => {
        const item = document.createElement('div');
        item.className = 'skin-item';
        if (skin.id === activeSkin) item.classList.add('active');
        if (!isSkinUnlocked(skin)) item.classList.add('locked');

        if (isSkinUnlocked(skin)) {
            const img = document.createElement('img');
            img.src = 'img/kapusta4kNbg.png';
            img.style.filter = skin.id === 'default' ? 'none' : 
                skin.id === 'gold' ? 'sepia(0.6) saturate(2) hue-rotate(-10deg)' :
                skin.id === 'diamond' ? 'brightness(1.2) hue-rotate(180deg)' :
                skin.id === 'rainbow' ? 'saturate(3)' :
                skin.id === 'pixel' ? 'contrast(1.5)' :
                skin.id === 'dark' ? 'brightness(0.5) contrast(1.3)' : 'none';
            item.appendChild(img);
        } else {
            const lock = document.createElement('span');
            lock.className = 'skin-lock';
            lock.textContent = '🔒';
            item.appendChild(lock);
        }

        item.title = skin.name;
        item.addEventListener('click', () => {
            if (isSkinUnlocked(skin)) {
                activeSkin = skin.id;
                const foundSkin = skins.find(s => s.id === activeSkin);
                skinWrapper.className = 'skin-wrapper' + (foundSkin?.filter ? ' ' + foundSkin.filter : '');
                saveGame();
                renderSkins();
                showToast(`Скин: ${skin.name}!`, 'success');
            } else {
                showToast('Скин заблокирован!', 'error');
            }
        });

        skinsGrid.appendChild(item);
    });
}

// ===== 5. ТЕМА =====
function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    if (label) label.textContent = theme === 'dark' ? 'Тёмная' : 'Светлая';
}

const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        theme = theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveGame();
    });
}

// ===== 6. КОМБО =====
let comboCount = 0;
let comboTimer = null;
let comboMultiplier = 1;
const COMBO_TIMEOUT = 2000;

function updateCombo() {
    comboCount++;
    if (comboCount >= 3) {
        comboMultiplier = Math.min(5, 1 + Math.floor(comboCount / 3) * 0.5);
        if (comboBar) comboBar.classList.add('active');
        if (comboFill) comboFill.style.width = '100%';
        if (comboText) comboText.textContent = `x${comboMultiplier}`;
    }

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        comboCount = 0;
        comboMultiplier = 1;
        if (comboBar) comboBar.classList.remove('active');
        if (comboFill) comboFill.style.width = '0%';
    }, COMBO_TIMEOUT);
}

// ===== 7. РАНГИ =====
const ranks = [
    { name: "No Rank", threshold: 0 },
    { name: "Бронза", threshold: 10_000 },
    { name: "Серебро", threshold: 50_000 },
    { name: "Золото", threshold: 500_000 },
    { name: "Платина", threshold: 5_000_000 },
    { name: "Алмаз", threshold: 50_000_000 },
    { name: "Элита", threshold: 500_000_000 },
    { name: "Капуста", threshold: Infinity }
];
let currentRankIndex = saved?.currentRankIndex || 0;
const rankElement = document.querySelector('.rank-name');
const changeNumberElement = document.querySelector('.change-number');

function checkRank() {
    let newRankIndex = 0;
    for (let i = 0; i < ranks.length; i++) {
        if (counter >= ranks[i].threshold) newRankIndex = i;
    }
    if (newRankIndex !== currentRankIndex) {
        currentRankIndex = newRankIndex;
        if (rankElement) rankElement.textContent = ranks[currentRankIndex].name;
        const nextRank = ranks[currentRankIndex + 1];
        if (changeNumberElement) changeNumberElement.textContent = nextRank ? formatNumber(nextRank.threshold) : 'MAX';
        showToast(`Новый ранг: ${ranks[currentRankIndex].name}! 🏆`, 'success');
    }
}

function initRank() {
    if (rankElement) rankElement.textContent = ranks[currentRankIndex].name;
    const nextRank = ranks[currentRankIndex + 1];
    if (changeNumberElement) changeNumberElement.textContent = nextRank ? formatNumber(nextRank.threshold) : 'MAX';
}

// ===== 8. КЛИКЕР, ЭНЕРГИЯ, КРИТ, ЧАСТИЦЫ =====
function calculateOfflineEnergy() {
    const lastSave = saved?.lastSaveTime || Date.now();
    const diffMs = Date.now() - lastSave;
    if (diffMs > 3000 && energy < maxEnergy) {
        const regenTicks = Math.floor(diffMs / 3000);
        energy = Math.min(maxEnergy, energy + regenTicks);
    }
}

function regenerateEnergy() {
    if (energy < maxEnergy) { 
        energy++; 
        if (energyUnit) energyUnit.textContent = energy; 
    }
}
setInterval(regenerateEnergy, 3000);

let isTouch = false;
let lastClickTime = 0;

function handleClick(event) {
    const now = Date.now();
    if (now - lastClickTime < 50) return;
    lastClickTime = now;

    if (energy >= clickPower) {
        energy -= clickPower;

        // Критический удар
        const isCrit = Math.random() * 100 < critChance;
        const actualPower = Math.floor(clickPower * prestigeMultiplier * (isCrit ? 10 : 1) * comboMultiplier);
        counter += actualPower;
        totalClicks++;

        // Комбо
        updateCombo();

        // Вибрация
        if (navigator.vibrate) navigator.vibrate(isCrit ? 30 : 15);

        // Координаты
        let x, y;
        if (event.type === 'touchstart') {
            const touch = event.changedTouches[0];
            x = touch.clientX - 20;
            y = touch.clientY - 40;
        } else {
            x = event.clientX - 20;
            y = event.clientY - 40;
        }

        // Частицы + текст
        createParticles(x, y, isCrit ? 24 : 6, isCrit);
        createFloatingText(x, y, `+${formatNumber(actualPower)}`, isCrit);

        // КРИТ: вспышка экрана + усиленный эффект капусты (без toast!)
        if (isCrit) {
            triggerCritFlash();
            if (clickerImg) clickerImg.classList.add('crit-hit');
        }

        // Анимация капусты
        if (counterBtn) counterBtn.classList.add('clicked');
        setTimeout(() => {
            if (counterBtn) counterBtn.classList.remove('clicked');
            if (clickerImg) clickerImg.classList.remove('crit-hit');
        }, 100);

        // Прогресс уровня
        levelProgress += clickPower * comboMultiplier;
        if (levelProgress >= clicksForLevelUp) {
            levelProgress -= clicksForLevelUp;
            level++;
            clicksForLevelUp = calculateClicksForLevel(level);
            if (levelOverlay) levelOverlay.classList.add('active');
            showToast(`Новый уровень: ${level}! 🎉`, 'success');

            if (progressBarInner) {
                progressBarInner.style.transition = 'none';
                progressBarInner.style.width = '100%';
                setTimeout(() => {
                    progressBarInner.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    progressBarInner.style.width = `${(levelProgress / clicksForLevelUp) * 100}%`;
                }, 100);
            }
        }

        checkTaskProgress();
        updateUI();
        checkRank();
    } else {
        showToast('Недостаточно энергии! ⚡', 'error');
    }
}

if (counterBtn) {
    counterBtn.addEventListener('click', function(e) { if (!isTouch) handleClick(e); });
    counterBtn.addEventListener('touchstart', function(e) {
        isTouch = true;
        e.preventDefault();
        handleClick(e);
        setTimeout(() => isTouch = false, 300);
    }, { passive: false });
}

// ===== 9. АВТОКЛИКЕР =====
setInterval(() => {
    if (autoclickerLevel > 0 && energy >= clickPower) {
        const autoclickPower = Math.floor(clickPower * prestigeMultiplier * autoclickerLevel * 0.5);
        energy -= clickPower;
        counter += autoclickPower;
        totalClicks++;

        // Визуальный эффект
        if (counterBtn) counterBtn.classList.add('clicked');
        setTimeout(() => { if (counterBtn) counterBtn.classList.remove('clicked'); }, 100);

        if (clickerImg) {
            const rect = clickerImg.getBoundingClientRect();
            createFloatingText(rect.left + rect.width/2, rect.top, `+${formatNumber(autoclickPower)}`);
        }

        checkTaskProgress();
        updateUI();
        checkRank();
    }
}, 1000);

// ===== 10. УЛУЧШЕНИЯ И БУСТЫ =====
if (btnUpgrade) {
    btnUpgrade.addEventListener('click', () => {
        leftPanel.classList.toggle('open-lp');
        rightPanel.classList.remove('open-rp');
    });
}

const upgradeClickBtn = document.getElementById('upgradeClickBtn');
if (upgradeClickBtn) {
    upgradeClickBtn.addEventListener('click', function() {
        if (upLvlBtn >= 35) return showToast('Максимальный уровень улучшения!', 'error');
        if (counter >= buttonCost) {
            counter -= buttonCost; upLvlBtn++; progressIncrement += 2; clickPower++;
            buttonCost = Math.floor(100 * Math.pow(1.15, upLvlBtn));
            let task = tasks.find(t => t.id === 'buy_upgrade');
            if (task && !task.completed) { task.completed = true; showToast('Задание выполнено! Заберите награду.', 'success'); }
            showToast(`Клик усилен! Теперь +${clickPower} 💪`, 'success');
            saveGame(); updateUI(); renderTasks();
        } else showToast('Недостаточно монет! 💰', 'error');
    });
}

const upgradeRevenueBtn = document.getElementById('upgradeRevenueBtn');
if (upgradeRevenueBtn) {
    upgradeRevenueBtn.addEventListener('click', function() {
        if (counter >= priceEarnHour) {
            counter -= priceEarnHour; lvlBtnRevenue++;
            priceEarnHour = Math.floor(200 * Math.pow(1.80, lvlBtnRevenue));
            let addedIncome = 500 * Math.pow(2, lvlBtnRevenue - 1);
            infoEarnHour += addedIncome;
            showToast(`Доход +${formatNumber(addedIncome)}/час! 📈`, 'success');
            saveGame(); updateUI();
        } else showToast('Недостаточно средств! 💰', 'error');
    });
}

const upgradeAutoclickerBtn = document.getElementById('upgradeAutoclickerBtn');
if (upgradeAutoclickerBtn) {
    upgradeAutoclickerBtn.addEventListener('click', function() {
        if (counter >= autoclickerPrice) {
            counter -= autoclickerPrice;
            autoclickerLevel++;
            autoclickerPrice = Math.floor(5000 * Math.pow(1.5, autoclickerLevel));
            showToast(`Автокликер ${autoclickerLevel} ур! 🤖`, 'success');
            saveGame(); updateUI();
        } else showToast('Недостаточно средств! 💰', 'error');
    });
}

const upgradeCritBtn = document.getElementById('upgradeCritBtn');
if (upgradeCritBtn) {
    upgradeCritBtn.addEventListener('click', function() {
        if (critLevel >= 20) return showToast('Максимальный уровень!', 'error');
        if (counter >= critPrice) {
            counter -= critPrice;
            critLevel++;
            critChance = Math.min(50, 5 + (critLevel - 1) * 2.5);
            critPrice = Math.floor(2000 * Math.pow(1.4, critLevel));
            showToast(`Крит шанс: ${Math.floor(critChance * 10) / 10}%! 💥`, 'success');
            saveGame(); updateUI();
        } else showToast('Недостаточно средств! 💰', 'error');
    });
}

// Пассивный доход
let passiveAccumulated = 0;
setInterval(() => {
    if (infoEarnHour > 0) {
        const perSecond = (infoEarnHour * prestigeMultiplier) / 3600;
        passiveAccumulated += perSecond;
        if (passiveAccumulated >= 1) {
            const add = Math.floor(passiveAccumulated);
            counter += add;
            passiveAccumulated -= add;
            updateUI(); checkRank();
        }
    }
}, 1000);

// Бусты
const boostBtn = document.querySelector('.boost-btn');
if (boostBtn && boostOverlay) {
    boostBtn.addEventListener('click', () => boostOverlay.classList.add('active'));
}

const fullEnergyBtn = document.getElementById('fullEnergyBtn');
if (fullEnergyBtn) {
    fullEnergyBtn.addEventListener('click', function() {
        if (boostUnit > 0) { 
            energy = maxEnergy; 
            boostUnit--; 
            showToast('Энергия восстановлена! ⚡', 'success'); 
            saveGame(); 
            updateUI(); 
        }
        else showToast('Нет бесплатных бустов!', 'error');
    });
}

const energyLimitBtn = document.getElementById('energyLimitBtn');
if (energyLimitBtn) {
    energyLimitBtn.addEventListener('click', function() {
        if (counter >= limitPrice) { 
            counter -= limitPrice; 
            maxEnergy *= 2; 
            limitPrice *= 2; 
            lvlLimit++; 
            showToast(`Лимит энергии увеличен до ${maxEnergy}! 🔋`, 'success'); 
            saveGame(); 
            updateUI(); 
        }
        else showToast('Недостаточно средств!', 'error');
    });
}

// ===== 11. ПРЕСТИЖ =====
const prestigeBtn = document.getElementById('prestigeBtn');
if (prestigeBtn) {
    prestigeBtn.addEventListener('click', () => {
        if (level < 20) return showToast('Нужен 20 уровень!', 'error');
        const newMultEl = document.getElementById('prestigeNewMult');
        if (newMultEl) newMultEl.textContent = (prestigeMultiplier + 0.1).toFixed(1);
        if (prestigeOverlay) prestigeOverlay.classList.add('active');
    });
}

const confirmPrestigeBtn = document.getElementById('confirmPrestigeBtn');
if (confirmPrestigeBtn) {
    confirmPrestigeBtn.addEventListener('click', () => {
        prestigeLevel++;
        prestigeMultiplier += 0.1;

        // Сброс прогресса
        counter = 0;
        level = 0;
        levelProgress = 0;
        clicksForLevelUp = calculateClicksForLevel(0);
        clickPower = 1;
        upLvlBtn = 1;
        buttonCost = 100;
        progressIncrement = 10;
        infoEarnHour = 0;
        priceEarnHour = 100;
        lvlBtnRevenue = 1;
        energy = 1500;
        maxEnergy = 1500;
        boostUnit = 6;
        limitPrice = 2000;
        lvlLimit = 1;
        autoclickerLevel = 0;
        autoclickerPrice = 5000;
        critLevel = 1;
        critChance = 5;
        critPrice = 2000;

        // Сброс магазина
        Object.keys(shopConfig).forEach(key => {
            shopData[key] = {
                price: shopConfig[key].defaultPrice,
                lvl: 1,
                income: shopConfig[key].defaultIncome
            };
        });

        // Обновляем карточки
        document.querySelectorAll('.shop-card, .marketing-card').forEach(card => {
            const cardType = card.dataset.card;
            if (!cardType || !shopData[cardType]) return;
            const data = shopData[cardType];
            const priceEl = card.querySelector('.card-price, .price-ad');
            const lvlEl = card.querySelector('.card-lvl, .ad-lvl');
            const hourEl = card.querySelector('.name-hour');
            if (priceEl) priceEl.textContent = formatNumber(data.price);
            if (lvlEl) lvlEl.textContent = `${data.lvl} ур`;
            if (hourEl) hourEl.textContent = `+${formatNumber(data.income)} в час`;
        });

        saveGame();
        closeAllModals();
        showToast(`Престиж ${prestigeLevel}! Множитель x${prestigeMultiplier.toFixed(1)}! 👑`, 'success');
        updateUI();
    });
}

// ===== 12. МАГАЗИН =====
const shopConfig = {
    garden:   { defaultPrice: 1000,  defaultIncome: 100 },
    cabbage:  { defaultPrice: 500,   defaultIncome: 50 },
    farm:     { defaultPrice: 2000,  defaultIncome: 150 },
    market:   { defaultPrice: 3000,  defaultIncome: 200 },
    shop:     { defaultPrice: 4000,  defaultIncome: 300 },
    online:   { defaultPrice: 5000,  defaultIncome: 500 },
    factory:  { defaultPrice: 8000,  defaultIncome: 800 },
    corp:     { defaultPrice: 10000, defaultIncome: 1000 },
    tv:       { defaultPrice: 2000,  defaultIncome: 500 },
    tiktok:   { defaultPrice: 4000,  defaultIncome: 1000 },
    youtube:  { defaultPrice: 6000,  defaultIncome: 2000 },
    web:      { defaultPrice: 8000,  defaultIncome: 3000 }
};

let shopData = saved?.shopData || {};
function initShopData() {
    Object.keys(shopConfig).forEach(key => {
        if (!shopData[key]) {
            shopData[key] = { price: shopConfig[key].defaultPrice, lvl: 1, income: shopConfig[key].defaultIncome };
        }
    });
}
initShopData();

function initShopCards() {
    document.querySelectorAll('.shop-card, .marketing-card').forEach(card => {
        const cardType = card.dataset.card;
        if (!cardType || !shopConfig[cardType]) return;

        function updateCardUI() {
            const data = shopData[cardType];
            if (!data) return;
            const priceEl = card.querySelector('.card-price, .price-ad');
            const lvlEl = card.querySelector('.card-lvl, .ad-lvl');
            const hourEl = card.querySelector('.name-hour');
            if (priceEl) priceEl.textContent = formatNumber(data.price);
            if (lvlEl) lvlEl.textContent = `${data.lvl} ур`;
            if (hourEl) hourEl.textContent = `+${formatNumber(data.income)} в час`;
        }

        card.addEventListener('click', function() {
            const data = shopData[cardType];
            if (!data) return;
            if (counter >= data.price) {
                counter -= data.price;
                infoEarnHour += data.income;
                data.income *= 2; 
                data.price *= 2; 
                data.lvl++;
                saveGame();
                showToast(`+${formatNumber(data.income / 2)}/час!`, 'success');
                updateCardUI(); 
                updateUI(); 
                checkRank();
            } else {
                showToast('Недостаточно средств! 💰', 'error');
            }
        });
        updateCardUI();
    });
}

// ===== 13. ВКЛАДКИ =====
const tabShop = document.querySelector('.nav-item-one');
const tabMarketing = document.querySelector('.nav-item-two');
const tabOther = document.querySelector('.nav-item-three');
const shopCards = document.querySelectorAll('.shop-card');
const marketingCards = document.querySelectorAll('.marketing-card');
const otherElem = document.querySelector('.other-elem');

function switchTab(activeTab) {
    if (tabShop) tabShop.classList.remove('btn-active');
    if (tabMarketing) tabMarketing.classList.remove('btn-active');
    if (tabOther) tabOther.classList.remove('btn-active');
    shopCards.forEach(c => c.style.display = 'none');
    marketingCards.forEach(c => c.style.display = 'none');
    if (otherElem) otherElem.style.display = 'none';
    if (activeTab === 'shop') { 
        if (tabShop) tabShop.classList.add('btn-active'); 
        shopCards.forEach(c => c.style.display = 'flex'); 
    }
    else if (activeTab === 'marketing') { 
        if (tabMarketing) tabMarketing.classList.add('btn-active'); 
        marketingCards.forEach(c => c.style.display = 'flex'); 
    }
    else { 
        if (tabOther) tabOther.classList.add('btn-active'); 
        if (otherElem) otherElem.style.display = 'block'; 
    }
}
if (tabShop) tabShop.addEventListener('click', () => switchTab('shop'));
if (tabMarketing) tabMarketing.addEventListener('click', () => switchTab('marketing'));
if (tabOther) tabOther.addEventListener('click', () => switchTab('other'));

// ===== 14. ЗАДАНИЯ =====
function renderTasks() {
    if (!tasksList) return;
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';
        let btnText = 'Забрать', btnDisabled = '', btnClass = 'task-btn', progressHtml = '';
        if (task.claimed) { btnText = 'Получено'; btnDisabled = 'disabled'; btnClass += ' completed'; }
        else if (!task.completed) {
            btnText = 'В процессе'; btnDisabled = 'disabled';
            if (task.id === 'click_100' && task.progress !== undefined) {
                const pct = Math.min(100, (task.progress / 100) * 100);
                progressHtml = `<div class="task-progress-bar"><div class="task-progress-fill" style="width:${pct}%"></div></div>`;
            }
        }
        item.innerHTML = `<div class="task-info"><div class="task-title">${task.title}</div><div class="task-reward">+${formatNumber(task.reward)} монет</div>${progressHtml}</div><button class="${btnClass}" data-id="${task.id}" ${btnDisabled}>${btnText}</button>`;
        tasksList.appendChild(item);
    });
    document.querySelectorAll('.task-btn').forEach(btn => {
        btn.addEventListener('click', function() { claimTask(this.getAttribute('data-id')); });
    });
}

function checkTaskProgress() {
    let updated = false;
    tasks.forEach(task => {
        if (task.id === 'click_100' && !task.completed) {
            task.progress = (task.progress || 0) + 1;
            if (task.progress >= 100) { task.completed = true; updated = true; }
        }
    });
    if (updated) { showToast('Задание выполнено! Заберите награду.', 'success'); saveGame(); renderTasks(); }
}

function claimTask(id) {
    let task = tasks.find(t => t.id === id);
    if (task && task.completed && !task.claimed) {
        counter += task.reward; 
        task.claimed = true;
        showToast(`+${formatNumber(task.reward)} монет! 🎁`, 'success');
        saveGame(); 
        updateUI(); 
        renderTasks();
    }
}

if (btnTasks && tasksOverlay) {
    btnTasks.addEventListener('click', () => { tasksOverlay.classList.add('active'); renderTasks(); });
}

// ===== 15. МИНИ-ИГРА УРОЖАЙ =====
let harvestGameActive = false;
let harvestScore = 0;
let harvestTimer = null;
let harvestSpawnInterval = null;

if (btnHarvest && harvestOverlay) {
    btnHarvest.addEventListener('click', () => {
        const canPlay = !lastHarvestTime || (Date.now() - lastHarvestTime) >= 3600000;
        if (!canPlay) {
            const waitMin = Math.ceil((3600000 - (Date.now() - lastHarvestTime)) / 60000);
            showToast(`Урожай через ${waitMin} мин! ⏱`, 'error');
            return;
        }
        harvestOverlay.classList.add('active');
        const harvestResult = document.getElementById('harvestResult');
        const startHarvestBtn = document.getElementById('startHarvestBtn');
        const harvestScoreEl = document.getElementById('harvestScore');
        const harvestTimerEl = document.getElementById('harvestTimer');
        const harvestCooldown = document.getElementById('harvestCooldown');

        if (harvestResult) harvestResult.style.display = 'none';
        if (startHarvestBtn) startHarvestBtn.style.display = 'block';
        if (harvestScoreEl) harvestScoreEl.textContent = '0';
        if (harvestTimerEl) harvestTimerEl.textContent = '15';
        if (harvestCooldown) harvestCooldown.textContent = '';
    });
}

const startHarvestBtn = document.getElementById('startHarvestBtn');
if (startHarvestBtn) {
    startHarvestBtn.addEventListener('click', function() {
        if (harvestGameActive) return;
        this.style.display = 'none';
        harvestGameActive = true;
        harvestScore = 0;
        let timeLeft = 15;
        const area = document.getElementById('harvestArea');
        if (area) area.innerHTML = '';

        harvestTimer = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('harvestTimer');
            if (timerEl) timerEl.textContent = timeLeft;
            if (timeLeft <= 0) endHarvestGame();
        }, 1000);

        harvestSpawnInterval = setInterval(() => {
            if (!harvestGameActive) return;
            if (!area) return;

            const cabbage = document.createElement('img');
            cabbage.src = 'img/kapusta4kNbg.png';
            cabbage.className = 'harvest-cabbage';
            cabbage.alt = '';
            cabbage.draggable = false;
            const duration = 1.5 + Math.random() * 2;
            cabbage.style.left = `${10 + Math.random() * 80}%`;
            cabbage.style.animationDuration = `${duration}s`;

            const onAnimEnd = () => {
                cabbage.removeEventListener('animationend', onAnimEnd);
                if (cabbage.parentNode) cabbage.remove();
            };
            cabbage.addEventListener('animationend', onAnimEnd);

            const removeTimeout = setTimeout(() => {
                if (cabbage.parentNode) cabbage.remove();
            }, duration * 1000 + 500);

            cabbage.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!harvestGameActive) return;
                harvestScore++;
                const scoreEl = document.getElementById('harvestScore');
                if (scoreEl) scoreEl.textContent = harvestScore;
                clearTimeout(removeTimeout);
                this.style.animation = 'none';
                this.style.transform = 'scale(0) rotate(180deg)';
                this.style.transition = 'transform 0.2s';
                setTimeout(() => {
                    if (this.parentNode) this.remove();
                }, 200);
                const rect = this.getBoundingClientRect();
                createParticles(rect.left + 20, rect.top + 20, 4);
            });

            area.appendChild(cabbage);
        }, 600);
    });
}

function endHarvestGame() {
    if (!harvestGameActive) return;
    harvestGameActive = false;
    if (harvestTimer) { clearInterval(harvestTimer); harvestTimer = null; }
    if (harvestSpawnInterval) { clearInterval(harvestSpawnInterval); harvestSpawnInterval = null; }
    const area = document.getElementById('harvestArea');
    if (area) area.innerHTML = '';

    const reward = harvestScore * 100 * prestigeMultiplier;
    counter += reward;
    lastHarvestTime = Date.now();

    const rewardEl = document.getElementById('harvestReward');
    const resultEl = document.getElementById('harvestResult');
    const cooldownEl = document.getElementById('harvestCooldown');

    if (rewardEl) rewardEl.textContent = formatNumber(reward);
    if (resultEl) resultEl.style.display = 'block';
    if (cooldownEl) cooldownEl.textContent = 'Следующий урожай через 1 час';

    saveGame();
    updateUI();
    showToast(`Урожай собран! +${formatNumber(reward)} 🌾`, 'success');
}

// ===== 16. ОБЩИЕ КНОПКИ =====
if (btnShop && rightPanel && leftPanel) {
    btnShop.addEventListener('click', () => { 
        rightPanel.classList.toggle('open-rp'); 
        leftPanel.classList.remove('open-lp'); 
    });
}

document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeAllModals));
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) { if (e.target === this) closeAllModals(); });
});

let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (diff > 50 && leftPanel && leftPanel.classList.contains('open-lp')) leftPanel.classList.remove('open-lp');
    if (diff < -50 && rightPanel && rightPanel.classList.contains('open-rp')) rightPanel.classList.remove('open-rp');
});

if (leftPanel) {
    leftPanel.addEventListener('click', e => { if (e.target === leftPanel) leftPanel.classList.remove('open-lp'); });
}
if (rightPanel) {
    rightPanel.addEventListener('click', e => { if (e.target === rightPanel) rightPanel.classList.remove('open-rp'); });
}

document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const panel = this.closest('.left-panel, .right-panel');
        if (panel) panel.classList.remove('open-lp', 'open-rp');
    });
});

// ===== 17. ОФЛАЙН ДОХОД (фикс #4) =====
function calculateOfflineEarnings() {
    const lastSave = saved?.lastSaveTime || Date.now();
    const diffMs = Date.now() - lastSave;
    if (diffMs > 60000 && infoEarnHour > 0) {
        const diffHours = diffMs / 3600000;
        const cappedHours = Math.min(diffHours, 8);
        const earnings = Math.floor(infoEarnHour * prestigeMultiplier * cappedHours);
        if (earnings > 0) {
            counter += earnings;
            const offlineEarningsEl = document.getElementById('offlineEarnings');
            if (offlineEarningsEl) {
                animateCounter(offlineEarningsEl, 0, earnings, 1200);
            }
            // Показываем время
            const timeText = document.getElementById('offlineTimeText');
            if (timeText) {
                const hours = Math.floor(diffMs / 3600000);
                const mins = Math.floor((diffMs % 3600000) / 60000);
                let timeStr = '';
                if (hours > 0) timeStr += `${hours} ч `;
                if (mins > 0 || hours === 0) timeStr += `${mins} мин`;
                timeText.textContent = `Вы отсутствовали: ${timeStr} · Макс. начисление: 8 ч`;
            }
            if (offlineOverlay) offlineOverlay.classList.add('active');
            createOfflineConfetti();
        }
    }
}

// Анимация счётчика: от start до end за duration мс
function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = '+' + formatNumber(current);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Confetti для офлайн-модалки
function createOfflineConfetti() {
    const container = document.getElementById('offlineConfetti');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#FFCA0A', '#69F279', '#899CE6', '#FF6B6B', '#00d2ff'];
    for (let i = 0; i < 40; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti-piece';
        conf.style.left = `${Math.random() * 100}%`;
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDelay = `${Math.random() * 1.5}s`;
        conf.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
        container.appendChild(conf);
        setTimeout(() => conf.remove(), 4000);
    }
}

// ===== 18. АВТОСЕЙВ =====
setInterval(saveGame, 3000);
window.addEventListener('beforeunload', saveGame);
window.addEventListener('pagehide', saveGame);

// ===== 19. ФОНОВАЯ АНИМАЦИЯ =====
function initBgCabbages() {
    const container = document.getElementById('bgCabbages');
    if (!container) return;
    for (let i = 0; i < 10; i++) {
        const img = document.createElement('img');
        img.src = 'img/kapusta4kNbg.png';
        img.className = 'bg-cabbage';
        img.alt = '';
        img.style.animationDelay = `${i * 1.5}s`;
        img.style.animationDuration = `${13 + Math.random() * 12}s`;
        container.appendChild(img);
    }
}

// ===== 20. ИНИЦИАЛИЗАЦИЯ =====
initBgCabbages();
applyTheme();
calculateOfflineEnergy();
initShopCards();
initRank();
updateUI();
calculateOfflineEarnings();
renderTasks();
switchTab('shop');

if (activeSkin && activeSkin !== 'default' && skinWrapper) {
    const foundSkin = skins.find(s => s.id === activeSkin);
    skinWrapper.className = 'skin-wrapper' + (foundSkin?.filter ? ' ' + foundSkin.filter : '');
}

console.log('🥬 Kapusta Clicker MEGA UPDATE загружен!');
