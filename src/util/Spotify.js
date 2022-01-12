import Searchbar from "../Components/SearchBar/SearchBar";

let userAccessToken;
const clientID = '40ea0a9ab48245e4a6896a5d0afb4838'
const redirectUri= "http://resolute-quiver.surge.sh"
const Spotify = {
    getAccessToken() {
        if(userAccessToken) {
            return userAccessToken
        }
        const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        if(userAccessTokenMatch && expiresInMatch) {
            userAccessToken = userAccessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            window.setTimeout(() => userAccessToken = '',
            expiresIn *1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken
        } else {
            const accessUrl= `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl
        }
    },

    search(term) {
        const userAccessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: {Authorization: `Bearer ${userAccessToken}`}}).then(response =>{
            return response.json()}).then(jsonResponse => {
                if(!jsonResponse.tracks){
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                })); 
        });
    },

    savePlaylist(playlistName, trackUris) {
        if(!playlistName || !trackUris.length) {
            return
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response =>
            response.json()).then(jsonResponse => {
                userId = jsonResponse.id
                return fetch(`/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                }).then(response => response.json()).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`), {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackUris})
                    }
                })
            })

        },
    }




export default Spotify