import { Router } from 'express';
import { inject, injectable } from 'inversify';
import _, { constant } from 'lodash';
import { Request, Response, ServiceType, PrivacyType } from '../types';
import { Controller } from './controller';
import { UserService, AuthService, PracticeReportService } from '../services';
import { User, Role } from '../models/user.model';
import { Practice_Report_Session, fillPracticeReportSessionValue } from '../models/practice-report-session.model';
import { Practice_Report_Question } from '../models/practice-report-question.model';
import { Practice_Report_Answer, Part, Grade } from '../models/practice-report-answer.model';
import { ObjectID } from 'mongodb';
import { INJECT_TAG } from 'inversify/lib/constants/metadata_keys';
import { setRandomFallback } from 'bcryptjs';

@injectable()
export class PracticeReportController extends Controller {
    public readonly router = Router();
    public readonly path = '/practice-report';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.PracticeReport)
        private practiceReportService: PracticeReportService,
    ) {
        super();
        this.router.all('*', this.authService.authenticate());

        this.router.post('/session', this.createSession.bind(this));
        this.router.delete('/session/:sessionId', this.deleteSession.bind(this));
        this.router.get('/session', this.getSession.bind(this));
        this.router.get('/session/:sessionId', this.getSessionById.bind(this));
        this.router.get('/active-session', this.getActiveSession.bind(this));

        this.router.post('/question', this.createQuestion.bind(this));
        this.router.get('/question', this.getQuestion.bind(this));
        this.router.get('/question/:questionId', this.getQuestionById.bind(this));

        this.router.post('/answer', this.answerQuestion.bind(this));
        this.router.get('/answer', this.getAnswerBySession.bind(this));
        this.router.get('/answer/:answerId', this.getAnswerById.bind(this));
        this.router.patch('/:answerId/update', this.updateAnswer.bind(this));
    }

    async createSession(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        let isReporter = await this.userService.checkRole(userId, Role.Reporter);
        if (!isReporter) {
            res.composer.notAllowed('Must be a reporter');
            return;
        }

        let sessionInfo = _.pick(req.body, [
            'name',
            'description',
            'activeTime',
            'expiredTime',
            'activeCheckingTime',
            'expiredCheckingTime',
            'question',
        ]) as any;

        let today = Date.now();
        sessionInfo = _.merge(
            {
                userCreated: userId,
                createdAt: today,
                activeTime: today,
                expiredTime: today,
                activeCheckingTime: today,
                expiredCheckingTime: today,
                reportAnswer: [],
            },
            sessionInfo,
        );
        sessionInfo.question = ObjectID.createFromHexString(req.body.question);

        try {
            const affectedCount = await this.practiceReportService.createSession(sessionInfo);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async deleteSession(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const sessionId = ObjectID.createFromHexString(req.params.sessionId);

        let isEventCreator = await this.practiceReportService.isSessionCreator(sessionId, userId);

        if (!isEventCreator) {
            res.composer.notAllowed('Must be the creator of the session');
            return;
        }

        try {
            await this.practiceReportService.deleteSession(sessionId);
            res.composer.success(sessionId);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async createQuestion(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        let isReporter = await this.userService.checkRole(userId, Role.Reporter);
        if (!isReporter) {
            res.composer.notAllowed('Must be a reporter');
            return;
        }

        const questionInfo = {
            userCreated: userId,
            name: req.body.name,
            description: req.body.description,
            question: req.body.question,
        };

        try {
            const affectedCount = await this.practiceReportService.createQuestion(questionInfo);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getSession(req: Request, res: Response) {
        try {
            const sessions = await this.practiceReportService.findSession();
            res.composer.success(sessions);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getSessionById(req: Request, res: Response) {
        const sessionId = ObjectID.createFromHexString(req.params.sessionId);
        try {
            const session = (
                await this.practiceReportService.findSession({ _id: sessionId })
            )[0] as Practice_Report_Session;
            res.composer.success(session);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getActiveSession(req: Request, res: Response) {
        try {
            const today = Date.now();
            const sessions = await this.practiceReportService.findSession({
                activeTime: { $lt: today },
                expiredTime: { $gt: today },
            });
            res.composer.success(sessions);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getQuestion(req: Request, res: Response) {
        try {
            const questions = await this.practiceReportService.findQuestion();
            res.composer.success(questions);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getQuestionById(req: Request, res: Response) {
        const questionId = ObjectID.createFromHexString(req.params.questionId);
        try {
            const question = (
                await this.practiceReportService.findQuestion({ _id: questionId })
            )[0] as Practice_Report_Question;
            res.composer.success(question);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async answerQuestion(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { result } = req.body;
        const today = Date.now();
        const session = ObjectID.createFromHexString(req.body.session);

        // Check if the user have done answered this session
        let wasAnswered = await this.practiceReportService.wasAnswered(session, userId);

        if (wasAnswered) {
            res.composer.notAllowed('You did answer this session');
            return;
        }

        // Get this session
        let thisSession = (
            await this.practiceReportService.findSession({ _id: session })
        )[0] as Practice_Report_Session;

        // Get this set of questions
        let question: ObjectID = thisSession.question;
        let thisQuestion = (
            await this.practiceReportService.findQuestion({ _id: question })
        )[0] as Practice_Report_Question;

        // Check whether time was expired
        if (!(thisSession.activeTime < today && thisSession.expiredTime > today)) {
            res.composer.notAllowed('Time expired');
            return;
        }

        // Calculate the total Score
        let i: number;
        for (i = 0; i < result.length; i++) {
            result[i].partScore = _.sumBy(result[i].field, 'answerScore');
            if (result[i].partScore > thisQuestion.question[i].partMaxScore) {
                res.composer.notAllowed('Score exceed the maximum');
                return;
            }
        }

        let total = _.sumBy(result, 'partScore');

        // Evaluate rank
        let rank: Grade;
        switch (true) {
            case total >= 90:
                rank = Grade.excellent;
                break;
            case total >= 70:
                rank = Grade.fine;
                break;
            case total >= 50:
                rank = Grade.good;
                break;
            default:
                rank = Grade.weak;
        }

        const newAnswer = {
            createdAt: Date.now(),
            userCreated: userId,
            session: session,
            totalScore: total,
            grade: rank,
            result: result,
        };

        try {
            const answerId: ObjectID = (await this.practiceReportService.addAnswer(newAnswer)) as any;
            let t = await this.practiceReportService.pushAnswerToSession(session, userId, answerId);
            res.composer.success(answerId);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async updateAnswer(req: Request, res: Response) {
        const { userId } = req.tokenMeta;
        const { updatedData } = req.body;
        const reportAnswer = ObjectID.createFromHexString(req.params.answerId);
        const today = Date.now();
        const oldData = await this.practiceReportService.findAnswerById(reportAnswer);

        // Check User Created
        if (!oldData.userCreated.equals(userId)) {
            res.composer.notAllowed('Not the user created');
            return;
        }

        // Get this session
        let thisSession = (
            await this.practiceReportService.findSession({
                _id: oldData.session,
            })
        )[0] as Practice_Report_Session;

        // Get this set of questions
        let question: ObjectID = thisSession.question;
        let thisQuestion = (
            await this.practiceReportService.findQuestion({ _id: question })
        )[0] as Practice_Report_Question;

        // Check whether time was expired
        if (!(thisSession.activeTime < today && thisSession.expiredTime > today)) {
            res.composer.notAllowed('Time expired');
            return;
        }

        // Evaluate again total score and grade into updatedData
        // Calculate the total Score
        let i: number;
        for (i = 0; i < updatedData.length; i++) {
            updatedData[i].partScore = _.sumBy(updatedData[i].field, 'answerScore');
            if (updatedData[i].partScore > thisQuestion.question[i].partMaxScore) {
                res.composer.notAllowed('Score exceed the maximum');
                return;
            }
        }

        let total = _.sumBy(updatedData, 'partScore');

        // Evaluate rank
        let rank: Grade;
        switch (true) {
            case total >= 90:
                rank = Grade.excellent;
                break;
            case total >= 70:
                rank = Grade.fine;
                break;
            case total >= 50:
                rank = Grade.good;
                break;
            default:
                rank = Grade.weak;
        }

        const updatedAnswer = _.merge(oldData, {
            updatedAt: today,
            updatedBy: userId,
            totalScore: total,
            grade: rank,
            result: updatedData,
        });

        try {
            const affectedCount = await this.practiceReportService.updateAnswer(reportAnswer, updatedAnswer);
            res.composer.success(affectedCount);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getAnswerBySession(req: Request, res: Response) {
        const sessionId = ObjectID.createFromHexString(req.body.sessionId);
        try {
            const answers = await this.practiceReportService.findAnswer({
                session: sessionId,
            });
            res.composer.success(answers);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }

    async getAnswerById(req: Request, res: Response) {
        const answerId = ObjectID.createFromHexString(req.params.answerId);
        try {
            const answer = (
                await this.practiceReportService.findAnswer({
                    _id: answerId,
                })
            )[0] as Practice_Report_Answer;
            res.composer.success(answer);
        } catch (error) {
            res.composer.badRequest(error.message);
        }
    }
}
