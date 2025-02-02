"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Main.module.css"; // Asegúrate de que la ruta sea correcta

export default function Main() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [heatmapStyle, setHeatmapStyle] = useState({});
  const [color, setColor] = useState("#00563b");

  const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"]; // Colores del arcoíris

  useEffect(() => {
    const interval = setInterval(() => {
      setColor((prevColor) => {
        const currentIndex = colors.indexOf(prevColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setHeatmapStyle({
      background: `radial-gradient(circle at ${clientX}px ${clientY}px, ${color}, transparent 3%)`,
    });
  };

  const handleMouseLeave = () => {
    setHeatmapStyle({
      background: 'none',
    });
  };

  useEffect(() => {
    const navbar = document.querySelector(`.${styles.navbar}`);
    if (navbar) {
      navbar.addEventListener("mousemove", handleMouseMove);
      navbar.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        navbar.removeEventListener("mousemove", handleMouseMove);
        navbar.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [color]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirigir a la página de inicio de sesión si no está autenticado
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.heatmap} style={heatmapStyle}></div>
        <div className={styles.navItems}>
          <Link href="/users">Users</Link>
          <Link href="/data">Data</Link>
          <Link href="/profile">Profile</Link>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <span className={styles.rainbow}>RAINBOW</span> <span className={styles.data}>DATA</span>
        <p>Welcome, {session.user.email}</p>
        <p>Your user ID is: {session.user.id}</p>
        <button onClick={() => signOut({ callbackUrl: "/" })} className={styles.button}>Sign Out</button>
      </main>
    </div>
  );
}