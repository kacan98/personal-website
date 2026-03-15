declare global {
    interface Window {
        chrome?: typeof chrome;
        __cvTailorInjected?: boolean;
    }
}

export { };
