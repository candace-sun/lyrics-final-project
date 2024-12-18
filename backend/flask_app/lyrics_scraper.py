from urllib.request import urlopen
from bs4 import BeautifulSoup
from time import sleep
import csv
import json
import re

# artist for which the lyrics need to be written
artist = "aespa"
song = "whiplash"

# url to scrape the lyrics from
base_url = "https://www.azlyrics.com/lyrics/{}/{}.html"

# delay after each execution of call for not exceeding the requests count and also not to overburden the server
delay = 10

def get_lyrics(artist, song):
    numbers_in_brackets_removed = re.sub(r'\(.*\)',"",song)
    processed_song = re.sub(r'\W+', '', numbers_in_brackets_removed).lower()
    processed_song = ''.join(e for e in processed_song if e.isalnum())
    artist = artist.replace(" ", "").lower()
    final_url = base_url.format(artist,processed_song)

    try:
        html_page = urlopen(final_url)
        soup = BeautifulSoup(html_page, 'html.parser')

        html_pointer = soup.find('div', attrs={'class':'ringtone'})
        song_name = html_pointer.find_next('b').contents[0].strip()
        lyrics = html_pointer.find_next('div').text.strip()
        
        return lyrics
        
    except Exception as e:
        return False
        
    # finally:
    #     sleep(delay)