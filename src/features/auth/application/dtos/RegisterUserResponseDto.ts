export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  token: string;
}

export interface RegisterUserResponseDto {
  status: string;
  data: UserDto;
}
