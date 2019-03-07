import { Injectable } from "@angular/core";
import { PropertySearchView } from "../models/propertySearch";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})

export class PropertySearchViewService {

    toReturn: PropertySearchView;

    constructor(private http: HttpClient) {}
}
