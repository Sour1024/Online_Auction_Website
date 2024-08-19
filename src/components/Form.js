import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Form.css";

const Form = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expireAt, setExpireAt] = useState("");

  useEffect(() => {
    if (formSubmitted) {
      const timeoutId = setTimeout(() => {
        console.log("This message will appear after 3 seconds.");
        setFormSubmitted(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [formSubmitted]);

  useEffect(() => {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata").then(
      (response) => {
        response
          .json()
          .then((data) => {
            setExpireAt(data.datetime);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("createdAt", expireAt);

    try {
      const response = await fetch("http://localhost:5000/api/auctions", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Auction created successfully!");
        setName("");
        setImage(null);
        setPrice("");
        setDescription("");
        setFormSubmitted(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while submitting the form. Please try again later."
      );
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="form-content">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Image:
          <input type="file" onChange={handleImageChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {formSubmitted && (
        <div className="alert alert-primary" role="alert">
          Form submitted successfully
        </div>
      )}
    </div>
  );
};

export default Form;
