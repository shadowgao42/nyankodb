"""Extract initial-roll discount grants (item IDs 301/302) from official item.tsv."""
from __future__ import annotations

from datetime import datetime

from update_stage_schedule import REGIONS, ScheduleError, iso, parse_sale


def make_discounts(content: bytes, region: str, fetched_at: datetime) -> dict:
    try:
        lines = content.decode("utf-8-sig").strip().splitlines()
        if not lines or lines[0] != "[start]" or lines[-1] != "[end]":
            raise ValueError
        events = []
        for row, line in enumerate(lines[1:-1], 2):
            if not line.strip():
                continue
            cells = line.split("\t")
            pos = 8
            sections = int(cells[7])
            if sections < 0 or sections > len(cells):
                raise ValueError
            for _ in range(sections):
                for width in (4, 1):
                    count = int(cells[pos])
                    if count < 0 or count > len(cells):
                        raise ValueError
                    pos += 1 + count * width
                pos += 1  # Week mask.
                count = int(cells[pos])
                if count < 0 or count > len(cells):
                    raise ValueError
                pos += 1 + count * 2
            item_id = int(cells[pos + 1])
            if item_id not in (301, 302):
                continue
            # Reuse the existing header/date/version validation, without treating
            # item IDs as stages or interpreting unrelated item distributions.
            stage_row = "\t".join(cells[:pos] + ["1", str(item_id)])
            record = parse_sale(("[start]\n" + stage_row + "\n[end]").encode())[0]
            if record["sections"]:
                raise ScheduleError("Unsupported recurring initial-discount grant; previous feed preserved")
            events.append(dict(itemId=item_id, categoryId=int(cells[pos]), sourceRow=row,
                start=iso(record["start"]), end=iso(record["end"]),
                minVersion=record["minVersion"], maxVersion=record["maxVersion"]))
        return dict(schemaVersion=1, region=region, fetchedAt=iso(fetched_at),
            source=REGIONS[region]["source"].replace("sale.tsv", "item.tsv"), events=events)
    except (IndexError, ValueError, UnicodeError):
        raise ScheduleError("Invalid official item.tsv discount data; previous feed preserved") from None
