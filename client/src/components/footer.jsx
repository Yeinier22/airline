import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-links">
        <a
          href="https://linkedin.com/in/yeinier-valdes-8a5390267"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={30} />
        </a>
        <a
          href="https://github.com/Yeinier22"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={30} />
        </a>
      </div>
      <p>"Passionate about creating impactful digital experiences."</p>
      <p>Contact: yeinierv@gmail.com</p>
      <a href="#top" className="back-to-top">
        Back to Top
      </a>
      <p>© 2025 Yeinier Valdes. Built with React.</p>
    </footer>
  );
};
export default Footer;
