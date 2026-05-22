import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../../services/firestore/productService";
import { Link } from "react-router-dom";

const categories = [
    "All",
    "Accessories",
    "Clothing",
    "Edible Stuff",
    "Bag / Wallet",
    "Makeup Products",
    "Perfume",
    "Shoes",
    "Toys",
];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return products;

        return products.filter(
            (product) => product.category === selectedCategory
        );
    }, [products, selectedCategory]);

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <p className="text-rose-600 font-medium">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 px-4 sm:px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-rose-700">
                        Shop Gifts 🎁
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Browse beautiful gift products from our catalogue.
                    </p>
                </div>

                {error && (
                    <div className="bg-white border border-rose-300 rounded-xl p-4 text-center mb-8">
                        <p className="text-rose-600">{error}</p>
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full border transition ${selectedCategory === category
                                ? "bg-rose-600 text-white border-rose-600"
                                : "bg-white text-rose-600 border-rose-300 hover:bg-rose-100"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-rose-300 rounded-xl p-10 text-center">
                        <h2 className="text-xl font-semibold text-rose-700 mb-2">
                            No products found
                        </h2>
                        <p className="text-gray-600">
                            Products for this category are not available yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white border border-rose-300 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-56 object-contain bg-white p-2"
                                    />

                                    {product.isFeatured && (
                                        <span className="absolute top-3 right-3 bg-white text-rose-600 text-xs font-semibold px-3 py-1 rounded-full shadow">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {product.category}
                                            </p>
                                        </div>

                                        <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
                                            {product.gender}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="mt-4">
                                        <p className="text-rose-600 font-bold text-lg">
                                            Rs {product.price}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Stock: {product.stock}
                                        </p>
                                    </div>

                                    {Array.isArray(product.tags) && product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {product.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        to={`/shop/${product.id}`}
                                        className="block text-center w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition mt-5"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;