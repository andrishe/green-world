import { Models } from 'react-native-appwrite';

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type UseFetchDataFn = () => Promise<Models.Document[]>;

const useFetchData = (fn: UseFetchDataFn) => {
  const [data, setData] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const resp = await fn();
      setData(resp);
    } catch (error) {
      Alert.alert('Error', (error as any).message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => fetchData();
  return { data, isLoading, refresh };
};

export default useFetchData;
