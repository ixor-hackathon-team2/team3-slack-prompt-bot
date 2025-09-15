"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAndBuildObjects = void 0;
const filterAndBuildObjects = (data) => {
    console.log(data);
    return {
        prompt: data.text,
        channel: data.channel,
    };
};
exports.filterAndBuildObjects = filterAndBuildObjects;
