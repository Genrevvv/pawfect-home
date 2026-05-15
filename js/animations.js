export function navBarAnimation() {
    const navOptions = document.querySelectorAll(".nav-option");
    window.addEventListener("scroll", () => {

        const scrollY = window.scrollY;

        const startScroll = 120;
        const endScroll = 220;

        const startHeight = 80;     // 5rem
        const endHeight = 32;       // 2rem 

        let progress = 0;

        if (scrollY > startScroll) {
            progress =
                Math.min(
                    (scrollY - startScroll) /
                    (endScroll - startScroll),
                    1
                );
        }

        const currentHeight = startHeight - (startHeight - endHeight) * progress;

        navOptions.forEach(option => {
            option.style.height = currentHeight + "px";
        });

    });
}

export function cardAnimation() {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: 0.95
    });

    cards.forEach(card => observer.observe(card));
}