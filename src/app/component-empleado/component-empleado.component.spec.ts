import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentEmpleadoComponent } from './component-empleado.component';

describe('ComponentEmpleadoComponent', () => {
  let component: ComponentEmpleadoComponent;
  let fixture: ComponentFixture<ComponentEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
