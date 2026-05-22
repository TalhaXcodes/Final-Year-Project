import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../../services/firestore/productService";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/firestore/orderService";

const categories = [
  "Accessories",
  "Clothing",
  "Edible Stuff",
  "Bag / Wallet",
  "Makeup Products",
  "Perfume",
  "Shoes",
  "Toys",
];

const genders = ["Male", "Female", "Unisex"];

const initialProduct = {
  name: "",
  category: "Perfume",

  price: "",
  stock: "",

  gender: "Female",
  ageGroups: "",

  imageUrl: "",
  description: "",

  tags: "",

  isAvailable: true,
  isFeatured: false,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(initialProduct);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name || "",
      category: product.category || "Perfume",
      price: product.price || "",
      stock: product.stock || "",
      gender: product.gender || "Unisex",
      ageGroups: Array.isArray(product.ageGroups)
        ? product.ageGroups.join(", ")
        : product.ageGroups || "",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      tags: Array.isArray(product.tags)
        ? product.tags.join(", ")
        : product.tags || "",
      isAvailable: product.isAvailable ?? true,
      isFeatured: product.isFeatured ?? false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProductForm(initialProduct);
    setMessage("");
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setMessage("Failed to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setMessage("Order status updated successfully.");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      setMessage(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setMessage("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !productForm.name ||
      !productForm.category ||
      !productForm.price ||
      !productForm.stock ||
      !productForm.gender ||
      !productForm.ageGroups ||
      !productForm.imageUrl ||
      !productForm.description ||
      !productForm.tags
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setSavingProduct(true);
      if (editingProductId) {
        await updateProduct(editingProductId, productForm);
        setMessage("Product updated successfully.");
        setEditingProductId(null);
      } else {
        await addProduct(productForm);
        setMessage("Product added successfully.");
      }

      setProductForm(initialProduct);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
      setMessage(error.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      setMessage("Product deleted successfully.");
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rose-600">
            BASKETRIES Admin Panel
          </h1>
          <p className="text-gray-600 mt-1">
            Add and manage catalogue products.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow border border-rose-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Products
            </h2>
            <p className="text-3xl font-bold text-rose-600">
              {products.length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow border border-rose-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Available Products
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {products.filter((p) => p.isAvailable).length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow border border-rose-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Featured Products
            </h2>
            <p className="text-3xl font-bold text-rose-600">
              {products.filter((p) => p.isFeatured).length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow border border-rose-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h2>

            <p className="text-3xl font-bold text-rose-600">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-rose-200 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-rose-600">
            {editingProductId ? "Update Catalogue Product" : "Add New Catalogue Product"}
          </h2>

          {message && <p className="mb-4 text-sm text-rose-600">{message}</p>}

          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={productForm.name}
              onChange={handleChange}
              placeholder="Product Name *"
              className="border border-rose-200 p-3 rounded-md"
            />

            <select
              name="category"
              value={productForm.category}
              onChange={handleChange}
              className="border border-rose-200 p-3 rounded-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              name="price"
              type="number"
              value={productForm.price}
              onChange={handleChange}
              placeholder="Price *"
              className="border border-rose-200 p-3 rounded-md"
            />

            <input
              name="stock"
              type="number"
              value={productForm.stock}
              onChange={handleChange}
              placeholder="Stock *"
              className="border border-rose-200 p-3 rounded-md"
            />

            <select
              name="gender"
              value={productForm.gender}
              onChange={handleChange}
              className="border border-rose-200 p-3 rounded-md"
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>

            <input
              name="ageGroups"
              value={productForm.ageGroups}
              onChange={handleChange}
              placeholder="Age Groups e.g. 16–20, 20–25, 25–35"
              className="border border-rose-200 p-3 rounded-md"
            />

            <input
              name="imageUrl"
              value={productForm.imageUrl}
              onChange={handleChange}
              placeholder="Image URL *"
              className="border border-rose-200 p-3 rounded-md md:col-span-2"
            />

            <textarea
              name="description"
              value={productForm.description}
              onChange={handleChange}
              placeholder="Description *"
              className="border border-rose-200 p-3 rounded-md md:col-span-2 min-h-24"
            />

            <input
              name="tags"
              value={productForm.tags}
              onChange={handleChange}
              placeholder="Tags e.g. Elegant, Premium, Modern"
              className="border border-rose-200 p-3 rounded-md md:col-span-2"
            />

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={productForm.isAvailable}
                onChange={handleChange}
              />
              Available
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={productForm.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>

            <button
              disabled={savingProduct}
              className="md:col-span-2 bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 disabled:opacity-60"
            >
              {savingProduct
                ? editingProductId
                  ? "Updating..."
                  : "Saving..."
                : editingProductId
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="md:col-span-2 border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-rose-200">
          <h2 className="text-xl font-semibold mb-4 text-rose-600">
            Product List
          </h2>

          {loadingProducts ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-rose-100 text-left">
                    <th className="p-3 border">Image</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Category</th>
                    <th className="p-3 border">Gender</th>
                    <th className="p-3 border">Age Groups</th>
                    <th className="p-3 border">Price</th>
                    <th className="p-3 border">Stock</th>
                    <th className="p-3 border">Available</th>
                    <th className="p-3 border">Featured</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-3 border">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-56 object-contain bg-white p-2"
                        />
                      </td>

                      <td className="p-3 border">{product.name}</td>
                      <td className="p-3 border">{product.category}</td>
                      <td className="p-3 border">{product.gender}</td>
                      <td className="p-3 border">
                        {Array.isArray(product.ageGroups)
                          ? product.ageGroups.join(", ")
                          : product.ageGroups}
                      </td>
                      <td className="p-3 border">Rs {product.price}</td>
                      <td className="p-3 border">{product.stock}</td>
                      <td className="p-3 border">
                        {product.isAvailable ? "Yes" : "No"}
                      </td>
                      <td className="p-3 border">
                        {product.isFeatured ? "Yes" : "No"}
                      </td>

                      <td className="p-3 border">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-rose-200 mt-10">
          <h2 className="text-xl font-semibold mb-4 text-rose-600">
            Orders Management
          </h2>

          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders placed yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-rose-200 rounded-xl p-5 bg-rose-50"
                >
                  <div className="grid md:grid-cols-4 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-800 break-all">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-semibold text-gray-800">
                        {order.customer?.fullName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.phone || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-rose-600">
                        Rs {order.total}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="border border-rose-200 p-2 rounded-md bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-700">
                      {order.customer?.address}, {order.customer?.city}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 bg-white border border-rose-100 rounded-lg p-3"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-white rounded-md"
                        />

                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × Rs {item.price}
                          </p>
                        </div>

                        <p className="font-bold text-rose-600">
                          Rs {item.quantity * item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}