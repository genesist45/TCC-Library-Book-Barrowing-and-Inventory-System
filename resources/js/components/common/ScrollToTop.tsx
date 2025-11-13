import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            
            // Calculate scroll progress (0 to 100)
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setScrollProgress(progress);
            
            // Show button when scrolled more than 300px
            setShowButton(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    if (!showButton) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Scroll to top"
        >
            {/* Circular Progress Ring */}
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 48 48">
                {/* Background circle */}
                <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                />
                {/* Progress circle */}
                <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - scrollProgress / 100)}`}
                    className="transition-all duration-150"
                />
            </svg>
            {/* Arrow Icon */}
            <ArrowUp size={18} className="relative z-10" />
        </button>
    );
}
