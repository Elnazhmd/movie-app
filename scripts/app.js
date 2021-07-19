// my global variables
const API_KEY = 'api_key=58536f821286f92ea90677807b6943a0';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const main = document.querySelector('#main');
const form = document.querySelector('#form');
const search = document.querySelector('#search');
const tagsEl = document.querySelector('#tags');
const prev = document.querySelector('#prev')
const next = document.querySelector('#next')
const current = document.querySelector('#current')
let pageNum = 1;
	// genres by name and id
const genres = [{
		"id": 28,
		"name": "Action"
	}, {
		"id": 12,
		"name": "Adventure"
	}, {
		"id": 16,
		"name": "Animation"
	}, {
		"id": 35,
		"name": "Comedy"
	}, {
		"id": 80,
		"name": "Crime"
	}, {
		"id": 99,
		"name": "Documentary"
	}, {
		"id": 18,
		"name": "Drama"
	}, {
		"id": 10751,
		"name": "Family"
	}, {
		"id": 14,
		"name": "Fantasy"
	}, {
		"id": 36,
		"name": "History"
	}, {
		"id": 27,
		"name": "Horror"
	}, {
		"id": 10402,
		"name": "Music"
	}, {
		"id": 9648,
		"name": "Mystery"
	}, {
		"id": 10749,
		"name": "Romance"
	}, {
		"id": 878,
		"name": "Science Fiction"
	}, {
		"id": 10770,
		"name": "TV Movie"
	}, {
		"id": 53,
		"name": "Thriller"
	}, {
		"id": 10752,
		"name": "War"
	}, {
		"id": 37,
		"name": "Western"
	}]
	// pagination page numbers
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
//selected & unselected tags of genres
var selectedGenre = []
setGenre();

function setGenre() {
	tagsEl.innerHTML = '';
	genres.forEach((genre) => {
		const tagItem = document.createElement('div');
		tagItem.classList.add('tag');
		tagItem.id = genre.id;
		tagItem.innerText = genre.name;
		tagItem.addEventListener('click', () => {
			if(selectedGenre.length == 0) {
				selectedGenre.push(genre.id);
			} else {
				if(selectedGenre.includes(genre.id)) {
					selectedGenre.forEach((id, idx) => {
						if(id == genre.id) {
							selectedGenre.splice(idx, 1);
						}
					})
				} else {
					selectedGenre.push(genre.id);
				}
			}
			console.log(selectedGenre)
			getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
			highlightSelection()
		})
		tagsEl.append(tagItem);
	})
}
// function for highlighting tags when selected
function highlightSelection() {
	const tags = document.querySelectorAll('.tag');
	tags.forEach(tag => {
		tag.classList.remove('highlight')
	})
	clearBtn()
	if(selectedGenre.length != 0) {
		selectedGenre.forEach(id => {
			const hightlightedTag = document.getElementById(id);
			hightlightedTag.classList.add('highlight');
		})
	}
}
// clear button for genre tags
function clearBtn() {
	let clearBtn = document.querySelector('#clear');
	if(clearBtn) {
		clearBtn.classList.add('highlight')
	} else {
		let clear = document.createElement('div');
		clear.classList.add('tag', 'highlight');
		clear.id = 'clear';
		clear.innerText = 'Clear Filters x';
		clear.addEventListener('click', () => {
			selectedGenre = [];
			setGenre();
			getMovies(API_URL);
		})
		tagsEl.append(clear);
	}
}


getMovies(API_URL);
function getMovies(url) {
	lastUrl = url;
	fetch(url).then(res => res.json()).then(data => {
		// console.log(data.results)
		if(data.results.length !== 0) {
			showMovies(data.results);
			currentPage = data.page;
			nextPage = currentPage + 1;
			prevPage = currentPage - 1;
			totalPages = data.total_pages;
			current.innerText = currentPage;
			if(currentPage <= 1) {
				prev.classList.add('disabled');
				next.classList.remove('disabled')
			} else if(currentPage >= totalPages) {
				prev.classList.remove('disabled');
				next.classList.add('disabled')
			} else {
				prev.classList.remove('disabled');
				next.classList.remove('disabled')
			}
			tagsEl.scrollIntoView({
				behavior: 'smooth'
			})
		} else {
			main.innerHTML = `<div class="no-results"><h1>No Results Found</h1></div>`
			alert("Sorry! No results found please try something else.")
		}
	})
}

function showMovies(data) {
	main.innerHTML = '';
	data.forEach(movie => {
		const {
			title, poster_path, vote_average, id
		} = movie;
		const movieEl = document.createElement('div');
		movieEl.classList.add('movie');
		movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <div class="movie-info__rank">
                <img src="../images/star.svg">
                <span class="${getColor(vote_average)}">&nbsp;${vote_average}<span class="ten">/10</span></span>
                </div>
            </div>

            <div class="details">
                <button class="know-more" id="${id}">More Details	<small> &#10148; </small> </button
            </div>
        
        `
		main.appendChild(movieEl);
		let movieId = document.getElementById(id);
		movieId.addEventListener('click', () => {
			console.log(id);
			openNav(id)
		})
	})
}
/* Open when someone clicks on the movie details element */
const overlayContent = document.querySelector('#overlay-content');
const overlay = document.querySelector(".overlay");

function openNav(myId) {
	overlayContent.innerHTML = '';
	document.querySelector("#myNav").style.width = "100%";
	console.log(API_URL)
	fetch(API_URL+`&page=${pageNum}`).then(res => res.json()).then(data => {
			
			// console.log(data.results)

			data.results.forEach((movie) => {
			if(myId == movie.id) {
				const {
					title, poster_path, vote_average, overview, release_date, backdrop_path
				} = movie;
				let movieDesc = document.createElement("div");
				movieDesc.classList.add("movie-details");
				movieDesc.innerHTML = `
      
                      <div class="movie-details__left">
                      <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
                      </div>
                      <div class="movie-details__right">
                      <h1>${title}</h1>
					  <p>(${release_date[0]}${release_date[1]}${release_date[2]}${release_date[3]})</p>
                      <div class="movie-info__rank details-rank">
                      <img src="../images/star.svg">
                      <span class="${getColor(vote_average)}">&nbsp;${vote_average}<span class="ten">/10</span></span>
                      </div>
                      <div>
                      <h3>Overview:</h3>
                      <p>${overview}</p>
                      </div>
                      <h3> Watch Trailer: </h3>
                      <div class="trailer"></div>
                      
                      </div>
                      
                `
				overlay.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://image.tmdb.org/t/p/original${backdrop_path}") no-repeat center center`;
				overlay.style.backgroundSize = "cover";
				overlayContent.appendChild(movieDesc);

				fetch(BASE_URL + '/movie/' + movie.id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
					if(videoData) {
						if(videoData.results.length > 0) {
							videoData.results.filter((video) => {
								let {
									name, key, site
								} = video
								if(site == 'YouTube') {
									let embed = document.querySelector(".trailer")
									embed.innerHTML = `
                   <iframe width="400" height="170" src="https://www.youtube.com/embed/${key}" title="${name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
								}
								document.querySelector('#overlay-video').append(embed);
							})
						}
					}
				}).catch((error) => {
					return error
				  });
			}
		})
	})
}
/* Close when someone clicks on the "x"*/
function closeNav() {
	overlayContent.innerHTML = "";
	document.querySelector("#myNav").style.width = "0%";
}

function getColor(vote) {
	if(vote >= 8) {
		return 'green'
	} else if(vote >= 5) {
		return "orange"
	} else {
		return 'red'
	}
}
form.addEventListener('submit', (e) => {
	e.preventDefault();
	const searchTerm = search.value;
	selectedGenre = [];
	setGenre();
	if(searchTerm) {
		getMovies(searchURL + '&query=' + searchTerm);
		search.value = ""
	} else {
		getMovies(API_URL);
	}
})
const discoverLink = document.querySelector(".discover-link");
discoverLink.addEventListener('click', () => {
	getMovies(API_URL);
})
prev.addEventListener('click', () => {
	if(prevPage > 0) {
		pageCall(prevPage);
		pageNum = pageNum - 1

	}
})
next.addEventListener('click', () => {
	if(nextPage <= totalPages) {
		pageCall(nextPage);
		pageNum = pageNum + 1
	}
})

function pageCall(page) {
	let urlSplit = lastUrl.split('?');
	let queryParams = urlSplit[1].split('&');
	let key = queryParams[queryParams.length - 1].split('=');
	if(key[0] != 'page') {
		let url = lastUrl + '&page=' + page
		getMovies(url);
	} else {
		key[1] = page.toString();
		let a = key.join('=');
		queryParams[queryParams.length - 1] = a;
		let b = queryParams.join('&');
		let url = urlSplit[0] + '?' + b
		getMovies(url);
	}
}

// generate random picture for header 

let headerMovies = "";
let randomMovies = "";
headerImage= document.querySelector("#img")

function generateRandomPicture(array){
	let randomNum = Math.floor(Math.random() * array.length); 
	headerImage.setAttribute("src", array[randomNum]);
  }

  const headerBg = document.querySelector("#header");

  async function randomMovie() {
	await fetch(
	  `https://api.themoviedb.org/3/movie/popular?api_key=43e989433bb11814c1a867ae4689ec4d&include_adult=false`
	)
	  .then((response) => response.json())
	  .then((response) => {
		let movies = "";
		let randomMovie = "";
		movies = response.results.filter((el) => el.backdrop_path !== null);
		randomMovie = movies[Math.floor(Math.random() * movies.length)];
		headerBg.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}') no-repeat center center`
		headerBg.style.backgroundSize = "cover";
		headerBg.innerHTML = `
		<h1> Discover <br>Popular Movies </h1>
		<h2> ${randomMovie.title} </h2>
		<p>${randomMovie.overview}</p>
		`;
	  });
  }
  
  randomMovie();