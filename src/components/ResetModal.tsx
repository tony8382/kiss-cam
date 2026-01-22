import React from 'react';
import { Theme } from '../constants/themes';

interface ResetModalProps {
    show: boolean;
    onConfirm: () => void;
    onClose: () => void;
    currentTheme: Theme;
}

const ResetModal: React.FC<ResetModalProps> = ({ show, onConfirm, onClose, currentTheme }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-2xl animate-in fade-in duration-500">
            <div
                className="w-full max-w-lg rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-12 overflow-hidden relative border border-white/20 animate-in zoom-in duration-500"
                style={{ background: currentTheme.gradients.card }}
            >
                {/* Decorative Background Element */}
                <div
                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20"
                    style={{ background: currentTheme.colors.primary }}
                />

                <div className="text-center relative z-10">
                    <div className="text-8xl mb-8 drop-shadow-2xl animate-bounce">⚠️</div>
                    <h3
                        className="text-4xl font-black mb-6 tracking-tight"
                        style={{ color: currentTheme.colors.text }}
                    >
                        確定要重設遊戲？
                    </h3>
                    <p
                        className="text-xl mb-12 font-bold opacity-80 leading-relaxed"
                        style={{ color: currentTheme.colors.text }}
                    >
                        這將會清除所有已抽取的記錄，<br />
                        讓原本的驚喜重新開始。
                    </p>

                    <div className="flex flex-col gap-5">
                        <button
                            className="group relative w-full py-6 rounded-full text-white font-black text-2xl shadow-[0_15px_45px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden border-b-8 border-black/20"
                            style={{ background: currentTheme.gradients.primary }}
                            onClick={onConfirm}
                        >
                            <span className="relative z-10">是的，重新開始</span>
                        </button>
                        <button
                            className="w-full py-5 rounded-full font-black text-xl transition-all hover:bg-white/10 active:scale-95"
                            style={{ color: currentTheme.colors.text }}
                            onClick={onClose}
                        >
                            暫時取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetModal;
