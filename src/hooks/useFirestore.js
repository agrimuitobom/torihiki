import { useState, useEffect } from 'react';
import { subscribeExchanges, subscribeTemplates } from '../services/firestore';

export const useFirestore = (uid) => {
  const [exchanges, setExchanges] = useState([]);
  const [templates, setTemplates] = useState([]);
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
