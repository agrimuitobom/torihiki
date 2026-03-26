export type Category = 'ongoing' | 'dm' | 'waiting' | 'completed';
export type TabId = Category | 'templates';
export type Status = '未発送' | '発送済み' | '受取完了';

export interface Exchange {
  id: string | number;
  accountName: string;
  twitterId: string;
  realName: string;
  myStatus: Status;
  partnerStatus: Status;
  receivingItem: string;
  givingItem: string;
  notes: string;
  category: Category;
  sortOrder?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Template {
  id: string | number;
  title: string;
  content: string;
  sortOrder?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Tab {
  id: TabId;
  label: string;
}

export type ExchangeFormData = Omit<Exchange, 'id' | 'sortOrder' | 'createdAt' | 'updatedAt'>;
export type TemplateFormData = Omit<Template, 'id' | 'sortOrder' | 'createdAt' | 'updatedAt'>;

export interface Stats {
  ongoing: number;
  dm: number;
  waiting: number;
  completed: number;
}
