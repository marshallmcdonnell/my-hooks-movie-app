import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const OMDB_URL = "https://www.omdbapi.com/?s=";
const API_KEY = "&apikey=4f3b1fca";


const App = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(OMDB_URL + "man" + API_KEY)
      .then(response => response.json())
      .then(jsonResponse => {
        setMovies(jsonResponse.Search);
        setLoading(false);
      });
  }, []);

  const search = searchValue => {
    setLoading(true);
    setErrorMessage(null)

    fetch(OMDB_URL + searchValue + API_KEY)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          setMovies(jsonResponse.Search);
          setLoading(false); 
        } else {
          setErrorMessage(jsonResponse.Error);
          setLoading(false);
        }
      });
  };

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro"> Sharing a few of our favorite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
        <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
