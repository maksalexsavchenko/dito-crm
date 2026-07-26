import { useEffect, useState, type ReactNode } from 'react';
import { Trash2, Inbox, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Button,
  Separator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  toast,
} from '@dito/ui';
import {
  postingCells,
  postingSuppliers,
  postingTotal,
  type Posting,
  type PostingItem,
} from '../data/postings';
import { products } from '../data/products';
import { usePostings } from '../stores/postings';

const warehouses = [...new Set(products.map((p) => p.warehouse))];
const uah = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

function blankPosting(): Posting {
  return {
    id: '',
    num: '',
    createdBy: 'Ви',
    createdAt: new Date().toISOString(),
    invoice: 'Б/Н',
    invoiceDate: new Date().toISOString().slice(0, 10),
    supplier: '',
    warehouse: '',
    comment: '',
    items: [],
    isDraft: false,
    payFromAccount: false,
  };
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

export function PostingDetailSheet({
  posting,
  mode = 'edit',
  open,
  onOpenChange,
}: {
  posting: Posting | null;
  mode?: 'edit' | 'create';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addPosting, updatePosting, removePosting } = usePostings();
  const isCreate = mode === 'create';
  const [form, setForm] = useState<Posting>(() => posting ?? blankPosting());

  useEffect(() => {
    setForm(isCreate ? blankPosting() : (posting ?? blankPosting()));
  }, [posting?.id, isCreate, open]);

  if (!isCreate && !posting) return null;

  const set = (patch: Partial<Posting>) => setForm((f) => ({ ...f, ...patch }));

  function addItem(name: string) {
    const p = products.find((x) => x.name === name);
    if (!p) return;
    const item: PostingItem = {
      name: p.name,
      cell: postingCells[0],
      price: Math.round(p.price * 0.8), // закупівельна ціна ≈ 80% від роздрібної
      qty: 1,
    };
    set({ items: [...form.items, item] });
  }

  function patchItem(i: number, patch: Partial<PostingItem>) {
    set({ items: form.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  }

  function removeItem(i: number) {
    set({ items: form.items.filter((_, idx) => idx !== i) });
  }

  function save(asDraft = false) {
    if (!form.supplier) {
      toast.error('Вкажіть постачальника');
      return;
    }
    if (!form.warehouse) {
      toast.error('Вкажіть склад');
      return;
    }
    if (!asDraft && form.items.length === 0) {
      toast.error('Додайте хоча б один товар');
      return;
    }

    const patch = { ...form, isDraft: asDraft };
    if (isCreate) {
      const { id: _id, num: _num, ...rest } = patch;
      addPosting(rest);
      toast.success(asDraft ? 'Чернетку збережено' : 'Оприбуткування створено', {
        description: `${patch.supplier} · ${uah.format(postingTotal(patch))} грн`,
      });
    } else {
      updatePosting(form.id, patch);
      toast.success('Зміни збережено', { description: form.num });
    }
    onOpenChange(false);
  }

  function del() {
    removePosting(form.id);
    toast('Оприбуткування видалено', { description: form.num });
    onOpenChange(false);
  }

  const total = postingTotal(form);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle className="pr-6 text-lg">
            {isCreate ? 'Нове оприбуткування' : `Оприбуткування ${form.num}`}
          </SheetTitle>
          <SheetDescription>
            {form.supplier || 'Постачальника не вказано'}
            {!isCreate && ` · ${form.createdBy}`}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          <Field label="Постачальник" required>
            <Select value={form.supplier} onValueChange={(v) => set({ supplier: v })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Оберіть постачальника" /></SelectTrigger>
              <SelectContent>
                {postingSuppliers.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <Field label="Накладна">
              <Input value={form.invoice} onChange={(e) => set({ invoice: e.target.value })} />
            </Field>
            <Field label="від">
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => set({ invoiceDate: e.target.value })}
                className="w-44"
              />
            </Field>
          </div>

          <Field label="Склад" required>
            <Select value={form.warehouse} onValueChange={(v) => set({ warehouse: v })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Не вказано" /></SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Separator />

          <div>
            <div className="mb-2 text-sm font-semibold">Список товарів</div>
            <Field label="Найменування" required>
              {/* key змушує селект скинутись після додавання позиції */}
              <Select key={form.items.length} onValueChange={addItem}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Введіть назву, штрихкод, код або артикул товару" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="mt-3 overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Найменування</TableHead>
                    <TableHead>Комірка</TableHead>
                    <TableHead className="text-right">Ціна, грн</TableHead>
                    <TableHead className="text-right">К-сть</TableHead>
                    <TableHead className="text-right">Сума, грн</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                {form.items.length > 0 && (
                  <TableBody>
                    {form.items.map((it, i) => (
                      <TableRow key={`${it.name}-${i}`}>
                        <TableCell className="font-medium">{it.name}</TableCell>
                        <TableCell>
                          <Select value={it.cell} onValueChange={(v) => patchItem(i, { cell: v })}>
                            <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {postingCells.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            className="h-8 w-24 text-right tabular-nums"
                            inputMode="numeric"
                            value={String(it.price)}
                            onChange={(e) => patchItem(i, { price: Number(e.target.value) || 0 })}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            className="h-8 w-16 text-right tabular-nums"
                            inputMode="numeric"
                            value={String(it.qty)}
                            onChange={(e) => patchItem(i, { qty: Number(e.target.value) || 0 })}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {uah.format(it.price * it.qty)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Прибрати позицію"
                            onClick={() => removeItem(i)}
                          >
                            <X className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
              {form.items.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground">
                  <Inbox className="size-8 opacity-30" />
                  <p className="text-sm font-medium text-foreground">Тут поки нічого немає</p>
                  <p className="max-w-xs text-xs">Додайте товари, які увійдуть до цього оприбуткування.</p>
                </div>
              )}
            </div>

            {form.items.length > 0 && (
              <div className="mt-3 flex justify-end">
                <div className="w-56 space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Всього позицій</span>
                    <span className="tabular-nums">{form.items.length}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Разом</span>
                    <span className="tabular-nums">{uah.format(total)} грн</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <Field label="Коментар">
            <Textarea rows={3} value={form.comment} onChange={(e) => set({ comment: e.target.value })} />
          </Field>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.payFromAccount}
              onCheckedChange={(v) => set({ payFromAccount: !!v })}
            />
            <span className="text-sm">Оплатити з рахунку</span>
          </label>
        </div>

        <SheetFooter className="flex-row items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <Button onClick={() => save(false)}>{isCreate ? 'Створити' : 'Зберегти'}</Button>
            {isCreate && (
              <Button variant="outline" onClick={() => save(true)}>
                Зберегти як чернетку
              </Button>
            )}
          </div>
          {!isCreate && (
            <Button variant="destructive" size="icon" aria-label="Видалити" onClick={del}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
