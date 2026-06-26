import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Image as ImageIcon, Inbox } from 'lucide-react';
import { DataTable, Badge, Button, cn, toast } from '@dito/ui';
import { statusColor, type WSection, type WCol, type WRow } from '../data/warehouse';
import { DocumentDetailSheet } from './DocumentDetailSheet';

function renderCell(col: WCol, value: string) {
  switch (col.kind) {
    case 'image':
      return (
        <div className="flex size-9 items-center justify-center rounded-md border bg-muted/40">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      );
    case 'status':
      return (
        <Badge variant="outline" className={cn('border-transparent', statusColor[value] ?? 'bg-muted text-muted-foreground')}>
          {value}
        </Badge>
      );
    case 'sum':
      return <div className="text-right font-medium tabular-nums">{value ? `${value} грн` : '—'}</div>;
    case 'mono':
      return <span className="font-mono text-xs text-muted-foreground">{value || '—'}</span>;
    case 'muted':
      return <span className="text-muted-foreground">{value || '—'}</span>;
    case 'bold':
      return <span className="font-medium">{value || '—'}</span>;
    default:
      return <span>{value || '—'}</span>;
  }
}

export function WarehouseSection({ id, section }: { id: string; section: WSection }) {
  const [selRow, setSelRow] = useState<WRow | null>(null);
  const [docOpen, setDocOpen] = useState(false);

  const columns = useMemo<ColumnDef<WRow>[]>(
    () =>
      section.cols.map((col) => ({
        accessorKey: col.key,
        header: () => <div className={col.align === 'right' ? 'text-right' : undefined}>{col.header}</div>,
        cell: ({ row }) => renderCell(col, (row.original[col.key] as string) ?? ''),
        enableSorting: col.kind !== 'image',
      })),
    [section],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">{section.description}</p>
        {section.createLabel && (
          <Button className="shrink-0" onClick={() => toast(`${section.createLabel} — скоро`)}>
            <Plus className="size-4" />
            {section.createLabel}
          </Button>
        )}
      </div>

      {section.rows.length > 0 ? (
        <DataTable
          columns={columns}
          data={section.rows}
          onRowClick={(r) => {
            setSelRow(r);
            setDocOpen(true);
          }}
          searchColumn={section.searchKey}
          searchPlaceholder="Пошук…"
          labels={{ columns: 'Колонки', empty: 'Нічого не знайдено', page: 'Стор.', of: 'з' }}
        />
      ) : (
        <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center text-muted-foreground">
          <Inbox className="size-9 opacity-30" />
          <p className="max-w-xs text-sm">{section.emptyText}</p>
        </div>
      )}

      <DocumentDetailSheet id={id} section={section} row={selRow} open={docOpen} onOpenChange={setDocOpen} />
    </div>
  );
}
