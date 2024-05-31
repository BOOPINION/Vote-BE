import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Survey } from "./survey";

@Entity("HASHTAGS")
export class Hashtag {
    @PrimaryGeneratedColumn("increment", { name: "ID", type: "int" })
        id: number;

    @Column({ name: "NAME", type: "varchar", length: 255, nullable: false, unique: true })
        name: string;

    @Column({ name: "CREATED_AT", type: "timestamp", nullable: false, default: "CURRENT_TIMESTAMP" })
        createdAt: Date;

    @OneToMany(() => SurveyHashtag, (survey) => survey.hashtag)
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

    @ManyToOne(() => Hashtag, (hashtag) => hashtag.surveys, { eager: true })
    @JoinColumn({ name: "HASHTAG_ID", referencedColumnName: "id" })
        hashtag: Relation<Hashtag>;

    @ManyToOne(() => Survey, (survey) => survey.hashtags)
    @JoinColumn({ name: "SURVEY_ID", referencedColumnName: "id" })
        survey: Relation<Survey>;
}

