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
const progressTitle = document.querySelector('.progress__title');
const imageInput = document.getElementById('imageInput');
const resultImagesDiv = document.getElementById('resultImages');

// const urlMainServer = 'http://localhost:8000';
// const urlMainServer = 'https://sharpiramainserver-production.up.railway.app'
const urlMainServer = 'https://renewed-peace-production.up.railway.app'


let idQuery = 0;
let downloadStatus = "";
let percentDownloading = "";

import './language.js';
import './select_action.js';


//завантажуємо файли по посиланню яке генерується автоматично коли завантажаться дані
//Прискачаванні файлів архів на сервері видаляється а якщо не скачувати то видалиться через деякий час автоматично
downloadArchive.addEventListener('click', function () {
    //Ховаємо посилання на скачування так як воно вже непотрібне
    this.style.display = "none";
})


//При виборі файлів користувачем перевіряємо їх обєм  
imageInput.addEventListener('change', function () {
    // console.log(this.files)


    //всі файли які ми вибрали
    const files = this.files;
    //Загалтьний обєм в байтах
    const totalSize = Array.from(files).reduce((a, e) => a + e.size, 0)
    //Переводимо в мегабайти
    const totalMb = ((totalSize / 1024) / 1024).toFixed(2);
    //Виводимо на екран
    progressTitle.innerText = `Прогрес totalSize ${totalMb} Mb`;
    console.log(totalSize, totalMb);
    //переввіряємо на максимально допустимий розмір
    // if (totalSize > 42_428_800) {
    //     alert(`Максимальний розмір файлів небільше 40 мега байт а ви вибрали ${totalMb} Mb`)
    //Перезавантажуємо сторінку щоб очистити input
    //     location.reload()
    //     return
    // }
})

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
        const pauseSend = document.getElementById('pause_send')
        console.log(pauseSend.value)


        const res = await fetch(`${urlMainServer}/killer`, {
            method: 'POST',
            body: JSON.stringify({ pause: pauseSend.value }),
            headers: {
                'Content-Type': 'application/json',  // Додаємо заголовок
            },
        })


        if (!res.ok) {
            throw new Error('При остановке сервера произошла ошибка')
        }

        const data = await res.json()
        console.log(data)

    } catch (error) {
        console.log(error)
    }
})





//Відміняємо обробку
cancelButton.addEventListener('click', () => {
    controller.abort(); // Скасовуємо запит
    //Зупиняємо таймер
    clearInterval(idSetInterval);
    //Очишчаємо прогрес та інші поля
    clearProgress()
    //Розблоковуємо кнопку відправки даних
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
        clearProgress()
        //Розблоковуємо кнопку відправки даних
        submit.disabled = false;
        console.error('Помилка при ініціалізації запиту на сервері:', error);
    }
};

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {

        //Дістаємо форму із HTML
        const form = document.getElementById("uploadForm")

        //Створюємо обєкт FormData і передаємо в конструктор форму
        const formData = new FormData(form);

        //Дістаємо елемент UL куди будемо скидувати готові фото
        const resultImagesDiv = document.getElementById('resultImages');
        //Очишщаємо його
        resultImagesDiv.innerHTML = ''; // Очищуємо попередні результат

        //Генеруємо унікальний id код для кожного запиту, щоб розділити запити на сервері
        idQuery = Math.floor(100000 + Math.random() * 900000);
        console.log(idQuery);
        //Додаємо id до даних які пошлемо на сервер
        formData.append('idQuery', idQuery);

        //Відправляємо попередній запит на сервер який нам створить робочі сервера
        //по замовчування на 1 сервер 10 фото
        //Якщо буде вільний хоть один сервер то процес буде дозволено
        //дані можна опрацьовувати і на одному робочому сервері але це буде повільніше
        const responseInit = await initProgress(idQuery, imageInput.files.length);

        //Якщо існує хоть один вільний порт то дозволяємо відправку даних
        if (responseInit.ports >= 1) {
            //Запускємо запити до ендпойнту "/status", який періодично питається у сервера про стан роботи 
            checkProcessingStatus(idQuery);
            //Відправляємо дані
            sendData(formData);
        } else {
            //якщо Немає вільних серверів виводимо повідомлення
            alert('Немає вільних серверів, Спробуйте пізніше');
            //Очишчаємо прогрес та інші поля
            clearProgress();

            submit.disabled = false;
            console.log('Немає вільних серверів')
        }

    } catch (error) {
        console.log(error)
    }

    // signal: controller.signal

});


async function sendData(formData) {
    try {
        resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати
        //Заблоковуємо кнопку відправки даних
        submit.disabled = true;
        clearProgress();

        // Відправка даних на сервер через fetch
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
        xhr.onerror = (error) => {
            console.error('Помилка завантаження');
            alert('Помилка завантаження');
            clearProgress();
            clearInterval(idSetInterval);
            //Розблоковуємо кнопку відправки даних
            submit.disabled = false;
            progressStatus.innerText = "Помилка завантаження";
            throw new Error('Network error', error);
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                //Зупиняємо запит status
                clearInterval(idSetInterval);
                //Розблоковуємо кнопку відправки даних
                submit.disabled = false;
                //Перетворюємо дані із Json формату в обєкт
                const data = JSON.parse(xhr.response);
                console.log(data);
                console.log('blobs blobs blobs blobs blobs blobs blobs ')
                //Виводимо результат
                viveResult(data);
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
                progressStatus.innerText = downloadStatus
                progressProcessing.style.display = "block"
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



function viveResult(data) {
    progressStatus.innerText = "Done";
    downloadArchive.href = data?.downloadLink;
    downloadArchive.style.display = "block";

    data.processedImages.forEach((blobUrl) => {
        console.log(blobUrl)
        const li = document.createElement('li'); // Створюємо елемент списку
        const img = document.createElement('img'); // Створюємо елемент зображення
        img.src = blobUrl.res[0].imageBase64;
        // img.src = blobUrl.img.data;

        img.alt = 'Оброблене зображення';
        img.style.maxWidth = '300px'; // Задаємо розмір для відображення
        li.appendChild(img); // Вставляємо зображення у список
        resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL
    });

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
