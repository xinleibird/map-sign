import React, { useCallback } from 'react';

const Rating = ({ num }: { num: number }) => {
  const getRating = useCallback((para) => {
    return '★★★★★☆☆☆☆☆'.slice(5 - para, 10 - para);
  }, []);

  return <span>{getRating(num)}</span>;
};

export default Rating;
