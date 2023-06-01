const search = document.querySelector('#search');
const form = document.querySelector('#search-form');
const main = document.querySelector('#main');

form.addEventListener('submit', (e) => {
	e.preventDefault();

	searchTerm = search.value.trim();
	if (searchTerm) {
		getLyrics(searchTerm);
	}
});

const getLyrics = async (searchTerm) => {
	try {
		const res = await fetch(`https://api.lyrics.ovh/suggest/${searchTerm}`);
		const data = await res.json();

		displayData(data);
		return data;
	} catch (error) {
		// alert('Something went wrong');
	}
};

const displayData = (data) => {
	main.innerHTML = `
		<ul class="songs">
			${data.data
				.map(
					(song) => `<li>
						<span><strong>${song.artist.name}</strong> - ${song.title}</span>
						<button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
					</li>`,
				)
				.join('')}
		</ul>`;

	if (data.data.length === 0) {
		main.innerHTML = `<h2 class="error-msg">No songs found</h2>`;
	} else if (data.data.length > 15) {
		main.innerHTML += `<button class="btn" id="show-more">Show More</button>`;
	}

	main.addEventListener('click', (e) => {
		const clickedEl = e.target;
		if (clickedEl.tagName === 'BUTTON') {
			const artist = clickedEl.getAttribute('data-artist');
			console.log(artist);
			const songTitle = clickedEl.getAttribute('data-songtitle');
			console.log(songTitle);
			getFullLyrics(artist, songTitle);
		}
	});
};

const getFullLyrics = async (artist, songTitle) => {
	try {
		console.log('Artist:', artist);
		console.log('Song Title:', songTitle);

		const res = await fetch(
			`https://api.lyrics.ovh/v1/Coldplay/Adventure of a Lifetime`,
		);
		// https://api.lyrics.ovh/v1/Coldplay/Adventure of a Lifetime
		const data = await res.json();

		if (data.lyrics) {
			const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
			console.log('Lyrics:', lyrics);
			displayFullLyrics(artist, songTitle, lyrics);
		} else {
			console.log('Lyrics not found for the specified song');
		}
	} catch (error) {
		console.log('Something went wrong:', error);
	}
};

const displayFullLyrics = (artist, title, lyrics) => {
	main.innerHTML = `
		<div class="lyrics-container">
			<h2><strong>${artist}</strong> - ${title}</h2>
			<p>${lyrics}</p>
		</div>`;
};
