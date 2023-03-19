import { ObjectID } from 'mongodb';
import _ from 'lodash';
import { ObjectUnsubscribedError } from 'rxjs';

export enum Grade {
    weak = 'YẾU',
    fine = 'TRUNG BÌNH',
    good = 'KHÁ',
    excellent = 'XUẤT SẮC',
}

interface Answer {
    answerScore?: number;
    finalScore?: number;
    answer_id: number;
    explanation: string;
}

export interface Part {
    partScore: number;
    field: Answer[];
    part_id: number;
}

/**
 * Model Practice_Report for an admin in the Admin app
 *
 * @attrinute _id is the primary key in ObjectID
 * @attribute createdAt is the time the report was done by user in miliseconds
 * @attribute userId is the id of the user that did the report
 * @attribute startTime is the time that the user start to do the report in miliseconds
 * @attribute endTime is the time that the report was submitted by the user in miliseconds
 * @attribute score is the total score of the report
 * @attribute grade is the grade of the student
 * @attribute session is the Practice_Report_Session id that this report belongs to
 */

export interface Practice_Report_Answer {
    _id: ObjectID;
    createdAt: number;
    userCreated: ObjectID;
    updatedAt?: number;
    updatedBy?: ObjectID;
    totalScore?: number;
    grade?: Grade;
    session: ObjectID;
    result: Part[];
}

export function fillPracticeReportAnswerValue(report: Practice_Report_Answer): Practice_Report_Answer {
    return _.merge(
        {
            createdAt: Date.now(),
            totalScore: 0,
            grade: Grade.weak,
            result: [],
        },
        report,
    );
}
