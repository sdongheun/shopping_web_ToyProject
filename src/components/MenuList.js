import style from "./MenuList.module.css";

const MenuList = ({ id, img, name, detail, price, number, onChangeNumber }) => {
  return (
    <div className={style.menuContainer}>
      <div className={style.menu}>
        <div className={style.imgContainer}>
          <img src={img} alt="사진1" />
          <div className={style.addHover}>
            <div className={style.addToCart}>
              <img
                className={style.cartImg}
                src="./images/icon-add-to-cart.svg"
                alt="카트"
              />
              <div className={style.text}>Add To Cart</div>
            </div>
            <div className={style.plusMinus}>
              <span
                className={style.downBtn}
                onClick={() => onChangeNumber(id, number - 1)}
              >
                <img src="/images/icon-decrement-quantity.svg" alt="마이너스" />
              </span>
              <div>{number}</div>
              <span
                className={style.upBtn}
                onClick={() => onChangeNumber(id, number + 1)}
              >
                <img src="/images/icon-increment-quantity.svg" alt="플러스" />
              </span>
            </div>
          </div>
        </div>
        <div className={style.menuName}>{name}</div>
        <div className={style.menuDetail}>{detail}</div>
        <div className={style.price}>${price}</div>
      </div>
    </div>
  );
};

export default MenuList;
