import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = new URL('../', import.meta.url);
const read = async (path) => JSON.parse(await readFile(new URL(path, base), 'utf8'));
const [og, nb, sources, scan] = await Promise.all([
  read('src/data/curriculum/og.json'),
  read('src/data/curriculum/nb.json'),
  read('research/sources/educational-content-candidates.json'),
  read('research/standards-educational-scan-2026-10-22.json'),
]);

const original = [...og.standards, ...nb.standards].filter(x => x.id !== 'OG.1.1.18');
const expected = new Set(original.map(x => x.id));
const sourceIds = new Set(sources.sources.map(x => x.id));
assert.equal(original.length, 125);
assert.equal(scan.standards.length, expected.size);
assert.equal(sourceIds.size, sources.sources.length);
assert.equal(scan.summary.approvedForPublication, 0);
assert.equal(scan.summary.clipsWithTimestampVerified, 0);
assert.equal(scan.summary.sourceVideoClaimsAudited, 0);

for (const source of sources.sources) {
  assert.equal(source.reviewStatus, 'candidate_not_approved', source.id);
  const url = new URL(source.url);
  assert.equal(url.protocol, 'https:', source.id);
  assert.ok(source.sourceValidation);
  for (const id of source.standardIds) {
    assert.ok([...og.standards, ...nb.standards].some(x => x.id === id), source.id + ': invalid standard ' + id);
  }
}

for (const item of scan.standards) {
  assert.ok(expected.has(item.standardId), 'Unknown standard: ' + item.standardId);
  assert.equal(original.find(x => x.id === item.standardId)?.title, item.standardTitle);
  assert.ok(item.proposedInteraction?.plan?.length > 20, item.standardId + ': missing activity plan');
  assert.equal(item.sourceAssessment.includes('not verified'), true, item.standardId);
  const actual = sources.sources.filter(x => x.standardIds.includes(item.standardId)).map(x => x.id);
  assert.deepEqual(item.sourceLeadIds, actual, item.standardId + ': source inventory mismatch');
  assert.equal(item.researchStatus, actual.length ? 'potential_media_identified' : 'needs_external_media_research');
  for (const sourceId of item.sourceLeadIds) assert.ok(sourceIds.has(sourceId));
}

const potential = scan.standards.filter(x => x.sourceLeadIds.length > 0);
assert.equal(scan.summary.standardsWithMediaLeads, potential.length);
assert.equal(scan.summary.standardsWithoutMediaLeads, scan.standards.length - potential.length);
assert.equal(scan.summary.potentialSourceLinks, scan.standards.reduce((n,x) => n+x.sourceLeadIds.length,0));
assert.equal(scan.domains.length, 31);
for (const domain of scan.domains) {
  const subset = scan.standards.filter(x => x.domainId === domain.domainId);
  assert.equal(domain.standards, subset.length, domain.domainId);
  assert.equal(domain.withSourceLead, subset.filter(x => x.sourceLeadIds.length > 0).length, domain.domainId);
  assert.deepEqual(domain.gaps, subset.filter(x => !x.sourceLeadIds.length).map(x => x.standardId));
}
console.log(JSON.stringify({
  scanned: scan.standards.length,
  domains: scan.domains.length,
  publisherVideoLeads: sources.sources.filter(x => x.type === 'video').length,
  historicObjectLeads: sources.sources.filter(x => x.type === 'historical-object').length,
  standardsWithLeads: potential.length,
  standardsWithGaps: scan.standards.length - potential.length,
  approvedForPublication: scan.summary.approvedForPublication,
  note: 'Publisher descriptions and object metadata only; no claim of viewed/validated excerpts.',
}, null, 2));
