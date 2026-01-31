const validate = (schema) => (req, res, next) => {
  const result = schema.parse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  Object.assign(req, result);
  next();
};

export default validate;
