import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasterDataVizComponent } from './raster-data-viz.component';

describe('RasterDataVizComponent', () => {
  let component: RasterDataVizComponent;
  let fixture: ComponentFixture<RasterDataVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RasterDataVizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RasterDataVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
