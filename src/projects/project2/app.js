// Attatch the search button clicked method to search btn
window.onload = (e) => { document.querySelector("#searchButton").onclick = searchButtonClicked };

async function searchButtonClicked() {
    const anime = await getAnime();
    // This throws an error. WHYYYYY.
    const images = anime.map(anime => anime.images.jpg.image_url);
    const animelinks = anime.map(anime => anime.url);
    console.log(animelinks)
    const imgsHtml = images.map(url => `<a class="animeTile" href="${animelinks[images.indexOf(url)]}"><img src="${url}"/></a>`).join('\n');
    document.querySelector("#content").innerHTML = imgsHtml;
}

async function getAnime() {

    const searchQuery = document.querySelector("#searchTerm").value;
    const responseLimit = document.querySelector("#limit").value;

    const queryString = `https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=${responseLimit}&sfw=true`;
    const response = await fetch(queryString);
    const data = await response.json();
    return data.data;
}


