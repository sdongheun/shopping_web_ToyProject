import style from "./OrderConfirm.module.css";

const OrderConfirm = ({ id, img, detail, number, price, totalPrice }) => {
  return (
    <div className={style.mainContainer}>
      <div className={style.checkImg}>
        <img src="/images/icon-order-confirmed.svg" alt="check" />
      </div>
      <h1>Order Confirmed</h1>
      <p>We hope you enjoy your food!</p>
      <div className={style.menuContainer}>
        <img className={style.img} src={img} alt="사진" />
        <div className={style.detail}>{detail}</div>
        <div className={style.number}>{number}</div>
        <div className={style.price}>{price}</div>
        <div className={style.totalPrice}>{totalPrice}</div>
      </div>
    </div>
  );
};

export default OrderConfirm;
