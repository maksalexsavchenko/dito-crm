import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Truck } from 'lucide-react';
import { DataTable, SortableHeader, Badge, Button } from '@dito/ui';
import {
  inPeriod,
  periodOptions,
  postingTotal,
  type Period,
  type Posting,
} from '../data/postings';
import { usePostings } from '../stores/postings';
import { FilterSelect } from './FilterSelect';
import { PostingDetailSheet } from './PostingDetailSheet';

const uah = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' });

function Stamp({ who, at }: { who?: string; at?: string }) {
  if (!who || !at) return <span className="text-muted-foreground">—</span>;
  const d = new Date(at);
  return (
    <div>
      <div>{who}</div>
      <div className="text-xs text-muted-foreground">
        {dateFmt.format(d)} {timeFmt.format(d)}
      </div>
    </div>
  );
}

export function PostingsSection() {
  const postings = usePostings((s) => s.postings);

  const [selected, setSelected] = useState<Posting | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [period, setPeriod] = useState<Period>('all');

  const openDetail = (p: Posting) => {
    setSelected(p);
    setCreateMode(false);
    setDetailOpen(true);
  };
  const openCreate = () => {
    setSelected(null);
    setCreateMode(true);
    setDetailOpen(true);
  };

  const filtered = useMemo(
    () => postings.filter((p) => inPeriod(p.createdAt, period)),
    [postings, period],
  );

  const total = useMemo(() => filtered.reduce((acc, p) => acc + postingTotal(p), 0), [filtered]);

  const columns: ColumnDef<Posting>[] = [
    {
      accessorKey: 'num',
      header: () => <div className="text-right">Оприбуткування</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          {row.original.isDraft && (
            <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
              Чернетка
            </Badge>
          )}
          <span className="font-medium text-primary">{row.original.num}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableHeader column={column}>Створено</SortableHeader>,
      cell: ({ row }) => <Stamp who={row.original.createdBy} at={row.original.createdAt} />,
    },
    {
      id: 'updated',
      header: () => 'Оновлено',
      enableSorting: false,
      cell: ({ row }) => <Stamp who={row.original.updatedBy} at={row.original.updatedAt} />,
    },
    {
      id: 'invoice',
      header: () => 'Накладна',
      cell: ({ row }) => (
        <div>
          <div>{row.original.invoice || '—'}</div>
          <div className="text-xs text-muted-foreground">
            {dateFmt.format(new Date(row.original.invoiceDate))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'supplier',
      header: ({ column }) => <SortableHeader column={column}>Постачальник</SortableHeader>,
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 text-primary">
          {row.original.supplier}
          <Truck className="size-3.5 opacity-60" />
        </span>
      ),
    },
    {
      accessorKey: 'warehouse',
      header: () => 'Склад',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.warehouse}</span>,
    },
    {
      accessorKey: 'comment',
      header: () => 'Коментар',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.comment || '—'}</span>
      ),
    },
    {
      id: 'amount',
      header: () => <div className="text-right">Сума, грн</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums">{uah.format(postingTotal(row.original))}</div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Оприбуткуйте товари на склад, щоб вести облік, відстежувати залишки та історію руху.
        </p>
        <Button className="shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Оприбуткування
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={openDetail}
        searchColumn="supplier"
        searchPlaceholder="Пошук за постачальником…"
        toolbar={
          <FilterSelect
            label="Створено"
            value={period}
            onValueChange={(v) => setPeriod(v as Period)}
            options={periodOptions}
          />
        }
        labels={{ columns: 'Колонки', empty: 'Нічого не знайдено', selected: 'Вибрано', page: 'Стор.', of: 'з' }}
      />

      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">Всього — {filtered.length}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground">Разом:</span>
          <span className="font-semibold tabular-nums">{uah.format(total)} грн</span>
        </span>
      </div>

      <PostingDetailSheet
        posting={selected}
        mode={createMode ? 'create' : 'edit'}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
