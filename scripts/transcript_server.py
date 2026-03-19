#!/usr/bin/env python3
"""Standalone transcript API server"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

class TranscriptHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress logs

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != '/transcript':
            self.send_response(404)
            self.end_headers()
            return

        params = urllib.parse.parse_qs(parsed.query)
        video_id = params.get('videoId', [None])[0]
        if not video_id:
            self._json(400, {'error': 'missing videoId'})
            return

        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            api = YouTubeTranscriptApi()
            langs = ['zh-Hans', 'zh-Hant', 'zh', 'en']
            transcript = None
            for lang in langs:
                try:
                    t = api.fetch(video_id, languages=[lang])
                    transcript = ' '.join([s.text for s in t])
                    break
                except Exception:
                    continue
            if not transcript:
                t = api.fetch(video_id)
                transcript = ' '.join([s.text for s in t])
            self._json(200, {'transcript': transcript})
        except Exception as e:
            self._json(500, {'error': str(e)})

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 3001), TranscriptHandler)
    print('Transcript API running on port 3001')
    server.serve_forever()
