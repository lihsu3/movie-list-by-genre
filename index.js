(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  // const listBtn = document.getElementById('list-btn')
  // const cardBtn = document.getElementById('card-btn')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  let currentPage = 1
  let currentDisplayStyle = 'card'

  const genreList = document.getElementById('genre-list')
  let genreListItems = ''

  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

  // render list group
  for (let i = 0; i < Object.keys(genres).length; i++) {
    genreListItems += `
      <a class="list-group-item list-group-item-action" data-id="${i+1}" data-toggle="list" href="#profile" role="tab">${genres[i+1]}</a>`
  }
  genreList.innerHTML = genreListItems

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    let moviesSameGenre = []
    moviesSameGenre = data.filter(movie => movie.genres.includes(1))

    getTotalPages(moviesSameGenre)
    // displayDataList(data)
    getPageData(1, moviesSameGenre)
  }).catch((err) => console.log(err))

  // listBtn.addEventListener('click', (event) => {
    // currentDisplayStyle = 'list'
    // getPageData(currentPage)
  // })

  // cardBtn.addEventListener('click', (event) => {
    // currentDisplayStyle = 'card'
    // getPageData(currentPage)
  // })

  genreList.addEventListener('click', (event) => {
    let moviesSameGenre = []
    moviesSameGenre = data.filter(movie => movie.genres.includes(parseInt(event.target.dataset.id)))
    
    getTotalPages(moviesSameGenre)
    // displayDataList(data)
    getPageData(1, moviesSameGenre)

  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    // console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      currentPage = event.target.dataset.page
      getPageData(currentPage)
    }
  })

  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function displayDataList (data) {
    let htmlContent = ''
    let badgesContent

    data.forEach(function (item, index) {
      badgesContent = ''
      for (let i = 0; i < item.genres.length; i++) {
        badgesContent += `<span class="badge badge-info">${genres[item.genres[i]]}</span>`
      }

      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <div class="card-footer">
              ` + badgesContent + `
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem (id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }
})()
