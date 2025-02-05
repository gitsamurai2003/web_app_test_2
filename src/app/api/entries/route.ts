// app/api/entries/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obtener todas las entradas de un usuario específico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail'); // Obtener el email del usuario desde la query

    if (!userEmail) {
      return NextResponse.json(
        { error: 'El parámetro userEmail es requerido' },
        { status: 400 }
      );
    }

    // Buscar las entradas asociadas al email del usuario
    const entries = await prisma.entry.findMany({
      where: {
        userEmail: userEmail,
      },
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Error al obtener las entradas', details: error },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva entrada
export async function POST(request: Request) {
  try {
    const { name, cedula, telefono, direccion, salario, userEmail } = await request.json();

    // Validar que todos los campos requeridos estén presentes
    if (!name || !cedula || !telefono || !direccion || !salario || !userEmail) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'El usuario no existe' },
        { status: 404 }
      );
    }

    // Crear la nueva entrada en la base de datos
    const newEntry = await prisma.entry.create({
      data: {
        name,
        cedula,
        telefono,
        direccion,
        salario: parseFloat(salario), // Convertir salario a número
        userEmail,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Error al crear la entrada', details: error },
      { status: 500 }
    );
  }
}