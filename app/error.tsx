'use client';
export default function Error({ error }: { error: Error }) {
  return (
    <div style={{textAlign: 'center', marginTop: 40, color: 'red'}}>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
