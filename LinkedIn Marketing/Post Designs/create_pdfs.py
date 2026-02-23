"""Create PDF files from PNG slides for LinkedIn carousel posts."""

from pathlib import Path
from PIL import Image

def create_pdf_from_images(folder_path: Path, output_name: str):
    """Convert all slide PNG images in a folder to a single PDF."""
    # Get all slide images sorted by name
    slide_files = sorted(folder_path.glob("slide-*.png"))

    if not slide_files:
        print(f"  No slides found in {folder_path.name}")
        return

    # Open all images
    images = []
    for slide_file in slide_files:
        img = Image.open(slide_file)
        # Convert to RGB if necessary (PNG might have transparency)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        images.append(img)

    # Save as PDF
    output_path = folder_path / f"{output_name}.pdf"
    images[0].save(
        output_path,
        "PDF",
        resolution=100.0,
        save_all=True,
        append_images=images[1:]
    )

    print(f"  Created: {output_path.name} ({len(images)} slides)")

def main():
    base_path = Path(__file__).parent

    # Posts 2-7 folders
    posts = [
        ("Post2-Document-Processing", "Post2-Document-Processing"),
        ("Post3-Why-AI-Fails", "Post3-Why-AI-Fails"),
        ("Post4-Agentic-AI", "Post4-Agentic-AI"),
        ("Post5-Computer-Vision", "Post5-Computer-Vision"),
        ("Post6-NLP-Beyond-Chatbots", "Post6-NLP-Beyond-Chatbots"),
        ("Post7-Predictive-Analytics", "Post7-Predictive-Analytics"),
    ]

    print("Creating PDFs for LinkedIn carousel posts...")
    print()

    for folder_name, pdf_name in posts:
        folder_path = base_path / folder_name
        if folder_path.exists():
            create_pdf_from_images(folder_path, pdf_name)
        else:
            print(f"  Folder not found: {folder_name}")

    print()
    print("Done! PDFs are ready for LinkedIn upload.")

if __name__ == "__main__":
    main()
