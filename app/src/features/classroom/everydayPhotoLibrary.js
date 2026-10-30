// Editorially reviewed, screen-free photography for Jeremiah's everyday scenes.
// Scenes are appropriate to Christian teaching: worship, family, friendship,
// service, honesty, and ordinary life. They depict diverse communities, ages,
// and settings without attributing personal beliefs to photographed people.
// No protest, partisan, sexualized, violent, or controversy-centered material.
// Images are licensed as "Free to use" on their credited Pexels source pages.
// Each selection rotates per lesson visit but stays stable during interaction.
// Keep photo groups nonoverlapping so adjacent lesson moments do not repeat.
const photo = (id, alt, photographer, focal = 'center') => ({
 src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
 alt,
 credit: `${photographer} · Pexels`,
 source: `https://www.pexels.com/photo/${id}/`,
 focal,
});

export const EVERYDAY_PHOTO_LIBRARY = Object.freeze({
 worship: Object.freeze([
  photo(34692411, 'Three adults praying together inside a warmly lit church', 'Caleb Oquendo', '50% 43%'),
  photo(35555152, 'Congregation with raised hands during a Christian worship gathering', 'Caleb Oquendo', '50% 42%'),
  photo(16102709, 'People holding hands together during a prayer gathering', 'Luis Quintero', '52% 47%'),
  photo(8815020, 'Adults gathered for joyful prayer and worship', 'Pavel Danilyuk', '50% 40%'),
 ]),
 conduct: Object.freeze([
  photo(6305718, 'Family sharing a meal around the table at home', 'Kampus Production', '50% 48%'),
  photo(8507626, 'Several generations preparing a meal together in a kitchen', 'Kampus Production', '50% 44%'),
  photo(1128316, 'Family sitting together outdoors on green grass', 'Agung Pandit Wiguna', '50% 44%'),
  photo(36827888, 'Young woman and older woman enjoying a conversation indoors', 'Bianca Correia', '50% 38%'),
 ]),
 outreach: Object.freeze([
  photo(6590928, 'Volunteers filling food donation boxes together', 'cottonbro studio', '50% 49%'),
  photo(7156163, 'Volunteers packing clothing and food donations in a community space', 'Gustavo Fring', '50% 43%'),
  photo(6140369, 'Friends from different backgrounds walking together in a park', 'William Fortunato', '50% 42%'),
  photo(35811628, 'Friends walking and laughing together along an ordinary city street', 'Derrick Pare', '50% 44%'),
 ]),
 opening: Object.freeze([
  photo(8121793, 'Friends walking and talking together outdoors in a park', 'MART PRODUCTION', '50% 43%'),
  photo(6838536, 'Older friends gathered outdoors for tea and conversation', 'Kampus Production', '50% 46%'),
  photo(7469438, 'Family preparing food together in a home kitchen', 'Meruyert Gonullu', '50% 43%'),
  photo(6305724, 'Family of different generations gathered around a table', 'Kampus Production', '50% 50%'),
 ]),
});

export const EVERYDAY_PHOTO_CATEGORIES = Object.freeze(['worship', 'conduct', 'outreach']);

// A repeatable selection for one lesson visit. The offset is advanced only
// after an image error; selection never shuffles with React re-renders.
export function chooseEverydayPhoto(category, seed = 0, failedOffset = 0) {
 const pool = EVERYDAY_PHOTO_LIBRARY[category] || EVERYDAY_PHOTO_LIBRARY.opening;
 const offset = Math.floor(Number(seed) || 0) + Math.floor(Number(failedOffset) || 0);
 return pool[((offset % pool.length) + pool.length) % pool.length];
}
