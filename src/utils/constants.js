const MAX_FILE_SIZE_LIMIT = 2.5e+10;
const MIN_DURATION_IN_SECONDS = 1;

const ROLE_ANONYMOUS = 'ROLE_ANONYMOUS';
const ROLE_KATSOMO_TUOTANTO = 'ROLE_USER_KATSOMO_TUOTANTO';
const ROLE_KATSOMO = 'ROLE_USER_KATSOMO'; // possibly deleted later
const ROLE_USER_UNLISTED = 'ROLE_USER_UNLISTED';

const MOODLE_ACL_INSTRUCTOR = '_Instructor';
const MOODLE_ACL_LEARNER = '_Learner';
const STATUS_PUBLISHED = 'status_published';
const STATUS_MOODLE = 'status_moodle';
const STATUS_PRIVATE = 'status_private';
const STATUS_UNLISTED = 'status_unlisted';

const VIDEO_PROCESSING_RUNNING = 'RUNNING';
const VIDEO_PROCESSING_FAILED = 'FAILED';
const VIDEO_PROCESSING_INSTANTIATED = 'INSTANTIATED';
const VIDEO_PROCESSING_SUCCEEDED = 'SUCCEEDED';

const JOB_STATUS_STARTED = 'STARTED';
const JOB_STATUS_FINISHED = 'FINISHED';
const JOB_STATUS_ERROR = 'ERROR';
const JOB_STATUS_NOT_FOUND = 'NOT_FOUND';

const EMPTY_VTT_FILE_NAME = 'empty.vtt';

const ILLEGAL_CHARACTERS = '%';

const MAX_AMOUNT_OF_MESSAGES = 100;

const TRANSLATION_LANGUAGES = ['fi-FI', 'sv-SE', 'en-US'];

const TRANSLATION_LANGUAGE_FI = 'fi-FI';

const TRANSLATION_LANGUAGE_SV = 'sv-SE';

const TRANSLATION_LANGUAGE_US = 'en-US';

const TRANSLATION_MODELS = ['MS_WHISPER', 'MS_ASR'];

const TRANSLATION_MODEL_MS_WHISPER = 'MS_WHISPER';

const TRANSLATION_MODEL_MS_ASR = 'MS_ASR';

module.exports = {
    ROLE_ANONYMOUS,
    ROLE_KATSOMO,
    ROLE_KATSOMO_TUOTANTO,
    ROLE_USER_UNLISTED,
    STATUS_PUBLISHED,
    STATUS_PRIVATE,
    STATUS_MOODLE,
    STATUS_UNLISTED,
    MOODLE_ACL_INSTRUCTOR,
    MOODLE_ACL_LEARNER,
    VIDEO_PROCESSING_FAILED,
    VIDEO_PROCESSING_RUNNING,
    VIDEO_PROCESSING_INSTANTIATED,
    VIDEO_PROCESSING_SUCCEEDED,
    MAX_FILE_SIZE_LIMIT,
    MIN_DURATION_IN_SECONDS,
    EMPTY_VTT_FILE_NAME,
    ILLEGAL_CHARACTERS,
    MAX_AMOUNT_OF_MESSAGES,
    TRANSLATION_LANGUAGES,
    TRANSLATION_LANGUAGE_FI,
    TRANSLATION_LANGUAGE_SV,
    TRANSLATION_LANGUAGE_US,
    TRANSLATION_MODELS,
    TRANSLATION_MODEL_MS_WHISPER,
    TRANSLATION_MODEL_MS_ASR,
    JOB_STATUS_STARTED,
    JOB_STATUS_FINISHED,
    JOB_STATUS_NOT_FOUND,
    JOB_STATUS_ERROR
};
