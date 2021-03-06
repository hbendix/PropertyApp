import { Injectable } from "@angular/core";
import { FilterView } from "../models/filter";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: "root"
})

export class FilterViewService {

    toReturn: FilterView;

    constructor(private http: HttpClient) {}
}
