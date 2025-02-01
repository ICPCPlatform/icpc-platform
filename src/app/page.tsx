import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>hello this is an icpc platform</h1>
        <h3> welcome guys</h3>
      </main>
    </div>
  );
}
