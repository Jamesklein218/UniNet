import {Images} from '@config';
import MM from '../assets/images/mm.png';
import chem from '../assets/images/chem.png';
import Khoa from '../assets/images/tndk.jpeg';
import Minh from '../assets/images/minh.jpeg';
import Hung from '../assets/images/tqh.jpeg';
import Khoi from '../assets/images/khoi.jpeg';

const material = [
  {
    id: '1',
    name: 'Đề ôn Hoá đại cương',
    files: ['pdf'],
    services: [{id: '1', icon: 'wifi', name: 'Chemistry'}],
    authorName: 'Tran Ngoc Dang Khoa',
    description: 'Đây là bộ đề Hoà đại cương mẫu',
    image: chem,
    author: Khoa,
  },
  {
    id: '2',
    name: 'Đề thi Final Math Modeling 2023',
    files: ['powerpoint', 'word'],
    services: [{id: '1', icon: 'wifi', name: 'Computer Science'}],
    authorName: 'Tran Ngoc Dang Khoa',
    description: 'Đây là bộ đề thi Final mẫu',
    image: MM,
    author: Khoi,
  },
];

export {material};
