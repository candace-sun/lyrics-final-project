from flask import Blueprint
from .. import lyrics_scraper
from .. import config
import requests
import json

lyrics = Blueprint("lyrics", __name__)
lastfm_key = config.LASTFM_KEY

@lyrics.route("/lyrics/<artist>/<song>", methods=["GET"])
def get_lyrics(artist, song):
    
    return lyrics_scraper.get_lyrics(artist, song)


@lyrics.route("/lyrics/search/<query>", methods=["GET"])
def search_lyrics(query):
    url = f"https://ws.audioscrobbler.com/2.0/?method=track.search&track={query}&api_key={lastfm_key}&format=json&limit=6"
    ret = requests.get(url)
    return ret.json()