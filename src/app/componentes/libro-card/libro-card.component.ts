import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-libro-card',
  imports: [],
  templateUrl: './libro-card.component.html',
  styleUrl: './libro-card.component.css'
})
export class LibroCardComponent {
  @Input() libro: any;
}
