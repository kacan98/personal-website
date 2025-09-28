import jsPDF from 'jspdf';
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';

/**
 * Service for PDF generation with proper text processing
 */
export class PdfService {
  /**
   * Processes Czech characters for PDF compatibility
   */
  private static processCzechText(text: string): string {
    return text
      .replace(/č/g, 'c').replace(/Č/g, 'C')
      .replace(/ř/g, 'r').replace(/Ř/g, 'R')
      .replace(/š/g, 's').replace(/Š/g, 'S')
      .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
      .replace(/ý/g, 'y').replace(/Ý/g, 'Y')
      .replace(/á/g, 'a').replace(/Á/g, 'A')
      .replace(/é/g, 'e').replace(/É/g, 'E')
      .replace(/í/g, 'i').replace(/Í/g, 'I')
      .replace(/ó/g, 'o').replace(/Ó/g, 'O')
      .replace(/ú/g, 'u').replace(/Ú/g, 'U')
      .replace(/ů/g, 'u').replace(/Ů/g, 'U')
      .replace(/ď/g, 'd').replace(/Ď/g, 'D')
      .replace(/ť/g, 't').replace(/Ť/g, 'T')
      .replace(/ň/g, 'n').replace(/Ň/g, 'N');
  }

  /**
   * Adds text with line breaks to PDF
   */
  private static addTextWithLineBreaks(
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth?: number
  ): number {
    const processedText = this.processCzechText(text);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(processedText, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * 5;
    } else {
      pdf.text(processedText, x, y);
      return 5;
    }
  }

  /**
   * Generates PDF for motivational letter
   */
  static generateMotivationalLetterPDF(
    letter: MotivationalLetterResponse,
    companyName?: string | null
  ): void {
    if (!letter?.letter) {
      throw new Error('No letter content provided');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;
    const currentY = 30;

    // Set font
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    // Add letter content
    this.addTextWithLineBreaks(pdf, letter.letter, margin, currentY, textWidth);

    // Generate filename
    const prettifiedCompanyName = companyName
      ? `_${companyName.split(" ").join("_")}`
      : '';
    const fileName = `Motivational_Letter${prettifiedCompanyName}.pdf`;

    // Download the PDF
    pdf.save(fileName);
  }

  /**
   * Generates PDF for CV (placeholder for future implementation)
   */
  static generateCvPDF(
    cvData: any,
    options?: {
      fontSize?: number;
      companyName?: string;
    }
  ): void {
    // TODO: Implement CV PDF generation if needed
    // This would move the CV PDF logic from the Print component
    throw new Error('CV PDF generation not yet implemented in service');
  }
}

/**
 * Hook for using PDF service in components
 */
export function usePdfService() {
  const downloadMotivationalLetterPDF = (
    letter: MotivationalLetterResponse,
    companyName?: string | null
  ) => {
    try {
      PdfService.generateMotivationalLetterPDF(letter, companyName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  return {
    downloadMotivationalLetterPDF
  };
}