
// Обробка форми реєстрації
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('registerLogin').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;


    try {
        const response = await fetch('http://localhost:8500/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password, name, email })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(`Помилка: ${data.message}`);
        }
    } catch (error) {
        alert('Не вдалося підключитися до сервера');
    }
});

// Обробка форми входу
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('loginLogin').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:8500/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(`Помилка: ${data.message}`);
        }
    } catch (error) {
        alert('Не вдалося підключитися до сервера');
    }
});
