import { User, UserPersonalInfo } from "./user";
import { Survey, SurveyAnswer, SurveyOption } from "./survey";
import { SurveyComment, SurveyLike } from "./survey-social";
import { Hashtag, SurveyHashtag } from "./hashtag";

export const models = [
    User,
    UserPersonalInfo,
    Survey,
    SurveyOption,
    SurveyAnswer,
    SurveyLike,
    SurveyComment,
    Hashtag,
    SurveyHashtag
];
