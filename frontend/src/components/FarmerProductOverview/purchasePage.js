import { useEffect, useState } from "react";
import PurchaseItem from "./purchaseItem";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDate, loadCart } from "../../utils/cartFunction";

export default function PurchasePage() {
  const [cart, setCart] = useState(loadCart());
  const [packingDate, setPackingDate] = useState(formatDate(new Date()));
  const [deliveringDate, setDeliveringDate] = useState(
    formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
  );
  const [total, setTotal] = useState(0);

  const daysBetween = Math.max(
    (new Date(deliveringDate) - new Date(packingDate)) / (1000 * 60 * 60 * 24),
    1
  );

  function reloadCart() {
    const newCart = loadCart();
    setCart(newCart);
    calculateTotal(newCart);
  }

  function calculateTotal(currentCart = cart) {
    const cartInfo = {
      ...currentCart,
      packingDate,
      deliveringDate,
      days: daysBetween,
    };

    axios
      .post(`http://localhost:3000/api/purchase/quote`, cartInfo)
      .then((res) => {
        console.log(res.data);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packingDate, deliveringDate]);

  function handlePurchaseCreation() {
    const currentCart = loadCart();
    const cartInfo = {
      ...currentCart,
      packingDate,
      deliveringDate,
      days: daysBetween,
    };
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:3000/api/purchase`, cartInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("purchaseCart");
        toast.success("Purchase Created");
        setCart(loadCart());
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create purchase");
      });
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-2xl font-bold text-accent">Create Purchase</h1>

      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <label className="flex flex-col">
          <span className="text-accent font-semibold">Packing Date:</span>
          <input
            type="date"
            value={packingDate}
            onChange={(e) => setPackingDate(e.target.value)}
            className="border border-secondary rounded-md p-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-accent font-semibold">Delivering Date:</span>
          <input
            type="date"
            value={deliveringDate}
            onChange={(e) => setDeliveringDate(e.target.value)}
            className="border border-secondary rounded-md p-2"
          />
        </label>

        <p className="text-accent font-medium">Total Days: {daysBetween}</p>
      </div>

      <div className="w-full flex flex-col items-center mt-4">
        {Array.isArray(cart?.purchasedItems) &&
          cart.purchasedItems.map((item) => (
            <PurchaseItem
              itemKey={item.key}
              key={item.key}
              qty={item.qty}
              refresh={reloadCart}
            />
          ))}
      </div>

      <div className="w-full flex justify-center mt-4">
        <p className="text-accent font-semibold">Total: {total.toFixed(2)}</p>
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          className="bg-accent text-white px-4 py-2 rounded-md"
          onClick={handlePurchaseCreation}
        >
          Create Purchase
        </button>
      </div>
    </div>
  );
}
