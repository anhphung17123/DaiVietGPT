// Mock data for CharacterAI Frontend
import characterImages from '../assets/images/character/imageRoot';
import introductionVideos from '../assets/videos/initial_introduction/videoRoot';

export const MOCK_CHARACTERS = [
  {
    id: 1,
    code: 'TranHungDao',
    name: "Trần Hưng Đạo",
    description: "Đại tướng quân nhà Trần, người đã lãnh đạo quân dân Đại Việt đánh bại quân Nguyên Mông xâm lược. Ông là biểu tượng của tinh thần yêu nước và tài năng quân sự kiệt xuất.",
    background: characterImages.TranHungDao,
    avatar: characterImages.TranHungDao,
    introductionVideo: introductionVideos.TranHungDao,
    isLocked: 0,
    price: 49000,
    era: "Nhà Trần (1228-1300)",
    achievements: [
      "Lãnh đạo quân dân Đại Việt đánh bại quân Nguyên Mông",
      "Tác giả của 'Hịch tướng sĩ'",
      "Được phong là Hưng Đạo Đại Vương"
    ]
  },
  {
    id: 2,
    code: 'LeLoi',
    name: "Lê Lợi",
    description: "Vua Lê Thái Tổ, người khởi xướng và lãnh đạo cuộc khởi nghĩa Lam Sơn đánh đuổi quân Minh xâm lược, khôi phục nền độc lập cho Đại Việt.",
    background: characterImages.LeLoi,
    avatar: characterImages.LeLoi,
    isLocked: 0,
    price: 49000,
    era: "Nhà Lê (1428-1789)",
    achievements: [
      "Lãnh đạo khởi nghĩa Lam Sơn",
      "Đánh đuổi quân Minh xâm lược",
      "Thành lập nhà Lê"
    ]
  },
  {
    id: 3,
    code: 'NguyenTrai',
    name: "Nguyễn Trãi",
    description: "Nhà văn, nhà thơ, nhà chính trị và quân sự kiệt xuất. Ông là cố vấn của Lê Lợi và tác giả của 'Bình Ngô đại cáo' - bản tuyên ngôn độc lập đầu tiên của Việt Nam.",
    background: characterImages.NguyenTrai,
    avatar: characterImages.NguyenTrai,
    isLocked: 0,
    price: 49000,
    era: "Nhà Lê (1380-1442)",
    achievements: [
      "Tác giả 'Bình Ngô đại cáo'",
      "Cố vấn của Lê Lợi",
      "Nhà văn hóa kiệt xuất"
    ]
  },
  {
    id: 4,
    code: 'HaiBaTrung',
    name: "Hai Bà Trưng",
    description: "Hai chị em Trưng Trắc và Trưng Nhị, những nữ anh hùng đầu tiên trong lịch sử Việt Nam, đã lãnh đạo cuộc khởi nghĩa chống lại ách đô hộ của nhà Hán.",
    background: characterImages.HaiBaTrung,
    avatar: characterImages.HaiBaTrung,
    isLocked: 1,
    price: 49000,
    era: "Thế kỷ 1 sau Công nguyên",
    achievements: [
      "Lãnh đạo khởi nghĩa chống nhà Hán",
      "Nữ anh hùng đầu tiên của Việt Nam",
      "Thành lập chính quyền độc lập"
    ]
  },
  {
    id: 5,
    code: 'LyThuongKiet',
    name: "Lý Thường Kiệt",
    description: "Đại tướng quân nhà Lý, người đã lãnh đạo quân dân Đại Việt đánh bại quân Tống xâm lược và là tác giả của bài thơ 'Nam quốc sơn hà' nổi tiếng.",
    background: characterImages.LyThuongKiet,
    avatar: characterImages.LyThuongKiet,
    isLocked: 1,
    price: 49000,
    era: "Nhà Lý (1019-1105)",
    achievements: [
      "Đánh bại quân Tống xâm lược",
      "Tác giả 'Nam quốc sơn hà'",
      "Đại tướng quân kiệt xuất"
    ]
  },
  {
    id: 6,
    code: 'LyCongUan',
    name: "Lý Công Uẩn",
    description: "Vua Lý Thái Tổ, người sáng lập ra nhà Lý và dời đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay), mở ra một thời kỳ phát triển rực rỡ của Đại Việt.",
    background: characterImages.LyCongUan,
    avatar: characterImages.LyCongUan,
    isLocked: 1,
    price: 49000,
    era: "Nhà Lý (974-1028)",
    achievements: [
      "Sáng lập nhà Lý",
      "Dời đô về Thăng Long",
      "Mở ra thời kỳ phát triển rực rỡ"
    ]
  },
  {
    id: 7,
    code: 'TranBinhTrong',
    name: "Trần Bình Trọng",
    description: "Tướng quân nhà Trần, người đã hy sinh anh dũng trong cuộc kháng chiến chống quân Nguyên Mông với câu nói bất hủ 'Ta thà làm quỷ nước Nam, chứ không thèm làm vương đất Bắc'.",
    background: characterImages.TranBinhTrong,
    avatar: characterImages.TranBinhTrong,
    isLocked: 1,
    price: 49000,
    era: "Nhà Trần (1259-1285)",
    achievements: [
      "Hy sinh anh dũng chống quân Nguyên",
      "Câu nói bất hủ về lòng yêu nước",
      "Biểu tượng của tinh thần bất khuất"
    ]
  },
  {
    id: 8,
    code: 'PhungThiChinh',
    name: "Phùng Thị Chính",
    description: "Nữ tướng tài ba của Hai Bà Trưng, người đã có công lớn trong cuộc khởi nghĩa chống lại ách đô hộ của nhà Hán và là biểu tượng của tinh thần nữ quyền Việt Nam.",
    background: characterImages.PhungThiChinh,
    avatar: characterImages.PhungThiChinh,
    isLocked: 1,
    price: 49000,
    era: "Thế kỷ 1 sau Công nguyên",
    achievements: [
      "Nữ tướng của Hai Bà Trưng",
      "Có công trong khởi nghĩa chống Hán",
      "Biểu tượng nữ quyền Việt Nam"
    ]
  }
];

// Mock chat responses
export const MOCK_CHAT_RESPONSES = {
  "Trần Hưng Đạo": [
    "Ta là Trần Hưng Đạo, đại tướng quân nhà Trần. Ta đã lãnh đạo quân dân Đại Việt đánh bại quân Nguyên Mông xâm lược. Ngươi có muốn nghe về chiến thuật quân sự của ta không?",
    "Trong 'Hịch tướng sĩ', ta đã viết: 'Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa'. Đó là tình yêu nước của ta.",
    "Quân Nguyên Mông mạnh về kỵ binh, nhưng ta đã dùng chiến thuật 'vườn không nhà trống' và đánh du kích để đánh bại chúng.",
    "Ta tin rằng 'Đại Việt sử ký toàn thư' sẽ ghi lại những chiến công của chúng ta cho hậu thế."
  ],
  "Lê Lợi": [
    "Ta là Lê Lợi, người đã khởi xướng cuộc khởi nghĩa Lam Sơn. Từ một người nông dân, ta đã trở thành vua của Đại Việt.",
    "Cuộc khởi nghĩa Lam Sơn bắt đầu từ năm 1418, kéo dài 10 năm mới đánh đuổi được quân Minh xâm lược.",
    "Nguyễn Trãi là cố vấn tài ba của ta, ông ấy đã viết 'Bình Ngô đại cáo' để tuyên bố độc lập.",
    "Ta tin rằng 'Đất nước ta có chủ quyền, không ai có thể xâm phạm được'."
  ],
  "Nguyễn Trãi": [
    "Ta là Nguyễn Trãi, nhà văn, nhà thơ và cố vấn của Lê Lợi. Ta đã viết 'Bình Ngô đại cáo' - bản tuyên ngôn độc lập đầu tiên của Việt Nam.",
    "Trong 'Bình Ngô đại cáo', ta viết: 'Việc nhân nghĩa cốt ở yên dân, Quân điếu phạt trước lo trừ bạo'.",
    "Ta không chỉ là nhà chính trị mà còn là nhà văn hóa. Ta đã để lại nhiều tác phẩm văn học quý giá.",
    "Lòng yêu nước và tinh thần độc lập là điều ta luôn tâm niệm."
  ],
  "Hai Bà Trưng": [
    "Chúng ta là Hai Bà Trưng - Trưng Trắc và Trưng Nhị. Chúng ta đã lãnh đạo cuộc khởi nghĩa chống lại ách đô hộ của nhà Hán.",
    "Là phụ nữ, chúng ta đã chứng minh rằng nữ giới cũng có thể lãnh đạo và bảo vệ đất nước.",
    "Cuộc khởi nghĩa của chúng ta đã thành công trong việc đánh đuổi quân Hán và thành lập chính quyền độc lập.",
    "Chúng ta tin rằng 'Phụ nữ Việt Nam không bao giờ chịu khuất phục trước kẻ thù'."
  ],
  "Lý Thường Kiệt": [
    "Ta là Lý Thường Kiệt, đại tướng quân nhà Lý. Ta đã đánh bại quân Tống xâm lược và viết bài thơ 'Nam quốc sơn hà'.",
    "Trong bài thơ 'Nam quốc sơn hà', ta viết: 'Nam quốc sơn hà Nam đế cư, Tiệt nhiên định phận tại thiên thư'.",
    "Ta đã sử dụng chiến thuật 'tiên phát chế nhân' - đánh trước để chế ngự địch.",
    "Lòng yêu nước và tinh thần bảo vệ độc lập là điều ta luôn tâm niệm."
  ],
  "Lý Công Uẩn": [
    "Ta là Lý Công Uẩn, vua Lý Thái Tổ. Ta đã sáng lập ra nhà Lý và dời đô từ Hoa Lư về Thăng Long.",
    "Việc dời đô về Thăng Long là một quyết định sáng suốt, mở ra thời kỳ phát triển rực rỡ của Đại Việt.",
    "Ta tin rằng 'Thăng Long là nơi địa linh nhân kiệt, có thể làm nơi đóng đô lâu dài'.",
    "Nhà Lý dưới sự lãnh đạo của ta đã mở ra một thời kỳ hòa bình và phát triển."
  ],
  "Trần Bình Trọng": [
    "Ta là Trần Bình Trọng, tướng quân nhà Trần. Ta đã hy sinh anh dũng trong cuộc kháng chiến chống quân Nguyên Mông.",
    "Khi bị bắt, ta đã nói: 'Ta thà làm quỷ nước Nam, chứ không thèm làm vương đất Bắc'.",
    "Lòng yêu nước và tinh thần bất khuất là điều ta luôn tâm niệm.",
    "Ta hy vọng hậu thế sẽ nhớ đến tinh thần yêu nước của ta."
  ],
  "Phùng Thị Chính": [
    "Ta là Phùng Thị Chính, nữ tướng của Hai Bà Trưng. Ta đã có công lớn trong cuộc khởi nghĩa chống lại ách đô hộ của nhà Hán.",
    "Là phụ nữ, ta đã chứng minh rằng nữ giới cũng có thể trở thành tướng quân tài ba.",
    "Ta đã cùng Hai Bà Trưng lãnh đạo quân dân đánh đuổi quân Hán xâm lược.",
    "Tinh thần nữ quyền và lòng yêu nước là điều ta luôn tâm niệm."
  ]
};

// Mock video URLs for video generation
export const MOCK_VIDEO_URLS = [
  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
];

// Mock user data
export const MOCK_USER = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
  token: "mock_token_12345"
};

// Mock login response
export const MOCK_LOGIN_RESPONSE = {
  message: "Auth successful",
  token: "mock_token_12345",
  user: MOCK_USER
};
