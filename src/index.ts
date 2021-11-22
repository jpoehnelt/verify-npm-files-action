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

import * as core from "@actions/core";
import fs from "fs";
import minimatch from "minimatch";

export interface Config {
  files: string[];
}

export function getConfig(): Config {
  const config = {
    files: core.getInput("FILES", { required: false }).split("\n"),
  };

  return config;
}

export const exists = (file: string): boolean => {
  try {
    return fs.statSync(file).isFile();
  } catch (e) {
    return false;
  }
};

export const inDistFiles = (file: string, dist: string[]): boolean => {
  for (const entry of dist) {
    if (minimatch(file, entry)) {
      return true;
    }
  }
  return false;
};

export async function main(): Promise<void> {
  try {
    const { files } = getConfig();
    const pkg = JSON.parse(fs.readFileSync("package.json").toString());

    for (const key of files) {
      const path = pkg[key];

      if (!path) {
        core.warning(`${key} not found in package.json`);
        return;
      }

      if (!exists(path)) {
        core.setFailed(`${key} does not exist`);
        return;
      }
    }
  } catch (error) {
    /* istanbul ignore next */
    () => {
      // https://github.com/gotwarlost/istanbul/issues/361
      core.error(error as Error);
      core.setFailed((error as Error).message);
    };
  }
}

main();
