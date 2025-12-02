import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor() { }

  /**
   * Descargar un archivo Blob con nombre personalizado
   */
  downloadFile(blob: Blob, fileName: string): void {
    // Crear un link temporal
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar el objeto URL
    window.URL.revokeObjectURL(url);
  }

  /**
   * Obtener extensión del archivo según el tipo de Blob
   */
  getFileExtension(blob: Blob): string {
    const type = blob.type;
    
    if (type === 'application/pdf') {
      return 'pdf';
    } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'xlsx';
    } else if (type === 'application/vnd.ms-excel') {
      return 'xls';
    }
    
    return 'file';
  }

  /**
   * Generar nombre de archivo con timestamp
   */
  generateFileName(baseName: string, extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `${baseName}_${timestamp}.${extension}`;
  }
}