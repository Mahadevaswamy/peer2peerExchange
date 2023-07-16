import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
export default function InstructionsComponent() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>
          <span>Encode P2P Group 2</span>
        </h1>
        <p>Welcome to P2P crypto swap</p>
      </header>
    </div>
  );
}
