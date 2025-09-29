import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css'],
  standalone: true,
})
export class QrCodeComponent implements OnInit {
  qrCodeUrl: string = '';

  ngOnInit(): void {
    QRCode.toDataURL('https://jambox.wiegandt.tech', {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then(url => {
        this.qrCodeUrl = url;
      })
      .catch(err => {
        console.error(err);
      });
  }

  public downloadAsPdf(): void {
    const element = document.getElementById('print-section');
    if (element) {
      const originalWidth = element.style.width;
      element.style.width = '210mm';

      html2canvas(element, { scale: 2 }).then((canvas) => {
        element.style.width = originalWidth;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        const pdfAspectRatio = pdfWidth / pdfHeight;

        let renderWidth, renderHeight, x, y;

        if (canvasAspectRatio > pdfAspectRatio) {
          renderWidth = pdfWidth;
          renderHeight = renderWidth / canvasAspectRatio;
          x = 0;
          y = (pdfHeight - renderHeight) / 2;
        } else {
          renderHeight = pdfHeight;
          renderWidth = renderHeight * canvasAspectRatio;
          y = 0;
          x = (pdfWidth - renderWidth) / 2;
        }

        pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
        pdf.save('jambox-qr-code.pdf');
      });
    }
  }
}
