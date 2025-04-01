const Router = require('koa-router');
const router = new Router({ prefix: '/sse' });
const sseController = require('../controllers/sseController');

// SSE logs endpoint
router.get('/logs', sseController.setupSSEConnection);

// API endpoint to push a log message (for testing/admin)
router.post('/push-log', sseController.pushLogMessage);

// Get all connected SSE clients
router.get('/clients', sseController.getConnectedClients);

// Toggle log message pushing (enable/disable)
router.post('/toggle-pushing', sseController.toggleMessagePushing);

// Get current pushing status
router.get('/pushing-status', sseController.getPushingStatus);

// Terminate SSE service
router.post('/terminate', sseController.terminateService);

// Restart SSE service
router.post('/restart', sseController.restartService);

// Get termination status
router.get('/termination-status', sseController.getTerminationStatus);

module.exports = router; 