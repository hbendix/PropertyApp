import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker, dateProperty } from "tns-core-modules/ui/date-picker";

@Component({
    moduleId: module.id,
    templateUrl: "./chart-dialogue.component.html",
})
export class ChartDialogueComponent implements OnInit {
    data: any[] = [];
    toBeCalc: any;
    constructor(private params: ModalDialogParams) {
        this.toBeCalc = params.context.saleHistory;

    }

    ngOnInit() {
        let dividedBy = 0;
        if (this.toBeCalc.length > 7) {
            dividedBy = this.toBeCalc.length / 7;
            dividedBy = Math.floor(dividedBy);
            for (let i  = 0; i < this.toBeCalc.length; i++) {
                if (i === 0) {
                    this.data.push({
                        "price": this.toBeCalc[i].price,
                        "date": this.toBeCalc[i].date,
                    });
                } else {
                    //x and y are both integers
                    const remainder = i % dividedBy;
                    if (remainder == 0){
                        this.data.push({
                            "price": this.toBeCalc[i].price,
                            "date": this.toBeCalc[i].date,
                        });
                    } 
                    // else {
                        
                    //     this.data.push({
                    //         "price": this.toBeCalc[i].price,
                    //         "date": blankSpace,
                    //     });

                    //     blankSpace = blankSpace + " ";
                    // }
                }
            }
        } else {
            this.data = this.toBeCalc;
        }
        
        
        console.log(this.data);
    }

    public submit() {
    }
}
