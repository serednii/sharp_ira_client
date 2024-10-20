let controller = new AbortController();
const cancelButton = document.getElementById('cancelButton');
const processingProgress = document.querySelector('.processing-progress')
const processingPercent = document.querySelector('.processing-percent')
const downloadArchive = document.getElementById('download-archive');
downloadArchive.addEventListener('click', function () {
    this.style.display = "none"
    console.log(this)
})

cancelButton.addEventListener('click', () => {
    controller.abort(); // Скасовуємо запит
    console.log('Запит скасовано');

    fetch('http://localhost:8000/download-archive', {
        method: 'GET',
    }).then((res) => {
        console.log('Запит скасовано на сервері')
    }).catch((error) => {
        console.error('Помилка при скасуванні запиту на сервері:', error)
    })
});

cancelButton.addEventListener('click', () => {
    controller.abort(); // Скасовуємо запит
    console.log('Запит скасовано');

    fetch('http://localhost:8000/cancel', {
        method: 'POST',
    }).then((res) => {
        console.log('Запит скасовано на сервері')
    }).catch((error) => {
        console.error('Помилка при скасуванні запиту на сервері:', error)
    })
});



const initProgress = () => {
    fetch('http://localhost:8000/init_progress', {
        method: 'POST',
    }).then((res) => {
        console.log('Запит скасовано на сервері')
    }).catch((error) => {
        console.error('Помилка при скасуванні запиту на сервері:', error)
    })
}


document.addEventListener('DOMContentLoaded', function () {
    const processType = document.getElementById('processType');
    const optionsDivs = document.querySelectorAll('.options');

    const showOptions = (type) => {
        optionsDivs.forEach((div) => div.style.display = 'none');

        switch (type) {
            case 'resize':
                document.getElementById('resizeOptions').style.display = 'block';
                break;
            case 'rotate':
                document.getElementById('rotateOptions').style.display = 'block';
                break;
            case 'blur':
                document.getElementById('blurOptions').style.display = 'block';
                break;
            case 'brightness':
                document.getElementById('brightnessOptions').style.display = 'block';
                break;
            case 'contrast':
                document.getElementById('contrastOptions').style.display = 'block';
                break;
            case 'crop':
                document.getElementById('cropOptions').style.display = 'block';
                break;
        }
    };

    processType.addEventListener('change', (e) => {
        showOptions(e.target.value);
    });

    showOptions(processType.value);
});



document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    initProgress()
    controller = new AbortController();
    const imageInput = document.getElementById('imageInput').files;
    const processType = document.getElementById('processType').value;
    const form = document.getElementById("uploadForm")
    const formData = new FormData(form);
    formData.append('name', imageInput[0].name);
    console.log(formData)

    const resultImagesDiv = document.getElementById('resultImages');
    resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

    checkProcessingStatus()

    try {
        // Відправка даних на сервер через fetch
        const response = await fetch(`http://localhost:8000/upload-multiple`, {
            method: 'POST',
            body: formData,
            signal: controller.signal // Додаємо сигнал скасування
        });

        if (!response.ok) {
            throw new Error('Помилка під час завантаження зображень');
        }

        // Отримання оброблених зображень як Blob
        const blobs = await response.json();

        downloadArchive.href = blobs.downloadLink;
        downloadArchive.style.display = "inline-block"

        blobs.processedImages.forEach((blobUrl) => {
            console.log(blobUrl)
            const li = document.createElement('li'); // Створюємо елемент списку
            const img = document.createElement('img'); // Створюємо елемент зображення
            // const a = document.createElement('a');
            // a.href = blobUrl[0].imageUrl
            // a.target = "blank"
            // a.download = blobUrl[0].fileName;  // Ім'я файлу для завантаження
            // a.textContent = 'Завантажити зображення';  // Текст посилання

            img.src = blobUrl[0].imageBase64;
            img.alt = 'Оброблене зображення';
            img.style.maxWidth = '300px'; // Задаємо розмір для відображення
            // li.appendChild(a)
            li.appendChild(img); // Вставляємо зображення у список
            resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL
            // Автоматичний клік, щоб завантажити файл
            // setTimeout(() => {
            //     // Автоматичний клік для завантаження файлу
            //     a.click;
            // }, 500);  // Невелика затримка в 100 мс
        });
    } catch (error) {
        console.error('Сталася помилка:', error);
    }
});

async function checkProcessingStatus() {
    const interval = setInterval(async () => {
        try {
            const response = await fetch('http://localhost:8000/status');
            if (!response.ok) {
                return
            }

            const status = await response.json();

            const percent = Math.round((100 / status.total) * status.progress);
            processingProgress.style.width = `${percent}%`;
            processingPercent.innerText = `${percent}%`;

            console.log(status, percent)

            if (status.status === 'cancelled') {
                clearInterval(interval);
            }
        } catch (error) {
            console.error('Помилка під час перевірки статусу обробки:', error);
            clearInterval(interval);  // Зупиняємо інтервал у разі помилки
        }

        // Відображаємо прогрес
        // resultImages.innerHTML = ''; // Очищаємо попередні результати
        // for (const jobId in status) {
        //     const { progress, status: jobStatus } = status[jobId];
        //     const li = document.createElement('li');
        //     li.textContent = `Job ID: ${jobId}, Status: ${jobStatus}, Progress: ${progress}%`;
        //     resultImages.appendChild(li);
        // }

        // Якщо всі завдання завершені, зупиняємо перевірку статусу

    }, 100); // Запитуємо статус кожні 2 секунди
}



// document.getElementById('uploadForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const imageInput = document.getElementById('imageInput').files;
//     const processType = document.getElementById('processType').value;
//     const form = document.getElementById("uploadForm")
//     const formData1 = new FormData(form)

//     // Список пар ключ/значение
//     for (let [name, value] of formData1) {
//         console.log(`${name} = ${value}`)
//     }
//     const PORT = 8000; // Зміна порту для кожного сервера
//     if (imageInput.length === 0) {
//         alert('Будь ласка, оберіть хоча б одне зображення для завантаження');
//         return;
//     }

//     // Формуємо форму для відправки
//     const formData = new FormData();
//     for (let i = 0; i < imageInput.length; i++) {
//         formData.append('images', imageInput[i]);
//     }
//     formData.append('processType', processType); // Додаємо вибраний тип обробки
//     console.log(formData)
//     try {
//         // Відправка зображень на сервер через fetch
//         const response = await fetch(`http://localhost:${PORT}/upload-multiple`, {
//             method: 'POST',
//             body: formData
//         });

//         if (!response.ok) {
//             throw new Error('Помилка під час завантаження зображень');
//         }

//         // Отримання оброблених зображень як Blob
//         const blobs = await response.json();
//         const resultImagesDiv = document.getElementById('resultImages');
//         resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

//         blobs.forEach((blobUrl) => {
//             const li = document.createElement('li'); // Створюємо елемент списку
//             const img = document.createElement('img'); // Створюємо елемент зображення
//             img.src = blobUrl;
//             img.alt = 'Оброблене зображення';
//             img.style.maxWidth = '300px'; // Задаємо розмір для відображення
//             li.appendChild(img); // Вставляємо зображення у список
//             resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL
//         });
//     } catch (error) {
//         console.error('Сталася помилка:', error);
//     }
// });



// document.getElementById('uploadForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const imageInput = document.getElementById('imageInput').files;
//     const processType = document.getElementById('processType').value;
//     const servers = ['localhost:8000', 'localhost:8001', 'localhost:8002', 'localhost:8003', 'localhost:8004']; // Список серверів
//     // const servers = ['localhost:8000']; // Список серверів

//     const chunkSize = Math.ceil(imageInput.length / servers.length); // Розмір кожної частини

//     if (imageInput.length === 0) {
//         alert('Будь ласка, оберіть хоча б одне зображення для завантаження');
//         return;
//     }

//     // Формуємо масив зображень
//     const images = Array.from(imageInput);

//     // Розділяємо зображення на частини
//     const chunks = [];
//     for (let i = 0; i < images.length; i += chunkSize) {
//         chunks.push(images.slice(i, i + chunkSize));
//     }

//     // Функція для відправки частини зображень на сервер
//     const sendChunkToServer = async (chunk, server) => {
//         const formData = new FormData();
//         chunk.forEach(image => {
//             formData.append('images', image);
//         });
//         formData.append('processType', processType);

//         const startTime = new Date(); // Зберігаємо початковий час
//         const response = await fetch(`http://${server}/process-images`, {
//             method: 'POST',
//             body: formData
//         });

//         const endTime = new Date(); // Зберігаємо час після відповіді
//         const elapsedTime = endTime - startTime; // Обчислюємо час роботи
//         console.log(`Час роботи сервера ${server}: ${elapsedTime} мс`);

//         if (!response.ok) {
//             throw new Error(`Помилка під час завантаження на ${server}`);
//         }

//         return response.json(); // Повертаємо оброблені зображення
//     };

//     try {
//         // Відправляємо всі частини асинхронно на різні сервери
//         const promises = chunks.map((chunk, index) => {
//             return sendChunkToServer(chunk, servers[index]);
//         });

//         // Чекаємо, поки всі запити завершаться
//         const results = await Promise.all(promises);

//         const resultImagesDiv = document.getElementById('resultImages');
//         resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

//         // Виводимо оброблені зображення
//         results.forEach(blobs => {
//             blobs.forEach(blobUrl => {
//                 const li = document.createElement('li');
//                 const img = document.createElement('img');
//                 img.src = blobUrl;
//                 img.alt = 'Оброблене зображення';
//                 img.style.maxWidth = '300px'; // Задаємо розмір для відображення
//                 li.appendChild(img);
//                 resultImagesDiv.appendChild(li);
//             });
//         });
//     } catch (error) {
//         console.error('Сталася помилка:', error);
//     }
// });
