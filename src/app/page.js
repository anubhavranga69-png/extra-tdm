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
    const [currentFrame, setCurrentFrame] = useState(0);

    const contentSections = [
        {
            id: 1,
            title: "Precision in Motion",
            text: "Every frame of our craft is dedicated to perfection. Experience the art of detailing like never before.",
            range: [10, 40]
        },
        {
            id: 2,
            title: "The Shine of Royalty",
            text: "Using world-class ceramic coatings and premium care to give your vehicle a legendary finish.",
            range: [50, 80]
        },
        {
            id: 3,
            title: "Join The Mafia",
            text: "Welcome to India's most premium detailing experience. Your ride deserves the best.",
            range: [95, 120]
        }
    ];

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

        const getFramePath = (index) => 
            `/scroll animation pics/4e19bda8f1814060bf08c6812cf26969_${(index + 1).toString().padStart(3, '0')}.png`;

        let loadedCount = 0;

        const renderDrawing = () => {
            const frameIndex = Math.round(imageSeq.frame);
            setCurrentFrame(frameIndex);
            
            const img = images[frameIndex];
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
            img.src = getFramePath(i);
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

                {/* Cinematic Content Sections */}
                <div className="content-overlay">
                    {contentSections.map(section => (
                        <div 
                            key={section.id} 
                            className={`cinematic-section ${currentFrame >= section.range[0] && currentFrame <= section.range[1] ? 'active' : ''}`}
                        >
                            <h2>{section.title}</h2>
                            <p>{section.text}</p>
                        </div>
                    ))}
                </div>

                {/* UI Overlays */}
                <div id="loader" className={`loader ${!isLoading ? 'hidden' : ''}`} ref={loaderRef}>
                    <div className="loader-text">THE DETAILING MAFIA</div>
                    <div className="loader-bar" ref={loaderBarRef}></div>
                    <div className="loader-pct" id="loader-pct" ref={loaderPctRef}>0%</div>
                </div>

                {/* ACTION HUB */}
                <div className="action-hub">
                    {/* Music Control Only */}
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
