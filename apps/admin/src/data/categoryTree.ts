// Illustrative category tree (as in RoApp) for the parent-category picker.

export interface CategoryNode {
  name: string;
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    name: 'Смартфони',
    children: [
      { name: 'iPhone' },
      { name: 'Samsung Galaxy' },
      { name: 'Xiaomi' },
    ],
  },
  { name: 'Ноутбуки' },
  {
    name: 'Навушники',
    children: [
      { name: 'AirPods' },
      { name: 'Sony' },
      { name: 'JBL' },
    ],
  },
  { name: 'Планшети' },
  { name: 'Аксесуари' },
  { name: 'Зарядки' },
];
