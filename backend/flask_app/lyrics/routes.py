from flask import Blueprint
from .. import lyrics_scraper
from .. import config
import requests
import json

lyrics = Blueprint("lyrics", __name__)
lastfm_key = config.LASTFM_KEY

@lyrics.route("/lyrics/<artist>/<song>", methods=["GET"])
def get_lyrics(artist, song):
    
    x = lyrics_scraper.get_lyrics(artist, song)
    print(x)
    return x


@lyrics.route("/lyrics/search/<query>", methods=["GET"])
def search_lyrics(query):
    url = f"https://ws.audioscrobbler.com/2.0/?method=track.search&track={query}&api_key={lastfm_key}&format=json&limit=6"
    user_agent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
    headers = { 'User-Agent': user_agent}
    ret = requests.get(url, headers=headers)
    return ret.json()