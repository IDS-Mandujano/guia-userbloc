// ========================================
// FUNCIONALIDADES INTERACTIVAS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // === BOTÓN VOLVER ARRIBA ===
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
    document.querySelectorAll('pre').forEach(function(block) {
        block.addEventListener('click', function(e) {
            // Solo copiar si es código y no estamos seleccionando texto
            if (window.getSelection().toString()) return;
            
            const code = this.textContent;
            navigator.clipboard.writeText(code).then(function() {
                // Feedback visual
                const originalText = block.textContent;
                block.style.opacity = '0.5';
                block.textContent = '✅ ¡Copiado al portapapeles!';
                setTimeout(function() {
                    block.textContent = originalText;
                    block.style.opacity = '1';
                }, 1500);
            }).catch(function() {
                // Fallback para navegadores antiguos
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
    
    // === NAVEGACIÓN SUAVE PARA ANCLAJES ===
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
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
    
    // === DETECTAR DISPOSITIVO MÓVIL ===
    function isMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (isMobile()) {
        // Adaptar experiencia para móviles
        document.querySelectorAll('.mockups-container .mobile-phone').forEach(function(phone) {
            phone.style.borderWidth = '5px';
        });
    }
    
    console.log('📚 Guía de Estudio UserBloc cargada correctamente');
    console.log('💡 Consejo: Haz clic en cualquier bloque de código para copiarlo');
});