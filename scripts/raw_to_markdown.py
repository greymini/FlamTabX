#!/usr/bin/env python3
"""Convert pdftotext layout output into cleaner Markdown for the blog."""
import re
from pathlib import Path

RAW = Path(__file__).resolve().parent.parent / "content" / "flamtabx-pitch-raw.txt"
OUT = Path(__file__).resolve().parent.parent / "src" / "content" / "flamtabx-pitch.md"

LINE_SECTION = re.compile(r"^\s*(\d+)\)\s+(.+?)\s*$")


def is_real_section(line: str) -> bool:
    m = LINE_SECTION.match(line)
    if not m:
        return False
    title = m.group(2).strip()
    if title.lower().startswith("http"):
        return False
    if title.startswith("linkinghub."):
        return False
    # Section titles in this deck are words, not bare URLs
    if "://" in title and " " not in title[:20]:
        return False
    return True


def slugify(title: str) -> str:
    t = re.sub(r"^\d+\)\s*", "", title)
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t.lower()).strip("-")
    return t[:60]


def main() -> None:
    raw = RAW.read_text(encoding="utf-8", errors="replace")
    raw = raw.replace("\f", "\n")
    lines = [ln.rstrip() for ln in raw.splitlines()]

    out: list[str] = []
    i = 0
    # Skip header fluff until tagline paragraph
    while i < len(lines):
        s = lines[i].strip()
        if s.startswith("A climate-adaptive"):
            break
        i += 1

    out.append("# FlamTabX")
    out.append("")
    out.append(
        "*By Aditya Ratnaparkhi (Cohort 3); Venture Coach: Radwa Rostom*"
    )
    out.append("")

    buf: list[str] = []

    def flush():
        nonlocal buf
        if buf:
            out.append(" ".join(buf).strip())
            out.append("")
            buf = []

    while i < len(lines):
        ln = lines[i]
        stripped = ln.strip()

        if is_real_section(ln):
            flush()
            m = LINE_SECTION.match(ln)
            assert m
            num, title = m.group(1), m.group(2).strip()
            sid = slugify(f"{num}) {title}")
            out.append(f"## {num}) {title} {{#{sid}}}")
            out.append("")
            i += 1
            continue

        if re.match(r"^References?:?\s*$", stripped, re.I):
            flush()
            out.append("### References")
            out.append("")
            i += 1
            ref_num = 0
            while i < len(lines):
                s = lines[i].strip()
                if is_real_section(lines[i]):
                    break
                if not s:
                    i += 1
                    continue
                if re.match(r"^\d+\)\s*https?://", s):
                    ref_num += 1
                    url = s.split(")", 1)[1].strip()
                    j = i + 1
                    while j < len(lines) and lines[j].strip() and not re.match(
                        r"^\d+\)\s*https?://", lines[j].strip()
                    ):
                        if is_real_section(lines[j]):
                            break
                        cont = lines[j].strip()
                        if cont.startswith("http"):
                            break
                        url = url.rstrip("-") + cont
                        j += 1
                    out.append(f"{ref_num}. [{url}]({url})")
                    i = j
                    continue
                if s.startswith("http"):
                    ref_num += 1
                    url = s
                    j = i + 1
                    while j < len(lines) and lines[j].strip() and not lines[
                        j
                    ].strip().startswith("http"):
                        if is_real_section(lines[j]):
                            break
                        if re.match(r"^\d+\)\s*https?://", lines[j].strip()):
                            break
                        url = url.rstrip("-") + lines[j].strip()
                        j += 1
                    out.append(f"{ref_num}. [{url}]({url})")
                    i = j
                    continue
                # continuation of ref title + url on next lines (PDF wrap)
                if ref_num > 0 and s and not s.startswith("http"):
                    prev = out[-1]
                    if prev.startswith(f"{ref_num}."):
                        out.pop()
                        # extract url from markdown link
                        um = re.search(r"\((https?://[^)]+)\)", prev)
                        if um:
                            u = um.group(1).rstrip("-") + s
                            out.append(f"{ref_num}. [{u}]({u})")
                i += 1
            out.append("")
            continue

        if stripped == ")" or stripped == "":
            i += 1
            continue

        if "Budget Overview" in stripped:
            flush()
            out.append("### Budget overview")
            out.append("")
            i += 1
            tbl: list[str] = []
            while i < len(lines):
                if is_real_section(lines[i]):
                    break
                if lines[i].strip():
                    tbl.append(lines[i].rstrip())
                i += 1
            out.append("```text")
            out.extend(tbl)
            out.append("```")
            out.append("")
            continue

        if "Application 1" in stripped and "Industrail" in stripped:
            flush()
            out.append(
                "*Note: The source document includes prototype imagery for industrial sheet applications; figures are omitted here.*"
            )
            out.append("")
            i += 1
            continue
        if stripped.startswith("Application 2"):
            i += 1
            continue

        if not stripped:
            flush()
            i += 1
            continue

        buf.append(stripped)
        i += 1

    flush()
    OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
