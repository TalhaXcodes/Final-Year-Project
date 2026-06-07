import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

const RecommendedBasket = () => {
    const { addToCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedTemplate = location.state?.selectedTemplate;
    const selectedCategory = location.state?.selectedCategory;
    const packagingChoice = location.state?.packagingChoice || "";

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (selectedTemplate?.includedItems) {
            setSelectedItems(selectedTemplate.includedItems);
        }
    }, [selectedTemplate]);

    const normalizeText = (text) => String(text || "").trim().toLowerCase();

    const getAddonName = (addon) => {
        if (typeof addon === "string") return addon;
        return addon?.name || "";
    };

    const getAddonPrice = (addon) => {
        if (typeof addon === "string") return 0;
        return Number(addon?.price || 0);
    };

    const handleItemToggle = (item, isChecked) => {
        if (isChecked) {
            setSelectedItems((prev) =>
                prev.includes(item) ? prev : [...prev, item]
            );
        } else {
            setSelectedItems((prev) =>
                prev.filter(
                    (selectedItem) =>
                        normalizeText(selectedItem) !== normalizeText(item)
                )
            );
        }
    };

    if (!selectedTemplate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
                <div className="bg-white border border-rose-200 rounded-2xl p-6 text-center shadow-md">
                    <h2 className="text-2xl font-bold text-rose-700 mb-3">
                        No Basket Found
                    </h2>

                    <p className="text-gray-600 mb-5">
                        Please go back and select a recommended category again.
                    </p>

                    <Link
                        to="/thank-you"
                        className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700 transition"
                    >
                        Back to Recommendations
                    </Link>
                </div>
            </div>
        );
    }

    const baseItem = selectedTemplate.baseItem;
    const availableAddons = selectedTemplate.availableAddons || [];

    const maxBasketItems = 10;
    const isBasketFull = selectedItems.length >= maxBasketItems;

    const stock = Number(selectedTemplate.stock || 0);
    const isInStock = selectedTemplate.isAvailable === true && stock > 0;

    const selectedAddonObjects = availableAddons.filter((addon) =>
        selectedItems.some(
            (item) => normalizeText(item) === normalizeText(getAddonName(addon))
        )
    );

    const addonTotal = selectedAddonObjects.reduce(
        (total, addon) => total + getAddonPrice(addon),
        0
    );

    const basePrice = Number(selectedTemplate.price || 0);
    const finalPrice = basePrice + addonTotal;

    const handleAddonToggle = (addon, isChecked) => {
        const addonName = getAddonName(addon);

        if (isChecked) {
            if (selectedItems.length >= maxBasketItems) {
                alert(`You can select maximum ${maxBasketItems} items in one basket.`);
                return;
            }

            setSelectedItems((prev) =>
                prev.some(
                    (item) => normalizeText(item) === normalizeText(addonName)
                )
                    ? prev
                    : [...prev, addonName]
            );
        } else {
            if (normalizeText(addonName) === normalizeText(baseItem)) return;

            setSelectedItems((prev) =>
                prev.filter(
                    (selectedItem) =>
                        normalizeText(selectedItem) !== normalizeText(addonName)
                )
            );
        }
    };

    const handleContinueWithBasket = () => {
        if (!isInStock) {
            alert("This recommended basket is currently out of stock.");
            return;
        }

        const customizedBasket = {
            id: `personalized-${selectedTemplate.id}`,
            name: selectedTemplate.name,
            category: `${selectedCategory} Personalized Basket`,
            selectedCategory,
            selectedItems,
            baseItem,
            packagingChoice,
            price: finalPrice,
            basePrice,
            addonTotal,
            stock: selectedTemplate.stock,
            imageUrl: selectedTemplate.imageUrl,
            type: "personalized",
        };

        addToCart(customizedBasket);
        navigate("/cart");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white px-4 py-10">
            <div className="max-w-3xl mx-auto bg-white border border-rose-300 rounded-3xl shadow-2xl p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-rose-700 text-center mb-2">
                    Your Recommended Basket
                </h1>

                <div className="text-center mb-6">
                    <p className="text-gray-500">
                        Selected Category:
                        <span className="font-semibold text-rose-600 ml-1">
                            {selectedCategory}
                        </span>
                    </p>

                    {packagingChoice && (
                        <p className="text-gray-500 mt-1">
                            Packaging:
                            <span className="font-semibold text-rose-600 ml-1">
                                {packagingChoice}
                            </span>
                        </p>
                    )}
                </div>

                {selectedTemplate.imageUrl && (
                    <div className="w-full h-80 rounded-2xl overflow-hidden border border-rose-100 bg-rose-50 mb-6">
                        <img
                            src={selectedTemplate.imageUrl}
                            alt={selectedTemplate.name}
                            className="w-full h-full object-contain p-3"
                        />
                    </div>
                )}

                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedTemplate.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {selectedTemplate.category} Based Basket
                            </p>

                            <p
                                className={`text-sm font-semibold mt-2 ${isInStock ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {isInStock
                                    ? `In Stock (${stock} available)`
                                    : "Out of Stock"}
                            </p>
                        </div>

                        <p className="text-xl font-bold text-rose-600">
                            Rs. {finalPrice.toLocaleString()}
                        </p>
                    </div>

                    {selectedTemplate.description && (
                        <p className="text-gray-700 mt-4 leading-relaxed">
                            {selectedTemplate.description}
                        </p>
                    )}
                    {selectedTemplate.recommendationReason && (
                        <div className="mt-4 bg-white border border-rose-100 rounded-xl p-4">
                            <h3 className="font-semibold text-rose-700 mb-2">
                                Why this fits you
                            </h3>

                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedTemplate.recommendationReason}
                            </p>
                        </div>
                    )}
                </div>

                {selectedTemplate.includedItems?.length > 0 && (
                    <div className="mt-6 bg-white border border-rose-200 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xl font-bold text-rose-700 mb-2">
                            Customize Your Basket
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                            The base item is locked because this basket was recommended for{" "}
                            <span className="font-semibold text-rose-600">
                                {selectedCategory}
                            </span>
                            . You can remove or keep the other add-on items.
                        </p>

                        <div className="space-y-3">
                            {selectedTemplate.includedItems.map((item, index) => {
                                const isBaseItem =
                                    normalizeText(item) === normalizeText(baseItem);

                                const isChecked =
                                    isBaseItem ||
                                    selectedItems.some(
                                        (selectedItem) =>
                                            normalizeText(selectedItem) === normalizeText(item)
                                    );

                                return (
                                    <label
                                        key={index}
                                        className={`flex items-center gap-3 rounded-xl border p-3 transition ${isBaseItem
                                                ? "bg-rose-100 border-rose-300"
                                                : "bg-rose-50 border-rose-100 hover:border-rose-300"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            disabled={isBaseItem}
                                            onChange={(e) =>
                                                handleItemToggle(item, e.target.checked)
                                            }
                                            className="w-4 h-4 accent-rose-600"
                                        />

                                        <div className="flex-1">
                                            <p className="text-gray-800 font-medium">
                                                {item}
                                                {isBaseItem && (
                                                    <span className="ml-2 text-xs font-semibold text-rose-600">
                                                        Base item locked
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        <div className="mt-5 bg-rose-50 border border-rose-100 rounded-xl p-4">
                            <h4 className="font-semibold text-rose-700 mb-2">
                                Final Selected Items
                            </h4>

                            <p className="text-xs text-gray-500 mb-3">
                                Selected {selectedItems.length}/{maxBasketItems} items.
                            </p>

                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {selectedItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {availableAddons.length > 0 && (
                            <div className="mt-5 bg-white border border-rose-200 rounded-xl p-4">
                                <h4 className="font-semibold text-rose-700 mb-2">
                                    Available Add-ons
                                </h4>

                                <p className="text-xs text-gray-500 mb-3">
                                    Select extra items to customize your basket. Maximum{" "}
                                    {maxBasketItems} items allowed.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {availableAddons.map((addon, index) => {
                                        const addonName = getAddonName(addon);
                                        const addonPrice = getAddonPrice(addon);

                                        const isBaseItem =
                                            normalizeText(addonName) === normalizeText(baseItem);

                                        const isChecked =
                                            isBaseItem ||
                                            selectedItems.some(
                                                (item) =>
                                                    normalizeText(item) === normalizeText(addonName)
                                            );

                                        return (
                                            <label
                                                key={index}
                                                className={`flex items-center gap-3 rounded-xl border p-3 transition ${isBaseItem
                                                        ? "bg-rose-100 border-rose-300"
                                                        : "bg-rose-50 border-rose-100 hover:border-rose-300"
                                                    } ${!isChecked && isBasketFull && !isBaseItem
                                                        ? "opacity-60 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    disabled={isBaseItem || (!isChecked && isBasketFull)}
                                                    onChange={(e) =>
                                                        handleAddonToggle(addon, e.target.checked)
                                                    }
                                                    className="w-4 h-4 accent-rose-600"
                                                />

                                                <span className="text-sm text-gray-700 flex-1">
                                                    {addonName}

                                                    {isBaseItem && (
                                                        <span className="ml-2 text-xs text-rose-600 font-semibold">
                                                            Base
                                                        </span>
                                                    )}

                                                    {!isBaseItem && addonPrice > 0 && (
                                                        <span className="block text-xs text-gray-500 mt-1">
                                                            + Rs. {addonPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-rose-700 mb-3">
                        Price Summary
                    </h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Base Basket Price</span>
                            <span>Rs. {basePrice.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-gray-600">
                            <span>Add-ons Total</span>
                            <span>Rs. {addonTotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-rose-700 border-t border-rose-200 pt-3 mt-3">
                            <span>Final Price</span>
                            <span>Rs. {finalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/thank-you"
                        className="inline-block border border-rose-300 text-rose-600 px-6 py-2 rounded-lg hover:bg-rose-50 text-center"
                    >
                        Back to Recommendations
                    </Link>

                    <button
                        type="button"
                        disabled={!isInStock}
                        onClick={handleContinueWithBasket}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${isInStock
                                ? "bg-rose-600 hover:bg-rose-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isInStock ? "Continue with Basket" : "Out of Stock"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecommendedBasket;