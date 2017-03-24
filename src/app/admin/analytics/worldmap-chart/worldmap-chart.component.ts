import { Component, Input, OnChanges } from '@angular/core';
import { Country } from '../../../profile/country';
import * as chroma from 'chroma-js';

@Component({
  selector: 'worldmap-chart',
  templateUrl: './worldmap-chart.component.html',
  styleUrls: [
    './worldmap-chart.component.styl'
  ]
})

export class WorldChartComponent implements OnChanges {
  @Input() data: any;

  selectedCountry: string;
  selectedCount: number;

  chartData = {
    'AE': { name: '', count: '', fill: '' },
    'AF': { name: '', count: '', fill: '' },
    'AL': { name: '', count: '', fill: '' },
    'AM': { name: '', count: '', fill: '' },
    'AO': { name: '', count: '', fill: '' },
    'AR': { name: '', count: '', fill: '' },
    'AT': { name: '', count: '', fill: '' },
    'AU': { name: '', count: '', fill: '' },
    'AZ': { name: '', count: '', fill: '' },
    'BA': { name: '', count: '', fill: '' },
    'BD': { name: '', count: '', fill: '' },
    'BE': { name: '', count: '', fill: '' },
    'BF': { name: '', count: '', fill: '' },
    'BG': { name: '', count: '', fill: '' },
    'BI': { name: '', count: '', fill: '' },
    'BJ': { name: '', count: '', fill: '' },
    'BN': { name: '', count: '', fill: '' },
    'BO': { name: '', count: '', fill: '' },
    'BR': { name: '', count: '', fill: '' },
    'BS': { name: '', count: '', fill: '' },
    'BT': { name: '', count: '', fill: '' },
    'BW': { name: '', count: '', fill: '' },
    'BY': { name: '', count: '', fill: '' },
    'BZ': { name: '', count: '', fill: '' },
    'CA': { name: '', count: '', fill: '' },
    'CD': { name: '', count: '', fill: '' },
    'CF': { name: '', count: '', fill: '' },
    'CG': { name: '', count: '', fill: '' },
    'CH': { name: '', count: '', fill: '' },
    'CI': { name: '', count: '', fill: '' },
    'CL': { name: '', count: '', fill: '' },
    'CM': { name: '', count: '', fill: '' },
    'CN': { name: '', count: '', fill: '' },
    'CO': { name: '', count: '', fill: '' },
    'CR': { name: '', count: '', fill: '' },
    'CU': { name: '', count: '', fill: '' },
    'CY': { name: '', count: '', fill: '' },
    'CZ': { name: '', count: '', fill: '' },
    'DE': { name: '', count: '', fill: '' },
    'DJ': { name: '', count: '', fill: '' },
    'DK': { name: '', count: '', fill: '' },
    'DO': { name: '', count: '', fill: '' },
    'DZ': { name: '', count: '', fill: '' },
    'EC': { name: '', count: '', fill: '' },
    'EE': { name: '', count: '', fill: '' },
    'EG': { name: '', count: '', fill: '' },
    'EH': { name: '', count: '', fill: '' },
    'ER': { name: '', count: '', fill: '' },
    'ES': { name: '', count: '', fill: '' },
    'ET': { name: '', count: '', fill: '' },
    'FK': { name: '', count: '', fill: '' },
    'FI': { name: '', count: '', fill: '' },
    'FJ': { name: '', count: '', fill: '' },
    'FR': { name: '', count: '', fill: '' },
    'GA': { name: '', count: '', fill: '' },
    'GB': { name: '', count: '', fill: '' },
    'GE': { name: '', count: '', fill: '' },
    'GF': { name: '', count: '', fill: '' },
    'GH': { name: '', count: '', fill: '' },
    'GL': { name: '', count: '', fill: '' },
    'GM': { name: '', count: '', fill: '' },
    'GN': { name: '', count: '', fill: '' },
    'GQ': { name: '', count: '', fill: '' },
    'GR': { name: '', count: '', fill: '' },
    'GT': { name: '', count: '', fill: '' },
    'GW': { name: '', count: '', fill: '' },
    'GY': { name: '', count: '', fill: '' },
    'HN': { name: '', count: '', fill: '' },
    'HR': { name: '', count: '', fill: '' },
    'HT': { name: '', count: '', fill: '' },
    'HU': { name: '', count: '', fill: '' },
    'ID': { name: '', count: '', fill: '' },
    'IE': { name: '', count: '', fill: '' },
    'IL': { name: '', count: '', fill: '' },
    'IN': { name: '', count: '', fill: '' },
    'IQ': { name: '', count: '', fill: '' },
    'IR': { name: '', count: '', fill: '' },
    'IS': { name: '', count: '', fill: '' },
    'IT': { name: '', count: '', fill: '' },
    'JM': { name: '', count: '', fill: '' },
    'JO': { name: '', count: '', fill: '' },
    'JP': { name: '', count: '', fill: '' },
    'KE': { name: '', count: '', fill: '' },
    'KG': { name: '', count: '', fill: '' },
    'KH': { name: '', count: '', fill: '' },
    'KP': { name: '', count: '', fill: '' },
    'KR': { name: '', count: '', fill: '' },
    'XK': { name: '', count: '', fill: '' },
    'KW': { name: '', count: '', fill: '' },
    'KZ': { name: '', count: '', fill: '' },
    'LA': { name: '', count: '', fill: '' },
    'LB': { name: '', count: '', fill: '' },
    'LK': { name: '', count: '', fill: '' },
    'LR': { name: '', count: '', fill: '' },
    'LS': { name: '', count: '', fill: '' },
    'LT': { name: '', count: '', fill: '' },
    'LU': { name: '', count: '', fill: '' },
    'LV': { name: '', count: '', fill: '' },
    'LY': { name: '', count: '', fill: '' },
    'MA': { name: '', count: '', fill: '' },
    'MD': { name: '', count: '', fill: '' },
    'ME': { name: '', count: '', fill: '' },
    'MG': { name: '', count: '', fill: '' },
    'MK': { name: '', count: '', fill: '' },
    'ML': { name: '', count: '', fill: '' },
    'MM': { name: '', count: '', fill: '' },
    'MN': { name: '', count: '', fill: '' },
    'MR': { name: '', count: '', fill: '' },
    'MW': { name: '', count: '', fill: '' },
    'MX': { name: '', count: '', fill: '' },
    'MY': { name: '', count: '', fill: '' },
    'MZ': { name: '', count: '', fill: '' },
    'NA': { name: '', count: '', fill: '' },
    'NC': { name: '', count: '', fill: '' },
    'NE': { name: '', count: '', fill: '' },
    'NG': { name: '', count: '', fill: '' },
    'NI': { name: '', count: '', fill: '' },
    'NL': { name: '', count: '', fill: '' },
    'NO': { name: '', count: '', fill: '' },
    'NP': { name: '', count: '', fill: '' },
    'NZ': { name: '', count: '', fill: '' },
    'OM': { name: '', count: '', fill: '' },
    'PA': { name: '', count: '', fill: '' },
    'PE': { name: '', count: '', fill: '' },
    'PG': { name: '', count: '', fill: '' },
    'PH': { name: '', count: '', fill: '' },
    'PL': { name: '', count: '', fill: '' },
    'PK': { name: '', count: '', fill: '' },
    'PR': { name: '', count: '', fill: '' },
    'PS': { name: '', count: '', fill: '' },
    'PT': { name: '', count: '', fill: '' },
    'PY': { name: '', count: '', fill: '' },
    'QA': { name: '', count: '', fill: '' },
    'RO': { name: '', count: '', fill: '' },
    'RS': { name: '', count: '', fill: '' },
    'RU': { name: '', count: '', fill: '' },
    'RW': { name: '', count: '', fill: '' },
    'SA': { name: '', count: '', fill: '' },
    'SB': { name: '', count: '', fill: '' },
    'SD': { name: '', count: '', fill: '' },
    'SE': { name: '', count: '', fill: '' },
    'SI': { name: '', count: '', fill: '' },
    'SJ': { name: '', count: '', fill: '' },
    'SK': { name: '', count: '', fill: '' },
    'SL': { name: '', count: '', fill: '' },
    'SN': { name: '', count: '', fill: '' },
    'SO': { name: '', count: '', fill: '' },
    'SR': { name: '', count: '', fill: '' },
    'SS': { name: '', count: '', fill: '' },
    'SV': { name: '', count: '', fill: '' },
    'SY': { name: '', count: '', fill: '' },
    'SZ': { name: '', count: '', fill: '' },
    'TD': { name: '', count: '', fill: '' },
    'TF': { name: '', count: '', fill: '' },
    'TG': { name: '', count: '', fill: '' },
    'TH': { name: '', count: '', fill: '' },
    'TJ': { name: '', count: '', fill: '' },
    'TL': { name: '', count: '', fill: '' },
    'TM': { name: '', count: '', fill: '' },
    'TN': { name: '', count: '', fill: '' },
    'TR': { name: '', count: '', fill: '' },
    'TT': { name: '', count: '', fill: '' },
    'TW': { name: '', count: '', fill: '' },
    'TZ': { name: '', count: '', fill: '' },
    'UA': { name: '', count: '', fill: '' },
    'UG': { name: '', count: '', fill: '' },
    'US': { name: '', count: '', fill: '' },
    'UY': { name: '', count: '', fill: '' },
    'UZ': { name: '', count: '', fill: '' },
    'VE': { name: '', count: '', fill: '' },
    'VN': { name: '', count: '', fill: '' },
    'VU': { name: '', count: '', fill: '' },
    'YE': { name: '', count: '', fill: '' },
    'ZA': { name: '', count: '', fill: '' },
    'ZM': { name: '', count: '', fill: '' },
    'ZW': { name: '', count: '', fill: '' }
  };

  constructor() {
    // fill chart data with real country names
    Country.list.map(item => {
      if (this.chartData.hasOwnProperty(item.code)) {
        this.chartData[item.code].name = item.name;
      }
    });
  }

  /**
   * Generates chart data from @input
   */
  fillChart() {
    if (!this.data.length) {
      return;
    }

    const max = Math.max.apply(Math, this.data.map(o => o.count));
    const scale = chroma.scale(['#ffffe0', '#8b0000']).domain([0, max], 7, 'log');

    this.data.map(item => {
      // 'cc' = 'country code'
      const cc = item._id;

      if (cc && this.chartData.hasOwnProperty(cc)) {
        this.chartData[cc].count = item.count;
        this.chartData[cc].fill = scale(item.count);
      } else if (cc === null) {
        this.selectedCountry = 'Unknown';
        this.selectedCount = item.count ? item.count : 0;
      }
    });
  }

  /**
   * Change selected country on map by clicking on it
   * @param evt Click event
   */
  viewStats(evt) {
    if (!evt || evt.target.tagName !== 'path') {
      return;
    }

    const selection = evt.target.id && this.chartData.hasOwnProperty(evt.target.id)
      ? this.chartData[evt.target.id]
      : null;

    if (selection) {
      this.selectedCountry = selection.name;
      this.selectedCount = selection.count ? selection.count : 0;
    }
  }

  ngOnChanges() {
    this.fillChart();
  }
}
