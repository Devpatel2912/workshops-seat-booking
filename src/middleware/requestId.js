
import { randomUUID } from "node:crypto";

const requestId = (req, res, next) => {
  req.id = req.id || randomUUID();

  res.setHeader("X-Request-ID", req.id);

  next();
};

export default requestId;

