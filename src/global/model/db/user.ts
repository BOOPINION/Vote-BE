import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Relation
} from "typeorm";
import { Survey, SurveyAnswer } from "./survey";
import { SurveyComment, SurveyLike } from "./survey-social";

@Entity("USER")
export class User {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
        id: number;

    @Column({ name: "NAME", type: "varchar", length: 255, nullable: false })
        name: string;

    @Column({ name: "EMAIL", type: "varchar", length: 255, nullable: false })
        email: string;

    @Column({ name: "PASSWORD", type: "varchar", length: 512, nullable: false })
        password: string;

    @Column({ name: "PASSWORD_SALT", type: "varchar", length: 128, nullable: false })
        passwordSalt: string;

    @Column({ name: "STATUS", type: "enum", enum: [ "ADMIN", "USER", "WITHDRAW", "SLEEP" ], nullable: false })
        status: string;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
        createdAt: Date;

    @OneToOne(() => UserPersonalInfo, (info) => info.user)
        personalInfo: Relation<UserPersonalInfo>;

    @OneToMany(() => Survey, (survey) => survey.user)
        surveys: Relation<Survey>[];

    @OneToMany(() => SurveyLike, (like) => like.user)
        likes: Relation<SurveyLike>[];

    @OneToMany(() => SurveyComment, (comment) => comment.user)
        comments: Relation<SurveyComment>[];

}

@Entity("USER_PERSONAL_INFO")
export class UserPersonalInfo {
    @PrimaryColumn({ name: "USER_ID", type: "int" })
        userId: number;

    @Column({ name: "GENDER", type: "enum", enum: [ "MALE", "FEMALE" ] })
        gender: string;

    @Column({ name: "AGE", type: "int" })
        age: number;

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "USER_ID", referencedColumnName: "id" })
        user: Relation<User>;

    @OneToMany(() => SurveyAnswer, (answer) => answer.user)
        answers: Relation<SurveyAnswer>[];

}
