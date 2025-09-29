document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in - redirect to notas if so
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'notas.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    const API_URL = 'https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/login';
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const codigo = document.getElementById('codigo').value;
        const password = document.getElementById('password').value;
        
        handleLogin(codigo, password);
    });
    
    async function handleLogin(codigo, password) {
        try {
            const loginButton = document.getElementById('login-button');
            loginButton.disabled = true;
            loginButton.innerHTML = 'Verificando...';
            
            console.log('Sending login request...');
            
            // Send credentials to login endpoint
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo: codigo,
                    clave: password 
                })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (data.login === true) {
                console.log('Login successful, redirecting...');
                localStorage.setItem('currentUser', JSON.stringify({
                    codigo: data.codigo,
                    nombre: data.nombre,
                    email: data.email
                }));
                
                window.location.href = 'notas.html';
            } else {
                console.log('Login failed:', data.mensaje || 'Invalid credentials');
                errorMessage.textContent = data.mensaje || 'Credenciales inválidas. Por favor intente nuevamente.';
                errorMessage.classList.remove('d-none');
                document.getElementById('password').value = '';
                
                setTimeout(() => {
                    errorMessage.classList.add('d-none');
                }, 3000);
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.textContent = 'Error en la conexión. Intente nuevamente.';
            errorMessage.classList.remove('d-none');
            
            setTimeout(() => {
                errorMessage.classList.add('d-none');
            }, 3000);
        } finally {
            const loginButton = document.getElementById('login-button');
            loginButton.disabled = false;
            loginButton.innerHTML = 'Ingresar';
        }
    }
});