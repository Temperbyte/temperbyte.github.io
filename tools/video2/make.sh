#!/bin/bash
# ./make.sh v1  -> out/v1.mp4 (frames must be rendered)
set -e; cd "$(dirname "$0")"; n=$1
python3 lib/music.py frames/$n/meta.json out/$n.wav
ffmpeg -loglevel error -y -framerate 30 -i frames/$n/%05d.jpg -i out/$n.wav -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -shortest -movflags +faststart out/$n.mp4
echo built out/$n.mp4
