import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error('Failed to parse PDF file');
  }
}

export async function extractTextFromDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (err) {
    console.error('Error parsing DOCX:', err);
    throw new Error('Failed to parse DOCX file');
  }
}

export async function parseResume(file) {
  if (!file || !file.buffer) {
    throw new Error('No file content provided');
  }

  const filename = (file.originalname || '').toLowerCase();
  if (filename.endsWith('.pdf')) {
    try {
      return await extractTextFromPdf(file.buffer);
    } catch (err) {
      // If buffer is valid plain text, fallback gracefully
      const text = file.buffer.toString('utf-8');
      if (text && text.trim().length > 20) {
        return text;
      }
      throw err;
    }
  } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
    return await extractTextFromDocx(file.buffer);
  } else if (filename.endsWith('.txt')) {
    return file.buffer.toString('utf-8');
  } else {
    // Attempt utf-8 text fallback
    const text = file.buffer.toString('utf-8');
    if (text && text.trim().length > 20) {
      return text;
    }
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
  }
}
