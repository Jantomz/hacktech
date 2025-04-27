"""
Budget-book → structured-JSON extractor.
Requires:
  • openai>=1.0.0
  • PyPDF2
  • requests
Set OPENAI_API_KEY in your environment before running.
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any, List

import requests
from PyPDF2 import PdfReader
from openai import OpenAI

# --- configuration ----------------------------------------------------------
PDF_URL = (
    "https://cdnsm5-ss5.sharpschool.com/UserFiles/Servers/Server_3042785/File/departments/administration/financial/budget/fy2025/CPS_Adopted_Budget_FY25_WEB.pdf"
)
START=30
END = 50
MODEL     = "gpt-4o"
TEMPERATURE = 0
PROMPT_TEMPLATE = """
You are a budgeting-and-finance data-extraction assistant. Instructions:
1. Output **only** a JSON object with one key, "budget_entries", whose value is an array of objects.
2. For each finance datum in ${text} produce an object with:
   - year (integer)
   - department (string)
   - category (Operating, Capital, Revenue, Expense, Project)
   - subcategory (string | null)
   - fund_source (string | null)
   - amount_usd (number, commas/$ removed)
   - geographic_area (string | null)
   - fiscal_period (string | null)
   - purpose (string)
3. Normalise amounts (e.g. "$1,234" → 1234).
4. Create separate entries for projections (mark notes = "Projected").
5. If a field is unavailable, set it to null.
Return valid JSON — no extra text.
""".strip()
# ---------------------------------------------------------------------------


def download_pdf(url: str) -> Path:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    tmp_path = Path(tempfile.mkstemp(suffix=".pdf")[1])
    tmp_path.write_bytes(resp.content)
    return tmp_path


def extract_text(pdf_path: Path, start: int = START, end: int = END) -> str:
    reader = PdfReader(str(pdf_path))
    pages = reader.pages[start:end]
    return "".join(page.extract_text() or "" for page in pages)


def call_llm(prompt: str, text: str) -> str:
    client = OpenAI()                       # reads OPENAI_API_KEY from env
    if not client.api_key:
        sys.exit("OPENAI_API_KEY not set")

    full_prompt = prompt.replace("${text}", text)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a budgeting-and-finance data-extraction assistant."},
            {"role": "user",   "content": full_prompt},
        ],
        temperature=TEMPERATURE,
        # Ask the model to guarantee a JSON object
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content


def main() -> None:
    print(f"Downloading PDF…")
    pdf_file = download_pdf(PDF_URL)
    text = extract_text(pdf_file)

    print("Calling OpenAI API…")
    raw_json = call_llm(PROMPT_TEMPLATE, text)

    try:
        parsed: dict[str, List[Any]] = json.loads(raw_json)
        print(json.dumps(parsed, indent=2))
    except json.JSONDecodeError:
        print("Model returned non-JSON output:\n", raw_json)


if __name__ == "__main__":
    main()
