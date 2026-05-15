import { IsInt, IsString } from 'class-validator';
export class CreateCommentsDto {
    @IsInt()
    user_id!:  number;

    @IsInt()
    store_rating_id!:  number;

    @IsInt()
    product_rating_id!:  number;
    
    @IsString()
    content!:  string;
}

  //@IsEmail()
  //email!: string;

  //@IsString()
  //@MinLength(4)
  //@MaxLength(20)
  //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //  message: 'password too weak',
  //})
  //password!: string;

 // @IsString()
  //name!: string;

  //@IsOptional()
  //@IsString()
  //username?: string;

  //@IsOptional()
  //@IsString()
//  profile_picture_url?: string;


 // id                  Int @id @default(autoincrement())
  //user_id             Int
  //user                Users @relation(fields: [user_id], references: [id])
  //store_rating_id     Int
  //store_rating        StoreRatings @relation(fields: [store_rating_id], references: [id])
  //product_rating_id   Int
  //product_rating      ProductRatings @relation(fields: [product_rating_id], references: [id])
  //content             String 
  //createdAt           DateTime @default(now())
 // updatedAt           DateTime @updatedAt
