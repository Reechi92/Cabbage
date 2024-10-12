const levelCounter = document.querySelector('.level');
const counterBtn = document.querySelector('.counter-btn');
const progressBarInner = document.querySelector('.progress-bar-inner');
const progressBar = document.querySelector('.progress-bar');
const titleCounter = document.querySelector('.titleCounter');
const modal = document.getElementById('myModal');
const closeBtn = document.querySelector('.close');
const earnTapInt = document.querySelector('.e-tap');
const progressValue = document.querySelector('.progress-value');
const infoLvl = document.querySelector('.info-lvl');
const upgradeLvl = document.querySelector('.lvl-text');
const boostTitleCounter = document.querySelector('.boost-titleCounter');
const btnShop = document.querySelector('.btn-shop');
const rightPanel = document.querySelector('.right-panel');



// boost modal btn

const btnModal = document.querySelector('.speed-energy');
const boostModal = document.querySelector('.boost-modal');
const cancelBtn = document.querySelector('.cancel');

btnModal.addEventListener('click', function() {
    boostModal.style.display = 'block';
});

cancelBtn.addEventListener('click', function() {
    boostModal.style.display = 'none';
});

// Energy

const energyUnit = document.querySelector('.energy-unit');
const energyCapacity = document.querySelector('.energy-capacity');
let energy = parseInt(localStorage.getItem('energy')) || 1500;
let maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 1500;

energyUnit.innerHTML = energy;
energyCapacity.innerHTML = maxEnergy;



const btnOpen = document.querySelector('.btn-item');
const leftPanel = document.querySelector('.left-panel');
btnOpen.addEventListener('click', function() {
    leftPanel.classList.toggle('open-lp');
});
// Upgrade

const upgradeBtn = document.querySelector('.upgrade-item');
const priceText = document.querySelector('.price-text');

let upLvlBtn = parseInt(localStorage.getItem('upLvlBtn')) || 1; 

let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let buttonCost = parseInt(localStorage.getItem('buttonCost')) || 100; // Цена кнопки




let counter = parseInt(localStorage.getItem('counter')) || 0;
let level = parseInt(localStorage.getItem('level')) || 0;
let progress = parseInt(localStorage.getItem('progress')) || 0;
let maxProgress = parseInt(localStorage.getItem('maxProgress')) || 100; // Максимальный прогресс
let progressWidth = parseInt(localStorage.getItem('progressWidth')) || 0;
let progressIncrement = parseInt(localStorage.getItem('progressIncrement')) || 1; // Увеличиваем на 10% от 365px при каждом клике база (36.5)
const maxProgressWidth = 365; // Максимальная ширина прогресс-бара

progressBarInner.style.width = `${progress}%`; // Обновляем ширину прогресс-бара
levelCounter.innerHTML = `Уровень: ${level}`; // Обновляем текст счетчика
//titleCounter.innerHTML = `${counter = counter + clickPower}`;
//boostTitleCounter.innerHTML = `${titleCounter}`;
infoLvl.innerHTML = `Ваш уровень ${level}`
progressValue.innerHTML = `+${progressIncrement}`;
earnTapInt.innerHTML = `${progressIncrement}`;


// Функция восполнения энергии
function regenerateEnergy() {
    if (energy < maxEnergy) {
        energy++;
        energyUnit.textContent = energy;
        localStorage.setItem('energy', energy);
    }
}

// Запускаем интервал на восполнение энергии каждые 3 секунды
setInterval(regenerateEnergy, 3000);

// Обновление энергии при клике
counterBtn.addEventListener('click', function () {
    const energyPerClick = clickPower; // Каждый клик отнимает столько энергии, сколько сила клика

    if (energy >= energyPerClick) {
        // Проверяем, хватает ли энергии на клик
        energy -= energyPerClick; // Уменьшаем энергию
        energyUnit.textContent = energy; // Обновляем отображение энергии

        progressWidth += progressIncrement;
        progressBarInner.style.width = `${progressWidth}px`;
        levelCounter.innerHTML = `Уровень: ${level}`;
        titleCounter.innerHTML = `${counter = counter + clickPower}`;
        boostTitleCounter.innerHTML = `${counter}`;

        counterBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            counterBtn.style.transform = 'scale(1)';
        }, 100);

        if (progressWidth >= maxProgressWidth) {
            progressWidth = 0;
            progressBarInner.style.width = `${progressWidth}px`;
            level++;

            modal.style.display = 'block';

            // Сохраняем данные
            localStorage.setItem('counter', counter);
            localStorage.setItem('level', level);
            localStorage.setItem('progressWidth', progressWidth);
        }

        localStorage.setItem('energy', energy);
    } else {
        alert('Недостаточно энергии для клика!');
    }

    // Эффект клика
    function buttonClickEffect() {
        progressValue.classList.add('show');
        setTimeout(() => {
            progressValue.classList.remove('show');
        }, 280);
    }

    buttonClickEffect();
});

boostTitleCounter.innerHTML = `${counter}`;

upgradeBtn.addEventListener('click', function() {
    if (upLvlBtn >= 35) {
        alert('Вы достигли максимального уровня улучшения!');
        return;
    }

    if (counter >= buttonCost) {
        counter -= buttonCost;
        upLvlBtn++;
        progressIncrement++;
        clickPower++;

        // Новая формула для увеличения цены
        buttonCost = Math.floor(100 * Math.pow(1.15, upLvlBtn));

        // Обновляем интерфейс
        titleCounter.innerHTML = `${counter}`;
        upgradeLvl.innerHTML = `${upLvlBtn} ур`;
        earnTapInt.innerHTML = `${clickPower}`;
        priceText.innerHTML = `${formatNumber(buttonCost)}`;
        progressValue.innerHTML = `+${progressIncrement}`;

        // Сохраняем данные в localStorage
        localStorage.setItem('progressIncrement', progressIncrement);
        localStorage.setItem('clickPower', clickPower);
        localStorage.setItem('upLvlBtn', upLvlBtn);
        localStorage.setItem('buttonCost', buttonCost);
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

upgradeLvl.innerHTML = `${upLvlBtn} ур`;
earnTapInt.innerHTML = `${clickPower}`;
priceText.innerHTML = `${formatNumber(buttonCost)}`;
progressValue.innerHTML = `+${progressIncrement}`;
infoLvl.innerHTML = `Ваш уровень ${level+1}`

// Кнопка которая дает прибыль в час

const BtnRevenue = document.querySelector('.revenue-item'); // кнопка
const numberHour = document.querySelector('.number-hour'); // число которое ты получишь если нажмёшь на кнопку
const priceHour = document.querySelector('.price-hour'); // цена кнопки
const lvlRevenue = document.querySelector('.lvl-revenue'); // уровень
const earnHour = document.querySelector('.e-hour'); // табличка которая выводит прибыль в час 

let priceEarnHour = parseInt(localStorage.getItem('priceEarnHour')) || 100; // Цена кнопки
let lvlBtnRevenue = parseInt(localStorage.getItem('lvlBtnRevenue')) || 1; // уровень
let getCoinsHour = parseInt(localStorage.getItem('getCoinsHour')) || 0; // получение прибыли  если ты нажёмешь на кнопку 
let numberHourValue = parseInt(localStorage.getItem('numberHourValue')) || 500; // начальная прибыль на нажатие кнопки (по умолчанию 500)
let infoEarnHour = parseInt(localStorage.getItem('infoEarnHour')) || 0; // табличка которая выводит прибыль в час
let intervalId = null; // ID интервала для автоматического начисления


// Функция для обновления интерфейса
function updateDisplay() {
    priceHour.textContent = formatNumber(priceEarnHour); // Обновляем цену на кнопке
    lvlRevenue.textContent = `${lvlBtnRevenue} ур`; // Обновляем уровень
    earnHour.textContent = formatNumber(infoEarnHour); // Обновляем отображаемую прибыль в час
    numberHour.textContent = formatNumber(numberHourValue); // Обновляем значение прибыли при нажатии на кнопку
    titleCounter.textContent = formatNumber(counter); // Обновляем баланс
}

// Обработчик нажатия на кнопку для повышения уровня и запуска автоматического начисления
BtnRevenue.addEventListener('click', function() {
    if (counter >= priceEarnHour) {
        lvlBtnRevenue++;
        counter -= priceEarnHour;

        // Новая формула для увеличения цены
        priceEarnHour = Math.floor(200 * Math.pow(1.10, lvlBtnRevenue));

        // Плавное увеличение прибыли в час (на 20%)
        getCoinsHour = getCoinsHour === 0 ? 500 : Math.floor(getCoinsHour * 1.2);

        // Увеличиваем начальное значение прибыли с кнопки
        numberHourValue = Math.floor(numberHourValue * 1.2);

        // Обновляем infoEarnHour после нажатия на кнопку
        infoEarnHour = getCoinsHour; // обновляем прибыль в час
        earnHour.textContent = formatNumber(infoEarnHour); // обновляем на экране

        // Сохраняем данные в localStorage
        localStorage.setItem('infoEarnHour', infoEarnHour); // сохраняем прибыль в час
        localStorage.setItem('priceEarnHour', priceEarnHour);
        localStorage.setItem('lvlBtnRevenue', lvlBtnRevenue);
        localStorage.setItem('getCoinsHour', getCoinsHour);
        localStorage.setItem('counter', counter);
        localStorage.setItem('numberHourValue', numberHourValue);

        // Обновляем интерфейс
        updateDisplay();
    } else {
        alert('Недостаточно средств для повышения уровня!');
    }

    // Запуск автоматического начисления прибыли, если ещё не запущено
    if (!intervalId) {
        intervalId = setInterval(() => {
            counter += getCoinsHour;
            localStorage.setItem('counter', counter);
            updateDisplay();
        }, 3600000); // Начисление раз в час
    }
});

// Инициализация значений при загрузке страницы
updateDisplay();


function formatNumber(value) {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1) + 'B'; // Сокращение до миллиарда
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + 'M'; // Сокращение до миллиона
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + 'k'; // Сокращение до тысячи
    } else {
        return value.toString(); // Возвращаем число без изменений
    }
}

// Rank System

const rankElement = document.querySelector('.ranked-table p'); // Элемент ранга
const changeNumberElement = document.querySelector('.change-number'); // Элемент, где показывается количество монет для апа

// Массив рангов и порогов для повышения
const ranks = [
    { name: "No Rank", threshold: 0 },
    { name: "Бронза", threshold: 10_000 },
    { name: "Серебро", threshold: 50_000 },
    { name: "Золото", threshold: 500_000 },
    { name: "Платина", threshold: 5_000_000 },
    { name: "Алмаз", threshold: 50_000_000 },
    { name: "Элита", threshold: 500_000_000 },
    { name: "Капуста", threshold: Infinity } // Бесконечный порог для последнего ранга
];

// Текущий ранг игрока
let currentRankIndex = 0;

// Функция для проверки ранга и обновления интерфейса
function checkRank() {
    // Получаем текущий баланс
    let counter = parseInt(localStorage.getItem('counter')) || 0;

    // Проверяем, можно ли обновить ранг
    if (counter >= ranks[currentRankIndex + 1].threshold) {
        currentRankIndex++; // Повышаем ранг
        rankElement.textContent = ranks[currentRankIndex].name; // Обновляем отображение ранга
        changeNumberElement.textContent = formatNumber(ranks[currentRankIndex + 1].threshold); // Обновляем количество монет для следующего ранга
    }
}

// Обновляем ранговую систему при каждом изменении баланса
setInterval(checkRank, 1000); // Проверяем каждые 1 секунду (можно изменить интервал)

// Функция форматирования чисел
function formatNumber(value) {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(1) + 'B'; // Миллиарды
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + 'M'; // Миллионы
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + 'k'; // Тысячи
    } else {
        return value.toString();
    }
}

// Инициализация при загрузке страницы
rankElement.textContent = ranks[currentRankIndex].name;
changeNumberElement.textContent = formatNumber(ranks[currentRankIndex + 1].threshold);

// button shop

btnShop.addEventListener('click', function() {
    rightPanel.classList.toggle('open-rp');
});

// Full-Energy Btn


// Значения boost
let boostUnit = parseInt(localStorage.getItem('boostUnit')) || 6;
const boostLimit = parseInt(localStorage.getItem('boostLimit')) || 6;

const boostUnitElement = document.querySelector('.boost-unit');
const boostLimitElement = document.querySelector('.boost-limit');

// Функция для обновления энергии
function updateEnergy() {
    energyUnit.textContent = energy;
    energyCapacity.textContent = maxEnergy;

    localStorage.setItem('energy', energy);
    localStorage.setItem('maxEnergy', maxEnergy);
}

// Функция для обновления boostUnit
function updateBoostUnit() {
    boostUnitElement.textContent = boostUnit;
    boostLimitElement.textContent = boostLimit;

    localStorage.setItem('boostUnit', boostUnit);
    localStorage.setItem('boostLimit', boostLimit);
}

// Восстановление энергии
function restoreEnergy() {
    if (boostUnit > 0) {
        energy = maxEnergy; // Восстанавливаем энергию до максимума
      boostUnit--; // Уменьшаем количество boostUnit
      updateEnergy();
      updateBoostUnit();
    } else {
      alert('У вас недостаточно boost-unit для восстановления энергии.');
    }


}

// Восстановление boostUnit раз в 24 часа
function restoreBoostUnit() {
    if (boostUnit < boostLimit) {
      boostUnit++;
      updateBoostUnit();
    }
}
  
// Таймер для восстановления boostUnit каждые 24 часа
setInterval(restoreBoostUnit, 24 * 60 * 60 * 1000); // 24 часа

// Обработчик события для кнопки восстановления энергии
document.querySelector('.energy-btn').addEventListener('click', restoreEnergy);

// Обновление интерфейса при загрузке страницы
updateEnergy();
updateBoostUnit();

// Кнопка усилитель

// Элементы DOM
const limitPriceElement = document.querySelector('.limit-price');
const lvlLimitElement = document.querySelector('.lvl-limit');

// Получение начальных значений
let limitPrice =  parseInt(localStorage.getItem('limitPrice')) || 2000;
let lvlLimit = parseInt(localStorage.getItem('lvlLimit')) || 1;

parseInt(limitPriceElement.textContent.replace('K', '000')); // Преобразование 2K в 2000
parseInt(lvlLimitElement.textContent.replace(' lvl', ''));





// Функция для обновления значений на странице
function updateUI() {
    energyCapacity.textContent = maxEnergy;
  limitPriceElement.textContent = (limitPrice / 1000) + 'K'; // Преобразование обратно в формат K
  lvlLimitElement.textContent = lvlLimit + ' lvl';
}

// Обработчик для кнопки увеличения лимита энергии
document.querySelector('.energylimit-btn').addEventListener('click', function() {
  if (counter >= limitPrice) {
    // Увеличиваем лимит энергии в 2 раза
    maxEnergy *= 2;
    
    // Обновляем цену и уровень
    limitPrice *= 2;
    lvlLimit++;
    
    // Списываем цену с баланса
    counter -= limitPrice;

    // Обновляем интерфейс
    updateUI();
  } else {
    alert('Недостаточно средств на балансе!');
  }

  localStorage.setItem('limitPrice', limitPrice);
  localStorage.setItem('lvlLimit', lvlLimit);
  localStorage.setItem('maxEnergy', maxEnergy);
});

// Обновление интерфейса при загрузке страницы
updateUI();

//                                    МАГАЗИН

//-------------------------------------------------------------------------------------------

// 1 кнопка

const shopCardElement = document.querySelector('.shop-card');
const cardPriceElement = shopCardElement.querySelector('.card-price');
const cardLvlElement = shopCardElement.querySelector('.card-lvl');
const nameHourElement = shopCardElement.querySelector('.name-hour');


let cardPrice = parseInt(localStorage.getItem('cardPrice')) || 1000;
parseInt(cardPriceElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardLvl = parseInt(localStorage.getItem('cardLvl')) || 1;
parseInt(cardLvlElement.textContent.replace(' ур', ''));

let nameHourValue = parseInt(localStorage.getItem('nameHourValue')) || 100;
parseInt(nameHourElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице
function updateUiBtnOne() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    cardPriceElement.textContent = (cardPrice / 1000) + 'K'; // Преобразование обратно в формат K
    cardLvlElement.textContent = cardLvl + ' ур';
    nameHourElement.textContent = `+${nameHourValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
shopCardElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardPrice) {

        counter -= cardPrice;

      // Добавляем значение из name-hour в e-hour
      infoEarnHour = currentEHour + nameHourValue;
  
      // Удваиваем цену и уровень и nameHourValue
      nameHourValue *= 2;
      cardPrice *= 2;
      cardLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnOne();
    } else {
      alert('Недостаточно средств на балансе!');
    }
    
    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardPrice', cardPrice);
    localStorage.setItem('cardLvl', cardLvl);
    localStorage.setItem('nameHourValue', nameHourValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnOne();

// 2 кнопка


const CardTwoElement = document.querySelector('.card-two-js');
const PriceTwoElement = CardTwoElement.querySelector('.card-price-twojs');
const LvlTwoElement = CardTwoElement.querySelector('.card-lvl-twojs');
const HourTwoElement = CardTwoElement.querySelector('.name-hour-twojs');

let cardTwoPrice = parseInt(localStorage.getItem('cardTwoPrice')) || 500;
parseInt(PriceTwoElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardTwoLvl = parseInt(localStorage.getItem('cardTwoLvl')) || 1;
parseInt(LvlTwoElement.textContent.replace(' ур', ''));

let HourTwoValue = parseInt(localStorage.getItem('HourTwoValue')) || 50;
parseInt(HourTwoElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnTwo() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceTwoElement.textContent = (cardTwoPrice / 1000) + 'K';
    LvlTwoElement.textContent = cardTwoLvl + ' ур';
    HourTwoElement.textContent = `+${HourTwoValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardTwoElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardTwoPrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardTwoPrice;

      infoEarnHour = currentEHour + HourTwoValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourTwoValue *= 2;
      cardTwoPrice *= 2;
      cardTwoLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnTwo();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardTwoPrice', cardTwoPrice);
    localStorage.setItem('cardTwoLvl', cardTwoLvl);
    localStorage.setItem('HourTwoValue', HourTwoValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnTwo();

// 3 кнопка

const CardThreeElement = document.querySelector('.card-three-js');
const PriceThreeElement = CardThreeElement.querySelector('.card-price-threejs');
const LvlThreeElement = CardThreeElement.querySelector('.card-lvl-threejs');
const HourThreeElement = CardThreeElement.querySelector('.name-hour-threejs');

let cardThreePrice = parseInt(localStorage.getItem('cardThreePrice')) || 2000;
parseInt(PriceThreeElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardThreeLvl = parseInt(localStorage.getItem('cardThreeLvl')) || 1;
parseInt(LvlThreeElement.textContent.replace(' ур', ''));

let HourThreeValue = parseInt(localStorage.getItem('HourThreeValue')) || 150;
parseInt(HourThreeElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnThree() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceThreeElement.textContent = (cardThreePrice / 1000) + 'K';
    LvlThreeElement.textContent = cardThreeLvl + ' ур';
    HourThreeElement.textContent = `+${HourThreeValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardThreeElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardThreePrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardThreePrice;

      infoEarnHour = currentEHour + HourThreeValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourThreeValue *= 2;
      cardThreePrice *= 2;
      cardThreeLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnThree();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardThreePrice', cardThreePrice);
    localStorage.setItem('cardThreeLvl', cardThreeLvl);
    localStorage.setItem('HourThreeValue', HourThreeValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnThree();

// 4 кнопка

const CardFourElement = document.querySelector('.card-four-js');
const PriceFourElement = CardFourElement.querySelector('.card-price-fourjs');
const LvlFourElement = CardFourElement.querySelector('.card-lvl-fourjs');
const HourFourElement = CardFourElement.querySelector('.name-hour-fourjs');

let cardFourPrice = parseInt(localStorage.getItem('cardFourPrice')) || 3000;
parseInt(PriceFourElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardFourLvl = parseInt(localStorage.getItem('cardFourLvl')) || 1;
parseInt(LvlFourElement.textContent.replace(' ур', ''));

let HourFourValue = parseInt(localStorage.getItem('HourFourValue')) || 200;
parseInt(HourFourElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnFour() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceFourElement.textContent = (cardFourPrice / 1000) + 'K';
    LvlFourElement.textContent = cardFourLvl + ' ур';
    HourFourElement.textContent = `+${HourFourValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardFourElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardFourPrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardFourPrice;

      infoEarnHour = currentEHour + HourFourValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourFourValue *= 2;
      cardFourPrice *= 2;
      cardFourLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnFour();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardFourPrice', cardFourPrice);
    localStorage.setItem('cardFourLvl', cardFourLvl);
    localStorage.setItem('HourFourValue', HourFourValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnFour();

// 5 кнопка

const CardFiveElement = document.querySelector('.card-five-js');
const PriceFiveElement = CardFiveElement.querySelector('.card-price-fivejs');
const LvlFiveElement = CardFiveElement.querySelector('.card-lvl-fivejs');
const HourFiveElement = CardFiveElement.querySelector('.name-hour-fivejs');

let cardFivePrice = parseInt(localStorage.getItem('cardFivePrice')) || 4000;
parseInt(PriceFiveElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardFiveLvl = parseInt(localStorage.getItem('cardFiveLvl')) || 1;
parseInt(LvlFiveElement.textContent.replace(' ур', ''));

let HourFiveValue = parseInt(localStorage.getItem('HourFiveValue')) || 300;
parseInt(HourFiveElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnFive() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceFiveElement.textContent = (cardFivePrice / 1000) + 'K';
    LvlFiveElement.textContent = cardFiveLvl + ' ур';
    HourFiveElement.textContent = `+${HourFiveValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardFiveElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardFivePrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardFivePrice;

      infoEarnHour = currentEHour + HourFiveValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourFiveValue *= 2;
      cardFivePrice *= 2;
      cardFiveLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnFive();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('cardFivePrice', cardFivePrice);
    localStorage.setItem('cardFiveLvl', cardFiveLvl);
    localStorage.setItem('HourFiveValue', HourFiveValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnFive();

// 6 кнопка

const CardSixElement = document.querySelector('.card-six-js');
const PriceSixElement = CardSixElement.querySelector('.card-price-sixjs');
const LvlSixElement = CardSixElement.querySelector('.card-lvl-sixjs');
const HourSixElement = CardSixElement.querySelector('.name-hour-sixjs');

let cardSixPrice = parseInt(localStorage.getItem('cardSixPrice')) || 5000;
parseInt(PriceSixElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardSixLvl = parseInt(localStorage.getItem('cardSixLvl')) || 1;
parseInt(LvlSixElement.textContent.replace(' ур', ''));

let HourSixValue = parseInt(localStorage.getItem('HourSixValue')) || 500;
parseInt(HourSixElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnSix() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceSixElement.textContent = (cardSixPrice / 1000) + 'K';
    LvlSixElement.textContent = cardSixLvl + ' ур';
    HourSixElement.textContent = `+${HourSixValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardSixElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardSixPrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardSixPrice;

      infoEarnHour = currentEHour + HourSixValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourSixValue *= 2;
      cardSixPrice *= 2;
      cardSixLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnSix();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardSixPrice', cardSixPrice);
    localStorage.setItem('cardSixLvl', cardSixLvl);
    localStorage.setItem('HourSixValue', HourSixValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnSix();

// 7 кнSix

const CardSevenElement = document.querySelector('.card-seven-js');
const PriceSevenElement = CardSevenElement.querySelector('.card-price-sevenjs');
const LvlSevenElement = CardSevenElement.querySelector('.card-lvl-sevenjs');
const HourSevenElement = CardSevenElement.querySelector('.name-hour-sevenjs');

let cardSevenPrice = parseInt(localStorage.getItem('cardSevenPrice')) || 8000;
parseInt(PriceSevenElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardSevenLvl = parseInt(localStorage.getItem('cardSevenLvl')) || 1;
parseInt(LvlSevenElement.textContent.replace(' ур', ''));

let HourSevenValue = parseInt(localStorage.getItem('HourSevenValue')) || 800;
parseInt(HourSevenElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnSeven() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceSevenElement.textContent = (cardSevenPrice / 1000) + 'K';
    LvlSevenElement.textContent = cardSevenLvl + ' ур';
    HourSevenElement.textContent = `+${HourSevenValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardSevenElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardSevenPrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardSevenPrice;

      infoEarnHour = currentEHour + HourSevenValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourSevenValue *= 2;
      cardSevenPrice *= 2;
      cardSevenLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnSeven();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardSevenPrice', cardSevenPrice);
    localStorage.setItem('cardSevenLvl', cardSevenLvl);
    localStorage.setItem('HourSevenValue', HourSevenValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnSeven();

// 8 кнопка

const CardEightElement = document.querySelector('.card-eight-js');
const PriceEightElement = CardEightElement.querySelector('.card-price-eightjs');
const LvlEightElement = CardEightElement.querySelector('.card-lvl-eightjs');
const HourEightElement = CardEightElement.querySelector('.name-hour-eightjs');

let cardEightPrice = parseInt(localStorage.getItem('cardEightPrice')) || 10000;
parseInt(PriceEightElement.textContent.replace('K', '000')); // Преобразование 1K в 1000

let cardEightLvl = parseInt(localStorage.getItem('cardEightLvl')) || 1;
parseInt(LvlEightElement.textContent.replace(' ур', ''));

let HourEightValue = parseInt(localStorage.getItem('HourEightValue')) || 1000;
parseInt(HourEightElement.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateUiBtnEight() {
    //eHourElement.textContent = eHour + ' в час';
    //earnHour.textContent = infoEarnHour;
    //earnHour.textContent = formatNumber(infoEarnHour);
    PriceEightElement.textContent = (cardEightPrice / 1000) + 'K';
    LvlEightElement.textContent = cardEightLvl + ' ур';
    HourEightElement.textContent = `+${HourEightValue} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
CardEightElement.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= cardEightPrice) {
      // Добавляем значение из name-hour в e-hour

      counter -= cardEightPrice;

      infoEarnHour = currentEHour + HourEightValue;
  
      // Удваиваем цену и уровень и nameHourValue
      HourEightValue *= 2;
      cardEightPrice *= 2;
      cardEightLvl++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateUiBtnEight();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('cardEightPrice', cardEightPrice);
    localStorage.setItem('cardEightLvl', cardEightLvl);
    localStorage.setItem('HourEightValue', HourEightValue);
});
  
// Обновление интерфейса при загрузке страницы
updateUiBtnEight();


                                    // Маркетинг


const tabShop = document.querySelector('.nav-item-one');

tabShop.classList.add('btn-active');

const MarketingElements = document.querySelectorAll('.marketing-card');

MarketingElements.forEach(function (i) {
    i.classList.add('btn-remove');
});


tabShop.addEventListener('click', function() {
    const shopElements = document.querySelectorAll('.shop-card');
    const MarketingElements = document.querySelectorAll('.marketing-card');

    tabShop.classList.add('btn-active');
    

    MarketingElements.forEach(function (m) {
        m.classList.add('btn-remove');
        m.classList.remove('btn-show');
    });

    shopElements.forEach(function (s) {
        s.classList.add('btn-show');
        s.classList.remove('btn-remove');
    });

    tabMarketing.classList.remove('btn-active');
});

const tabMarketing = document.querySelector('.nav-item-two');

tabMarketing.addEventListener('click', function() {
    const MarketingElements = document.querySelectorAll('.marketing-card');
    const shopElements = document.querySelectorAll('.shop-card');

    tabMarketing.classList.add('btn-active');

    shopElements.forEach(function (i) {
        i.classList.add('btn-remove');
        i.classList.remove('btn-show');
    })

    MarketingElements.forEach(function (i) {
        i.classList.add('btn-show');
        i.classList.remove('btn-remove');
    });

    tabShop.classList.remove('btn-active');
});

// 1 btn

const OneBtnM = document.querySelector('.m-n-js');
const PriceOneBtnM = OneBtnM.querySelector('.p-ad-js');
const LvlOneBtnM = OneBtnM.querySelector('.m-lvl-js');
const HourOneBtnM = OneBtnM.querySelector('.n-h-js');

let PriceOBtnM = parseInt(localStorage.getItem('PriceOBtnM')) || 2000;
parseInt(PriceOneBtnM.textContent.replace('K', '000')); // Преобразование 1K в 1000

let LvlOBtnM = parseInt(localStorage.getItem('LvlOBtnM')) || 1;
parseInt(LvlOneBtnM.textContent.replace(' ур', ''));

let HourOBtnM = parseInt(localStorage.getItem('HourOBtnM')) || 500;
parseInt(HourOneBtnM.textContent.replace(' + ', ''));

// Функция для обновления значений на странице

function updateOneBtnM() {
    PriceOneBtnM.textContent = (PriceOBtnM / 1000) + 'K';
    LvlOneBtnM.textContent = LvlOBtnM + ' ур';
    HourOneBtnM.textContent = `+${HourOBtnM} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
OneBtnM.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= PriceOBtnM) {
      // Добавляем значение из name-hour в e-hour

      counter -= PriceOBtnM;

      infoEarnHour = currentEHour + HourOBtnM;
  
      // Удваиваем цену и уровень и nameHourValue
      HourOBtnM *= 2;
      PriceOBtnM *= 2;
      LvlOBtnM++;
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateOneBtnM();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('PriceOBtnM', PriceOBtnM);
    localStorage.setItem('LvlOBtnM', LvlOBtnM);
    localStorage.setItem('HourOBtnM', HourOBtnM);
});
  
// Обновление интерфейса при загрузке страницы
updateOneBtnM();

// 2 btn

const twoBtnM = document.querySelector('.m-two-js');
const PriceTwoBtnM = twoBtnM.querySelector('.two-price-js');
const LvlTwoBtnM = twoBtnM.querySelector('.two-lvl-js');
const HourTwoBtnM = twoBtnM.querySelector('.two-h-js');

let PriceTBtnM = parseInt(localStorage.getItem('PriceTBtnM')) || 4000;
parseInt(PriceTwoBtnM.textContent.replace('K', '000')); // Преобразование 1K в 1000

let LvlTBtnM = parseInt(localStorage.getItem('LvlTBtnM')) || 1;
parseInt(LvlTwoBtnM.textContent.replace(' ур', ''));

let HourTBtnM = parseInt(localStorage.getItem('HourTBtnM')) || 1000;
parseInt(HourTwoBtnM.textContent.replace(' + ', '000'));

// Функция для обновления значений на странице

function updateTwoBtnM() {
    PriceTwoBtnM.textContent = (PriceTBtnM / 1000) + 'K';
    LvlTwoBtnM.textContent = LvlTBtnM + ' ур';
    HourTwoBtnM.textContent = `+${formatNumber(HourTBtnM)} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
twoBtnM.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= PriceTBtnM) {
      // Добавляем значение из name-hour в e-hour

      counter -= PriceTBtnM;

      infoEarnHour = currentEHour + HourTBtnM;
  
      // Удваиваем цену и уровень и nameHourValue
      HourTBtnM *= 2;
      PriceTBtnM *= 2;
      LvlTBtnM++
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateOneBtnM();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('PriceTBtnM', PriceTBtnM);
    localStorage.setItem('LvlTBtnM', LvlTBtnM);
    localStorage.setItem('HourTBtnM', HourTBtnM);
});
  
// Обновление интерфейса при загрузке страницы
updateTwoBtnM();

// 3 btn

const threeBtnM = document.querySelector('.m-three-js');
const PriceThreeBtnM = threeBtnM.querySelector('.three-price-js');
const LvlThreeBtnM = threeBtnM.querySelector('.three-lvl-js');
const HourThreeBtnM = threeBtnM.querySelector('.three-h-js');

let PriceThreBtnM = parseInt(localStorage.getItem('PriceThreBtnM')) || 6000;
parseInt(PriceThreeBtnM.textContent.replace('K', '000')); // Преобразование 1K в 1000

let LvlThreBtnM = parseInt(localStorage.getItem('LvlThreBtnM')) || 1;
parseInt(LvlThreeBtnM.textContent.replace(' ур', ''));

let HourThreBtnM = parseInt(localStorage.getItem('HourThreBtnM')) || 2000;
parseInt(HourThreeBtnM.textContent.replace(' + ', '000'));

// Функция для обновления значений на странице

function updateThreeBtnM() {
    PriceThreeBtnM.textContent = (PriceThreBtnM / 1000) + 'K';
    LvlThreeBtnM.textContent = LvlThreBtnM + ' ур';
    HourThreeBtnM.textContent = `+${formatNumber(HourThreBtnM)} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
threeBtnM.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= PriceThreBtnM) {
      // Добавляем значение из name-hour в e-hour

      counter -= PriceThreBtnM;

      infoEarnHour = currentEHour + HourThreBtnM;
  
      // Удваиваем цену и уровень и nameHourValue
      HourThreBtnM *= 2;
      PriceThreBtnM *= 2;
      LvlThreBtnM++
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateThreeBtnM();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('PriceThreBtnM', PriceThreBtnM);
    localStorage.setItem('LvlThreBtnM', LvlThreBtnM);
    localStorage.setItem('HourThreBtnM', HourThreBtnM);
});
  
// Обновление интерфейса при загрузке страницы
updateThreeBtnM();

// 4 btn

const fourBtnM = document.querySelector('.m-four-js');
const PriceFourBtnM = fourBtnM.querySelector('.four-price-js');
const LvlFourBtnM = fourBtnM.querySelector('.four-lvl-js');
const HourFourBtnM = fourBtnM.querySelector('.four-h-js');

let PriceFBtnM = parseInt(localStorage.getItem('PriceFBtnM')) || 8000;
parseInt(PriceFourBtnM.textContent.replace('K', '000')); // Преобразование 1K в 1000

let LvlFBtnM = parseInt(localStorage.getItem('LvlFBtnM')) || 1;
parseInt(LvlFourBtnM.textContent.replace(' ур', ''));

let HourFBtnM = parseInt(localStorage.getItem('HourFBtnM')) || 3000;
parseInt(HourFourBtnM.textContent.replace(' + ', '000'));

// Функция для обновления значений на странице

function updateFourBtnM() {
    PriceFourBtnM.textContent = (PriceFBtnM / 1000) + 'K';
    LvlFourBtnM.textContent = LvlFBtnM + ' ур';
    HourFourBtnM.textContent = `+${formatNumber(HourFBtnM)} в час`;
    titleCounter.textContent = counter;
    earnHour.textContent = formatNumber(infoEarnHour);
    localStorage.setItem('infoEarnHour', infoEarnHour);
}

// Обработчик для кнопки shop-card
fourBtnM.addEventListener('click', function() {
    // Получаем значение из name-hour
    //let nameHourValue = parseInt(nameHourElement.textContent.replace(' + ', ''));
    let currentEHour = parseInt(earnHour.textContent) || 0;

    if (counter >= PriceFBtnM) {
      // Добавляем значение из name-hour в e-hour

      counter -= PriceFBtnM;

      infoEarnHour = currentEHour + HourFBtnM;
  
      // Удваиваем цену и уровень и nameHourValue
      HourFBtnM *= 2;
      PriceFBtnM *= 2;
      LvlFBtnM++
      
      // Списываем цену из баланса
      
      
      // Обновляем интерфейс
      updateFourBtnM();
    } else {
      alert('Недостаточно средств на балансе!');
    }

    localStorage.setItem('infoEarnHour', infoEarnHour);
    localStorage.setItem('PriceFBtnM', PriceFBtnM);
    localStorage.setItem('LvlFBtnM', LvlFBtnM);
    localStorage.setItem('HourFBtnM', HourFBtnM);
});
  
// Обновление интерфейса при загрузке страницы
updateFourBtnM();

//-------------------------------------------------------------------------------------------

// Закрытие модального окна
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Закрытие модального окна при клике содержимого
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

//localStorage.clear();
