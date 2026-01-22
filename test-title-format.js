// Test the title formatting logic
const episodes = [
  {
    "episodeNum": 1,
    "artists": ["Shane Armstrong"],
    "genre": "Glitch Hop"
  },
  {
    "episodeNum": 2,
    "artists": ["Akula"],
    "genre": "Drum & Bass"
  },
  {
    "episodeNum": 3,
    "artists": ["Farid Ahwazi"],
    "genre": "Future Bass"
  },
  {
    "episodeNum": 4,
    "artists": ["Roly Poly"],
    "genre": "House"
  }
];

// Test title formatting for each episode
episodes.forEach(episode => {
  const artists = episode.artists.join(', ');
  const title = `Collective Radio Ep ${episode.episodeNum} - ${artists} - ${episode.genre}`;
  console.log(`Episode ${episode.episodeNum}: ${title}`);
});

// Test with multiple artists
const multiArtistEpisode = {
  "episodeNum": 5,
  "artists": ["Artist One", "Artist Two", "Artist Three"],
  "genre": "Electronic"
};

const multiArtists = multiArtistEpisode.artists.join(', ');
const multiTitle = `Collective Radio Ep ${multiArtistEpisode.episodeNum} - ${multiArtists} - ${multiArtistEpisode.genre}`;
console.log(`\nMulti-artist example: ${multiTitle}`);