import 'reflect-metadata';

import { App } from './app';
import container from './container';
import { SERVICE_PORT } from './config';
import { applyHttpResponseComposer } from './lib/response-composer';

import {
    AuthService,
    DatabaseService,
    UserService,
    EventService,
    BundleService,
    UploadService,
    MailService,
    ContactService,
    PracticeReportService,
    MapperService,
    NotificationService,
    FirebaseService,
} from './services';
import {
    AuthController,
    UserController,
    BundleController,
    EventController,
    MeController,
    UploadController,
    ContactController,
    PracticeReportController,
    NotificationController,
} from './controllers';
import { ServiceType } from './types';
import { TaskSchedulingService } from './services/taskscheduling.service';
import { ForumService } from './services/forum.service';
import { ForumController } from './controllers/forum.controller';

// Binding service
container.bind<AuthService>(ServiceType.Auth).to(AuthService).inSingletonScope();
container.bind<FirebaseService>(ServiceType.Firebase).to(FirebaseService).inSingletonScope();
container.bind<DatabaseService>(ServiceType.Database).to(DatabaseService).inSingletonScope();
container.bind<UserService>(ServiceType.User).to(UserService).inSingletonScope();
container.bind<EventService>(ServiceType.Event).to(EventService).inSingletonScope();
container.bind<BundleService>(ServiceType.Bundle).to(BundleService).inSingletonScope();
container.bind<UploadService>(ServiceType.Upload).to(UploadService).inSingletonScope();
container.bind<MailService>(ServiceType.Mail).to(MailService).inSingletonScope();
container.bind<ContactService>(ServiceType.Contact).to(ContactService).inSingletonScope();
container.bind<MapperService>(ServiceType.Mapper).to(MapperService).inSingletonScope();
container.bind<NotificationService>(ServiceType.Notification).to(NotificationService).inSingletonScope();
container.bind<PracticeReportService>(ServiceType.PracticeReport).to(PracticeReportService).inSingletonScope();
container.bind<TaskSchedulingService>(ServiceType.TaskSchedule).to(TaskSchedulingService).inSingletonScope()
container.bind<ForumService>(ServiceType.Forum).to(ForumService).inSingletonScope()

// Initialize service first
Promise.all([
    container.get<DatabaseService>(ServiceType.Database).initialize(),
    container.get<FirebaseService>(ServiceType.Firebase).initialize(),
]).then(() => {
    const app = new App(
        [
            container.resolve<AuthController>(AuthController),
            container.resolve<UserController>(UserController),
            container.resolve<EventController>(EventController),
            container.resolve<BundleController>(BundleController),
            container.resolve<MeController>(MeController),
            container.resolve<UploadController>(UploadController),
            container.resolve<ContactController>(ContactController),
            container.resolve<PracticeReportController>(PracticeReportController),
            container.resolve<NotificationController>(NotificationController),
            container.resolve<ForumController>(ForumController)
        ],
        SERVICE_PORT,
        [applyHttpResponseComposer, container.get<AuthService>(ServiceType.Auth).applyMiddleware()],
    );

    app.listen();
});
