import style from "./MyCart.module.css";

const MyCart = ({ id, detail, price, number, isDelete }) => {
  return (
    <div>
      <div className={style.myCartContainer}>
        <div className={style.product}>
          <div className={style.detailText}>{detail}</div>
          <div className={style.flex}>
            <div className={style.number}>{number}x</div>
            <div className={`${style.price} ${style.flex}`}>
              <span className={style.at}>@</span>${price}
            </div>
            <div className={style.sum}>${(number * price).toFixed(2)}</div>
          </div>
        </div>
        <div className={style.cancelBtn} onClick={() => (isDelete = true)}>
          <img src="/images/icon-remove-item.svg" alt="취소" />
        </div>
      </div>
      <hr></hr>
    </div>
  );
};

export default MyCart;
