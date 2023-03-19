import { ObjectID } from 'mongodb';
import _ from 'lodash';

/**
 * Model Practice_Report_Session for an admin in the Admin app
 *
 * @attrinute _id is the primary key in ObjectID
 * @attribute createdAt is the time the session was created by reporter in miliseconds
 * @attribute activeTime is the time this report will be opened for user in miliseconds
 * @attribute finishTime is the expired time of the session in miliseconds
 * @attribute question is the Report_Question id for the appropriate question list
 * @attribute report is the list of Report id that belongs to this session
 * @attribute createdBy is the User Id that create this session
 */

export interface Practice_Report_Session {
    _id: ObjectID;
    userCreated: ObjectID;
    createdAt: number;

    name: string;
    description: string;

    // Time for students to answers set of questions
    activeTime: number;
    expiredTime: number;

    // Time for Class President confirm the final score of all report answers in class
    activeCheckingTime: number;
    expiredCheckingTime: number;

    question: ObjectID;
    reportAnswer: {
        userCreated: ObjectID;
        answer: ObjectID;
        classId: string;
    }[];

    startYear: number;
    endYear: number;
}

export function fillPracticeReportSessionValue(session: Practice_Report_Session): Practice_Report_Session {
    let today = Date.now();
    return _.merge(
        {
            createdAt: today,
            activeTime: today,
            expiredTime: today,
            activeCheckingTime: today,
            expiredCheckingTime: today,
            reportAnswer: [],
        },
        session,
    );
}
