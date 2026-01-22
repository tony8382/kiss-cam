import { useState, useEffect, useCallback } from 'react';

export const useWebAudio = () => {
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

    useEffect(() => {
        const initCtx = () => {
            if (!audioCtx) {
                setAudioCtx(new (window.AudioContext || (window as any).webkitAudioContext)());
            }
        };
        window.addEventListener('click', initCtx, { once: true });
        return () => window.removeEventListener('click', initCtx);
    }, [audioCtx]);

    const playClick = useCallback(() => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }, [audioCtx]);

    const playSpin = useCallback(() => {
        if (!audioCtx) return null;

        const playClickSound = () => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(120 + Math.random() * 40, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        };

        const interval = setInterval(playClickSound, 80);

        return {
            stop: () => {
                clearInterval(interval);
            }
        };
    }, [audioCtx]);

    const playWin = useCallback(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const playNote = (freq: number, start: number, duration: number) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(now + duration + 0.1);
        };
        playNote(523.25, now, 0.5);
        playNote(659.25, now + 0.1, 0.5);
        playNote(783.99, now + 0.2, 0.5);
        playNote(1046.50, now + 0.3, 0.8);
    }, [audioCtx]);

    const playBeep = useCallback(() => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }, [audioCtx]);

    return { playClick, playSpin, playWin, playBeep };
};
