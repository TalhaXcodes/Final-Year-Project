import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";

const Catalogue = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const trendingQ = query(
        collection(db, "catalogue"),
        orderBy("trendingScore", "desc"),
        limit(6)
      );

      const popularQ = query(
        collection(db, "catalogue"),
        orderBy("purchasedCount", "desc"),
        limit(6)
      );

      const likedQ = query(
        collection(db, "catalogue"),
        orderBy("likes", "desc"),
        limit(6)
      );

      const tSnap = await getDocs(trendingQ);
      const pSnap = await getDocs(popularQ);
      const lSnap = await getDocs(likedQ);

      setTrending(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPopular(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLiked(lSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchData();
  }, []);

  const GiftGrid = ({ title, data }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-rose-600 mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map(gift => (
          <div
            key={gift.id}
            className="bg-white border border-rose-300 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={gift.imageUrl}
              alt={gift.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {gift.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                {gift.category}
              </p>

              <p className="text-rose-600 font-bold mb-3">
                Rs {gift.price}
              </p>

              <button
                className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-rose-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-rose-700 mb-10">
        Gift Catalogue 🎁
      </h1>

      <GiftGrid title="🔥 Trending Gifts" data={trending} />
      <GiftGrid title="⭐ Popular with Customers" data={popular} />
      <GiftGrid title="❤️ Most Liked Gifts" data={liked} />
    </div>
  );
};

export default Catalogue;
