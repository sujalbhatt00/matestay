import Property from "../models/Property.js";
import User from "../models/User.js";

// --- Create Property ---
export const createProperty = async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      lister: req.user.id,
    });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Backend: Error creating property:", error);
    res.status(500).json({ message: "Error creating property", error: error.message });
  }
};

// --- Get Featured Properties ---
export const getFeaturedProperties = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const properties = await Property.find({ isAvailable: true })
      .sort({ createdAt: -1 })
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

// --- Search Properties --- ✅ KEEP ONLY THIS ONE
export const searchProperties = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, bedrooms } = req.query;

    const query = { isAvailable: true };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
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
      if (bedrooms === '4') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    const properties = await Property.find(query)
      .populate('lister', 'name email profilePic')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Update Property ---
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

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

    await property.deleteOne();
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

// --- Get Property Stats ---
export const getPropertyStats = async (req, res) => {
  try {
    const totalListings = await Property.countDocuments({ isAvailable: true });
    const totalUsers = await User.countDocuments({ profileSetupComplete: true });
    
    res.status(200).json({
      totalListings,
      totalUsers,
    });
  } catch (error) {
    console.error("Backend: Error fetching property stats:", error);
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};