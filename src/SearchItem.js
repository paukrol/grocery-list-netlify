const SearchItem = ({ search, setSearch }) => {
  return (
    <form className="searchForm">
      <label htmlFor="search">Search</label>
      <input
        type="text"
        id="search"
        role="searchbox"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default SearchItem;
