#!/usr/bin/env python3

from json import load
import re

from python_mermaid.diagram import MermaidDiagram, Node, Link

_CATEGORIES = {
    "debug_questions": "Debug Flowchart",
    "questions": "Flowchart"
}


def _make_flowchart(category):
    questions = {}
    with open("src/assets/questions.json") as f:
        questions = load(f)[category]

    nodes = [Node(question["id"]) for question in questions]
    links = []

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

    chart = MermaidDiagram(title=f"Timcord Survey {}", nodes=nodes, links=links)

    with open("README.md", "rt+") as f:
        full_file = f.read()
        full_file = re.sub(
            f"## {_CATEGORIES[category]}\\n\\n```mermaid\\n(.*?)\\n```",
            f"## {_CATEGORIES[category]}\n\n```mermaid\n" + str(chart) + "\n```",
            full_file,
            flags=re.DOTALL,
        )
        f.seek(0)
        f.write(full_file)
        f.truncate()


def main():
    for category in _CATEGORIES.keys():
        _make_flowchart(category)


if __name__ == "__main__":
    main()
