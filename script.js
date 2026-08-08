// LINEX Studios - Interactions

document.addEventListener('DOMContentLoaded', () => {
    // 0. Studio Dual Cursor System
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing) {
        // Dot moves INSTANTLY to mouse coordinates for 100% click point accuracy
        window.addEventListener('mousemove', (e) => {
            gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
        });

        // Outer ring follows smoothly with fluid trailing inertia
        const ringXTo = gsap.quickTo(cursorRing, "x", { duration: 0.3, ease: "power3.out" });
        const ringYTo = gsap.quickTo(cursorRing, "y", { duration: 0.3, ease: "power3.out" });

        window.addEventListener('mousemove', (e) => {
            ringXTo(e.clientX);
            ringYTo(e.clientY);
        });

        // Tactile Click Feedback
        window.addEventListener('mousedown', () => {
            gsap.to(cursorRing, { scale: 0.75, duration: 0.15 });
            gsap.to(cursorDot, { scale: 1.5, duration: 0.15 });
        });
        window.addEventListener('mouseup', () => {
            gsap.to(cursorRing, { scale: 1, duration: 0.25 });
            gsap.to(cursorDot, { scale: 1, duration: 0.25 });
        });

        // Interactive Element Hover Morphing (Global Event Delegation)
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .btn, .industry-chip, .work-card, .cap-card, .stat-card, .process-card, .hero-glass-card');
            if (target) {
                gsap.to(cursorRing, { scale: 2.4, borderColor: 'rgba(255, 255, 255, 0.9)', backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.25 });
                gsap.to(cursorDot, { scale: 0, duration: 0.2 });
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .btn, .industry-chip, .work-card, .cap-card, .stat-card, .process-card, .hero-glass-card');
            if (target) {
                gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.35)', backgroundColor: 'transparent', duration: 0.25 });
                gsap.to(cursorDot, { scale: 1, duration: 0.2 });
            }
        });
    }

    // 1. Hero Text Setup (Split text into characters for mask reveal)
    const heroHeadline = document.querySelector('.hero h1');
    if (heroHeadline) {
        const text = heroHeadline.textContent;
        heroHeadline.innerHTML = ''; // clear
        
        // Split by words first to keep them together, then characters
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'hero-word';
            
            // Add characters
            for(let i=0; i<word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = 'hero-char';
                charSpan.textContent = word[i];
                wordSpan.appendChild(charSpan);
            }
            
            heroHeadline.appendChild(wordSpan);
            
            // Add space after word (except last)
            if (wordIndex < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                heroHeadline.appendChild(spaceSpan);
            }
        });
    }

    // 2. Initial Page Load Animations (GSAP)
    const tl = gsap.timeline();
    
    // Animate characters up
    tl.to('.hero-char', {
        y: '0%',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.02
    })
    // Fade in CTAs
    .to('.hero-actions', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.2");

    // 3. Scroll-Linked Zoom-Out & Spotlight Fade (GSAP ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.to('.hero-video-placeholder', {
        scale: 0.85,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Fade out spotlight overlay as hero section scrolls out of view
    gsap.to('.spotlight-overlay', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            scrub: true
        }
    });

    // 4. Cursor-Aware Spotlight (Scoped strictly to Hero section)
    const heroSection = document.querySelector('.hero');
    const spotlightOverlay = document.querySelector('.spotlight-overlay');

    if (heroSection && spotlightOverlay) {
        heroSection.addEventListener('mouseenter', () => {
            spotlightOverlay.style.opacity = '1';
        });

        heroSection.addEventListener('mouseleave', () => {
            spotlightOverlay.style.opacity = '0';
        });

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const targetX = ((e.clientX - rect.left) / rect.width) * 100;
            const targetY = ((e.clientY - rect.top) / rect.height) * 100;
            
            heroSection.style.setProperty('--spot-x', `${targetX}%`);
            heroSection.style.setProperty('--spot-y', `${targetY}%`);
        });
    }

    // 5. Section 3 (Thesis Manifesto) Scroll-Triggered Mask Reveal
    gsap.to(['.thesis-headline', '.thesis-copy'], {
        y: '0%',
        opacity: 1,
        duration: 1.1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.thesis',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });

    // 6. Section 4 (Capabilities Grid) ScrollTrigger Stagger Entrance
    gsap.to('.cap-card', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.capabilities-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // 5. Magnetic Cursor (Placeholder for CTAs)
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });

    // 6. Header condense on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const header = document.querySelector('.site-header');
        if (header) {
            if (scrollY > 80) {
                header.style.padding = '10px 0';
            } else {
                header.style.padding = '16px 0';
            }
        }
    });

    // 7. Lightbox Logic
    const openLightboxBtn = document.getElementById('open-lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const lightbox = document.getElementById('video-lightbox');
    const lightboxPlayer = document.getElementById('lightbox-player');

    if (openLightboxBtn && closeLightboxBtn && lightbox) {
        openLightboxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (lightboxPlayer) {
                const sourceTag = lightboxPlayer.querySelector('source');
                if (sourceTag) {
                    sourceTag.src = 'vedios/HOME.mp4';
                    lightboxPlayer.load();
                }
                lightboxPlayer.currentTime = 0;
                lightboxPlayer.play();
            }
            lightbox.classList.add('active');
        });
        
        const closeBox = () => {
            lightbox.classList.remove('active');
            if (lightboxPlayer) {
                lightboxPlayer.pause();
            }
        };

        closeLightboxBtn.addEventListener('click', closeBox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeBox();
            }
        });
    }

    // 8. Hero Glass Card Scroll-Triggered Popup
    const heroGlassCard = document.querySelector('.hero-glass-card');
    if (heroGlassCard) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                heroGlassCard.classList.add('scrolled-pop');
            } else {
                heroGlassCard.classList.remove('scrolled-pop');
            }
        });
    }

    // 9. Section 5 — Featured Work (Hover Autoplay, Lightbox & Parallax)
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach((card, index) => {
        const video = card.querySelector('.work-video-bg');
        
        // Hover Autoplay (sound-off)
        card.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(() => {});
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
            }
        });

        // Click to Open Full Cinematic Lightbox
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video');
            if (lightbox && lightboxPlayer && videoSrc) {
                const sourceTag = lightboxPlayer.querySelector('source');
                if (sourceTag) {
                    sourceTag.src = videoSrc;
                    lightboxPlayer.load();
                }
                lightbox.classList.add('active');
                lightboxPlayer.currentTime = 0;
                lightboxPlayer.play();
            }
        });

        // Smooth entrance reveal using GSAP ScrollTrigger
        gsap.fromTo(card, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // 10. Magnetic Hover Effect for Primary Buttons (PRD 4.6)
    const primaryBtns = document.querySelectorAll('.btn-primary');
    primaryBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });

    // 11. View All Work Portfolio Modal Action
    const viewAllWorkBtn = document.getElementById('view-all-work-btn');
    const portfolioModal = document.getElementById('portfolio-modal');
    const closePortfolioModalBtn = document.getElementById('close-portfolio-modal');

    if (viewAllWorkBtn && portfolioModal) {
        viewAllWorkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            portfolioModal.classList.add('active');
        });
    }

    if (closePortfolioModalBtn && portfolioModal) {
        const closeVault = () => {
            portfolioModal.classList.remove('active');
        };
        closePortfolioModalBtn.addEventListener('click', closeVault);
        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                closeVault();
            }
        });
    }

    // 12. Section 6 — Results Stat Number Count-Up Animation (GSAP)
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(statEl => {
        const targetVal = parseFloat(statEl.getAttribute('data-target'));
        const suffix = statEl.getAttribute('data-suffix') || '';
        const isDecimal = statEl.getAttribute('data-decimal') === 'true';
        
        const counter = { val: 0 };
        
        gsap.to(counter, {
            val: targetVal,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: statEl,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            onUpdate: () => {
                const formattedVal = isDecimal ? counter.val.toFixed(1) : Math.floor(counter.val);
                statEl.textContent = `${formattedVal}${suffix}`;
            }
        });
    });

    // Stat Card Video Hover Autoplay
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const video = card.querySelector('.stat-video-bg');
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
            });
        }
    });

    // 13. Section 7 — Process Staggered Entrance Reveal (GSAP ScrollTrigger)
    const processCards = document.querySelectorAll('.process-card');
    if (processCards.length > 0) {
        gsap.fromTo(processCards,
            { opacity: 0, y: 40, scale: 0.96 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.process-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    // 14. Section 9 — Infinite Seamless Looping Marquee
    const scroller = document.getElementById('industries-scroller');
    const track = document.querySelector('.industries-track');
    
    if (scroller && track) {
        let isPaused = false;
        const speed = 0.6; // Ultra smooth slow scroll speed
        
        function autoScroll() {
            if (!isPaused) {
                scroller.scrollLeft += speed;
                // Halfway point corresponds exactly to the start of duplicate set 2
                if (scroller.scrollLeft >= (track.scrollWidth / 2) - 1) {
                    scroller.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll);
        }
        
        scroller.addEventListener('mouseenter', () => { isPaused = true; });
        scroller.addEventListener('mouseleave', () => { isPaused = false; });
        scroller.addEventListener('touchstart', () => { isPaused = true; });
        scroller.addEventListener('touchend', () => { isPaused = false; });
        
        requestAnimationFrame(autoScroll);
    }

    // 15. Section 10 — Testimonials Spotlight 6s Auto-Rotating Carousel (Horizontal Slider Track)
    const testTrack = document.getElementById('testimonial-track');
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const testDots = document.querySelectorAll('.testimonial-progress-wrap .progress-dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (testTrack && testSlides.length > 0) {
        let currentIndex = 0;
        let autoAdvanceTimer = null;
        const autoAdvanceDuration = 6000;

        function showTestimonial(index) {
            if (index < 0) index = testSlides.length - 1;
            if (index >= testSlides.length) index = 0;

            currentIndex = index;

            testTrack.style.transform = `translateX(-${currentIndex * 33.33333}%)`;

            testSlides.forEach((slide, i) => {
                if (i === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            testDots.forEach((dot, i) => {
                const fill = dot.querySelector('.progress-bar-fill');
                if (fill) {
                    gsap.killTweensOf(fill);
                    if (i === currentIndex) {
                        dot.classList.add('active');
                        gsap.set(fill, { width: '0%' });
                        gsap.to(fill, { width: '100%', duration: 6, ease: 'none' });
                    } else {
                        dot.classList.remove('active');
                        gsap.set(fill, { width: '0%' });
                    }
                }
            });

            resetAutoAdvance();
        }

        function resetAutoAdvance() {
            if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = setInterval(() => {
                showTestimonial(currentIndex + 1);
            }, autoAdvanceDuration);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showTestimonial(currentIndex - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showTestimonial(currentIndex + 1);
            });
        }

        testDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showTestimonial(i);
            });
        });

        const stageWrap = document.querySelector('.testimonial-card-wrap');
        if (stageWrap) {
            let startX = 0;
            stageWrap.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            stageWrap.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) showTestimonial(currentIndex + 1);
                    else showTestimonial(currentIndex - 1);
                }
            }, { passive: true });
        }

        showTestimonial(0);
    }

    // 16. Project Inquiry Form Modal Popup
    const projectModal = document.getElementById('project-modal');
    const closeProjectModal = document.getElementById('close-project-modal');
    const openProjectBtns = document.querySelectorAll('.open-project-modal-btn');
    const projectForm = document.getElementById('project-inquiry-form');
    const formWrap = document.getElementById('form-container-wrap');
    const successMsg = document.getElementById('form-success-msg');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (projectModal) {
        openProjectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                projectModal.classList.add('active');
                if (formWrap) formWrap.style.display = 'block';
                if (successMsg) successMsg.style.display = 'none';
            });
        });

        if (closeProjectModal) {
            closeProjectModal.addEventListener('click', () => {
                projectModal.classList.remove('active');
            });
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });

        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (formWrap) formWrap.style.display = 'none';
                if (successMsg) successMsg.style.display = 'block';
                projectForm.reset();
            });
        }

        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                projectModal.classList.remove('active');
            });
        }
    }

    // 17. Custom Studio Dropdowns (Rounded Options Menu)
    const customDropdowns = document.querySelectorAll('.custom-dropdown');
    customDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.custom-select-trigger');
        const label = dropdown.querySelector('.trigger-label');
        const options = dropdown.querySelectorAll('.custom-option');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                customDropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });
        }

        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = opt.getAttribute('data-value');
                if (label) label.textContent = val;
                if (hiddenInput) hiddenInput.value = val;

                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');

                dropdown.classList.remove('open');
            });
        });
    });

    document.addEventListener('click', () => {
        customDropdowns.forEach(d => d.classList.remove('open'));
    });

    // 18. Footer Newsletter Submission
    const newsletterForm = document.getElementById('footer-newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (newsletterSuccess) {
                newsletterSuccess.style.display = 'block';
            }
            newsletterForm.reset();
        });
    }
});
