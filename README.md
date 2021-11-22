# jpoehnelt/verify-npm-files-actions

![Build](https://github.com/jpoehnelt/verify-npm-files-actions/workflows/Build/badge.svg)
![Release](https://github.com/jpoehnelt/verify-npm-files-actions/workflows/Release/badge.svg)
[![codecov](https://codecov.io/gh/jpoehnelt/verify-npm-files-actions/branch/master/graph/badge.svg)](https://codecov.io/gh/jpoehnelt/verify-npm-files-actions)
![GitHub contributors](https://img.shields.io/github/contributors/jpoehnelt/verify-npm-files-actions?color=green)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Github Action that verifies all files referenced by the package.json file are present.

## Inputs

### `keys`

New line deliminated list of files to check.

```yaml
files: |
  types
  main
  module
  ...
```

## Usage

```yaml
run: npm run build
uses: jpoehnelt/verify-npm-files-actions@v1.0.0
  with:
    FILES: |
      types
      main
      module    
```
