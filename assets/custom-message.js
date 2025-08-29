document.addEventListener('DOMContentLoaded', () => {
    const checkBox = document.getElementById('custom-checkbox');
    const messageInputWrapper = document.getElementById('message');
    const messageInput = document.getElementById('custom-input');
    const messageError = document.getElementById('message-error');
    const productForm = document.querySelector('form');

    messageInput.disabled = !checkBox.checked;

    checkBox.addEventListener('change', () => {
        if(checkBox.checked){
            messageInputWrapper.classList.remove('hidden');
            messageInput.disabled = false;
        }else{
            messageInputWrapper.classList.add('hidden');
            messageInput.value = '';
            messageInput.disabled = true;
            messageError.style.display = 'none';
            messageError.textContent = '';
        }
    })

    productForm.addEventListener('submit', (e) => {
        if(checkBox.checked){
            const trimmedMsg = messageInput.value.trim();
            if(trimmedMsg === ''){
                e.preventDefault();
                e.stopImmediatePropagation();
                messageError.textContent = 'Please enter a valid message.';
                messageError.style.display = 'block';
            }else{
                messageError.textContent = '';
                messageError.style.display = 'none';
            }
        }
    }, true)
})