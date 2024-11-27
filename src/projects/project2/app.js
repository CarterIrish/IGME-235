// Attatch the search button clicked method to search btn

// set an enum for anime search types
const SEARCH_TYPE =
{
    1: "Recomendations",
    2: "Anime"
}

// on load, set up the page with stored values and important event listeners
window.onload = (e) => {
    // get consts for the button and type field
    const searchButton = document.querySelector("#searchButton");
    const typeSelect = document.querySelector("#searchType");

    // set their listeners
    searchButton.onclick = searchButtonClicked;
    typeSelect.onchange = searchTypeChanged;

    // get local stored search type and set the page up.
    const storedType = localStorage.getItem("searchKey");
    if (storedType) {
        searchButton.innerHTML = `Get Your ${SEARCH_TYPE[storedType]}`; // set the button text
        typeSelect.querySelector(`option[value='${storedType}']`).selected = true; // set the type of search 
        if (storedType == 1) {
            document.querySelector("#limit").disabled = true; // set limit enabled disabled
        }
        else {
            document.querySelector("#limit").disabled = false; // set limit selector enabled
        }
    }
    else {
        // no saved data so set default values
        searchButton.innerHTML = `Get Your ${SEARCH_TYPE[1]}`; // set button to recomendations
        typeSelect.querySelector(`option[value='1']`).selected = true; // set the type selecter to match
        document.querySelector("#limit").disabled = true; // disable the limit selector
    }
};

// Invoked when the search type is changed
const searchTypeChanged = (e) => {
    
    // set local storage, change page setup
    localStorage.setItem("searchKey", e.target.value);
    searchButton.innerHTML = `Get Your ${SEARCH_TYPE[e.target.value]}`;
    if (e.target.value == 2) {
        document.querySelector("#limit").disabled = false;
    }
    else {
        document.querySelector("#limit").disabled = true;
    }
}

// invoked when the search button is clicked
async function searchButtonClicked() {
    // if looking for specific anime
    if (document.querySelector("#searchType").value == 2) {
        // get the anime data
        let anime = await getAnime();
        // create arrays for imporant info to simplify html string creation
        let images = anime.map(anime => anime.images.jpg.image_url);
        let animeNames = anime.map(anime => anime.title);
        let animelinks = anime.map(anime => anime.url);
        // Create individual html elements for each anime.
        let imgsHtml = images.map(url =>
            `<a class="animeLink" href="${animelinks[images.indexOf(url)]}">
         <div class="animeTile">
         <img class="animeTileImg" src="${url}">
         <p class="animeTileText">${animeNames[images.indexOf(url)]}</p>
         </div>
         </a>`).join('\n');
        
        // set the content element to new html data
        document.querySelector("#content").innerHTML = imgsHtml;

    }
    else {
        // if looking for recomandations
        anime = await getAnimeRecomendations();
        // perform same steps as previuouly but with differeant paths to data
        images = anime.map(anime => anime.entry.images.jpg.image_url);
        animeNames = anime.map(anime => anime.entry.title);
        animelinks = anime.map(anime => anime.entry.url);
        imgsHtml = images.map(url =>
            `<a class="animeLink" href="${animelinks[images.indexOf(url)]}">
         <div class="animeTile">
         <img class="animeTileImg" src="${url}">
         <p class="animeTileText">${animeNames[images.indexOf(url)]}</p>
         </div>
         </a>`).join('\n');

        document.querySelector("#content").innerHTML = imgsHtml;

    }

}

// Queries the Jikan API for anime 
async function getAnime() {

    // get the query, limit, and media type
    let searchQuery = document.querySelector("#searchTerm").value;
    let responseLimit = document.querySelector("#limit").value;
    let mediaType = document.querySelector("#type").value;

    // set query string
    let queryString = `https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=${responseLimit}&type=${mediaType}&sfw=true&order_by=rank`;
    // get response from Jikan API
    let response = await fetch(queryString);
    // conver to JSON
    let data = await response.json();
    // return the JSON objects
    return data.data;
}

// Queries the Jikan API for anime recomendations
async function getAnimeRecomendations() {
    // get search query and media type
    let searchQuery = document.querySelector("#searchTerm").value;
    let mediaType = document.querySelector("#type").value;

    // Query the API for the anime provided & get the data about it
    let queryString = `https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=1&type=${mediaType}&sfw=true&order_by=rank`;
    let response = await fetch(queryString);
    let data = await response.json();
    data = data.data;

    // Re-query for the recomendations using ID found in intial query
    queryString = `https://api.jikan.moe/v4/anime/${data[0].mal_id}/recommendations`;
    response = await fetch(queryString);
    data = await response.json();
    return data.data; // return the aray of anime objects
}


