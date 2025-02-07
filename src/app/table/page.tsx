"use client";

import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Table.module.css"; // Asegúrate de que la ruta sea correcta


interface Entry {
  id: number;
  name: string;
  cedula: string;
  telefono: string;
  direccion: string;
  salario: number;
  userEmail: string;
}

// Función para agregar el signo de dólar a los salarios
function formatEntries(entries: Entry[]): Entry[] {
  return entries.map((entry) => ({
    ...entry,
    salario: `${entry.salario}$`,
  }));
}

export default function DemoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [heatmapStyle, setHeatmapStyle] = useState({});
  const [showSignOut, setShowSignOut] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [color, setColor] = useState("#00563b");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mensajes de error

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); 
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/entries?userEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched entries:", data);
          const formattedEntries = formatEntries(data);
          setEntries(formattedEntries);
        })
        .catch((error) => console.error("Error fetching entries:", error));
    }
  }, [session]);

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

  const [isFormVisible, setIsFormVisible] = useState(false);
  const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#8b00ff"];

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

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.heatmap} style={heatmapStyle}></div>
        <div className={styles.navItems}>
        <Link href="/table">Shadcn Table</Link>
          <Link href="/data">Data</Link>
          <div onMouseEnter={() => setShowSignOut(true)} onMouseLeave={() => setShowSignOut(false)} className={styles.profileLink}>
            <Link href="/profile">Profile</Link>
            {showSignOut && (
              <button onClick={() => signOut({ callbackUrl: "/" })} className={styles.signOutButton}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
            <main className={styles.mainContent}>
        <div className={styles.titleContainer}>
            <h1 className={styles.title}>Shadcn Table</h1>
        </div>
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={entries} />
        </div>
        </main>
    </div>
  );
}