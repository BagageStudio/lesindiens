export const state = () => ({
    tracks: null
});

export const getters = {
    getTracks: state => {
        return state.tracks
            ? state.tracks
                  .reduce((acc, track) => {
                      const trk = {
                          uri: track.track.uri,
                          url: track.track.preview_url,
                          name: track.track.name,
                          img: track.track.album.images[0],
                          artist: track.track.artists[0].name
                      };
                      if (trk.url) {
                          acc.push(trk);
                      } else {
                          //   console.log('NO PREVIEW URL:', trk.artist, '-', trk.name);
                      }
                      return acc;
                  }, [])
                  .sort(() => Math.random() - 0.5)
            : null;
    }
};

export const mutations = {
    setTracks(state, tracks) {
        state.tracks = tracks;
    }
};
