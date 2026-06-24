const { ZodError } = require("zod");
const { AppError } = require("../../shared/errors/AppError");
const clientesRepository = require("./clientes.repository");
const {
  createClienteSchema,
  updateClienteSchema,
} = require("./clientes.schema");

async function listarClientes(search = "") {
  return clientesRepository.findAll(search);
}

async function crearCliente(payload) {
  try {
    const parsed = createClienteSchema.parse(payload);
    const existing = await clientesRepository.findByDni(parsed.dni);
    if (existing) throw new AppError("Ya existe un cliente con ese DNI", 409);
    return clientesRepository.create(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de cliente inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function actualizarCliente(id, payload) {
  try {
    const parsed = updateClienteSchema.parse(payload);
    const client = await clientesRepository.findById(id);
    if (!client) throw new AppError("Cliente no encontrado", 404);
    const conflict = await clientesRepository.findByDni(parsed.dni, id);
    if (conflict) throw new AppError("Ya existe otro cliente con ese DNI", 409);
    return clientesRepository.update(id, parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        "Payload de actualización inválido",
        400,
        error.flatten(),
      );
    }
    throw error;
  }
}

async function eliminarCliente(id) {
  const client = await clientesRepository.findById(id);
  if (!client) throw new AppError("Cliente no encontrado", 404);
  return clientesRepository.remove(id);
}

module.exports = {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
