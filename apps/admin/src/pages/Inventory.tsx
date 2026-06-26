import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Download,
  Trash2,
  Pencil,
  Copy,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
  toast,
} from '@dito/ui';
import { products, type Product, type StockStatus } from '../data/products';
import { ProductDetailSheet } from '../components/ProductDetailSheet';
import { WarehouseSection } from '../components/WarehouseSection';
import { warehouseSections } from '../data/warehouse';

const uah = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

const categories = [...new Set(products.map((p) => p.category))];
const warehouses = [...new Set(products.map((p) => p.warehouse))];

// Серійний облік і мін. залишок виводимо з категорії (без зміни даних).
const serialCategories = new Set(['Смартфони', 'Ноутбуки', 'Планшети']);
const isSerial = (p: Product) => serialCategories.has(p.category);
const minStockFor = (p: Product) => (serialCategories.has(p.category) ? 3 : 8);

const statusClass: Record<StockStatus, string> = {
  in_stock: 'bg-success/15 text-success',
  low: 'bg-warning/15 text-warning',
  out: 'bg-destructive/15 text-destructive',
};

// Сторінкові вкладки складу (як у RoApp).
const warehouseTabs = [
  'residue',
  'devices',
  'supplierOrders',
  'receipt',
  'reservation',
  'conversion',
  'transfer',
  'count',
  'writeoff',
  'returns',
];

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-auto gap-1.5">
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Inventory() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [wh, setWh] = useState('all');
  const [cat, setCat] = useState('all');
  const [avail, setAvail] = useState('all');

  const openDetail = (p: Product) => {
    setSelected(p);
    setDetailOpen(true);
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (wh === 'all' || p.warehouse === wh) &&
          (cat === 'all' || p.category === cat) &&
          (avail === 'all' || (avail === 'available' ? p.status !== 'out' : p.status === 'out')),
      ),
    [wh, cat, avail],
  );

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
      accessorKey: 'sku',
      header: () => t('inventory.col.sku'),
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.sku}</span>,
    },
    {
      id: 'image',
      header: () => t('inventory.col.image'),
      enableSorting: false,
      cell: () => (
        <div className="flex size-9 items-center justify-center rounded-md border bg-muted/40">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>{t('inventory.col.name')}</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex min-w-[170px] items-center gap-2">
          {isSerial(row.original) && (
            <Badge variant="outline" className="px-1 py-0 font-mono text-[10px] text-muted-foreground">
              SN
            </Badge>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => <SortableHeader column={column}>{t('inventory.col.stock')}</SortableHeader>,
      cell: ({ row }) => (
        <span
          className={cn('tabular-nums', row.original.status !== 'in_stock' && 'font-medium text-destructive')}
        >
          {row.original.stock}
        </span>
      ),
    },
    {
      id: 'minStock',
      header: () => t('inventory.col.minStock'),
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{minStockFor(row.original)}</span>,
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

  const all = t('inventory.filter.all');

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold">{t('nav.inventory')}</h1>
      <p className="mb-4 text-sm text-muted-foreground">{t('inventory.subtitle')}</p>

      <Tabs defaultValue="residue">
        <div className="no-scrollbar mb-4 overflow-x-auto border-b">
          <TabsList variant="line" className="h-10 p-0">
            {warehouseTabs.map((v) => (
              <TabsTrigger key={v} value={v} className="whitespace-nowrap">
                {t(`inventory.wtabs.${v}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="residue" className="mt-0">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={openDetail}
            searchColumn="name"
            searchPlaceholder={t('inventory.search')}
            toolbar={
              <>
                <FilterSelect
                  label={t('inventory.filter.warehouse')}
                  value={wh}
                  onValueChange={setWh}
                  options={[{ value: 'all', label: all }, ...warehouses.map((w) => ({ value: w, label: w }))]}
                />
                <FilterSelect
                  label={t('inventory.filter.category')}
                  value={cat}
                  onValueChange={setCat}
                  options={[{ value: 'all', label: all }, ...categories.map((c) => ({ value: c, label: c }))]}
                />
                <FilterSelect
                  label={t('inventory.filter.availability')}
                  value={avail}
                  onValueChange={setAvail}
                  options={[
                    { value: 'all', label: all },
                    { value: 'available', label: t('inventory.filter.available') },
                    { value: 'out', label: t('inventory.filter.out') },
                  ]}
                />
              </>
            }
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
        </TabsContent>

        {warehouseTabs
          .filter((v) => v !== 'residue')
          .map((v) => (
            <TabsContent key={v} value={v} className="mt-0">
              <WarehouseSection id={v} section={warehouseSections[v]} />
            </TabsContent>
          ))}
      </Tabs>

      <ProductDetailSheet product={selected} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
