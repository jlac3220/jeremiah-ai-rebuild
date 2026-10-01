import sources from './media.json' with { type: 'json' };
const byId = Object.fromEntries(sources.map((source) => [source.id, source]));
const domains = {
  OG: ['shema-listen','holiness','covenants','temple','shema-listen','messiah','messiah','messiah','holy-spirit','messiah','holy-spirit','gospel-acts-1','acts-1-12','acts-1-12','gospel-kingdom'],
  NB: ['khata-sin','covenants','gospel-kingdom','khata-sin','acts-1-12','holy-spirit','gospel-acts-1','acts-1-12','covenants','acts-1-12','holiness','gospel-acts-1','temple','holiness','acts-1-12','gospel-kingdom'],
};
export function getLessonMedia(content) {
  const primary = domains[content.studyId]?.[content.sourceStandard?.domain - 1];
  const secondary = content.studyId === 'NB' && [4,5,9,10,11].includes(content.sourceStandard?.domain) ? 'gospel-acts-1' : null;
  return [...new Set([primary,secondary].filter(Boolean))].map((id) => byId[id]).filter(Boolean);
}
