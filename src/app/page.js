'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const loaderRef = useRef(null);
    const loaderBarRef = useRef(null);
    const loaderPctRef = useRef(null);
    const scrollHintRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        
        canvas.width = 1920;
        canvas.height = 1080;

        const frameCount = 125;
        const images = [];
        const imageSeq = { frame: 0 };

        const currentFrame = (index) => 
            `/scroll animation pics/4e19bda8f1814060bf08c6812cf26969_${(index + 1).toString().padStart(3, '0')}.png`;

        let loadedCount = 0;

        const renderDrawing = () => {
            const img = images[Math.round(imageSeq.frame)];
            if (!img || !img.complete) return;
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            const cr = canvas.width / canvas.height;
            const ir = img.width / img.height;

            let dw, dh;
            if (cr > ir) { 
                dh = canvas.height; 
                dw = dh * ir; 
            } else { 
                dw = canvas.width;  
                dh = dw / ir; 
            }

            const x = (canvas.width  - dw) / 2;
            const y = (canvas.height - dh) / 2;
            context.drawImage(img, x, y, dw, dh);
        };

        const setupScrollTrigger = () => {
            gsap.to(imageSeq, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5,
                    onLeave: () => {
                        if (scrollHintRef.current) gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.3 });
                    },
                    onEnterBack: () => {
                        if (scrollHintRef.current) gsap.to(scrollHintRef.current, { opacity: 1, duration: 0.3 });
                    }
                },
                onUpdate: renderDrawing
            });
        };

        const hideLoader = () => {
            if (!loaderRef.current) return;
            gsap.to(loaderRef.current, {
                opacity: 0, duration: 0.8,
                onComplete: () => {
                    setIsLoading(false);
                    if (scrollHintRef.current) gsap.to(scrollHintRef.current, { opacity: 1, y: 0, duration: 1 });
                }
            });
            renderDrawing();
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                const pct = (loadedCount / frameCount) * 100;
                if (loaderBarRef.current) loaderBarRef.current.style.setProperty('--progress', `${pct}%`);
                if (loaderPctRef.current) loaderPctRef.current.textContent = `${Math.round(pct)}%`;
                
                if (loadedCount === frameCount) {
                    hideLoader();
                    setupScrollTrigger();
                }
            };
            images.push(img);
        }

        // Music auto-start logic
        const startMusic = () => {
            if (!isPlaying && audioRef.current) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {});
            }
            window.removeEventListener('scroll', startMusic);
            window.removeEventListener('click', startMusic);
        };

        window.addEventListener('scroll', startMusic, { once: true });
        window.addEventListener('click', startMusic, { once: true });

        return () => {
            window.removeEventListener('scroll', startMusic);
            window.removeEventListener('click', startMusic);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div id="site-wrapper" className="site-wrapper" ref={containerRef}>
            <div className="scroll-container">
                <section className="canvas-viewport">
                    <canvas id="logo-canvas" ref={canvasRef}></canvas>
                </section>

                {/* UI Overlays */}
                <div id="loader" className={`loader ${!isLoading ? 'hidden' : ''}`} ref={loaderRef}>
                    <div className="loader-text">THE DETAILING MAFIA</div>
                    <div className="loader-bar" ref={loaderBarRef}></div>
                    <div className="loader-pct" id="loader-pct" ref={loaderPctRef}>0%</div>
                </div>

                {/* ACTION HUB */}
                <div className="action-hub">
                    {/* Music Control */}
                    <div 
                        id="music-control" 
                        className={`music-sticker ${isPlaying ? 'playing' : 'paused'}`} 
                        onClick={toggleMusic}
                        title="Toggle Music"
                    >
                        <div className="bars">
                            <div className="bar"></div><div className="bar"></div>
                            <div className="bar"></div><div className="bar"></div>
                        </div>
                    </div>

                    {/* WhatsApp Link */}
                    <a href="https://wa.me/918010044000" target="_blank" rel="noopener noreferrer" className="whatsapp-sticker" title="Chat on WhatsApp">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.437 2.503 1.163 3.485l-.765 2.813 2.871-.753c.92.51 1.977.801 3.104.802 3.18 0 5.765-2.586 5.766-5.766 0-3.18-2.585-5.766-5.766-5.766-.001 0-.001 0-.005 0zm3.329 8.283c-.134.373-.678.683-1.127.726-.299.028-.693.047-1.119-.091-.259-.084-.573-.207-1.077-.425-2.148-.928-3.537-3.13-3.645-3.275-.107-.145-.873-1.159-.873-2.213 0-1.054.549-1.572.745-1.785.196-.213.427-.267.57-.267.142 0 .285.002.409.008.133.007.31-.05.485.371.175.421.6 1.462.651 1.567.052.105.087.228.017.368-.071.14-.107.228-.214.354-.106.126-.222.281-.318.377-.107.108-.218.225-.094.437.124.213.551.908 1.186 1.474.819.73 1.503.956 1.716 1.062.213.106.338.088.463-.056.124-.145.533-.621.676-.833.14-.213.284-.175.48-.105.196.071 1.246.587 1.461.693.214.106.356.158.409.251.053.093.053.539-.081.913z"/>
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 21.162c-1.748 0-3.385-.478-4.789-1.309l-4.407 1.156 1.171-4.309c-.933-1.464-1.479-3.201-1.479-5.068 0-5.127 4.14-9.267 9.267-9.267 5.126 0 9.266 4.14 9.266 9.267s-4.14 9.267-9.266 9.267z"/>
                        </svg>
                    </a>

                    {/* AI Robot Button */}
                    <div className="ai-button" title="Ask any question">
                        <div className="ai-icon">🤖</div>
                        <div className="ai-ripple"></div>
                    </div>
                </div>

                <audio id="bg-music" loop ref={audioRef}>
                    <source src="/The Detailing Mafia.mp3" type="audio/mpeg" />
                </audio>

                <div className="scroll-hint" id="scroll-hint" ref={scrollHintRef} style={{ opacity: 0 }}>
                    <span>SCROLL TO EXPLORE</span>
                    <div className="scroll-line"></div>
                </div>

                <div className="spacer"></div>
                {/* Long scroll area to facilitate the animation */}
                <div style={{ height: '400vh' }}></div>
            </div>
        </div>
    );
}
