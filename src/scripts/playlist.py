from fuo_netease import provider as netease_provider
from fuo_xiami import provider as xiami_provider


def get_all_playlists():
    playlists = {}
    user_netease = netease_provider._user
    user_xiami = xiami_provider._user
    if user_netease and user_netease.playlists:
        for playlist in user_netease.playlists:
            print('netease$$${}$$${}$$${}'.format(user_netease.name, playlist.name, playlist))
    if user_xiami and user_xiami.playlists:
        for playlist in user_xiami.playlists:
            print('xiami$$${}$$${}$$${}'.format(user_xiami.name, playlist.name, playlist))


get_all_playlists()
