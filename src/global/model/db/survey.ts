import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { User } from "./user";
import { SurveyHashtag } from "./hashtag";
import { SurveyComment, SurveyLike } from "./survey-social";

@Entity("SURVEY")
export class Survey {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
        id: number;

    @Column({ name: "AUTHOR_ID", type: "int", nullable: false })
        authorId: number;

    @Column({ name: "TITLE", type: "varchar", length: 255, nullable: false })
        title: string;

    @Column({ name: "CONTENT", type: "text", nullable: true })
        content?: string;

    @Column({ name: "IS_DELETED", type: "boolean", nullable: false, default: false })
        isDeleted: boolean;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
        createdAt: Date;

    @Column({
        name: "LAST_MODIFIED_AT",
        type: "timestamp",
        nullable: true,
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
        lastModifiedAt: Date;

    @ManyToOne(() => User, (user) => user.surveys)
    @JoinColumn({ name: "AUTHOR_ID", referencedColumnName: "id" })
        user: Relation<User>;

    @OneToMany(() => SurveyOption, (option) => option.survey)
        options: Relation<SurveyOption>[];

    @OneToMany(() => SurveyAnswer, (answer) => answer.survey)
        answers: Relation<SurveyAnswer>[];

    @OneToMany(() => SurveyHashtag, (survey) => survey.hashtags)
        hashtags: Relation<SurveyHashtag>[];

    @OneToMany(() => SurveyLike, (like) => like.survey)
        likes: Relation<SurveyLike>[];

    @OneToMany(() => SurveyComment, (comment) => comment.survey)
        comments: Relation<SurveyComment>[];
}

@Entity("SURVEY_OPTION")
export class SurveyOption {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
        id: number;

    @Column({ name: "SURVEY_ID", type: "int", nullable: false })
        surveyId: number;

    @Column({ name: "CONTENT", type: "text", nullable: false })
        content: string;

    @Column({ name: "IS_DELETED", type: "boolean", nullable: false, default: false })
        isDeleted: boolean;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
        createdAt: Date;

    @Column({
        name: "LAST_MODIFIED_AT",
        type: "timestamp",
        nullable: true,
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
        lastModifiedAt: Date;

    @ManyToOne(() => Survey, (survey) => survey.id)
    @JoinColumn({ name: "SURVEY_ID", referencedColumnName: "id" })
        survey: Relation<Survey>;

    @OneToMany(() => SurveyAnswer, (answer) => answer.option)
        answers: Relation<SurveyAnswer>[];
}

@Entity("SURVEY_ANSWER")
export class SurveyAnswer {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
        id: number;

    @Column({ name: "SURVEY_ID", type: "int", nullable: false })
        surveyId: number;

    @Column({ name: "OPTION_ID", type: "int", nullable: false })
        optionId: number;

    @Column({ name: "USER_ID", type: "int", nullable: false })
        userId: number;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
        createdAt: Date;

    @ManyToOne(() => Survey, (survey) => survey.id)
    @JoinColumn({ name: "SURVEY_ID", referencedColumnName: "id" })
        survey: Relation<Survey>;

    @ManyToOne(() => SurveyOption, (option) => option.id)
    @JoinColumn({ name: "OPTION_ID", referencedColumnName: "id" })
        option: Relation<SurveyOption>;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "USER_ID", referencedColumnName: "id" })
        user: Relation<User>;
}
