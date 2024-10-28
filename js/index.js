let controller = new AbortController();
let idSetInterval = null;
const cancelButton = document.getElementById('cancelButton');
const downloadArchive = document.getElementById('download-archive');
const serverStopped = document.getElementById('server_stopped');
const pingServers = document.getElementById('ping_servers');
const submit = document.getElementById('submit')
const progressStatus = document.querySelector('.progress__status')
const progressDownload = document.querySelector('.progress__container.download')
const progressProcessing = document.querySelector('.progress__container.processing')
const progressUnloading = document.querySelector('.progress__container.unloading')


// const urlMainServer = 'http://localhost:8000'
// const urlMainServer = 'https://sharpiramainserver-production.up.railway.app'
const urlMainServer = 'https://renewed-peace-production.up.railway.app'

pingServers.addEventListener('click', async () => {
    for (let i = 8100; i <= 8120; i++) {
        try {

            fetch(`http://localhost:${i}/status`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Сервер неотвечает')
                    }
                    return res.json()
                })
                .then(data => {
                    console.log(data.st + " " + 'http://localhost' + i)
                }).catch(() => console.log('Сервер неотвечает' + 'http://localhost' + i + ' error'))

        } catch (error) {
            console.log('http://localhost' + i + 'error')
        }
    }
})


serverStopped.addEventListener('click', async () => {
    try {
        const res = await fetch(`${urlMainServer}/killer`)
        if (!res.ok) {
            throw new Error('При остановке сервера произошла ошибка')
        }
        const data = await res.json()
        console.log(data)

    } catch (error) {
        console.log(error)
    }
})




import './language.js';
import './select_action.js';

let idQuery = 0;
let downloadStatus = "";
let percentDownloading = "";

downloadArchive.addEventListener('click', function () {
    this.style.display = "none";
    console.log(this);
})



cancelButton.addEventListener('click', () => {
    controller.abort(); // Скасовуємо запит
    clearInterval(idSetInterval);
    clearProgress()
    submit.disabled = false;
    console.log('Запит скасовано', idQuery);

    fetch(`${urlMainServer}/abort`, {
        method: 'POST',
        body: JSON.stringify({ idQuery }),
        headers: {
            'Content-Type': 'application/json',  // Додаємо заголовок
        },
    }).then((res) => {
        console.log('Запит скасовано на сервері')
    }).catch((error) => {
        console.error('Помилка при скасуванні запиту на сервері:', error)
    })

});

const initProgress = async (idQuery, numberImage) => {
    try {
        const res = await fetch(`${urlMainServer}/init`, {
            method: 'POST',
            body: JSON.stringify({ idQuery, urlMainServer, numberImage }),
            headers: {
                'Content-Type': 'application/json',  // Додаємо заголовок
            },
        });

        if (!res.ok) {
            throw new Error(`Помилка: ${res.status} ${res.statusText}`);
        }
        return await res.json();

        // console.log('Дані ініційовано');
    } catch (error) {
        alert('Помилка на сервері спробуйте пізніше')
        console.error('Помилка при ініціалізації запиту на сервері:', error);
    }
};

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const imageInput = document.getElementById('imageInput').files;
        const form = document.getElementById("uploadForm")
        const formData = new FormData(form);

        const resultImagesDiv = document.getElementById('resultImages');
        resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

        idQuery = Math.floor(100000 + Math.random() * 900000)
        console.log(idQuery)

        formData.append('name', imageInput[0].name);
        formData.append('idQuery', idQuery);

        console.log(imageInput.length)

        const data = await initProgress(idQuery, imageInput.length)
        console.log(data.message)

        console.log(data.ports)
        if (data.ports >= 1) {
            checkProcessingStatus(idQuery)
            sendData(formData)


        } else {
            alert('Немає вільних серверів, Спробуйте пізніше')
            console.log('Немає вільних серверів')
        }

    } catch (error) {
        console.log(error)
    }

    // signal: controller.signal

});


async function sendData(formData) {
    try {
        const resultImagesDiv = document.getElementById('resultImages');
        resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати
        submit.disabled = true;
        clearProgress();

        // Відправка даних на сервер через fetch
        console.log('strat strat strat strat strat strat strat strat ')
        console.log('strat strat strat strat strat strat strat strat ')
        console.log('strat strat strat strat strat strat strat strat ')
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${urlMainServer}/upload-multiple`, true);

        controller.signal.addEventListener('abort', () => {
            xhr.abort();
            console.log('Request aborted');
            progressStatus.innerText = "Скасовано";
        });

        // Відстеження прогресу завантаження на сервер
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                percentDownloading = parseInt(((event.loaded / event.total) * 100));
                progressStatus.innerText = downloadStatus
                progressUnloading.style.display = "block"
                progressUnloading.children[1].style.width = `${percentDownloading}%`
                progressUnloading.children[2].innerText = `${percentDownloading} %`
            }
        });
        // Відправка даних на сервер

        xhr.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                percentDownloading = parseInt(((event.loaded / event.total) * 100));
                progressStatus.innerText = downloadStatus
                progressDownload.style.display = "block"
                progressDownload.children[1].style.width = `${percentDownloading}%`
                progressDownload.children[2].innerText = `${percentDownloading} %`
                progressProcessing.children[1].style.width = '100%'
                progressProcessing.children[2].innerText = '100 %'
            }
        });

        // Обробка помилок
        xhr.onerror = () => {
            console.error('Помилка завантаження');
            progressStatus.innerText = "Помилка завантаження";
            throw new Error('Network error');
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const blobs = JSON.parse(xhr.response)
                console.log(blobs)
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                submit.disabled = false;

                progressStatus.innerText = "Done"
                downloadArchive.href = blobs.downloadLink;
                downloadArchive.style.display = "block"
                clearInterval(idSetInterval);
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

            }
        };


        xhr.send(formData);

        // Отримання оброблених зображень як Blob


    } catch (error) {
        console.error('Сталася помилка:', error);
    }
}

async function checkProcessingStatus(idQuery) {
    idSetInterval = setInterval(async () => {
        // console.log('setInterval')
        try {

            const response = await fetch(`${urlMainServer}/status`, {
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

            downloadStatus = result.processingStatus;


            if (downloadStatus === "processing images") {
                progressProcessing.style.display = "block"
                progressStatus.innerText = downloadStatus
                progressProcessing.children[1].style.width = `${percent}%`
                progressProcessing.children[2].innerText = `${percent} %`
            }
            console.log(result)



        } catch (error) {
            console.error('Помилка під час перевірки статусу обробки112:', error);
            clearInterval(idSetInterval);  // Зупиняємо інтервал у разі помилки
        }

        // Якщо всі завдання завершені, зупиняємо перевірку статусу

    }, 700); // Запитуємо статус кожні 2 секунди
}


function clearProgress() {
    progressStatus.innerText = "Let's start";

    progressUnloading.style.display = "none";
    progressProcessing.style.display = "none";
    progressDownload.style.display = "none";
    downloadArchive.style.display = "none";

    progressUnloading.children[1].style.width = '0';
    progressUnloading.children[2].innerText = '0%';

    progressProcessing.children[1].style.width = '0';
    progressProcessing.children[2].innerText = '0%';


    progressDownload.children[1].style.width = '0';
    progressDownload.children[2].innerText = '0%';


}
