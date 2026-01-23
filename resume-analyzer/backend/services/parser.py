import fitz
import docx
import io
from fastapi import UploadFile

async def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    try:
        with fitz.open(stream=file_content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text() + "\n"
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        raise ValueError("Failed to parse PDF file")
    return text

async def extract_text_from_docx(file_content: bytes) -> str:
    text = ""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        raise ValueError("Failed to parse DOCX file")
    return text

async def parse_resume(file: UploadFile) -> str:
    content = await file.read()
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        return await extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        return await extract_text_from_docx(content)
    else:
        raise ValueError("Unsupported file format.")
