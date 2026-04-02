import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors

def generate_donation_receipt_pdf(donation):
    """
    Generates a PDF receipt for a MonetaryDonation using ReportLab.
    Returns: BytesIO object containing the PDF data.
    """
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Title
    p.setFont("Helvetica-Bold", 24)
    p.setFillColorRGB(0.2, 0.4, 0.8)
    p.drawString(1 * inch, 10 * inch, "TDMS NGO")
    
    # Subtitle
    p.setFont("Helvetica", 14)
    p.setFillColorRGB(0, 0, 0)
    p.drawString(1 * inch, 9.6 * inch, "Official Donation Receipt")
    
    # Line
    p.setStrokeColor(colors.grey)
    p.line(1 * inch, 9.4 * inch, 7.5 * inch, 9.4 * inch)
    
    # Content
    p.setFont("Helvetica", 12)
    p.drawString(1 * inch, 9 * inch, f"Receipt No: {donation.razorpay_payment_id}")
    p.drawString(1 * inch, 8.7 * inch, f"Date: {donation.created_at.strftime('%B %d, %Y')}")
    
    p.drawString(1 * inch, 8 * inch, f"Received with thanks from:")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(1 * inch, 7.7 * inch, f"{donation.donor.username} ({donation.donor.email})")
    
    p.setFont("Helvetica", 12)
    p.drawString(1 * inch, 7 * inch, "Amount Received:")
    p.setFont("Helvetica-Bold", 14)
    p.drawString(1 * inch, 6.7 * inch, f"{donation.currency} {donation.amount}")
    
    # Footer Notice
    p.setFont("Helvetica-Oblique", 10)
    p.setFillColorRGB(0.4, 0.4, 0.4)
    p.drawString(1 * inch, 5 * inch, "Thank you for your generous contribution. Your support empowers our mission.")
    p.drawString(1 * inch, 4.8 * inch, "This is a computer-generated receipt and requires no signature.")
    
    # Close
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer
