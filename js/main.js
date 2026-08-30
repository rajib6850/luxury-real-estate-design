/* ============================================================
   LUXURY REAL ESTATE — MAIN JAVASCRIPT
   Premium interactions, animations, and scroll behavior
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. NAVBAR SCROLL BEHAVIOR ─────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check

  /* ── 2. SIDE MENU ──────────────────────────────────────── */
  const sideMenu = document.getElementById('side-menu');
  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');

  function openSideMenu() {
    sideMenu.classList.add('active');
    sideMenu.setAttribute('aria-hidden', 'false');
    menuOpenBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    // Focus the close button after animation
    setTimeout(function () {
      menuCloseBtn.focus();
    }, 400);
  }

  function closeSideMenu() {
    sideMenu.classList.remove('active');
    sideMenu.setAttribute('aria-hidden', 'true');
    menuOpenBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuOpenBtn.focus();
  }

  menuOpenBtn.addEventListener('click', openSideMenu);
  menuCloseBtn.addEventListener('click', closeSideMenu);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
      closeSideMenu();
    }
  });

  // Close when clicking overlay area of boxes
  sideMenu.addEventListener('click', function (e) {
    if (e.target === sideMenu || e.target.classList.contains('side-menu__box-overlay')) {
      closeSideMenu();
    }
  });

  // Close menu when clicking side-menu links
  sideMenu.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function() {
      closeSideMenu();
    });
  });

  // 2B. Side Menu Ken Burns Zoom Burn (Cushioned zero-jerk matrix interpolation)
  const sideBoxes = document.querySelectorAll('.side-menu__box');
  sideBoxes.forEach(function (box) {
    const img = box.querySelector('.side-menu__box-bg img');
    if (!img) return;

    let currentAnim = null;

    box.addEventListener('mouseenter', function () {
      if (currentAnim) currentAnim.cancel();

      const currentTransform = window.getComputedStyle(img).transform;

      currentAnim = img.animate(
        [
          { transform: currentTransform !== 'none' ? currentTransform : 'scale(1.0) translate3d(0, 0, 0)' },
          { transform: 'scale(1.14) translate3d(-2%, -1.5%, 0)' }
        ],
        {
          duration: 3500,
          fill: 'forwards',
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }
      );
    });

    box.addEventListener('mouseleave', function () {
      if (currentAnim) currentAnim.cancel();

      const currentTransform = window.getComputedStyle(img).transform;

      currentAnim = img.animate(
        [
          { transform: currentTransform !== 'none' ? currentTransform : 'scale(1.14) translate3d(-2%, -1.5%, 0)' },
          { transform: 'scale(1.0) translate3d(0, 0, 0)' }
        ],
        {
          duration: 1200,
          fill: 'forwards',
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }
      );
    });
  });

  /* ── 3. FOCUS TRAP IN SIDE MENU ────────────────────────── */
  function trapFocus(element) {
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    element.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      const focusableElements = element.querySelectorAll(focusableSelector);
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  trapFocus(sideMenu);

  /* ── 4. SCROLL REVEAL ──────────────────────────────────── */
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ── 4b. IMAGE SCROLL REVEAL OBSERVER ───────────────────── */
  if (!prefersReducedMotion) {
    const imageRevealSelector = '.image-reveal, .listing-card, .community-card, .about__image-wrapper, .services__image-wrapper, .testimonial__image-wrapper, .testimonial__image-col, .cta__background';
    const imageElements = document.querySelectorAll(imageRevealSelector);

    const imageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            imageObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    imageElements.forEach(function (el) {
      if (el.classList.contains('listing-card') || el.classList.contains('community-card')) {
        const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
        if (siblingIndex > 0) {
          el.style.transitionDelay = (siblingIndex * 0.08) + 's';
        }
      }
      imageObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.image-reveal, .listing-card, .community-card, .about__image-wrapper, .services__image-wrapper, .testimonial__image-wrapper, .testimonial__image-col, .cta__background').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ── 5. STAGGERED REVEALS ──────────────────────────────── */
  if (!prefersReducedMotion) {
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    const staggerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach(function (child, index) {
              child.style.opacity = '0';
              child.style.transform = 'translateY(25px)';
              child.style.transition =
                'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ' + (index * 0.12) + 's, ' +
                'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ' + (index * 0.12) + 's';

              // Use rAF to ensure the initial state is applied before animating
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                });
              });
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    staggerContainers.forEach(function (container) {
      staggerObserver.observe(container);
    });
  }

  /* ── 6. CAROUSEL: FEATURED LISTINGS ────────────────────── */
  const listingsCarousel = document.getElementById('listings-carousel');
  const listingPrevBtn = document.getElementById('listings-prev');
  const listingNextBtn = document.getElementById('listings-next');
  const listingDots = document.querySelectorAll('.listings__nav-dot');

  if (listingsCarousel) {
    const getScrollAmount = function () {
      const card = listingsCarousel.querySelector('.listing-card');
      return card ? card.offsetWidth + 24 : 320; // card width + gap
    };

    if (listingPrevBtn) {
      listingPrevBtn.addEventListener('click', function () {
        listingsCarousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
    }

    if (listingNextBtn) {
      listingNextBtn.addEventListener('click', function () {
        listingsCarousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
    }

    // Dot navigation
    listingDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        const totalScrollable = listingsCarousel.scrollWidth - listingsCarousel.clientWidth;
        const pageScroll = (totalScrollable / Math.max(1, listingDots.length - 1)) * index;
        listingsCarousel.scrollTo({ left: pageScroll, behavior: 'smooth' });
      });
    });

    // Update active dot on scroll
    let listingScrollTicking = false;
    listingsCarousel.addEventListener('scroll', function () {
      if (!listingScrollTicking) {
        requestAnimationFrame(function () {
          const totalScrollable = listingsCarousel.scrollWidth - listingsCarousel.clientWidth;
          if (totalScrollable > 0 && listingDots.length > 0) {
            const progress = listingsCarousel.scrollLeft / totalScrollable;
            const activeIndex = Math.min(listingDots.length - 1, Math.round(progress * (listingDots.length - 1)));
            listingDots.forEach(function (d, i) {
              d.classList.toggle('active', i === activeIndex);
            });
          }
          listingScrollTicking = false;
        });
        listingScrollTicking = true;
      }
    });

    // Mouse drag-to-scroll support for desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    listingsCarousel.addEventListener('mousedown', function (e) {
      if (e.target.closest('.listing-card__like-btn')) return;
      isDown = true;
      listingsCarousel.style.cursor = 'grabbing';
      listingsCarousel.style.userSelect = 'none';
      startX = e.pageX - listingsCarousel.offsetLeft;
      scrollLeft = listingsCarousel.scrollLeft;
    });

    listingsCarousel.addEventListener('mouseleave', function () {
      isDown = false;
      listingsCarousel.style.cursor = '';
      listingsCarousel.style.userSelect = '';
    });

    listingsCarousel.addEventListener('mouseup', function () {
      isDown = false;
      listingsCarousel.style.cursor = '';
      listingsCarousel.style.userSelect = '';
    });

    listingsCarousel.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - listingsCarousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      listingsCarousel.scrollLeft = scrollLeft - walk;
    });

    // Heart Favorite Button Toggle
    const likeButtons = listingsCarousel.querySelectorAll('.listing-card__like-btn');
    likeButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('liked');
      });
    });
  }

  /* ── 6b. TESTIMONIAL SLIDER (Horizontal Track Slide) ────── */
  const testimonialSlider = document.getElementById('testimonial-slider');
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialPrevBtn = document.getElementById('testimonial-prev');
  const testimonialNextBtn = document.getElementById('testimonial-next');
  const testimonialDots = document.querySelectorAll('.testimonial__nav-dot');

  if (testimonialSlider && testimonialTrack && testimonialPrevBtn && testimonialNextBtn) {
    const slides = testimonialTrack.querySelectorAll('.testimonial__slide');
    let currentSlide = 0;

    const showSlide = function (index) {
      if (slides.length === 0) return;
      currentSlide = (index + slides.length) % slides.length;

      // Smooth horizontal track transition
      testimonialTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

      // Update active slide class for focus and contrast
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === currentSlide);
      });

      // Update active capsule dot
      testimonialDots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === currentSlide);
      });
    };

    testimonialPrevBtn.addEventListener('click', function () {
      showSlide(currentSlide - 1);
    });

    testimonialNextBtn.addEventListener('click', function () {
      showSlide(currentSlide + 1);
    });

    // Dot navigation
    testimonialDots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        showSlide(idx);
      });
    });
  }

  /* ── 7. SLIDER: FEATURED COMMUNITIES (Continuous Infinite Reel) ── */
  const communitiesSlider = document.getElementById('communities-slider');
  const communitiesTrack = document.getElementById('communities-track');
  const communityPrevBtn = document.getElementById('communities-prev');
  const communityNextBtn = document.getElementById('communities-next');
  const communityDots = document.querySelectorAll('.communities__dot');

  if (communitiesSlider && communitiesTrack) {
    const rawCards = Array.from(communitiesTrack.children);
    const baseCount = rawCards.length;

    if (baseCount > 0) {
      // Clone set once so wide monitors always have continuous cards
      rawCards.forEach(function (card) {
        communitiesTrack.appendChild(card.cloneNode(true));
      });

      let isAnimating = false;
      let activeDotIndex = 0;
      let animationTimer = null;

      const getCardStep = function () {
        const card = communitiesTrack.querySelector('.community-card');
        const gap = 22.4; // 1.4rem gap in px
        return card ? card.offsetWidth + gap : 302.4;
      };

      const updateDots = function () {
        if (communityDots.length === 0) return;
        communityDots.forEach(function (dot, idx) {
          dot.classList.toggle('active', idx === (activeDotIndex % communityDots.length));
        });
      };

      const slideNext = function () {
        if (isAnimating) return;
        isAnimating = true;
        clearTimeout(animationTimer);

        const step = getCardStep();
        communitiesTrack.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        communitiesTrack.style.transform = 'translateX(-' + step + 'px)';

        animationTimer = setTimeout(function () {
          communitiesTrack.appendChild(communitiesTrack.firstElementChild);
          communitiesTrack.style.transition = 'none';
          communitiesTrack.style.transform = 'translateX(0)';
          void communitiesTrack.offsetHeight; // Force reflow
          activeDotIndex = (activeDotIndex + 1) % baseCount;
          updateDots();
          isAnimating = false;
        }, 460);
      };

      const slidePrev = function () {
        if (isAnimating) return;
        isAnimating = true;
        clearTimeout(animationTimer);

        const step = getCardStep();
        communitiesTrack.insertBefore(communitiesTrack.lastElementChild, communitiesTrack.firstElementChild);
        communitiesTrack.style.transition = 'none';
        communitiesTrack.style.transform = 'translateX(-' + step + 'px)';
        void communitiesTrack.offsetHeight; // Force reflow

        requestAnimationFrame(function () {
          communitiesTrack.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
          communitiesTrack.style.transform = 'translateX(0)';
        });

        animationTimer = setTimeout(function () {
          communitiesTrack.style.transition = 'none';
          activeDotIndex = (activeDotIndex - 1 + baseCount) % baseCount;
          updateDots();
          isAnimating = false;
        }, 460);
      };

      if (communityNextBtn) {
        communityNextBtn.addEventListener('click', function (e) {
          e.preventDefault();
          slideNext();
        });
      }

      if (communityPrevBtn) {
        communityPrevBtn.addEventListener('click', function (e) {
          e.preventDefault();
          slidePrev();
        });
      }

      // Dot click navigation
      communityDots.forEach(function (dot, idx) {
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          if (isAnimating) return;
          const currentDot = activeDotIndex % communityDots.length;
          if (idx === currentDot) return;

          if (idx > currentDot) {
            slideNext();
          } else {
            slidePrev();
          }
        });
      });

      // Drag & swipe
      let isDragging = false;
      let startX = 0;
      let currentX = 0;

      const onDragStart = function (e) {
        if (isAnimating) return;
        isDragging = true;
        communitiesSlider.style.cursor = 'grabbing';
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentX = startX;
        communitiesTrack.style.transition = 'none';
      };

      const onDragMove = function (e) {
        if (!isDragging || isAnimating) return;
        currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const delta = currentX - startX;
        communitiesTrack.style.transform = 'translateX(' + delta + 'px)';
      };

      const onDragEnd = function () {
        if (!isDragging) return;
        isDragging = false;
        communitiesSlider.style.cursor = 'grab';
        const delta = currentX - startX;

        if (delta < -45) {
          slideNext();
        } else if (delta > 45) {
          slidePrev();
        } else {
          communitiesTrack.style.transition = 'transform 0.35s ease';
          communitiesTrack.style.transform = 'translateX(0)';
        }
      };

      communitiesSlider.addEventListener('mousedown', onDragStart);
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', onDragEnd);

      communitiesSlider.addEventListener('touchstart', onDragStart, { passive: true });
      communitiesSlider.addEventListener('touchmove', onDragMove, { passive: true });
      communitiesSlider.addEventListener('touchend', onDragEnd);
    }
  }

  /* ── 8. HERO PARALLAX ──────────────────────────────────── */
  if (!prefersReducedMotion) {
    const heroBgImg = document.querySelector('.hero__background img');
    const heroSection = document.querySelector('.hero');

    if (heroBgImg && heroSection) {
      let heroTicking = false;

      window.addEventListener('scroll', function () {
        if (!heroTicking) {
          requestAnimationFrame(function () {
            var scrolled = window.scrollY;
            var heroH = heroSection.offsetHeight;
            if (scrolled < heroH) {
              heroBgImg.style.transform = 'scale(1.08) translateY(' + (scrolled * 0.12) + 'px)';
            }
            heroTicking = false;
          });
          heroTicking = true;
        }
      }, { passive: true });
    }
  }

  /* ── 9. CTA PARALLAX ───────────────────────────────────── */
  if (!prefersReducedMotion) {
    const ctaBgImg = document.querySelector('.cta__background img');
    const ctaSection = document.querySelector('.cta');

    if (ctaBgImg && ctaSection) {
      let ctaTicking = false;

      window.addEventListener('scroll', function () {
        if (!ctaTicking) {
          requestAnimationFrame(function () {
            var rect = ctaSection.getBoundingClientRect();
            var winH = window.innerHeight;

            if (rect.top < winH && rect.bottom > 0) {
              var progress = (winH - rect.top) / (winH + rect.height);
              ctaBgImg.style.transform = 'translateY(' + ((progress - 0.5) * 50) + 'px)';
            }
            ctaTicking = false;
          });
          ctaTicking = true;
        }
      }, { passive: true });
    }
  }

  /* ── 9B. ABOUT WATERMARK SCROLL PARALLAX ───────────────── */
  if (!prefersReducedMotion) {
    var aboutSection = document.getElementById('about');
    var aboutWatermark = document.querySelector('.about__watermark');

    if (aboutSection && aboutWatermark) {
      var aboutTicking = false;

      var updateAboutWatermarkParallax = function () {
        var rect = aboutSection.getBoundingClientRect();
        var winH = window.innerHeight;

        if (rect.bottom >= -100 && rect.top <= winH + 100) {
          var progress = (winH - rect.top) / (winH + rect.height);
          // Smooth horizontal glide and subtle vertical depth
          var xShift = -50 + (progress - 0.5) * 18;
          var yShift = (progress - 0.5) * 28;
          aboutWatermark.style.transform = 'translate3d(' + xShift + '%, ' + yShift + 'px, 0)';
        }
        aboutTicking = false;
      };

      window.addEventListener('scroll', function () {
        if (!aboutTicking) {
          requestAnimationFrame(updateAboutWatermarkParallax);
          aboutTicking = true;
        }
      }, { passive: true });

      updateAboutWatermarkParallax();
    }
  }

  /* ── 10. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var navH = 64; // nav height
        var targetPos = targetElement.getBoundingClientRect().top + window.scrollY - navH;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ── 11. LAZY IMAGE FADE-IN ────────────────────────────── */
  if (!prefersReducedMotion) {
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');

    lazyImgs.forEach(function (img) {
      if (img.complete) return;

      img.style.opacity = '0';
      img.style.transition = 'opacity 0.8s ease-out';

      img.addEventListener('load', function () {
        img.style.opacity = '1';
      });
    });
  }

})();
