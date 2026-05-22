import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Favourites = () => {
  const { favorites, removeFromFavorites, addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-rose-50 px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white border border-rose-200 rounded-xl shadow p-10 text-center">
          <h1 className="text-3xl font-bold text-rose-700 mb-3">
            No Favourites Yet
          </h1>
          <p className="text-gray-600 mb-6">
            Products you add to favourites will appear here.
          </p>

          <Link
            to="/shop"
            className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-rose-700 mb-8">
          My Favourites
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-rose-300 rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-56 object-contain bg-white p-2"
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">{product.category}</p>

                <p className="text-rose-600 font-bold text-lg mt-3">
                  Rs {product.price}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="flex-1 border border-red-400 text-red-500 py-2 rounded-md hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <Link
                  to={`/shop/${product.id}`}
                  className="block text-center mt-3 text-sm text-rose-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favourites;