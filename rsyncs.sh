cp .gitignore rsync-exclude.txt
rsync -avz -e "ssh" --include='.env' --exclude-from='rsync-exclude.txt' <PATH>/weafy root@<SERVER_ADDRESS>:/root/weafy
