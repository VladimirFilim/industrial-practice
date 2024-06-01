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
                console.log(clickedImage.width);
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
}

function hideImage() {
    if (!firstCardElement || !secondCardElement) return;

    // Устанавливаем начальные значения для уменьшения ширины
    let initialWidth1 = maxImgWidth;
    let initialWidth2 = maxImgWidth;
    let decreaseWidth1 = true;
    let decreaseWidth2 = true;

    // Запускаем анимацию уменьшения и увеличения ширины для первой карточки
    let animationInterval1 = setInterval(function() {
        if (decreaseWidth1) {
            // Уменьшаем ширину первой карточки
            if (firstCardElement.width > 0) {
                firstCardElement.width -= resizeStep;
            } else {
                // По достижении минимальной ширины меняем направление анимации
                decreaseWidth1 = false;
                // Устанавливаем новый путь для первой карточки
                firstCardElement.setAttribute("src", backImage);
            }
        } else {
            // Увеличиваем ширину первой карточки
            if (firstCardElement.width < maxImgWidth) {
                firstCardElement.width += resizeStep;
            } else {
                // По достижении максимальной ширины завершаем анимацию для первой карточки
                clearInterval(animationInterval1);
                // Сбрасываем состояние первой карточки
                firstCardElement = null;
            }
        }
    }, transitionRate);

    // Запускаем анимацию уменьшения и увеличения ширины для второй карточки
    let animationInterval2 = setInterval(function() {
        if (decreaseWidth2) {
            // Уменьшаем ширину второй карточки
            if (secondCardElement.width > 0) {
                secondCardElement.width -= resizeStep;
            } else {
                // По достижении минимальной ширины меняем направление анимации
                decreaseWidth2 = false;
                // Устанавливаем новый путь для второй карточки
                secondCardElement.setAttribute("src", backImage);
            }
        } else {
            // Увеличиваем ширину второй карточки
            if (secondCardElement.width < maxImgWidth) {
                secondCardElement.width += resizeStep;
            } else {
                // По достижении максимальной ширины завершаем анимацию для второй карточки
                clearInterval(animationInterval2);
                // Сбрасываем состояние второй карточки
                secondCardElement = null;
                // Сбрасываем счетчик кликов
                clickCounter = 0;
                // Обновляем счетчик пар кликов
                clickCounter.innerHTML = `<b>${pairClickCounter}</b>`;
            }
        }
    }, transitionRate);
}