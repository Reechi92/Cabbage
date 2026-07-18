// ===== 1. DOM ЭЛЕМЕНТЫ =====
const levelCounter = document.querySelector('.level-num');
const counterBtn = document.getElementById('clickerBtn');
const progressBarInner = document.querySelector('.progress-bar-inner');
const titleCounter = document.querySelector('.titleCounter');
const earnTapInt = document.querySelector('.e-tap');
const progressValue = document.getElementById('progressValue');
const infoLvl = document.querySelector('.info-lvl');
const upgradeLvl = document.querySelector('.lvl-text');
const boostTitleCounter = document.querySelector('.boost-titleCounter');

const btnShop = document.getElementById('openShopBtn');
const rightPanel = document.getElementById('rightPanel');
const btnUpgrade = document.getElementById('openUpgradeBtn');
const btnTasks = document.getElementById('openTasksBtn');
const leftPanel = document.getElementById('leftPanel');
const tasksList = document.getElementById('tasksList');

const energyUnit = document.querySelector('.energy-unit');
const energyCapacity = document.querySelector('.energy-capacity');
const earnHour = document.querySelector('.e-hour');

const boostOverlay = document.getElementById('boostModalOverlay');
const tasksOverlay = document.getElementById('tasksModalOverlay');
const levelOverlay = document.getElementById('myModalOverlay');
const offlineOverlay = document.getElementById('offlineModalOverlay');

// ===== 2. УТИЛИТЫ =====

// Формула роста сложности уровней
function calculateClicksForLevel(lvl) {
    const LEVEL_BASE_CLICKS = 10;
    const LEVEL_GROWTH = 1.3;
    return Math.floor(LEVEL_BASE_CLICKS * Math.pow(LEVEL_GROWTH, lvl));
}

function formatNumber(value) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1).replace('.0', '') + 'k';
    return value.toString();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (type === 'error') toast.style.borderColor = '#ff6b6b';
    if (type === 'success') toast.style.borderColor = '#69F279';
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function createFloatingText(x, y, text) {
    const floatText = document.createElement('div');
    floatText.className = 'float-text';
    floatText.textContent = text;
    floatText.style.left = `${x}px`;
    floatText.style.top = `${y}px`;
    document.body.appendChild(floatText);
    setTimeout(() => floatText.remove(), 1000);
}

function saveGame() {
    const data = {
        counter, level, levelProgress, clicksForLevelUp, energy, maxEnergy,
        clickPower, upLvlBtn, buttonCost, progressIncrement,
        infoEarnHour, priceEarnHour, lvlBtnRevenue,
        boostUnit, limitPrice, lvlLimit,
        tasks, totalClicks, currentRankIndex,
        lastSaveTime: Date.now()
    };
    localStorage.setItem('kapustaSave', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('kapustaSave');
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
        return null;
    }
}

function updateUI() {
    titleCounter.textContent = formatNumber(counter);
    boostTitleCounter.textContent = formatNumber(counter);
    levelCounter.textContent = level;
    infoLvl.textContent = `Ваш уровень ${level}`;

    // Новый прогресс-бар: отношение текущих кликов к нужным
    const progressPercent = Math.min(100, (levelProgress / clicksForLevelUp) * 100);
    progressBarInner.style.width = `${progressPercent}%`;

    // Обновляем текст прогресса
    const progressText = document.getElementById('progressBarText');
    if (progressText) {
        progressText.textContent = `${formatNumber(levelProgress)} / ${formatNumber(clicksForLevelUp)}`;
    }

    earnTapInt.textContent = formatNumber(clickPower);
    progressValue.textContent = `+${progressIncrement}`;
    upgradeLvl.textContent = `${upLvlBtn} ур`;
    document.querySelector('.price-text').textContent = formatNumber(buttonCost);
    earnHour.textContent = formatNumber(infoEarnHour);
    energyUnit.textContent = energy;
    energyCapacity.textContent = maxEnergy;
    document.querySelector('.boost-unit').textContent = boostUnit;
    document.querySelector('.limit-price').textContent = formatNumber(limitPrice);
    document.querySelector('.lvl-limit').textContent = lvlLimit + ' lvl';

    // Обновляем состояние кнопок улучшений
    updateUpgradeButtons();
    // Обновляем состояние карточек магазина
    updateShopCards();
}

function updateUpgradeButtons() {
    const clickBtn = document.getElementById('upgradeClickBtn');
    const revenueBtn = document.getElementById('upgradeRevenueBtn');

    if (clickBtn) {
        if (counter < buttonCost || upLvlBtn >= 35) {
            clickBtn.style.opacity = '0.5';
        } else {
            clickBtn.style.opacity = '1';
        }
    }
    if (revenueBtn) {
        if (counter < priceEarnHour) {
            revenueBtn.style.opacity = '0.5';
        } else {
            revenueBtn.style.opacity = '1';
        }
    }
}

function updateShopCards() {
    document.querySelectorAll('.shop-card, .marketing-card').forEach(card => {
        const priceEl = card.querySelector('.card-price, .price-ad');
        if (priceEl) {
            const priceText = priceEl.textContent;
            let price = parseInt(priceText.replace(/[^0-9]/g, ''));
            if (priceText.includes('K')) price *= 1000;
            if (counter < price) {
                card.style.opacity = '0.5';
            } else {
                card.style.opacity = '1';
            }
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
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

// ===== 4. РАНГИ =====
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
        rankElement.textContent = ranks[currentRankIndex].name;
        const nextRank = ranks[currentRankIndex + 1];
        changeNumberElement.textContent = nextRank ? formatNumber(nextRank.threshold) : 'MAX';
        showToast(`Новый ранг: ${ranks[currentRankIndex].name}! 🏆`, 'success');
    }
}

function initRank() {
    rankElement.textContent = ranks[currentRankIndex].name;
    const nextRank = ranks[currentRankIndex + 1];
    changeNumberElement.textContent = nextRank ? formatNumber(nextRank.threshold) : 'MAX';
}

// ===== 5. КЛИКЕР И ЭНЕРГИЯ =====
// Восстановление энергии офлайн
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
        energyUnit.textContent = energy;
    }
}
setInterval(regenerateEnergy, 3000);

// Обработчик кликов — поддержка и touch, и mouse
let isTouch = false;
let lastClickTime = 0;

function handleClick(event) {
    const now = Date.now();
    if (now - lastClickTime < 50) return; // Дебаунс 50мс
    lastClickTime = now;

    if (energy >= clickPower) {
        energy -= clickPower;
        counter += clickPower;
        totalClicks++;

        // Вибрация
        if (navigator.vibrate) navigator.vibrate(15);

        // Координаты для floating text
        let x, y;
        if (event.type === 'touchstart') {
            const touch = event.changedTouches[0];
            x = touch.clientX - 20;
            y = touch.clientY - 40;
        } else {
            x = event.clientX - 20;
            y = event.clientY - 40;
        }
        createFloatingText(x, y, `+${formatNumber(clickPower)}`);

        // Анимация капусты
        counterBtn.classList.add('clicked');
        setTimeout(() => counterBtn.classList.remove('clicked'), 100);

        // Прогресс уровня — накапливаем клики
        levelProgress += clickPower;
        if (levelProgress >= clicksForLevelUp) {
            levelProgress -= clicksForLevelUp;
            level++;
            // Пересчитываем клики для следующего уровня
            clicksForLevelUp = calculateClicksForLevel(level);
            levelOverlay.classList.add('active');
            showToast(`Новый уровень: ${level}! 🎉`, 'success');

            // Эффект вспышки прогресс-бара
            progressBarInner.style.transition = 'none';
            progressBarInner.style.width = '100%';
            setTimeout(() => {
                progressBarInner.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                progressBarInner.style.width = `${(levelProgress / clicksForLevelUp) * 100}%`;
            }, 100);
        }

        // Показать progress value
        progressValue.classList.add('show');
        setTimeout(() => progressValue.classList.remove('show'), 280);

        checkTaskProgress();
        updateUI();
        checkRank();
    } else {
        showToast('Недостаточно энергии! ⚡', 'error');
    }
}

counterBtn.addEventListener('click', function(e) {
    if (!isTouch) handleClick(e);
});

counterBtn.addEventListener('touchstart', function(e) {
    isTouch = true;
    e.preventDefault(); // Предотвращаем ghost click
    handleClick(e);
    setTimeout(() => isTouch = false, 300);
}, { passive: false });

// ===== 6. УЛУЧШЕНИЯ И БУСТЫ =====
btnUpgrade.addEventListener('click', () => {
    leftPanel.classList.toggle('open-lp');
    rightPanel.classList.remove('open-rp');
});

document.getElementById('upgradeClickBtn').addEventListener('click', function() {
    if (upLvlBtn >= 35) return showToast('Максимальный уровень улучшения!', 'error');
    if (counter >= buttonCost) {
        counter -= buttonCost;
        upLvlBtn++;
        progressIncrement += 2;
        clickPower++;
        buttonCost = Math.floor(100 * Math.pow(1.15, upLvlBtn));

        let task = tasks.find(t => t.id === 'buy_upgrade');
        if (task && !task.completed) {
            task.completed = true;
            showToast('Задание выполнено! Заберите награду.', 'success');
        }

        showToast(`Клик усилен! Теперь +${clickPower} 💪`, 'success');
        updateUI();
        renderTasks();
    } else {
        showToast('Недостаточно монет! 💰', 'error');
    }
});

document.getElementById('upgradeRevenueBtn').addEventListener('click', function() {
    if (counter >= priceEarnHour) {
        counter -= priceEarnHour;
        lvlBtnRevenue++;
        priceEarnHour = Math.floor(200 * Math.pow(1.80, lvlBtnRevenue));
        let addedIncome = 500 * Math.pow(2, lvlBtnRevenue - 1);
        infoEarnHour += addedIncome;
        document.querySelector('.number-hour').textContent = formatNumber(addedIncome);
        document.querySelector('.price-hour').textContent = formatNumber(priceEarnHour);
        document.querySelector('.lvl-revenue').textContent = `${lvlBtnRevenue} ур`;
        showToast(`Доход +${formatNumber(addedIncome)}/час! 📈`, 'success');
        updateUI();
    } else {
        showToast('Недостаточно средств! 💰', 'error');
    }
});

// Пассивный доход — раз в секунду (визуально), начисление раз в час
let passiveAccumulated = 0;
setInterval(() => {
    if (infoEarnHour > 0) {
        const perSecond = infoEarnHour / 3600;
        passiveAccumulated += perSecond;
        if (passiveAccumulated >= 1) {
            const add = Math.floor(passiveAccumulated);
            counter += add;
            passiveAccumulated -= add;
            updateUI();
            checkRank();
        }
    }
}, 1000);

// Буст модалка
document.querySelector('.boost-btn').addEventListener('click', () => {
    boostOverlay.classList.add('active');
});

// Full Energy
document.getElementById('fullEnergyBtn').addEventListener('click', function() {
    if (boostUnit > 0) {
        energy = maxEnergy;
        boostUnit--;
        showToast('Энергия восстановлена! ⚡', 'success');
        updateUI();
    } else {
        showToast('Нет бесплатных бустов!', 'error');
    }
});

// Energy Limit
document.getElementById('energyLimitBtn').addEventListener('click', function() {
    if (counter >= limitPrice) {
        counter -= limitPrice;
        maxEnergy *= 2;
        limitPrice *= 2;
        lvlLimit++;
        showToast(`Лимит энергии увеличен до ${maxEnergy}! 🔋`, 'success');
        updateUI();
    } else {
        showToast('Недостаточно средств!', 'error');
    }
});

// ===== 7. МАГАЗИН =====
const shopConfig = {
    garden:   { defaultPrice: 1000, defaultIncome: 100, keys: { price: 'cardPrice', lvl: 'cardLvl', income: 'nameHourValue' } },
    cabbage:  { defaultPrice: 500,  defaultIncome: 50,  keys: { price: 'cardTwoPrice', lvl: 'cardTwoLvl', income: 'HourTwoValue' } },
    farm:     { defaultPrice: 2000, defaultIncome: 150, keys: { price: 'cardThreePrice', lvl: 'cardThreeLvl', income: 'HourThreeValue' } },
    market:   { defaultPrice: 3000, defaultIncome: 200, keys: { price: 'cardFourPrice', lvl: 'cardFourLvl', income: 'HourFourValue' } },
    shop:     { defaultPrice: 4000, defaultIncome: 300, keys: { price: 'cardFivePrice', lvl: 'cardFiveLvl', income: 'HourFiveValue' } },
    online:   { defaultPrice: 5000, defaultIncome: 500, keys: { price: 'cardSixPrice', lvl: 'cardSixLvl', income: 'HourSixValue' } },
    factory:  { defaultPrice: 8000, defaultIncome: 800, keys: { price: 'cardSevenPrice', lvl: 'cardSevenLvl', income: 'HourSevenValue' } },
    corp:     { defaultPrice: 10000, defaultIncome: 1000, keys: { price: 'cardEightPrice', lvl: 'cardEightLvl', income: 'HourEightValue' } },
    tv:       { defaultPrice: 2000, defaultIncome: 500, keys: { price: 'PriceOBtnM', lvl: 'LvlOBtnM', income: 'HourOBtnM' } },
    tiktok:   { defaultPrice: 4000, defaultIncome: 1000, keys: { price: 'PriceTBtnM', lvl: 'LvlTBtnM', income: 'HourTBtnM' } },
    youtube:  { defaultPrice: 6000, defaultIncome: 2000, keys: { price: 'PriceThreBtnM', lvl: 'LvlThreBtnM', income: 'HourThreBtnM' } },
    web:      { defaultPrice: 8000, defaultIncome: 3000, keys: { price: 'PriceFBtnM', lvl: 'LvlFBtnM', income: 'HourFBtnM' } }
};

function initShopCards() {
    document.querySelectorAll('.shop-card, .marketing-card').forEach(card => {
        const cardType = card.dataset.card;
        if (!cardType || !shopConfig[cardType]) return;

        const config = shopConfig[cardType];
        const priceEl = card.querySelector('.card-price, .price-ad');
        const lvlEl = card.querySelector('.card-lvl, .ad-lvl');
        const hourEl = card.querySelector('.name-hour');

        // Загружаем из сохранения
        let price = saved?.[config.keys.price] || config.defaultPrice;
        let lvl = saved?.[config.keys.lvl] || 1;
        let income = saved?.[config.keys.income] || config.defaultIncome;

        function updateCardUI() {
            priceEl.textContent = formatNumber(price);
            lvlEl.textContent = `${lvl} ур`;
            hourEl.textContent = `+${formatNumber(income)} в час`;
        }

        card.addEventListener('click', function() {
            if (counter >= price) {
                counter -= price;
                infoEarnHour += income;
                income *= 2;
                price *= 2;
                lvl++;

                // Сохраняем в основное сохранение
                const data = JSON.parse(localStorage.getItem('kapustaSave') || '{}');
                data[config.keys.price] = price;
                data[config.keys.lvl] = lvl;
                data[config.keys.income] = income;
                localStorage.setItem('kapustaSave', JSON.stringify(data));

                showToast(`+${formatNumber(income / 2)}/час! ${card.querySelector('.name-card, .name-ad').textContent}`, 'success');
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

// ===== 8. ВКЛАДКИ =====
const tabShop = document.querySelector('.nav-item-one');
const tabMarketing = document.querySelector('.nav-item-two');
const tabOther = document.querySelector('.nav-item-three');
const shopCards = document.querySelectorAll('.shop-card');
const marketingCards = document.querySelectorAll('.marketing-card');
const otherElem = document.querySelector('.other-elem');

function switchTab(activeTab) {
    [tabShop, tabMarketing, tabOther].forEach(tab => tab.classList.remove('btn-active'));
    shopCards.forEach(c => c.style.display = 'none');
    marketingCards.forEach(c => c.style.display = 'none');
    otherElem.style.display = 'none';

    if (activeTab === 'shop') {
        tabShop.classList.add('btn-active');
        shopCards.forEach(c => c.style.display = 'flex');
    } else if (activeTab === 'marketing') {
        tabMarketing.classList.add('btn-active');
        marketingCards.forEach(c => c.style.display = 'flex');
    } else {
        tabOther.classList.add('btn-active');
        otherElem.style.display = 'block';
    }
}

tabShop.addEventListener('click', () => switchTab('shop'));
tabMarketing.addEventListener('click', () => switchTab('marketing'));
tabOther.addEventListener('click', () => switchTab('other'));
switchTab('shop');

// ===== 9. ЗАДАНИЯ =====
function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';

        let btnText = 'Забрать';
        let btnDisabled = '';
        let btnClass = 'task-btn';
        let progressHtml = '';

        if (task.claimed) {
            btnText = 'Получено';
            btnDisabled = 'disabled';
            btnClass += ' completed';
        } else if (!task.completed) {
            btnText = 'В процессе';
            btnDisabled = 'disabled';

            // Прогресс-бар для задания на клики
            if (task.id === 'click_100' && task.progress !== undefined) {
                const pct = Math.min(100, (task.progress / 100) * 100);
                progressHtml = `<div class="task-progress-bar"><div class="task-progress-fill" style="width:${pct}%"></div></div>`;
            }
        }

        item.innerHTML = `
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-reward">+${formatNumber(task.reward)} монет</div>
                ${progressHtml}
            </div>
            <button class="${btnClass}" data-id="${task.id}" ${btnDisabled}>${btnText}</button>
        `;
        tasksList.appendChild(item);
    });

    document.querySelectorAll('.task-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            claimTask(taskId);
        });
    });
}

function checkTaskProgress() {
    let updated = false;
    tasks.forEach(task => {
        if (task.id === 'click_100' && !task.completed) {
            task.progress = (task.progress || 0) + 1;
            if (task.progress >= 100) {
                task.completed = true;
                updated = true;
            }
        }
    });
    if (updated) {
        showToast('Задание выполнено! Заберите награду.', 'success');
        renderTasks();
    }
}

function claimTask(id) {
    let task = tasks.find(t => t.id === id);
    if (task && task.completed && !task.claimed) {
        counter += task.reward;
        task.claimed = true;
        showToast(`+${formatNumber(task.reward)} монет! 🎁`, 'success');
        updateUI();
        renderTasks();
    }
}

btnTasks.addEventListener('click', () => {
    tasksOverlay.classList.add('active');
    renderTasks();
});

// ===== 10. ОБЩИЕ КНОПКИ =====
btnShop.addEventListener('click', () => {
    rightPanel.classList.toggle('open-rp');
    leftPanel.classList.remove('open-lp');
});

// Закрытие по кнопкам
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

// Закрытие по клику на фон
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) closeAllModals();
    });
});

// Закрытие панелей по свайпу/клику вне
let touchStartX = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    // Свайп влево закрывает левую панель
    if (diff > 50 && leftPanel.classList.contains('open-lp')) {
        leftPanel.classList.remove('open-lp');
    }
    // Свайп вправо закрывает правую панель
    if (diff < -50 && rightPanel.classList.contains('open-rp')) {
        rightPanel.classList.remove('open-rp');
    }
});

// Закрытие панелей при клике вне
leftPanel.addEventListener('click', e => {
    if (e.target === leftPanel) leftPanel.classList.remove('open-lp');
});
rightPanel.addEventListener('click', e => {
    if (e.target === rightPanel) rightPanel.classList.remove('open-rp');
});

// Крестики на панелях (дублируем для надёжности)
document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const panel = this.closest('.left-panel, .right-panel');
        if (panel) {
            panel.classList.remove('open-lp', 'open-rp');
        }
    });
});

// ===== 11. ОФЛАЙН ДОХОД =====
function calculateOfflineEarnings() {
    const lastSave = saved?.lastSaveTime || Date.now();
    const diffMs = Date.now() - lastSave;

    if (diffMs > 60000 && infoEarnHour > 0) {
        const diffHours = diffMs / 3600000;
        const cappedHours = Math.min(diffHours, 8);
        const earnings = Math.floor(infoEarnHour * cappedHours);

        if (earnings > 0) {
            counter += earnings;
            document.getElementById('offlineEarnings').textContent = `+${formatNumber(earnings)}`;
            offlineOverlay.classList.add('active');
            showToast(`Офлайн доход: +${formatNumber(earnings)} 🌙`, 'success');
        }
    }
}

// ===== 12. АВТОСЕЙВ =====
setInterval(saveGame, 3000);

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', saveGame);
window.addEventListener('pagehide', saveGame);

// ===== 13. ФОНОВАЯ АНИМАЦИЯ КАПУСТ =====
function initBgCabbages() {
    const container = document.getElementById('bgCabbages');
    if (!container) return;

    // Генерируем 10 плавающих капуст
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

// ===== 14. КРЕСТИКИ НА ПАНЕЛЯХ =====
function initPanelCloses() {
    document.querySelectorAll('.panel-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.left-panel, .right-panel');
            if (panel) {
                panel.classList.remove('open-lp', 'open-rp');
            }
        });
    });
}

// ===== 15. ИНИЦИАЛИЗАЦИЯ =====
initBgCabbages();
initPanelCloses();
calculateOfflineEnergy();
initShopCards();
initRank();
updateUI();
calculateOfflineEarnings();
renderTasks();

// Скрываем все карточки кроме первой вкладки
switchTab('shop');

console.log('🥬 Kapusta Clicker загружен!');
