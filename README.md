# lyrics-final-project

Q1 Description of your final project idea:

Currently, my project allows users to view song lyrics by searching for the song title. You can also create and save lyric "snippets" from songs, eg. your favorite lyrics, either within the app or with a form, which you can view all together.

Q2 Describe what functionality will only be available to logged-in users:

- Save favorite lyric snippets
- View saved lyric snippets

Non-logged in users can:

- Search up songs to view the lyric info described above

Q3 List and describe at least 4 forms:

- Registration _(Email, Username, Password)_
- Login _(Email, Password)_
- Manual lyric snippet saving _(Song, Artist, Content)_
- Update your account's email address _(Email)_

Q4 List and describe your routes/blueprints (don't need to list all routes/blueprints you may have--just enough for the requirement):

- lyrics/ (search/, artist/song/)
- snippets/ (get-snip/, delete-snip/, save-snip/)
- users/ (login/, etc)

Q5 Describe what will be stored/retrieved from MongoDB:

- Usernames and hashed passwords
- Saved lyric snippets for each user

Q6 Describe what Python package or API you will use and how it will affect the user experience:

- LastFM API
  - For fetching song titles and artists - displayed to the user
- BeautifulSoup
  - For scraping lyrics from AZLyrics.com - displayed to the user

**Notes:**
- Link to deployed frontend: <https://lyrics-final-project-frontend.vercel.app/login>
- (Previously: it seems that AZLyrics was blocking my web scraping from the Vercel deployment, so I've attached a video of the website working locally in case it stops working)

**Video demo link:** <https://drive.google.com/file/d/10mCRlgbIThg1-dihFnAUsmni75vKhAIm/view?usp=sharing>
