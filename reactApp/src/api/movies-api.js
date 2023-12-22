export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=cdacf9c6824025af1488bbc0de5219fe&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };