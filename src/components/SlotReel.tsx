import React, { useEffect, useState, useRef } from 'react';
import { Theme } from '../constants/themes';

interface Action {
    name: string;
    image: string;
}

interface SlotReelProps {
    isSpinning: boolean;
    targetIndex: number | null;
    actions: Action[];
    theme: Theme;
    delay: number;
}

const SlotReel: React.FC<SlotReelProps> = ({ isSpinning, targetIndex, actions, theme, delay }) => {
    const [offset, setOffset] = useState(0);
    const [items, setItems] = useState<Action[]>([]);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    // Responsive item height calculation
    const [itemHeight, setItemHeight] = useState(384);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth < 768) {
                setItemHeight(208); // Equivalent for mobile (smaller)
            } else {
                setItemHeight(384); // Equivalent for desktop
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (actions.length > 0) {
            const repeatedActions = Array.from({ length: 50 }, () => actions).flat();
            setItems(repeatedActions);
        }
    }, [actions]);

    const animate = (time: number) => {
        if (lastTimeRef.current !== undefined) {
            const deltaTime = time - lastTimeRef.current;
            const speed = 1.8; // Even faster for "Fancy" feel
            setOffset(prev => {
                const newOffset = prev + speed * deltaTime;
                const maxOffset = actions.length * 20 * itemHeight;
                return newOffset > maxOffset ? (actions.length * 10 * itemHeight) : newOffset;
            });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isSpinning) {
            lastTimeRef.current = undefined;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (targetIndex !== null && items.length > 0) {
                const baseRepeat = 25;
                const targetPos = (baseRepeat * actions.length + targetIndex) * itemHeight;

                const timer = setTimeout(() => {
                    setOffset(targetPos);
                }, delay);
                return () => clearTimeout(timer);
            } else if (targetIndex === null) {
                setOffset(0);
            }
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isSpinning, targetIndex, actions.length, delay, items.length, itemHeight]);

    const getTransition = () => {
        if (isSpinning || targetIndex === null) return 'none';
        return 'transform 3000ms cubic-bezier(0.1, 0, 0.1, 1)'; // Slower deceleration for drama
    };

    return (
        <div
            ref={containerRef}
            className="w-32 h-44 md:w-72 md:h-96 rounded-[2rem] md:rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(0,0,0,0.2)] border-4 md:border-[12px] overflow-hidden relative group transition-all duration-700"
            style={{
                backgroundColor: theme.reel.background,
                borderColor: theme.reel.border,
                boxShadow: `0 20px 50px rgba(0,0,0,0.3), inset 0 0 40px ${theme.colors.glow}`
            }}
        >
            <div
                className="absolute left-0 right-0 flex flex-col items-center"
                style={{
                    transform: `translateY(-${offset}px)`,
                    transition: getTransition(),
                }}
            >
                {items.map((action, i) => (
                    <div
                        key={i}
                        className="w-full h-44 md:h-96 flex-shrink-0 flex items-center justify-center p-4 md:p-8"
                    >
                        <div
                            className="w-full h-full p-1 md:p-2 bg-white/5 rounded-[1.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl transition-transform duration-700 hover:scale-105"
                            style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.1)` }}
                        >
                            <img
                                src={action.image}
                                className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[2.5rem]"
                                alt=""
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Inner Overlays for Depth */}
            <div className="absolute inset-x-0 top-0 h-16 md:h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-16 md:h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />

            {/* Center Highlight */}
            <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/20 z-30 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
        </div>
    );
};

export default SlotReel;
