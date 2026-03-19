#!/usr/bin/env python3
import sys
import json

video_id = sys.argv[1]
langs = sys.argv[2].split(',') if len(sys.argv) > 2 else ['zh-Hans', 'zh-Hant', 'zh', 'en']

try:
    from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
    api = YouTubeTranscriptApi()
    
    transcript = None
    # Try preferred languages first
    for lang in langs:
        try:
            t = api.fetch(video_id, languages=[lang])
            transcript = ' '.join([s.text for s in t])
            break
        except Exception:
            continue
    
    # Fallback: try any available
    if not transcript:
        t = api.fetch(video_id)
        transcript = ' '.join([s.text for s in t])
    
    print(json.dumps({'transcript': transcript}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
