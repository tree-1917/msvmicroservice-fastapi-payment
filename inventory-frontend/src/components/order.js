import { useState } from "react";
import { Product } from "./Products";

export const Order = () => {
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("Buy your favorite product");

  const submit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8001/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        quantity,
      }),
    });
    setMessage("thank you for your order ");
  };

  return (
    <div className="container">
      <main>
        <div className="py-5 text-center">
          <h2>Checkout Form</h2>
          <p className="lead"> {message}</p>
        </div>

        <form onSubmit={submit}>
          <div className="row g-3 ">
            {/* input 1 */}
            <div className="col-sm-6">
              <label className="form-label">Product</label>
              <input
                className="form-control"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            {/* input 2 */}
            <div className="col-sm-6">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <hr className="my-4" />
          {/* submit button */}
          <button className="w-100 btn btn-danger btn-lg" type="submit">
            Buy
          </button>
        </form>
      </main>
    </div>
  );
};
