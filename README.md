# reins
cron-oriented dependency updater

This package will check for any outdated dependencies for a given repository and create pull requests for them.

## Installation
```
npm install -g @team-griffin/reins
```

## Usage
```
reins --gh-token="123456" --org="team-griffin" --repo="reins"
```

## parameters
| parameter | example                               | default                  | description |
|-----------|---------------------------------------|--------------------------|-------------|
| org*      | `--org="team-griffin"`                |                          |             |
| repo*     | `--repo="reins"`                      |                          |             |
| gh-token* | `--gh-token="123-456-789"`            |                          | your OAuth token used to authenticate write actions on the repo. You can also set a GH_TOKEN environment variable |
| token     | `--token="123-456-78"`                |                          | an alias for gh-token |
| test      | `--test="yarn lint && yarn test"`     |                          | a test command to run. A PR will only be created for a minor change if the test fails. If no test is provided, PRs will be created for every change |
| tmp-dir   | `--tmp-dir="./tmp"`                   | `%temp%`                 | the location to store a temporary copy of the repo |
| master    | `--master="some-branch"`              | `master`                 | the base branch on which to fork all PRs from |
| gh-api    | `--gh-api="https://some-api-url.net"` | `https://api.github.com` | The github api url. You will need to specify this if you are using an enterprise github repo. |
| gh-url    | `--gh-url="some-github-url.com"`      | `https://github.com"`    | The base github url, you can also set the GH_URL environment variable. If the url contains a `<token>` it will be replaced with the `gh-token` value. |
| level     | `--level=1`                           | `4`                      | The log level, this  can be a value from `0` (debug) to `4` (errors) |
| verbose   | `--verbose`                           |                          | Shorthand for writing `--level=1` |

## Logic
There is logic for minor and major dependency changes:
### Minor
- If there is a `--test` command, it will only create a pull request if the test fails
- If there is no `--test` command, it will create a pull request regardless.  
This allows you to audit your applications and libraries to different extents. i.e. a library does not need to re-publish for minor changes, whereas an application does.

### Major
- A pull request is created whether or not there is a `--test` command, as this is considered a breaking change and shosuld be manually checked before updating.

## Environment variables
- GH_TOKEN
- GH_URL
