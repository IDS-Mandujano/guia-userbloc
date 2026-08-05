// ========================================
// FUNCIONALIDADES PRINCIPALES
// ========================================

// === BOTÓN VOLVER ARRIBA ===
document.addEventListener('DOMContentLoaded', function() {
    const btnTop = document.getElementById('btn-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btnTop.classList.add('visible');
        } else {
            btnTop.classList.remove('visible');
        }
    });
    
    btnTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // === COPIAR CÓDIGO AL PORTAPAPELES ===
    document.querySelectorAll('pre:not(.code-editor pre)').forEach(function(block) {
        block.addEventListener('click', function(e) {
            if (window.getSelection().toString()) return;
            
            const code = this.textContent;
            navigator.clipboard.writeText(code).then(function() {
                const originalText = block.textContent;
                block.style.opacity = '0.5';
                block.textContent = '✅ ¡Copiado al portapapeles!';
                setTimeout(function() {
                    block.textContent = originalText;
                    block.style.opacity = '1';
                }, 1500);
            }).catch(function() {
                const textarea = document.createElement('textarea');
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Código copiado al portapapeles');
            });
        });
    });
    
    // === INDICADOR DE PROGRESO DE LECTURA ===
    const progressBar = document.querySelector('.progress-bar span');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }
    
    // === INICIALIZAR CUESTIONARIO ===
    initializeQuiz();
    
    // === CONTAR LÍNEAS DEL EDITOR ===
    const textarea = document.getElementById('code-editor');
    if (textarea) {
        const lines = textarea.value.split('\n').length;
        document.getElementById('line-count').textContent = lines;
        
        textarea.addEventListener('input', function() {
            const lines = this.value.split('\n').length;
            document.getElementById('line-count').textContent = lines;
        });
    }
    
    console.log('📚 Guía de Estudio UserBloc cargada correctamente');
    console.log('💡 Completa el código en el editor y responde el cuestionario para poner a prueba tus conocimientos!');
});

// ========================================
// EDITOR DE CÓDIGO INTERACTIVO
// ========================================

function runCode() {
    const code = document.getElementById('code-editor').value;
    const outputDiv = document.getElementById('code-output');
    const outputContent = document.getElementById('output-content');
    
    outputDiv.style.display = 'block';
    outputContent.innerHTML = '';
    
    try {
        // Analizar el código para verificar la implementación
        const hasLoading = code.includes('emit(UserLoading())');
        const hasLogout = code.includes('repository.logout()');
        const hasUnauthenticated = code.includes('emit(UserUnauthenticated())');
        const hasError = code.includes('emit(UserError(');
        
        let errors = [];
        let warnings = [];
        
        if (!hasLoading) {
            errors.push('❌ No estás emitiendo UserLoading() al inicio');
        }
        
        if (!hasLogout) {
            errors.push('❌ No estás llamando a repository.logout()');
        }
        
        if (!hasUnauthenticated) {
            warnings.push('⚠️ No estás emitiendo UserUnauthenticated() después del logout');
        }
        
        if (!hasError) {
            warnings.push('⚠️ No estás manejando el caso de error con UserError()');
        }
        
        // Mostrar resultados
        if (errors.length === 0 && warnings.length === 0) {
            outputContent.innerHTML = `
                <div class="success">✅ ¡Excelente! Tu código está completo y correcto.</div>
                <div class="success">📝 Has implementado correctamente el método _onLogoutRequested.</div>
                <br>
                <div class="info">💡 El flujo que has creado es:</div>
                <div class="info">  1. Emitir UserLoading() para mostrar el spinner</div>
                <div class="info">  2. Llamar a repository.logout() para cerrar sesión</div>
                <div class="info">  3. Emitir UserUnauthenticated() si tiene éxito</div>
                <div class="info">  4. Emitir UserError() si falla</div>
            `;
        } else {
            let html = '';
            
            if (errors.length > 0) {
                html += '<div class="error">❌ Errores encontrados:</div>';
                errors.forEach(err => {
                    html += `<div class="error">  ${err}</div>`;
                });
                html += '<br>';
            }
            
            if (warnings.length > 0) {
                html += '<div class="warning">⚠️ Sugerencias:</div>';
                warnings.forEach(warn => {
                    html += `<div class="warning">  ${warn}</div>`;
                });
                html += '<br>';
            }
            
            html += `<div class="info">💡 Recuerda: El método debe manejar el flujo completo:</div>
                     <div class="info">  1. emit(UserLoading()) → para mostrar carga</div>
                     <div class="info">  2. await repository.logout() → para cerrar sesión</div>
                     <div class="info">  3. emit(UserUnauthenticated()) → si tiene éxito</div>
                     <div class="info">  4. emit(UserError('Mensaje')) → si falla</div>`;
            
            outputContent.innerHTML = html;
        }
        
    } catch (e) {
        outputContent.innerHTML = `
            <div class="error">❌ Error al analizar tu código: ${e.message}</div>
            <div class="info">💡 Asegúrate de que la sintaxis sea correcta.</div>
        `;
    }
}

function resetCode() {
    const defaultCode = `class UserBloc extends Bloc<UserEvent, UserState> {
  final AuthRepository repository;
  
  UserBloc(this.repository) : super(UserInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }
  
  void _onLoginRequested(LoginRequested event, Emitter<UserState> emit) async {
    emit(UserLoading());
    try {
      final user = await repository.login(event.email, event.password);
      emit(UserAuthenticated(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
  
  // ✏️ COMPLETA ESTE MÉTODO
  void _onLogoutRequested(LogoutRequested event, Emitter<UserState> emit) async {
    // Tu código aquí
    // 1. Emite UserLoading()
    // 2. Llama a repository.logout()
    // 3. Emite UserUnauthenticated() o UserError()
  }
}`;
    
    document.getElementById('code-editor').value = defaultCode;
    document.getElementById('code-output').style.display = 'none';
    document.getElementById('output-content').innerHTML = '';
    
    const lines = defaultCode.split('\n').length;
    document.getElementById('line-count').textContent = lines;
}

function clearOutput() {
    document.getElementById('code-output').style.display = 'none';
    document.getElementById('output-content').innerHTML = '';
}

// ========================================
// CUESTIONARIO
// ========================================

const questions = [
    {
        id: 1,
        question: '¿Qué significa BLoC en Flutter?',
        options: [
            'Business Logic Component',
            'Basic Logic Controller',
            'Blockchain Logic Code',
            'Binary Language on Cloud'
        ],
        correct: 0
    },
    {
        id: 2,
        question: '¿Cuál es la principal responsabilidad de un UserBloc?',
        options: [
            'Manejar la interfaz de usuario',
            'Gestionar el estado y autenticación del usuario',
            'Controlar la navegación entre pantallas',
            'Administrar las animaciones'
        ],
        correct: 1
    },
    {
        id: 3,
        question: 'En el patrón BLoC, ¿qué son los "Eventos"?',
        options: [
            'Las salidas que se muestran en la UI',
            'Las entradas o acciones que ocurren en la aplicación',
            'Los datos guardados en la base de datos',
            'Los estilos CSS de la aplicación'
        ],
        correct: 1
    },
    {
        id: 4,
        question: '¿Qué es el "Prop Drilling" que BLoC ayuda a resolver?',
        options: [
            'Pasar parámetros innecesariamente a través de muchas pantallas',
            'Un problema de rendimiento en la UI',
            'Un error en la compilación de Flutter',
            'Una técnica de optimización de código'
        ],
        correct: 0
    },
    {
        id: 5,
        question: '¿Cuál de estos NO es un estado típico del UserBloc?',
        options: [
            'UserAuthenticated',
            'UserLoading',
            'UserError',
            'UserPaymentProcessed'
        ],
        correct: 3
    },
    {
        id: 6,
        question: '¿Qué widget se usa en Flutter para redibujar la UI cuando cambia el estado del BLoC?',
        options: [
            'BlocListener',
            'BlocBuilder',
            'BlocProvider',
            'BlocConsumer'
        ],
        correct: 1
    },
    {
        id: 7,
        question: '¿Cuándo es recomendable NO usar BLoC?',
        options: [
            'En aplicaciones de mediana escala',
            'En proyectos con equipo de desarrollo',
            'En aplicaciones muy pequeñas o MVPs simples',
            'En aplicaciones bancarias'
        ],
        correct: 2
    },
    {
        id: 8,
        question: '¿Qué función se usa en el BLoC para emitir un nuevo estado?',
        options: [
            'send()',
            'output()',
            'emit()',
            'publish()'
        ],
        correct: 2
    },
    {
        id: 9,
        question: '¿Cuál es la analogía correcta para el patrón BLoC?',
        options: [
            'Un restaurante donde el Chef (BLoC) prepara la comida (Estado) basado en el pedido del cliente (Evento)',
            'Un bibliotecario que organiza libros en estanterías',
            'Un conductor que maneja un autobús por una ruta fija',
            'Un músico que toca una canción en un instrumento'
        ],
        correct: 0
    },
    {
        id: 10,
        question: '¿Qué paquete se usa comúnmente junto con flutter_bloc para comparar estados?',
        options: [
            'equatable',
            'comparator',
            'state_compare',
            'flutter_test'
        ],
        correct: 0
    }
];

let quizSubmitted = false;

function initializeQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    let html = '';
    questions.forEach((q, index) => {
        html += `
            <div class="question-item" id="question-${q.id}">
                <div class="question-text">
                    <span class="number">Pregunta ${index + 1}:</span>
                    ${q.question}
                </div>
                <div class="options">
                    ${q.options.map((opt, optIndex) => `
                        <label>
                            <input type="radio" name="q${q.id}" value="${optIndex}">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function submitQuiz() {
    if (quizSubmitted) {
        alert('Ya has enviado el cuestionario. Usa "Reiniciar" para intentarlo de nuevo.');
        return;
    }
    
    let score = 0;
    let total = questions.length;
    let allAnswered = true;
    
    questions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        const questionDiv = document.getElementById(`question-${q.id}`);
        
        if (!selected) {
            allAnswered = false;
            questionDiv.style.borderColor = 'var(--warning)';
            return;
        }
        
        const answer = parseInt(selected.value);
        const isCorrect = answer === q.correct;
        
        if (isCorrect) {
            score++;
            questionDiv.classList.add('correct');
            questionDiv.classList.remove('incorrect');
        } else {
            questionDiv.classList.add('incorrect');
            questionDiv.classList.remove('correct');
        }
        
        // Mostrar feedback
        const options = questionDiv.querySelectorAll('.options label');
        options.forEach((label, idx) => {
            label.classList.add('disabled');
            if (idx === q.correct) {
                label.style.background = '#dcfce7';
                label.style.border = '1px solid #86efac';
                label.style.borderRadius = '4px';
            }
            if (idx === answer && !isCorrect) {
                label.style.background = '#fee2e2';
                label.style.border = '1px solid #fca5a5';
                label.style.borderRadius = '4px';
            }
        });
        
        const input = questionDiv.querySelector('input');
        if (input) {
            input.disabled = true;
        }
    });
    
    if (!allAnswered) {
        alert('Por favor, responde todas las preguntas antes de calificar.');
        return;
    }
    
    quizSubmitted = true;
    
    // Mostrar resultado
    const resultDiv = document.getElementById('quiz-result');
    const scoreSpan = document.getElementById('score');
    const scoreBarFill = document.getElementById('score-bar-fill');
    const messageDiv = document.getElementById('score-message');

    resultDiv.style.display = 'block';
    scoreSpan.textContent = `${score} de ${total}`;
    
    const percentage = (score / total) * 100;
    setTimeout(() => {
        scoreBarFill.style.width = percentage + '%';
    }, 100);
    
    let message = '';
    let icon = '';
    if (percentage === 100) {
        message = '🎉 ¡Perfecto! Eres un experto en UserBloc. ¡Felicidades!';
        icon = '🌟';
    } else if (percentage >= 80) {
        message = '👍 ¡Muy bien! Tienes un excelente conocimiento de UserBloc.';
        icon = '📚';
    } else if (percentage >= 60) {
        message = '📖 Buen trabajo. Revisa los temas donde tuviste errores para mejorar.';
        icon = '💪';
    } else if (percentage >= 40) {
        message = '📝 Necesitas repasar algunos conceptos. Vuelve a leer las secciones anteriores.';
        icon = '📖';
    } else {
        message = '🔄 Te recomendamos estudiar nuevamente la guía completa. ¡No te rindas!';
        icon = '💪';
    }
    
    messageDiv.innerHTML = `${icon} ${message}`;
    
    // Desplazarse al resultado
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Deshabilitar botón de submit
    document.getElementById('submit-quiz').disabled = true;
    document.getElementById('submit-quiz').style.opacity = '0.5';
    document.getElementById('submit-quiz').style.cursor = 'not-allowed';
}

function resetQuiz() {
    quizSubmitted = false;
    
    // Limpiar estilos de preguntas
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('correct', 'incorrect');
        item.style.borderColor = '';
    });
    
    // Limpiar opciones
    document.querySelectorAll('.options label').forEach(label => {
        label.classList.remove('disabled');
        label.style.background = '';
        label.style.border = '';
    });
    
    // Habilitar inputs
    document.querySelectorAll('.options input').forEach(input => {
        input.disabled = false;
        input.checked = false;
    });
    
    // Ocultar resultado
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('score-bar-fill').style.width = '0%';
    
    // Habilitar botón de submit
    const submitBtn = document.getElementById('submit-quiz');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
}

// ========================================
// DETECTAR DISPOSITIVO
// ========================================

function isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    document.querySelectorAll('.mockups-container .mobile-phone').forEach(function(phone) {
        phone.style.borderWidth = '5px';
    });
}c