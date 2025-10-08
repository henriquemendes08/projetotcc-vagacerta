// Seleciona todos os botões que abrem modais
const openButtons = document.querySelectorAll('.open-modal');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.showModal();
        }
    });
});

// Seleciona todos os botões que fecham modais
const closeButtons = document.querySelectorAll('.close-modal');

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.close();
        }
    });
});
