function indents() {
    const header = document.querySelector('.header');
    const page = document.querySelector('.page');

    //Оступ от шапки
    let hHeader = window.getComputedStyle(header, false).height;
    hHeader = Number(hHeader.slice(0, hHeader.length - 2));
    if (page) {
        page.style.paddingTop = hHeader + 'px';
    }

    //выпадающее меню
    const menuBody = document.querySelector('.menu__body');
    if (menuBody) {
        if (document.documentElement.clientWidth < 991.98) {
            menuBody.style.top = hHeader + 'px';
            menuBody.style.minHeight = `calc(100vh - ${hHeader}px)`;
            menuBody.style.height = `calc(100vh - ${hHeader}px)`;
        } else {
            menuBody.style.top = '0px';
            menuBody.style.minHeight = 'auto';
            menuBody.style.height = 'auto';
        }
    }

}

window.addEventListener('scroll', () => {
    indents();
});

window.addEventListener('resize', () => {
    indents();
});

indents();

//========================================================================================================================================================

//Прикрепить файл

let inputFile = document.querySelector('input[type="file"]');

if (inputFile) {
    const preview = document.querySelector('.previews');
    const fileList = [];

    inputFile.addEventListener('change', onChange);

    function onChange() {
        const file = inputFile.files[0];

        if (file) {
            // --- Удаляем предыдущие файлы и элементы ---
            while (preview.firstChild) {
                preview.removeChild(preview.firstChild);
            }
            fileList.length = 0; // Очищаем массив

            // --- Создаём новый элемент предпросмотра ---
            const item = document.createElement('div');
            item.classList.add('preview');

            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileName.classList.add('file-name');

            const remove = document.createElement('div');
            remove.classList.add('preview-close');

            const fileItem = {
                name: file.name,
                modified: file.lastModified,
                size: file.size
            };

            fileList.push(fileItem);

            // --- Удаление файла ---
            remove.addEventListener('click', () => {
                fileList.splice(fileList.indexOf(fileItem), 1);
                item.classList.add('removing');
                setTimeout(() => {
                    item.remove();
                    // Удаляем класс active, если файлов больше нет
                    if (!preview.querySelector('.preview')) {
                        preview.classList.remove('active');
                    }
                }, 100);
            });

            // --- Добавляем элементы в DOM ---
            item.appendChild(remove);
            item.appendChild(fileName);
            preview.appendChild(item);

            // Добавляем класс active, если есть файл
            preview.classList.add('active');
        }

        // --- Сброс и клонирование input ---
        inputFile.value = '';
        const newInput = inputFile.cloneNode(true);
        inputFile.replaceWith(newInput);
        inputFile = newInput;
        inputFile.addEventListener('change', onChange);
    }
}

//========================================================================================================================================================

const inputs = document.querySelectorAll('input');

function toggleFilledClass(input) {
    if (input.value.trim() !== '') {
        input.classList.add('filled'); // Добавляем класс, если input заполнен
    } else {
        input.classList.remove('filled'); // Удаляем класс, если input пустой
    }
}

inputs.forEach(input => {
    // Проверяем при вводе
    input.addEventListener('input', () => toggleFilledClass(input));

    // Проверяем при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => toggleFilledClass(input));
});

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const line = document.querySelector('.scheme-work__line');
    const lineFill = document.querySelector('.scheme-work__line .line-fill');
    const timeline = document.querySelector('.scheme-work__timeline');
    const topSteps = document.querySelectorAll('.scheme-work__top-steps .scheme-work__step');
    const bottomSteps = document.querySelectorAll('.scheme-work__steps .scheme-work__step');

    if (!line || !lineFill || !timeline || !bottomSteps.length) return;

    // Объединяем верхние и нижние шаги для обработки событий
    const allSteps = [...topSteps, ...bottomSteps];
    const pcBreakpoint = 1330;

    // Функция для установки высоты линии в вертикальном режиме
    const setLineHeight = () => {
        if (window.innerWidth <= pcBreakpoint) {
            const timelineHeight = timeline.offsetHeight;
            line.style.height = `${timelineHeight}px`;
        } else {
            line.style.height = '2px';
        }
    };

    // Функция для получения позиций шагов (горизонтально или вертикально)
    const getStepPositions = (isVertical) => {
        const positions = [];
        bottomSteps.forEach(step => {
            const stepRect = step.getBoundingClientRect();
            const lineRect = line.getBoundingClientRect();
            const circle = step.querySelector('.scheme-work__circle');
            if (!circle) return;

            const circleRect = circle.getBoundingClientRect();

            if (isVertical) {
                const centerY = circleRect.top - lineRect.top + circle.offsetHeight / 2;
                positions.push(centerY);
            } else {
                const centerX = circleRect.left - lineRect.left + circle.offsetWidth / 2;
                positions.push(centerX);
            }
        });
        return positions;
    };

    // Определяем начальную ориентацию
    let isVerticalLayout = window.matchMedia(`(max-width: ${pcBreakpoint}px)`).matches;
    let stepPositions = getStepPositions(isVerticalLayout);

    // Инициализируем высоту линии
    setLineHeight();

    // Сбрасываем начальное состояние line-fill
    if (isVerticalLayout) {
        lineFill.style.height = '0';
        lineFill.style.width = '2px';
    } else {
        lineFill.style.width = '0';
        lineFill.style.height = '2px';
    }

    // Функция для управления активными состояниями нижних шагов
    const activateBottomSteps = (index) => {
        bottomSteps.forEach((step, i) => {
            step.classList.toggle('active', i <= index);
        });
        updateTopStepsActive(index);
    };

    // Функция для управления активными состояниями верхних шагов
    const updateTopStepsActive = (bottomIndex) => {
        if (topSteps[0]) {
            // Первый верхний шаг становится активным только при наведении на 3-й нижний шаг (индекс 2)
            topSteps[0].classList[bottomIndex >= 2 ? 'add' : 'remove']('active');
        }
        if (topSteps[1]) {
            // Второй верхний шаг становится активным при наведении на 5-й нижний шаг (индекс 4)
            topSteps[1].classList[bottomIndex >= 4 ? 'add' : 'remove']('active');
        }
    };

    // Привязываем события ко всем шагам
    allSteps.forEach((step, index) => {
        const mappedIndex = index < topSteps.length ? index : index - topSteps.length;

        step.addEventListener('mouseenter', () => {
            if (mappedIndex < stepPositions.length) {
                if (isVerticalLayout) {
                    lineFill.style.height = `${stepPositions[mappedIndex]}px`;
                    lineFill.style.width = '2px';
                } else {
                    lineFill.style.width = `${stepPositions[mappedIndex]}px`;
                    lineFill.style.height = '2px';
                }

                activateBottomSteps(mappedIndex);
            }
        });

        step.addEventListener('mouseleave', () => {
            if (isVerticalLayout) {
                lineFill.style.height = '0';
            } else {
                lineFill.style.width = '0';
            }

            activateBottomSteps(-1);
        });
    });

    // Обновляем ориентацию и позиции при изменении размера окна
    window.addEventListener('resize', () => {
        isVerticalLayout = window.matchMedia(`(max-width: ${pcBreakpoint}px)`).matches;
        setLineHeight();
        stepPositions = getStepPositions(isVerticalLayout);

        if (isVerticalLayout) {
            lineFill.style.height = '0';
            lineFill.style.width = '2px';
        } else {
            lineFill.style.width = '0';
            lineFill.style.height = '2px';
        }
    });
});