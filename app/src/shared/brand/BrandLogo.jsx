import { useState } from 'react';

// Decorative artwork: the adjacent wordmark/control label supplies its name.
export function BrandFlame() {
  const [failed, setFailed] = useState(false);
  return <span className="brand-flame" aria-hidden="true">{failed
    ? <span className="brand-flame-fallback">J</span>
    : <img src="/brand/jeremiah-flame.png" alt="" width="32" height="32" onError={() => setFailed(true)} />}</span>;
}

export default function BrandLogo() {
  return <span className="brand-logo"><BrandFlame /><span className="brand-wordmark">Jeremiah</span></span>;
}
