import { useEffect, useState } from 'react';

import { logStorageService } from '../services/logStorageService';
import { useEntries, useLogStore } from '../store/useLogStore';

export const useLogs = () => {
  const entries = useEntries();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    logStorageService.load().then((loaded) => {
      if (!isMounted) return;
      useLogStore.setState({ entries: loaded });
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { entries, isLoading };
};
