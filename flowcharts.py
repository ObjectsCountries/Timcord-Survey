#!/usr/bin/env python3

import json
import pathlib
import re
import typing

from python_mermaid.diagram import MermaidDiagram, Node, Link

_CATEGORIES: dict[str, str] = {"DEBUG_": "Debug ", "": ""}

_FLOWCHART_FILE: pathlib.Path = pathlib.Path("README.md")

_JSON: typing.TypeAlias = (
    dict[str, "_JSON"] | list["_JSON"] | str | int | float | bool | None
)

_QUESTIONS_FILE: pathlib.Path = pathlib.Path("src/assets/questions.json")


def _snake_case(s: str):
    """
    Overrides the Node class's snake_case method to be more accurate.
    """
    s = s.replace("-", " ")
    s = s.replace("_", " ")

    s = re.sub(" ([A-Z]+)", r"_\1", s)  # All caps word

    s = re.sub(" ([A-Z][a-z]+)", r"_\1", s)  # Capitalized word

    s = re.sub("([a-z])([A-Z])", r"\1_\2", s)  # Camel Case word

    s = re.sub("([A-Z])([A-Z])([a-z]+)", r"\1_\2\3", s)  # words such as THESEWords

    s = re.sub("(  )", r"__", s)  # Multiple spaces

    s = "_".join(s.split()).lower()

    return s


def _make_flowchart(category: str) -> MermaidDiagram:
    """
    Creates a flowchart from the given category.
    """
    questions: _JSON = {}
    substitutions: _JSON = {}
    with open(_QUESTIONS_FILE) as f:
        survey_questions: _JSON = json.load(f)
        questions = survey_questions[category + "questions"]
        substitutions = survey_questions[category + "substitutions"]

    nodes: list[Node] = [
        Node(_snake_case(question["id"]), question["title"], shape="stadium-shape")
        for question in questions
    ]
    links: list[Link] = []

    for question in questions:
        if question["question_type"] == "multiple_choice":
            for answer in question["answers"]:
                links.append(
                    Link(
                        next(n for n in nodes if n.id == question["id"].lower()),
                        next(n for n in nodes if n.id == answer["destination"].lower()),
                        message=answer["text"],
                    )
                )
        # If the question is not an end question
        elif question["destination"] is not None:
            links.append(
                Link(
                    next(n for n in nodes if n.id == question["id"].lower()),
                    next(n for n in nodes if n.id == question["destination"].lower()),
                    message=question["question_type"],
                )
            )

    chart: MermaidDiagram = MermaidDiagram(
        title=f"Timcord Survey {_CATEGORIES[category]}Flowchart",
        nodes=nodes,
        links=links,
    )
    return chart


def main() -> None:
    """
    Modifies README.md.
    """
    with open(_FLOWCHART_FILE, "rt+") as f:
        full_file: str = f.read()
        for category in _CATEGORIES.keys():
            chart: MermaidDiagram = _make_flowchart(category)
            full_file = re.sub(
                f"(## {_CATEGORIES[category]}Flowchart\\n\\n```mermaid\\n).*?(\\n```)",
                f"\\1{str(chart)}\\2",
                full_file,
                flags=re.DOTALL,
            )
            full_file = re.sub("\\{(.*?)\\)", "{\\1}", full_file)
        f.seek(0)
        f.write(full_file)
        f.truncate()


if __name__ == "__main__":
    main()
