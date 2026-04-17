#!/usr/bin/env python3
"""Extract Figure 1 from an arXiv PDF (best effort: page containing 'Figure 1', largest image)."""
import re
import sys
import urllib.request
from pathlib import Path

import fitz


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, dest)


def largest_image_on_page(doc: fitz.Document, page_index: int) -> fitz.Pixmap | None:
    page = doc[page_index]
    infos = page.get_images(full=True)
    best = None
    best_area = 0
    for info in infos:
        xref = info[0]
        try:
            pix = fitz.Pixmap(doc, xref)
        except RuntimeError:
            continue
        if pix.n - pix.alpha < 4:  # CMYK etc.
            pass
        if pix.alpha and pix.n == 4:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        elif pix.n == 5:
            pix = fitz.Pixmap(fitz.csRGB, pix)
        area = pix.width * pix.height
        # skip tiny icons
        if area < 80_000:
            pix = None
            continue
        if area > best_area:
            best_area = area
            best = pix
    return best


def find_figure1_page(doc: fitz.Document) -> int | None:
    pat = re.compile(r"fig(?:ure)?\.?\s*1\b", re.IGNORECASE)
    for i in range(len(doc)):
        if pat.search(doc[i].get_text()):
            return i
    return None


def main() -> int:
    if len(sys.argv) != 4:
        print("Usage: extract_figure1.py <pdf_url> <out_png> <tmp_pdf>", file=sys.stderr)
        return 2
    url, out_png, tmp_pdf = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
    download(url, tmp_pdf)
    doc = fitz.open(tmp_pdf)
    page_i = find_figure1_page(doc)
    if page_i is None:
        page_i = min(3, len(doc) - 1)
    pix = largest_image_on_page(doc, page_i)
    if pix is None:
        for i in range(len(doc)):
            pix = largest_image_on_page(doc, i)
            if pix is not None:
                break
    if pix is None:
        print("No suitable image found", file=sys.stderr)
        return 1
    out_png.parent.mkdir(parents=True, exist_ok=True)
    if pix.n >= 5:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    pix.save(out_png.as_posix())
    print(out_png, pix.width, pix.height)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
