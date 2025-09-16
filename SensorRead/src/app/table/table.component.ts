import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [NgForOf, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() table: (string | number)[][] = [];
  @Input() titles: string[] = [];
  @Input() widen = false;
}
