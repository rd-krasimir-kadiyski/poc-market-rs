import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ParentData} from "./parent-data";
import {Sequence} from "./sequence";

// @ts-ignore
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  unorderedList: ParentData[] = [
    {
      code: "011",
      name: "RINDFLEISCH BED. - PARENT",
      order: 1,
      children: [
        {code: "0111", name: "RINDFLEISCH BED."},
        {code: "0112", name: "RINDFLEISCH BED. PREMIUM"},
        {code: "0113", name: "HACKFLEISCHPRODUKTE BED."},
        {code: "0114", name: "RINDFLEISCH CONV. BED."},
        {code: "0117", name: "UNGÜLTIG"},
        {code: "0118", name: "UNGÜLTIG"},
        {code: "0119", name: "BIO RINDFLEISC.BED. 12/21"},
      ],
    },
    {
      code: "012",
      name: "RINDFLEISCH SB - PARENT",
      order: 2,
      children: [
        {code: "0121", name: "RINDFLEISCH SB"},
        {code: "0122", name: "RINDFLEISCH SB PREMIUM"},
        {code: "0123", name: "RINDFLEISCH HACKFLEISCHPROD. SB"},
        {code: "0124", name: "RINDFLEISCH CONV. SB"},
        {code: "0126", name: "RINDFLEISCH LANDMARKT HA10"},
        {code: "0129", name: "BIO RINDFLEISCH SB 12/21"},
      ],
    },
    {
      code: "015",
      name: "SAMMELGRUPPE FLEISCH - BED/SB - PARENT",
      order: 3,
      children: [
        {code: "0151", name: "FIXTASTE FLEISCH BED."},
        {code: "0152", name: "SAMMELGR.FLEISCH SERVICE-SB"},
        {code: "0154", name: "UNGÜLTIG"},
        {code: "0155", name: "Fremdkauf HA 30 Service E-MWST"},
        {code: "0156", name: "Fremdkauf HA 30 Service V-MWST"},
      ],
    },
    {
      code: "021",
      name: "SCHWEINEFLEISCH BED. - PARENT",
      order: 4,
      children: [
        {code: "0211", name: "SCHWEINEFLEISCH BED."},
        {code: "0212", name: "KASSELER BED."},
        {code: "0213", name: "SCHWEINEFLEISCH HACKFL.-PROD BED"},
        {code: "0214", name: "SCHWEINEFLEISCH CONV. BED."},
        {code: "0215", name: "SCHWEINEFLEISCH SAISON BED."},
        {code: "0219", name: "BIO SCHWEINEFLEISC.BED. 12/21"},
      ],
    },
  ];


  flatRS: Sequence[] = [
    {order: 1, code: "011", level: "L3"},
    {order: 2, code: "012", level: "L3"},
    {order: 3, code: "0112", level: "L4"},
    {order: 4, code: "0113", level: "L4"},
    {order: 5, code: "0123", level: "L4"},
    {order: 6, code: "015", level: "L3"},
    {order: 7, code: "021", level: "L3"},
    {order: 8, code: "0155", level: "L4"},
  ];

  returnNewRS(oldRS: Sequence[], categories: ParentData[]) {
    let newRS: ParentData[] = [];
    for (let i = 0; i < oldRS.length; i++) {
      let current = oldRS[i]
      let isL3: boolean = current.level === 'L3'

      if (isL3) {
        let L3 = categories.find(c => c.code === current.code)!;
        newRS.push(L3);
      } else {
        const L3 = categories.find((category) =>
          category.children?.some((child) => child.code === current.code))!;
        const filteredChildren = L3.children?.filter((child) => child.code === current.code);
        const updatedL3: ParentData = {
          ...L3,
          children: filteredChildren,
        };
        newRS.push(updatedL3);
      }
    }
    return newRS
  }

  enrichNewRS(newRS: ParentData[], L4ForEnrichment: Sequence[]) {
    for (let i = 0; i < L4ForEnrichment.length; i++) {

      let current: Sequence = L4ForEnrichment[i];
      if (current.level === 'L4') {
        const L3: ParentData = newRS.find((e) =>
          e.children?.some((child) => child.code === current.code))!;
        L3.isSeparated = true;
        L3.children.find(c => c.code === current.code)!.isGreyOut = true;
      }
    }
    return newRS;
  }


  ngOnInit(): void {
    let parentData = this.returnNewRS(this.flatRS, this.unorderedList);
    debugger;
    let finalRS = this.enrichNewRS(parentData, this.flatRS);
    debugger;
  }
}
