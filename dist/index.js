"use strict";
/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const minimatch_1 = __importDefault(require("minimatch"));
function getConfig() {
    const config = {
        files: core.getInput("FILES", { required: false }).split("\n"),
    };
    return config;
}
exports.getConfig = getConfig;
exports.exists = (file) => {
    try {
        return fs_1.default.statSync(file).isFile();
    }
    catch (e) {
        return false;
    }
};
exports.inDistFiles = (file, dist) => {
    for (const entry of dist) {
        if (minimatch_1.default(file, entry)) {
            return true;
        }
    }
    return false;
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { files } = getConfig();
            const pkg = JSON.parse(fs_1.default.readFileSync("package.json").toString());
            for (const key of files) {
                const path = pkg[key];
                if (!path) {
                    core.warning(`${key} not found in package.json`);
                    return;
                }
                if (!exports.exists(path)) {
                    core.setFailed(`${key} does not exist`);
                    return;
                }
            }
        }
        catch (error) {
            /* istanbul ignore next */
            () => {
                // https://github.com/gotwarlost/istanbul/issues/361
                core.error(error);
                core.setFailed(error.message);
            };
        }
    });
}
exports.main = main;
main();
