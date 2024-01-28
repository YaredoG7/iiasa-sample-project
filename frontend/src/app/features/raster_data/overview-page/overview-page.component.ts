import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { FileType } from 'src/app/core/model/config.model';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-raster-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css'], 
})
export class RasterOverviewComponent implements OnInit, OnDestroy {  
  displayedColumns: string[] = ['name', 'type', 'workspace', 'created', 'view'];
  dataSource = new MatTableDataSource<any>();
    // to unsubscribe when component is destroyed
  private uploadDoneSubscription: Subscription | undefined;
  
  constructor(private titleService: Title, private api: ApiService) { }
  uploadContext : string = FileType.TIF;
  
  ngOnInit() {
    this.titleService.setTitle('Raster Data');
    this.loadData();
    this.uploadDoneSubscription = this.api.uploadDone$.subscribe(() => {
      this.loadData();
    });

  }

  onPageChange(event: any): void {
    
  }

  loadData(): void {
    this.api.getRasterData().subscribe((response: any) => {
      this.dataSource.data = response.data;
     })
  }

  ngOnDestroy(): void {

    if (this.uploadDoneSubscription) {
      this.uploadDoneSubscription.unsubscribe();
    }
  }

}
