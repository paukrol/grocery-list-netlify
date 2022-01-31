import Header from "./Header";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import SearchItem from "./SearchItem";
import apiRequest from "./apiRequest";

function App() {
  // const [items, setItems] = useState([
  //   {
  //     id: 1,
  //     checked: true,
  //     item: "One half pound bag of Cocoa Covered Almonds Unsalted",
  //   },
  //   {
  //     id: 2,
  //     checked: false,
  //     item: "Item 2",
  //   },
  //   {
  //     id: 3,
  //     checked: false,
  //     item: "Item 3",
  //   },
  // ]); ==> zamieniamy przykładowe dane na dane z localStorage

  const API_URL = "http://localhost:3500/items";
  // const [items, setItems] = useState(
  //   JSON.parse(localStorage.getItem("shoppinglist")) || []
  // );

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   localStorage.setItem("shoppinglist", JSON.stringify(items));
  // }, [items]);

  // ****************** OLD METHOD ************
  // useEffect(() => {
  //   fetch("http://localhost:3500/items")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setItems(data);
  //     });
  // }, []);

  // ***************** NEW METHOD ***************
  useEffect(() => {
    // localStorage.setItem("shoppinglist", JSON.stringify(items));

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        // console.log(response);
        if (!response.ok) throw Error("Did not receive expected data");
        const listItems = await response.json();

        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        // console.log(err.stack);
        // console.log(err.message);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      // (async () => await fetchItems())();  lub:
      fetchItems();
    }, 2000);
  }, []);

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;

    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myNewItem),
    };

    const result = await apiRequest(API_URL, postOptions);

    if (result) setFetchError(result);
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);

    const updateOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: myItem[0].checked }),
    };

    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = {
      method: "DELETE",
    };

    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setFetchError(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    console.log(newItem);
    // console.log("submitted");

    // add Item
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>

      <Footer length={items.length} />
    </div>
  );
}

export default App;
