import Joi from "joi";

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      message: "Invalid request data",
      details: error.details.map((d) => ({ path: d.path.join("."), message: d.message })),
    });
  }
  req.body = value;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false, allowUnknown: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ message: "Invalid URL parameters", details: error.details });
  }
  req.params = value;
  next();
};