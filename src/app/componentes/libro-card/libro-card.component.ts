import { Component,Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-libro-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './libro-card.component.html',
  styleUrl: './libro-card.component.css'
})
export class LibroCardComponent {
  @Input() libro: any;
}
