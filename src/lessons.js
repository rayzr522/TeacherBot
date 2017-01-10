const path = require('path');
const read = require('fs-readdir-recursive');
const {log} = require('./debug');

class LessonManager {
    constructor() {
        this._lessons = [];
    }

    loadLessons(folder) {
        let self = this;
        read(folder, file => file.startsWith('lesson-') && file.endsWith('.json')).forEach(file => {
            var lesson = require(path.resolve(folder, file));
            if (typeof lesson !== 'object') log('Invalid lesson file!');
            self._lessons.push(lesson);
        });
    }

    getLessons() {
        return this._lessons;
    }
}

module.exports = LessonManager;