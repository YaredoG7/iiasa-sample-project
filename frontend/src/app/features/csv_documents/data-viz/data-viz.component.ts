import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-data-viz',
  templateUrl: './data-viz.component.html',
  styleUrls: ['./data-viz.component.css']
})
export class DataVizComponent implements OnInit {
  
  
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  filename: string = "";
  private itemId: string = ""
  private dataLength: number = 500;
  readonly limit: number = 500;
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  
  constructor(private route: ActivatedRoute, private api: ApiService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('View csv document');
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    this.filename = this.route.snapshot.paramMap.get('filename') || '';
    this.loadData(this.itemId, 0, this.dataLength);
  }

  loadData(fileId: string, page: number, pageSize: number): void {
    // when items in pagination changes load more from dataframe
    const params = new HttpParams().set('skip', page.toString()).set('limit', pageSize.toString());
    this.api.getCsvData(fileId, params).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.concat(response);
      this.dataLength = this.dataSource.data.length;
      this.displayedColumns = Object.keys(response[0]);
     })
  }
  onPageChange(event: any): void {
    if(event.pageIndex === event.length / event.pageSize - 1) {
      this.dataLength += this.limit;
      this.loadData(this.itemId, this.dataLength, this.dataLength += this.limit)
    }
  }
}
