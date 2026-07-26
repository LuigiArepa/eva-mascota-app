export const validarMascota = (pet) => {
  if (!pet || typeof pet !== "object") return false;

  const hasValidId =
    typeof pet.id === "number" ||
    (typeof pet.id === "string" && pet.id.trim() !== "");
  const hasValidNombre =
    typeof pet.nombre === "string" && pet.nombre.trim() !== "";

  return hasValidId && hasValidNombre;
};
