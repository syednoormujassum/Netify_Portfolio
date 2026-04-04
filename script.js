// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and skill categories
document.querySelectorAll('.project-card, .skill-category, .stat').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 600;
        border-bottom: 3px solid var(--primary-color);
        padding-bottom: 5px;
    }
`;
document.head.appendChild(style);

// Form validation (if you add a contact form in the future)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Counter animation for stats
const stats = document.querySelectorAll('.stat h3');
const speed = 200;

const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target')) || parseInt(el.innerText);
    const increment = target / speed;

    const updateCount = () => {
        const count = parseInt(el.innerText);
        if (count < target) {
            el.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 50);
        } else {
            el.innerText = target + (el.innerText.includes('+') ? '+' : '');
        }
    };

    updateCount();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stat = entry.target.querySelector('h3');
            if (stat && !stat.classList.contains('counted')) {
                stat.classList.add('counted');
                runCounter(stat);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
    }
});

// Log portfolio initialization
console.log('Portfolio loaded successfully!');
console.log('Welcome to Syed Noor Mujassum\'s Portfolio');
// Reviews Section - Form Handling
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');

// Load reviews from localStorage on page load
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    displayReviews(reviews);
}

// Display reviews
function displayReviews(reviews) {
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div class="empty-reviews-message">No reviews yet. Be the first to share your feedback!</div>';
        return;
    }

    // Sort reviews by date (newest first)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.style.opacity = '0';
        reviewCard.style.transform = 'translateY(20px)';
        reviewCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const ratingStars = '⭐'.repeat(parseInt(review.rating));
        const projectText = review.project ? ` - ${review.project}` : '';
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <div class="reviewer-project">${new Date(review.date).toLocaleDateString()}${projectText}</div>
                </div>
                <div class="review-rating">${ratingStars}</div>
            </div>
            <div class="review-text">"${review.message}"</div>
        `;
        
        reviewsList.appendChild(reviewCard);
        
        // Trigger animation
        setTimeout(() => {
            reviewCard.style.opacity = '1';
            reviewCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Handle form submission
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const email = document.getElementById('reviewEmail').value.trim();
        const rating = document.getElementById('reviewRating').value;
        const project = document.getElementById('reviewProject').value.trim();
        const message = document.getElementById('reviewMessage').value.trim();

        // Validation
        if (!name || !email || !rating || !message) {
            alert('Please fill in all required fields');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Create review object
        const review = {
            name,
            email,
            rating,
            project,
            message,
            date: new Date().toISOString()
        };

        // Get existing reviews
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

        // Add new review
        reviews.push(review);

        // Save to localStorage
        localStorage.setItem('reviews', JSON.stringify(reviews));

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '✓ Thank you! Your review has been submitted successfully.';
        reviewForm.insertAdjacentElement('beforebegin', successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Reset form
        reviewForm.reset();

        // Reload reviews
        loadReviews();
    });
}

// Load reviews on page load
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
});