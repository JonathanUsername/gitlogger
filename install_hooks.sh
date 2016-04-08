
if [[ -e ~/.git_template ]]; then
  echo "Ooops, looks like you already have a template at $HOME/.git_template. Delete it first to use this."
  exit 1;
fi

mkdir -p ~/.git_template/hooks

git config --global init.templatedir '~/.git_template'

cat <<EOF > ~/.git_template/hooks/post-commit

#!/bin/bash

gitloggerUrl="http://178.62.83.202:8000"

branchName="$(git symbolic-ref --quiet --short HEAD 2> /dev/null || \
  git rev-parse --short HEAD 2> /dev/null || \
  echo unknown)"

repoName="$(basename $(git rev-parse --show-toplevel))"

commitMsg="$(printf "$(git log -1 --pretty=%B)")"

user="$(git config user.email)"

curl --data "repo=$repoName&branch=$branchName&user=$user&msg=$commitMsg" "$gitloggerUrl/commit" &

EOF

cat <<EOF > ~/.git_template/hooks/post-checkout

#!/bin/bash

gitloggerUrl="http://178.62.83.202:8000"

branchName="$(git symbolic-ref --quiet --short HEAD 2> /dev/null || \
  git rev-parse --short HEAD 2> /dev/null || \
  echo unknown)"

repoName="$(basename $(git rev-parse --show-toplevel))"

user="$(git config user.email)"

curl --data "repo=$repoName&branch=$branchName&user=$user" "$gitloggerUrl/checkout" &

EOF

echo 'Hooks template installed. Please git init in the repo you wish to track. All new and subsequent git clone/inits will report data to my server.'


