import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsNotEmpty({ message: 'O campo e-mail precisa ser preenchido.'})
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string;

  @IsNotEmpty({ message: 'O campo senha precisa ser preenchido.'})
  @IsString({ message: 'O campo senha deve ser um texto.' })
  password!: string;
}
