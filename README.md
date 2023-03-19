# UniNet
> Team: Fessior

An application! A community!

UniNet is an application that helps students who have difficulty finding information in a university environment. We create a community where students can support each other whether it is searching for information or finding social activities. 

# Project Motivation

	Firstly, problems concerning adaptation are hard to avoid. One reason why students don't get along is finding the right friends. Most university students no longer see their high school friends, combined with the fact that students often take classes at different times means that many students can't integrate to their new environment, thus feeling lonely and lost. 
	The second problem is the management of study time and finding study materials. Considering each subject, and extracurricular activity, students need to develop a common, integrated timetable for each semester and follow it in a disciplined manner. The lack of effective time management is one of the reasons why students' academic results tend to drop compared to high school, and is most common among freshmen. In addition, a significant increase in the amount of knowledge compared to high school means the ability to find study materials is also a must. 
	The third challenge is attending social activities at the university. In addition to studying, students are also expected to have good work-life balance, and participate in various social activities. However, finding activities that suit one’s interest, schedule and personal skills still prove to be a challenge for students. The lack of a platform to advertise and orchestrate such activities means that students have to rely on small groups and online forums to find them. As a result, many graduates don’t get the necessary social exposure, and certainly don’t meet the quota required by their school.
	Our solution will aim to address the aforementioned three problems, in order to help students with their studying and social activities at university.

# System

## Architecture

<img src="https://github.com/Jamesklein218/UniNet/blob/main/images/architecture.png"  width="500">

<img src="https://github.com/Jamesklein218/UniNet/blob/main/images/service.png"  width="500">

## User-case diagram

![User Case Diagram](https://github.com/Jamesklein218/UniNet/blob/main/images/usercase.jpg | width=500)

<img src="https://github.com/Jamesklein218/UniNet/blob/main/images/usercase.jpg"  width="500">

# Tech Stack
- **Frontend**: React Native
- **Backend**: ExpressJS
- **Google's Services**: 
  - **Firebase Cloud Messaging (FCM)** is a cross-platform messaging solution that lets you reliably send messages at no cost.
  - **Google Cloud** for service hosting
  - **Firebase Storage** for storing files like .pdf and .docs file (In development)
  - **Firebase Hosting** for admin webpage (In development)

# Installation
Prerequisite:
- `NodeJS`: > 16.0.0

### Front-end
***Installing dependency***:
    ```
    $ npm install
    ```

***Run on Android***:
    ```
    $ npm run android
    ```

***Log on Android***:
    ```
    $ npm run log:android
    ```

### Back-end
***Installing dependency***:
    ```
    $ yarn
    ```

***Running***: 
    ```
    $ yarn dev
    ```

# Contributor
- Tran Duy Minh (Team Leader, Mobile): [Github Profile](https://github.com/Mdtr3002A)
- Truong Quoc Hung (Back-end): [Github Profile](https://github.com/qhung312)
- Nguyen Tran Khoi (Mobile): [Github Profile](https://github.com/NooBat)
- Tran Ngoc Dang Khoa (Mobile): [Github Profile](https://github.com/Jamesklein218)

*GDSC Hackathon 2023*
