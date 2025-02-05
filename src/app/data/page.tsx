"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Data.module.css"; // Asegúrate de que la ruta sea correcta

interface Entry {
  id: number;
  name: string;
  cedula: string;
  telefono: string;
  direccion: string;
  salario: number;
  userEmail: string;
}

const DataPage: React.FC = () => {
  const [heatmapStyle, setHeatmapStyle] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSignOut, setShowSignOut] = useState(false);
  const [color, setColor] = useState("#00563b");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({
    id: Date.now(),
    name: "",
    cedula: "",
    telefono: "",
    direccion: "",
    salario: 0,
    userEmail: "", 
  });
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

  useEffect(() => {
    if (session?.user?.email) {
      setNewEntry((prevEntry) => ({
        ...prevEntry,
        userEmail: session.user.email || "", 
      }));
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirigir a la página de inicio de sesión si no está autenticado
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/entries?userEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched entries:", data); // Log the fetched entries
          setEntries(data);
        })
        .catch((error) => console.error("Error fetching entries:", error));
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  const handleAddEntry = async () => {
  if (!newEntry.name || !newEntry.cedula || !newEntry.telefono || !newEntry.direccion || !newEntry.salario || !newEntry.userEmail) {
    console.error("Todos los campos son requeridos");
    return;
  }

  try {
    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newEntry.name,
        cedula: newEntry.cedula,
        telefono: newEntry.telefono,
        direccion: newEntry.direccion,
        salario: newEntry.salario,
        userEmail: newEntry.userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar la entrada");
    }

    const entry = await response.json();
    console.log("Added entry:", entry); // Log the added entry
    setEntries([...entries, entry]);
    setNewEntry({
      id: Date.now(),
      name: "",
      cedula: "",
      telefono: "",
      direccion: "",
      salario: 0,
      userEmail: session?.user?.email || "",
    });
    setIsFormVisible(false);
  } catch (error) {
    console.error(error);
  }
};
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.heatmap} style={heatmapStyle}></div>
        <div className={styles.navItems}>
          <Link href="/users">Users</Link>
          <Link href="/data">Data</Link>
          <div
            onMouseEnter={() => setShowSignOut(true)}
            onMouseLeave={() => setShowSignOut(false)}
            className={styles.profileLink}
          >
            <Link href="/profile">Profile</Link>
            {showSignOut && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={styles.signOutButton}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className={styles.mainContent}>
      <button onClick={() => setIsFormVisible(!isFormVisible)} className={styles.addButton}>
        {isFormVisible ? '-' : '+'}
      </button>
        {isFormVisible && (
          <div className={styles.newEntryForm}>
            <input
              type="text"
              name="name"
              value={newEntry.name}
              onChange={handleInputChange}
              placeholder="Nombre"
            />
            <input
              type="text"
              name="cedula"
              value={newEntry.cedula}
              onChange={handleInputChange}
              placeholder="Cédula"
            />
            <input
              type="text"
              name="telefono"
              value={newEntry.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono"
            />
            <input
              type="text"
              name="direccion"
              value={newEntry.direccion}
              onChange={handleInputChange}
              placeholder="Dirección"
            />
            <input
              type="number"
              name="salario"
              value={newEntry.salario}
              onChange={handleInputChange}
              placeholder="Salario"
            />
            <button onClick={handleAddEntry} className={styles.addButton1}>Add Data</button>
          </div>
        )}
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Salario</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.name}</td>
                <td>{entry.cedula}</td>
                <td>{entry.telefono}</td>
                <td>{entry.direccion}</td>
                <td>{entry.salario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default DataPage;
