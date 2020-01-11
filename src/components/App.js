import React, { useReducer, useEffect } from 'react';
import '../App.css';
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const OMDB_URL = "https://www.omdbapi.com/?s=";
const API_KEY = "&apikey=4f3b1fca";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
}

const reducer = (state, action) => {
  switch(action.type) {
    case  "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    fetch(OMDB_URL + "man" + API_KEY)
      .then(response => response.json())
      .then(jsonResponse => {
        
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        })

      });
  }, []);

  const search = searchValue => {

    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(OMDB_URL + searchValue + API_KEY)
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.Response === "True") {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          })
        } else {
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
          })
        }
      });
  };

  const {loading, movies, errorMessage} = state;

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
