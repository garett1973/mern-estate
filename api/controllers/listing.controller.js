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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "Listing not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
      message: "Listing retrieved",
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === "false" || offer === undefined) {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if (furnished === "false" || furnished === undefined) {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === "false" || parking === undefined) {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json({
      success: true,
      data: listings,
      message: "Listings retrieved",
    });
  } catch (error) {
    next(error);
  }
};
