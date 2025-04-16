// Add loading skeleton effect to calculator cards
document.addEventListener('DOMContentLoaded', function() {
    const calculatorCards = document.querySelectorAll('.calculator-card');
    function showSkeletonLoading() {
        calculatorCards.forEach(card => {
            card.classList.add('skeleton');
        });
        setTimeout(() => {
            calculatorCards.forEach(card => {
                card.classList.remove('skeleton');
            });
        }, 1000);
    }
    showSkeletonLoading();
});
