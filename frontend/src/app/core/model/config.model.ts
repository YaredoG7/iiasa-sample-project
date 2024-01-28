export enum UploadState {
  PENDING= 'PENDING',
  IN_PROGRESS= 'UPLOADING',
  PROCESSING= 'PROCESSING',
  DONE= 'DONE',
  PROCESSING_ERROR= 'UPLAODING_ERROR'
}
export enum FileType {
  CSV= 'CSV',
  ZIP= 'ZIP',
  TIF= 'TIF',
}

export interface Upload {
  progress: number,
  state:  UploadState,
  metadata?: string,
}


export interface RasterMetadata {
  layer_name: string,
  layer_info:  any // @TODO: make this an object 
}

export interface UploadStatus {
  fileName: string,
  fileSize: number,
  fileType: string,
  progress: number,
  isDone?: boolean,
}


export interface SimpleStream {
  streamId: string,
  filename: string,
  rtspUrl: string,
  ipAddress: string,
  commandPort: number,
  enrollmentSent: boolean,
  enrollmentFinished: boolean,
  enrollmentError: boolean,
  triesTillOverwritingParameters: number
}
