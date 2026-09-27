import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        // Per-client rate limiting using IP address
        const clientKey = req.ip || req.headers["x-forwarded-for"] || "anonymous";
        const { success } = await ratelimit.limit(clientKey);
        if (success) {
            next();
        } else {
            res.status(429).json({ message: "Too many requests from this device. Please try again shortly." });
        }
    } catch (err) {
        console.error("Rate limiter error:", err.message);
        // Fail-open: don't block traffic if Redis/glitch occurs
        next();
    }
};

export default ratelimiter;