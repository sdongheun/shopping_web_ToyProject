import { useEffect, useState } from "react";
import "./App.css";
import MenuList from "./components/MenuList";
import MyCart from "./components/MyCart";
import OrderConfirm from "./components/OrderConfirm";

function App() {
  const [data, setData] = useState(null);
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
  };

  const handleDelete = async (id) => {
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
  if (!data) {
    // 네트워크가 느릴 시
    return <div>로딩 중...</div>;
  }

  const totalPrice = data.products
    .filter((p) => p.number > 0 && p.delete === false)
    .reduce((total, p) => {
      return total + Number(p.price) * Number(p.number);
    }, 0);

  return (
    <div className="container">
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
              if (totalPrice === 0) {
                return console.log("fail");
              } else {
                return console.log("dd");
              }
            }}
          >
            Confirm Order
          </div>
        </div>
      </div>
      {data.products
        .filter((p) => p.number > 0 && p.delete === false)
        .map((p) => (
          <OrderConfirm
            id={p.id}
            key={p.id}
            img={p.img}
            detail={p.detail}
            price={p.price}
            number={p.number}
            totalPrice={totalPrice}
          />
        ))}
    </div>
  );
}

export default App;
