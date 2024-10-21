// Мовні ресурси
const languageTexts = {
    uk: {
        title: "Завантажте зображення",
        processTypeLabel: "Виберіть тип обробки:",
        brightness: "Яскравість",
        blur: "Розмиття",
        resize: "Змінити розмір",
        grayscale: "Чорно-біле",
        rotate: "Повернути на 90°",
        contrast: "Контраст",
        crop: "Обрізати",
        upload: "Завантажити",
        cancel: "Скасувати обробку",
        progress: "Прогрес",
        download: "Завантажити архів",
        resultTitle: "Результат:",
        chooseLanguage: "Виберіть мову",  // Додано
    },
    en: {
        title: "Upload Images",
        processTypeLabel: "Choose process type:",
        brightness: "Brightness",
        blur: "Blur",
        resize: "Resize",
        grayscale: "Grayscale",
        rotate: "Rotate 90°",
        contrast: "Contrast",
        crop: "Crop",
        upload: "Upload",
        cancel: "Cancel Processing",
        progress: "Progress",
        download: "Download Archive",
        resultTitle: "Result:",
        chooseLanguage: "Choose language",  // Додано
    },
    cz: {
        title: "Nahrát obrázky",
        processTypeLabel: "Vyberte typ zpracování:",
        brightness: "Jas",
        blur: "Rozmazání",
        resize: "Změnit velikost",
        grayscale: "Černobílý",
        rotate: "Otočit o 90°",
        contrast: "Kontrast",
        crop: "Oříznout",
        upload: "Nahrát",
        cancel: "Zrušit zpracování",
        progress: "Průběh",
        download: "Stáhnout archiv",
        resultTitle: "Výsledek:",
        chooseLanguage: "Vyberte jazyk",  // Додано
    },
};

// Функція для зміни мови
function changeLanguage(lang) {
    document.querySelector("h1").textContent = languageTexts[lang].title;
    document.querySelector(
        'label[for="processType"]'
    ).textContent = languageTexts[lang].processTypeLabel;
    document.querySelector(
        '#processType option[value="brightness"]'
    ).textContent = languageTexts[lang].brightness;
    document.querySelector('#processType option[value="blur"]').textContent =
        languageTexts[lang].blur;
    document.querySelector(
        '#processType option[value="resize"]'
    ).textContent = languageTexts[lang].resize;
    document.querySelector(
        '#processType option[value="grayscale"]'
    ).textContent = languageTexts[lang].grayscale;
    document.querySelector(
        '#processType option[value="rotate"]'
    ).textContent = languageTexts[lang].rotate;
    document.querySelector(
        '#processType option[value="contrast"]'
    ).textContent = languageTexts[lang].contrast;
    document.querySelector('#processType option[value="crop"]').textContent =
        languageTexts[lang].crop;
    document.querySelector("button[type='submit']").textContent =
        languageTexts[lang].upload;
    document.querySelector("#cancelButton").textContent =
        languageTexts[lang].cancel;
    document.querySelector(".w3-blue").textContent =
        languageTexts[lang].progress;
    document.querySelector("#download-archive").textContent =
        languageTexts[lang].download;
    document.querySelector(".title-result").textContent =
        languageTexts[lang].resultTitle;
    document.querySelector('label[for="languageSelect"]').textContent =
        languageTexts[lang].chooseLanguage; // Додано
}

// Додаємо подію для зміни мови
document.getElementById("languageSelect").addEventListener("change", function () {
    changeLanguage(this.value);
});

// Встановлюємо початкову мову
changeLanguage("uk");
