document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('bruhButton');
    const input = document.getElementById('bruhField');
    const laugh = document.getElementById('laughSound');
    const sike = document.getElementById('sikeSound');
    const overlay = document.getElementById('overlay');
    const fallingContainer = document.getElementById('falling-container');

    let dodgeCount = 0;
    const maxDodges = 5;
    let dodging = true;
    let fallingInterval;
    let trolls = []; // Array to track troll elements

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
        input.value += ' bruh';
        laugh.currentTime = 0;
        laugh.play();
        overlay.style.opacity = "0.5";
        startFalling();
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
        troll.dataset.vx = (Math.random() * 2 - 1).toFixed(2); // Horizontal speed for bouncing

        troll.style.top = `-60px`; // Start above viewport
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

            // Bounce off edges
            if (left < 0 || left > window.innerWidth - 50) {
                vx = -vx;
                troll.dataset.vx = vx.toFixed(2);
            }

            troll.style.top = `${top}px`;
            troll.style.left = `${left}px`;
        });

        // Check collisions
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
            // Simple reaction: reverse horizontal velocity
            let vx1 = parseFloat(t1.dataset.vx);
            let vx2 = parseFloat(t2.dataset.vx);

            t1.dataset.vx = (-vx1).toFixed(2);
            t2.dataset.vx = (-vx2).toFixed(2);
        }
    }
});
