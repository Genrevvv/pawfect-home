export function navBarAnimations() {
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