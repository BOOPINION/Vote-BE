import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany, Relation } from "typeorm";
import { Survey } from "./survey";

@Entity("HASHTAGS")
export class Hashtag {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
    id: number;

    @Column({ name: "NAME", type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToMany(() => SurveyHashtag, survey => survey.hashtags)
    surveys: Relation<SurveyHashtag>[];
}

@Entity("SURVEY_HASHTAGS")
export class SurveyHashtag {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
    id: number;

    @Column({ name: "SURVEY_ID", type: "int", nullable: false })
    surveyId: number;

    @Column({ name: "HASHTAG_ID", type: "int", nullable: false })
    hashtagId: number;

    @ManyToMany(() => Hashtag, hashtag => hashtag.surveys)
    hashtags: Relation<Hashtag>[];

    @OneToMany(() => Survey, survey => survey.hashtags)
    survey: Relation<Survey>;
}
