// Variables globales
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contact-form');

// ==================== MENÚ HAMBURGUESA ====================
function initHamburgerMenu() {
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
}

// ==================== VALIDACIÓN DE FORMULARIO ====================
function initFormValidation() {
    if (!contactForm) return;

    const formFields = {
        nombre: {
            element: document.getElementById('nombre'),
            error: document.getElementById('error-nombre'),
            validate: (value) => {
                if (!value.trim()) return 'El nombre es requerido';
                if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
                if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
                return '';
            }
        },
        email: {
            element: document.getElementById('email'),
            error: document.getElementById('error-email'),
            validate: (value) => {
                if (!value.trim()) return 'El email es requerido';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Por favor ingresa un email válido';
                return '';
            }
        },
        mensaje: {
            element: document.getElementById('mensaje'),
            error: document.getElementById('error-mensaje'),
            validate: (value) => {
                if (!value.trim()) return 'El mensaje es requerido';
                if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
                if (value.trim().length > 500) return 'El mensaje no puede exceder 500 caracteres';
                return '';
            }
        }
    };

    // Función para mostrar error
    function showError(field, message) {
        field.element.classList.add('error');
        field.error.textContent = message;
        field.error.style.display = 'block';
    }

    // Función para limpiar error
    function clearError(field) {
        field.element.classList.remove('error');
        field.error.textContent = '';
        field.error.style.display = 'none';
    }

    // Función para validar un campo
    function validateField(fieldName) {
        const field = formFields[fieldName];
        const value = field.element.value;
        const errorMessage = field.validate(value);

        if (errorMessage) {
            showError(field, errorMessage);
            return false;
        } else {
            clearError(field);
            return true;
        }
    }

    // Agregar event listeners para validación en tiempo real
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        
        // Validar al escribir
        let timeout;
        field.element.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => validateField(fieldName), 300);
        });

        // Validar al perder el foco
        field.element.addEventListener('blur', () => validateField(fieldName));
    });

    // Validar formulario completo al enviar
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        Object.keys(formFields).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isFormValid = false;
            }
        });

        const submitBtn = document.getElementById('submit-btn');
        
        if (isFormValid) {
            // Simular envío exitoso
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('¡Gracias por tu mensaje! Te contactaré pronto.');
                contactForm.reset();
                submitBtn.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
                
                // Limpiar todos los errores
                Object.keys(formFields).forEach(fieldName => {
                    clearError(formFields[fieldName]);
                });
            }, 2000);
        } else {
            // Hacer scroll al primer campo con error
            const firstErrorField = Object.keys(formFields).find(fieldName => 
                formFields[fieldName].element.classList.contains('error')
            );
            
            if (firstErrorField) {
                formFields[firstErrorField].element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                formFields[firstErrorField].element.focus();
            }
        }
    });
}

// ==================== ANIMACIÓN DE BARRAS DE PROGRESO ====================
function initSkillBars() {
    const skillSection = document.getElementById('habilidades');
    if (!skillSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(skillSection);
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const skillLevel = bar.getAttribute('data-skill');
        
        // Resetear la barra
        bar.style.width = '0%';
        
        // Animar la barra
        setTimeout(() => {
            bar.style.width = skillLevel + '%';
        }, 200);
    });
}

// ==================== NAVEGACIÓN SUAVE ====================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== EFECTOS DE SCROLL ====================
function initScrollEffects() {
    const sections = document.querySelectorAll('.section-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ==================== TEMA OSCURO/CLARO ====================
function initThemeToggle() {
    // Crear botón de tema
    const themeBtn = document.createElement('button');
    themeBtn.innerHTML = '🌙';
    themeBtn.setAttribute('aria-label', 'Cambiar tema');
    themeBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(themeBtn);
    
    // Verificar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '☀️';
    }
    
    // Evento de clic
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Efecto hover
    themeBtn.addEventListener('mouseenter', () => {
        themeBtn.style.transform = 'scale(1.1)';
    });

    themeBtn.addEventListener('mouseleave', () => {
        themeBtn.style.transform = 'scale(1)';
    });
}

// ==================== CAMBIO DE HEADER AL HACER SCROLL ====================
function initHeaderEffect() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#000000';
            header.style.backdropFilter = 'none';
        }
    });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portafolio de Melissa Manotas - JavaScript cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initHamburgerMenu();
    initFormValidation();
    initSkillBars();
    initSmoothScrolling();
    initScrollEffects();
    initThemeToggle();
    initHeaderEffect();
    
    // Mensaje de bienvenida en consola
    console.log(`
    ╔════════════════════════════════════╗
    ║    PORTAFOLIO MELISSA MANOTAS      ║
    ║                                    ║
    ║  ✅ Menú hamburguesa responsive    ║
    ║  ✅ Validación de formulario       ║
    ║  ✅ Animaciones de habilidades     ║
    ║  ✅ Navegación suave               ║
    ║  ✅ Efectos de scroll              ║
    ║  ✅ Tema oscuro/claro              ║
    ║                                    ║
    ║     Todas las funciones activas    ║
    ╚════════════════════════════════════╝
    `);
});