export interface ICambioPasswordPerfil {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;

  borrarCampos(): void
}
