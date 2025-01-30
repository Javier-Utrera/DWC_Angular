import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnadoDAWComponentComponent } from './alumnado-dawcomponent.component';

describe('AlumnadoDAWComponentComponent', () => {
  let component: AlumnadoDAWComponentComponent;
  let fixture: ComponentFixture<AlumnadoDAWComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnadoDAWComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnadoDAWComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
