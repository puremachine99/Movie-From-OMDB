const apikey = "9c446852";
const urlAPI = "http://www.omdbapi.com/?apikey=" + apikey;

//fetch refactor
const searchButton = document.querySelector(".searchButton");
searchButton.addEventListener("click", async function () {
  //kasih tau bahwa ada asynchronous
  try {
    const inputKeyword = document.querySelector(".inputKeyword");
    const movies = await getMovies(inputKeyword.value); // await, ngasih tau yang ini yang async
    console.log(movies);
    updateUI(movies);
  } catch (err) { //menangkap throw
    console.log(err);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err,
    });
  }
});

//Movie
function getMovies(keyword) {
  return fetch(urlAPI + "&s=" + keyword)
    .then((response) => {
      // console.log(response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    }); // *** kenapa pakai search ?
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => {
    cards += ShowCardHTML(m);
  });
  const movieContainer = document.querySelector(".movieContainer");
  movieContainer.innerHTML = cards;
}

//==================================================================
//event binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    console.log(movieDetail);
    updateUIDetail(movieDetail);
  }
});

//Movie Detail
function getMovieDetail(imdbid) {
  return fetch(urlAPI + "&i=" + imdbid)
    .then((response) => response.json())
    .then((response) => response); // *** kenapa ga pake search ?
}
function updateUIDetail(movieDetail) {
  const movieDetails = ShowModalDetail(movieDetail);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetails;
}

// literal templates
function ShowCardHTML(m) {
  return `
  <div class="col-md-4 my-5">
    <div class="card">
      <img src="${m.Poster}" class="card-img-top" alt="${m.Title}" />
      <div class="card-body">
        <h5 class="card-title">${m.Title}</h5>
        <h6 class="text-muted card-subtitle mb-2">${m.Year}</h6>
        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal"
        data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
      </div>
    </div>
  </div>
`;
}

function ShowModalDetail(r) {
  return `<div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <img src="${r.Poster}" class="img-fluid" alt="" />
    </div>
    <div class="col-md">
      <ul class="list-group">
        <li class="list-group-item">
          <h4>${r.Title}<small class="text-muted">[${r.imdbID}]</small></h4>
        </li>
        <li class="list-group-item">
          <strong>Director</strong> : ${r.Director}
        </li>
        <li class="list-group-item">
          <strong>Actors</strong> : ${r.Actors}
        </li>
        <li class="list-group-item">
          <strong>Writer</strong> : ${r.Writer}
        </li>
        <li class="list-group-item"><strong>Plot</strong>:${r.Plot}</li>
      </ul>
    </div>
  </div>
</div>`;
}

// ***

// karena getMovieDetail() respon dari API nya hanya 1 dan bentuk nya sudah object
// karena getMovies() respon dari API nya berbentuk promise
