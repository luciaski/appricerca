import { Document, Packer, Paragraph, TextRun } from 'docx';
import saveAs from 'file-saver';
import { cleanMarkdownForPlainText } from './pdfGenerator';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateDocx = async (text: string, topic: string): Promise<void> => {
  const cleanedText = cleanMarkdownForPlainText(text);
  
  // Create paragraphs from the cleaned text, splitting by newlines
  const textParagraphs = cleanedText.split('\n').filter(p => p.trim() !== '').map(p => 
    new Paragraph({
      children: [new TextRun(p)],
      spacing: { after: 200 }, // Corresponds to 10pt space after paragraph
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({
            text: `Report: ${topic}`,
            bold: true,
            size: 32, // 16pt font size
          })],
          spacing: { after: 400 }, // 20pt space after title
        }),
        ...textParagraphs,
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `report-${slugify(topic)}.docx`;
  saveAs(blob, filename);
};