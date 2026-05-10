import { useMutation } from '@tanstack/react-query';
import { authService, type UpdateProfileDto } from '../services/auth.service';

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => authService.updateProfile(dto),
  });
}
