import {
  Button,
  Badge,
  Input,
  Textarea,
  Label,
  Switch,
  Checkbox,
  Separator,
  Skeleton,
  Avatar,
  AvatarFallback,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  toast,
} from '@dito/ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">{children}</CardContent>
    </Card>
  );
}

export function UiKit() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">UI Kit</h1>
          <p className="text-sm text-muted-foreground">
            shadcn/ui · Radix · Tailwind v4 — спільний пакет @dito/ui
          </p>
        </div>

        <Section title="Buttons">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="Badges">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Section>

        <Section title="Form">
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@dito.com.ua" />
          </div>
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="note">Нотатка</Label>
            <Textarea id="note" placeholder="Текст…" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="c1" defaultChecked />
            <Label htmlFor="c1">Активний</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="s1" defaultChecked />
            <Label htmlFor="s1">Сповіщення</Label>
          </div>
          <Select>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Склад" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kyiv">Київ</SelectItem>
              <SelectItem value="lviv">Львів</SelectItem>
              <SelectItem value="dnipro">Дніпро</SelectItem>
            </SelectContent>
          </Select>
        </Section>

        <Section title="Overlays">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Нове замовлення</DialogTitle>
                <DialogDescription>Заповніть дані та збережіть.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="amount">Сума</Label>
                <Input id="amount" placeholder="₴ 0.00" />
              </div>
              <DialogFooter>
                <Button>Зберегти</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Sheet (drawer)</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Фільтри</SheetTitle>
                <SheetDescription>Налаштуйте відображення таблиці.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent>Швидке меню дій.</PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Дії</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Редагувати</DropdownMenuItem>
              <DropdownMenuItem>Дублювати</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Видалити</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>Підказка</TooltipContent>
          </Tooltip>

          <Button onClick={() => toast.success('Збережено', { description: 'Замовлення створено.' })}>
            Toast
          </Button>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Огляд</TabsTrigger>
              <TabsTrigger value="items">Позиції</TabsTrigger>
              <TabsTrigger value="history">Історія</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
              Загальна інформація про замовлення.
            </TabsContent>
            <TabsContent value="items" className="pt-3 text-sm text-muted-foreground">
              Список товарів.
            </TabsContent>
            <TabsContent value="history" className="pt-3 text-sm text-muted-foreground">
              Журнал змін.
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Data / Misc">
          <Avatar>
            <AvatarFallback>ДС</AvatarFallback>
          </Avatar>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </Section>
      </div>
    </TooltipProvider>
  );
}
