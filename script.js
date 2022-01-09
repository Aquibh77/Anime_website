// will hold the current search result
var lastSearchData;


async function onSearch() {
    // clear results
    let resultContainer = document.getElementById('result-container')
    resultContainer.innerHTML = '';

    // Pull value from searchinput
    let searchInput = document.getElementById('searchInput').value;

    // Search for the anime from api repo
    if (searchInput === '') {
        alert("Enter search word!");
    } else {
        // create and set loading element
        let spinner = document.createElement('div');
        spinner.className='spin'
        resultContainer.appendChild(spinner)

        try {
            // Fetch Search API Results
            let searchResult = await getAnimeSearchResult(searchInput);
            resultContainer.innerHTML = '';
            
            // Check if api response have data to be shown
            if (!searchResult || searchResult.data.length === 0) {
                let noResult = document.createElement('div');
                noResult.className='no-data'
                noResult.append('No Anime found')
                resultContainer.appendChild(noResult)
            } else {
                // save search result for later use
                lastSearchData = searchResult.data;

                // build parts of the page
                let firstSeasonDetails = buildSelectedSeasonDetails(lastSearchData[0])
                let seasonList = buildSeasonList(lastSearchData, 0)
                let divider = document.createElement('hr');
                divider.className = 'solid'

                // insert it to the page result
                resultContainer.appendChild(firstSeasonDetails)
                resultContainer.appendChild(divider)
                resultContainer.appendChild(seasonList)
            }
        } catch {
            let noResult = document.createElement('div');
            noResult.className='no-data'
            noResult.append('Network Error')
            resultContainer.appendChild(noResult)
        }
    }
}

function buildSelectedSeasonDetails (season) {
    // create a holder of season details
    let seasonDetail = document.createElement('div');
    seasonDetail.className = 'selected-anime-details'

    // create season image holder
    let imageHolder = document.createElement('img');
    imageHolder.setAttribute('src', season.images.jpg.image_url)
    imageHolder.className = 'anime-image-container'

    // create a holder of season info
    let seasonInfo = document.createElement('div');
    seasonInfo.className = 'anime-detail-info'

    // create elements for various info points
    let seasonName = document.createElement('h2')
    seasonName.className = 'info-item'
    seasonName.append(season.title)

    let seasonStartDate = document.createElement('div')
    seasonStartDate.className = 'info-item'
    seasonStartDate.append(`State Date : ${season.aired.prop.from.day}/${season.aired.prop.from.month}/${season.aired.prop.from.year}`)
    
    let seasonEndDate = document.createElement('div')
    seasonEndDate.className = 'info-item'
    
    // Check if end date is available
    if (season.aired.to) {
        seasonEndDate.append(`End Date : ${season.aired.prop.to.day}/${season.aired.prop.to.month}/${season.aired.prop.to.year}`)
    }

    let seasonRating = document.createElement('div')
    seasonRating.className = 'info-item'

    // create image holder for imdb logo
    let imdbLogo = document.createElement('img');
    imdbLogo.setAttribute('src', "imdb-logo.png")
    imdbLogo.setAttribute('height', 30);

    // Insert the logo and value to it's container
    seasonRating.appendChild(imdbLogo)
    seasonRating.append(season.score)

    // Create genre container
    let genreContainer = document.createElement('div')
    genreContainer.className = 'genre-container info-item'

    // Iterate through genre list and create genre elements
    season.genres.forEach(item => {
        let genre = document.createElement('div')
        genre.className = 'genre'
        genre.append(item.name)

        genreContainer.appendChild(genre)
    })

    // Insert all the inifo items to the info container
    seasonInfo.appendChild(seasonName)
    seasonInfo.appendChild(seasonStartDate)
    seasonInfo.appendChild(seasonEndDate)
    seasonInfo.appendChild(seasonRating)
    seasonInfo.appendChild(genreContainer)

    // Insert the info and the image to the details container
    seasonDetail.appendChild(imageHolder)
    seasonDetail.appendChild(seasonInfo)

    return seasonDetail;
}

function buildSeasonList (data, currentIndex) {
    // create a holder of season details
    let seasonList = document.createElement('div');
    seasonList.className = 'available-anime-list'

    data.forEach((season, index) => {
        // create a styled container
        let div = document.createElement('div');
        div.className = 'anime-season-container';
        div.onclick = function () { switchSeasonView(index) }
 
        // create image holder for season image
        let image = document.createElement('img');
        image.setAttribute('src', season.images.jpg.image_url)
        image.className = index === currentIndex ? 'anime-season-image selected' : 'anime-season-image'

        // create a title holder for season title
        let title = document.createElement('div');
        title.append(season.title)

        // insert the items into the container
        div.appendChild(image)
        div.appendChild(title)

        // insert the container to the list of seasons
        seasonList.appendChild(div) 
    });

    return seasonList;
}

function switchSeasonView(index) {
    let resultContainer = document.getElementById('result-container')
    resultContainer.innerHTML = '';

    // Recalculate results
    let firstSeasonDetails = buildSelectedSeasonDetails(lastSearchData[index])
    let seasonList = buildSeasonList(lastSearchData, index)
    let divider = document.createElement('hr');
    divider.className = 'solid'

    // Rerender
    resultContainer.appendChild(firstSeasonDetails)
    resultContainer.appendChild(divider)
    resultContainer.appendChild(seasonList)
}
 
async function getAnimeSearchResult (animeName) {

    // Setup the anime search url
    var url = new URL("https://api.jikan.moe/v4/anime");

    // Include anime name as a query parameter
    url.searchParams.append('q', animeName);

    // Fetch api request and return the response as JSON
    let apiResponse = await fetch(url);
    return apiResponse.json()
}