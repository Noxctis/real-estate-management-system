import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "../newPostPage/newPostPage.scss";

function EditPostPage() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);
  const [latLng, setLatLng] = useState({ latitude: "", longitude: "" });
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest.get(`/posts/${id}`)
      .then(res => {
        const post = res.data;
        setForm({
          title: post.title,
          price: post.price,
          city: post.city,
          bedroom: post.bedroom,
          bathroom: post.bathroom,
          type: post.type,
          property: post.property,
          utilities: post.postDetail?.utilities || "",
          pet: post.postDetail?.pet || "",
          income: post.postDetail?.income || "",
          size: post.postDetail?.size || "",
          school: post.postDetail?.school || "",
          bus: post.postDetail?.bus || "",
          restaurant: post.postDetail?.restaurant || "",
        });
        setDesc(post.postDetail?.desc || "");
        setImages(post.images || []);
        setLatLng({ latitude: post.latitude || "", longitude: post.longitude || "" });
        setAddress(post.address || "");
      })
      .catch(() => setError("Failed to load post data."));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleLatLngChange = (e) => {
    setLatLng((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest.put(`/posts/${id}`,
        {
          postData: {
            title: form.title,
            price: parseInt(form.price),
            address: address,
            city: form.city,
            bedroom: parseInt(form.bedroom),
            bathroom: parseInt(form.bathroom),
            type: form.type,
            property: form.property,
            latitude: latLng.latitude,
            longitude: latLng.longitude,
            images: images,
          },
          postDetail: {
            desc: desc,
            utilities: form.utilities,
            pet: form.pet,
            income: form.income,
            size: parseInt(form.size),
            school: parseInt(form.school),
            bus: parseInt(form.bus),
            restaurant: parseInt(form.restaurant),
          },
        }
      );
      navigate(`/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title<span style={{ color: "red" }}>*</span></label>
              <input name="title" value={form.title || ""} onChange={handleChange} required />
            </div>
            <div className="item">
              <label htmlFor="price">Price<span style={{ color: "red" }}>*</span></label>
              <input name="price" type="number" value={form.price || ""} onChange={handleChange} required min={0} />
            </div>
            <div className="item">
              <label htmlFor="address">Address<span style={{ color: "red" }}>*</span></label>
              <input name="address" value={address} onChange={handleAddressChange} required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input name="latitude" type="number" step="any" value={latLng.latitude} onChange={handleLatLngChange} required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input name="longitude" type="number" step="any" value={latLng.longitude} onChange={handleLatLngChange} required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description<span style={{ color: "red" }}>*</span></label>
              <ReactQuill theme="snow" value={desc} onChange={setDesc} />
            </div>
            <div className="item">
              <label htmlFor="city">City<span style={{ color: "red" }}>*</span></label>
              <input name="city" value={form.city || ""} onChange={handleChange} required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number<span style={{ color: "red" }}>*</span></label>
              <input min={1} name="bedroom" type="number" value={form.bedroom || ""} onChange={handleChange} required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number<span style={{ color: "red" }}>*</span></label>
              <input min={1} name="bathroom" type="number" value={form.bathroom || ""} onChange={handleChange} required />
            </div>
            <div className="item">
              <label htmlFor="type">Type<span style={{ color: "red" }}>*</span></label>
              <select name="type" value={form.type || ""} onChange={handleChange} required>
                <option value="rent">Rent (for lease/rent)</option>
                <option value="buy">Buy (for sale)</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property<span style={{ color: "red" }}>*</span></label>
              <select name="property" value={form.property || ""} onChange={handleChange} required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" value={form.utilities || ""} onChange={handleChange}>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" value={form.pet || ""} onChange={handleChange}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input name="income" type="text" value={form.income || ""} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} name="size" type="number" value={form.size || ""} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} name="school" type="number" value={form.school || ""} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input min={0} name="bus" type="number" value={form.bus || ""} onChange={handleChange} />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} name="restaurant" type="number" value={form.restaurant || ""} onChange={handleChange} />
            </div>
            <button className="sendButton" type="submit" disabled={loading}>Update</button>
            {error && <span className="error-message">{error}</span>}
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

export default EditPostPage;
