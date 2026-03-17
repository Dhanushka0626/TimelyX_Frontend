import { Link } from "react-router-dom";

const Sidebar = ({ links }) => {
  return (
    <div style={styles.sidebar}>
      {links.map((item, index) => (
        <Link key={index} to={item.path} style={styles.link}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1e1e2f",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
};

export default Sidebar;