// This assumes jspdf is loaded from the CDN in index.html
declare const jspdf: any;

// A simple slugify function for filenames
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
};

/**
 * Cleans markdown formatting from a string to produce plain text.
 * This is used for PDF generation and for the text-to-speech podcast feature.
 * @param text The markdown text to clean.
 * @returns The plain text string.
 */
export const cleanMarkdownForPlainText = (text: string): string => {
  if (!text) return '';
  return text
    // Remove bold, italic, strikethrough etc.
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove headers
    .replace(/^#+\s/gm, '')
    // Remove list item markers
    .replace(/^\s*[-*+]\s/gm, '');
};


export const generatePdf = async (text: string, topic: string): Promise<void> => {
  return new Promise((resolve) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    
    // Clean up markdown for better PDF output
    const cleanedText = cleanMarkdownForPlainText(text);
    
    const lines = doc.splitTextToSize(cleanedText, usableWidth);
    
    let cursorY = margin;
    let pageCount = 1;

    doc.text(`Report: ${topic}`, margin, cursorY);
    cursorY += 15;

    lines.forEach((line: string) => {
        if (cursorY + 10 > pageHeight - margin) {
            doc.addPage();
            pageCount++;
            cursorY = margin;
            doc.setPage(pageCount);
            doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
        doc.text(line, margin, cursorY);
        cursorY += 5; // Line height
    });
    
    doc.setPage(1);
    doc.text(`Page 1`, pageWidth - margin, pageHeight - 10, { align: 'right' });


    const filename = `report-${slugify(topic)}.pdf`;
    doc.save(filename);
    resolve();
  });
};
