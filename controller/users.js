import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Driver from "../models/Drivers.js";
import Dealer from "../models/Dealers.js";

export const signin = async (req, res) => {
  const { email, password, isDealer } = req.body;

  try {
    const existingUser = isDealer
      ? await Dealer.findOne({ "authData.email": email })
      : await Driver.findOne({ "authData.email": email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.authData?.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, _id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ data: {result: existingUser, token}, success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const signup = async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    natureOfMaterial,
    mobileNumber,
    weightOfMaterial,
    quantity,
    location,
    isDealer,
    age,
    truckNumber,
    truckCapacity,
    transporterName,
    drivingExperience,
    interestedRoutes,
  } = req.body;

  try {
    const existingUser = isDealer
      ? await Dealer.findOne({ "authData.email": email })
      : await Driver.findOne({ "authData.email": email });

    if (existingUser) res.status(400).json({ message: "User already exists" });

    if (password != confirmPassword)
      res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    let userObject = {
      name: `${firstName} ${lastName}`,
      authData: { email, password: hashedPassword },
      mobileNumber,
    };
    if (isDealer) {
      userObject = {
        ...userObject,
        natureOfMaterial,
        weightOfMaterial,
        quantity,
        location,
      };
    } else {
      userObject = {
        ...userObject,
        age,
        truckNumber,
        truckCapacity,
        transporterName,
        drivingExperience,
        interestedRoutes,
      };
    }

    const result = isDealer
      ? await Dealer.create(userObject)
      : await Driver.create(userObject);

    const token = jwt.sign(
      { email: result.email, _id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ data: {result, token}, success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const getProfile = async (req, res) => {
    res.send(req.user)
}

export const bookDriver = async (req, res) => {
    const { dealerId, driverId } = req.body
    try{
      await Driver.findByIdAndUpdate(driverId, {$push: {dealers: dealerId}})
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getDrivers = async (req, res) => {
    const { location: {state, city}, totalWeight } = req.body
    try{
      const drivers = await Driver.find({
        $or: [
          {
            interestedRoutes: {
              $elemMatch: {
                toState: state,
                toCity: city
              }
            }
          },
          {
            interestedRoutes: {
              $elemMatch: {
                fromState: state,
                fromCity: city
              }
            }
          }
        ],
        truckCapacity: {$gte: +totalWeight}
      });

      res.status(200).json({ data: drivers, success: true });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getDriversByRoute = async (req, res) => {
  const { fromState, fromCity, toState, toCity, totalWeight } = req.body
  try{
    const drivers = await Driver.find({
      $in: [
        {
          interestedRoutes: {
            $elemMatch: {
              fromState,
              fromCity,
              toState,
              toCity
            }
          }
        },
      ],
      truckCapacity: {$gte: +totalWeight}
    });

    res.status(200).json({ data: drivers, success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
}

export const getDealers = async (req, res) => {
    // in db driver only has id of the dealers
    // with this endpoint driver will get the details of dealers who have contacted him
    const { isDealer } = req.body;
    try{
      if(isDealer) {
        return res.status(400).json({ message: "You are not authorized to access this route" });
      }
      const dealerIds = req.user?.dealers;
      const dealers = await Dealer.find({_id: {$in: dealerIds}});

      res.status(200).json({ data: dealers, success: true });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
    }
}
