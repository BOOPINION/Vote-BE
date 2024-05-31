import { Module } from "@nestjs/common";
import { QuestionController } from "@/feature/votes/vote/question/question.controller";
import { QuestionService } from "@/feature/votes/vote/question/question.service";

@Module({
    imports: [],
    controllers: [ QuestionController ],
    providers: [ QuestionService ]
})
export class QuestionModule {}
