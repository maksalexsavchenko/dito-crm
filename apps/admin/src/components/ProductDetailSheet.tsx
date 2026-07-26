import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Image as ImageIcon, Barcode, Truck, Inbox } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { products, type Product, type StockStatus } from '../data/products';
import { useProducts } from '../stores/products';
import { CategoryTreeSelect } from './CategoryTreeSelect';

const uah = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 });
const categories = [...new Set(products.map((p) => p.category))];
const warehouses = [...new Set(products.map((p) => p.warehouse))];
const priceLists = [
  { name: 'Роздрібна', mult: 1 },
  { name: 'Безготівкова', mult: 1.02 },
  { name: 'Оптова', mult: 0.92 },
];
const barcodeTypes = [
  { value: 'code128', label: 'Code128' },
  { value: 'ean8', label: 'EAN-8' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'qrcode', label: 'QR-Code' },
  { value: 'upc', label: 'UPC-A' },
];

function generateBarcode(type: string) {
  const len = type === 'ean13' ? 13 : type === 'ean8' ? 8 : type === 'upc' ? 12 : 10;
  let code = '';
  for (let i = 0; i < len; i++) code += Math.floor(Math.random() * 10);
  return code;
}

interface Form {
  name: string;
  description: string;
  code: string;
  article: string;
  category: string;
}

function toForm(p: Product): Form {
  return { name: p.name, description: p.description, code: '', article: p.sku, category: p.category };
}

function blankProduct(): Product {
  return { id: '', sku: '', name: '', category: categories[0], warehouse: warehouses[0], stock: 0, price: 0, description: '', status: 'out' as StockStatus };
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
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
          className={cn('rounded-md px-3 py-1 text-sm transition-colors', i === active ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground')}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function SettingRow({ label, isNew, defaultChecked }: { label: string; isNew?: boolean; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2">
      <Checkbox defaultChecked={defaultChecked} />
      <span className="text-sm">{label}</span>
      {isNew && <Badge className="bg-success/15 text-success">NEW</Badge>}
    </label>
  );
}

interface Commission {
  rule: string;
  value: string;
}

function CommissionDialog({ onCreate }: { onCreate: (c: Commission) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [usePercent, setUsePercent] = useState(false);
  const [percentBasis, setPercentBasis] = useState('amount');
  const [percent, setPercent] = useState('');
  const [useAmount, setUseAmount] = useState(false);
  const [amount, setAmount] = useState('');

  function save() {
    if (!usePercent && !useAmount) return;
    const parts: string[] = [];
    if (usePercent) {
      const basis = percentBasis === 'profit' ? t('inventory.form.basisProfit') : t('inventory.form.basisAmount');
      parts.push(`${percent || 0}% (${basis})`);
    }
    if (useAmount) parts.push(`${amount || 0} грн`);
    onCreate({ rule: t('inventory.form.commissionRule'), value: parts.join(' + ') });
    setUsePercent(false);
    setPercent('');
    setPercentBasis('amount');
    setUseAmount(false);
    setAmount('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto px-0">
          <span className="underline decoration-dashed underline-offset-4">+ {t('inventory.form.addCommission')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('inventory.form.addCommissionTitle')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t('inventory.form.addCommissionHint')}</p>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <Checkbox checked={usePercent} onCheckedChange={(v) => setUsePercent(!!v)} />
              <span className="text-sm">{t('inventory.form.commissionPercent')}</span>
            </label>
            {usePercent && (
              <div className="mt-2 ml-6 flex items-center gap-2">
                <Select value={percentBasis} onValueChange={setPercentBasis}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">{t('inventory.form.basisAmount')}</SelectItem>
                    <SelectItem value="profit">{t('inventory.form.basisProfit')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="w-20" value={percent} onChange={(e) => setPercent(e.target.value)} inputMode="numeric" autoFocus />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2">
              <Checkbox checked={useAmount} onCheckedChange={(v) => setUseAmount(!!v)} />
              <span className="text-sm">{t('inventory.form.commissionAmount')}</span>
            </label>
            {useAmount && (
              <div className="mt-2 ml-6">
                <Input className="w-24" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save}>{t('inventory.form.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({ onCreate }: { onCreate: (name: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [parent, setParent] = useState(t('inventory.form.allProducts'));
  const [commissions, setCommissions] = useState<Commission[]>([]);

  function create() {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="shrink-0">
          <Plus className="size-4" />
          {t('inventory.form.addCategory')}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{t('inventory.form.newCategory')}</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          <Field label={t('inventory.form.categoryTitle')} required>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && create()} />
          </Field>

          <Field label={t('inventory.form.parentCategory')} required>
            <CategoryTreeSelect value={parent} onChange={setParent} rootLabel={t('inventory.form.allProducts')} />
          </Field>

          <Separator />

          <div>
            <div className="mb-2 text-sm font-semibold">{t('inventory.form.exceptionCommissions')}</div>
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>{t('inventory.form.calcRule')}</TableHead>
                    <TableHead>{t('inventory.form.commission')}</TableHead>
                  </TableRow>
                </TableHeader>
                {commissions.length > 0 && (
                  <TableBody>
                    {commissions.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.rule}</TableCell>
                        <TableCell>{c.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
              {commissions.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground">
                  <Inbox className="size-8 opacity-30" />
                  <p className="text-sm font-medium text-foreground">{t('inventory.form.noCommissions')}</p>
                  <p className="max-w-xs text-xs">{t('inventory.form.noCommissionsHint')}</p>
                </div>
              )}
              <div className="flex justify-center border-t py-2">
                <CommissionDialog onCreate={(c) => setCommissions((cs) => [...cs, c])} />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button onClick={create}>{t('inventory.form.create')}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function BarcodeDialog({ onCreate }: { onCreate: (code: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('ean13');
  const [code, setCode] = useState('');

  function create() {
    if (!code.trim()) return;
    onCreate(code.trim());
    setCode('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className="h-auto px-0">
          <span className="underline decoration-dashed underline-offset-4">+ {t('inventory.form.addBarcode')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('inventory.form.barcodes')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label={t('inventory.form.barcodeType')}>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {barcodeTypes.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t('inventory.form.barcodeCode')} required>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} className="font-mono" onKeyDown={(e) => e.key === 'Enter' && create()} />
              <Button type="button" variant="outline" className="shrink-0" onClick={() => setCode(generateBarcode(type))}>
                {t('inventory.form.generate')}
              </Button>
            </div>
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={create}>{t('inventory.form.create')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface StockRule {
  warehouse: string;
  min: string;
  max: string;
}

function RuleDialog({ onCreate }: { onCreate: (rule: StockRule) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [warehouse, setWarehouse] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  function create() {
    if (!warehouse || !min || !max) return;
    onCreate({ warehouse, min, max });
    setWarehouse('');
    setMin('');
    setMax('');
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" size="sm">
          <Plus className="size-4" />
          {t('inventory.form.rule')}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{t('inventory.form.newRule')}</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          <Field label={t('inventory.col.warehouse')} required>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger className="w-full"><SelectValue placeholder={t('inventory.form.notSpecified')} /></SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={t('inventory.form.minStock')} required>
            <Input value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
          </Field>
          <Field label={t('inventory.form.maxStock')} required>
            <Input value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" />
          </Field>
        </div>

        <SheetFooter className="border-t">
          <Button onClick={create}>{t('inventory.form.create')}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Загальні ───────────────────────────────────────────────────
function GeneralTab({ form, setForm, price }: { form: Form; setForm: (f: Form) => void; price: number }) {
  const { t } = useTranslation();
  const set = (patch: Partial<Form>) => setForm({ ...form, ...patch });
  const primaryBarcode = '21000' + (form.article || '00000').replace(/[^0-9]/g, '0').slice(0, 7).padEnd(7, '0');
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [extraBarcodes, setExtraBarcodes] = useState<string[]>([]);
  const [stockRules, setStockRules] = useState<StockRule[]>([]);
  const allCategories = [...categories, ...extraCategories];
  const allBarcodes = [primaryBarcode, ...extraBarcodes];

  return (
    <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
      <div className="space-y-3">
        <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted/40">
          <ImageIcon className="size-9 text-muted-foreground/40" />
        </div>
        <button type="button" className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-2 py-3 text-center text-muted-foreground transition-colors hover:bg-muted">
          <Plus className="size-5" />
          <span className="text-[11px] leading-tight">{t('inventory.form.imageHint')}</span>
          <span className="text-[10px] text-muted-foreground/70">{t('inventory.form.imageFormats')}</span>
        </button>
      </div>

      <div className="space-y-4">
        <Field label={t('inventory.form.type')}>
          <Select defaultValue="default">
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('inventory.form.typeDefault')}</SelectItem>
              <SelectItem value="service">{t('inventory.form.typeService')}</SelectItem>
              <SelectItem value="bundle">{t('inventory.form.typeBundle')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={t('inventory.form.category')} required>
          <div className="flex gap-2">
            <Select value={form.category} onValueChange={(v) => set({ category: v })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {allCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {t('inventory.form.allProducts')} › {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CategoryDialog
              onCreate={(name) => {
                setExtraCategories((cs) => [...cs, name]);
                set({ category: name });
                toast.success(t('inventory.form.categoryCreated'), { description: name });
              }}
            />
          </div>
        </Field>

        <Field label={t('inventory.form.name')} required>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Назва товару" />
        </Field>

        <Field label={t('inventory.form.description')}>
          <Textarea rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>

        <Field label={t('inventory.form.unit')} required>
          <Select defaultValue="pcs">
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pcs">{t('inventory.form.unitPcs')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label={t('inventory.form.code')}>
          <Input value={form.code} onChange={(e) => set({ code: e.target.value })} />
        </Field>

        <Field label={t('inventory.form.article')}>
          <Input value={form.article} onChange={(e) => set({ article: e.target.value })} />
        </Field>

        <Separator />

        <div className="space-y-3">
          <div className="text-sm font-semibold">{t('inventory.form.settings')}</div>
          <div>
            <div className="mb-1 text-sm text-muted-foreground">{t('inventory.form.barcodes')}</div>
            <div className="flex flex-wrap items-center gap-2">
              {allBarcodes.map((b) => (
                <Badge key={b} variant="secondary" className="gap-1 font-mono">
                  <Barcode className="size-3.5" />
                  {b}
                </Badge>
              ))}
              <BarcodeDialog onCreate={(code) => setExtraBarcodes((bs) => [...bs, code])} />
            </div>
          </div>
          <div className="space-y-2">
            <SettingRow label={t('inventory.form.setDims')} isNew />
            <SettingRow label={t('inventory.form.warranty')} />
            <SettingRow label={t('inventory.form.expiry')} />
            <SettingRow label={t('inventory.form.serial')} defaultChecked />
            <SettingRow label={t('inventory.form.defaultSupplier')} isNew />
          </div>
        </div>

        <Separator />

        <div>
          <div className="text-sm font-semibold">{t('inventory.form.prices')}</div>
          <p className="mb-2 text-xs text-muted-foreground">{t('inventory.form.pricesHint')}</p>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>{t('inventory.form.priceName')}</TableHead>
                  <TableHead className="text-right">{t('inventory.form.priceValue')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceLists.map((pl) => (
                  <TableRow key={pl.name}>
                    <TableCell>{pl.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{Math.round(price * pl.mult)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">{t('inventory.form.stockControl')}</div>
            <RuleDialog onCreate={(rule) => setStockRules((rs) => [...rs, rule])} />
          </div>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>{t('inventory.col.warehouse')}</TableHead>
                  <TableHead className="text-right">{t('inventory.form.minStock')}</TableHead>
                  <TableHead className="text-right">{t('inventory.form.maxStock')}</TableHead>
                </TableRow>
              </TableHeader>
              {stockRules.length > 0 && (
                <TableBody>
                  {stockRules.map((r, i) => (
                    <TableRow key={`${r.warehouse}-${i}`}>
                      <TableCell>{r.warehouse}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.min}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.max}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            {stockRules.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground">
                <Inbox className="size-8 opacity-30" />
                <p className="text-sm font-medium text-foreground">{t('inventory.form.noStockRules')}</p>
                <p className="max-w-xs text-xs">{t('inventory.form.noStockRulesHint')}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">{t('inventory.form.commissions')}</div>
          <p className="mb-2 text-xs text-muted-foreground">{t('inventory.form.commissionsHint')}</p>
          <div className="flex flex-wrap gap-4">
            <SettingRow label={t('inventory.form.commissionPercent')} />
            <SettingRow label={t('inventory.form.commissionAmount')} />
          </div>
        </div>
      </div>
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
            <TableHead className="text-right">{t('inventory.detail.amount')}</TableHead>
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
                <TableCell className="text-right tabular-nums">{uah.format(qty * product.price)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function BatchesTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  const cost = Math.round(product.price * 0.8);
  const half = Math.max(1, Math.round(product.stock / 2));
  const batches = [
    { doc: 'Оприбуткування #119', by: 'Христина Р.', date: '11.05.2026', supplier: "ТОВ «Дистриб'ютор»", price: cost, qty: half },
    { doc: 'Оприбуткування #98', by: 'Аліна Г.', date: '02.03.2026', supplier: 'ТОВ «Імпорт Плюс»', price: Math.round(cost * 0.95), qty: product.stock - half },
  ].filter((b) => b.qty > 0);
  return (
    <div className="space-y-3">
      <Segmented options={[t('inventory.batches.all'), t('inventory.batches.inStock'), t('inventory.batches.outStock')]} />
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>{t('inventory.batches.document')}</TableHead>
              <TableHead>{t('inventory.batches.created')}</TableHead>
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
                <TableCell>
                  <div>{b.by}</div>
                  <div className="text-xs text-muted-foreground">{b.date}</div>
                </TableCell>
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

function HistoryTab({ product }: { product: Product }) {
  const { t } = useTranslation();
  const movements = [
    { doc: 'Продаж #1930', by: 'Аліна Г.', desc: `Зі складу: ${product.warehouse}`, in: 0, out: 1, date: '19.06.2026' },
    { doc: 'Переміщення #44', by: 'Христина Р.', desc: 'Київ → Львів', in: 0, out: 3, date: '02.05.2026' },
    { doc: 'Оприбуткування #119', by: 'Христина Р.', desc: `На склад: ${product.warehouse}`, in: 10, out: 0, date: '11.05.2026' },
  ];
  return (
    <div className="space-y-3">
      <Segmented options={[t('inventory.history.all'), t('inventory.history.in'), t('inventory.history.out')]} />
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>{t('inventory.history.document')}</TableHead>
              <TableHead>{t('inventory.history.created')}</TableHead>
              <TableHead>{t('inventory.history.desc')}</TableHead>
              <TableHead className="text-right">{t('inventory.history.in')}</TableHead>
              <TableHead className="text-right">{t('inventory.history.out')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.doc}>
                <TableCell className="font-medium">{m.doc}</TableCell>
                <TableCell>
                  <div>{m.by}</div>
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

// ── Sheet ──────────────────────────────────────────────────────
export function ProductDetailSheet({
  product,
  mode = 'edit',
  open,
  onOpenChange,
}: {
  product: Product | null;
  mode?: 'edit' | 'create';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { addProduct, updateProduct, removeProduct } = useProducts();
  const isCreate = mode === 'create';
  const [form, setForm] = useState<Form>(() => toForm(product ?? blankProduct()));

  useEffect(() => {
    setForm(toForm(isCreate ? blankProduct() : (product ?? blankProduct())));
  }, [product?.id, isCreate, open]);

  if (!isCreate && !product) return null;
  const base = product ?? blankProduct();

  function save() {
    const patch = { name: form.name.trim(), description: form.description, sku: form.article.trim(), category: form.category };
    if (!patch.name) {
      toast.error('Вкажіть найменування');
      return;
    }
    if (isCreate) {
      addProduct({ ...blankProduct(), ...patch });
      toast.success('Товар створено', { description: patch.name });
    } else {
      updateProduct(base.id, patch);
      toast.success(t('inventory.form.saved'), { description: patch.name });
    }
    onOpenChange(false);
  }

  function del() {
    removeProduct(base.id);
    toast(t('inventory.form.deleted'), { description: base.name });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle className="pr-6 text-lg">{form.name || (isCreate ? 'Новий товар' : base.name)}</SheetTitle>
          <SheetDescription className="font-mono">{form.article || '—'}</SheetDescription>
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
              <GeneralTab key={base.id || 'new'} form={form} setForm={setForm} price={base.price} />
            </TabsContent>
            <TabsContent value="batches" className="mt-0">
              <BatchesTab product={base} />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <HistoryTab product={base} />
            </TabsContent>
            <TabsContent value="orders" className="mt-0">
              <SupplierOrdersTab />
            </TabsContent>
            <TabsContent value="stock" className="mt-0">
              <StockTab product={base} />
            </TabsContent>
          </div>
        </Tabs>

        <SheetFooter className="flex-row items-center justify-between border-t">
          <Button onClick={save}>{isCreate ? 'Створити' : t('inventory.form.save')}</Button>
          {!isCreate && (
            <Button variant="destructive" size="icon" aria-label={t('inventory.row.delete')} onClick={del}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
