import { Injectable } from '@angular/core';
import { ModelRest } from './model-rest.service';

@Injectable({
    providedIn: 'root'
})
export class RequestService extends ModelRest {
    setPath(path: string) {
        this.apiUrl = path;
        return this;
    }

}






