document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((block) => {
    // Only add button if block contains code
    if (!block.querySelector('code')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.type = 'button';
    copyBtn.innerText = 'Copiar';

    copyBtn.addEventListener('click', async () => {
      const codeText = block.querySelector('code').innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        copyBtn.innerText = 'Copiado!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerText = 'Copiar';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        copyBtn.innerText = 'Erro';
        console.error('Falha ao copiar:', err);
      }
    });

    block.appendChild(copyBtn);
  });
});
