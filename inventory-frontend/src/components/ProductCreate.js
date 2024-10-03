import { Wrapper } from "./wrapper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProductCreate = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (name == "" && price == "" && quantity == "") {
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          quantity,
        }),
      });
      console.log(response);
      if (response.ok) {
        console.log("Product created successfully!");
        navigate(-1); // Navigate back to the previous page (ProductList)
      } else {
        const errorData = await response.json();
        console.error(
          "Product creation failed:",
          errorData.message || errorData
        );
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Wrapper>
      <form className="mt-3" onSubmit={submit}>
        <div className="form-floating pb-3">
          <input
            className="form-control"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <label>Name</label>
        </div>

        <div className="form-floating pb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Price</label>
        </div>

        <div className="form-floating pb-3">
          <input
            type="number"
            className="form-control"
            placeholder="quantity"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <label>Quantity</label>
        </div>
        <button className="w-100 btn btn-lg btn-success" type="submit">
          Submit
        </button>
      </form>
    </Wrapper>
  );
};
