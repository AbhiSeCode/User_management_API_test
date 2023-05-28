function successResponse({
  res,
  data = [],
  message = "Successful",
  status = 200,
}) {
  res.status(status).send({ status: 1, message, data });
}

function errorResponse({ res, error, status = 400 }) {
  switch (error.name) {
    case "ExpressValidationError":
      res
        .status(status)
        .send({ status: 0, message: error.message, data: error.data });
      break;
    default:
      res.status(status).send({ status: 0, message: error.message, data: {} });
  }
}

module.exports = { successResponse, errorResponse };
