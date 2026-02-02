import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcnfComponent } from './itemcnf.component';

describe('ItemcnfComponent', () => {
  let component: ItemcnfComponent;
  let fixture: ComponentFixture<ItemcnfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemcnfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemcnfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
