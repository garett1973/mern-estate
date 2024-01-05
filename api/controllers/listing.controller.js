import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      error: "Listing not found",
    });
  }

  if (listing.userRef !== req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User not authorized",
    });
  }

  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: listing,
      message: "Listing deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      error: "Listing not found",
    });
  }

  if (listing.userRef !== req.user.id) {
    return res.status(401).json({
      success: false,
      error: "User not authorized",
    });
  }

  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      data: listing,
      message: "Listing updated",
    });
  } catch (error) {
    next(error);
  }
};
