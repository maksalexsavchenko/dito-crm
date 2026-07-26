import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Image as ImageIcon, Inbox } from 'lucide-react';
import { DataTable, Badge, Button, cn, toast } from '@dito/ui';
import { statusColor, type WSection, type WCol, type WRow } from '../data/warehouse';
import { DocumentDetailSheet } from './DocumentDetailSheet';
import { FilterSelect } from './FilterSelect';
import { useWarehouseDocs } from '../stores/warehouseDocs';

function parseSum(v: string | undefined): number {
  const n = Number((v ?? '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const sumFmt = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

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

function newDocRow(section: WSection): WRow {
  const today = new Date().toLocaleDateString('uk-UA');
  const row: WRow = {};
  section.cols.forEach((c, i) => {
    if (i === 0) row[c.key] = `${(section.createLabel || 'D')[0]}${Math.floor(1000 + Math.random() * 9000)}`;
    else if (c.key === 'by') row[c.key] = 'Ви';
    else if (c.key === 'date') row[c.key] = today;
    else if (c.kind === 'status') row[c.key] = 'Чернетка';
    else if (c.kind === 'sum') row[c.key] = '0';
    else row[c.key] = '—';
  });
  return row;
}

export function WarehouseSection({ id, section }: { id: string; section: WSection }) {
  const rows = useWarehouseDocs((s) => s.rows[id] ?? []);
  const addDoc = useWarehouseDocs((s) => s.addDoc);
  const [selRow, setSelRow] = useState<WRow | null>(null);
  const [docOpen, setDocOpen] = useState(false);

  const statusCol = section.cols.find((c) => c.kind === 'status');
  const whCol = section.cols.find((c) => c.key === 'warehouse');
  const sumCol = section.cols.find((c) => c.kind === 'sum');
  const [statusF, setStatusF] = useState('all');
  const [whF, setWhF] = useState('all');

  const statusOptions = useMemo(
    () => (statusCol ? [...new Set(rows.map((r) => r[statusCol.key]).filter(Boolean))] : []),
    [rows, statusCol],
  );
  const whOptions = useMemo(
    () => (whCol ? [...new Set(rows.map((r) => r[whCol.key]).filter(Boolean))] : []),
    [rows, whCol],
  );

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!statusCol || statusF === 'all' || r[statusCol.key] === statusF) &&
          (!whCol || whF === 'all' || r[whCol.key] === whF),
      ),
    [rows, statusCol, whCol, statusF, whF],
  );

  const total = useMemo(
    () => (sumCol ? filteredRows.reduce((acc, r) => acc + parseSum(r[sumCol.key]), 0) : 0),
    [filteredRows, sumCol],
  );

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
          <Button
            className="shrink-0"
            onClick={() => {
              const row = newDocRow(section);
              addDoc(id, row);
              toast.success(`${section.createLabel}: ${row[section.cols[0].key]} створено`);
            }}
          >
            <Plus className="size-4" />
            {section.createLabel}
          </Button>
        )}
      </div>

      {rows.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={filteredRows}
            onRowClick={(r) => {
              setSelRow(r);
              setDocOpen(true);
            }}
            searchColumn={section.searchKey}
            searchPlaceholder="Пошук…"
            toolbar={
              <>
                {whCol && whOptions.length > 0 && (
                  <FilterSelect
                    label="Склад"
                    value={whF}
                    onValueChange={setWhF}
                    options={[{ value: 'all', label: 'Всі' }, ...whOptions.map((w) => ({ value: w, label: w }))]}
                  />
                )}
                {statusCol && statusOptions.length > 0 && (
                  <FilterSelect
                    label="Статус"
                    value={statusF}
                    onValueChange={setStatusF}
                    options={[{ value: 'all', label: 'Всі' }, ...statusOptions.map((s) => ({ value: s, label: s }))]}
                  />
                )}
              </>
            }
            labels={{ columns: 'Колонки', empty: 'Нічого не знайдено', page: 'Стор.', of: 'з' }}
          />
          {sumCol && (
            <div className="flex items-baseline justify-end gap-1.5 text-sm">
              <span className="text-muted-foreground">Разом:</span>
              <span className="font-semibold tabular-nums">{sumFmt.format(total)} грн</span>
            </div>
          )}
        </>
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
