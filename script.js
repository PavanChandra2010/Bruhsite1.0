document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('bruhButton');
    const laugh = document.getElementById('laughSound');
    const sike = document.getElementById('sikeSound');
    const overlay = document.getElementById('overlay');
    const fallingContainer = document.getElementById('falling-container');
    const bubblesContainer = document.getElementById('bubbles-container');

    let dodgeCount = 0;
    const maxDodges = 5;
    let dodging = true;
    let fallingInterval;
    let trolls = [];

    centerButton();
    window.addEventListener('resize', centerButton);

    button.addEventListener('mouseover', () => {
        if (!dodging) return;

        if (dodgeCount < maxDodges) {
            moveButtonRandomly();
            sike.currentTime = 0;
            sike.play();
            dodgeCount++;
        }
        if (dodgeCount >= maxDodges) {
            dodging = false;
        }
    });

    button.addEventListener('click', () => {
        laugh.currentTime = 0;
        laugh.play();
        overlay.style.opacity = "0.5";
        startFalling();
        createBubble();
    });

    function centerButton() {
        const x = window.innerWidth / 2 - button.offsetWidth / 2;
        const y = window.innerHeight / 2 - button.offsetHeight / 2;
        setButtonPosition(x, y);
    }

    function moveButtonRandomly() {
        const padding = 50;
        const maxX = window.innerWidth - button.offsetWidth - padding;
        const maxY = window.innerHeight - button.offsetHeight - padding;
        const randomX = Math.floor(Math.random() * maxX) + padding / 2;
        const randomY = Math.floor(Math.random() * maxY) + padding / 2;
        setButtonPosition(randomX, randomY);
    }

    function setButtonPosition(x, y) {
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    }

    function startFalling() {
        if (fallingInterval) return;

        fallingInterval = setInterval(() => {
            createFallingTroll();
        }, 200);

        requestAnimationFrame(updateTrolls);
    }

    function createFallingTroll() {
        const troll = document.createElement('div');
        troll.classList.add('troll-fall');

        const maxX = window.innerWidth - 50;
        const randomX = Math.floor(Math.random() * maxX);
        troll.style.left = `${randomX}px`;

        const duration = (Math.random() * 2 + 2).toFixed(2);
        troll.style.animationDuration = `${duration}s`;

        troll.dataset.speed = (Math.random() * 2 + 2).toFixed(2);
        troll.dataset.vx = (Math.random() * 2 - 1).toFixed(2);

        troll.style.top = `-60px`;
        fallingContainer.appendChild(troll);

        trolls.push(troll);

        troll.addEventListener('animationend', () => {
            troll.remove();
            trolls = trolls.filter(t => t !== troll);
        });
    }

    function updateTrolls() {
        trolls.forEach(troll => {
            let top = parseFloat(troll.style.top);
            let left = parseFloat(troll.style.left);
            let speed = parseFloat(troll.dataset.speed);
            let vx = parseFloat(troll.dataset.vx);

            top += speed;
            left += vx;

            if (left < 0 || left > window.innerWidth - 50) {
                vx = -vx;
                troll.dataset.vx = vx.toFixed(2);
            }

            troll.style.top = `${top}px`;
            troll.style.left = `${left}px`;
        });

        for (let i = 0; i < trolls.length; i++) {
            for (let j = i + 1; j < trolls.length; j++) {
                checkCollision(trolls[i], trolls[j]);
            }
        }

        requestAnimationFrame(updateTrolls);
    }

    function checkCollision(t1, t2) {
        const r1 = t1.getBoundingClientRect();
        const r2 = t2.getBoundingClientRect();

        if (!(r1.right < r2.left ||
              r1.left > r2.right ||
              r1.bottom < r2.top ||
              r1.top > r2.bottom)) {
            let vx1 = parseFloat(t1.dataset.vx);
            let vx2 = parseFloat(t2.dataset.vx);

            t1.dataset.vx = (-vx1).toFixed(2);
            t2.dataset.vx = (-vx2).toFixed(2);
        }
    }

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const messages = [
            "Bruh!", "Gotcha!", "Sike!", "LOL!", "Haha!", "Oops!", "Try again!", "Bruhhh!!!"
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        bubble.textContent = msg;

        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 100;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        bubble.style.left = `${randomX}px`;
        bubble.style.top = `${randomY}px`;

        bubblesContainer.appendChild(bubble);

        // Remove after animation ends
        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });
    }
});
