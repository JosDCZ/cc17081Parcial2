import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.scss'],
})
export class GraficaComponent implements OnInit {
  chartOptions = {
    responsive: true,
  };
  chartLabels = ['Zona'];
  chartLegend = true;
  chartPlugins = [];

  @Input() chartData: { data: number[]; label: string }[] = [];

  constructor() {}

  ngOnInit(): void {}
}
