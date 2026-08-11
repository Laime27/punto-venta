import { useState } from 'react';

export const useDashboardHook = () => {
  const [data, setData] = useState(null);
  return { data, setData };
};
