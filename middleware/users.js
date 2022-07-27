import jwt from "jsonwebtoken";
import Dealer from "../models/Dealers.js";
import Driver from "../models/Drivers.js";

const auth = async (req, res, next) => {
  const { isDealer } = req.body;
  try {
    //console.log(req.header("Authorization"))
    const token = req.header("Authorization").replace("Bearer ", "");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = isDealer
      ? await Dealer.findOne({ _id: decoded._id })
      : await Driver.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

export default auth;
