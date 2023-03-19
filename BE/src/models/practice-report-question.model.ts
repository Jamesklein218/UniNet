import { ObjectID } from 'mongodb';
import _ from 'lodash';

interface Question {
    content: string;
    question_id: number;
    questionMaxScore?: number;
}

interface Part {
    partMaxScore?: number;
    content: string;
    part_id: number;
    field: Question[];
}

/**
 * Model Practice_Report_Session for an admin in the Admin app
 *
 * @attrinute _id is the primary key in ObjectID
 * @attrinute name is the name of the set of questions
 * @attribute createdAt is the time the question list was created in miliseconds
 * @attribute updatedAt is the time the question list was updated in miliseconds
 * @attribute question is the array list of part which contains questions
 */

export interface Practice_Report_Question {
    _id: ObjectID;
    name: string;
    description: string;
    createdAt: number;
    updatedAt?: number;
    userCreated: ObjectID;
    question: Part[];
}

export function fillPracticeReportQuestionValue(report: Practice_Report_Question): Practice_Report_Question {
    const defaultQuestion: Part[] = [
        {
            content: 'Rèn luyện về nhận thức chính trị, đạo đức, lối sống (35 điểm)',
            partMaxScore: 35,
            part_id: 0,
            field: [
                {
                    content: 'Điểm rèn luyện (10 điểm) (ghi điểm vào mục diễn giải, sinh viên năm nhất được 100 điểm)',
                    questionMaxScore: 10,
                    question_id: 0,
                },
                {
                    content:
                        'Tham gia chào cờ đầu tuần (4 điểm) (1 điểm/ lần, điểm không quá 4 điểm; sinh viên học tập tại cơ sở Dĩ An được 4 điểm)',
                    questionMaxScore: 4,
                    question_id: 1,
                },
                {
                    content:
                        'Tham gia tối thiểu 02 hoạt động, chương trình truyền thống của nhà trường, tổ chức Đoàn Thanh niên, Hội Sinh viên (0 điểm, 5 điểm, 8 điểm; sinh viên năm nhất tham gia 01 hoạt động, chương trình được 8 điểm) (Ngày kỷ niệm thành lập trường Đại học Bách Khoa 27/10, ngày Nhà giáo Việt Nam 20/11, ngày truyền thống học sinh - sinh viên Việt Nam 09/01, ngày thành lập Đảng Cộng sản Việt Nam 03/2, ngày Đoàn viên 26/3, kỷ niệm ngày sinh Chủ tịch Hồ Chí Minh 19/5)',
                    questionMaxScore: 8,
                    question_id: 2,
                },
                {
                    content:
                        'Không vi phạm pháp luật, quy định của nhà trường, nơi cư trú, tổ chức chính trị - xã hội và không bị kỷ luật dưới bất kỳ hình thức nào (7 điểm)',
                    questionMaxScore: 7,
                    question_id: 3,
                },
                {
                    content: 'Tham gia sinh hoạt chi đoàn đầy đủ (5 điểm) (ghi số lần tham gia tại mục diễn giải)',
                    questionMaxScore: 5,
                    question_id: 4,
                },
                {
                    content:
                        'Tham gia các cuộc thi về chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh, kiến thức lịch sử, chính trị, văn hóa, kinh tế - xã hội (1 điểm)',
                    questionMaxScore: 1,
                    question_id: 5,
                },
            ],
        },
        {
            content: 'Rèn luyện về chuyên môn, nghiệp vụ, tinh thần tự nguyện (35 điểm)',
            partMaxScore: 35,
            part_id: 1,
            field: [
                {
                    content: 'Điểm trung bình học kỳ 1, năm học hiện tại (2.5 điểm)',
                    questionMaxScore: 2.5,
                    question_id: 6,
                },
                {
                    content: 'Điểm trung bình học kỳ 2, năm học trước (2.5 điểm, sinh viên năm nhất được 10 điểm)',
                    questionMaxScore: 2.5,
                    question_id: 7,
                },
                {
                    content: 'Tham gia cuộc thi học thuật hoặc tham gia nghiên cứu khoa học (4 điểm)',
                    questionMaxScore: 4,
                    question_id: 8,
                },
                {
                    content: 'Đạt giải trong cuộc thi học thuật hoặc có bài đăng trên kỷ yếu hội nghị (1 điểm)',
                    questionMaxScore: 1,
                    question_id: 9,
                },
                {
                    content:
                        'Đạt chuẩn trình độ tiếng Anh theo quy định của nhà trường (10 điểm) (TOEIC: năm nhất: 250/ đạt AV1, năm hai: 350/ đạt AV2, năm ba: 400/ đạt AV3, năm tư: 450/đạt AV4)',
                    questionMaxScore: 10,
                    question_id: 10,
                },
                {
                    content:
                        'Tham gia thường trực 01 trong các chiến dịch, chương trình tình nguyện: chiến dịch Xuân Tình nguyện, chương tình Tiếp sức Mùa thi, chiến dịch Mùa hè xanh, chương trình Tiếp sức đến trường; tham gia hiến máu tình nguyện 03 lần/năm hoặc hoàn thành 05 ngày CTXH/năm - tương đương 2 điểm/ngày CTXH (10 điểm) ',
                    questionMaxScore: 10,
                    question_id: 11,
                },
                {
                    content:
                        'Tham gia ít nhất 02 hoạt động chương trình, lễ, văn hóa, văn nghệ của đơn vị đang học tập (0 điểm, 3 điểm, 5 điểm)',
                    questionMaxScore: 5,
                    question_id: 12,
                },
            ],
        },
        {
            content: 'Rèn luyện về sức khỏe, kỹ năng thực hành xã hội (30 điểm)',
            partMaxScore: 30,
            part_id: 2,
            field: [
                {
                    content:
                        'Rèn luyện thường xuyên 01 môn thể thao hoặc đạt giấy chứng nhận Sinh viên khỏe, đạt giải trong các hội thao (10 điểm)',
                    questionMaxScore: 10,
                    question_id: 13,
                },
                {
                    content:
                        'Hoàn thành 01 khóa huấn luyện kỹ năng thực hành xã hội (ít nhất 03 chuyên đề) hoặc đã và đang tham gia thực hiện 01 dự án cộng đồng (0 điểm, 5 điểm, 8 điểm, 10 điểm)',
                    questionMaxScore: 10,
                    question_id: 14,
                },
                {
                    content: 'Không sử dụng ma túy; không hút thuốc lá; hạn chế uống bia, rượu (10 điểm)',
                    questionMaxScore: 10,
                    question_id: 15,
                },
            ],
        },
        {
            content: 'Điểm thưởng (tối đa 10 điểm)',
            partMaxScore: 10,
            part_id: 3,
            field: [
                {
                    content: 'Không rớt môn (5 điểm)',
                    questionMaxScore: 5,
                    question_id: 16,
                },
                {
                    content: 'Đạt giải cuộc thi học thuật toàn quốc, bài đăng tạp chí khoa học (5 điểm)',
                    questionMaxScore: 5,
                    question_id: 17,
                },
                {
                    content: 'Là cán bộ Đoàn - Hội, ban cán sự lớp (5 điểm)',
                    questionMaxScore: 5,
                    question_id: 18,
                },
                {
                    content: 'Được khen thưởng từ cấp trường hoặc cấp huyện trở lên (5 điểm)',
                    questionMaxScore: 5,
                    question_id: 19,
                },
            ],
        },
    ];

    let today = Date.now();
    return _.merge(
        {
            name: '',
            description: '',
            createdAt: today,
            updatedAt: today,
            question: defaultQuestion,
        },
        report,
    );
}
