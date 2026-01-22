declare global {
    interface Window {
        electronAPI: {
            getConfig: () => Promise<string | null>;
            readFile: (filePath: string) => Promise<string | null>;
            onMainMessage: (callback: (message: string) => void) => void;
        }
    }
}

export { };
