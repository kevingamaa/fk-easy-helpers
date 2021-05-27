export type KfEnvType = {
    prod?: any,
    api?: string,
    host?: string,
    mainPath?: string,
    storage?: string,
    breakpoints?: {
        mobile?:  string
    },
    observerType: 'body' | 'response'
};
