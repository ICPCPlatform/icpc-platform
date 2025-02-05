import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}> Hello to our ICPC community </h1>
        <h2 className={styles.description}>
          Sorry for the inconvenience, we are working on the website we would
          like to hear from you, please contact us at
          <a href="mailto:icpcplatform@gmail.com"> icpcplatform@gmail.com </a>
        </h2>
        <hr />
        
        <h3 className={styles.title}>
          {" "}
          For now you can be a good person {"😊"} by just signing in and showing you
          commitment to the community
        </h3>
        <div className={styles.grid}>
          <a href="/login" className={styles.card}>
            <h2>Login &rarr;</h2>
            <p>Enter your credentials to access the platform</p>
          </a>

          <a href="/register" className={styles.card}>
            <h2>Register &rarr;</h2>
            <p>Register to access the platform</p>
          </a>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
