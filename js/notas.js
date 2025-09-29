document.addEventListener('DOMContentLoaded', function() {
    // Revisar si esta logueado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('student-code').textContent = currentUser.codigo;
    document.getElementById('student-name').textContent = currentUser.nombre;
    
    fetchGradesData(currentUser.codigo);
    
    document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    // Calcular la definitiva
    function calculateFinalGrade(p1, p2, p3, ef) {
        return ((p1+p2+p3)/3)*0.70 + (ef * 0.30);
    }
    
    async function fetchGradesData(studentCode) {
        try {
            const API_URL = `https://24a0dac0-2579-4138-985c-bec2df4bdfcc-00-3unzo70c406dl.riker.replit.dev/students/${studentCode}/notas`;
            
            console.log(`Fetching grades data from: ${API_URL}`);
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Error fetching grades: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Grades data received:', data);
            
            if (data.login === true && data.notas) {
                displayGrades(data.notas);
            } else {
                console.error('Invalid data format received');
            }
        } catch (error) {
            console.error('Error fetching grades data:', error);
        }
    }
    
    function displayGrades(gradesData) {
        let totalCreditos = 0;
        let sumaCreditos = 0;
        
        const tableBody = document.getElementById('grades-table-body');
        tableBody.innerHTML = '';
        
        gradesData.forEach(subject => {
            const n1 = parseFloat(subject.n1);
            const n2 = parseFloat(subject.n2);
            const n3 = parseFloat(subject.n3);
            const ex = parseFloat(subject.ex);
            const creditos = parseInt(subject.creditos);
            
            const def = calculateFinalGrade(n1, n2, n3, ex);
            
            sumaCreditos += def * creditos;
            totalCreditos += creditos;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.asignatura}</td>
                <td>${subject.creditos}</td>
                <td>${n1.toFixed(1)}</td>
                <td>${n2.toFixed(1)}</td>
                <td>${n3.toFixed(1)}</td>
                <td>${ex.toFixed(1)}</td>
                <td>${def.toFixed(1)}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Calcular el promedio ponderado
        const ponderado = sumaCreditos / totalCreditos;
        document.getElementById('average-grade').textContent = ponderado.toFixed(1);
    }
});