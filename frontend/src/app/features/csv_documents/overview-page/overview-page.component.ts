import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FileType } from 'src/app/core/model/config.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['filename', 'type', 'size', 'created', 'view'];
  dataSource = new MatTableDataSource<any>();

  // to unsubscribe when component is destroyed
  private uploadDoneSubscription: Subscription | undefined;

  constructor(
    private titleService: Title, 
    private api: ApiService
  ) { }


  uploadContext : string = FileType.CSV;

  ngOnInit() {
    //this.titleService.setTitle('Csv Documents');
    this.uploadDoneSubscription = this.api.uploadDone$.subscribe(() => {
      // Update the table when upload is done
      this.loadData();
    });

    this.loadData();

  }

  loadData(): void {
    this.api.getCsvMetadata().subscribe((response) => {
      this.dataSource.data = response.data;
     })
  }
  onPageChange(event: any): void {

  }

  ngOnDestroy(): void {
    if (this.uploadDoneSubscription) {
      this.uploadDoneSubscription.unsubscribe();
    }
  }
}
