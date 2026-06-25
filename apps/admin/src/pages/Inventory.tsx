import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Download, Trash2, Pencil, Copy, Eye } from 'lucide-react';
import {
  DataTable,
  SortableHeader,
  Checkbox,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  cn,
  toast,
} from '@dito/ui';
import { products, type Product, type StockStatus } from '../data/products';
import { ProductDetailSheet } from '../components/ProductDetailSheet';

const uah = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

const statusClass: Record<StockStatus, string> = {
  in_stock: 'bg-success/15 text-success',
  low: 'bg-warning/15 text-warning',
  out: 'bg-destructive/15 text-destructive',
};

export function Inventory() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (p: Product) => {
    setSelected(p);
    setDetailOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('inventory.col.name')}</SortableHeader>,
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">{row.original.sku}</div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: () => t('inventory.col.category'),
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: 'warehouse',
      header: () => t('inventory.col.warehouse'),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.warehouse}</span>,
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => <SortableHeader column={column}>{t('inventory.col.stock')}</SortableHeader>,
      cell: ({ row }) => (
        <span
          className={cn(
            'tabular-nums',
            row.original.status !== 'in_stock' && 'font-medium text-destructive',
          )}
        >
          {row.original.stock}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <div className="text-right">
          <SortableHeader column={column}>{t('inventory.col.price')}</SortableHeader>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums">{uah.format(row.original.price)}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => t('inventory.col.status'),
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('border-transparent', statusClass[row.original.status])}>
          {t(`inventory.status.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="actions">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(row.original)}>
                <Eye className="size-4" /> {t('inventory.detail.view')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="size-4" /> {t('inventory.row.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="size-4" /> {t('inventory.row.duplicate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => toast(t('inventory.toast.deleted'), { description: row.original.name })}
              >
                <Trash2 className="size-4" /> {t('inventory.row.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">{t('nav.inventory')}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t('inventory.subtitle')}</p>

      <DataTable
        columns={columns}
        data={products}
        onRowClick={openDetail}
        searchColumn="name"
        searchPlaceholder={t('inventory.search')}
        labels={{
          columns: t('inventory.columns'),
          empty: t('inventory.empty'),
          selected: t('inventory.selected'),
          page: t('inventory.page'),
          of: t('inventory.of'),
        }}
        bulkActions={(rows) => (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(t('inventory.toast.exported'), { description: `${rows.length} поз.` })}
            >
              <Download className="size-4" />
              {t('inventory.bulk.export')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast(t('inventory.toast.deleted'), { description: `${rows.length} поз.` })}
            >
              <Trash2 className="size-4" />
              {t('inventory.bulk.delete')}
            </Button>
          </>
        )}
      />

      <ProductDetailSheet product={selected} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
