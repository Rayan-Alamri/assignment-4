document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentSlideSpan = document.getElementById('current-slide');
    const totalSlidesSpan = document.getElementById('total-slides');

    let currentSlideIndex = 0;

    // Initialize
    totalSlidesSpan.textContent = slides.length;
    updateSlide();

    // Event Listeners
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
            changeSlide(1);
        } else if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        }
    });

    function changeSlide(direction) {
        const newIndex = currentSlideIndex + direction;

        if (newIndex >= 0 && newIndex < slides.length) {
            currentSlideIndex = newIndex;
            updateSlide();
        }
    }

    function updateSlide() {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show current slide
        slides[currentSlideIndex].classList.add('active');

        // Update counter
        currentSlideSpan.textContent = currentSlideIndex + 1;

        // Update button states
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;

        prevBtn.style.opacity = currentSlideIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlideIndex === slides.length - 1 ? '0.5' : '1';
    }
});
