import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [latLng, setLatLng] = useState({ latitude: "", longitude: "" });
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">
                Title<span style={{ color: "red" }}>*</span>
              </label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">
                Price<span style={{ color: "red" }}>*</span>
              </label>
              <input id="price" name="price" type="number" required min={0} />
            </div>
            <div className="item">
              <label htmlFor="address">
                Address<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">
                Latitude{" "}
                <span style={{ color: "gray", fontWeight: 400 }}>
                  (e.g. 14.5995)
                </span>
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={latLng.latitude}
                onChange={(e) =>
                  setLatLng((l) => ({ ...l, latitude: e.target.value }))
                }
                required
              />
              <small style={{ color: "#888" }}>
                Latitude is the north-south position (decimal degrees, -90 to
                90).
              </small>
            </div>
            <div className="item">
              <label htmlFor="longitude">
                Longitude{" "}
                <span style={{ color: "gray", fontWeight: 400 }}>
                  (e.g. 120.9842)
                </span>
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={latLng.longitude}
                onChange={(e) =>
                  setLatLng((l) => ({ ...l, longitude: e.target.value }))
                }
                required
              />
              <small style={{ color: "#888" }}>
                Longitude is the east-west position (decimal degrees, -180 to
                180).
              </small>
            </div>
            <div className="item description">
              <label htmlFor="desc">
                Description<span style={{ color: "red" }}>*</span>
              </label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">
                City<span style={{ color: "red" }}>*</span>
              </label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">
                Bedroom Number<span style={{ color: "red" }}>*</span>
              </label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">
                Bathroom Number<span style={{ color: "red" }}>*</span>
              </label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="type">
                Type<span style={{ color: "red" }}>*</span>
              </label>
              <select name="type" required>
                <option value="rent">Rent (for lease/rent)</option>
                <option value="buy">Buy (for sale)</option>
              </select>
              <small style={{ color: "#888" }}>
                Choose whether this property is for rent or for sale.
              </small>
            </div>
            <div className="item">
              <label htmlFor="property">
                Property<span style={{ color: "red" }}>*</span>
              </label>
              <select name="property" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
              <small style={{ color: "#888" }}>
                Select the type of property you are posting.
              </small>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
