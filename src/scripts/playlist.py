from fuo_netease import provider as netease_provider
from fuo_xiami import provider as xiami_provider
from fuocore.models import GeneratorProxy


def get_all_playlists():
    collectionTypes = {
        '1': 'song',
        '2': 'album',
        '4': 'artist',
        '8': 'mixed'
    }
    playlists = {}
    user_netease = netease_provider._user
    user_xiami = xiami_provider._user
    for col in app.coll_mgr.scan():
        print('collection$$${}$$${}$$${}'.format(collectionTypes[str(col.type.value)], col.name, col.fpath))
    if user_netease and user_netease.playlists:
        for playlist in user_netease.playlists:
            print('netease$$${}$$${}$$${}'.format(user_netease.name, playlist.name, playlist))
        for playlist in user_netease.fav_playlists:
            print('netease$$${}$$${}$$${}'.format(user_netease.name, playlist.name, playlist))
    if user_xiami and user_xiami.playlists:
        print('xiami$$${}$$${}$$${}'.format(user_xiami.name, '我的收藏', ''))
        for playlist in user_xiami.playlists:
            print('xiami$$${}$$${}$$${}'.format(user_xiami.name, playlist.name, playlist))
        for playlist in user_xiami.fav_playlists:
            print('xiami$$${}$$${}$$${}'.format(user_xiami.name, playlist.name, playlist))


try:
    get_all_playlists()
except:
    pass
