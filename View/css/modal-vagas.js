const openButtons = document.querySelectorAll('.open-modal');
const closeButtons = document.querySelectorAll('.close-modal');

openButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const modalId = btn.getAttribute('data-modal');
        document.getElementById(modalId).showModal();
    });
});

closeButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const modalId = btn.getAttribute('data-modal');
        document.getElementById(modalId).close();
    });
});
