const { default: axios } = require('axios');
const httpStatus = require('http-status');
const { Youtube } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a youtube
 * @param {Object} youtubeBody
 * @returns {Promise<Youtube>}
 */
const createYoutube = async (youtubeBody) => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeBody.link}&key=${process.env.YOUTUBE_API_KEY}
  &part=snippet&part=statistics`);

  if (!res.data.items[0] || !res.data.items[0].snippet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'youtube not found');
  }
  const data = {
    link: youtubeBody.link,
    thumbnail: res.data.items[0].snippet.thumbnails.standard.url,
    title: res.data.items[0].snippet.title,
    viewCount: res.data.items[0].statistics.viewCount,
    publishedAt: res.data.items[0].snippet.publishedAt,
    likeCount: res.data.items[0].statistics.likeCount,
  };
  Youtube.create(data);
};

const youtubeSerializer = async (youtube) => {
  const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtube.link}&key=${process.env.YOUTUBE_API_KEY}
  &part=snippet&part=statistics`);

  if (!res.data.items[0] || !res.data.items[0].snippet) {
    return {
      id: '',
      createdAt: '',
      link: '',
      thumbnail: '',
      title: '',
      viewCount: '',
      publishedAt: '',
      likeCount: '',
    };
  }

  return {
    id: youtube._id,
    createdAt: youtube.createdAt,
    link: youtube.link,
    thumbnail: res.data.items[0].snippet.thumbnails.standard.url,
    title: res.data.items[0].snippet.title,
    viewCount: res.data.items[0].statistics.viewCount,
    publishedAt: res.data.items[0].snippet.publishedAt,
    likeCount: res.data.items[0].statistics.likeCount,
  };
};

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryYoutubes = async ({ limit, skip }) => {
  const youtubes = await Youtube.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
  const result = await Promise.all(youtubes.map(youtubeSerializer));

  const count = await Youtube.countDocuments();
  return {
    result,
    count,
  };
};

const queryYoutubesMainPage = async ({ limit, skip }) => {
  // 메인페이지에서 유튜브 가져오기
  const youtubes = await Youtube.find().sort({ createdAt: -1 }).limit(limit).skip(skip);

  const count = await Youtube.countDocuments();
  return {
    result: youtubes,
    count,
  };
};

/**
 * Get youtube by id
 * @param {ObjectId} id
 * @returns {Promise<Youtube>}
 */
const getYoutubeById = async (id) => Youtube.findById(id);

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateYoutbeById = async (youtubeId, updateBody) => {
  const youtube = await getYoutubeById(youtubeId);
  if (!youtube) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Youtube not found');
  }
  Object.assign(youtube, updateBody);
  await youtube.save();
  return youtube;
};

/**
 * Delete faq by id
 * @param {ObjectId} faqId
 * @returns {Promise<Faq>}
 */

const deleteYoutubeById = async (youtubeId) => {
  const youtube = await getYoutubeById(youtubeId);
  if (!youtube) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Youtube not found');
  }
  await youtube.remove();
  return youtube;
};

module.exports = {
  createYoutube,
  queryYoutubes,
  getYoutubeById,
  updateYoutbeById,
  deleteYoutubeById,
  queryYoutubesMainPage,
};
