import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlayListById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from '../controllers/playlist.controller.js';
const router=Router();

router.use(verifyJWT);

router.route('/create-playlist').post(createPlaylist);
router.route('/get-playlists').post(getUserPlaylists);
router.route('/get-playlistById/:playListId').get(getPlayListById);
router.route('/add-video/:playlistId/:videoId').get(addVideoToPlaylist);
router.route('/remove-video/:playlistId/:videoId').get(removeVideoFromPlaylist);
router.route('/delete-playlist/:playlistId').delete(deletePlaylist);
router.route('/update-playlist/:playlistId').post(updatePlaylist);    


export default router;