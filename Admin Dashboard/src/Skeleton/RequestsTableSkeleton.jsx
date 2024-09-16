import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RequestsTableSkeleton = () => (
  <div style={{ padding: '1rem', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
    <Skeleton height={30} width={200} />
    <Skeleton count={5} height={40} style={{ marginTop: '0.5rem' }} />
  </div>
);

export default RequestsTableSkeleton;