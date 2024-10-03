import React, { useState, useEffect } from "react";
import { Wrapper } from "./wrapper";
import { Link } from "react-router-dom";

export const Product = () => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  // Fetch function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/products");
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const content = await response.json();
        setProduct(content);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);
  // Delete function
  const del = async (id) => {
    if (window.confirm("Are you sure to delete this recored")) {
      await fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE",
      });
    }
    setProduct(product.filter((p) => p.id !== id ));
  };
  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link
          to={"/create"}
          className="btn btn-sm btn-outline btn-outline-secondary"
        >
          Add
        </Link>
      </div>
      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((ele) => (
              <tr key={ele.id}>
                {/* Key prop assigned for each row */}
                <td>{ele.id}</td>
                <td>{ele.name}</td>
                <td>{ele.price}</td>
                <td>{ele.quantity}</td>
                <td>
                  <a
                    href="#"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => del(ele.id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};
