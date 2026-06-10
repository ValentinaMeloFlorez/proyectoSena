import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { fetchUser, createUser, updateUser } from "@/services/userService";
import { fetchRoles } from "@/services/roleService";
import type { UserFormData } from "@/types/user";

const emptyForm: UserFormData = {
  firstName: "",
  lastName: "",
  document: "",
  email: "",
  password: "",
  roleId: "",
};

export function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [error, setError] = useState("");

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        document: user.document,
        email: user.email,
        password: "",
        roleId: user.roleId,
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data: UserFormData) =>
      isEdit ? updateUser(id!, data) : createUser(data),
    onSuccess: () => navigate("/users"),
    onError: (err: Error) => setError(err.message),
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEdit && !form.password) {
      setError("La contraseña es requerida");
      return;
    }

    const payload = { ...form };
    if (isEdit && !payload.password) {
      delete payload.password;
    }

    mutation.mutate(payload);
  };

  if (isEdit && loadingUser) {
    return <div className="p-6 text-slate-500">Cargando usuario...</div>;
  }

  return (
    <>
      <Header
        title={isEdit ? "Editar usuario" : "Nuevo usuario"}
        subtitle={isEdit ? `Modificando ${user?.fullName}` : "Registrar nueva cuenta"}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              name="firstName"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
            <Input
              label="Apellido"
              name="lastName"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </div>

          <Input
            label="Documento"
            name="document"
            value={form.document}
            onChange={(e) => handleChange("document", e.target.value)}
            required
            placeholder="CC o NIT"
          />

          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <Input
            label={isEdit ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required={!isEdit}
            placeholder="Mín. 8 caracteres, mayúscula, número y especial"
          />

          <Select
            label="Rol"
            name="roleId"
            value={form.roleId}
            onChange={(e) => handleChange("roleId", e.target.value)}
            required
            disabled={loadingRoles}
            placeholder="Seleccionar rol..."
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
          />

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/users")}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEdit ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
