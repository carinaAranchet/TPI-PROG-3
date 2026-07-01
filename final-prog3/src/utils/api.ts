export async function getData<T>(archivo: string): Promise<T[]> {
  const response = await fetch(`/data/${archivo}`);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${archivo}`);
  }

  return await response.json();
}