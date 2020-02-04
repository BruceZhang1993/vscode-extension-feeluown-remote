from fuo_xiami import provider as xiami_provider


def get_fav_songs():
    user_xiami = xiami_provider._user
    for song in user_xiami.fav_songs:
        print('{} - {}$$$fuo://xiami/songs/{}'.format(song.title, song.artists_name, song.identifier))


get_fav_songs()
