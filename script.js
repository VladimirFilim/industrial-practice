let numRows = 4;
let numCols = 4;
let tableHTML = "";
let clickCounter = 0;
let firstCardImage;
let firstCardElement;
let secondCardElement;
let pairClickCounter = 0;
let tableElement = document.getElementById('gameTable');
let images = [];
let remainingCards = numRows * numCols;

let maxImgWidth = 125;
let maxImgHeight = 125;
let minImgWidth = 0;
let resizeStep = 5;
let transitionRate = 2;

let backImage = 'img/default/back.jpg';
let imageArray = [
    "01", "02", "03", "04",
    "05", "06", "07", "08",
    "01", "02", "03", "04",
    "05", "06", "07", "08"
];

let attemptCounter = 0;
let timerElement = document.getElementById("timer");
let timer = 0;
let timerInterval;
let currentLevelElement = document.getElementById("currentLevel");

function startTimer() {
    timerInterval = setInterval(function() {
        timer++;
        let timerString = timer.toString();
        let coloredTimer = '';
        for (let i = 0; i < timerString.length; i++) {
            coloredTimer += `<span class="digit${timerString[i]}">${timerString[i]}</span>`;
        }
        timerElement.innerHTML = coloredTimer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerElement.textContent = timer;
}

function createTable() {
    let imageIndex = 0;
    for (let i = 0; i < numRows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < numCols; j++) {
            tableHTML += `<td align="center" style="width: 125px;"><img id=${imageIndex} onClick="revealCard()" width="125" height="125"></td>`;
            imageIndex++;
        }
        tableHTML += '</tr>';
    }
    tableElement.innerHTML = tableHTML;

    for (let i = 0; i < numRows * numCols; i++) {
        images[i] = document.getElementById(i);
    }
}

window.onload = createTable;

function startNewGame() {
    clickCounter = 0;
    pairClickCounter = 0;
    attemptCounter = 0; // Сбрасываем счетчик попыток
    document.getElementById("attemptCounter").textContent = attemptCounter;

    resetTimer(); // Сброс таймера
    startTimer(); // Запуск таймера

    let randomImageArray = imageArray.slice(); // Создаем копию массива картинок
    randomImageArray.sort(() => Math.random() - 0.5); // Перемешиваем элементы в случайном порядке

    // Выбираем только нужное количество картинок для игры
    randomImageArray = randomImageArray.slice(0, numRows * numCols);

    for (let i = 0; i < numRows * numCols; i++) {
        let imgPath = "img/default/" + randomImageArray[i] + ".jpg";
        images[i].setAttribute("src", backImage);
        images[i].style.display = "inline";
    }

    clickCounter.innerHTML = `<b>${pairClickCounter}</b>`;
}

function revealCard() {
    clickCounter++;

    if (clickCounter <= 2) {
        let clickedImage = window.event.srcElement;

        if (clickedImage.getAttribute("src") !== backImage) {
            clickCounter--;
            return;
        }

        let borderOfImageWidth = 0;
        let interval = setInterval(function() {
            if (clickedImage.width > borderOfImageWidth) {
                clickedImage.width -= 1;
            } else {
                clearInterval(interval); // Останавливаем интервал после завершения анимации
                let imgPath = "img/default/" + imageArray[clickedImage.id] + ".jpg";
                clickedImage.setAttribute("src", imgPath);

                // Увеличиваем изображение до исходного размера
                let initialWidth = maxImgWidth;
                let increaseInterval = setInterval(function() {
                    if (clickedImage.width < initialWidth) {
                        clickedImage.width += 1;
                    } else {
                        clearInterval(increaseInterval); // Останавливаем интервал после достижения исходного размера
                    }
                }, transitionRate);

                clickedImage.width = 0; // Устанавливаем ширину обратно на 0 для следующей анимации увеличения
            }
        }, transitionRate); // Интервал в миллисекундах для контроля скорости анимации

        if (clickCounter > 1) {
            if (imageArray[clickedImage.id] === firstCardImage) {
                secondCardElement = clickedImage;
                setTimeout(removeImage, 1000);
            } else {
                secondCardElement = clickedImage;
                setTimeout(hideImage, 1000);
            }
        } else {
            pairClickCounter++;
            attemptCounter++;
            firstCardImage = imageArray[clickedImage.id];
            firstCardElement = clickedImage;
        }
    }
}


function removeImage() {
    firstCardElement.style.display = "none";
    secondCardElement.style.display = "none";
    firstCardElement = null;
    clickCounter = 0;
    clickCounter.innerHTML = `<b>${pairClickCounter}</b>`;
    updateAttemptCounter();
    remainingCards -= 2;
    if (remainingCards === 0) {
        endGame();
    }
}

function endGame() {
    stopTimer(); // Останавливаем таймер
    alert(`Game Over! Total Attempts: ${attemptCounter}. Total Time: ${timer} seconds.`);
}

function hideImage() {
    if (!firstCardElement || !secondCardElement) return;

    let initialWidth1 = maxImgWidth;
    let initialWidth2 = maxImgWidth;

    // Уменьшаем ширину карточек
    let animationInterval = setInterval(function() {
        // Уменьшаем ширину первой карточки
        if (firstCardElement.width > 0) {
            firstCardElement.width -= resizeStep;
        }
        // Уменьшаем ширину второй карточки
        if (secondCardElement.width > 0) {
            secondCardElement.width -= resizeStep;
        }

        // Если карточки достигли минимальной ширины
        if (firstCardElement.width <= 0 && secondCardElement.width <= 0) {
            clearInterval(animationInterval); // Останавливаем анимацию

            // Меняем изображение на рубашку
            firstCardElement.setAttribute("src", backImage);
            secondCardElement.setAttribute("src", backImage);

            // Запускаем анимацию увеличения ширины карточек
            animateIncrease();
        }
    }, transitionRate);

    function animateIncrease() {
        let increaseInterval = setInterval(function() {
            // Увеличиваем ширину первой карточки
            if (firstCardElement.width < initialWidth1) {
                firstCardElement.width += resizeStep;
            }
            // Увеличиваем ширину второй карточки
            if (secondCardElement.width < initialWidth2) {
                secondCardElement.width += resizeStep;
            }

            // Если карточки достигли исходной ширины
            if (firstCardElement.width >= initialWidth1 && secondCardElement.width >= initialWidth2) {
                clearInterval(increaseInterval); // Останавливаем анимацию
                firstCardElement = null; // Сбрасываем состояние первой карточки
                secondCardElement = null; // Сбрасываем состояние второй карточки
                clickCounter = 0; // Сбрасываем счетчик кликов
                clickCounter.innerHTML = `<b>${pairClickCounter}</b>`; // Обновляем счетчик пар кликов
            }
        }, transitionRate);
    }
    updateAttemptCounter();
}

function updateAttemptCounter() {
    document.getElementById("attemptCounter").textContent = attemptCounter;
}

function startNewLevel() {
    numCols++; // Увеличить количество столбцов
    currentLevelElement.textContent = `Текущий уровень: ${numRows}x${numCols}`;
    imageArray = generateNewImageArray(); // Создать новый список изображений
    remainingCards = numRows * numCols; // Обновить количество оставшихся карт
    clearTable(); // Очистить предыдущую таблицу
    createTable(); // Создать новую таблицу с обновленными размерами
    startNewGame(); // Начать новую игру
}

function generateNewImageArray() {
    let newImageArray = [];
    // Генерируем новый список изображений для нового уровня
    // Например, здесь вы можете использовать другие имена файлов или добавить новые изображения
    for (let i = 1; i <= numRows * numCols / 2; i++) {
        newImageArray.push(i.toString().padStart(2, "0"));
    }
    // Дублируем каждое изображение, чтобы создать пары
    return newImageArray.concat(newImageArray);
}

function clearTable() {
    tableHTML = ""; // Очистить содержимое таблицы
    tableElement.innerHTML = ""; // Очистить элемент таблицы
}