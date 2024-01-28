import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { scan } from 'rxjs/operators';
import { RasterMetadata, Upload, UploadState } from '../model/config.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private uploadDoneSubject = new Subject<void>();
  uploadDone$ = this.uploadDoneSubject.asObservable();

  constructor(private http: HttpClient) {}

  private initialState: Upload = { state: UploadState.PENDING, progress: 0 }
  public csvFileChange$ : ReplaySubject<any> = new ReplaySubject(1);

  private isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response
  }

  private isHttpProgressEvent(
    event: HttpEvent<any>
  ): event is HttpProgressEvent {
    return (
      event.type === HttpEventType.DownloadProgress ||
      event.type === HttpEventType.UploadProgress   
    )
  }   

  private calculateState = (upload: Upload, event: HttpEvent<any>): Upload => {
    if (this.isHttpProgressEvent(event)) {
      // decompose event for better ui feedback
      let _progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0
      return _progress > 99 ? { progress: _progress, state: UploadState.PROCESSING} : {progress: _progress, state: UploadState.IN_PROGRESS} 
    }
    if (this.isHttpResponse(event)) {
      // to be used when processing data
      if(event.body.code == 204) {
        return {
          progress: 0,
          state: UploadState.PROCESSING,
          metadata: event.body.message
        }  
      }
      if(event.body.code == 200) {
        return {
          progress: 100,
          state: UploadState.DONE,
          metadata: event.body.message
        }
      }
    }
    return upload
  }

  
  private upload (): (source: Observable<HttpEvent<any>>) => Observable<any> {
    return (source) => source.pipe(scan(this.calculateState, this.initialState))
  }

  public uploadCSV(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/v1/csv/upload', formData, {
      reportProgress: true,
      observe: 'events',})
    .pipe(this.upload())
  }

  notifyUploadDone() {
    this.uploadDoneSubject.next();
  }

  public getCsvMetadata(): Observable<any> {
    return this.http.get<any>(`/api/v1/csv/`)
  }
  public getCsvData(id: string, params: HttpParams): Observable<any> {
    return this.http.get<any>( `/api/v1/csv/${id}`, { params })
  }

  public getRasterData(): Observable<RasterMetadata[]> {
    return this.http.get<any>( `/api/v1/raster/`)
  }

  public reloadMap(): Observable<any> {
    return this.http.post<any>( `/api/v1/raster/reload_map`, {})
  }

  public uploadRaster(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/v1/raster/upload', formData, {
      reportProgress: true,
      observe: 'events',})
    .pipe(this.upload())
  }
  
}
