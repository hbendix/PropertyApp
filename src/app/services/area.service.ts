import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Area } from "../models/area";

@Injectable({
    providedIn: "root"
})

export class AreaService {

    constructor(private http: HttpClient) {}

    public getArea (): Area {
        return new Area ('1', 'Croydon', 'Flats', 'CR', 760000, 3);
    }

}