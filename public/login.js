document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                // Si el login es exitoso, redirige al usuario a index.html
                window.localStorage.setItem(
                    "session",
                    JSON.stringify({ id: result.userId, rol: result.rol })
                );
                if (result.rol === "admin") {
                    window.location.href = "/carga"
                } else {
                    window.location.href="/index"
                }
            } else {
                // Muestra un mensaje de error si el login falla
                alert(result.message);
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            alert('Error al intentar iniciar sesión. Inténtalo de nuevo.');
        }
    });
});
