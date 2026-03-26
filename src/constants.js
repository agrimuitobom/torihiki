export const TABS = [
  { id: 'ongoing', label: '進行中' },
  { id: 'dm', label: 'ＤＭ済' },
  { id: 'waiting', label: '待機' },
  { id: 'completed', label: '完了済' },
  { id: 'templates', label: '定型文' },
];

export const STATUS_OPTIONS = ['未発送', '発送済み', '受取完了'];

export const EMPTY_EXCHANGE = {
  accountName: '',
  twitterId: '',
  realName: '',
  myStatus: '未発送',
  partnerStatus: '未発送',
  receivingItem: '',
  givingItem: '',
  notes: '',
  category: 'ongoing',
};

export const EMPTY_TEMPLATE = { title: '', content: '' };
