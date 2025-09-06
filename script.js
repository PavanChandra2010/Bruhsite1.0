document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('bruhButton');
    const input = document.getElementById('bruhField');
    const laugh = document.getElementById('laughSound');
    const body = document.body;

    button.addEventListener('click', () => {
        input.value += ' bruh';
        laugh.currentTime = 0;
        laugh.play();
        body.classList.add('troll'); // Add the class that triggers the overlay
    });
});
