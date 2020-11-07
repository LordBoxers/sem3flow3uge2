import './App.css';
import bookFacade from "./bookFacade";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useLocation,
  Prompt,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";
import React, { useState, useEffect } from 'react';

function App({ bookFacade }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();

  const setLoginStatus = status => {
    setIsLoggedIn(status);
    history.push("/");
  };

  return (
    <div>
      <Header
        loginMsg={isLoggedIn ? "Logout" : "Login"}
        isLoggedIn={isLoggedIn}
      />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Products bookFacade={bookFacade} />
        </Route>
        <Route path="/add-book">
          <AddBook bookFacade={bookFacade} />
        </Route>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/find-book">
          <FindBook bookFacade={bookFacade} />
        </Route>
        <Route path="/login-out">
          <Login
            loginMsg={isLoggedIn ? "Logout" : "Login"}
            isLoggedIn={isLoggedIn}
            setLoginStatus={setLoginStatus}
          />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>

  );
}

export default App;

function Header({ isLoggedIn, loginMsg }) {
  return (
    <div>
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink activeClassName="active" to="/products">Products</NavLink></li>
      <li><NavLink activeClassName="active" to="/company">Company</NavLink></li>
      {isLoggedIn && (
        <React.fragment>
          <li><NavLink activeClassName="active" to="/add-book">Add Book</NavLink></li>
          <li><NavLink activeClassName="active" to="/find-book">Find Book</NavLink></li>
        </React.fragment>
      )}
      <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    </ul>
        </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Products({ bookFacade }) {
  const bookList = bookFacade.getBooks();
  const { path, url } = useRouteMatch();
  const printList = bookList.map(b => (
    <li><NavLink activeClassName="active" to={`${url}/${b.id}`}>{b.title}</NavLink></li>
  ))
  return (
    <div>
      <h2>Home</h2>
      <p>There's {bookList.length} books in the system</p>
      <ul>
        {printList}
      </ul>

      <Switch>
        <Route exact path={path}>
          <h3>please select a topic</h3>
        </Route>
        <Route path={`${path}/:id`}>
          <Details bookFacade={bookFacade} />
        </Route>
      </Switch>
    </div>
  );
}

function Details({ bookFacade }) {
  let { id } = useParams();
  const book = bookFacade.findBook(id);

  return (
    <div>
      <h3>{book.title}</h3>
      <p>Book id: {book.id}</p>
      <p>{book.info}</p>
    </div>
  )
}

function AddBook({ bookFacade }) {
  const bookPlaceholder = { id: "", title: "", info: "" };
  const [book, setBook] = useState({ ...bookPlaceholder });
  const [isBlocking, setIsBlocking] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setBook({ ...book, [id]: value });
    setIsBlocking(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    bookFacade.addBook(book);
    setBook({ ...bookPlaceholder });
    setIsBlocking(false);
  };
  return (
    <div>
      <h2>Add a Book to the collection</h2>
      {
        <Prompt
          when={isBlocking}
          message={location =>
            `you have unsaved changes, are you sure you want to go to ${location.pathname}`
          }
        />
      }
      <form>
        <input id="title" value={book.title} placeholder="Title" onChange={handleChange} />
        <br />
        <input id="info" value={book.info} placeholder="Info" onChange={handleChange} />
        <br />
        <button onClick={handleSubmit}>Add</button>
      </form>
    </div>
  );
}

function Company() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function FindBook({ bookFacade }) {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState(null);

  const findBook = () => {
    const foundBook = bookFacade.findBook(bookId);
    setBook(foundBook);
  };
  const deleteBook = id => {
    bookFacade.deleteBook(id);
    setBook(null);

  };

  return (
    <div>
      <h3>Find a Book</h3>
      <input id="book-id" placeholder="Enter book ID" onChange={e => { setBookId(e.target.value) }} />
      <button onClick={findBook}>Find Book</button>
      {book && (
        <div>
          <p>ID: {book.id}</p>
          <p>Title: {book.title}</p>
          <p>Info: {book.info}</p>
          <div>
            <button onClick={() => deleteBook(book.id)}>Delete Book</button>
          </div>
        </div>
      )}
      {!book && <p>Enter id for book to see</p>}
    </div>
  )
}

function Login({isLoggedIn, loginMsg, setLoginStatus}) {
  const handleBtnClick = () => {
    setLoginStatus(!isLoggedIn);
  };
  return (
    <div>
      <h2>{loginMsg}</h2>
      <p>blablalba</p>
      <button onClick={handleBtnClick}>{loginMsg}</button>
    </div>
  );
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h2>No match for <code>{location.pathname}</code> were found.</h2>
    </div>
  )
}