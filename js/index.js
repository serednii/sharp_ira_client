let controller = new AbortController();
const cancelButton = document.getElementById('cancelButton');
const processingProgress = document.querySelector('.processing-progress')
const processingPercent = document.querySelector('.processing-percent')
const downloadArchive = document.getElementById('download-archive');
const statusDownloading = document.querySelector('.status-downloading');
const urlWorkServer = 'http://localhost:8000'
// const urlWorkServer = 'https://sharpiramainserver-production.up.railway.app'

import './language.js';
import './select_action.js';

let idQuery = null;
let downloadStatus = null
let percentDownloading = null

downloadArchive.addEventListener('click', function () {
    this.style.display = "none"
    console.log(this)
})


cancelButton.addEventListener('click', () => {
    controller.abort(); // Скасовуємо запит
    console.log('Запит скасовано');

    fetch(`${urlWorkServer}/download-archive`, {
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

    fetch(`${urlWorkServer}/cancel`, {
        method: 'POST',
    }).then((res) => {
        console.log('Запит скасовано на сервері')
    }).catch((error) => {
        console.error('Помилка при скасуванні запиту на сервері:', error)
    })
});


const initProgress = async (idQuery) => {
    try {
        const res = await fetch(`${urlWorkServer}/init`, {
            method: 'POST',
            body: JSON.stringify({ idQuery, urlWorkServer }),
            headers: {
                'Content-Type': 'application/json',  // Додаємо заголовок
            },
        });

        if (!res.ok) {
            throw new Error(`Помилка: ${res.status} ${res.statusText}`);
        }

        console.log('Дані ініційовано');
    } catch (error) {
        console.error('Помилка при ініціалізації запиту на сервері:', error);
    }
};


// async function downloadFile(url) {
//     const response = await fetch(url);
//     const totalSize = +response.headers.get('Content-Length'); // Общий размер файла
//     let downloadedSize = 0;

//     const reader = response.body.getReader();
//     const stream = new ReadableStream({
//         async start(controller) {
//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) {
//                     controller.close();
//                     console.log('Скачивание завершено');
//                     break;
//                 }

//                 downloadedSize += value.length;
//                 console.log(`Downloaded: ${(downloadedSize / totalSize * 100).toFixed(2)}%`);

//                 controller.enqueue(value); // Отправляем порцию данных для обработки
//             }
//         }
//     });

//     const newResponse = new Response(stream);
//     const blob = await newResponse.blob();

//     // Создание ссылки для скачивания файла
//     const downloadLink = document.createElement('a');
//     downloadLink.href = URL.createObjectURL(blob);
//     downloadLink.download = 'downloaded_file';
//     downloadLink.click();
// }

// // Начало скачивания файла
// downloadFile('https://example.com/large-file.zip');










//робочий варіант неміняти
// document.getElementById('uploadForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const imageInput = document.getElementById('imageInput').files;
//     const resultImagesDiv = document.getElementById('resultImages');
//     const form = document.getElementById("uploadForm")
//     const formData = new FormData(form);

//     resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

//     idQuery = Math.floor(100000 + Math.random() * 900000)
//     console.log(idQuery)

//     controller = new AbortController();
//     formData.append('name', imageInput[0].name);
//     formData.append('idQuery', idQuery);

//     const res = await initProgress(idQuery)
//     checkProcessingStatus(idQuery)

//     console.log(formData)



//     try {
//         // Відправка даних на сервер через fetch
//         console.log('strat strat strat strat strat strat strat strat ')
//         console.log('strat strat strat strat strat strat strat strat ')
//         console.log('strat strat strat strat strat strat strat strat ')


//         const response = await fetch(`${urlWorkServer}/upload-multiple`, {
//             method: 'POST',
//             body: formData,
//             signal: controller.signal, // Додаємо сигнал скасування
//         });

//         if (!response.ok) {
//             throw new Error('Помилка під час завантаження зображень');
//         }

//         // Отримання оброблених зображень як Blob
//         const blobs = await response.json();
//         console.log('blobs blobs blobs blobs blobs blobs blobs ')
//         console.log('blobs blobs blobs blobs blobs blobs blobs ')
//         console.log('blobs blobs blobs blobs blobs blobs blobs ')


//         statusDownloading.innerText = "Done"
//         downloadArchive.href = blobs.downloadLink;
//         downloadArchive.style.display = "inline-block"

//         blobs.processedImages.forEach((blobUrl) => {
//             console.log(blobUrl)
//             const li = document.createElement('li'); // Створюємо елемент списку
//             const img = document.createElement('img'); // Створюємо елемент зображення
//             img.src = blobUrl[0].imageBase64;
//             img.alt = 'Оброблене зображення';
//             img.style.maxWidth = '300px'; // Задаємо розмір для відображення
//             li.appendChild(img); // Вставляємо зображення у список
//             resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL

//         });
//     } catch (error) {
//         console.error('Сталася помилка:', error);
//     }
// });

//на xhr з контролем загрузки і вигрузки даних
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const imageInput = document.getElementById('imageInput').files;
    const resultImagesDiv = document.getElementById('resultImages');
    const form = document.getElementById("uploadForm")
    const formData = new FormData(form);

    resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

    idQuery = Math.floor(100000 + Math.random() * 900000)
    console.log(idQuery)

    controller = new AbortController();
    formData.append('name', imageInput[0].name);
    formData.append('idQuery', idQuery);

    const res = await initProgress(idQuery)
    checkProcessingStatus(idQuery)

    console.log(formData)


    signal: controller.signal
    try {
        // Відправка даних на сервер через fetch
        console.log('strat strat strat strat strat strat strat strat ')
        console.log('strat strat strat strat strat strat strat strat ')
        console.log('strat strat strat strat strat strat strat strat ')
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${urlWorkServer}/upload-multiple`, true);

        controller.signal.addEventListener('abort', () => {
            xhr.abort();
            console.log('Request aborted');
            statusDownloading.innerText = "Скасовано";
        });

        // Відстеження прогресу завантаження на сервер
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                percentDownloading = parseInt(((event.loaded / event.total) * 100));
                statusDownloading.innerText = `${downloadStatus}  ${percentDownloading}%`;
            }
        });
        // Відправка даних на сервер

        xhr.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                percentDownloading = parseInt(((event.loaded / event.total) * 100));
                statusDownloading.innerText = `${downloadStatus}  ${percentDownloading} %`;
            }
        });
        // Обробка помилок
        xhr.onerror = () => {
            console.error('Помилка завантаження');
            statusDownloading.innerText = "Помилка завантаження";
            throw new Error('Network error');
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const blobs = JSON.parse(xhr.response)
                console.log(blobs)
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                console.log('blobs blobs blobs blobs blobs blobs blobs ')


                statusDownloading.innerText = "Done"
                downloadArchive.href = blobs.downloadLink;
                downloadArchive.style.display = "inline-block"

                blobs.processedImages.forEach((blobUrl) => {
                    console.log(blobUrl)
                    const li = document.createElement('li'); // Створюємо елемент списку
                    const img = document.createElement('img'); // Створюємо елемент зображення
                    img.src = blobUrl[0].imageBase64;
                    img.alt = 'Оброблене зображення';
                    img.style.maxWidth = '300px'; // Задаємо розмір для відображення
                    li.appendChild(img); // Вставляємо зображення у список
                    resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL
                });
                // const link = document.createElement('a');
                // link.href = URL.createObjectURL(blob);
                // link.download = 'processed_images.zip';
                // link.click();
            }
        };


        xhr.send(formData);

        // Отримання оброблених зображень як Blob


    } catch (error) {
        console.error('Сталася помилка:', error);
    }
});











async function checkProcessingStatus(idQuery) {
    const interval = setInterval(async () => {
        console.log('setInterval')
        try {

            const response = await fetch(`${urlWorkServer}/status`, {
                method: 'POST',
                body: JSON.stringify({ idQuery }),
                headers: {
                    'Content-Type': 'application/json',  // Додаємо заголовок
                },
            })

            if (!response.ok) {
                return;
            }

            let result = await response.json();

            // console.log('status', status);
            let percent = Math.round((100 / result.total) * result.progress);

            if (typeof percent !== "number" || Number.isNaN(percent) || percent < 0 || percent > 100) {
                percent = 0;
            }

            processingProgress.style.width = `${percent}%`;
            processingPercent.innerText = `${percent}%`;
            downloadStatus = result.download;
            statusDownloading.innerText = downloadStatus + percentDownloading + " %";
            console.log(result)
            if (result.processingStatus === 'cancelled') {
                clearInterval(interval);
            }

        } catch (error) {
            console.error('Помилка під час перевірки статусу обробки112:', error);
            clearInterval(interval);  // Зупиняємо інтервал у разі помилки
        }

        // Якщо всі завдання завершені, зупиняємо перевірку статусу

    }, 300); // Запитуємо статус кожні 2 секунди
}




