#!/usr/bin/env python3

from json import load
from typing import TypeAlias
import re

from python_mermaid.diagram import MermaidDiagram, Node, Link

_CATEGORIES: dict[str, str] = {
    "DEBUG_": "Debug",
    "": ""
}

_JSON: TypeAlias = dict[str, "_JSON"] | list["_JSON"] | str | int | float | bool | None

def _make_flowchart(category: str) -> MermaidDiagram:
    questions: _JSON = {}
    substitutions: _JSON = {}
    with open("src/assets/questions.json") as f:
        survey_questions: _JSON = load(f)
        questions = survey_questions[category + "questions"]
        substitutions = survey_questions[category + "substitutions"]

    nodes: list[Node] = [Node(question["id"]) for question in questions]
    links: list[Link] = []

    for question in questions:
        if question["question_type"] == "multiple_choice":
            for answer in question["answers"]:
                links.append(
                    Link(
                        next(n for n in nodes if n.id == question["id"].lower()),
                        next(n for n in nodes if n.id == answer["destination"].lower()),
                        message=answer["id"],
                    )
                )
        elif question["destination"] is not None:
            links.append(
                Link(
                    next(n for n in nodes if n.id == question["id"].lower()),
                    next(n for n in nodes if n.id == question["destination"].lower()),
                    message=question["question_type"],
                )
            )

    chart: MermaidDiagram = MermaidDiagram(title=f"Timcord Survey {_CATEGORIES[category]} Flowchart", nodes=nodes, links=links)

    return chart

def main() -> None:
    with open("README.md", "rt+") as f:
        for category in _CATEGORIES.keys():
            chart: MermaidDiagram = _make_flowchart(category)
            full_file: str = f.read()
            full_file = re.sub(
                f"## {_CATEGORIES[category]} Flowchart\\n\\n```mermaid\\n(.*?)\\n```",
                f"## {_CATEGORIES[category]} Flowchart\n\n```mermaid\n" + str(chart) + "\n```",
                full_file,
                flags=re.DOTALL,
            )
            f.seek(0)
            f.write(full_file)
            f.truncate()


if __name__ == "__main__":
    main()
