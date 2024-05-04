import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Survey } from "./survey";
import { User } from "./user";

@Entity("SURVEY_LIKE")
export class SurveyLike {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
    id: number;

    @Column({ name: "SURVEY_ID", type: "int", nullable: false })
    surveyId: number;

    @Column({ name: "USER_ID", type: "int", nullable: false })
    userId: number;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToMany(() => Survey, survey => survey.likes)
    @JoinColumn({ name: "SURVEY_ID", referencedColumnName: "id" })
    survey: Relation<Survey>;

    @OneToMany(() => User, user => user.likes)
    @JoinColumn({ name: "USER_ID", referencedColumnName: "id" })
    user: Relation<User>;
}

@Entity("SURVEY_COMMENT")
export class SurveyComment {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
    id: number;

    @Column({ name: "SURVEY_ID", type: "int", nullable: false })
    surveyId: number;

    @Column({ name: "AUTHOR_ID", type: "int", nullable: false })
    authorId: number;

    @Column({ name: "COMMENT", type: "text", nullable: false })
    comment: string;

    @Column( { name: "IS_DELETED", type: "boolean", nullable: false, default: false })
    isDeleted: boolean;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => Survey, survey => survey.comments)
    @JoinColumn({ name: "SURVEY_ID", referencedColumnName: "id" })
    survey: Relation<Survey>;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: "USER_ID", referencedColumnName: "id" })
    user: Relation<User>;
}
