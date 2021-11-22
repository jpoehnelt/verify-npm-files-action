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
  keys: string[];
}

export function getConfig(): Config {
  const config = {
    keys: core.getInput("KEYS", { required: false }).split("\n"),
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

export const inFilesArray = (file: string, files: string[]): boolean => {
  for (const entry of files) {
    if (minimatch(file, entry)) {
      return true;
    }
  }
  return false;
};

export async function main(): Promise<void> {
  try {
    const { keys } = getConfig();
    const pkg = JSON.parse(fs.readFileSync("package.json").toString());

    for (const key of keys) {
      const keyPath = pkg[key];

      if (!keyPath) {
        core.warning(`key: \`${key}\` not found in package.json`);
        return;
      }

      if (pkg.files && !inFilesArray(keyPath, pkg.files)) {
        core.setFailed(
          `key: \`${key}\` referencing ${keyPath} is not matched in ${pkg.files}`
        );
        return;
      }

      if (!exists(keyPath)) {
        core.setFailed(`key: \`${key}\` referencing ${keyPath} does not exist`);
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
