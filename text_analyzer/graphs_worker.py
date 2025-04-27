"""
Worker that pulls the `budget_entries` JSON from a Human Task on Orkes Cloud
and returns a compact set of Recharts-ready chart specs.

Env vars required
-----------------
ORKES_API_KEY  Personal-access token for https://developer.orkescloud.com
"""

import os
import json
from collections import defaultdict
from typing import Any, Dict, List

import requests
from conductor.client.worker.worker_task import worker_task


ORKES_BASE   = "https://developer.orkescloud.com"
API_KEY      = os.getenv("CONDUCTOR_AUTH_KEY")        # set this in your shell
HEADERS      = {"X-Authorization": API_KEY}      # Orkes Cloud PAT header


# ────────────────────────────────────────────────────────────────────────────
def _fetch_task_output(task_id: str) -> Dict[str, Any]:
    """GET /api/human/tasks/{task_id} and return the `output` field."""
    url = f"{ORKES_BASE}/api/human/tasks/{task_id}"
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.json().get("output", {})


def _top_n(mapping: Dict[str, int], n: int = 10) -> List[Dict[str, Any]]:
    return [
        {"name": k, "amount_usd": v}
        for k, v in sorted(mapping.items(), key=lambda kv: abs(kv[1]), reverse=True)[:n]
    ]


def _suggest_charts(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Return a minimal spec list that a React front end can loop over."""
    charts: List[Dict[str, Any]] = []

    # 1. Spending by department (top 10)
    dept_totals = defaultdict(int)
    for e in entries:
        dept_totals[e["department"]] += e["amount_usd"]
    charts.append(
        {
            "chartType": "BarChart",
            "title": "Spending by Department (Top 10)",
            "xKey": "name",
            "yKey": "amount_usd",
            "xLabel": "Department",
            "yLabel": "Amount (USD)",
            "data": _top_n(dept_totals),
        }
    )

    # 2. Spending by sub-category (top 10)
    sub_totals = defaultdict(int)
    for e in entries:
        sub_totals[e["subcategory"]] += e["amount_usd"]
    charts.append(
        {
            "chartType": "BarChart",
            "title": "Spending by Sub-category (Top 10)",
            "xKey": "name",
            "yKey": "amount_usd",
            "xLabel": "Sub-category",
            "yLabel": "Amount (USD)",
            "data": _top_n(sub_totals),
        }
    )

    # 3. Positive vs negative changes
    positive = sum(e["amount_usd"] for e in entries if e["amount_usd"] > 0)
    negative = -sum(e["amount_usd"] for e in entries if e["amount_usd"] < 0)
    charts.append(
        {
            "chartType": "PieChart",
            "title": "Funding Increases vs Reductions",
            "data": [
                {"name": "Increases",  "value": positive},
                {"name": "Reductions", "value": negative},
            ],
        }
    )

    return charts


# ────────────────────────────────────────────────────────────────────────────
@worker_task(task_definition_name="budget_graph_recs")
def budget_graph_recs(taskId: str) -> Dict[str, Any]:
    """
    • taskId Human-task ID such as 'oqweb2874c6b-231a-11f0-9477-2ebdeb26eda5'.

    Returns
    -------
    { "graphs": [ …chart specs… ] }
    """
    if not API_KEY:
        raise RuntimeError("ORKES_API_KEY env var is missing")

    output = _fetch_task_output(taskId)
    entries = output.get("budget_entries", [])
    return {"graphs": _suggest_charts(entries)}
