export type KfEnvType = {
    prod?: any,
    api?: string,
    host?: string,
    mainPath?: string,
    storage?: string,
    breakpoints?: {
        mobile?:  string
    },
    alertCtrl?: { type: 'ionic' | 'material', class: any },
    toastCtrl?: { type: 'ionic' | 'ngx-toastr' | 'material', class: any },
    observerType: 'body' | 'response'
};
