const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    // Check if token is provided

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}