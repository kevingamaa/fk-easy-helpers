import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
    providedIn: 'root'
})
export class ModelRest {


    protected host: string = '';
    protected main_path: string = '';
    protected apiUrl = '';
    public element: any;
    public custons: any = {
        addUrl: ''
    };
    public paginate: any = {
        total: 0,
        per_page: 0,
        from: 0
    };

    public errorToastr: any;

    public storageUrl: string;
    public observerRequest: any;
    constructor(
        protected http: HttpClient,
        public helper: HelperService
    ) {
        let mainPath = helper.env.mainPath;
        if (mainPath) {
            if (mainPath.substr(-1) !== '/') {
                mainPath += '/';
            }
        } else {
            mainPath = '';
        }

        this.main_path = mainPath;
        this.host = helper.env.host;
        this.storageUrl = helper.env.storage;
        this.observerRequest = helper.env.observerType?helper.env.observerType: 'body';
    }
    public get url() {
        const url = this.host + this.main_path + this.apiUrl + (this.custons.addUrl ? '/' + this.custons.addUrl : '');
        this.options({ clear: true });
        return url;

    }


    public getHttp(): HttpClient {
        return this.http;
    }

    public get(parans?: any): Observable<any> {

        return this.http.get<any>(`${this.url}${this.parans(parans)}`, { observe: this.observerRequest });

    }

    public post(data: any): Observable<any> {
        return this.http.post<any>(`${this.url}`, data, { observe: this.observerRequest });
    }

    public find(id: number) {
        return this.http.get<any>(`${this.url}/show?id=${id}`, { observe: this.observerRequest });
    }

    public create(data: any): Observable<any> {
        return this.http.post<any>(`${this.url}/create`, data, { observe: this.observerRequest });
    }



    public options(options: {addUrl?: string, clear?: boolean}) {
        this.custons = options;
        if (options.clear) {
            this.custons = {};
        }

        return this;
    }



    public update(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.url}/update?id=${id}`, data, { observe: this.observerRequest });
    }

    public delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.url}/delete?id=${id}`, { observe: this.observerRequest });
    }

    public parans(parans) {
        let urlParans = '?';
        for (const i in parans) {
            if (i) {
                if (Array.isArray(parans[i]) || typeof parans[i] === 'object') {
                    urlParans += `${i}=${JSON.stringify(parans[i])}&`;
                } else {
                    urlParans += `${i}=${parans[i]}&`;
                }
            }
        }

        urlParans = urlParans.replace(/[%]/g, '%25').slice(0, -1);
        // urlParans = urlParans.replace(/["]/g, '');
        return urlParans;
    }


    public errorMsgs(error: any) {
        if (typeof this.errorToastr === 'function') {
            this.errorToastr(error);
        } else {
            console.error(error, 'no error');
        }
    }

    protected handleLoop(errors) {
        // console.log(errors)
        if (typeof errors === 'string') {
            this.errorMsgs(errors);
        } else {
            for (const i in errors) {
                if (i) {
                    this.errorMsgs(errors[i]);
                }
            }
        }

    }

    public handleError(response: any) {
        let errorMessage = '';
        if (response.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${response.error.message}`;
        } else {
            if (response.error.errors) {
                if (response.error.errors) {
                    this.handleLoop(response.error.errors);
                    errorMessage = response.error.errors;
                } else if (response.error.error) {
                    this.handleLoop(response.error.error);
                    errorMessage = response.error.errors;
                } else {
                    this.errorMsgs(response.error.message);
                    errorMessage = response.error.message;
                }
            } else {
                this.errorMsgs(response.message);
                errorMessage = response.message;
            }
        }

        return throwError(errorMessage);
    }

}






