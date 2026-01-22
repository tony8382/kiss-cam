export interface Theme {
    id: string;
    name: string;
    icon: string;
    colors: {
        background: string;
        card: string;
        text: string;
        primary: string;
        secondary: string;
        accent: string;
        border: string;
        glow: string; // New glow property
    };
    gradients: {
        primary: string;
        background: string;
        card: string; // New card gradient
    };
    reel: {
        background: string;
        border: string;
    };
}

export const themes: Theme[] = [
    {
        id: 'romantic',
        name: '浪漫粉紅 (Romantic Pink)',
        icon: '💖',
        colors: {
            background: '#fff5f7',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#9d174d',
            primary: '#f472b6',
            secondary: '#ec4899',
            accent: '#e11d48',
            border: 'rgba(251, 207, 232, 0.5)',
            glow: 'rgba(244, 114, 182, 0.4)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
            background: 'radial-gradient(circle at top left, #fff1f2 0%, #fff5f7 40%, #fee2e2 100%)',
            card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
        },
        reel: {
            background: '#ffffff',
            border: '#fbcfe8',
        }
    },
    {
        id: 'midnight',
        name: '午夜金迷 (Midnight Gold)',
        icon: '🌙',
        colors: {
            background: '#0f172a',
            card: 'rgba(30, 41, 59, 0.7)',
            text: '#fde047',
            primary: '#ca8a04',
            secondary: '#a16207',
            accent: '#eab308',
            border: 'rgba(202, 138, 4, 0.3)',
            glow: 'rgba(202, 138, 4, 0.5)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #fde047 0%, #ca8a04 50%, #854d0e 100%)',
            background: 'radial-gradient(circle at bottom right, #1e293b 0%, #0f172a 60%, #020617 100%)',
            card: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.6) 100%)',
        },
        reel: {
            background: '#1e293b',
            border: '#ca8a04',
        }
    },
    {
        id: 'cyberpunk',
        name: '霓虹電路 (Cyber Neon)',
        icon: '⚡',
        colors: {
            background: '#050505',
            card: 'rgba(10, 10, 10, 0.8)',
            text: '#00fff2',
            primary: '#ff00ff',
            secondary: '#00fff2',
            accent: '#7000ff',
            border: 'rgba(255, 0, 255, 0.4)',
            glow: 'rgba(0, 255, 242, 0.6)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #ff00ff 0%, #7000ff 100%)',
            background: 'conic-gradient(from 0deg at 50% 50%, #050505 0%, #1a0033 25%, #050505 50%, #001a1a 75%, #050505 100%)',
            card: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(5, 5, 5, 0.8) 100%)',
        },
        reel: {
            background: '#0a0a0a',
            border: '#ff00ff',
        }
    },
    {
        id: 'aurora',
        name: '極光星海 (Aurora Sky)',
        icon: '🌌',
        colors: {
            background: '#001219',
            card: 'rgba(0, 18, 25, 0.6)',
            text: '#94fbab',
            primary: '#0a9396',
            secondary: '#94fbab',
            accent: '#ee9b00',
            border: 'rgba(148, 251, 171, 0.3)',
            glow: 'rgba(10, 147, 150, 0.6)',
        },
        gradients: {
            primary: 'linear-gradient(135deg, #0a9396 0%, #94fbab 100%)',
            background: 'linear-gradient(215deg, #001219 0%, #005f73 50%, #0a9396 100%)',
            card: 'linear-gradient(135deg, rgba(0, 95, 115, 0.4) 0%, rgba(0, 18, 25, 0.7) 100%)',
        },
        reel: {
            background: '#001219',
            border: '#0a9396',
        }
    }
];
