document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in - redirect to notas if so
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'notas.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // API URL to get all students
    const API_URL = 'https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students';
    
    let studentsData = [];
    
    fetchStudentsData();
    
    async function fetchStudentsData() {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                studentsData = await response.json();
                console.log('Students data loaded successfully');
            } else {
                console.error('Failed to load students data');
            }
        } catch (error) {
            console.error('Error loading students data:', error);
        }
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const codigo = document.getElementById('codigo').value;
        const password = document.getElementById('password').value;
        
        validateLogin(codigo, password);
    });
    
    function validateLogin(codigo, password) {
        try {
            const loginButton = document.getElementById('login-button');
            loginButton.disabled = true;
            loginButton.innerHTML = 'Verificando...';
            
            console.log('Validating credentials...');
            
            // Find matching student
            const matchedStudent = studentsData.find(student => 
                student.codigo === codigo && student.clave === password
            );
            
            if (matchedStudent) {
                console.log('Login successful, redirecting...');
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    codigo: matchedStudent.codigo,
                    nombre: matchedStudent.nombre,
                    email: matchedStudent.email
                }));
                
                window.location.href = 'notas.html';
            } else {
                console.log('Login failed: Invalid credentials');
                errorMessage.textContent = 'Credenciales inválidas. Por favor intente nuevamente.';
                errorMessage.classList.remove('d-none');
                document.getElementById('password').value = '';
                
                setTimeout(() => {
                    errorMessage.classList.add('d-none');
                }, 3000);
            }
        } catch (error) {
            console.error('Error during login validation:', error);
            errorMessage.textContent = 'Error en la verificación. Intente nuevamente.';
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