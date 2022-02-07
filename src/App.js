import "./App.css";
import Login from "./Login";
import Header from "./Header";

import { useStateValue } from "./StateProvider";
import { useEffect, useState } from "react";
import { firedb } from "./firebase";
import db from "./firebase";
import { actionTypes } from "./reducer";
import MovieList from "./MovieList";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Wishlist from "./Wishlist";

function App() {
  const [{ user, movieslist }, dispatch] = useStateValue();

  const [movies, setMovies] = useState([]);

  const colNames = ["Title", "Year", "Genre", "Add to Wishlist"];

  useEffect(() => {
    // fetching data from realtime database
    firedb.on("value", (snapshot) => {
      console.log(snapshot.val());

      dispatch({
        type: actionTypes.SET_MOVIES,
        movieslist: snapshot.val(),
      });

      if (snapshot.val() !== null) {
        setMovies({ ...snapshot.val() });
        console.log(movies[0]);
      } else {
        setMovies({});
      }
    });

    console.log(movies);

    console.log(movieslist);

    return () => {
      setMovies({});
    };
  }, []);

  const addToWishlist = (obj, index) => {
    console.log("Adding to wishlist");
    console.log(obj);
    console.log(obj.id);
    // console.log(title);
    db.collection("wishlist").doc(user.uid).collection("userWishlist").add({
      Title: obj.title,
      Year: obj.year,
      Genre: obj.genre,
    });

    // delete movies[index];
    // {()=>{
    //   Object.values(movies).map((obj1, index) => {
    //      if(obj1.id === obj.id) {
    //        continue;
    //      }
    //   }
    // }}
  };

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <>
          <Router>
            <div className="app__body">
              <Header />
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              {/* {loading ? (
                <Loading />
              ) : (
                <MovieList
                  colNames={colNames}
                  movies={movies}
                  addToWishlist={addToWishlist}
                />
              )} */}


              

<div className="search-bar" style={{marginTop: '20px', width: '100%', alignItems: 'center', marginBottom: '20px'}}>
<form action="/" method="get">
        <label htmlFor="header-search">
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search Movie"
            name="s" 
        />
        <button type="submit">Search</button>
    </form>

</div>
    


              <Routes>
                <Route
                  path="/movies"
                  element={
                    <MovieList
                      colNames={colNames}
                      movies={movies}
                      addToWishlist={addToWishlist}
                    />
                  }
                ></Route>
                <Route path="/" element={<Wishlist />}></Route>
              </Routes>
            </div>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
