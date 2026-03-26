import { useState, useEffect } from 'react';
import { subscribeExchanges, subscribeTemplates } from '../services/firestore';
import type { Exchange, Template } from '../types';

interface UseFirestoreReturn {
  exchanges: Exchange[];
  templates: Template[];
  loading: boolean;
}

export const useFirestore = (uid: string | undefined): UseFirestoreReturn => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setExchanges([]);
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let ready = 0;
    const check = () => {
      ready++;
      if (ready >= 2) setLoading(false);
    };

    const unsubExchanges = subscribeExchanges(uid, (items) => {
      setExchanges(items);
      check();
    });

    const unsubTemplates = subscribeTemplates(uid, (items) => {
      setTemplates(items);
      check();
    });

    return () => {
      unsubExchanges();
      unsubTemplates();
    };
  }, [uid]);

  return { exchanges, templates, loading };
};
