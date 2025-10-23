import TranHungDaoVideo from './tran_hung_dao.mp4';

export const introductionVideos = {
  'TranHungDao': TranHungDaoVideo,
};

export const getIntroductionVideo = (characterName) => {
  return introductionVideos[characterName] || null;
};

export const hasIntroductionVideo = (characterName) => {
  return characterName in introductionVideos;
};

export default introductionVideos;
