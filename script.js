const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Get initial movies
getMovies(API_URL);

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

// Create a modal
const modal = document.createElement('div');
modal.id = 'modal';
modal.classList.add('modal');
document.body.appendChild(modal);

async function getTrailer(movieId) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
    const data = await res.json();
    const trailer = data.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

function openModal(movie, trailerUrl) {
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            ${trailerUrl ? `<iframe width="100%" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` : '<p>No trailer available</p>'}
        </div>
    `;
    modal.classList.add('show');

    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.classList.remove('show');
    });
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, id } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;

        movieEl.addEventListener('click', async () => {
            const trailerUrl = await getTrailer(id);
            openModal(movie, trailerUrl);
        });

        main.appendChild(movieEl);
    });
}
