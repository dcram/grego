"""
Import GregoBase SQL dump into the grego PostgreSQL database.

Usage:
    python import_gregobase.py [path_to_sql_dump]

If no path is given, downloads the dump from GitHub automatically.
Requires the database to be running (docker compose up db).
"""

import re
import sys
import urllib.request

from sqlalchemy import text

from app.core.database import Base, engine

DUMP_URL = "https://raw.githubusercontent.com/gregorio-project/GregoBase/master/gregobase_online.sql"

TABLE_MAP = {
    "gregobase_sources": "sources",
    "gregobase_tags": "tags",
    "gregobase_chants": "chants",
    "gregobase_chant_sources": "chant_sources",
    "gregobase_chant_tags": "chant_tags",
}

COLUMN_REMAP = {
    "office-part": "office_part",
    "cantusid": "cantus_id",
    "source": "source_id",
}

COLUMNS_KEEP = {
    "sources": {"id", "year", "period", "editor", "title", "description", "caption"},
    "tags": {"id", "tag"},
    "chants": {
        "id", "cantus_id", "version", "incipit", "initial", "office_part",
        "mode", "mode_var", "transcriber", "commentary", "gabc", "gabc_verses",
        "tex_verses", "remarks", "copyrighted",
    },
    "chant_sources": {"chant_id", "source_id", "page", "sequence", "extent"},
    "chant_tags": {"chant_id", "tag_id"},
}

# Import order: parents before children
IMPORT_ORDER = ["sources", "tags", "chants", "chant_sources", "chant_tags"]


def download_dump() -> str:
    print("Downloading GregoBase dump from GitHub...")
    path = "/tmp/gregobase_online.sql"
    urllib.request.urlretrieve(DUMP_URL, path)
    print(f"Downloaded to {path}")
    return path


def parse_row_values(row_str: str) -> list[str]:
    """Parse a comma-separated row from a MySQL INSERT, respecting quoted strings."""
    values = []
    current = []
    in_string = False
    i = 0
    while i < len(row_str):
        ch = row_str[i]
        if ch == "\\" and in_string and i + 1 < len(row_str):
            current.append(ch)
            current.append(row_str[i + 1])
            i += 2
            continue
        if ch == "'":
            in_string = not in_string
            current.append(ch)
        elif ch == "," and not in_string:
            values.append("".join(current).strip())
            current = []
        else:
            current.append(ch)
        i += 1
    if current:
        values.append("".join(current).strip())
    return values


def extract_rows_from_values(values_str: str) -> list[str]:
    """Extract individual (row) tuples from VALUES clause."""
    rows = []
    i = 0
    in_string = False
    depth = 0
    current_start = None

    while i < len(values_str):
        ch = values_str[i]
        if ch == "\\" and in_string and i + 1 < len(values_str):
            i += 2
            continue
        if ch == "'":
            in_string = not in_string
        elif not in_string:
            if ch == "(":
                if depth == 0:
                    current_start = i + 1
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0 and current_start is not None:
                    rows.append(values_str[current_start:i])
                    current_start = None
        i += 1
    return rows


def find_insert_blocks(content: str) -> list[tuple[str, list[str], str]]:
    """
    Find all INSERT blocks. Returns list of (gb_table, columns, values_string).
    Handles multi-line INSERT statements by finding the matching semicolon.
    """
    blocks = []
    header_re = re.compile(
        r"INSERT INTO `(\w+)`\s+\(([^)]+)\)\s+VALUES\s*"
    )

    pos = 0
    while pos < len(content):
        m = header_re.search(content, pos)
        if not m:
            break

        gb_table = m.group(1)
        cols = [c.strip().strip("`") for c in m.group(2).split(",")]
        values_start = m.end()

        # Find the ending semicolon, respecting quoted strings
        i = values_start
        in_string = False
        while i < len(content):
            ch = content[i]
            if ch == "\\" and in_string and i + 1 < len(content):
                i += 2
                continue
            if ch == "'":
                in_string = not in_string
            elif ch == ";" and not in_string:
                break
            i += 1

        values_str = content[values_start:i]
        blocks.append((gb_table, cols, values_str))
        pos = i + 1

    return blocks


def import_data(sql_path: str):
    print("Reading SQL dump...")
    with open(sql_path, "r", encoding="utf-8") as f:
        content = f.read()

    print("Dropping and recreating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    print("Parsing INSERT statements...")
    blocks = find_insert_blocks(content)

    # Group all rows by target table
    table_data: dict[str, list[tuple[list[str], list[int], list[str]]]] = {
        t: [] for t in IMPORT_ORDER
    }

    for gb_table, gb_cols, values_str in blocks:
        if gb_table not in TABLE_MAP:
            continue
        target_table = TABLE_MAP[gb_table]

        col_mapping = []
        for i, gb_col in enumerate(gb_cols):
            mapped = COLUMN_REMAP.get(gb_col, gb_col)
            if mapped in COLUMNS_KEEP[target_table]:
                col_mapping.append((i, mapped))

        if not col_mapping:
            continue

        target_cols = [m[1] for m in col_mapping]
        col_indices = [m[0] for m in col_mapping]

        rows = extract_rows_from_values(values_str)
        for row_str in rows:
            table_data[target_table].append((target_cols, col_indices, row_str, gb_cols))

    # Import in FK order
    total_imported = 0
    for target_table in IMPORT_ORDER:
        entries = table_data[target_table]
        if not entries:
            continue

        print(f"Importing {len(entries)} rows into {target_table}...")

        # All entries for a table share the same columns
        target_cols = entries[0][0]
        col_indices = entries[0][1]

        placeholders = ", ".join(f":{c}" for c in target_cols)
        insert_sql = text(
            f"INSERT INTO {target_table} ({', '.join(target_cols)}) "
            f"VALUES ({placeholders}) ON CONFLICT DO NOTHING"
        )

        batch = []
        for target_cols_row, col_indices_row, row_str, gb_cols in entries:
            values = parse_row_values(row_str)
            if len(values) < max(col_indices_row) + 1:
                continue

            row_dict = {}
            for idx, col_name in zip(col_indices_row, target_cols_row):
                val = values[idx] if idx < len(values) else None
                if val == "NULL":
                    val = None
                elif val.startswith("'") and val.endswith("'"):
                    val = (
                        val[1:-1]
                        .replace("\\'", "'")
                        .replace("\\\\", "\\")
                        .replace("\\n", "\n")
                        .replace("\\r", "\r")
                    )
                row_dict[col_name] = val

            batch.append(row_dict)

            if len(batch) >= 500:
                with engine.begin() as conn:
                    conn.execute(insert_sql, batch)
                total_imported += len(batch)
                batch = []

        if batch:
            with engine.begin() as conn:
                conn.execute(insert_sql, batch)
            total_imported += len(batch)

        print(f"  Done: {target_table} ({len(entries)} rows)")

    print(f"\nImport complete! {total_imported} total rows imported.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sql_path = sys.argv[1]
    else:
        sql_path = download_dump()

    import_data(sql_path)
