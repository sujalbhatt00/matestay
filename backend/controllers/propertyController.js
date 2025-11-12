import Property from "../models/Property.js";
import User from "../models/User.js";

// --- Create Property ---
export const createProperty = async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      lister: req.user.id, // Associate the property with the logged-in user
    });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Backend: Error creating property:", error);
    res.status(500).json({ message: "Error creating property", error: error.message });
  }
};

// --- NEW FUNCTION TO GET FEATURED PROPERTIES ---
export const getFeaturedProperties = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4; // Default to 4 if no limit is specified
    const properties = await Property.find({ isAvailable: true })
      .sort({ createdAt: -1 }) // Get the most recent ones
      .limit(limit)
      .populate("lister", "name profilePic");
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend: Error fetching featured properties:", error);
    res.status(500).json({ message: "Error fetching featured properties", error: error.message });
  }
};

// --- Get Property By ID ---
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "lister",
      "name email profilePic"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Backend: Error fetching property by ID:", error);
    res.status(500).json({ message: "Error fetching property", error: error.message });
  }
};

// --- Search Properties ---
export const searchProperties = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, bedrooms } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" }; // Case-insensitive search
    }
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = Number(minPrice);
      if (maxPrice) query.rent.$lte = Number(maxPrice);
    }
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    const properties = await Property.find(query).populate("lister", "name profilePic");
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend: Error searching properties:", error);
    res.status(500).json({ message: "Error searching properties", error: error.message });
  }
};

// --- Update Property ---
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the user is the owner of the property
    if (property.lister.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Backend: Error updating property:", error);
    res.status(500).json({ message: "Error updating property", error: error.message });
  }
};

// --- Delete Property ---
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.lister.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await property.deleteOne(); // Use deleteOne() instead of remove()
    res.status(200).json({ message: "Property removed" });
  } catch (error) {
    console.error("Backend: Error deleting property:", error);
    res.status(500).json({ message: "Error deleting property", error: error.message });
  }
};

// --- Get User's Properties ---
export const getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ lister: req.user.id });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend: Error fetching user properties:", error);
    res.status(500).json({ message: "Error fetching user properties", error: error.message });
  }
};