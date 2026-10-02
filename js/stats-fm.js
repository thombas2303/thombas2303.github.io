const STATSFM_USER = 'ta1647';
const MAX_TRACKS = 25;
const TOP_ARTISTS_LIMIT = 10;

let recentItems = [];

function renderSongs(items) {
    const list = document.getElementById('song-list');
    if (!list) return;
    list.innerHTML = '';

    if (!items || items.length === 0) {
        list.innerHTML = '<li class="song-status">No recent tracks found.</li>';
        return;
    }

    items.slice(0, MAX_TRACKS).forEach(item => {
        const track = item.track || item.stream?.track || item;

        if (!track || !track.name) return;

        const artistNames = track.artists && track.artists.length > 0
            ? track.artists.map(a => a.name).join(', ')
            : (track.artist?.name || 'Unknown Artist');

        const albumImage = track.albums?.[0]?.image || track.album?.image || track.image || track.albums?.[0]?.coverUrl;

        const appleMusicId = track.externalIds?.appleMusic?.[0] 
            || track.appleMusicId 
            || track.externalIds?.appleMusic;

        const trackUrl = appleMusicId
            ? `https://music.apple.com/us/song/${appleMusicId}`
            : `https://music.apple.com/us/search?term=${encodeURIComponent(`${track.name}${artistNames}`)}`;

        const li = document.createElement('li');
        li.className = 'song-card';

        const inner = document.createElement('a');
        inner.href = trackUrl;
        inner.target = '_blank';
        inner.rel = 'noopener noreferrer';
        inner.className = 'song-card-inner';

        inner.innerHTML = `
            ${albumImage ? `<img class="song-art" src="${albumImage}" alt="${track.name}">` : ''}
            <div class="song-info">
                <span class="song-title">${track.name}</span>
                <span class="song-artist">${artistNames}</span>
            </div>
        `;

        li.appendChild(inner);
        list.appendChild(li);
    });
}

function renderError(err) {
    console.error('stats.fm error:', err);
    const list = document.getElementById('song-list');
    if (list) {
        list.innerHTML = '<li class="song-status">Couldn\'t load recent tracks -- check stats.fm directly!</li>';
    }
}

function fitSongs() {
    renderSongs(recentItems);
}

function renderArtists(items) {
    const row = document.getElementById('artist-row');
    if (!row) return;
    row.innerHTML = '';

    if (!items || items.length === 0) {
        row.innerHTML = '<span class="song-status">No top artists found.</span>';
        return;
    }

    items.slice(0, TOP_ARTISTS_LIMIT).forEach((item, index) => {
        const artist = item.artist?.artist || item.artist || item;
        if (!artist || !artist.name) return;

        const artistImage = artist.image 
            || artist.avatar 
            || (artist.images && artist.images.length > 0 ? (artist.images[0].url || artist.images[0]) : null);

        const appleMusicId = artist.externalIds?.appleMusic?.[0] || artist.externalIds?.appleMusic;
        
        const artistUrl = appleMusicId
            ? `https://music.apple.com/us/artist/${appleMusicId}`
            : `https://music.apple.com/us/search?term=${encodeURIComponent(artist.name)}`;

        const inner = document.createElement('a');
        inner.href = artistUrl;
        inner.target = '_blank';
        inner.rel = 'noopener noreferrer';
        inner.className = 'artist-card';

        inner.innerHTML = `
            ${artistImage ? `<img class="artist-art" src="${artistImage}" alt="${artist.name}">` : ''}
            <span class="artist-name">${index + 1}: ${artist.name}</span>
        `;

        row.appendChild(inner);
    });
}

function renderArtistError(err) {
    console.error('stats.fm artist error:', err);
    const row = document.getElementById('artist-row');
    if (row) {
        row.innerHTML = '<span class="song-status">Couldn\'t load top artists.</span>';
    }
}

// Fetch recent streams
fetch(`https://api.stats.fm/api/v1/users/${STATSFM_USER}/streams/recent`)
    .then(res => {
        if (!res.ok) throw new Error(`stats.fm responded HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        recentItems = data.items || data.data || [];
        renderSongs(recentItems);
    })
    .catch(renderError);

// Fetch top artists with explicit range parameter ('lifetime', 'weeks', or 'months')
fetch(`https://api.stats.fm/api/v1/users/${STATSFM_USER}/top/artists?range=lifetime`)
    .then(res => {
        if (!res.ok) throw new Error(`stats.fm responded HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        const items = data.items || data.data || [];
        renderArtists(items);
    })
    .catch(renderArtistError);

window.addEventListener('resize', fitSongs);