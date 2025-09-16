import style from "./OrderConfirm.module.css";

const OrderConfirm = ({ items, totalPrice, onReset }) => {
  return (
    <div className={style.mainContainer}>
      <div className={style.checkImg}>
        <img src="/images/icon-order-confirmed.svg" alt="check" />
      </div>
      <h1>Order Confirmed</h1>
      <p>We hope you enjoy your food!</p>
      <div className={style.menuContainer}>
        <div className={style.overflow}>
          {items.map((item) => (
            <div>
              <div key={item.id} className={style.justifyBetween}>
                <div className={style.justifySpace}>
                  <img className={style.img} src={item.img} alt="사진" />
                  <div className={style.alignSpace}>
                    <div className={style.detail}>{item.detail}</div>
                    <div className={style.flex}>
                      <div className={style.number}>x{item.number}</div>

                      <div className={style.price}>
                        <span>@</span> ${item.price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style.sum}>
                  ${(item.number * item.price).toFixed(2)}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div className={style.totalPrice}>
          <span>Order Total</span>${totalPrice.toFixed(2)}
        </div>
      </div>
      <div className={style.reset} onClick={onReset}>
        Start New Order
      </div>
    </div>
  );
};

export default OrderConfirm;
