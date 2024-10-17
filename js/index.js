document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById('imageInput').files;
    const processType = document.getElementById('processType').value;
    const PORT = 8000; // Зміна порту для кожного сервера
    if (imageInput.length === 0) {
        alert('Будь ласка, оберіть хоча б одне зображення для завантаження');
        return;
    }

    // Формуємо форму для відправки
    const formData = new FormData();
    for (let i = 0; i < imageInput.length; i++) {
        formData.append('images', imageInput[i]);
    }
    formData.append('processType', processType); // Додаємо вибраний тип обробки
    console.log(formData)
    try {
        // Відправка зображень на сервер через fetch
        const response = await fetch(`http://localhost:${PORT}/upload-multiple`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Помилка під час завантаження зображень');
        }

        // Отримання оброблених зображень як Blob
        const blobs = await response.json();
        const resultImagesDiv = document.getElementById('resultImages');
        resultImagesDiv.innerHTML = ''; // Очищуємо попередні результати

        blobs.forEach((blobUrl) => {
            const li = document.createElement('li'); // Створюємо елемент списку
            const img = document.createElement('img'); // Створюємо елемент зображення
            img.src = blobUrl;
            img.alt = 'Оброблене зображення';
            img.style.maxWidth = '300px'; // Задаємо розмір для відображення
            li.appendChild(img); // Вставляємо зображення у список
            resultImagesDiv.appendChild(li); // Додаємо елемент списку у UL
        });
    } catch (error) {
        console.error('Сталася помилка:', error);
    }
});



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
