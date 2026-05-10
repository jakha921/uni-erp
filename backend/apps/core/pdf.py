"""Reusable PDF generation utilities using ReportLab."""

import io
from datetime import date

from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

PRIMARY_COLOR = colors.HexColor("#2DB976")
HEADER_BG = colors.HexColor("#2DB976")
HEADER_TEXT = colors.white
ALT_ROW = colors.HexColor("#F8FAF9")


def get_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocTitle",
            fontName="Helvetica-Bold",
            fontSize=16,
            spaceAfter=6 * mm,
            alignment=1,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocSubtitle",
            fontName="Helvetica",
            fontSize=10,
            spaceAfter=4 * mm,
            alignment=1,
            textColor=colors.gray,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            fontName="Helvetica-Bold",
            fontSize=12,
            spaceBefore=6 * mm,
            spaceAfter=3 * mm,
        )
    )
    return styles


def generate_table_pdf(
    title: str,
    subtitle: str,
    headers: list[str],
    rows: list[list],
    filename: str = "report",
    page_size=A4,
) -> HttpResponse:
    """Generate a PDF with a styled table.

    Args:
        title: Document title
        subtitle: Document subtitle (date range, filters, etc.)
        headers: List of column header strings
        rows: List of lists with row data
        filename: Output filename without extension
        page_size: Page size (default A4)
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = get_styles()
    elements = []

    # Title
    elements.append(Paragraph(title, styles["DocTitle"]))
    elements.append(Paragraph(subtitle, styles["DocSubtitle"]))
    elements.append(Spacer(1, 4 * mm))

    # Table
    table_data = [headers] + rows
    col_count = len(headers)
    available_width = page_size[0] - 3 * cm
    col_width = available_width / col_count

    table = Table(table_data, colWidths=[col_width] * col_count, repeatRows=1)

    style_commands = [
        # Header
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("TEXTCOLOR", (0, 0), (-1, 0), HEADER_TEXT),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, 0), 8),
        # Body
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
        ("TOPPADDING", (0, 1), (-1, -1), 5),
        # Grid
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ]

    # Alternating row colors
    for i in range(1, len(table_data)):
        if i % 2 == 0:
            style_commands.append(("BACKGROUND", (0, i), (-1, i), ALT_ROW))

    table.setStyle(TableStyle(style_commands))
    elements.append(table)

    # Footer
    elements.append(Spacer(1, 8 * mm))
    footer_text = f"Jami: {len(rows)} ta yozuv | Sana: {date.today().strftime('%d.%m.%Y')}"
    elements.append(Paragraph(footer_text, styles["DocSubtitle"]))

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}.pdf"'
    return response


def generate_contract_pdf(contract_data: dict) -> HttpResponse:
    """Generate a single contract PDF document."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2 * cm,
    )

    styles = get_styles()
    elements = []

    # University header
    elements.append(Paragraph("BUXORO INNOVATSION TEXNOLOGIYALAR UNIVERSITETI", styles["DocTitle"]))
    elements.append(Spacer(1, 4 * mm))

    # Contract title
    elements.append(
        Paragraph(
            f"SHARTNOMA #{contract_data.get('number', 'N/A')}",
            styles["DocTitle"],
        )
    )
    elements.append(
        Paragraph(
            f"Tuzilgan sana: {contract_data.get('contract_date', '')}",
            styles["DocSubtitle"],
        )
    )
    elements.append(Spacer(1, 6 * mm))

    # Contract details table
    details = [
        ["Talaba:", contract_data.get("student_name", "")],
        ["Fakultet:", contract_data.get("faculty", "")],
        ["Yo'nalish:", contract_data.get("specialty", "")],
        ["Guruh:", contract_data.get("group", "")],
        ["Ta'lim shakli:", contract_data.get("education_form", "")],
        ["Kurs:", str(contract_data.get("course", ""))],
        ["", ""],
        ["Umumiy summa:", f"{contract_data.get('contract_amount', 0):,.0f} so'm"],
        ["To'langan:", f"{contract_data.get('paid_amount', 0):,.0f} so'm"],
        ["Qarz:", f"{contract_data.get('debt_amount', 0):,.0f} so'm"],
        ["Holat:", contract_data.get("status", "")],
    ]

    detail_table = Table(details, colWidths=[5 * cm, 12 * cm])
    detail_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("LINEBELOW", (0, -1), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ]
        )
    )
    elements.append(detail_table)

    # Signatures
    elements.append(Spacer(1, 20 * mm))
    sig_data = [
        ["Universitet vakili:", "", "Talaba:"],
        ["_________________", "", "_________________"],
        ["", "", ""],
    ]
    sig_table = Table(sig_data, colWidths=[6 * cm, 5 * cm, 6 * cm])
    sig_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )
    elements.append(sig_table)

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
    filename = f"shartnoma_{contract_data.get('number', 'export')}"
    response["Content-Disposition"] = f'attachment; filename="{filename}.pdf"'
    return response
