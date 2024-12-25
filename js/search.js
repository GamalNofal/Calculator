document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const calculatorCards = document.querySelectorAll('.calculator-card');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        calculatorCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const links = Array.from(card.querySelectorAll('.calculator-links a'))
                .map(link => link.textContent.toLowerCase());
            
            const matchesSearch = title.includes(searchTerm) || 
                links.some(link => link.includes(searchTerm));
            
            card.style.display = matchesSearch ? '' : 'none';
            
            // Animate the transition
            if (matchesSearch) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });
});
