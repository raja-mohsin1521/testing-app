import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StaticsCardSkeleton = () => (
  <div style={{ padding: '1rem', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
    <Skeleton height={30} width={150} />
    <Skeleton height={100} style={{ marginTop: '0.5rem' }} />
  </div>
);

export default StaticsCardSkeleton;