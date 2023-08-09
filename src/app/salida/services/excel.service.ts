import { Injectable } from '@angular/core';
import { ImagePosition, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ISalidaExcelTabla, ITablaSalida } from '../interface/excel.interface';
import { BANNER1 } from '@app/constants/logo';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  private workbook!: Workbook;

  //constructor() { }

  async dowloadExcel(dataExcelSalida: ISalidaExcelTabla) {
    this.workbook = new Workbook();
    this.workbook.creator = 'ExcelParcial';

    await this.crearTablaSalida(dataExcelSalida.tablasalida);

    this.workbook.xlsx
      .writeBuffer()
      .then((data: ArrayBuffer) => {
        // Convertir el Buffer (ArrayBuffer) a Uint8Array
        const uint8Array = new Uint8Array(data);

        // Crear el Blob a partir del Uint8Array
        const blob = new Blob([uint8Array], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Usar FileSaver para guardar el archivo en el cliente
        fs.saveAs(blob, 'Salida.xlsx');
      })
      .catch((error) => {
        console.error('Error al escribir el archivo de Excel', error);
      });
  }

  private async crearTablaSalida(dataSalidaTabla: ITablaSalida[]) {
    //Nombre de hoja
    const sheet = this.workbook.addWorksheet('SALIDA');
    sheet.properties.tabColor = {
      argb: 'f38ba8', // Color rojo
    };

    /*------------------------------------- Diseño de excel --------------------------------------------*/

    //Tamaños de columnas
    sheet.getColumn('B').width = 5;
    sheet.getColumn('C').width = 20;
    sheet.getColumn('D').width = 60;
    sheet.getColumn('E').width = 40;

    // Centrar columnas
    sheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', wrapText: true };
    });

    // Declarar Imagen
    const logoId = this.workbook.addImage({
      base64: BANNER1,
      extension: 'jpeg',
    });

    // Colocar imagen
    const position: ImagePosition = {
      tl: { col: 3, row: 1.1 },
      ext: { width: 521, height: 100 },
    };

    sheet.addImage(logoId, position);

    // Colocar titulo y dar estilo
    sheet.mergeCells('B8', 'E8');
    const titulo = sheet.getCell('E8');
    titulo.value = 'INFORMACION DE SALIDAS';

    sheet.getCell('E8').border = {
      top: { style: 'mediumDashed', color: { argb: 'cba6f7' } },
      left: { style: 'mediumDashed', color: { argb: 'cba6f7' } },
      bottom: { style: 'mediumDashed', color: { argb: 'cba6f7' } },
      right: { style: 'mediumDashed', color: { argb: 'cba6f7' } },
    };

    titulo.style.font = {
      bold: true,
      size: 20,
      name: 'Monotype Corsiva',
      color: {
        argb: '3499e3',
      },
    };

    titulo.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: false,
    };

    //Colocar fecha y dar estilo

    const date = new Date();
    const fechaFormato = `${date.getDate()}/${
      date.getMonth() + 1
    } / ${date.getFullYear()}`;
    const celdaFecha = sheet.getCell('E9');
    celdaFecha.value = fechaFormato;
    celdaFecha.font = {
      name: 'Lucida Handwriting',
      size: 12,
      bold: true,
      color: {
        argb: '89b4fa',
      },
    };

    celdaFecha.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: false,
    };

    // Colocar encabezado de la tabla y dar estilo
    const headerR = sheet.getRow(10);
    headerR.values = [
      '', //column A ...
      'N.',
      'Venta',
      'Vehiculo',
      'Municipio',
    ];

    headerR.alignment = {
      vertical: 'middle',
      wrapText: false,
    };

    ['B', 'C', 'D', 'E'].forEach((columnKey) => {
      sheet.getCell(`${columnKey}10`).font = {
        bold: true,
        size: 12,
        italic: false,
        color: {
          argb: '000000',
        },
      };

      sheet.getCell(`${columnKey}10`).border = {
        top: { style: 'medium', color: { argb: 'd0d7de' } },
        left: { style: 'medium', color: { argb: 'd0d7de' } },
        bottom: { style: 'medium', color: { argb: 'd0d7de' } },
        right: { style: 'medium', color: { argb: 'd0d7de' } },
      };

      sheet.getCell(`${columnKey}10`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'b4befe',
        },
        bgColor: {
          argb: '',
        },
      };
    });

    /*------------------------------------- Llenar excel con la base de datos--------------------------------------------*/

    const filaInsertar = sheet.getRows(11, dataSalidaTabla.length)!;

    // Establecer colores para filas intercaladas
    const colorFilaPar = 'f6f8fa'; // Color para filas pares
    const colorFilaImpar = 'FFFFFF'; // Color para filas impares

    let currentColor = colorFilaPar;

    for (let index = 0; index < filaInsertar.length; index++) {
      const itemData = dataSalidaTabla[index];
      const row = filaInsertar[index];

      row.values = [
        '', //column A...
        `${index + 1}`,
        `${itemData.venta}`,
        `${itemData.vehiculo}`,
        `${itemData.municipio}`,
      ];

      let fila = 11 + index;

      ['B', 'C', 'D', 'E'].forEach((columnKey) => {
        sheet.getCell(`${columnKey}${fila}`).border = {
          top: { style: 'medium', color: { argb: 'd0d7de' } },
          left: { style: 'medium', color: { argb: 'd0d7de' } },
          bottom: { style: 'medium', color: { argb: 'd0d7de' } },
          right: { style: 'medium', color: { argb: 'd0d7de' } },
        };
        sheet.getCell(`${columnKey}${fila}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: currentColor },
        };
      });

      // Alternar el color para la siguiente fila
      currentColor =
        currentColor === colorFilaPar ? colorFilaImpar : colorFilaPar;
    }
  }
}
