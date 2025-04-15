document.addEventListener('DOMContentLoaded', () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const genreSelect = document.getElementById('genreselect');
    const songListItems = document.querySelectorAll('#song-list li');
    const searchBar = document.getElementById('search-bar');
    const createPlaylistButton = document.getElementById('createplaylist-button');
    const playlistContainer = document.querySelector('.playlist');
    const playlistList = document.getElementById('playlist-list');
    document.querySelector('.controls button:nth-child(3)').addEventListener('click', addToPlaylist);


    let songs = Array.from(songListItems).map(item => ({
        src: item.getAttribute('data-src'),
        title: item.innerText,
        artist: item.getAttribute('data-artist'),
        imgSrc: item.getAttribute('data-img-src'),
        genre: item.getAttribute('data-genre')
    }));

    let currentSongIndex = 0; // Track the index of the currently playing song

    // Toggle dark mode
    darkModeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        document.getElementById('header').classList.toggle('dark-mode');
    });

    // Filter songs by genre
    genreSelect.addEventListener('change', () => {
        filterSongsByGenre(genreSelect.value);
    });

    // Add click listeners to songs
    songListItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            playSong(index);
        });
    });

    // Function to play a song by its index
    function playSong(index) {
        const audioPlayer = document.getElementById('audio-player');
        const audioSource = document.getElementById('audio-source');
        const songTitle = document.getElementById('song-title');
        const songArtist = document.getElementById('artist');
        const songImage = document.getElementById('song-image');

        const song = songs[index];

        audioSource.src = song.src;
        audioPlayer.load();
        audioPlayer.play();

        songTitle.innerText = song.title;
        songArtist.innerText = song.artist;
        songImage.src = song.imgSrc;

        // Highlight the currently playing song in the sidebar
        document.querySelectorAll('#song-list li').forEach(item => item.classList.remove('active'));
        document.querySelector(`#song-list li[data-src="${song.src}"]`).classList.add('active');

        currentSongIndex = index; // Update the current song index
    }

    // Function to play the next song
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }

    // Function to play the previous song
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }

    // Attach next and previous buttons
    document.querySelector('.controls button:nth-child(1)').addEventListener('click', prevSong);
    document.querySelector('.controls button:nth-child(2)').addEventListener('click', nextSong);

    // Play the first song on initialization
    playSong(currentSongIndex);

    // Filter songs by genre
    function filterSongsByGenre(genre) {
        songListItems.forEach(item => {
            const itemGenre = item.getAttribute('data-genre');
            item.style.display = genre === 'All' || itemGenre === genre ? 'block' : 'none';
        });
    }

    // Search bar input event listener
    searchBar.addEventListener('input', () => {
        const searchQuery = searchBar.value.toLowerCase();
        filterSongsBySearch(searchQuery);
    });

    // Filter songs by search query
    function filterSongsBySearch(query) {
        songListItems.forEach(item => {
            const title = item.innerText.toLowerCase();
            item.style.display = title.includes(query) ? 'block' : 'none';
        });
    }

    // Add click listener to create playlist button
    createPlaylistButton.addEventListener('click', () => {
        const playlistName = searchBar.value.trim();
        if (playlistName === "") {
            return; // Do nothing if the search bar is empty
        }

        // Create a new playlist section
        const newPlaylist = document.createElement('div');
        newPlaylist.classList.add('new-playlist');
        newPlaylist.innerHTML = `
            <h3>${playlistName}</h3>
            <ul class="custom-playlist"></ul>
            <button class="clear-custom-playlist">Clear ${playlistName}</button>
        `;
        playlistContainer.appendChild(newPlaylist);

        // Clear search bar after creating a playlist
        searchBar.value = "";

        // Clear playlist button functionality
        const clearButton = newPlaylist.querySelector('.clear-custom-playlist');
        clearButton.addEventListener('click', function () {
            newPlaylist.remove();
        });
    });

    // Add the song to the playlist
    function addToPlaylist() {
        const songTitle = document.getElementById('song-title').innerText;
        const songArtist = document.getElementById('artist').innerText;

        const playlistItems = Array.from(playlistList.getElementsByTagName('li'));
        const songExists = playlistItems.some(
            item => item.textContent === `${songTitle} - ${songArtist}`
        );

        if (!songExists) {
            const playlistItem = document.createElement('li');
            playlistItem.textContent = `${songTitle} - ${songArtist}`;
            playlistList.appendChild(playlistItem);
        }
    }

    // Clear the playlist
    function clearPlaylist() {
        playlistList.innerHTML = '';
    }

    // Add click listener to clear button
    document.getElementById('clear-btn').addEventListener('click', clearPlaylist);
});