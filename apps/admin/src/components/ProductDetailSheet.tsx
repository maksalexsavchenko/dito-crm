import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Barcode,
  Truck,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Badge,
  Button,
  Separator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  cn,
  toast,
} from '@dito/ui';
import { products, type Product } from '../data/products';

const uah = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
});

const categories = [...new Set(products.map((p) => p.category))];
const warehouses = [...new Set(products.map((p) => p.warehouse))];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Segmented({ options }: { options: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="inline-flex rounded-lg border p-0.5">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => setActive(i)}
          className={cn(
            'rounded-md px-3 py-1 text-sm transition-colors',
            i === active ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function SettingRow({
  label,
  isNew,
  defaultChecked,
}: {
  label: string;
  isNew?: boolean;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2">
      <Checkbox defaultChecked={defaultChecked} />
      <span className="text-sm">{label}</span>
      {isNew && <Badge className="bg-success/15 text-success">NEW</Badge>}
    </label>
  );
}

// ── Загальні ───────────────────────────────────────────────────
function GeneralTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [code, setCode] = useState('');
  const [article, setArticle] = useState(product.sku);
  const barcode = '210000' + product.id.padStart(4, '0') + '7';

  return (
    <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
      {/* Фото */}
      <div className="space-y-3">
        <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted/40">
          <ImageIcon className="size-9 text-muted-foreground/40" />
        </div>
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-2 py-3 text-center text-muted-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-5" />
          <span className="text-[11px] leading-tight">{t('inventory.form.imageHint')}</span>
          <span className="text-[10px] text-muted-foreground/70">{t('inventory.form.imageFormats')}</span>
        </button>
      </div>

      {/* Поля */}
      <div className="space-y-4">
        <Field label={t('inventory.form.type')}>
          <Select defaultValue="default">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('inventory.form.typeDefault')}</SelectItem>
              <SelectItem value="service">{t('inventory.form.typeService')}</SelectItem>
              <SelectItem value="bundle">{t('inventory.form.typeBundle')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={t('inventory.form.category')} required>
          <div className="flex gap-2">
            <Select defaultValue={product.category}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t('inventory.form.allProducts')} › {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" className="shrink-0">
              <Plus className="size-4" />
              {t('inventory.form.addCategory')}
            </Button>
          </div>
        </Field>

        <Field label={t('inventory.form.name')} required>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label={t('inventory.form.description')}>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <Field label={t('inventory.form.unit')} required>
          <Select defaultValue="pcs">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcs">{t('inventory.form.unitPcs')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t('inventory.form.code')}>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </Field>
          <Field label={t('inventory.form.article')}>
            <Input value={article} onChange={(e) => setArticle(e.target.value)} />
          </Field>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="text-sm font-semibold">{t('inventory.form.settings')}</div>

          <div>
            <div className="mb-1 text-sm text-muted-foreground">{t('inventory.form.barcodes')}</div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1 font-mono">
                <Barcode className="size-3.5" />
                {barcode}
              </Badge>
              <Button type="button" variant="link" className="h-auto px-0">
                <span className="underline decoration-dashed underline-offset-4">
                  + {t('inventory.form.addBarcode')}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <SettingRow label={t('inventory.form.setDims')} isNew />
            <SettingRow label={t('inventory.form.warranty')} />
            <SettingRow label={t('inventory.form.expiry')} />
            <SettingRow label={t('inventory.form.serial')} defaultChecked />
            <SettingRow label={t('inventory.form.defaultSupplier')} isNew />
          </div>

          <Separator />

          <div>
            <div className="mb-2 text-sm font-medium">{t('inventory.form.markup')}</div>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('inventory.form.percent')}>
                <Input defaultValue="20" inputMode="numeric" />
              </Field>
              <Field label={t('inventory.form.sum')}>
                <Input defaultValue={String(Math.round(product.price * 0.2))} inputMode="numeric" />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Партії ─────────────────────────────────────────────────────
function BatchesTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  const cost = Math.round(product.price * 0.8);
  const half = Math.max(1, Math.round(product.stock / 2));
  const batches = [
    { doc: 'Оприбуткування #119', supplier: "ТОВ «Дистриб'ютор»", price: cost, qty: half },
    { doc: 'Оприбуткування #98', supplier: 'ТОВ «Імпорт Плюс»', price: Math.round(cost * 0.95), qty: product.stock - half },
  ].filter((b) => b.qty > 0);

  return (
    <div className="space-y-3">
      <Segmented options={[t('inventory.batches.all'), t('inventory.batches.inStock'), t('inventory.batches.outStock')]} />
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>{t('inventory.batches.document')}</TableHead>
              <TableHead>{t('inventory.batches.supplier')}</TableHead>
              <TableHead className="text-right">{t('inventory.batches.price')}</TableHead>
              <TableHead className="text-right">{t('inventory.batches.qty')}</TableHead>
              <TableHead className="text-right">{t('inventory.batches.sum')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((b) => (
              <TableRow key={b.doc}>
                <TableCell className="font-medium">{b.doc}</TableCell>
                <TableCell className="text-muted-foreground">{b.supplier}</TableCell>
                <TableCell className="text-right tabular-nums">{uah.format(b.price)}</TableCell>
                <TableCell className="text-right tabular-nums">{b.qty}</TableCell>
                <TableCell className="text-right tabular-nums">{uah.format(b.price * b.qty)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Історія ────────────────────────────────────────────────────
function HistoryTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  const movements = [
    { doc: 'Продаж #1930', desc: `Зі складу: ${product.warehouse}`, in: 0, out: 1, date: '19.06.2026' },
    { doc: 'Переміщення #44', desc: 'Київ → Львів', in: 0, out: 3, date: '02.05.2026' },
    { doc: 'Оприбуткування #119', desc: `На склад: ${product.warehouse}`, in: 10, out: 0, date: '11.05.2026' },
  ];

  return (
    <div className="space-y-3">
      <Segmented options={[t('inventory.history.all'), t('inventory.history.in'), t('inventory.history.out')]} />
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>{t('inventory.history.document')}</TableHead>
              <TableHead>{t('inventory.history.desc')}</TableHead>
              <TableHead className="text-right">{t('inventory.history.in')}</TableHead>
              <TableHead className="text-right">{t('inventory.history.out')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.doc}>
                <TableCell>
                  <div className="font-medium">{m.doc}</div>
                  <div className="text-xs text-muted-foreground">{m.date}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{m.desc}</TableCell>
                <TableCell className="text-right tabular-nums text-success">{m.in || ''}</TableCell>
                <TableCell className="text-right tabular-nums text-destructive">{m.out || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Замовлення постачальнику ───────────────────────────────────
function SupplierOrdersTab() {
  const { t } = useTranslation();
  return (
    <div className="flex h-52 flex-col items-center justify-center gap-2 text-center">
      <Truck className="size-9 text-muted-foreground/40" />
      <div className="text-sm font-medium">{t('inventory.form.emptyOrders')}</div>
      <div className="max-w-xs text-xs text-muted-foreground">{t('inventory.form.emptyOrdersHint')}</div>
      <Button className="mt-2">
        <Plus className="size-4" />
        {t('inventory.form.createSupplierOrder')}
      </Button>
    </div>
  );
}

// ── Залишки ────────────────────────────────────────────────────
function StockTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>{t('inventory.col.warehouse')}</TableHead>
            <TableHead className="text-right">{t('inventory.col.stock')}</TableHead>
            <TableHead className="text-right">{t('inventory.form.minStock')}</TableHead>
            <TableHead className="text-right">{t('inventory.detail.price')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.map((w) => {
            const qty = w === product.warehouse ? product.stock : 0;
            return (
              <TableRow key={w}>
                <TableCell>{w}</TableCell>
                <TableCell className={cn('text-right tabular-nums', qty === 0 && 'text-muted-foreground')}>
                  {qty} {t('inventory.detail.pcs')}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">5</TableCell>
                <TableCell className="text-right tabular-nums">{uah.format(product.price)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Sheet ──────────────────────────────────────────────────────
export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle className="pr-6 text-lg">{product.name}</SheetTitle>
          <SheetDescription className="font-mono">{product.sku}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="general" className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="no-scrollbar overflow-x-auto border-b px-4">
            <TabsList variant="line" className="h-11 p-0">
              <TabsTrigger value="general">{t('inventory.tabs.general')}</TabsTrigger>
              <TabsTrigger value="batches">{t('inventory.tabs.batches')}</TabsTrigger>
              <TabsTrigger value="history">{t('inventory.tabs.history')}</TabsTrigger>
              <TabsTrigger value="orders">{t('inventory.tabs.supplierOrders')}</TabsTrigger>
              <TabsTrigger value="stock">{t('inventory.tabs.stock')}</TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <TabsContent value="general" className="mt-0">
              <GeneralTab key={product.id} product={product} />
            </TabsContent>
            <TabsContent value="batches" className="mt-0">
              <BatchesTab product={product} />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <HistoryTab product={product} />
            </TabsContent>
            <TabsContent value="orders" className="mt-0">
              <SupplierOrdersTab />
            </TabsContent>
            <TabsContent value="stock" className="mt-0">
              <StockTab product={product} />
            </TabsContent>
          </div>
        </Tabs>

        <SheetFooter className="flex-row items-center justify-between border-t">
          <Button onClick={() => toast.success(t('inventory.form.saved'), { description: product.name })}>
            {t('inventory.form.save')}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            aria-label={t('inventory.row.delete')}
            onClick={() => {
              toast(t('inventory.form.deleted'), { description: product.name });
              onOpenChange(false);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
