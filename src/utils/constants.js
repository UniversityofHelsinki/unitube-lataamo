const MAX_FILE_SIZE_LIMIT = 2.5e+10;
const MIN_FILE_SIZE_LIMIT = 2e+6;

const ROLE_ANONYMOUS = 'ROLE_ANONYMOUS';
const ROLE_KATSOMO_TUOTANTO = 'ROLE_USER_KATSOMO_TUOTANTO';
const ROLE_KATSOMO = 'ROLE_USER_KATSOMO'; // possibly deleted later

const MOODLE_ACL_INSTRUCTOR = '_Instructor';
const MOODLE_ACL_LEARNER = '_Learner';
const STATUS_PUBLISHED = 'status_published';
const STATUS_MOODLE = 'status_moodle';
const STATUS_PRIVATE = 'status_private';

const VIDEO_PROCESSING_RUNNING = 'RUNNING';
const VIDEO_PROCESSING_FAILED = 'FAILED';
const VIDEO_PROCESSING_INSTANTIATED = 'INSTANTIATED';
const VIDEO_PROCESSING_SUCCEEDED = 'SUCCEEDED';

const EMPTY_VTT_FILE_NAME = 'empty.vtt';


module.exports = {
    ROLE_ANONYMOUS,
    ROLE_KATSOMO,
    ROLE_KATSOMO_TUOTANTO,
    STATUS_PUBLISHED,
    STATUS_PRIVATE,
    STATUS_MOODLE,
    MOODLE_ACL_INSTRUCTOR,
    MOODLE_ACL_LEARNER,
    VIDEO_PROCESSING_FAILED,
    VIDEO_PROCESSING_RUNNING,
    VIDEO_PROCESSING_INSTANTIATED,
    VIDEO_PROCESSING_SUCCEEDED,
    MAX_FILE_SIZE_LIMIT,
    MIN_FILE_SIZE_LIMIT,
    EMPTY_VTT_FILE_NAME
};