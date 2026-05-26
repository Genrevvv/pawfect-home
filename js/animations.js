export function navBarAnimation() {
    const navOptions = document.querySelectorAll(".nav-option");
    const navImages = document.querySelectorAll(".nav-option img");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        const startScroll = 120;
        const endScroll = 220;

        const startHeight = 72;
        const endHeight = 39;

        const imgStart = 49;
        const imgEnd = 7;

        let progress = 0;

        if (scrollY > startScroll) {
            progress = (scrollY - startScroll) / (endScroll - startScroll);
        }

        progress = Math.min(Math.max(progress, 0), 1);

        const newHeight = startHeight - progress * (startHeight - endHeight);
        const newImgSize = imgStart - progress * (imgStart - imgEnd);

        navOptions.forEach(option => {
            option.style.height = newHeight + "px";
        });

        navImages.forEach(img => {
            img.style.height = newImgSize + "px";
            img.style.width = newImgSize + "px";
            img.style.opacity = 1 - progress;
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
        threshold: 0.6
    });

    cards.forEach(card => observer.observe(card));
}