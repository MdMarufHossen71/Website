import { useState, useEffect, useRef } from 'react';

/**
 * useSmartNavbar
 * A premium, highly-optimized custom React hook for smart sticky headers.
 * 
 * Behavior (Desktop Only):
 * - Navbar stays fixed initially.
 * - Scrolls DOWN -> hide smoothly (transform translateY).
 * - Scrolls STOP -> show again smoothly.
 * - Scrolls UP -> show immediately.
 * - Dynamic scroll shadow/compaction added when scrolled past 50px.
 * 
 * Behavior (Mobile Only):
 * - Stays fixed at the top (Do NOT hide on scroll).
 * - Compact spacing and scrolling styling active.
 * 
 * Performance:
 * - Optimized with requestAnimationFrame to prevent layout thrashing.
 * - Implements debounce scroll stop detection.
 */
export function useSmartNavbar() {
    const [scrollState, setScrollState] = useState({
        visible: true,
        scrolled: false,
        scrollPosition: 0,
        isMobile: false
    });

    const lastScrollTop = useRef(0);
    const scrollStopTimeout = useRef(null);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const isMobile = window.innerWidth < 992;

            if (isMobile) {
                setScrollState({
                    visible: true,
                    scrolled: currentScrollTop > 30,
                    scrollPosition: currentScrollTop,
                    isMobile: true
                });
                lastScrollTop.current = currentScrollTop;
                return;
            }

            // Compact capsule size/shadow shift past 50px
            const scrolled = currentScrollTop > 50;

            // Clear any active stop timeouts
            if (scrollStopTimeout.current) {
                clearTimeout(scrollStopTimeout.current);
            }

            // If we stopped scrolling, show the navbar again
            scrollStopTimeout.current = setTimeout(() => {
                setScrollState(prev => ({
                    ...prev,
                    visible: true
                }));
            }, 150);

            // Hide/reveal direction calculations with direction thresholds
            let visible = scrollState.visible;
            const diff = currentScrollTop - lastScrollTop.current;

            if (currentScrollTop <= 80) {
                visible = true; // Keep visible near top of screen
            } else if (diff > 15) {
                visible = false; // Scrolling down past threshold -> hide navbar
            } else if (diff < -10) {
                visible = true; // Scrolling up past threshold -> show navbar immediately
            }

            setScrollState({
                visible,
                scrolled,
                scrollPosition: currentScrollTop,
                isMobile: false
            });

            lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        // Initialize state on mounting
        handleScroll();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', handleScroll);
            if (scrollStopTimeout.current) {
                clearTimeout(scrollStopTimeout.current);
            }
        };
    }, [scrollState.visible]);

    return scrollState;
}
