import { useEffect, useState } from "react";
import "./App.css";
import MenuList from "./components/MenuList";
import MyCart from "./components/MyCart";
import OrderConfirm from "./components/OrderConfirm";

function App() {
  const [data, setData] = useState(null);
  const [showConfirmed, setShowConfirmed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        const data = await response.json();
        console.log(data);

        setData({ products: data });
      } catch (error) {
        console.log("에러", error);
      }
    };
    fetchProduct();
  }, []);

  const onChangeNumber = async (id, newNumber) => {
    // 수량 조절 토글
    // 1. 수량이 0 미만으로 내려가지 않도록 방지
    if (newNumber < 1) return;

    // 2. React의 상태를 먼저 업데이트하여 UI에 즉시 반영 (Optimistic Update)
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, number: newNumber, delete: false } : p
      ),
    }));

    // 3. fetch를 사용하여 서버에 PATCH 요청 보내기
    // persist to json-server
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: newNumber, delete: false }),
      });
      if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
      const updated = await res.json();
      setData((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    // 삭제 버튼
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        return p.id === id ? { ...p, delete: true, number: 0 } : p;
      }),
    }));
    try {
      await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH", // 또는 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delete: true, number: 0 }), // 변경할 데이터만 전송
      });
    } catch (error) {
      console.error("데이터 업데이트에 실패했습니다:", error);
      // 여기서 원래 상태로 되돌리는 등의 에러 처리 로직을 추가할 수 있습니다.
    }
  };

  const resetOrder = async () => {
    // reset
    const prev = data.products;

    // 1) Optimistic: clear locally
    const cleared = prev.map((p) => ({ ...p, number: 0, delete: false }));
    setData({ products: cleared });

    // 2) Persist only items that actually need changes
    try {
      const targets = prev.filter((p) => p.number !== 0 || p.delete === true);
      await Promise.all(
        targets.map((p) =>
          fetch(`http://localhost:3001/products/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ number: 0, delete: false }),
          })
        )
      );
    } catch (e) {
      console.error("reset failed", e);
      // rollback on failure
      setData({ products: prev });
    } finally {
      setShowConfirmed(false);
    }
  };
  if (!data) {
    // 네트워크가 느릴 시
    return <div>로딩 중...</div>;
  }

  const cartItems = data.products.filter(
    (p) => p.number > 0 && p.delete === false
  );

  const totalPrice = data.products
    .filter((p) => p.number > 0 && p.delete === false)
    .reduce((total, p) => {
      return total + Number(p.price) * Number(p.number);
    }, 0);

  return (
    <div className="container">
      {showConfirmed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 5,
          }}
        ></div>
      )}
      <div className="desserts-container">
        <h1>Desserts</h1>
        <div className="menu-list">
          {data.products.map((p) => (
            <MenuList
              key={p.id}
              id={p.id}
              img={p.img}
              name={p.name}
              detail={p.detail}
              price={p.price}
              number={p.number}
              onChangeNumber={onChangeNumber}
            />
          ))}
        </div>
      </div>
      <div className="cart-container">
        <div className="cart-title">
          Your Cart (
          {data.products.reduce((sum, p) => {
            return sum + p.number;
          }, 0)}
          )
        </div>
        {data.products
          .filter((p) => p.number > 0 && p.delete === false)
          .map((p) => (
            <MyCart
              id={p.id}
              key={p.id}
              detail={p.detail}
              price={p.price}
              number={p.number}
              isDelete={p.delete}
              onDelete={handleDelete}
            />
          ))}
        <div>
          <div className="orderTotal">
            <div>Order Total</div>
            <div className="totalPrice">${totalPrice}</div>
          </div>
          <div className="deliveryBox">
            <img
              className="treeImg"
              src="/images/icon-carbon-neutral.svg"
              alt="tree"
            />
            <div>This is carbon-neutral delivery</div>
          </div>
          <div
            className="button"
            onClick={() => {
              setShowConfirmed(true);
            }}
          >
            Confirm Order
          </div>
        </div>
        <div>
          {showConfirmed && (
            <OrderConfirm
              items={cartItems}
              totalPrice={totalPrice}
              onReset={resetOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
