for file in videos/*.mp4; do
    # ffmpeg -i "$file" -vcodec libx264 -crf 28 -preset fast "videos_compress/${file##*/}"
    ffmpeg -i "$file" -an "videos_compress/${file##*/}"
done

