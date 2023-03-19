import { injectable, inject } from 'inversify';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import _ from 'lodash';

import { DatabaseService } from './database.service';
import { Practice_Report_Session } from '../models/practice-report-session.model';
import { Practice_Report_Question, fillPracticeReportQuestionValue } from '../models/practice-report-question.model';
import { Practice_Report_Answer, fillPracticeReportAnswerValue } from '../models/practice-report-answer.model';

import { ServiceType } from '../types';
import { ErrorEventInvalid } from '../lib/errors';

@injectable()
export class PracticeReportService {
    private sessionCollection: Collection;
    private questionCollection: Collection;
    private answerCollection: Collection;

    constructor(@inject(ServiceType.Database) private dbService: DatabaseService) {
        this.sessionCollection = this.dbService.db.collection('practice-report-session');
        this.questionCollection = this.dbService.db.collection('practice-report-question');
        this.answerCollection = this.dbService.db.collection('practice-report-answer');
    }

    async createSession(data: any): Promise<Practice_Report_Session> {
        const newSession = await this.sessionCollection.insertOne(data as Practice_Report_Session);
        return newSession.ops[0] as Practice_Report_Session;
    }

    async isSessionCreator(sessionId: ObjectID, userId: ObjectID) {
        const session = (await this.sessionCollection.findOne({
            _id: sessionId,
        })) as Practice_Report_Session;
        return session.userCreated.equals(userId);
    }

    async deleteSession(sessionId: ObjectID) {
        await this.sessionCollection.deleteOne({ _id: sessionId });
    }

    async createQuestion(data: any): Promise<Practice_Report_Question> {
        const newQuestion = await this.questionCollection.insertOne(
            fillPracticeReportQuestionValue(data as Practice_Report_Question),
        );
        return newQuestion.ops[0] as Practice_Report_Question;
    }

    async addAnswer(data: any): Promise<ObjectID> {
        const newAnswer = await this.answerCollection.insertOne(
            fillPracticeReportAnswerValue(data as Practice_Report_Answer),
        );
        return newAnswer.insertedId;
    }

    async wasAnswered(sessionId: ObjectID, userId: ObjectID) {
        const session = await this.sessionCollection.findOne({
            _id: sessionId,
            'reportAnswer.userCreated': { $eq: userId },
        });
        return session as Practice_Report_Session;
    }

    async pushAnswerToSession(session: ObjectID, user: ObjectID, answer: ObjectID) {
        const onUpdate = await this.sessionCollection.updateOne(
            {
                _id: session,
            },
            {
                $push: {
                    reportAnswer: {
                        userCreated: user,
                        answer: answer,
                    },
                },
            },
        );
        return onUpdate.result.nModified;
    }

    async updateAnswer(answerId: ObjectID, data: any) {
        const opUpdateResult = await this.answerCollection.updateOne({ _id: answerId }, { $set: data });
        return opUpdateResult.result.nModified;
    }

    async findSession(query: any = {}, populateQuestion = false): Promise<Practice_Report_Session[]> {
        let aggreateCommand: any[] = [{ $match: query }];
        if (populateQuestion)
            aggreateCommand = _.concat(
                {
                    $lookup: {
                        from: 'practice-report-question',
                        localField: 'question',
                        foreignField: '_id',
                        as: 'question',
                    },
                },
                { $unwind: '$question' },
            );
        const sessions = await this.sessionCollection.aggregate(aggreateCommand).toArray();
        return sessions as Practice_Report_Session[];
    }

    async findQuestion(query: any = {}): Promise<Practice_Report_Question[]> {
        let aggreateCommand: any[] = [{ $match: query }];
        const questions = await this.questionCollection.aggregate(aggreateCommand).toArray();
        return questions as Practice_Report_Question[];
    }

    async findAnswer(
        query: any = {},
        populateUserCreated = true,
        populateQuestion = true,
    ): Promise<Practice_Report_Answer[]> {
        let aggreateCommand: any[] = [{ $match: query }];
        if (populateUserCreated)
            aggreateCommand = _.concat(
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userCreated',
                        foreignField: '_id',
                        as: 'userCreated',
                    },
                },
                { $unwind: '$userCreated' },
                { $unset: ['userCreated.password'] },
            );
        if (populateQuestion)
            aggreateCommand = _.concat(
                {
                    $lookup: {
                        from: 'practice-report-session',
                        localField: 'session',
                        foreignField: '_id',
                        as: 'setOfQuestions',
                    },
                },
                { $unwind: '$setOfQuestions' },
                {
                    $lookup: {
                        from: 'practice-report-question',
                        localField: 'setOfQuestions.question',
                        foreignField: '_id',
                        as: 'setOfQuestions',
                    },
                },
                { $unwind: '$setOfQuestions' },
            );
        const answers = await this.answerCollection.aggregate(aggreateCommand).toArray();
        return answers as Practice_Report_Answer[];
    }

    async findAnswerByUserId(query: any = {}): Promise<Practice_Report_Answer[]> {
        let aggreateCommand: any[] = [
            { $match: query },
            { $unset: 'result' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userCreated',
                    foreignField: '_id',
                    as: 'userCreated',
                },
            },
            { $unwind: '$userCreated' },
            { $unset: ['userCreated.password'] },
            {
                $lookup: {
                    from: 'practice-report-session',
                    localField: 'session',
                    foreignField: '_id',
                    as: 'session',
                },
            },
            { $unwind: '$session' },
        ];
        const answers = await this.answerCollection.aggregate(aggreateCommand).toArray();
        return answers as Practice_Report_Answer[];
    }

    async findAnswerById(id: ObjectID) {
        const answer = (await this.answerCollection.findOne({
            _id: id,
        })) as Practice_Report_Answer;
        return answer;
    }
}
