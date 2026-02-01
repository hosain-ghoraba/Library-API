const validate = (schema) => (req, res, next) => {
  const result = schema.parse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  req.validated = result;
  next();
};

export default validate;
