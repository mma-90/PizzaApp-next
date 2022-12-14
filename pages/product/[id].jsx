import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const Product = ({ pizzaData }) => {
  const pizza = JSON.parse(pizzaData);
  const [price, setPrice] = useState(pizza.prices[0]);
  const [quantity, setQuantity] = useState(1);
  const [extraTotalPrice, setExtraTotalPrice] = useState(0);
  const [extra, setExtra] = useState([]);

  const sizeTag = ["small", "medium", "large"];

  const dispatch = useDispatch();

  const handleSizePrice = (newPrice) => setPrice(newPrice);

  const handleExtra = (e) => {
    const name = e.target.id;
    const option = pizza.extraOptions.filter((o) => o.text === name)[0];

    if (e.target.checked) {
      setExtraTotalPrice((prev) => prev + option.price);
      setExtra([...new Set([option.text, ...extra])]);
    } else {
      setExtraTotalPrice((prev) => prev - option.price);
      setExtra([...extra.filter((o) => o !== option.text)]);
    }
  };

  const addToCartHandler = () =>
    dispatch(
      addProduct({
        id: pizza._id,
        title: pizza.title,
        price: extraTotalPrice + price, //size price + extra price
        quantity,
        img: pizza.img,
        extraOptions: extra,
      })
    );

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image
          src={`/${pizza.img}`}
          alt=""
          objectFit="cover"
          width="500"
          height="500"
          className={styles.img}
        />
      </div>

      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>{price + extraTotalPrice}</span>
        <p className={styles.desc}>{pizza.description}</p>

        <h2 className={styles.subtitle}>choose the size</h2>
        <div className={styles.sizes}>
          {pizza.prices.map((price, index) => {
            return (
              <div className={styles.size} key={index}>
                <input
                  type="radio"
                  name="size"
                  id={sizeTag[index]}
                  defaultChecked={!index}
                  onChange={() => handleSizePrice(price)}
                />

                <label htmlFor={sizeTag[index]}>
                  <Image
                    src="/img/size.png"
                    alt=""
                    objectFit="cover"
                    layout="fill"
                  />

                  <span className={styles.sizeTitle}>{sizeTag[index]}</span>
                </label>
              </div>
            );
          })}
        </div>

        <h2 className={styles.subtitle}>add additional ingrediants</h2>
        <div className={styles.ingrediants}>
          {pizza.extraOptions.map((option, index) => (
            <div className={styles.option} key={index}>
              <input
                type="checkbox"
                name={option.text}
                id={option.text}
                onChange={handleExtra}
              />
              <label htmlFor={option.text}>{option.text}</label>
            </div>
          ))}
        </div>

        <div className={styles.add}>
          <input
            type="number"
            defaultValue={quantity}
            min={1}
            className={styles.quantity}
            onChange={(e) => setQuantity(+e.target.value)}
          />
          <button className={styles.button} onClick={addToCartHandler}>
            add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await axios.get(`http://localhost:3000/api/product/${id}`);

  return {
    props: { pizzaData: JSON.stringify(res.data.product) },
  };
}
