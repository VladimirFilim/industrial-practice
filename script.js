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

let maxImgWidth = 125;
let maxImgHeight = 125;
let minImgWidth = 0;
let resizeStep = 5;
let transitionRate = 2;

let backImage = 'img/back.jpg';
let imageArray = [
    "image1.jpg", "image2.jpg",
    "image3.jpg", "image4.jpg",
    "image5.jpg", "image6.jpg",
    "image7.jpg", "image8.jpg",
    "image1.jpg", "image2.jpg",
    "image3.jpg", "image4.jpg",
    "image5.jpg", "image6.jpg",
    "image7.jpg", "image8.jpg"
];

let attemptCounter = 0;
let timerElement = document.getElementById("timer");
let timer = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function() {
        timer++;
        timerElement.textContent = timer;
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
            tableHTML += `<td align="center"><img id=${imageIndex} onClick="revealCard()" width="125" height="125"></td>`;
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

    for (let i = 0; i < imageArray.length; i++) {
        let randomIndex = Math.floor(Math.random() * imageArray.length);
        let temp = imageArray[i];
        imageArray[i] = imageArray[randomIndex];
        imageArray[randomIndex] = temp;
    }

    for (let i = 0; i < numRows * numCols; i++) {
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
                let imgPath = "img/" + imageArray[clickedImage.id];
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
