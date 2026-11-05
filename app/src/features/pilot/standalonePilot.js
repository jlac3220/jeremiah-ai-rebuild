export const OG1_PILOT_HOST='pilot.jeremiah.app';
export function isStandalonePilot(hostname=window.location.hostname){return hostname.toLowerCase().replace(/\.$/,'')===OG1_PILOT_HOST||import.meta.env?.VITE_OG1_EVALUATION==='true';}
export const PILOT_ROUTES=new Set(['pilot','lesson','pilot-feedback']);
export function pilotRoute(hash){const route=hash.replace(/^#/,'');return PILOT_ROUTES.has(route)?route:'pilot';}
