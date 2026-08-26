import admin from 'firebase-admin';

/**
 * Authentication middleware that verifies Firebase Auth ID tokens.
 * Extracts the token from the Authorization header (Bearer <token>).
 * Attaches the authenticated user information to req.user.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      detail: 'Unauthorized: Missing or invalid Authorization header. Expected Bearer token.',
    });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();

  if (!token) {
    return res.status(401).json({
      detail: 'Unauthorized: Empty token provided.',
    });
  }

  try {
    // Attempt standard Firebase ID token verification
    if (admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.display_name || '',
          ...decodedToken,
        };
        return next();
      } catch (verifyErr) {
        // If Firebase verifyIdToken throws (e.g. Invalid certificate/unconfigured project in mock dev),
        // check if token is a JSON/base64 payload or test token in development
        if (process.env.NODE_ENV !== 'production' && token.startsWith('test-uid-')) {
          req.user = {
            uid: token,
            email: `${token}@test.local`,
          };
          return next();
        }
        
        console.error('Firebase Auth verification failed:', verifyErr.message);
        return res.status(401).json({
          detail: `Unauthorized: Invalid or expired authentication token (${verifyErr.message})`,
        });
      }
    } else {
      return res.status(500).json({
        detail: 'Authentication service not initialized on server.',
      });
    }
  } catch (err) {
    console.error('Auth Middleware Exception:', err);
    return res.status(401).json({
      detail: 'Unauthorized: Failed to authenticate request.',
    });
  }
};
