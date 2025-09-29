document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // Mock user database (simulating JSON response)
    const validUsers = [
        {
            codigo: "123456",
            password: "1234",
            nombre: "Juan Pérez",
            email: "jperez@universidad.edu.co"
        },
        {
            codigo: "654321",
            password: "1234",
            nombre: "María López",
            email: "mlopez@universidad.edu.co"
        }
    ];
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const codigo = document.getElementById('codigo').value;
        const password = document.getElementById('password').value;
        
        // Simulate API request
        login(codigo, password);
    });
    
    function login(codigo, password) {
        // Simulate API request delay
        setTimeout(() => {
            // Find user with matching credentials
            const user = validUsers.find(user => user.codigo === codigo && user.password === password);
            
            if (user) {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    codigo: user.codigo,
                    nombre: user.nombre,
                    email: user.email
                }));
                
                // Redirect to notas.html
                window.location.href = 'notas.html';
            } else {
                // Show error message
                errorMessage.classList.remove('d-none');
                
                // Clear form fields
                document.getElementById('codigo').value = '';
                document.getElementById('password').value = '';
                
                // Hide error message after 3 seconds
                setTimeout(() => {
                    errorMessage.classList.add('d-none');
                }, 3000);
            }
        }, 1000);
    }
});
