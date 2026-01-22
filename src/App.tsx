import { useState, useEffect } from 'react'
import { themes, Theme } from './constants/themes'
import { useWebAudio } from './hooks/useWebAudio'
import SlotReel from './components/SlotReel'
import ResetModal from './components/ResetModal'

interface Action {
    name: string;
    image: string;
}

interface GameConfig {
    title: string;
    actions: Action[];
}

function App() {
    const [loading, setLoading] = useState(true)
    const [config, setConfig] = useState<GameConfig | null>(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [usedActions, setUsedActions] = useState<number[]>([])
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null)
    const [showName, setShowName] = useState(false)
    const [showFullscreen, setShowFullscreen] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
    const [showThemePicker, setShowThemePicker] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)
    const [muted, setMuted] = useState(false)

    const { playClick, playSpin, playWin, playBeep } = useWebAudio()
    const [spinHandle, setSpinHandle] = useState<{ stop: () => void } | null>(null)

    useEffect(() => {
        loadConfig()
        const savedThemeId = localStorage.getItem('kissCamTheme')
        if (savedThemeId) {
            const theme = themes.find(t => t.id === savedThemeId)
            if (theme) setCurrentTheme(theme)
        }
    }, [])

    const loadConfig = async () => {
        setLoading(true)
        let configText = ''
        if (window.electronAPI) {
            configText = await window.electronAPI.getConfig() || ''
        } else {
            try {
                const response = await fetch('./config.txt')
                if (response.ok) configText = await response.text()
            } catch (err) {
                console.error('Failed to fetch config.txt', err)
            }
        }
        if (configText) {
            parseConfig(configText)
        } else {
            setLoading(false)
        }
    }

    const parseConfig = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '')
        const actions: Action[] = []
        let title = '🎰 Kiss Cam 拉霸機 💕'
        lines.forEach(line => {
            const [key, value] = line.split('=')
            if (!key || !value) return
            const trimmedKey = key.trim()
            const trimmedValue = value.trim()
            if (trimmedKey === 'title') {
                title = trimmedValue
            } else if (trimmedKey.startsWith('action')) {
                const [name, imagePath] = trimmedValue.split(',')
                if (name && imagePath) {
                    const rawPath = imagePath.trim()
                    let imgUrl = rawPath.startsWith('http') ? rawPath : `images/${rawPath}`
                    if (window.electronAPI && !rawPath.startsWith('http')) {
                        imgUrl = `local://${imgUrl}`
                    }
                    actions.push({
                        name: name.trim(),
                        image: imgUrl
                    })
                }
            }
        })
        setConfig({ title, actions })
        setLoading(false)
    }

    const spin = () => {
        if (isSpinning || selectedActionIndex !== null || showName || showFullscreen || !config) return
        const available = config.actions.map((_, i) => i).filter(i => !usedActions.includes(i))
        if (available.length === 0) {
            playBeep();
            return
        }

        if (!muted) playClick();
        const handle = !muted ? playSpin() : null;
        setSpinHandle(handle);

        setIsSpinning(true)
        setShowFullscreen(false)
        setShowName(false)
        setSelectedActionIndex(null)

        const targetIndex = available[Math.floor(Math.random() * available.length)]

        setTimeout(() => {
            setIsSpinning(false)
            setSelectedActionIndex(targetIndex)

            setTimeout(() => {
                if (handle) handle.stop();
                setSpinHandle(null);

                setShowName(true);
                if (!muted) playWin();
                setUsedActions(prev => [...prev, targetIndex]);

                setTimeout(() => {
                    setShowFullscreen(true);
                }, 1000);
            }, 3000)
        }, 5000)
    };

    const resetGame = () => {
        if (!muted) playClick()
        if (spinHandle) spinHandle.stop();
        setSpinHandle(null);
        setUsedActions([])
        setSelectedActionIndex(null)
        setIsSpinning(false)
        setShowName(false)
        setShowFullscreen(false)
        setShowResetModal(false)
    }

    const changeTheme = (theme: Theme) => {
        setCurrentTheme(theme)
        localStorage.setItem('kissCamTheme', theme.id)
        setShowThemePicker(false)
        if (!muted) playClick()
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f7] p-4 font-['Quicksand']">
                <div className="animate-spin text-5xl mb-6">⏳</div>
                <h2 className="text-2xl text-pink-600 font-bold">載入中...</h2>
            </div>
        )
    }

    if (!config) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 font-['Quicksand']">
                <h2 className="text-3xl text-red-600 font-bold mb-6">⚠️ 設定載入失敗</h2>
                <button className="bg-red-500 text-white font-bold py-4 px-12 rounded-full" onClick={loadConfig}>重新載入</button>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen transition-all duration-1000 flex flex-col items-center font-['Quicksand'] relative overflow-hidden selection:bg-white/30"
            style={{ background: currentTheme.gradients.background }}
        >
            {/* Mesh Background Decorations */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div
                    className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse"
                    style={{ background: currentTheme.colors.primary }}
                />
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse"
                    style={{ background: currentTheme.colors.secondary }}
                />
            </div>

            {/* Top Bar */}
            <div className="w-full max-w-6xl flex justify-between items-center p-6 z-10">
                <div className="flex gap-4">
                    <button
                        className="text-4xl p-4 bg-white/10 backdrop-blur-xl rounded-3xl hover:bg-white/20 transition-all border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group active:scale-95"
                        onClick={() => { if (!muted) playClick(); setMuted(!muted); }}
                    >
                        <span className="group-hover:scale-110 inline-block transition-transform">{muted ? '🔇' : '🔊'}</span>
                    </button>
                    <button
                        className="text-4xl p-4 bg-white/10 backdrop-blur-xl rounded-3xl hover:bg-white/20 transition-all border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group active:scale-95"
                        onClick={() => { if (!muted) playClick(); setShowInstructions(true); }}
                    >
                        <span className="group-hover:rotate-12 inline-block transition-transform">📝</span>
                    </button>
                    <button
                        className="text-4xl p-4 bg-white/10 backdrop-blur-xl rounded-3xl hover:bg-white/20 transition-all border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] group active:scale-95"
                        onClick={() => { if (!muted) playClick(); setShowThemePicker(true); }}
                    >
                        <span className="group-hover:scale-110 inline-block transition-transform">🎨</span>
                    </button>
                </div>
                <button
                    className="bg-white/10 backdrop-blur-xl hover:bg-white/20 px-10 py-5 rounded-full text-xl font-black transition-all border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center gap-3 active:scale-95 group"
                    style={{ color: currentTheme.colors.text }}
                    onClick={() => { if (!muted) playClick(); setShowResetModal(true); }}
                >
                    <span className="group-hover:rotate-180 transition-transform duration-700">🔄</span>
                    <span className="hidden md:inline">重設遊戲</span>
                </button>
            </div>

            <main className="flex-1 w-full max-w-7xl flex flex-col items-center justify-center p-4 z-10 overflow-x-hidden">
                <h1
                    className="text-4xl sm:text-6xl md:text-8xl font-black mb-8 md:mb-16 text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] tracking-tighter px-4 leading-[1.1] animate-in slide-in-from-top duration-1000"
                    style={{ color: currentTheme.colors.text }}
                >
                    {config.title}
                </h1>

                {!gameStarted ? (
                    <div
                        className="w-full max-w-6xl rounded-[2.5rem] md:rounded-[4rem] shadow-[0_20px_80px_rgba(0,0,0,0.4)] p-6 md:p-20 border border-white/20 backdrop-blur-3xl transition-all duration-700 overflow-hidden relative"
                        style={{ background: currentTheme.gradients.card }}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-10 mb-10 md:mb-20 relative z-10">
                            {config.actions.map((action, i) => (
                                <div key={i} className="group flex flex-col items-center transition-all duration-500 hover:translate-y-[-10px]">
                                    <div
                                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.2)] mb-3 md:mb-6 p-1 md:p-1.5 transition-all"
                                        style={{
                                            backgroundColor: currentTheme.colors.border,
                                        }}
                                    >
                                        <img src={action.image} alt={action.name} className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[2rem] transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                    <span className="text-sm sm:text-lg md:text-2xl font-black text-center tracking-wide" style={{ color: currentTheme.colors.text }}>{action.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center relative z-10">
                            <button
                                className="group relative inline-flex items-center justify-center px-12 py-5 md:px-28 md:py-9 font-black text-xl md:text-4xl tracking-[0.1em] text-white transition-all duration-500 rounded-full shadow-[0_20px_70px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 overflow-hidden border-2 md:border-4 border-white/30"
                                onClick={() => { if (!muted) playClick(); setGameStarted(true); }}
                            >
                                <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90" style={{ background: currentTheme.gradients.primary }} />
                                <span className="relative drop-shadow-md">🚀 進入遊戲</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-6xl flex flex-col items-center animate-in fade-in duration-1000">
                        <div
                            className="mb-8 md:mb-14 py-3 md:py-4 px-8 md:px-12 rounded-full border border-white/20 text-lg md:text-2xl font-black shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all"
                            style={{ backgroundColor: currentTheme.colors.card, color: currentTheme.colors.text }}
                        >
                            <span className="opacity-70">剩餘:</span> {config.actions.length - usedActions.length} <span className="mx-2 opacity-30">|</span> <span className="opacity-70">抽過:</span> {usedActions.length}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-10 md:mb-20 px-4">
                            {[0, 1, 2].map(i => (
                                <SlotReel
                                    key={i}
                                    isSpinning={isSpinning}
                                    targetIndex={selectedActionIndex}
                                    actions={config.actions}
                                    theme={currentTheme}
                                    delay={i * 200}
                                />
                            ))}
                        </div>

                        <div className="text-center min-h-[60px] md:min-h-[100px] mb-6 md:mb-10 px-4">
                            <h2
                                className={`text-3xl sm:text-5xl md:text-7xl font-black transition-all duration-1000 tracking-tight drop-shadow-2xl ${showName ? 'opacity-100 scale-110 blur-0' : 'opacity-0 scale-90 blur-xl'}`}
                                style={{ color: currentTheme.colors.text }}
                            >
                                {selectedActionIndex !== null ? `✨ ${config.actions[selectedActionIndex].name} ✨` : ''}
                            </h2>
                        </div>

                        <div className="text-center pb-10 md:pb-20">
                            <button
                                className={`group relative inline-flex items-center justify-center px-12 py-6 md:px-24 md:py-10 font-black text-xl md:text-4xl tracking-[0.1em] md:tracking-[0.15em] text-white transition-all duration-500 rounded-full shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden border-2 md:border-4 border-white/30 ${isSpinning || selectedActionIndex !== null || showName || showFullscreen ? 'opacity-40 grayscale cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
                                onClick={spin}
                                disabled={isSpinning || selectedActionIndex !== null || showName || showFullscreen}
                            >
                                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: currentTheme.gradients.primary }} />
                                <span className="relative drop-shadow-lg">🎰 開始轉動</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* instructions Modal (Fancy) */}
            {showInstructions && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
                    <div
                        className="rounded-[4rem] p-12 max-w-xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-10 border border-white/20 relative overflow-hidden animate-in zoom-in duration-500"
                        style={{ background: currentTheme.gradients.card }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tight" style={{ color: currentTheme.colors.text }}>遊戲說明 📜</h2>
                        <div className="space-y-4 md:space-y-6 text-lg md:text-xl font-bold leading-relaxed" style={{ color: currentTheme.colors.text }}>
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                                <span className="text-2xl md:text-3xl">🚀</span>
                                <p>點擊「進入遊戲」展開每一場獨特的發現旅程。</p>
                            </div>
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                                <span className="text-2xl md:text-3xl">🎰</span>
                                <p>按下「開始轉動」，捲軸將帶領你探尋甜美動態。</p>
                            </div>
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                                <span className="text-2xl md:text-3xl">✨</span>
                                <p>隨機選出的照片將永久珍藏於本輪記錄中。</p>
                            </div>
                            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                                <span className="text-2xl md:text-3xl">🔄</span>
                                <p>隨時點擊「重設遊戲」來清空進度重新開始。</p>
                            </div>
                        </div>
                        <button
                            className="w-full py-5 md:py-7 rounded-full text-white font-black text-2xl md:text-3xl transition-all active:scale-95 shadow-2xl border-b-8 border-black/20"
                            style={{ background: currentTheme.gradients.primary }}
                            onClick={() => { if (!muted) playClick(); setShowInstructions(false); }}
                        >
                            出發吧！
                        </button>
                    </div>
                </div>
            )}

            {/* Theme Picker (Fancy) */}
            {showThemePicker && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-xl animate-in fade-in duration-500">
                    <div
                        className="rounded-[4rem] p-10 max-w-4xl w-full shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/20 space-y-10 animate-in slide-in-from-bottom duration-500"
                        style={{ background: currentTheme.gradients.card }}
                    >
                        <h2 className="text-4xl font-black text-center tracking-tight" style={{ color: currentTheme.colors.text }}>切換時空背景 🔮</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {themes.map(t => (
                                <button
                                    key={t.id}
                                    className={`p-8 rounded-[3rem] border-4 transition-all hover:scale-105 group relative overflow-hidden ${currentTheme.id === t.id ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'border-transparent shadow-xl'}`}
                                    style={{ background: t.gradients.background }}
                                    onClick={() => changeTheme(t)}
                                >
                                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-white" />
                                    <div className="relative z-10 text-6xl mb-6 drop-shadow-lg group-hover:animate-bounce">{t.icon}</div>
                                    <div className="relative z-10 font-black text-xl leading-tight" style={{ color: t.colors.text }}>{t.name}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            className="w-full bg-white/10 hover:bg-white/20 py-7 rounded-[3rem] text-2xl font-black transition-all border border-white/20"
                            style={{ color: currentTheme.colors.text }}
                            onClick={() => setShowThemePicker(false)}
                        >
                            關閉選單
                        </button>
                    </div>
                </div>
            )}

            {/* Results Fullscreen (Fancy) */}
            {showFullscreen && selectedActionIndex !== null && (
                <div
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-2xl cursor-pointer animate-in fade-in duration-1000"
                    onClick={() => {
                        setShowFullscreen(false);
                        setShowName(false);
                        setSelectedActionIndex(null);
                    }}
                >
                    <div className="text-center relative max-w-6xl w-full animate-in zoom-in duration-1000">
                        {/* Sparkles/Glow behind image */}
                        <div
                            className="absolute inset-0 blur-[150px] opacity-40 animate-pulse"
                            style={{ background: currentTheme.gradients.primary }}
                        />

                        <div className="relative rounded-[5rem] overflow-hidden border-[16px] border-white shadow-[0_0_120px_rgba(255,255,255,0.4)] transition-all">
                            <img src={config.actions[selectedActionIndex].image} className="w-full h-auto max-h-[60vh] md:max-h-[75vh] object-contain" alt="" />
                        </div>

                        <div className="mt-8 md:mt-16 space-y-4 relative">
                            <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-white italic drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] tracking-widest uppercase">
                                {config.actions[selectedActionIndex].name}
                            </h2>
                            <p className="text-white/40 text-xl md:text-3xl font-black tracking-[0.2em] animate-pulse uppercase">TAP TO CONTINUE</p>
                        </div>
                    </div>
                </div>
            )}

            <ResetModal
                show={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={resetGame}
                currentTheme={currentTheme}
            />
        </div>
    )
}

export default App
