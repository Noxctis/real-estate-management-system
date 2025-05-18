import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./searchBar.scss";

const types = ["buy", "rent"];
const propertyTypes = ["apartment", "house", "condo", "land"];
const bedroomOptions = [1, 2, 3, 4, 5, "5+"];

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    property: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value && value !== "0") params.append(key, value);
    });
    navigate(`/list?${params.toString()}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
        />
        <select
          name="property"
          value={query.property}
          onChange={handleChange}
        >
          <option value="">Property Type</option>
          {propertyTypes.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <select
          name="bedroom"
          value={query.bedroom}
          onChange={handleChange}
        >
          <option value="">Bedrooms</option>
          {bedroomOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
        />
        <button type="submit">
          <img src="/search.png" alt="" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
