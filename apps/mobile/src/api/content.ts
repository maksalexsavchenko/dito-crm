import type { AppNotification, LegalDoc, Location, NewsPost } from '@/domain/types';
import { legalDocs } from '@/data/legal';
import { locations } from '@/data/locations';
import { news } from '@/data/news';
import { delay, fail } from './client';
import { persist, ready } from './mockDb';

export async function getLocations(): Promise<Location[]> {
  return delay(locations);
}

export async function getLocation(id: string): Promise<Location> {
  const found = locations.find((l) => l.id === id);
  if (!found) return fail('Заклад не знайдено.', 'not_found');
  return delay(found, 120);
}

export async function getNews(): Promise<NewsPost[]> {
  return delay([...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)));
}

export async function getNewsPost(id: string): Promise<NewsPost> {
  const found = news.find((n) => n.id === id);
  if (!found) return fail('Новину не знайдено.', 'not_found');
  return delay(found, 120);
}

export async function getNotifications(token: string): Promise<AppNotification[]> {
  const db = await ready();
  const memberId = db.sessions[token];
  if (!memberId) return fail('Сесія завершилась. Увійдіть знову.', 'unauthorized', 0);
  return delay(db.notifications[memberId] ?? []);
}

export async function markNotificationsRead(token: string): Promise<AppNotification[]> {
  const db = await ready();
  const memberId = db.sessions[token];
  if (!memberId) return fail('Сесія завершилась. Увійдіть знову.', 'unauthorized', 0);
  const updated = (db.notifications[memberId] ?? []).map((n) => ({ ...n, read: true }));
  db.notifications[memberId] = updated;
  await persist();
  return delay(updated, 0);
}

export function getLegalDoc(slug: LegalDoc['slug']): Promise<LegalDoc> {
  return delay(legalDocs[slug], 80);
}
