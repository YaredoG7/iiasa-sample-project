import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunkSize'
})
export class ChunkSizePipe implements PipeTransform {

  transform(value: number): string {
    const kilobytes = value / 1024;
    const megabytes = kilobytes / 1024;

    if (megabytes >= 1) {
      return `${megabytes.toFixed(2)} MB`;
    } else {
      return `${kilobytes.toFixed(2)} KB`;
    }
  }
}
