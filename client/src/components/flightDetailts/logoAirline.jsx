import { getImages } from "../../utils/getImages";
import styles from "./logoAirline.module.css";

export default function LogoAirline({ itiner }) {
  return (
      <img
        src={getImages(itiner)}
        alt="logo"
        className={styles.logo}
      />

  );
}
