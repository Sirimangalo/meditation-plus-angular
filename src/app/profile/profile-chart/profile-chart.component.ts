import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'profile-charts',
  templateUrl: './profile-chart.component.html',
  styleUrls: ['./profile-chart.component.styl']
})
export class ProfileChartComponent implements OnChanges {

  @Input() data;

  currentMonth = moment().format('MMMM');

  // chart details
  chartData: { year: Array<any>, month: Array<any>, week: Array<any> } = {
    year: [],
    month: [],
    week: []
  };
  chartLabels: { year: string[], month: string[], week: string[] } = {
    year: [],
    month: [],
    week: []
  };
  chartOptions = {
    animations: true,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    cubicInterpolationMode: 'monotone'
  };
  charts = {
    year: null,
    month: null,
    week: null
  };

  constructor() { }

  /**
   * Helper function for left-shifting an array. This will
   * remove the first n elements and add it to the end of
   * the array. Example:
   *
   * rotateArray([4,5,1,2,3], 2) => [1,2,3,4,5]
   *
   * @param  {any[]}  arr   Array of elements
   * @param  {number} size  Number of first elements to move
   * @return {any[]}        Transformed array
   */
  rotateArray(arr: any[], size: number): any[] {
    return size > 0 && size % 1 === 0
      ? arr.slice(size % arr.length, arr.length).concat(arr.slice(0, size % arr.length))
      : arr;
  }

  /**
   * Resets chart data
   */
  resetChart(): void {
    this.chartData = {
      year: [],
      month: [],
      week: []
    };
    this.chartLabels = {
      year: [],
      month: [],
      week: []
    };
  }

  /**
   * Loads a chart by name.
   *
   * @param {string} chartName Name of chart = key in 'chartData', 'chartLabels' and 'data'
   */
  loadChart(chartName): void {
    if (!this.data || !chartName || !this.data[chartName]) {
      return;
    }

    let labels, shiftSize;

    // determine x-axis labels and shift size (for correct displaying of
    // data, i.e. week starts at Monday not Sunday) for current chart
    switch (chartName) {
      case 'year':
        labels = moment.monthsShort();
        shiftSize = moment().month() + 1;
        break;
      case 'month':
        // range from first to last day of current month
        labels = new Array(moment().daysInMonth()).fill(0).map((_, i) => (i + 1).toString());
        shiftSize = 0;
        break;
      case 'week':
        labels = moment.weekdaysShort();
        shiftSize = 1;
        break;
      default:
        return;
    }

    const dataWalking = {
      data: new Array(labels.length).fill(0),
      label: 'Minutes walking',
      // no fill for line chart
      fill: chartName !== 'month'
    };

    const dataSitting = {
      data: new Array(labels.length).fill(0),
      label: 'Minutes sitting',
      // no fill for line chart
      fill: chartName !== 'month'
    };

    this.data[chartName].map(x => {
      dataWalking.data[x._id - 1] = x.walking;
      dataSitting.data[x._id - 1] = x.sitting;
    });

    labels = this.rotateArray(labels, shiftSize);
    dataWalking.data = this.rotateArray(dataWalking.data, shiftSize);
    dataSitting.data = this.rotateArray(dataSitting.data, shiftSize);

    this.chartLabels[chartName] = labels;
    this.chartData[chartName].push(dataWalking);
    this.chartData[chartName].push(dataSitting);
  }

  ngOnChanges() {
    // Update charts
    if (this.data) {
      this.resetChart();
      Object.keys(this.data).map(c => this.loadChart(c));
    }
  }
}
