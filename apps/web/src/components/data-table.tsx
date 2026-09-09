import { Table, type TableProps } from "@mantine/core";
import type { ReactTable, RowData } from "@tanstack/react-table";

import { features } from "./table-features";

type DataTableProps<TData extends RowData> = TableProps & {
  table: ReactTable<typeof features, TData>;
};

export function DataTable<TData extends RowData>({ table, ...tableProps }: DataTableProps<TData>) {
  return (
    <Table
      striped
      highlightOnHover
      styles={{
        th: {
          textAlign: "center",
        },
      }}
      {...tableProps}
    >
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th key={header.id}>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>

      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <Table.Td key={cell.id}>
                <table.FlexRender cell={cell} />
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
