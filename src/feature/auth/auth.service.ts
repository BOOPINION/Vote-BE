import { Injectable } from "@nestjs/common";
import { SignupRequestDto } from "./dto/signupRequest.dto";
import { SignupResponseDto } from "./dto/signupResponse.dto";

@Injectable()
export class AuthService {
  signUp(signupRequestDto: SignupRequestDto): Promise<SignupResponseDto> {
    throw new Error("Method not implemented.");
  }
}
