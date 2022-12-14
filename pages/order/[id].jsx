import styles from "../../styles/Order.module.css";
import Image from "next/image";
import axios from "axios";
import Table from "../../components/Table";

const Order = ({ order, error }) => {
  if (error) {
    return <p className="error">{error}</p>;
  }

  let status = order.status;
  const fn = () => {
    //0-> prepartion 1-> shiping 2-> deliverd
    //statusClass: 0(done) 1(inprogress) 2(undone)
  };

  const statusClass = (index) => {
    if (index < 1) return styles.done;
    else if (index === 1) return styles.inProgress;
    if (index > 1) return styles.undone;
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.row}>
          <Table data={order} type="order" />
        </div>

        <div className={styles.row}>
          <div className={statusClass(0)}>
            <Image src="/img/paid.png" alt="" width={60} height={60} />
            <span className={styles.stateTitle}>payment</span>

            <div className={styles.checkedIcon}>
              <Image src="/img/checked.png" alt="" width={30} height={30} />
            </div>
          </div>

          <div className={statusClass(status > 0 ? 0 : 1)}>
            <Image src="/img/bake.png" alt="" width={60} height={60} />
            <span className={styles.stateTitle}>prepartion</span>

            <div className={styles.checkedIcon}>
              <Image src="/img/checked.png" alt="" width={30} height={30} />
            </div>
          </div>

          <div className={statusClass(2 - status)}>
            <Image src="/img/bike.png" alt="" width={60} height={60} />
            <span className={styles.stateTitle}>shipping</span>

            <div className={styles.checkedIcon}>
              <Image src="/img/checked.png" alt="" width={30} height={30} />
            </div>
          </div>

          <div className={statusClass(status == 2 ? 0 : 2)}>
            <Image src="/img/delivered.png" alt="" width={60} height={60} />
            <span className={styles.stateTitle}>delivered</span>

            <div className={styles.checkedIcon}>
              <Image src="/img/checked.png" alt="" width={30} height={30} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>cart total</h2>
          <div className={styles.text}>
            <b className={styles.title}>subtotal:</b>${order.total}
          </div>

          <div className={styles.text}>
            <b className={styles.title}>discount:</b>$0.00
          </div>

          <div className={styles.text}>
            <b className={styles.title}>total:</b>${order.total}
          </div>
          <button
            className={styles.btn}
            style={{ cursor: "not-allowed", color: "white" }}
            disabled
          >
            paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await axios.get(`http://localhost:3000/api/order/${id}`);

    return {
      props: { order: res.data.order, error: "" },
    };
  } catch (err) {
    return {
      props: {
        pizza: [],
        error: "Invalid order!",
      },
    };
  }
}
