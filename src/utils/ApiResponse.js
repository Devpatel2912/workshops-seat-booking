
const ApiResponse = (req, data) => {
  return {
    data,
    meta: {
      request_id: req.id,
    },
  };
};

export default ApiResponse;
