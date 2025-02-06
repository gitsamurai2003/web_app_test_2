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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mensajes de error
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
      router.push("/"); 
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/entries?userEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched entries:", data); 
          setEntries(data);
        })
        .catch((error) => console.error("Error fetching entries:", error));
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  const validateName = (name: string) => {
    if (name.trim().length < 2 || name.trim().length > 50) {
      return "El nombre debe tener entre 2 y 50 caracteres.";
    }
  
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(name)) {
      return "El nombre solo puede contener letras y espacios.";
    }
  
    return null;
  };
  const validateCedula = (cedula: string) => {
    const regex = /^[0-9]{1,9}$/;
    return regex.test(cedula);
  };

  const validateTelefono = (telefono: string) => {
    const regex = /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return regex.test(telefono);
  };
  
  const validateAddress = (direccion: string) => {
    if (direccion.trim().length < 10 || direccion.trim().length > 100) {
      return "La dirección debe tener entre 10 y 100 caracteres.";
    }
  
    const regex = /^[a-zA-Z0-9\s,.-áéíóúÁÉÍÓÚñÑ]+$/;
    if (!regex.test(direccion)) {
      return "La dirección solo puede contener letras, números, espacios y los caracteres , . -";
    }
  
    return null;
  };
  const validateSalario = (salario: number) => {
    if (!salario) {
      return "El salario es un campo requerido.";
    }
  
    if (salario <= 0) {
      return "El salario debe ser un número positivo.";
    }
  
    const salarioMinimo = 50; 
    const salarioMaximo = 1000000; 
  
    if (salario < salarioMinimo || salario > salarioMaximo) {
      return `El salario debe estar entre ${salarioMinimo} y ${salarioMaximo}.`;
    }
  
    return null;
  };
  const handleAddEntry = async () => {
    setErrorMessage(null); // Reinicia el mensaje de error al intentar agregar una nueva entrada

    if (!newEntry.name || !newEntry.cedula || !newEntry.telefono || !newEntry.direccion || !newEntry.salario || !newEntry.userEmail) {
      setErrorMessage("Todos los campos son requeridos");
      return;
    }

    const nameError = validateName(newEntry.name);

    if (nameError) {
      setErrorMessage(nameError);
      return;
    }
    if (!validateCedula(newEntry.cedula)) {
      setErrorMessage("La cédula debe ser numérica y tener un máximo de 9 dígitos");
      return;
    }
    if(!validateTelefono(newEntry.telefono)) {
      setErrorMessage("El teléfono debe ser numérico, tener un formato válido e incluir prefijo por pais");
      return;
    }
    const addressError = validateAddress(newEntry.direccion);
    if (addressError) {
      setErrorMessage(addressError);
      return;
    }
    const salarioError = validateSalario(newEntry.salario);
    if (salarioError) {
      setErrorMessage(salarioError);
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

  const sortedEntries = [...entries].sort((a, b) => b.salario - a.salario);

  const calcularPromedio = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.salario, 0);
    return total / entries.length;
  };

  const calcularMediana = () => {
    if (entries.length === 0) return 0;
    const salariosOrdenados = entries.map((entry) => entry.salario).sort((a, b) => a - b);
    const mitad = Math.floor(salariosOrdenados.length / 2);
    if (salariosOrdenados.length % 2 === 0) {
      return (salariosOrdenados[mitad - 1] + salariosOrdenados[mitad]) / 2;
    } else {
      return salariosOrdenados[mitad];
    }
  };

  const promedio = calcularPromedio();
  const mediana = calcularMediana();

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.heatmap} style={heatmapStyle}></div>
        <div className={styles.navItems}>
          <Link href="/users">Users</Link>
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
        <button onClick={() => setIsFormVisible(!isFormVisible)} className={styles.addButton}>
          {isFormVisible ? '-' : '+'}
        </button>
        {isFormVisible && (
          <div className={styles.newEntryForm}>
            <input type="text" name="name" value={newEntry.name} onChange={handleInputChange} placeholder="Nombre" />
            <input type="text" name="cedula" value={newEntry.cedula} onChange={handleInputChange} placeholder="Cédula" />
            <input type="text" name="telefono" value={newEntry.telefono} onChange={handleInputChange} placeholder="Teléfono" />
            <input type="text" name="direccion" value={newEntry.direccion} onChange={handleInputChange} placeholder="Dirección" />
            <input type="number" name="salario" value={newEntry.salario} onChange={handleInputChange} placeholder="Salario" />
            <button onClick={handleAddEntry} className={styles.addButton1}>Agregar</button>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          </div>
        )}
        <h2 className={styles.title}>Informacion de usuarios</h2>
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
                <td>{entry.salario}$</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className={styles.title}>Mejores Salarios</h2>
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
            {sortedEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.name}</td>
                <td>{entry.cedula}</td>
                <td>{entry.telefono}</td>
                <td>{entry.direccion}</td>
                <td>{entry.salario}$</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sección para mostrar la mediana y el promedio */}
        <div className={styles.statsSection}>
          <div className={styles.statBox}>
            <h3 className={styles.title}>Mediana de Salarios:</h3><p className={styles.dataTable}>&#8594; {mediana.toFixed(2)}$</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.title}>Promedio de Salarios:</h3><p className={styles.dataTable}>&#8594; {promedio.toFixed(2)}$</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataPage;