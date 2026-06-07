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
  "Gift Baskets",
  "Flower Bouquets",
  "Perfume Sets",
  "Makeup Hampers",
  "Chocolate Gifts",
  "Baby Gifts",
  "Accessories",
];


const initialProduct = {
  name: "",
  category: "Gift Baskets",

  price: "",
  stock: "",

  imageUrl: "",
  description: "",


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
  const [activeTab, setActiveTab] = useState("products");

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name || "",
      category: product.category || "Gift Baskets",
      price: product.price || "",
      stock: product.stock || "",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
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
      !productForm.imageUrl ||
      !productForm.description
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

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2 rounded-xl font-medium transition ${activeTab === "products"
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-600 border border-rose-200"
              }`}
          >
            Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-xl font-medium transition ${activeTab === "orders"
              ? "bg-rose-600 text-white"
              : "bg-white text-rose-600 border border-rose-200"
              }`}
          >
            Orders
          </button>
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

        {activeTab === "products" && (<>

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
                            className="w-20 h-20 object-contain bg-white p-1 rounded-md"
                          />
                        </td>

                        <td className="p-3 border">{product.name}</td>
                        <td className="p-3 border">{product.category}</td>
                        <td className="p-3 border">Rs {product.price}</td>
                        <td className="p-3 border">{product.stock}</td>
                        <td className="p-3 border">
                          {product.isAvailable ? "Yes" : "No"}
                        </td>
                        <td className="p-3 border">
                          {product.isFeatured ? "Yes" : "No"}
                        </td>

                        <td className="p-3 border">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>)}

        {activeTab === "orders" && (
          <>
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
                            Rs {Number(order.total || 0).toLocaleString()}
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

                      <div className="mb-4 grid sm:grid-cols-3 gap-3">
                        <div className="bg-white border border-rose-100 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="font-semibold text-gray-800">
                            Rs {Number(order.subtotal || 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="bg-white border border-rose-100 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Delivery Charges</p>
                          <p className="font-semibold text-gray-800">
                            Rs {Number(order.deliveryCharges || 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="bg-white border border-rose-100 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="font-semibold text-gray-800">
                            {order.paymentMethod || "Cash on Delivery"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items?.map((item, index) => {
                          const isPersonalized = item.type === "personalized";

                          return (
                            <div
                              key={`${item.productId}-${index}`}
                              className={`bg-white border rounded-lg p-3 ${isPersonalized
                                  ? "border-rose-300"
                                  : "border-rose-100"
                                }`}
                            >
                              <div className="flex items-start gap-4">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 object-contain bg-white rounded-md border border-rose-100"
                                />

                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                    <div>
                                      <p className="font-semibold text-gray-800">
                                        {item.name}
                                      </p>

                                      <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} × Rs{" "}
                                        {Number(item.price || 0).toLocaleString()}
                                      </p>

                                      <p className="text-xs text-gray-400 mt-1">
                                        {isPersonalized
                                          ? "Personalized Basket"
                                          : item.category}
                                      </p>
                                    </div>

                                    <p className="font-bold text-rose-600">
                                      Rs{" "}
                                      {(
                                        Number(item.quantity || 1) *
                                        Number(item.price || 0)
                                      ).toLocaleString()}
                                    </p>
                                  </div>

                                  {isPersonalized && (
                                    <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-4">
                                      <h4 className="font-semibold text-rose-700 mb-3">
                                        Personalized Basket Details
                                      </h4>

                                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <p className="text-xs text-gray-500">
                                            Selected Category
                                          </p>
                                          <p className="font-semibold text-gray-800">
                                            {item.selectedCategory || "N/A"}
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-xs text-gray-500">
                                            Packaging
                                          </p>
                                          <p className="font-semibold text-gray-800">
                                            {item.packagingChoice || "N/A"}
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-xs text-gray-500">
                                            Base Price
                                          </p>
                                          <p className="font-semibold text-gray-800">
                                            Rs{" "}
                                            {Number(
                                              item.basePrice || 0
                                            ).toLocaleString()}
                                          </p>
                                        </div>

                                        <div>
                                          <p className="text-xs text-gray-500">
                                            Add-ons Total
                                          </p>
                                          <p className="font-semibold text-gray-800">
                                            Rs{" "}
                                            {Number(
                                              item.addonTotal || 0
                                            ).toLocaleString()}
                                          </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                          <p className="text-xs text-gray-500">
                                            Base Item
                                          </p>
                                          <p className="font-semibold text-gray-800">
                                            {item.baseItem || "N/A"}
                                          </p>
                                        </div>
                                      </div>

                                      {item.selectedItems?.length > 0 && (
                                        <div className="mt-4">
                                          <p className="text-xs text-gray-500 mb-2">
                                            Selected Items
                                          </p>

                                          <div className="flex flex-wrap gap-2">
                                            {item.selectedItems.map(
                                              (selectedItem, idx) => {
                                                const isBaseItem =
                                                  String(selectedItem)
                                                    .trim()
                                                    .toLowerCase() ===
                                                  String(item.baseItem)
                                                    .trim()
                                                    .toLowerCase();

                                                return (
                                                  <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${isBaseItem
                                                        ? "bg-rose-100 text-rose-700 border-rose-300"
                                                        : "bg-white text-gray-700 border-gray-200"
                                                      }`}
                                                  >
                                                    {selectedItem}
                                                    {isBaseItem && " • Base"}
                                                  </span>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}


      </div>
    </div>
  );
}