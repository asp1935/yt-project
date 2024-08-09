import {Router} from 'express';
import {verifyJWT} from '../middleware/auth.middleware.js';
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubsription } from '../controllers/subscription.controller.js';

const router=Router();

router.use(verifyJWT);

router.route('/toggle-subscribe/:channelId').get(toggleSubsription);
router.route('/get-channel-subscribers/:channelId').get(getUserChannelSubscribers);
router.route('/get-subscribed-channel/').get(getSubscribedChannels);

export default router;