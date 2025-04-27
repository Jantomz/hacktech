"""
Worker that downloads a budget PDF, extracts pages 30-50,
sends them to GPT-4o, and returns structured JSON.
Requires:
  • openai>=1.0.0
  • PyPDF2
  • requests
  • conductor-python (pip install conductor-python)
Be sure to set OPENAI_API_KEY in your environment.
"""

import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any, List

import requests
from PyPDF2 import PdfReader
from openai import OpenAI
from conductor.client.worker.worker_task import worker_task

MODEL = "gpt-4o"
TEMPERATURE = 0
PROMPT_TEMPLATE = """
You are a budgeting-and-finance data-extraction assistant. Instructions:
1. Output **only** a JSON object with one key, "budget_entries", whose value is an array of objects.
2. For each finance datum in ${text} produce an object with:
   - year (integer)
   - department (string)
   - category (Operating, Capital, Revenue, Expense, Project)
   - subcategory (string or null)
   - fund_source (string or null)
   - amount_usd (number, commas/$ removed)
   - geographic_area (string or null)
   - fiscal_period (string or null)
   - purpose (string)
3. Normalise amounts (e.g. "$1,234" → 1234).
4. Create separate entries for projections (mark notes = "Projected").
5. If a field is unavailable, set it to null.
Return valid JSON — no extra text.
""".strip()


def _download_pdf(url: str) -> Path:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    path = Path(tempfile.mkstemp(suffix=".pdf")[1])
    path.write_bytes(resp.content)
    return path


def _extract_text(pdf_path: Path, start: int, end: int) -> str:
    reader = PdfReader(str(pdf_path))
    pages = reader.pages[start:end]
    return "".join(page.extract_text() or "" for page in pages)


def _call_llm(text: str) -> dict[str, List[Any]]:
    client = OpenAI()
    if not client.api_key:
        sys.exit("OPENAI_API_KEY not set")

    full_prompt = PROMPT_TEMPLATE.replace("${text}", text)
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a budgeting-and-finance data-extraction assistant."},
            {"role": "user", "content": full_prompt},
        ],
        temperature=TEMPERATURE,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)


@worker_task(task_definition_name="budget_extract")
def budget_extract(
    document_url: str,
    startPage: int = 30,
    endPage: int = 50,
) -> dict[str, Any]:
    start = int(startPage)
    end = int(endPage)
    pdf_path = _download_pdf(document_url)
    text = _extract_text(pdf_path, start, end)
    parsed = _call_llm(text)
    return parsed
